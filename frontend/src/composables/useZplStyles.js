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
      const scaleX = element.fontWidth / element.fontHeight

      if (element.blockWidth > 0) {
        // Has field block - width is blockWidth, height is line height * max lines
        return {
          width: element.blockWidth,
          height: element.fontHeight * element.maxLines
        }
      } else {
        // No field block - need to estimate based on text length
        // This is approximate; you might need to measure actual text
        const estimatedCharWidth = element.fontWidth * 0.6  // Approximate for condensed font
        const textWidth = (element.text?.length || 1) * estimatedCharWidth
        return {
          width: textWidth,
          height: element.fontHeight
        }
      }
    }

    // For boxes/other elements
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
    const FONT_SCALE = 1
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

    const lineHeight = element.fontHeight * FONT_SCALE
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

    if (element.blockWidth <= 0) return {}

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
    return {
      width: element.boxWidth + 'px',
      height: element.boxHeight + 'px',
      borderWidth: element.borderThickness + 'px'
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
