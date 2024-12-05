import {defineStore} from "pinia";
import {httpSpring} from "@/utils/http.ts";

export const useUserArchivePinia = defineStore('UserArchivePinia', {
  state: () => ({
    userArchive: {
      id: 0,
      qq_id: 0,
      nickname: '',
      group_real_user_id: '',
      register_real_group_id: '',
      city: '',
      score: 0,
      avatar: '',
      favorite: 0,
      email: '',
      safe_level: 0,
    }
  }),
  actions: {
    fetchUserArchive() {
      if (window.localStorage.getItem('token')){
        httpSpring({
          url: 'users/archive/current',
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: window.localStorage.getItem('token'),
          }
        }).then(res => {
          if (res.status === 200 && res?.data?.code === 0) {
            this.userArchive = res?.data?.data;
          } else window.localStorage.removeItem('token');
        }).catch((err) => {
          console.error(err);
          window.localStorage.removeItem('token');
        })
      }
    },
  }
})
