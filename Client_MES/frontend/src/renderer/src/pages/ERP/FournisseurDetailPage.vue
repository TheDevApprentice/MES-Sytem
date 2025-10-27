<template>
  <div class="page-container">
    <h1>Détail Fournisseur</h1>
    <p>Fiche détaillée du fournisseur sélectionné.</p>
  <form class="detail-form">
    <div class="form-group"><label>ID</label><input type="text" disabled /></div>
    <div class="form-group"><label>Nom</label><input type="text" disabled /></div>
    <div class="form-group"><label>Adresse</label><input type="text" disabled /></div>
    <div class="form-group"><label>Téléphone</label><input type="text" disabled /></div>
    <div class="form-group"><label>Email</label><input type="text" disabled /></div>
    <div class="form-group"><label>Historique commandes</label><ul><!-- TODO --></ul></div>
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
</style>
