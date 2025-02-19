<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null)
const fileContent = ref<string | null>(null)

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
      samples: items
          .filter(item => /^[a-zA-Z]+$/.test(item.trim()))
    },
    {
      label: 'Integer Numbers',
      icon: 'lucide:hash',
      samples: items
          .filter(item => /^\d+$/.test(item.trim()))
    },
    {
      label: 'Real Numbers',
      icon: 'lucide:divide',
      samples: items
          .filter(item => /^\d+\.\d+$/.test(item.trim()))
    },
    {
      label: 'Alphanumeric Strings',
      icon: 'lucide:text-cursor',
      samples: items
          .filter(item => /^\s*(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+\s*$/.test(item.trim()))
    }
  ]
})

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    readFile(input.files[0])
  }
}

const handleFileDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files?.length) {
    readFile(files[0])
  }
}

const readFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    fileContent.value = e.target?.result as string
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <NuxtLink
            to="/"
            class="text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-4 w-full justify-center mb-4"
        >
          <Icon name="lucide:eye" class="w-4 h-4"/>
          Navigate to file generator
        </NuxtLink>
        <h1 class="text-2xl font-bold flex items-center gap-2 mb-4">
          <Icon name="lucide:file-text" class="w-6 h-6"/>
          Data File Viewer
        </h1>

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
            <Icon name="lucide:upload-cloud" class="w-12 h-12 text-gray-400 mx-auto"/>
            <div>
              <button
                  @click="$refs.fileInput.click()"
                  class="text-blue-500 hover:text-blue-600 font-medium"
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
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
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