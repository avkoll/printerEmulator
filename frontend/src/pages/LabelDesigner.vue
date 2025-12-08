<template>
  <q-page>
    <div class="row full-height">
      <!-- Left Control Panel -->
      <div class="col-4">
        <DesignToolsPanel />
      </div>

      <!-- Main Canvas Area -->
      <div class="col-8">
        <q-card class="q-ml-sm bg-grey-1" style="height: 88vh; max-width: 95%;">
          <q-card-section>
            <div class="text-h6">Label Designer</div>
          </q-card-section>

          <div style="height: 80vh; max-width: 98%; overflow: auto;">
            <div class="row justify-center q-pa-md">
              <div
                class="zpl-canvas"
                :style="canvasStyle"
                @click="deselectElement"
                @mouseup="stopDragging"
                @mouseleave="stopDragging"
                @mousemove="onDrag"
                ref="canvasRef"
              >
                <div class="canvas-orientation-indicator">↓ Label Comes From Here ↓</div>

                <div
                  v-for="element in elements"
                  :key="element.id"
                  class="zpl-field-block"
                  :class="{ selected: selectedElement?.id === element.id }"
                  :style="getFieldBlockStyle(element)"
                  @mousedown.stop="startDragging($event, element)"
                  @click.stop="selectElement(element)"
                >
                  <div
                    v-if="element.blockWidth > 0"
                    class="block-boundary"
                    :style="{ width: element.blockWidth + 'px' }"
                  ></div>

                  <div class="field-content" :style="getContentStyle(element)">
                    <div
                      v-if="element.contentType === 'text'"
                      class="text-block-container"
                      :style="getTextContainerStyle(element)"
                    >
                      <span class="text-element" :style="getTextElementStyle(element)">
                        {{ element.content }}
                      </span>
                    </div>

                    <div v-else-if="element.contentType === 'barcode'" class="barcode-placeholder">
                      <q-icon name="qr_code" size="sm" />
                      <span class="text-caption">{{ element.content }}</span>
                    </div>

                    <div
                      v-else-if="element.contentType === 'box'"
                      class="graphic-box"
                      :style="getBoxStyle(element)"
                    ></div>
                  </div>
                </div>

                <div
                  v-for="element in elements"
                  :key="'origin-' + element.id"
                  class="field-origin-marker"
                  :class="{ visible: selectedElement?.id === element.id }"
                  :style="{ left: element.x + 'px', top: element.y + 'px' }"
                ></div>

                <div v-if="elements.length === 0" class="empty-state">
                  <q-icon name="design_services" size="4rem" class="q-mb-md" />
                  <div class="text-h6">Label Canvas</div>
                  <div class="text-caption">{{ canvasWidth }}in × {{ canvasHeight }}in</div>
                  <div class="text-caption text-grey-4 q-mt-sm">Click "Field Block" to add elements</div>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- ZPL Output Panel -->
      <div class="col-4">
        <ZplOutput />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLabelDesignerStore } from 'stores/labelDesignerStore'
import { useZplStyles } from 'src/composables/useZplStyles'
import { useCanvasDragging } from 'src/composables/useCanvasDragging'
import DesignToolsPanel from 'src/components/label-designer/DesignToolsPanel.vue'
import ZplOutput from 'src/components/label-designer/ZplOutput.vue'
import 'src/css/Zpl-canvas.scss'

const store = useLabelDesignerStore()

const {
  canvasWidth,
  canvasHeight,
  canvasRotation,
  elements,
  selectedElement,
  canvasWidthPx,
  canvasHeightPx
} = storeToRefs(store)

const { selectElement, deselectElement } = store

const {
  getFieldBlockStyle,
  getTextContainerStyle,
  getContentStyle,
  getTextElementStyle,
  getBoxStyle
} = useZplStyles()

const canvasRef = ref(null)

const { startDragging, onDrag, stopDragging } = useCanvasDragging(
  canvasRef,
  canvasRotation,
  canvasWidthPx,
  canvasHeightPx,
  selectedElement,
  selectElement
)

const canvasStyle = computed(() => {
  const widthPx = canvasWidthPx.value
  const heightPx = canvasHeightPx.value

  const isSwapped = canvasRotation.value === 90 || canvasRotation.value === 270
  const offsetX = isSwapped ? (heightPx - widthPx) / 2 : 0
  const offsetY = isSwapped ? (widthPx - heightPx) / 2 : 0

  return {
    width: `${widthPx}px`,
    height: `${heightPx}px`,
    transform: `translate(${offsetX}px, ${offsetY}px) rotate(${-canvasRotation.value}deg)`,
    transformOrigin: 'center center'
  }
})
</script>
