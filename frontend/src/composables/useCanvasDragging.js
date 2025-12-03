import { ref } from 'vue'

export function useCanvasDragging(canvasRef, canvasRotation, canvasWidthPx, canvasHeightPx, selectedElement, selectElement) {
  const isDragging = ref(false)
  const dragOffset = ref({ x: 0, y: 0 })

  function getLogicalPosition(event) {
    const canvasRect = canvasRef.value.getBoundingClientRect()
    const canvasCenter = {
      x: canvasRect.left + canvasRect.width / 2,
      y: canvasRect.top + canvasRect.height / 2
    }

    const mouseX = event.clientX - canvasCenter.x
    const mouseY = event.clientY - canvasCenter.y

    // Rotate mouse position back by canvas rotation to get logical position
    const rad = canvasRotation.value * Math.PI / 180
    const rotatedX = mouseX * Math.cos(rad) - mouseY * Math.sin(rad)
    const rotatedY = mouseX * Math.sin(rad) + mouseY * Math.cos(rad)

    return {
      x: rotatedX + canvasWidthPx.value / 2,
      y: rotatedY + canvasHeightPx.value / 2
    }
  }

  function startDragging(event, element) {
    isDragging.value = true
    selectElement(element)

    const logical = getLogicalPosition(event)
    dragOffset.value = {
      x: logical.x - element.x,
      y: logical.y - element.y
    }
  }

  function onDrag(event) {
    if (!isDragging.value || !selectedElement.value || !canvasRef.value) return

    const logical = getLogicalPosition(event)
    const newX = logical.x - dragOffset.value.x
    const newY = logical.y - dragOffset.value.y

    // Constrain to canvas bounds
    selectedElement.value.x = Math.round(Math.max(0, Math.min(canvasWidthPx.value, newX)))
    selectedElement.value.y = Math.round(Math.max(0, Math.min(canvasHeightPx.value, newY)))
  }

  function stopDragging() {
    isDragging.value = false
  }

  return {
    isDragging,
    startDragging,
    onDrag,
    stopDragging
  }
}
