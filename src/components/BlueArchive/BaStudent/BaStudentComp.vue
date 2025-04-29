<script setup lang="ts">

import BaStudentSideMenuComp from "@/components/BlueArchive/BaStudent/BaStudentSideMenuComp.vue";
</script>

<template>
  <el-container>
    <BaStudentSideMenuComp/>
    <el-main style="padding: 0; max-height: calc(100vh - 56px);">
      <RouterView/>
    </el-main>
  </el-container>
</template>

<style scoped lang="css">

</style>
