// src/composables/useZplParser.js
import { ref } from 'vue'
import { useLabelDesignerStore } from 'src/stores/labelDesignerStore'

export function useZplParser() {
  const store = useLabelDesignerStore()
  const parseError = ref(null)
  const parseWarnings = ref([])

  // Tokenize ZPL into individual commands
  function tokenize(zpl) {
    const tokens = []
    const regex = /[\^~]([A-Za-z][A-Za-z0-9]?)([^^\~]*)/g
    let match

    while ((match = regex.exec(zpl)) !== null) {
      tokens.push({
        command: match[1].toUpperCase(),
        params: match[2].trim()
      })
    }

    return tokens
  }

  // Parse comma-separated parameters with defaults
  function parseParams(paramStr, defaults = []) {
    if (!paramStr) return [...defaults]

    const parts = paramStr.split(',')
    return defaults.map((def, i) => {
      const val = parts[i]?.trim()
      if (val === undefined || val === '') return def
      const num = Number(val)
      return isNaN(num) ? val : num
    })
  }

  // Parse ^A command (font) - handles both ^Afo,h,w and ^A0o,h,w
  function parseFont(params) {
    if (!params) return null

    // Match font identifier, optional rotation, and dimensions
    // ^A0N,30,30 or ^A0,30,30 or ^AN,30,30
    const match = params.match(/^([A-Z0-9])([NRIB])?[,]?(\d*)(?:,(\d*))?/i)
    if (!match) return null

    const font = match[1].toUpperCase()
    const rotation = match[2]?.toUpperCase() || 'N'
    const height = match[3] ? parseInt(match[3]) : 30
    const width = match[4] ? parseInt(match[4]) : height

    return { font, rotation, fontHeight: height, fontWidth: width }
  }

  // Parse ^CF command (change default font)
  function parseDefaultFont(params) {
    if (!params) return null

    const match = params.match(/^([A-Z0-9])(?:,(\d+))?(?:,(\d+))?/i)
    if (!match) return null

    const font = match[1].toUpperCase()
    const height = match[2] ? parseInt(match[2]) : 30
    const width = match[3] ? parseInt(match[3]) : height

    return { font, rotation: 'N', fontHeight: height, fontWidth: width }
  }

  // Parse ^FB command (field block)
  function parseFieldBlock(params) {
    const [width, maxLines, lineSpacing, justification] =
      parseParams(params, [0, 1, 0, 'L'])

    return {
      blockWidth: width,
      maxLines,
      lineSpacing,
      justification: typeof justification === 'string' ? justification.toUpperCase() : 'L'
    }
  }

  // Parse ^GB command (graphic box)
  function parseGraphicBox(params) {
    const [width, height, thickness, color, rounding] =
      parseParams(params, [100, 50, 2, 'B', 0])

    return {
      boxWidth: width,
      boxHeight: height,
      borderThickness: thickness
    }
  }

  // Parse ^FO command (field origin)
  function parseFieldOrigin(params) {
    const [x, y] = parseParams(params, [0, 0])
    return { x, y }
  }

  // Extract field data content (remove trailing ^FS if present)
  function extractFieldData(params) {
    return params.replace(/\^FS$/i, '').trim()
  }

  // Create a new element with current defaults
  function createNewElement(id, defaults) {
    return {
      id,
      x: 0,
      y: 0,
      rotation: defaults.rotation,
      blockWidth: 0,
      maxLines: 1,
      justification: 'L',
      contentType: 'text',
      content: '',
      fontHeight: defaults.fontHeight,
      fontWidth: defaults.fontWidth,
      boxWidth: 100,
      boxHeight: 50,
      borderThickness: 2
    }
  }

  // Main parse function
  function parseZpl(zpl) {
    parseError.value = null
    parseWarnings.value = []

    if (!zpl || typeof zpl !== 'string') {
      parseError.value = 'Invalid ZPL input'
      return { elements: [], canvasRotation: 0 }
    }

    // Normalize: remove newlines and extra spaces
    const normalized = zpl.replace(/[\r\n]+/g, '').replace(/\s+/g, ' ')
    const tokens = tokenize(normalized)
    const elements = []

    let nextId = Date.now()
    let canvasRotation = 0

    // Default font state (can be changed by ^CF)
    let defaultFont = {
      font: '0',
      rotation: 'N',
      fontHeight: 30,
      fontWidth: 30
    }

    // Pending font state (set by ^A before ^FO)
    let pendingFont = null

    // Current element being built
    let current = null

    for (let i = 0; i < tokens.length; i++) {
      const { command, params } = tokens[i]

      switch (command) {
        case 'XA':
          // Start of label - reset state
          current = null
          pendingFont = null
          break

        case 'XZ':
          // End of label - finalize pending element
          if (current) {
            elements.push(current)
            current = null
          }
          break

        case 'PO':
          // Print orientation
          const orientationMap = { 'N': 0, 'R': 90, 'I': 180, 'B': 270 }
          canvasRotation = orientationMap[params.toUpperCase()] || 0
          break

        case 'CF':
          // Change default font - applies to subsequent elements without ^A
          const cfData = parseDefaultFont(params)
          if (cfData) {
            defaultFont = { ...defaultFont, ...cfData }
          }
          break

        case 'A0':
        case 'A':
          // Font command
          const fontParams = command === 'A0' ? '0' + params : params
          const fontData = parseFont(fontParams)

          if (fontData) {
            if (current) {
              // Apply to current element (^FO came first)
              current.rotation = fontData.rotation
              current.fontHeight = fontData.fontHeight
              current.fontWidth = fontData.fontWidth
            } else {
              // Store as pending (^A came before ^FO)
              pendingFont = fontData
            }
          }
          break

        case 'FO':
          // Field Origin - starts a new element
          if (current) {
            elements.push(current)
          }

          const origin = parseFieldOrigin(params)

          // Create element with pending font or defaults
          const fontToUse = pendingFont || defaultFont
          current = createNewElement(nextId++, fontToUse)
          current.x = origin.x
          current.y = origin.y

          // Clear pending font
          pendingFont = null
          break

        case 'FW':
          // Field rotation
          if (params && current) {
            current.rotation = params.charAt(0).toUpperCase()
          }
          break

        case 'FB':
          // Field Block
          if (current) {
            const fbData = parseFieldBlock(params)
            current.blockWidth = fbData.blockWidth
            current.maxLines = fbData.maxLines
            current.justification = fbData.justification
          }
          break

        case 'FD':
          // Field Data - marks element as text type
          if (current) {
            current.content = extractFieldData(params)
            current.contentType = 'text'
          }
          break

        case 'GB':
          // Graphic Box
          if (current) {
            const gbData = parseGraphicBox(params)
            current.contentType = 'box'
            current.boxWidth = gbData.boxWidth
            current.boxHeight = gbData.boxHeight
            current.borderThickness = gbData.borderThickness
          }
          break

        case 'BC':
          // Code 128 Barcode
          if (current) {
            current.contentType = 'barcode'
          }
          break

        case 'FS':
          // Field Separator - element complete
          if (current) {
            elements.push(current)
            current = null
          }
          break

        default:
          // Unknown command - log warning but continue
          if (!['LH', 'LL', 'PW', 'CI', 'BY'].includes(command)) {
            parseWarnings.value.push(`Unsupported command: ^${command}`)
          }
          break
      }
    }

    // Handle any remaining element
    if (current) {
      elements.push(current)
    }

    return { elements, canvasRotation }
  }

  // Import ZPL into the store
  function importZpl(zpl, options = {}) {
    const { clearExisting = true } = options

    try {
      const result = parseZpl(zpl)

      if (parseError.value) {
        return { success: false, error: parseError.value }
      }

      if (clearExisting) {
        store.clearAll()
      }

      if (result.canvasRotation !== undefined) {
        store.canvasRotation = result.canvasRotation
      }

      result.elements.forEach(element => {
        store.elements.push(element)
      })

      return {
        success: true,
        elementCount: result.elements.length,
        warnings: parseWarnings.value
      }
    } catch (err) {
      parseError.value = err.message
      return { success: false, error: err.message }
    }
  }

  return {
    parseZpl,
    importZpl,
    parseError,
    parseWarnings
  }
}
