<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import type {UserArchiveImp} from "@/interface/UserArchiveImp.ts";
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
const userArchivePinia = useUserArchivePinia();

const userArchive = ref<UserArchiveImp | null>(null);

onMounted(() => {
  userArchive.value = userArchivePinia.userArchive;
})

watch(() => userArchivePinia.userArchive, (newVal: UserArchiveImp) => {
  userArchive.value = newVal;
})
</script>

<template>
  <header>
    {{userArchive}}
  </header>
  <div>主界面，如果出现个人信息的JSON，证明成功带参转网。</div>
</template>

<style scoped lang="sass">

</style>
