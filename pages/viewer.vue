<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null)
const fileContent = ref<string | null>(null)
const availableFiles = ref<string[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchAvailableFiles = async () => {
  try {
    const response = await fetch('/api/files')
    availableFiles.value = await response.json()
  } catch (err) {
    error.value = 'Failed to fetch available files'
    console.error('Error fetching files:', err)
  }
}

const saveFile = async (file: File) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    const content = e.target?.result as string
    fileContent.value = content

    try {
      await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          content: content
        })
      })
      await fetchAvailableFiles()
    } catch (err) {
      error.value = 'Failed to save file'
      console.error('Error saving file:', err)
    }
  }
  reader.readAsText(file)
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    isLoading.value = true
    error.value = null

    try {
      saveFile(input.files[0])
    } catch (err) {
      error.value = 'Failed to process file'
      console.error('Error processing file:', err)
    } finally {
      isLoading.value = false
    }
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files?.length) {
    isLoading.value = true
    error.value = null

    try {
      saveFile(files[0])
    } catch (err) {
      error.value = 'Failed to process dropped file'
      console.error('Error processing dropped file:', err)
    } finally {
      isLoading.value = false
    }
  }
}

const loadExistingFile = async (filename: string) => {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch(`/api/files/${filename}`)
    fileContent.value = await response.text()
  } catch (err) {
    error.value = 'Failed to load file'
    console.error('Error loading file:', err)
  } finally {
    isLoading.value = false
  }
}

const statistics = computed(() => {
  if (!fileContent.value) return []

  const items = fileContent.value.split(',')
  const total = items.length

  const alphabeticalCount = items.filter(item => /^[a-zA-Z]+$/.test(item.trim())).length
  const numericCount = items.filter(item => /^\d+$/.test(item.trim())).length
  const realNumberCount = items.filter(item => /^\d+\.\d+$/.test(item.trim())).length
  const alphanumericCount = items.filter(item => /^\s*(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+\s*$/.test(item)).length

  return [
    {label: 'Total Items', value: total.toLocaleString()},
    {label: 'Alphabetical Strings', value: alphabeticalCount.toLocaleString()},
    {label: 'Alphanumeric Strings', value: alphanumericCount.toLocaleString()},
    {label: 'Integer Numbers', value: numericCount.toLocaleString()},
    {label: 'Real Numbers', value: realNumberCount.toLocaleString()}
  ]
})

const dataTypes = computed(() => {
  if (!fileContent.value) return []

  const items = fileContent.value.split(',')

  return [
    {
      label: 'Alphabetical Strings',
      icon: 'lucide:type',
      samples: items.filter(item => /^[a-zA-Z]+$/.test(item.trim()))
    },
    {
      label: 'Integer Numbers',
      icon: 'lucide:hash',
      samples: items.filter(item => /^\d+$/.test(item.trim()))
    },
    {
      label: 'Real Numbers',
      icon: 'lucide:divide',
      samples: items.filter(item => /^\d+\.\d+$/.test(item.trim()))
    },
    {
      label: 'Alphanumeric Strings',
      icon: 'lucide:text-cursor',
      samples: items.filter(item => /^\s*(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+\s*$/.test(item.trim()))
    }
  ]
})

onMounted(() => {
  fetchAvailableFiles()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-2xl font-bold flex items-center gap-2 my-8 max-w-6xl mx-auto">
      <Icon name="lucide:file-text" class="w-6 h-6"/>
      Data File Viewer
    </h1>
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <NuxtLink
            to="/"
            class="text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-4 w-full justify-center mb-4"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4"/>
          Back to file generator
        </NuxtLink>

        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon name="lucide:folder" class="w-5 h-5"/>
            Available Files
          </h2>

          <div v-if="availableFiles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <button
                v-for="file in availableFiles"
                :key="file"
                @click="loadExistingFile(file)"
                class="p-3 border rounded-lg hover:bg-gray-50 transition-colors
             flex items-center gap-2 text-left"
            >
              <Icon name="lucide:file" class="w-4 h-4 text-gray-400"/>
              <span class="truncate">{{ file }}</span>
            </button>
          </div>

          <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
            <Icon name="lucide:folder-empty" class="w-8 h-8 text-gray-400 mx-auto mb-2"/>
            <p class="text-gray-600">No files available in the directory</p>
            <p class="text-sm text-gray-500 mt-1">Upload a file to get started</p>
          </div>
        </div>

        <div v-if="error" class="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <div class="flex items-center gap-2">
            <Icon name="lucide:alert-circle" class="w-5 h-5"/>
            <span>{{ error }}</span>
          </div>
        </div>

        <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
        >
          <input
              type="file"
              ref="fileInput"
              class="hidden"
              accept=".txt"
              @change="handleFileSelect"
          />

          <div v-if="!fileContent" class="space-y-4">
            <Icon
                :name="isLoading ? 'lucide:loader-2' : 'lucide:upload-cloud'"
                class="w-12 h-12 text-gray-400 mx-auto"
                :class="{ 'animate-spin': isLoading }"
            />
            <div>
              <button
                  @click="$refs.fileInput.click()"
                  class="text-blue-500 hover:text-blue-600 font-medium"
                  :disabled="isLoading"
              >
                Choose a file
              </button>
              <span class="text-gray-500"> or drag and drop</span>
            </div>
            <p class="text-sm text-gray-500">Support for .txt files</p>
          </div>

          <div v-else class="space-y-2">
            <Icon name="lucide:check-circle" class="w-8 h-8 text-green-500 mx-auto"/>
            <p class="text-green-600 font-medium">File loaded successfully!</p>
            <button
                @click="fileContent = null"
                class="text-sm text-red-500 hover:text-red-600"
            >
              Remove file
            </button>
          </div>
        </div>
      </div>

      <div v-if="fileContent" class="space-y-6">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="lucide:pie-chart" class="w-5 h-5"/>
            Data Summary
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
            <div
                v-for="(stat, index) in statistics"
                :key="index"
                class="bg-gray-50 rounded-lg p-4"
            >
              <p class="text-sm text-gray-600">{{ stat.label }}</p>
              <p class="text-2xl font-semibold">{{ stat.value }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
              v-for="(type, index) in dataTypes"
              :key="index"
              class="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
              <Icon :name="type.icon" class="w-5 h-5"/>
              {{ type.label }}
            </h3>
            <div class="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <ul class="space-y-2">
                <li
                    v-for="(item, i) in type.samples"
                    :key="i"
                    class="text-sm font-mono bg-white p-2 rounded border border-gray-200"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>