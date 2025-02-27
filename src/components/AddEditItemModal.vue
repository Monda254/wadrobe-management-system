<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">{{ item ? 'Edit Item' : 'Add New Item' }}</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="input-field"
            placeholder="Enter item name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Category</label>
          <select v-model="formData.category" required class="input-field">
            <option v-for="category in wardrobeStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Color</label>
          <input
            v-model="formData.color"
            type="text"
            required
            class="input-field"
            placeholder="Enter color"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Season</label>
          <select v-model="formData.season" required class="input-field">
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
            <option value="All Seasons">All Seasons</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Occasions</label>
          <div class="grid grid-cols-2 gap-2 mt-1">
            <label v-for="occasion in wardrobeStore.occasions" :key="occasion" 
                   class="flex items-center space-x-2">
              <input type="checkbox" 
                     :value="occasion"
                     v-model="formData.occasions"
                     class="rounded text-blue-600" />
              <span class="text-sm">{{ occasion }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            v-model="formData.image"
            type="url"
            class="input-field"
            placeholder="Enter image URL (optional)"
          />
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="close" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            {{ item ? 'Update' : 'Add' }} Item
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useWardrobeStore } from '../stores/wardrobe'
import type { ClothingItem } from '../stores/wardrobe'

interface WardrobeItem {
  name: string;
  category: string;
  color: string;
  season: string;
  image?: string;
  occasions: string[];
}

const props = defineProps<{
  isOpen: boolean
  item?: ClothingItem | null
}>()

const emit = defineEmits(['close', 'submit'])
const wardrobeStore = useWardrobeStore()

const formData = ref({
  name: '',
  category: wardrobeStore.categories[0],
  color: '',
  season: 'All Seasons',
  image: '',
  occasions: ['Casual'] as string[]
})

watch(() => props.item, (newItem) => {
  if (newItem) {
    formData.value = { ...newItem }
  } else {
    formData.value = {
      name: '',
      category: wardrobeStore.categories[0],
      color: '',
      season: 'All Seasons',
      image: '',
      occasions: ['Casual']
    }
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', { ...formData.value })
  close()
}
</script>