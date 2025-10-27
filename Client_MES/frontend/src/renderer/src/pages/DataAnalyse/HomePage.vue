<template>
  <div class="home-container">
    <div class="home-header">
      <div class="home-title">Tableau de bord Analyse de données</div>
    </div>
    <div class="home-content">
      <div class="home-card main-card">
        <h2>Lien rapide</h2>
        <p>Accédez rapidement à vos fonctionnalités principales</p>
        <div class="home-actions">
          <button class="home-btn">Créer analyse</button>
          <button class="home-btn">Lancer une analyse</button>
          <button class="home-btn">Voir les analyses</button>
          <button class="home-btn">Paramètres analyse</button>
        </div>
      </div>
      <!-- <div class="home-side">
        <div class="home-card quick-card">
          <h3>Actions rapides</h3>
          <ul>
            <li><a href="#">Créer une analyse</a></li>
            <li><a href="#">Exporter une analyse</a></li>
          </ul>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/AuthStore';
const user = ref(useAuthStore().user);
</script>

<style scoped>

.home-container {
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
.home-container.menu-shift {
  margin-left: 220px;
}

.home-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 10px;
}
.home-logo {
  width: 44px;
  height: 44px;
  filter: drop-shadow(0 2px 8px #b03a7a33);
}
.home-title {
  font-size: 1.5em;
  font-weight: 600;
  color: var(--home-text-color);
  letter-spacing: 0.5px;
}
.username {
  color: var(--home-accent-color);
  font-weight: 700;
}
.home-content {
  display: flex;
  gap: 32px;
}
.home-card {
  background: var(--home-bg-card);
  border-radius: 14px;
  box-shadow: var(--home-card-shadow);
  padding: 30px 28px 24px 28px;
  color: var(--home-text-color);
  margin-bottom: 22px;
  transition: box-shadow 0.22s, transform 0.18s;
}
.home-card:hover {
  box-shadow: var(--home-card-shadow-hover);
  transform: translateY(-3px) scale(1.012);
}
.main-card {
  flex: 2;
}

/* KPI grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 22px;
  margin-top: 18px;
}
.kpi-item {
  background: var(--home-bg-card);
  border-radius: 10px;
  padding: 18px 20px;
  text-align: center;
  box-shadow: var(--home-card-shadow);
  transition: box-shadow 0.18s, transform 0.15s;
}
.kpi-item:hover {
  box-shadow: var(--home-card-shadow-hover);
  transform: translateY(-2px) scale(1.02);
}
.kpi-value {
  font-size: calc(2em * var(--user-font-scale));
  font-weight: 700;
  color: var(--home-accent-color);
  line-height: 1.1;
}
.kpi-label {
  font-size: calc(0.9em * var(--user-font-scale));
  color: var(--home-secondary-color);
  margin-top: 4px;
}
.home-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.home-actions {
  display: flex;
  gap: 18px;
  margin-top: 18px;
  flex-wrap: wrap;
}
.home-btn {
  background: var(--home-btn-gradient);
  color: var(--btn-color-text);
  border: none;
  border-radius: 7px;
  padding: 12px 22px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--home-btn-shadow);
  transition: background 0.18s, box-shadow 0.18s, transform 0.13s;
  margin-bottom: 8px;
}
.home-btn:hover {
  background: var(--home-btn-gradient-hover);
  box-shadow: var(--home-link-hover-shadow);
  transform: scale(1.04);
}
.info-card h3, .quick-card h3 {
  color: var(--home-secondary-color);
  font-size: 1.08em;
  margin-bottom: 8px;
}
.info-card ul, .quick-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.98em;
}
.info-card li, .quick-card li {
  margin-bottom: 5px;
}
.quick-card a {
  color: var(--home-accent-color);
  text-decoration: underline;
  transition: color 0.16s;
}
.quick-card a:hover {
  color: #e94090;
}
@media (max-width: 900px) {
  .home-content {
    flex-direction: column;
    gap: 18px;
  }
  .home-side {
    flex-direction: row;
    gap: 18px;
  }
  .main-card, .home-side {
    width: 100%;
  }
}
</style>
