<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-3xl font-bold text-center mb-8">Login</h2>
    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="input-field"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="input-field"
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" class="w-full btn-primary">Login</button>
      <p class="text-center text-gray-600">
        Don't have an account?
        <router-link to="/register" class="text-blue-600 hover:text-blue-800">Register</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    // TODO: Implement actual login logic with Laravel backend
    authStore.setUser({ email: email.value })
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>