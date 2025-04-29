<script setup lang="ts">

import BaSchoolSideMenuComp from "@/components/BlueArchive/BaSchool/BaSchoolSideMenuComp.vue";
</script>

<template>
  <el-container>
    <BaSchoolSideMenuComp/>
    <el-main style="padding: 0; max-height: calc(100vh - 56px);">
      <RouterView/>
    </el-main>
  </el-container>

</template>

<style scoped lang="css">

</style>
