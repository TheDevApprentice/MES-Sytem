<template>
  <div class="page-container">
    <div class="content-parameter">
      <div class="page-header">
        <span class="page-title">⚙️ Paramètres</span>
      </div>
      <div class="page-content">
        <span class="page-content-title">Préférences utilisateur</span>
        <form class="settings-form" @submit.prevent="onSave">
          <div class="setting">
            <span>Thème</span>
            <div class="theme-toggle">
              <span class="moon-icon" :class="{ active: prefs.darkMode }">🌙</span>
              <label class="switch">
                <input type="checkbox" v-model="prefs.darkMode" @change="toggleDarkMode" />
                <span class="slider"></span>
              </label>
              <span class="sun-icon" :class="{ active: !prefs.darkMode }">🌞</span>
            </div>
          </div>
          <div class="setting">
            <span>Langue</span>
            <div class="language-dropdown">
              <select v-model="languageStore.lang">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <!-- Affichage : Taille de police -->
          <div class="setting">
            <span>Taille de police</span>
            <div class="radio-group">
              <label><input type="radio" value="small" v-model="display.fontSize" /> Petite</label>
              <label
                ><input type="radio" value="normal" v-model="display.fontSize" /> Normale</label
              >
              <label><input type="radio" value="large" v-model="display.fontSize" /> Grande</label>
            </div>
          </div>

          <!-- Affichage : Densité -->
          <div class="setting">
            <span>Densité</span>
            <div class="radio-group">
              <label
                ><input type="radio" value="compact" v-model="display.density" /> Compacte</label
              >
              <label
                ><input type="radio" value="standard" v-model="display.density" /> Standard</label
              >
              <label
                ><input type="radio" value="spacious" v-model="display.density" /> Espacée</label
              >
            </div>
          </div>

          <!-- Accessibilité : contraste élevé -->
          <div class="setting">
            <span>Contraste élevé</span>
            <label class="switch">
              <input type="checkbox" v-model="display.highContrast" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Accessibilité : Réduire les animations -->
          <div class="setting">
            <span>Réduire les animations</span>
            <label class="switch">
              <input type="checkbox" v-model="display.reducedMotion" />
              <span class="slider"></span>
            </label>
          </div>

          <button type="submit" class="save-btn">Enregistrer</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@renderer/stores/ThemeStore'
import { useDisplayStore } from '@renderer/stores/DisplayStore'
import { reactive } from 'vue'
import { useLanguageStore } from '@renderer/stores/LanguageStore'

// État local des préférences (sera connecté au store / API plus tard)
const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const display = useDisplayStore()

// État local des préférences (sera connecté au store / API plus tard)
const prefs = reactive({
  darkMode: themeStore.theme,
  highContrast: display.highContrast,
  reducedMotion: display.reducedMotion,
  fontSize: display.fontSize,
  density: display.density,
  language: languageStore.lang
})

function toggleDarkMode() {
  themeStore.toggleTheme()
}

function onSave() {
  console.log('Préférences à sauvegarder', prefs)
  alert('Préférences sauvegardées (simulation)')
}
</script>

