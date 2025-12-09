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

  // Get field block positioning and rotation style
  function getFieldBlockStyle(element) {
    const fieldRotationDeg = getFieldRotationDegrees(element.rotation)

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
      transformOrigin: 'top left',
      transform: `rotate(${fieldRotationDeg}deg) translate(${translateX}, ${translateY})`
    }
  }

  // Get text container style for ^FB behavior
  function getTextContainerStyle(element) {
    if (element.blockWidth <= 0) {
      return {
        display: 'inline-block',
        whiteSpace: 'pre',
        lineHeight: '1'
      }
    }

    const justifyMap = {
      'L': 'left',
      'C': 'center',
      'R': 'right',
      'J': 'justify'
    }

    const lineHeight = element.fontHeight
    const maxHeight = lineHeight * element.maxLines

    return {
      width: element.blockWidth + 'px',
      maxHeight: maxHeight + 'px',
      overflow: 'hidden',
      textAlign: justifyMap[element.justification] || 'left',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      lineHeight: lineHeight + 'px'
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
    return {
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: element.fontHeight + 'px',
      fontWeight: 'bold',
      letterSpacing: (element.fontWidth - element.fontHeight) + 'px'
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
