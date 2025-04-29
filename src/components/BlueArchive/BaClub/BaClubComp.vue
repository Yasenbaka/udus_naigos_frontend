<script setup lang="ts">

import BaClubSideMenuComp from "@/components/BlueArchive/BaClub/BaClubSideMenuComp.vue";
</script>

<template>
  <el-container>
    <BaClubSideMenuComp/>
    <el-main style="padding: 0">
      <RouterView/>
    </el-main>
  </el-container>
</template>

<style scoped lang="css">

</style>
