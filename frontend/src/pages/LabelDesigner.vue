<template>
  <q-page>
    <div class="row full-height">
      <!-- Left Control Panel - Design Tools and Properties -->
      <div class="col-4">
        <q-card class="q-ma-sm">
          <q-card-section>
            <div class="text-h5">Design Tools</div>
            <q-separator />

            <!-- Tool Selection -->
            <div class="q-mt-md">
              <div class="text-subtitle2 q-mb-sm">Add Elements</div>
              <q-btn-group flat class="full-width">
                <q-btn flat icon="text_fields" label="Text" class="col" />
                <q-btn flat icon="crop_din" label="Rectangle" class="col" />
              </q-btn-group>
              <q-btn-group flat class="full-width q-mt-xs">
                <q-btn flat icon="qr_code" label="Barcode" class="col" />
                <q-btn flat icon="image" label="Image" class="col" />
              </q-btn-group>
            </div>

            <q-separator class="q-my-md" />

            <!-- Canvas Properties -->
            <div class="text-subtitle2 q-mb-sm">Canvas Settings</div>
            <q-input
              color="purple-12"
              type="number"
              v-model="canvasWidth"
              label="Canvas Width (mm)"
            >
              <template v-slot:prepend>
                <q-icon name="straighten" />
              </template>
            </q-input>

            <q-input
              color="purple-12"
              type="number"
              v-model="canvasHeight"
              label="Canvas Height (mm)"
            >
              <template v-slot:prepend>
                <q-icon name="height" />
              </template>
            </q-input>

            <q-separator class="q-my-md" />

            <!-- Element Properties -->
            <div class="text-subtitle2 q-mb-sm">Element Properties</div>
            <q-input
              color="purple-12"
              v-model="elementText"
              label="Text Content"
              disable
            >
              <template v-slot:prepend>
                <q-icon name="text_format" />
              </template>
            </q-input>

            <q-select
              v-model="fontSize"
              :options="fontSizeOptions"
              label="Font Size"
              disable
            >
              <template v-slot:prepend>
                <q-icon name="format_size" />
              </template>
            </q-select>

            <q-btn-group flat class="full-width q-mt-sm">
              <q-btn flat icon="format_bold" disable />
              <q-btn flat icon="format_italic" disable />
              <q-btn flat icon="format_underlined" disable />
            </q-btn-group>

            <q-separator class="q-my-md" />

            <!-- Actions -->
            <div class="text-subtitle2 q-mb-sm">Actions</div>
            <q-btn
              color="positive"
              icon="save"
              label="Save Design"
              class="full-width q-mb-xs"
            />
            <q-btn
              color="primary"
              icon="download"
              label="Export"
              class="full-width q-mb-xs"
            />
            <q-btn
              color="orange"
              icon="refresh"
              label="Clear Canvas"
              class="full-width"
            />

          </q-card-section>
        </q-card>
      </div>

      <!-- Main Canvas Area -->
      <div class="col-8">
        <q-card class="q-ml-sm bg-grey-1" style="height: 88vh; max-width: 95%;">
          <q-card-section>
            <div class="text-h6">Label Design Canvas</div>
            <div class="text-caption text-grey-6">Design your custom labels here</div>
          </q-card-section>

          <div style="height: 80vh; max-width: 98%; overflow: auto;">
            <div class="row justify-center q-pa-md">
              <!-- Canvas Container -->
              <div class="canvas-container bg-white shadow-2"
                   :style="canvasStyle">
                <div class="flex flex-center full-height text-grey-5">
                  <div class="text-center">
                    <q-icon name="design_services" size="4rem" class="q-mb-md" />
                    <div class="text-h6">Design Canvas</div>
                    <div class="text-caption">{{ canvasWidth }}mm × {{ canvasHeight }}mm</div>
                    <div class="text-caption text-grey-4 q-mt-sm">Click tools on the left to start designing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

// Canvas properties
const canvasWidth = ref(100)
const canvasHeight = ref(50)

// Element properties
const elementText = ref('Sample Text')
const fontSize = ref(12)
const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32]

// Computed canvas style for visual representation
const canvasStyle = computed(() => {
  // Convert mm to pixels for display (rough approximation: 1mm ≈ 3.78px at 96 DPI)
  const pixelWidth = canvasWidth.value * 3.78
  const pixelHeight = canvasHeight.value * 3.78

  return {
    width: `${Math.max(pixelWidth, 200)}px`,
    height: `${Math.max(pixelHeight, 100)}px`,
    border: '2px dashed #ccc',
    position: 'relative'
  }
})
</script>

<style scoped>
.canvas-container {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.canvas-container:hover {
  border-color: #9c27b0;
}
</style>
