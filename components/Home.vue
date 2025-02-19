<script setup lang="ts">
import {Generator} from "~/utils/generator";

const isGenerating = ref(false);

const generateAndDownload = async () => {
  isGenerating.value = true;
  try {
    const generator = new Generator();
    const data = await generator.generateFile();

    const blob = new Blob([data], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_data.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating file:', error);
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <div class="p-4">
    <button
        @click="generateAndDownload"
        class="bg-blue-500 text-white px-4 py-2 rounded"
        :disabled="isGenerating"
    >
      {{ isGenerating ? 'Generating...' : 'Generate 10MB File' }}
    </button>
  </div>
</template>