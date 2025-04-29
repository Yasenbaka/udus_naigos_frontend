<script setup lang="ts">

import BaClubSideMenuComp from "@/components/BlueArchive/BaClub/BaClubSideMenuComp.vue";
</script>

<template>
  <el-container>
    <BaClubSideMenuComp/>
    <el-main style="padding: 0; max-height: calc(100vh - 56px);">
      <RouterView/>
    </el-main>
  </el-container>
</template>

<style scoped lang="css">

</style>
