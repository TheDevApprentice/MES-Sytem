<template>
  <div class="page-container">
    <h1>Détail Commande</h1>
    <p>Fiche détaillée de la commande sélectionnée.</p>
  <form class="detail-form">
    <div class="form-group"><label>Réf</label><input type="text" disabled /></div>
    <div class="form-group"><label>Date</label><input type="text" disabled /></div>
    <div class="form-group"><label>Statut</label><input type="text" disabled /></div>
    <div class="form-group"><label>Lignes de commande</label><table class="nested-table"><!-- TODO --></table></div>
  </form>
  </div>
</template>
<script setup lang="ts">
</script>

<style scoped>
.page-container { padding: 24px; }
.detail-form { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-weight: 600; margin-bottom: 4px; }
.form-group input { padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
.nested-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
.nested-table td, .nested-table th { border: 1px solid #ddd; padding: 6px; }
</style>
