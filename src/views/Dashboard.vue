<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-bold">My Wardrobe</h2>
      <div class="flex space-x-4">
        <button @click="showAnalytics = !showAnalytics" class="btn-secondary">
          {{ showAnalytics ? 'Hide Analytics' : 'Show Analytics' }}
        </button>
        <button @click="showOutfitPlanner = !showOutfitPlanner" class="btn-secondary">
          {{ showOutfitPlanner ? 'Hide Planner' : 'Outfit Planner' }}
        </button>
        <button @click="openAddModal" class="btn-primary">Add Item</button>
      </div>
    </div>

    <!-- Analytics Section -->
    <div v-if="showAnalytics" class="bg-white p-6 rounded-lg shadow space-y-6">
      <h3 class="text-xl font-semibold mb-4">Wardrobe Analytics</h3>
      
      <!-- Category Breakdown -->
      <div>
        <h4 class="text-lg font-medium mb-2">Category Breakdown</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(count, category) in wardrobeStore.categoryBreakdown" 
               :key="category"
               class="bg-gray-50 p-4 rounded-md">
            <div class="text-2xl font-bold">{{ count }}</div>
            <div class="text-gray-600">{{ category }}</div>
          </div>
        </div>
      </div>

      <!-- Most/Least Worn Items -->
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-lg font-medium mb-2">Most Worn Items</h4>
          <ul class="space-y-2">
            <li v-for="item in wardrobeStore.mostWornItems" :key="item.id"
                class="flex justify-between items-center">
              <span>{{ item.name }}</span>
              <span class="text-gray-600">Worn {{ item.timesWorn }} times</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-medium mb-2">Least Worn Items</h4>
          <ul class="space-y-2">
            <li v-for="item in wardrobeStore.leastWornItems" :key="item.id"
                class="flex justify-between items-center">
              <span>{{ item.name }}</span>
              <span class="text-gray-600">Worn {{ item.timesWorn }} times</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Seasonal Suggestions -->
      <div>
        <h4 class="text-lg font-medium mb-2">Seasonal Suggestions</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="item in wardrobeStore.seasonalSuggestions.slice(0, 3)" :key="item.id"
               class="bg-gray-50 p-4 rounded-md">
            <img v-if="item.image" :src="item.image" :alt="item.name" 
                 class="w-full h-32 object-cover rounded mb-2" />
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-gray-600">Perfect for {{ item.season }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Outfit Planner -->
    <div v-if="showOutfitPlanner" class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold mb-4">Outfit Planner</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" v-model="outfitPlan.date" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Occasion</label>
            <select v-model="outfitPlan.occasion" class="input-field">
              <option v-for="occasion in wardrobeStore.occasions" :key="occasion" :value="occasion">
                {{ occasion }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" v-model="outfitPlan.name" class="input-field" placeholder="Outfit name" />
          </div>
        </div>
        <button @click="addOutfitPlan" class="btn-primary">Save Outfit Plan</button>
      </div>
    </div>

    <!-- Filters and Sorting -->
    <div class="bg-white p-4 rounded-lg shadow space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Search</label>
          <input
            v-model="filters.search"
            type="text"
            class="input-field"
            placeholder="Search items..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Category</label>
          <select v-model="filters.category" class="input-field">
            <option value="">All Categories</option>
            <option v-for="category in wardrobeStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Season</label>
          <select v-model="filters.season" class="input-field">
            <option value="">All Seasons</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
            <option value="All Seasons">All Seasons</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Sort By</label>
          <select v-model="sortBy" class="input-field">
            <option value="dateAdded">Date Added</option>
            <option value="color">Color</option>
            <option value="category">Category</option>
            <option value="season">Season</option>
            <option value="timesWorn">Most Worn</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Items Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in sortedAndFilteredItems" :key="item.id" 
           class="bg-white rounded-lg shadow p-6">
        <div class="mb-4">
          <img v-if="item.image" :src="item.image" :alt="item.name" 
               class="w-full h-48 object-cover rounded" />
          <div v-else class="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
            <span class="text-gray-500">No image</span>
          </div>
        </div>
        <h3 class="text-lg font-semibold">{{ item.name }}</h3>
        <div class="mt-2 space-y-1">
          <p class="text-gray-600">Category: {{ item.category }}</p>
          <p class="text-gray-600">Color: {{ item.color }}</p>
          <p class="text-gray-600">Season: {{ item.season }}</p>
          <p class="text-gray-600">Times Worn: {{ item.timesWorn }}</p>
          <p class="text-gray-600 text-sm">Added: {{ item.dateAdded }}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="occasion in item.occasions" :key="occasion"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {{ occasion }}
            </span>
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <div>
            <button @click="openEditModal(item)" class="text-blue-600 hover:text-blue-800 mr-2">
              Edit
            </button>
            <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-800">
              Delete
            </button>
          </div>
          <button @click="wearItem(item.id)" class="btn-secondary text-sm">
            Wear Today
          </button>
        </div>
      </div>
    </div>

    <div v-if="!sortedAndFilteredItems.length" class="text-center py-12">
      <p class="text-gray-600">
        {{ wardrobeStore.items.length === 0 ? 'No items in your wardrobe yet. Start by adding some!' : 'No items match your filters.' }}
      </p>
    </div>

    <!-- Add/Edit Modal -->
    <AddEditItemModal
      :is-open="isModalOpen"
      :item="selectedItem"
      @close="closeModal"
      @submit="handleItemSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWardrobeStore } from '../stores/wardrobe'
import AddEditItemModal from '../components/AddEditItemModal.vue'
import type { ClothingItem, OutfitPlan } from '../stores/wardrobe'

const wardrobeStore = useWardrobeStore()
const isModalOpen = ref(false)
const selectedItem = ref<ClothingItem | null>(null)
const showAnalytics = ref(false)
const showOutfitPlanner = ref(false)
const sortBy = ref('dateAdded')

const filters = ref({
  search: '',
  category: '',
  season: ''
})

const outfitPlan = ref<Partial<OutfitPlan>>({
  date: new Date().toISOString().split('T')[0],
  occasion: 'Casual',
  name: '',
  items: []
})

const sortedAndFilteredItems = computed(() => {
  let filtered = wardrobeStore.items.filter(item => {
    const matchesSearch = !filters.value.search || 
      item.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      item.color.toLowerCase().includes(filters.value.search.toLowerCase())
    
    const matchesCategory = !filters.value.category || 
      item.category === filters.value.category
    
    const matchesSeason = !filters.value.season || 
      item.season === filters.value.season

    return matchesSearch && matchesCategory && matchesSeason
  })

  // Sort items
  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'dateAdded':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      case 'color':
        return a.color.localeCompare(b.color)
      case 'category':
        return a.category.localeCompare(b.category)
      case 'season':
        return a.season.localeCompare(b.season)
      case 'timesWorn':
        return b.timesWorn - a.timesWorn
      default:
        return 0
    }
  })
})

