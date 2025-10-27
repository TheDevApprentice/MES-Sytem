import { defineStore } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';

interface HistoryCrumb {
  name: string;
  path: string;
  meta: any;
  params: Record<string, any>;
}

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: [] as HistoryCrumb[],
  }),
  actions: {
    push(route: RouteLocationNormalized) {
      // Si on revient en arrière, on coupe l'historique jusqu'à la route courante
      const idx = this.history.findIndex(
        (c) => c.name === route.name && JSON.stringify(c.params) === JSON.stringify(route.params)
      );
      if (idx !== -1) {
        this.history = this.history.slice(0, idx + 1);
        return;
      }
      // Sinon, on ajoute la route si ce n'est pas un doublon consécutif
      if (
        this.history.length === 0 ||
        this.history[this.history.length - 1].name !== route.name ||
        JSON.stringify(this.history[this.history.length - 1].params) !== JSON.stringify(route.params)
      ) {
        this.history.push({
          name: route.name as string,
          path: route.path,
          meta: route.meta,
          params: { ...route.params },
        });
      }
    },
    reset() {
      this.history = [];
    },
  },
});
