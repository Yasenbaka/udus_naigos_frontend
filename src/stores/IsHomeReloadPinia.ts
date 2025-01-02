import {defineStore} from "pinia";

export const useIsHomeReloadPinia = defineStore("IsHomeReloadPinia", {
  state: () => ({
    isHomeReload: false
  }),
  actions: {
    changeStateTrue() {
      this.isHomeReload = true;
    }
  }
})
