<script setup lang="ts">
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import {onMounted} from "vue";
const userArchivePinia = useUserArchivePinia();

onMounted(() => {
  userArchivePinia.fetchUserArchive();
})
</script>

<template>
  <RouterView/>
</template>

<style scoped>
</style>
