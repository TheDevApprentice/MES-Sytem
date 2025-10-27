<template>
  <!-- Profile Dropdown -->
  <div class="profile-container">
    <button @click="toggleProfile" class="profile-btn">
      <img :src="user.avatar" :alt="user.name" class="profile-avatar" />
      <div class="profile-info">
        <span class="profile-name">{{ user.name }}</span>
        <span class="profile-role">{{ user.role }}</span>
      </div>
      <svg
        class="profile-arrow"
        :class="{ 'arrow-open': profileOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Profile Dropdown -->
    <div
      class="profile-dropdown"
      :class="{ 'dropdown-open': profileOpen }"
      v-if="profileOpen"
    >
      <div class="dropdown-header">
        <div class="user-info">
          <img
            :src="user.avatar || 'https://via.placeholder.com/40'"
            :alt="user.name"
            class="user-avatar"
          />
          <div class="user-details">
            <p class="user-name">{{ user.name }}</p>
            <p class="user-email">{{ user.email }}</p>
          </div>
        </div>
      </div>
      <div class="dropdown-menu">
        <a
          href="#"
          class="dropdown-item"
          @click="$emit('profileAction', 'profile')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Mon Profil
        </a>
        <a
          href="#"
          class="dropdown-item"
          @click="$emit('profileAction', 'settings')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Paramètres
        </a>
        <div class="dropdown-divider"></div>
        <a
          href="#"
          class="dropdown-item text-red-600 dark:text-red-400"
          @click="$emit('profileAction', 'logout')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Déconnexion
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

// temporaire
interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  user: User;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  toggleMobile: [];
  profileAction: [action: string];
}>();

const headerRef = ref<HTMLElement | null>(null);
const profileOpen = ref(false);

const toggleProfile = () => {
  profileOpen.value = !profileOpen.value;
  // notificationsOpen.value = false;
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "À l'instant";
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${Math.floor(hours / 24)}j`;
};

onMounted(() => {
  if (headerRef.value) {
    gsap.fromTo(
      headerRef.value,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }
});
</script>

<style scoped>
@import "tailwindcss";

.dashboard-header {
  @apply bg-white dark:bg-gray-900 
           border-b border-gray-200 dark:border-gray-700 
           shadow-sm sticky top-0 z-30;
}

.header-content {
  @apply flex items-center justify-between px-6 py-4;
}

.header-left {
  @apply flex items-center space-x-4;
}

.mobile-menu-btn {
  @apply p-2 text-gray-600 dark:text-gray-300 
           hover:bg-gray-100 dark:hover:bg-gray-800 
           rounded-lg transition-colors duration-200;
}

.header-title {
  @apply space-y-1;
}

.title-text {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

.subtitle-text {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.header-center {
  @apply flex-1 max-w-md mx-8;
}

.header-right {
  @apply flex items-center space-x-4;
}

.header-actions {
  @apply flex items-center space-x-2;
}

.dropdown-open {
  @apply opacity-100 scale-100 pointer-events-auto;
}

.dropdown-header {
  @apply p-4 border-b border-gray-200 dark:border-gray-700;
}

.dropdown-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.icon-wrapper {
  @apply w-8 h-8 rounded-full flex items-center justify-center;
}

.icon-wrapper.info {
  @apply bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400;
}

.icon-wrapper.success {
  @apply bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400;
}

.icon-wrapper.warning {
  @apply bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400;
}

.icon-wrapper.error {
  @apply bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400;
}

.profile-container {
  @apply relative;
}

.profile-btn {
  @apply flex items-center space-x-3 p-2 
           text-gray-700 dark:text-gray-300 
           hover:bg-gray-100 dark:hover:bg-gray-800 
           rounded-lg transition-colors duration-200;
}

.profile-avatar {
  @apply w-8 h-8 rounded-full object-cover;
}

.profile-info {
  @apply hidden md:block text-left;
}

.profile-name {
  @apply block text-sm font-medium text-gray-900 dark:text-white;
}

.profile-role {
  @apply block text-xs text-gray-500 dark:text-gray-400;
}

.profile-arrow {
  @apply w-4 h-4 transition-transform duration-200;
}

.arrow-open {
  @apply rotate-180;
}

.profile-dropdown {
  @apply w-64;
}

.user-info {
  @apply flex items-center space-x-3;
}

.user-avatar {
  @apply w-10 h-10 rounded-full object-cover;
}

.user-details {
  @apply flex-1;
}

.user-name {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.user-email {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.dropdown-menu {
  @apply py-2;
}

.dropdown-item {
  @apply flex items-center space-x-3 px-4 py-2 
           text-sm text-gray-700 dark:text-gray-300 
           hover:bg-gray-100 dark:hover:bg-gray-700 
           transition-colors duration-200;
}

.dropdown-divider {
  @apply my-2 border-t border-gray-200 dark:border-gray-700;
}
</style>
