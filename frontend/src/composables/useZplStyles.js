// Composable for ZPL element style computations

export function useZplStyles() {

  // Convert ZPL rotation code to degrees
  function getFieldRotationDegrees(rotation) {
    switch (rotation) {
      case 'R': return 90
      case 'I': return 180
      case 'B': return 270
      default: return 0
    }
  }
  function getFieldBlockDimensions(element) {
    if (element.contentType === 'text') {
      if (element.blockWidth > 0) {
        return {
          width: element.blockWidth,
          height: element.fontHeight * element.maxLines
        }
      } else {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        ctx.font = `bold ${element.fontHeight}px "Swiss721BoldCondensed", "Arial Narrow", Arial, sans-serif`

        const metrics = ctx.measureText(element.content || '')
        const scaleX = element.fontWidth / element.fontHeight

        // Measure actual extremes from reference characters
        const ascenderMetrics = ctx.measureText('HBDFKLTbdfhkl')
        const descenderMetrics = ctx.measureText('gjpqy')

        const measuredHeight = ascenderMetrics.actualBoundingBoxAscent + descenderMetrics.actualBoundingBoxDescent

        return {
          width: metrics.width * scaleX,
          height: measuredHeight
        }
      }
    }

    return {
      width: element.boxWidth || 0,
      height: element.boxHeight || 0
    }
  }

  // Get field block positioning and rotation style
  function getFieldBlockStyle(element) {
    const fieldRotationDeg = getFieldRotationDegrees(element.rotation)
    const dimensions = getFieldBlockDimensions(element)

    let translateX = '0'
    let translateY = '0'

    switch (element.rotation) {
      case 'R':
        translateX = '0'
        translateY = '-100%'
        break
      case 'I':
        translateX = '-100%'
        translateY = '-100%'
        break
      case 'B':
        translateX = '-100%'
        translateY = '0'
        break
      default:
        break
    }

    return {
      position: 'absolute',
      left: element.x + 'px',
      top: element.y + 'px',
      width: dimensions.width + 'px',
      height: dimensions.height + 'px',
      transformOrigin: 'top left',
      transform: `rotate(${fieldRotationDeg}deg) translate(${translateX}, ${translateY})`
    }
  }

  // Get text container style for ^FB behavior
  function getTextContainerStyle(element) {
    const scaleX = element.fontWidth / element.fontHeight

    if (element.blockWidth <= 0) {
      return {
        display: 'inline-block',
        whiteSpace: 'pre',
        lineHeight: '1',
        transform: `scaleX(${scaleX})`,
        transformOrigin: 'left top'
      }
    }

    const justifyMap = {
      'L': 'left',
      'C': 'center',
      'R': 'right',
      'J': 'justify'
    }

    const maxHeight = element.fontHeight * element.maxLines
    const adjustedWidth = element.blockWidth / scaleX

    return {
      width: adjustedWidth + 'px',
      maxHeight: maxHeight + 'px',
      overflow: 'hidden',
      textAlign: justifyMap[element.justification] || 'left',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      lineHeight: '1',
      transform: `scaleX(${scaleX})`,
      transformOrigin: 'left top'
    }
  }

  // Get content alignment style (for non-text elements)
  function getContentStyle(element) {
    if (element.contentType === 'text') {
      return {}
    }

    // Fix for offset: Ensure non-text elements (box/line) are pinned to
    // the top-left of the field block if no block width is defined.
    if (!element.blockWidth || element.blockWidth <= 0) {
      return {
        position: 'absolute',
        top: 0,
        left: 0
      }
    }

    const alignMap = {
      'L': 'flex-start',
      'C': 'center',
      'R': 'flex-end',
      'J': 'space-between'
    }

    return {
      display: 'flex',
      justifyContent: alignMap[element.justification] || 'flex-start',
      width: element.blockWidth + 'px'
    }
  }

  // Get inline text element style
  function getTextElementStyle(element) {
    const FONT_SCALE = 1
    const fontSize = element.fontHeight * FONT_SCALE

    // Adjust this value to align text top with element top
    // Typically around 10-15% of font size
    const topOffset = fontSize * 0.16

    return {
      fontFamily: "'Swiss721BoldCondensed', 'Arial Narrow', Arial, sans-serif",
      fontSize: fontSize + 'px',
      fontWeight: 'Bold',
      WebkitTextStroke: '.4px currentColor',
      letterSpacing: '0px',
      wordSpacing: '0px',
      lineHeight: '1',
      margin: '0',
      padding: '0',
      position: 'relative',
      top: -topOffset + 'px'
    }
  }

  // Get graphic box style
  function getBoxStyle(element) {
    if (element.contentType === 'line') {
      return {
        width: element.boxWidth + 'px',
        height: element.boxHeight + 'px',
        backgroundColor: 'currentColor',
        border: 'none'
      }
    }
    return {
      width: element.boxWidth + 'px',
      height: element.boxHeight + 'px',
      borderWidth: element.borderThickness + 'px',
      borderStyle: 'solid',
      borderColor: 'currentColor'
    }
  }

  return {
    getFieldRotationDegrees,
    getFieldBlockStyle,
    getTextContainerStyle,
    getContentStyle,
    getTextElementStyle,
    getBoxStyle
  }
}
