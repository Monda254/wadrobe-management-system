import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ClothingItem {
  id: number
  name: string
  category: string
  color: string
  season: string
  image?: string
  dateAdded: string
  timesWorn: number
  lastWorn?: string
  occasions: string[]
}

export interface OutfitPlan {
  id: number
  date: string
  name: string
  items: number[]
  occasion: string
}

export const useWardrobeStore = defineStore('wardrobe', () => {
  const items = ref<ClothingItem[]>([])
  const outfitPlans = ref<OutfitPlan[]>([])
  
  const categories = ref([
    'Tops',
    'Bottoms',
    'Dresses',
    'Shoes',
    'Accessories',
    'Outerwear',
    'Formal Wear'
  ])

  const occasions = ref([
    'Casual',
    'Formal',
    'Business',
    'Vacation',
    'Sports',
    'Party',
    'Date Night'
  ])

  // Initialize with sample items
  if (items.value.length === 0) {
    const sampleItems: ClothingItem[] = [
      {
        id: 1,
        name: 'Blue Jeans',
        category: 'Bottoms',
        color: 'Blue',
        season: 'All Seasons',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=500',
        dateAdded: '2024-03-01',
        timesWorn: 5,
        lastWorn: '2024-03-15',
        occasions: ['Casual']
      },
      {
        id: 2,
        name: 'White T-Shirt',
        category: 'Tops',
        color: 'White',
        season: 'Summer',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500',
        dateAdded: '2024-03-02',
        timesWorn: 3,
        lastWorn: '2024-03-14',
        occasions: ['Casual', 'Sports']
      },
      {
        id: 3,
        name: 'Leather Jacket',
        category: 'Outerwear',
        color: 'Black',
        season: 'Fall',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=500',
        dateAdded: '2024-03-03',
        timesWorn: 2,
        lastWorn: '2024-03-12',
        occasions: ['Casual', 'Date Night']
      },
      {
        id: 4,
        name: 'Floral Dress',
        category: 'Dresses',
        color: 'Multi',
        season: 'Spring',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=500',
        dateAdded: '2024-03-04',
        timesWorn: 1,
        lastWorn: '2024-03-10',
        occasions: ['Party', 'Date Night']
      },
      {
        id: 5,
        name: 'Black Suit',
        category: 'Formal Wear',
        color: 'Black',
        season: 'All Seasons',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=500',
        dateAdded: '2024-03-05',
        timesWorn: 1,
        occasions: ['Formal', 'Business']
      },
      {
        id: 6,
        name: 'Running Shoes',
        category: 'Shoes',
        color: 'Gray',
        season: 'All Seasons',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500',
        dateAdded: '2024-03-06',
        timesWorn: 8,
        lastWorn: '2024-03-16',
        occasions: ['Sports', 'Casual']
      },
      {
        id: 7,
        name: 'Summer Dress',
        category: 'Dresses',
        color: 'Yellow',
        season: 'Summer',
        image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=500',
        dateAdded: '2024-03-07',
        timesWorn: 0,
        occasions: ['Casual', 'Vacation']
      }
    ]
    items.value.push(...sampleItems)
  }

  // Analytics
  const categoryBreakdown = computed(() => {
    const breakdown: Record<string, number> = {}
    categories.value.forEach(category => {
      breakdown[category] = items.value.filter(item => item.category === category).length
    })
    return breakdown
  })

  const mostWornItems = computed(() => {
    return [...items.value]
      .sort((a, b) => b.timesWorn - a.timesWorn)
      .slice(0, 5)
  })

  const leastWornItems = computed(() => {
    return [...items.value]
      .sort((a, b) => a.timesWorn - b.timesWorn)
      .slice(0, 5)
  })

  const seasonalSuggestions = computed(() => {
    const currentMonth = new Date().getMonth()
    let currentSeason: string
    
    if (currentMonth >= 2 && currentMonth <= 4) currentSeason = 'Spring'
    else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = 'Summer'
    else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = 'Fall'
    else currentSeason = 'Winter'

    return items.value.filter(item => 
      item.season === currentSeason || item.season === 'All Seasons'
    )
  })

  function addItem(item: Partial<ClothingItem>) {
    const newItem: ClothingItem = {
      id: Date.now(),
      name: item.name || '',
      category: item.category || categories.value[0],
      color: item.color || '',
      season: item.season || 'All Seasons',
      image: item.image,
      dateAdded: new Date().toISOString().split('T')[0],
      timesWorn: 0,
      occasions: item.occasions || ['Casual']
    }
    items.value.push(newItem)
  }

  function updateItem(updatedItem: ClothingItem) {
    const index = items.value.findIndex(item => item.id === updatedItem.id)
    if (index !== -1) {
      items.value[index] = updatedItem
    }
  }

  function removeItem(id: number) {
    items.value = items.value.filter(item => item.id !== id)
  }

  function wearItem(id: number) {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.timesWorn++
      item.lastWorn = new Date().toISOString().split('T')[0]
    }
  }

  function addOutfitPlan(plan: OutfitPlan) {
    outfitPlans.value.push(plan)
  }

  function removeOutfitPlan(id: number) {
    outfitPlans.value = outfitPlans.value.filter(plan => plan.id !== id)
  }

  return {
    items,
    categories,
    occasions,
    outfitPlans,
    categoryBreakdown,
    mostWornItems,
    leastWornItems,
    seasonalSuggestions,
    addItem,
    updateItem,
    removeItem,
    wearItem,
    addOutfitPlan,
    removeOutfitPlan
  }
})