import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLabelDesignerStore = defineStore('labelDesigner', () => {
  // Constants
  const DPI = 203

  // Canvas properties
  const canvasWidth = ref(4)
  const canvasHeight = ref(6)
  const canvasRotation = ref(0)

  // Elements
  const elements = ref([])
  let nextId = 1

  // Selection
  const selectedElement = ref(null)

  // Options for dropdowns
  const canvasRotationOptions = [
    { label: 'Normal (0°)', value: 0 },
    { label: 'Rotated (90°)', value: 90 },
    { label: 'Inverted (180°)', value: 180 },
    { label: 'Bottom-up (270°)', value: 270 }
  ]

  const fieldRotationOptions = [
    { label: 'N - Normal (0°)', value: 'N' },
    { label: 'R - Rotated (90°)', value: 'R' },
    { label: 'I - Inverted (180°)', value: 'I' },
    { label: 'B - Bottom-up (270°)', value: 'B' }
  ]

  const justificationOptions = [
    { label: 'Left', value: 'L' },
    { label: 'Center', value: 'C' },
    { label: 'Right', value: 'R' },
    { label: 'Justified', value: 'J' }
  ]

  const contentTypeOptions = [
    { label: 'Text (^FD)', value: 'text' },
    { label: 'Barcode (^BC)', value: 'barcode' },
    { label: 'Graphic Box (^GB)', value: 'box' },
    { label: 'Plex Line (^GB)', value: 'line' }
  ]

  // Computed
  const canvasWidthPx = computed(() => canvasWidth.value * DPI)
  const canvasHeightPx = computed(() => canvasHeight.value * DPI)

  // Actions
  function addFieldBlock() {
    const newElement = {
      id: nextId++,
      // Field Origin (^FO)
      x: 20,
      y: 20,
      // Field rotation (^FW)
      rotation: 'N',
      // Field Block parameters (^FB)
      blockWidth: 0,
      maxLines: 1,
      justification: 'L',
      // Content type
      contentType: 'text',
      // Text content defaults (^A font + ^FD data)
      content: 'SAMPLE',
      fontHeight: 30,
      fontWidth: 30,
      // Box defaults (^GB)
      boxWidth: 100,
      boxHeight: 50,
      borderThickness: 2
    }

    elements.value.push(newElement)
    selectedElement.value = newElement
  }

  function selectElement(element) {
    selectedElement.value = element
  }

  function deselectElement() {
    selectedElement.value = null
  }

  function deleteSelectedElement() {
    if (selectedElement.value) {
      const index = elements.value.findIndex(el => el.id === selectedElement.value.id)
      if (index > -1) {
        elements.value.splice(index, 1)
      }
      selectedElement.value = null
    }
  }

  function setElements(newElements) {
    elements.value = newElements
    selectedElement.value = null
    // Update nextId to avoid collisions
    const maxId = Math.max(...newElements.map(e => e.id), 0)
    nextId = maxId + 1
  }

  function clearAll() {
    elements.value = []
    selectedElement.value = null
  }

  return {
    // Constants
    DPI,
    // State
    canvasWidth,
    canvasHeight,
    canvasRotation,
    elements,
    selectedElement,
    // Options
    canvasRotationOptions,
    fieldRotationOptions,
    justificationOptions,
    contentTypeOptions,
    // Computed
    canvasWidthPx,
    canvasHeightPx,
    // Actions
    addFieldBlock,
    selectElement,
    deselectElement,
    deleteSelectedElement,
    setElements,
    clearAll
  }
})
