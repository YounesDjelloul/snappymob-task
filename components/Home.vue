<script setup lang="ts">
import {Generator} from '~/utils/generator'

const isGenerating = ref(false)
const progress = ref(0)
const status = ref<'idle' | 'generating' | 'success' | 'error'>('idle')
const errorMessage = ref('')

const downloadFile = (url: string) => {
  const a = document.createElement('a')
  a.href = url
  a.download = 'generated_data.txt'
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

const generateAndDownload = async () => {
  isGenerating.value = true
  status.value = 'generating'
  progress.value = 0

  const progressInterval = setInterval(() => {
    if (progress.value >= 95) {
      clearInterval(progressInterval)
      return
    }
    progress.value += Math.random() * 10
  }, 200)

  try {
    const generator = new Generator()
    const data = await generator.generateFile()

    clearInterval(progressInterval)
    progress.value = 100

    const blob = new Blob([data], {type: 'text/plain'})
    const url = window.URL.createObjectURL(blob)

    downloadFile(url)

    status.value = 'success'
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred'
    console.error('Error generating file:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold flex items-center gap-2 mb-4">
          <Icon name="lucide:hard-drive" class="w-6 h-6"/>
          Random Data Generator
        </h1>
        <p class="text-gray-600">
          Generate a 10MB file containing random alphabetical strings, real numbers,
          integers, and alphanumeric values with spaces.
        </p>
      </div>

      <div v-if="status === 'generating'" class="space-y-3">
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
              class="h-full bg-blue-500 transition-all duration-300"
              :style="{ width: `${Math.min(progress, 100)}%` }"
          ></div>
        </div>
        <p class="text-sm text-gray-500 text-center">
          Generating data... {{ Math.round(progress) }}%
        </p>
      </div>

      <div
          v-if="status === 'success'"
          class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
      >
        <Icon name="lucide:check-circle-2" class="w-5 h-5 text-green-600 mt-0.5"/>
        <div>
          <h3 class="font-medium text-green-900">Success!</h3>
          <p class="text-green-700">Your file has been generated and downloaded.</p>
        </div>
      </div>

      <div
          v-if="status === 'error'"
          class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
      >
        <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-600 mt-0.5"/>
        <div>
          <h3 class="font-medium text-red-900">Error</h3>
          <p class="text-red-700">{{ errorMessage }}</p>
        </div>
      </div>

      <button
          @click="generateAndDownload"
          :disabled="isGenerating"
          class="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300
               text-white font-medium px-6 py-3 rounded-lg transition-colors
               flex items-center justify-center gap-2 mx-auto"
      >
        <template v-if="isGenerating">
          <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Generating...
        </template>
        <template v-else>
          <Icon name="lucide:file-down" class="w-5 h-5"/>
          Generate 10MB File
        </template>
      </button>
    </div>
  </div>
</template>