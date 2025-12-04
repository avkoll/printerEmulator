<template>
  <q-card class="q-ma-sm">
    <q-card-section>
      <div class="text-h6">ZPL Output</div>
      <q-separator class="q-my-sm" />
      <pre class="zpl-output">{{ generatedZpl }}</pre>
      <div class="q-gutter-sm">
        <q-btn
          color="primary"
          icon="code"
          label="Generate ZPL"
          @click="generateZpl"
          class="q-mt-sm"
          dense
        />
        <q-btn
          color="purple-12"
          icon="content_copy"
          label="Copy ZPL"
          @click="copyToClipboard"
          class="q-mt-sm"
          dense
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useZplOutput } from 'src/composables/useZplOutput'

const { generatedZpl, generateZpl } = useZplOutput()
const $q = useQuasar()

function copyToClipboard() {
  navigator.clipboard.writeText(generatedZpl.value)
  $q.notify({
    message: 'ZPL copied to clipboard',
    color: 'positive',
    icon: 'check_circle'
  })
}
</script>

<style scoped>
.zpl-output {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;
}
</style>
