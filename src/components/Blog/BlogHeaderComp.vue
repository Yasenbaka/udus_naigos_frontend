<script setup lang="ts">
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interface/UserArchiveImpl.ts";
const userArchivePinia = useUserArchivePinia();

const userArchive = ref<UserArchiveImpl>(userArchivePinia.userArchive);

watch(() => userArchivePinia.userArchive, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
});
</script>

<template>
  <header class="blog_header">
    <h1 class="blog_header_title">博客文章管理</h1>
    <p class="blog_welcome_title">欢迎您！{{userArchive.nickname}} #{{userArchive.id}}</p>
  </header>
</template>

<style scoped lang="css">
.blog_header {
  margin: 0 auto;
  width: 80%;
  height: 120px;
  background-color: #fdaf5b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .blog_header_title{
    color: white;
  }
  .blog_welcome_title{
    color: white;
  }
}
</style>
