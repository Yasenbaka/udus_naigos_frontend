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
  <header class="note_header_box">
    <img class="note_header_avatar" :src="userArchive.avatar || defaultAvatar" alt="avatar"/>
    <h1 class="note_header_title">学习笔记管理</h1>
    <p class="note_header_welcome_title" v-if="userArchive.group_real_user_id !== ''">欢迎您！{{userArchive.nickname}}</p>
  </header>
</template>

<style scoped>
.note_header_box {
  margin: 0 auto;
  width: 80%;
  background-color: #42445b90;
  height: 120px;
  border-radius: 60px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .note_header_title{
    color: white;
  }
  .note_header_avatar {
    position: absolute;
    top: 50%;
    left: 1%;
    transform: translateY(-50%);
    height: 80%;
    border-radius: 50%;
  }
  .note_header_welcome_title {
    color: white;
    font-size: 18px;
  }
}
</style>
