
import { ref, computed } from 'vue'
import { useLabelDesignerStore } from 'src/stores/labelDesignerStore'

export function useZplOutput() {
  const store = useLabelDesignerStore()
  const generatedZpl = ref('')

  const zplCode = computed(() => {
    const elements = store.elements
    const canvasRotation = store.canvasRotation

    if (elements.length === 0) {
      return '^XA\n^XZ' // Empty label
    }

    let zpl = '^XA' // Start of label format

    // Add canvas rotation if needed don't think this is needed.
    if (canvasRotation !== 0) {
      zpl += `\n^PO${canvasRotation === 90 ? 'N' : canvasRotation === 180 ? 'I' : canvasRotation === 270 ? 'R' : 'N'}`
    }

    // Process each element
    elements.forEach(element => {
      // Field Origin
      zpl += '\n'
      zpl += `^FO${element.x},${element.y}`

      // Field rotation if specified
      // if (element.rotation && element.rotation !== 'N') {
      //   zpl += '\n'
      //   zpl += `^FW${element.rotation}`
      // }

      // Field Block if width is specified
      if (element.blockWidth > 0) {
        zpl += `^FB${element.blockWidth},${element.maxLines},0,${element.justification}`
      }

      // Content based on type
      if (element.contentType === 'text') {
        // Add font scaling
        zpl += '\n'
        zpl += `^A0${element.rotation},${element.fontHeight},${element.fontWidth}`
        // Add field data
        zpl += '\n'
        zpl += `^FD${element.content}^FS`
      } else if (element.contentType === 'barcode') {
        // Basic Code 128 barcode
        zpl += '\n'
        zpl += `^BCN,100,Y,N,N`
        zpl += '\n'
        zpl += `^FD${element.content}^FS`
      } else if (element.contentType === 'box') {
        // Graphic Box
        zpl += '\n'
        zpl += `^GB${element.boxWidth},${element.boxHeight},${element.borderThickness}^FS`
      }
    })

    zpl += '\n^XZ' // End of label format
    return zpl
  })

  function generateZpl() {
    generatedZpl.value = zplCode.value
    return generatedZpl.value
  }

  function copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(zplCode.value)
    }
  }

  function downloadZpl() {
    const blob = new Blob([zplCode.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'label.zpl'
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    generatedZpl,
    zplCode,
    generateZpl,
    copyToClipboard,
    downloadZpl
  }
}
