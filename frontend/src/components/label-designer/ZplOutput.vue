<template>
  <q-card class="q-ma-sm">
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="text-h6">ZPL Code</div>
        <q-btn-toggle
          v-model="mode"
          flat
          dense
          toggle-color="primary"
          :options="[
            { label: 'Output', value: 'output', icon: 'code' },
            { label: 'Import', value: 'import', icon: 'upload' }
          ]"
        />
      </div>

      <q-separator class="q-my-sm" />

      <!-- Output Mode -->
      <template v-if="mode === 'output'">
        <pre class="zpl-code-display">{{ zplCode }}</pre>
        <div class="q-gutter-sm q-mt-sm">
          <q-btn
            color="purple-12"
            icon="content_copy"
            label="Copy"
            @click="copyToClipboard"
            dense
          />
          <q-btn
            color="secondary"
            icon="download"
            label="Download"
            @click="downloadZpl"
            dense
          />
        </div>
      </template>

      <!-- Import Mode -->
      <template v-else>
        <q-input
          v-model="importText"
          type="textarea"
          outlined
          placeholder="Paste ZPL code here to import..."
          class="zpl-input"
          :rows="12"
        />

        <div class="q-gutter-sm q-mt-sm">
          <q-btn
            color="primary"
            icon="upload"
            label="Import"
            @click="handleImport"
            :disable="!importText.trim()"
            dense
          />
          <q-btn
            flat
            icon="clear"
            label="Clear"
            @click="importText = ''"
            :disable="!importText"
            dense
          />
        </div>

        <q-checkbox
          v-model="clearExisting"
          label="Clear existing elements before import"
          class="q-mt-sm"
          dense
        />

        <!-- Import Result Banner -->
        <q-banner
          v-if="importResult"
          :class="importResult.success ? 'bg-positive text-white' : 'bg-negative text-white'"
          class="q-mt-md"
          rounded
          dense
        >
          <template v-slot:avatar>
            <q-icon :name="importResult.success ? 'check_circle' : 'error'" />
          </template>
          <span v-if="importResult.success">
            Imported {{ importResult.elementCount }} element(s)
          </span>
          <span v-else>
            {{ importResult.error }}
          </span>
        </q-banner>

        <!-- Parse Warnings -->
        <div v-if="importResult?.warnings?.length" class="q-mt-sm">
          <div class="text-caption text-orange q-mb-xs">
            <q-icon name="warning" size="xs" /> Warnings:
          </div>
          <div
            v-for="(warning, idx) in importResult.warnings"
            :key="idx"
            class="text-caption text-grey-7"
          >
            • {{ warning }}
          </div>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useZplOutput } from 'src/composables/useZplOutput'
import { useZplParser } from 'src/composables/useZplParser'

const $q = useQuasar()

const { zplCode, downloadZpl } = useZplOutput()
const { importZpl } = useZplParser()

const mode = ref('output')
const importText = ref('')
const clearExisting = ref(true)
const importResult = ref(null)

// Clear import result when switching modes or changing text
watch(mode, () => {
  importResult.value = null
})

watch(importText, () => {
  importResult.value = null
})

function copyToClipboard() {
  navigator.clipboard.writeText(zplCode.value)
  $q.notify({
    message: 'ZPL copied to clipboard',
    color: 'positive',
    icon: 'check_circle',
    timeout: 1500
  })
}

function handleImport() {
  importResult.value = importZpl(importText.value, {
    clearExisting: clearExisting.value
  })

  if (importResult.value.success) {
    $q.notify({
      message: `Imported ${importResult.value.elementCount} element(s)`,
      color: 'positive',
      icon: 'check_circle',
      timeout: 2000
    })

    // Switch to output mode to show result
    setTimeout(() => {
      mode.value = 'output'
    }, 1000)
  }
}
</script>

<style scoped>
.zpl-code-display {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;
  margin: 0;
}

.zpl-input :deep(textarea) {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
</style>