const openAddModal = () => {
  selectedItem.value = null
  isModalOpen.value = true
}

const openEditModal = (item: ClothingItem) => {
  selectedItem.value = item
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedItem.value = null
}

const handleItemSubmit = (itemData: Partial<ClothingItem>) => {
  if (selectedItem.value) {
    wardrobeStore.updateItem({ ...selectedItem.value, ...itemData })
  } else {
    wardrobeStore.addItem(itemData)
  }
}

const deleteItem = (id: number) => {
  if (confirm('Are you sure you want to delete this item?')) {
    wardrobeStore.removeItem(id)
  }
}

const wearItem = (id: number) => {
  wardrobeStore.wearItem(id)
}

const addOutfitPlan = () => {
  if (!outfitPlan.value.name) {
    alert('Please enter an outfit name')
    return
  }
  
  wardrobeStore.addOutfitPlan({
    id: Date.now(),
    date: outfitPlan.value.date || new Date().toISOString().split('T')[0],
    name: outfitPlan.value.name || '',
    occasion: outfitPlan.value.occasion || 'Casual',
    items: outfitPlan.value.items || []
  })

  // Reset form
  outfitPlan.value = {
    date: new Date().toISOString().split('T')[0],
    occasion: 'Casual',
    name: '',
    items: []
  }
}
</script>