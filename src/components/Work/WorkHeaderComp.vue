<script setup lang="ts">
import defaultAvatar from "@/assets/About/default_avatar.jpg";
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interface/UserArchiveImpl.ts";
const userArchivePinia = useUserArchivePinia();

const userArchive = ref<UserArchiveImpl>(userArchivePinia.userArchive);

watch(() => userArchivePinia.userArchive, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
})

</script>

<template>
  <header class="work_header">
    <img class="work_header_avatar" :src="userArchive.avatar || defaultAvatar" alt="avatar"/>
    <h1 class="work_header_title">作品成果管理</h1>
    <p class="work_header_welcome_title" v-if="userArchive.group_real_user_id !== ''">欢迎您！{{userArchive.nickname}}</p>
  </header>
</template>

<style scoped>
@keyframes work_header_in {
  0%{
    width: 50%;
    opacity: 0;
  }
  100%{
    width: 80%;
    opacity: 1;
  }
}
.work_header:hover {
  background-color: rgba(222, 145, 169, 1);
}
.work_header {
  animation: work_header_in 1s;
  transition: background-color .3s ease;
  margin: 0 auto;
  width: 80%;
  background-color: rgba(222, 145, 169, 0.56);
  height: 120px;
  border-radius: 60px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .work_header_title{
    color: white;
  }
  .work_header_avatar {
    position: absolute;
    top: 50%;
    left: 1%;
    transform: translateY(-50%);
    height: 80%;
    border-radius: 50%;
  }
  .work_header_welcome_title {
    color: white;
    font-size: 18px;
  }
}
</style>
