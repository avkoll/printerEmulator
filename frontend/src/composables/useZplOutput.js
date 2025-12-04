import { ref } from 'vue'

export function useZplOutput() {
  const generatedZpl = ref('')

  function generateZpl() {
    generatedZpl.value = '^XA^FO50,50^FDCrash Bandicoot^FS^XZ'
  }

  return {
    generatedZpl,
    generateZpl
  }
}
