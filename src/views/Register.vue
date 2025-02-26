<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-3xl font-bold text-center mb-8">Register</h2>
    <form @submit.prevent="handleRegister" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="input-field"
          placeholder="Enter your name"
        />
      </div>
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
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          class="input-field"
          placeholder="Confirm your password"
        />
      </div>
      <button type="submit" class="w-full btn-primary">Register</button>
      <p class="text-center text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:text-blue-800">Login</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }

  try {
    // TODO: Implement actual registration logic with Laravel backend
    authStore.setUser({ name: name.value, email: email.value })
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>