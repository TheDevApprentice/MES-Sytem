<script setup lang="ts">
import { ref, computed } from 'vue'
import InfoModal, { InfoModalType } from '../components/general/InfoModal.vue'
import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')
const loading = ref(false)
const showModal = ref(false)
const errorMessage = ref('')
const errorType = ref<InfoModalType>('error')
const router = useRouter()

import { useAuthStore } from '../stores/AuthStore'

const authStore = useAuthStore()

const greeting = computed(() =>
  authStore.user ? `Bonjour, ${authStore.user}` : 'Nouvelle visite ?'
)

async function handleLogin() {
  errorMessage.value = ''
  errorType.value = 'error'
  showModal.value = false
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.push('/')
  } else {
    errorMessage.value = authStore.error || "L'email ou le mot de passe est incorrect."
    errorType.value = 'error'
    showModal.value = true
  }
}

function clearFields() {
  username.value = ''
  password.value = ''
  showModal.value = false
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <img alt="logo" class="logo" src="../assets/electron.svg" />
      <div class="greeting">{{ greeting }}</div>
      <div class="text">Connectez-vous à votre espace</div>
      <form @submit.prevent="handleLogin">
        <input
          v-model="username"
          type="text"
          placeholder="Nom d'utilisateur"
          autocomplete="username"
          class="input"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          autocomplete="current-password"
          class="input"
          required
        />
        <button class="btn" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>
    <InfoModal
      v-if="showModal"
      :type="errorType"
      :message="errorMessage"
      :onOk="clearFields"
      @close="clearFields"
    />
  </div>
</template>

<style scoped>
.login-container {
  max-height: calc(100vh - 100px);
  width: calc(100vw - 100px);
  overflow-y: auto;
  /* hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 90px auto 0 70px;
}

.login-card {
  margin: 70px auto 0 auto;
  max-width: 350px;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 40px 0 rgba(0, 0, 0, 0.18);
  padding: 36px 32px 30px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.25s cubic-bezier(0.4, 2, 0.6, 1);
  background: var(--color-background); 
  color: var(--color-text);
}

.login-card:hover {
  box-shadow:
    0 8px 60px 0 rgba(90, 30, 140, 0.28),
    0 1.5px 12px 0 rgba(44, 62, 120, 0.1);
}

.theme-switcher {
  margin-top: 16px;
  font-size: 0.9em;
}

.theme-switcher select {
  margin-left: 8px;
  padding: 4px 6px;
}

.logo {
  width: 60px;
  margin-bottom: 18px;
}
.creator {
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 8px;
}
.greeting {
  margin-bottom: 12px;
  font-size: 1.1em;
  font-weight: 600;
  opacity: 0.9;
  color: var(--color-text);
}

.text {
  margin-bottom: 22px;
  font-size: 1.05em;
  opacity: 0.85;
  color: var(--color-text);
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input {
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 1em;
  outline: none;
  transition:
    border 0.18s,
    box-shadow 0.22s;
  box-shadow: 0 0 0 0 rgba(90, 30, 140, 0);
  background: var(--input-bg);
  color: var(--color-text);
  border: 1px solid var(--input-border);
}

.input:focus {
  border: 1.5px solid var(--input-focus-border);
  box-shadow: 0 0 8px 0 var(--input-focus-shadow);
}
.input:hover {
  border: 1.5px solid var(--input-hover-border);
  box-shadow: 0 0 7px 0 var(--input-hover-shadow);
}

.btn {
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  color: var(--btn-color-text);
  transition:
    background 0.18s,
    filter 0.18s,
    box-shadow 0.23s,
    transform 0.12s;
  background: linear-gradient(90deg, var(--btn-gradient-start) 0%, var(--btn-gradient-end) 100%);
  box-shadow: 0 2px 8px 0 var(--btn-shadow);
}
.btn:disabled {
  filter: grayscale(0.4);
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  background: linear-gradient(
    90deg,
    var(--btn-gradient-hover-start) 0%,
    var(--btn-gradient-hover-end) 100%
  );
  box-shadow:
    0 0 16px 0 var(--btn-hover-shadow-1),
    0 2px 10px 0 var(--btn-hover-shadow-2);
  filter: brightness(1.06);
}
.btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 1px 4px 0 var(--btn-hover-shadow-2);
}
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--btn-focus-outline);
}
/* 
.theme-btn {
  position: absolute;
  top: 14px;
  right: 14px;
} */

.error {
  font-size: 0.97em;
  margin-top: 4px;
  text-align: center;
  color: var(--error-color);
  letter-spacing: 0.2px;
}
</style>