<style scoped>
.page-container {
  max-height: calc(100vh - 100px);
  width: calc(100vw - 100px);
  overflow-y: auto;
  /* hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 90px auto 0 70px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  transition: margin-left 0.26s cubic-bezier(0.7, 1.4, 0.6, 1);
  position: relative;
  z-index: 1;
}
.page-container::-webkit-scrollbar {
  display: none;
}
.page-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 10px;
}
.page-title {
  font-size: calc(1.5em * var(--user-font-scale));
  font-weight: 700;
  color: var(--home-text-color);
  letter-spacing: 0.5px;
}

.page-content {
  background: var(--home-bg-card);
  border-radius: 14px;
  box-shadow: var(--home-card-shadow);
  padding: calc(30px * var(--user-density-scale)) calc(28px * var(--user-density-scale))
    calc(24px * var(--user-density-scale)) calc(28px * var(--user-density-scale));
  color: var(--home-text-color);
  margin-bottom: calc(22px * var(--user-density-scale));
  transition:
    box-shadow 0.22s,
    transform 0.18s;
}
.page-content-title {
  position: relative;
  left: 0px;
  bottom: 15px;
  font-size: calc(1.2em * var(--user-font-scale));
  font-weight: 600;
  color: var(--home-text-color);
  letter-spacing: 0.5px;
}
.page-content:hover {
  box-shadow: var(--home-card-shadow-hover);
  transform: translateY(-3px) scale(1.012);
}
.content-parameter {
  width: 50%;
  padding: calc(30px * var(--user-density-scale)) calc(28px * var(--user-density-scale))
    calc(24px * var(--user-density-scale)) calc(28px * var(--user-density-scale));
  margin-bottom: calc(22px * var(--user-density-scale));
  transition:
    box-shadow 0.22s,
    transform 0.18s;
}
.content-parameter:hover {
  transform: translateY(-3px) scale(1.012);
}
.settings-form {
  display: flex;
  flex-direction: column;
  gap: calc(22px * var(--user-density-scale));
  width: 100%;
}
.setting {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 18px;
}
.setting span {
  flex: 1;
}
.setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.setting label span {
  font-weight: 500;
}
.setting input[type='checkbox'] {
  width: 20px;
  height: 20px;
  accent-color: var(--home-accent-color);
}
.setting select {
  min-width: 180px;
  padding: 8px 36px 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background: var(--color-background);
  color: var(--home-text-color);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 10' width='14' height='10' stroke='%2390caf9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='1 3 7 9 13 3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px 10px;
}

.save-btn {
  align-self: flex-start;
  background: var(--home-btn-gradient);
  color: var(--btn-color-text);
  border: none;
  border-radius: 7px;
  padding: calc(12px * var(--user-density-scale)) calc(28px * var(--user-density-scale));
  font-size: calc(1em * var(--user-font-scale));
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--home-btn-shadow);
  transition:
    background 0.18s,
    box-shadow 0.18s,
    transform 0.13s;
}
.save-btn:hover {
  background: var(--home-btn-gradient-hover);
  box-shadow: var(--home-link-hover-shadow);
  transform: scale(1.04);
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sun-icon,
.moon-icon {
  font-size: 20px;
  opacity: 0.5;
  transition: opacity 0.2s;
}
.sun-icon.active,
.moon-icon.active {
  opacity: 1;
}

/* Toggle switch */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 34px;
  transition:
    background 0.2s,
    border 0.2s;
}
.slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  top: 3px;
  background: var(--home-text-color);
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}
.switch input:checked + .slider {
  background: var(--home-accent-color);
  border-color: var(--home-accent-color);
}
.switch input:checked + .slider::before {
  transform: translateX(22px);
}

/* Styled checkbox */
.checkbox {
  position: relative;
  display: inline-block;
}
.checkbox input {
  opacity: 0;
  width: 0;
  height: 0;
}
.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--input-border);
  border-radius: 5px;
  display: inline-block;
  position: relative;
  transition:
    background 0.15s,
    border 0.15s;
}
.checkbox input:checked + .checkmark {
  background: var(--home-accent-color);
  border-color: var(--home-accent-color);
}
.checkbox input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6px;
  height: 10px;
  border: solid var(--btn-color-text);
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -50%) rotate(45deg);
}

/* Radio group custom */
.radio-group {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.radio-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 500;
  color: var(--home-text-color);
}
.radio-group input[type='radio'] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid var(--input-border);
  border-radius: 50%;
  position: relative;
  transition:
    background 0.15s,
    border 0.15s;
}
.radio-group input[type='radio']:checked {
  background: var(--home-accent-color);
  border-color: var(--home-accent-color);
}
.radio-group input[type='radio']:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: var(--btn-color-text);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

@media (max-width: 600px) {
  .setting {
    flex-direction: column;
    align-items: flex-start;
  }
  .setting label {
    width: 100%;
  }
  .save-btn {
    width: 100%;
  }
}
</style>
