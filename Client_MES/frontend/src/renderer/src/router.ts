import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import DashboardPage from './pages/DashboardPage/DashboardPage.vue';
import HomePage from './pages/DashboardPage/HomePage.vue';
import LoginPage from './pages/LoginPage.vue';
import MESHomePage from './pages/MES/HomePage.vue';
import ERPHomePage from './pages/ERP/HomePage.vue';
import CRMHomePage from './pages/CRM/HomePage.vue';
import RHHomePage from './pages/RH/HomePage.vue';
import ReportingHomePage from './pages/Reporting/HomePage.vue';
import ParametresPage from './pages/DashboardPage/ParametresPage.vue';
import RapportsPage from './pages/Reporting/RapportsPage.vue';
import TestPage from './pages/Test/TestPage.vue';
import TestHomePage from './pages/Test/HomePage.vue';
import { useAuthStore } from './stores/AuthStore';
import TestPageSpreadsheetUniver from './pages/Test/TestPageSpreadsheetUniver.vue';
import DataAnalyseHomePage from './pages/DataAnalyse/HomePage.vue';
import DataAnalysePage from './pages/DataAnalyse/DataAnalysePage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/home',
    component: DashboardPage,
    meta: { requiresAuth: true },
    children: [
      { path: 'home', name: 'Home', component: HomePage, meta: { requiresAuth: true } },
      { path: 'parametres', name: 'Parametres', component: ParametresPage, meta: { requiresAuth: true } },
      {
        path: 'mes',
        name: 'MES',
        children: [
          { path: '', redirect: '/mes/home' },
          { path: 'home', name: 'MESHome', component: MESHomePage, meta: { requiresAuth: true } },
          { path: 'ordres', name: 'Ordres', component: () => import('./pages/MES/OrdresPage.vue'), meta: { requiresAuth: true } },
          { path: 'ordres/:id', name: 'OrdreDetail', component: () => import('./pages/MES/OrdreDetailPage.vue'), meta: { requiresAuth: true } },
          { path: 'suivi-production', name: 'SuiviProduction', component: () => import('./pages/MES/SuiviProductionPage.vue'), meta: { requiresAuth: true } },
          { path: 'rapports', name: 'MESRapports', component: () => import('./pages/MES/RapportsPage.vue'), meta: { requiresAuth: true } },
          { path: 'parametres', name: 'MESParametres', component: () => import('./pages/MES/ParametresPage.vue'), meta: { requiresAuth: true } },
        ]
      },
      {
        path: 'erp',
        name: 'ERP',
        children: [
          { path: '', redirect: '/erp/home' },
          { path: 'home', name: 'ERPHome', component: ERPHomePage, meta: { requiresAuth: true } },
          { path: 'fournisseurs', name: 'Fournisseurs', component: () => import('./pages/ERP/FournisseursPage.vue'), meta: { requiresAuth: true } },
          { path: 'fournisseurs/:id', name: 'FournisseurDetail', component: () => import('./pages/ERP/FournisseurDetailPage.vue'), meta: { requiresAuth: true } },
          { path: 'commandes', name: 'Commandes', component: () => import('./pages/ERP/CommandesPage.vue'), meta: { requiresAuth: true } },
          { path: 'commandes/:id', name: 'CommandeDetail', component: () => import('./pages/ERP/CommandeDetailPage.vue'), meta: { requiresAuth: true } },
          { path: 'factures', name: 'Factures', component: () => import('./pages/ERP/FacturesPage.vue'), meta: { requiresAuth: true } },
          { path: 'factures/:id', name: 'FactureDetail', component: () => import('./pages/ERP/FactureDetailPage.vue'), meta: { requiresAuth: true } },
          { path: 'stocks', name: 'Stocks', component: () => import('./pages/ERP/StocksPage.vue'), meta: { requiresAuth: true } },
          { path: 'reporting', name: 'ERPReporting', component: () => import('./pages/ERP/ReportingPage.vue'), meta: { requiresAuth: true } },
          { path: 'parametres', name: 'ERPParametres', component: () => import('./pages/ERP/ParametresPage.vue'), meta: { requiresAuth: true } },
        ]
      },
      {
        path: 'crm',
        name: 'CRM',
        children: [
          { path: '', redirect: '/crm/home' },
          { path: 'home', name: 'CRMHome', component: CRMHomePage, meta: { requiresAuth: true } },
          { path: 'clients', name: 'Clients', component: () => import('./pages/CRM/ClientsPage.vue'), meta: { requiresAuth: true } },
          { path: 'clients/:id', name: 'ClientDetail', component: () => import('./pages/CRM/ClientDetailPage.vue'), meta: { requiresAuth: true } },
          { path: 'opportunites', name: 'Opportunites', component: () => import('./pages/CRM/OpportunitesPage.vue'), meta: { requiresAuth: true } },
          { path: 'opportunites/:id', name: 'OpportuniteDetail', component: () => import('./pages/CRM/OpportuniteDetailPage.vue'), meta: { requiresAuth: true } },
          { path: 'activites', name: 'Activites', component: () => import('./pages/CRM/ActivitesPage.vue'), meta: { requiresAuth: true } },
          { path: 'reporting', name: 'CRMReporting', component: () => import('./pages/CRM/ReportingPage.vue'), meta: { requiresAuth: true } },
          { path: 'parametres', name: 'CRMParametres', component: () => import('./pages/CRM/ParametresPage.vue'), meta: { requiresAuth: true } },
        ]
      },
      {
        path: 'reporting',
        name: 'Reporting',
        children: [
          { path: '', redirect: '/reporting/home' },
          { path: 'home', name: 'ReportingHome', component: ReportingHomePage, meta: { requiresAuth: true } },
          { path: 'rapports', name: 'Rapports', component: RapportsPage, meta: { requiresAuth: true } },
        ]
      },
      {
        path: 'rh',
        name: 'RH',
        children: [
          { path: '', redirect: '/rh/home' },
          { path: 'home', name: 'RHHome', component: RHHomePage, meta: { requiresAuth: true } },
          { path: 'employes', name: 'Employes', component: () => import('./pages/RH/EmployesPage.vue'), meta: { requiresAuth: true } },
          { path: 'employes/:id', name: 'EmployeDetail', component: () => import('./pages/RH/EmployeDetailPage.vue'), meta: { requiresAuth: true } },
          { path: 'absences', name: 'Absences', component: () => import('./pages/RH/AbsencesPage.vue'), meta: { requiresAuth: true } },
          { path: 'recrutement', name: 'Recrutement', component: () => import('./pages/RH/RecrutementPage.vue'), meta: { requiresAuth: true } },
          { path: 'candidats/:id', name: 'CandidatDetail', component: () => import('./pages/RH/CandidatDetailPage.vue'), meta: { requiresAuth: true } },
          { path: 'entretiens', name: 'Entretiens', component: () => import('./pages/RH/EntretiensPage.vue'), meta: { requiresAuth: true } },
          { path: 'reporting', name: 'RHReporting', component: () => import('./pages/RH/ReportingPage.vue'), meta: { requiresAuth: true } },
          { path: 'parametres', name: 'RHParametres', component: () => import('./pages/RH/ParametresPage.vue'), meta: { requiresAuth: true } },
        ]
      },
      {
        path: 'data-analyse',
        name: 'DataAnalyse',
        children: [
          { path: '', redirect: '/data-analyse/home' },
          { path: 'home', name: 'DataAnalyseHome', component: DataAnalyseHomePage, meta: { requiresAuth: true } },
          { path: 'console', name: 'DataAnalyseConsole', component: DataAnalysePage, meta: { requiresAuth: true } },
        ]
      },
      {
        path: 'test',
        name: 'Test',
        children: [
          { path: '', redirect: '/test/home' },
          { path: 'home', name: 'TestHome', component: TestHomePage, meta: { requiresAuth: true } },
          { path: 'test1', name: 'Test1', component: TestPage, meta: { requiresAuth: true } },
          { path: 'test2', name: 'Test2', component: TestPageSpreadsheetUniver, meta: { requiresAuth: true } },
        ]
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  }
 ];

// Ajoute automatiquement la meta.breadcrumb d'après le nom de la route
function addBreadcrumbMeta(records: RouteRecordRaw[]) {
  records.forEach(record => {
    record.meta = record.meta || {};
    record.meta.breadcrumb = record.meta.breadcrumb || (record.name as string);
    if (record.children) addBreadcrumbMeta(record.children);
  });
}
addBreadcrumbMeta(routes);

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


// Guard : redirige vers /login si non authentifié
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Root' });
  } else {
    next();
  }
});

// --- Ajout historique navigation ---
import { useHistoryStore } from './stores/HistoryStore';
import { watch } from 'vue';
import { nextTick } from 'vue';

router.afterEach((to) => {
  // On attend que Pinia soit bien initialisé
  nextTick(() => {
    try {
      const historyStore = useHistoryStore();
      historyStore.push(to);
    } catch (e) {
      // silent fail si le store n'est pas prêt
    }
  });
});

export default router;
