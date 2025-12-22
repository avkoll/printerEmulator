<template>
  <q-card class="q-ma-sm">
    <q-card-section>
      <div class="text-h5">Design Tools</div>
      <q-separator />

      <!-- Tool Selection -->
      <div class="q-mt-md">
        <div class="text-subtitle2 q-mb-sm">Add Elements</div>
        <q-btn flat icon="dashboard" label="Field Block" class="full-width" @click="addFieldBlock" />
      </div>

      <q-separator class="q-my-md" />

      <!-- Canvas Properties -->
      <div class="text-subtitle2 q-mb-sm">Canvas Settings</div>
      <q-input
        color="purple-12"
        type="number"
        v-model.number="canvasWidth"
        label="Canvas Width (in)"
      >
        <template v-slot:prepend>
          <q-icon name="straighten" />
        </template>
      </q-input>

      <q-input
        color="purple-12"
        type="number"
        v-model.number="canvasHeight"
        label="Canvas Height (in)"
      >
        <template v-slot:prepend>
          <q-icon name="height" />
        </template>
      </q-input>

      <q-select
        color="purple-12"
        v-model="canvasRotation"
        :options="canvasRotationOptions"
        label="Canvas Rotation (^PO)"
        class="q-mt-sm"
        emit-value
        map-options
      >
        <template v-slot:prepend>
          <q-icon name="rotate_right" />
        </template>
      </q-select>

      <q-separator class="q-my-md" />

      <!-- Element Properties -->
      <div class="text-subtitle2 q-mb-sm">Field Block Properties</div>
      <template v-if="selectedElement">
        <!-- Field Origin (^FO) -->
        <div class="text-caption text-grey-7 q-mb-xs">Field Origin (^FO)</div>
        <q-input
          color="purple-12"
          type="number"
          v-model.number="selectedElement.x"
          label="X Position (dots)"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <q-icon name="swap_horiz" />
          </template>
        </q-input>

        <q-input
          color="purple-12"
          type="number"
          v-model.number="selectedElement.y"
          label="Y Position (dots)"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <q-icon name="swap_vert" />
          </template>
        </q-input>

        <q-select
          color="purple-12"
          v-model="selectedElement.rotation"
          :options="fieldRotationOptions"
          label="Field Rotation (^FW)"
          class="q-mb-sm"
          emit-value
          map-options
        >
          <template v-slot:prepend>
            <q-icon name="rotate_right" />
          </template>
        </q-select>

        <q-separator class="q-my-sm" />

        <!-- Field Block Parameters (^FB) -->
        <div class="text-caption text-grey-7 q-mb-xs">Field Block (^FB)</div>
        <q-input
          color="purple-12"
          type="number"
          v-model.number="selectedElement.blockWidth"
          label="Block Width (dots)"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <q-icon name="width_normal" />
          </template>
        </q-input>

        <q-input
          color="purple-12"
          type="number"
          v-model.number="selectedElement.maxLines"
          label="Max Lines"
          class="q-mb-sm"
          min="1"
        >
          <template v-slot:prepend>
            <q-icon name="format_line_spacing" />
          </template>
        </q-input>

        <q-select
          color="purple-12"
          v-model="selectedElement.justification"
          :options="justificationOptions"
          label="Justification"
          class="q-mb-sm"
          emit-value
          map-options
        >
          <template v-slot:prepend>
            <q-icon name="format_align_left" />
          </template>
        </q-select>

        <q-separator class="q-my-sm" />

        <!-- Content Type Selection -->
        <div class="text-caption text-grey-7 q-mb-xs">Content Type</div>
        <q-select
          color="purple-12"
          v-model="selectedElement.contentType"
          :options="contentTypeOptions"
          label="Field Content Type"
          class="q-mb-sm"
          emit-value
          map-options
        >
          <template v-slot:prepend>
            <q-icon name="category" />
          </template>
        </q-select>

        <q-separator class="q-my-sm" />

        <!-- Content-specific Properties -->
        <div class="text-caption text-grey-7 q-mb-xs">Content Properties</div>

        <!-- Text Content (^FD with ^A font) -->
        <template v-if="selectedElement.contentType === 'text'">
          <q-input
            color="purple-12"
            v-model="selectedElement.content"
            label="Text Content (^FD)"
            class="q-mb-sm"
          >
            <template v-slot:prepend>
              <q-icon name="text_format" />
            </template>
          </q-input>

          <q-input
            color="purple-12"
            type="number"
            v-model.number="selectedElement.fontHeight"
            label="Font Height (dots)"
            class="q-mb-sm"
          >
            <template v-slot:prepend>
              <q-icon name="format_size" />
            </template>
          </q-input>

          <q-input
            color="purple-12"
            type="number"
            v-model.number="selectedElement.fontWidth"
            label="Font Width (dots)"
            class="q-mb-sm"
          >
            <template v-slot:prepend>
              <q-icon name="format_size" />
            </template>
          </q-input>
        </template>

        <!-- Barcode placeholder -->
        <template v-else-if="selectedElement.contentType === 'barcode'">
          <q-input
            color="purple-12"
            v-model="selectedElement.content"
            label="Barcode Data"
            class="q-mb-sm"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code" />
            </template>
          </q-input>
          <div class="text-caption text-grey-5">Barcode rendering coming soon</div>
        </template>

        <!-- Graphic Box and Line properties -->
        <template v-else-if="selectedElement.contentType === 'box' || selectedElement.contentType === 'line'">
          <q-input
            color="purple-12"
            type="number"
            v-model.number="selectedElement.boxWidth"
            label="Width (dots)"
            class="q-mb-sm"
          >
            <template v-slot:prepend>
              <q-icon name="crop_landscape" />
            </template>
          </q-input>

          <q-input
            color="purple-12"
            type="number"
            v-model.number="selectedElement.boxHeight"
            label="Height (dots)"
            class="q-mb-sm"
          >
            <template v-slot:prepend>
              <q-icon name="crop_portrait" />
            </template>
          </q-input>

          <q-input
            v-if="selectedElement.contentType === 'box'"
            color="purple-12"
            type="number"
            v-model.number="selectedElement.borderThickness"
            label="Border Thickness (dots)"
            class="q-mb-sm"
          >
            <template v-slot:prepend>
              <q-icon name="line_weight" />
            </template>
          </q-input>
        </template>

        <q-btn
          color="negative"
          icon="delete"
          label="Delete Field"
          class="full-width q-mt-md"
          @click="deleteSelectedElement"
        />
      </template>
      <div v-else class="text-grey-6 text-center q-pa-md">
        Select a field block to edit its properties
      </div>

    </q-card-section>
  </q-card>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useLabelDesignerStore } from 'stores/labelDesignerStore'

const store = useLabelDesignerStore()

const {
  canvasWidth,
  canvasHeight,
  canvasRotation,
  selectedElement
} = storeToRefs(store)

const {
  canvasRotationOptions,
  fieldRotationOptions,
  justificationOptions,
  contentTypeOptions,
  addFieldBlock,
  deleteSelectedElement
} = store
</script>
