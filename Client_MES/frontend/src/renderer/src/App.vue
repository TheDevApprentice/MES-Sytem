<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/AuthStore'
import TitleBar from './components/general/TitleBar.vue'
import LoadingSpinner from './components/general/LoadingOverlay.vue'
import InfoModal, { InfoModalType } from './components/general/InfoModal.vue'
import ThemeSwitcher from './components/dahboard/ThemeSwitcher.vue'
import LanguageSwitcher from './components/dahboard/LanguageSwitcher.vue'
import NotificationBell from './components/dahboard/NotificationBell.vue'
import ParamButton from './components/dahboard/ParamButton.vue'
import LogoutButton from './components/dahboard/LogoutButton.vue'
import Breadcrumb from './components/dahboard/Breadcrumb.vue'

const loading = ref(true)
const currentStage = ref(1)
const errorMessage = ref('')
const errorType = ref<InfoModalType>()
const stageLabels = [
  "Chargement de l'application",
  "Connexion à l'API",
  'Récupération des données',
  'Traitement des données',
  'Préparation de l’affichage',
  'Finalisation'
]
const totalStages = stageLabels.length
const stageLabel = ref(stageLabels[0])
const authStore = useAuthStore()
const showModal = ref(false)
const router = useRouter()

function redirectToLogin() {
  showModal.value = false
  loading.value = false
  router.push('/login')
}

onMounted(() => {
  let pingTimer: ReturnType<typeof setInterval> | null = null
  let step = 0
  currentStage.value = 1
  stageLabel.value = stageLabels[0]

  async function nextStage() {
    // Étape spéciale : Connexion à l'API → on tente une reauth
    if (stageLabels[step] === "Connexion à l'API") {
      // Récupère le nom d'affichage (non protégé) avant de vérifier la session
      // await authStore.getUserDisplayName();
      await authStore.getUserPreference()

      const ok = await authStore.reauth()
      if (!ok) {
        loading.value = false
        errorMessage.value = 'Votre session a expiré. Merci de vous reconnecter.'
        errorType.value = 'warning'
        showModal.value = true
        return
      }
    }
    if (step < stageLabels.length - 1) {
      step++
      currentStage.value = step + 1
      stageLabel.value = stageLabels[step]
      setTimeout(nextStage, 700)
    } else {
      setTimeout(() => {
        loading.value = false
      }, 900)
    }
  }

  /** Ping le backend tant qu'il n'est pas up (étape 1) */
  async function pingBackend() {
    // Affiche toujours l'étape 1
    currentStage.value = 1
    stageLabel.value = stageLabels[0]
    try {
      // @ts-ignore
      const up = await (window.electron as any).pingBackend()
      if (up) {
        if (pingTimer) clearInterval(pingTimer)
        // Lance la suite des étapes à partir de l'étape 2
        step = 1
        currentStage.value = 2
        stageLabel.value = stageLabels[step]
        setTimeout(() => nextStage(), 700)
      }
    } catch (e) {
      // Backend pas encore prêt → on attend
    }
  }

  pingTimer = setInterval(pingBackend, 1000)
  pingBackend()

  onUnmounted(() => {
    if (pingTimer) clearInterval(pingTimer)
  })
})
</script>

<template>
  <TitleBar />
  <div v-if="authStore.isAuthenticated" class="breadcrumb-container">
    <Breadcrumb />
  </div>
  <div class="top-btns">
    <NotificationBell v-if="authStore.isAuthenticated" class="notif-btn" />
    <LanguageSwitcher class="lang-btn" />
    <ThemeSwitcher class="theme-btn" />
    <ParamButton v-if="authStore.isAuthenticated" class="param-btn" />
    <LogoutButton v-if="authStore.isAuthenticated" class="logout-btn" />
  </div>
  <LoadingSpinner
    v-if="loading"
    :currentStage="currentStage"
    :totalStages="totalStages"
    :stageLabel="stageLabel"
  />
  <InfoModal
    v-else-if="showModal"
    :type="errorType"
    :message="errorMessage"
    :onOk="redirectToLogin"
    @close="redirectToLogin"
  />
  <div>
    <router-view />
  </div>
</template>

<style scoped>
/* Barre fixe contenant cloche, langue et thème */
.top-btns {
  position: fixed;
  top: 40px;
  right: 12px;
  display: flex;
  gap: 16px;
  z-index: 1000;
}
.breadcrumb-container {
  position: fixed;
  top: 40px;
  left: 100px;
}
.notif-btn {
  position: static;
}

.lang-btn {
  position: static;
}

.theme-btn {
  position: static;
}
</style>
