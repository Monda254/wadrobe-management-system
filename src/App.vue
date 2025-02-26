<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/" class="flex items-center">
              <span class="text-xl font-bold text-gray-800">Wardrobe Manager</span>
            </router-link>
          </div>
          <div class="flex items-center">
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="btn-primary mr-2">Login</router-link>
              <router-link to="/register" class="btn-primary">Register</router-link>
            </template>
            <template v-else>
              <router-link to="/dashboard" class="btn-primary mr-2">Dashboard</router-link>
              <button @click="logout" class="btn-primary">Logout</button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>