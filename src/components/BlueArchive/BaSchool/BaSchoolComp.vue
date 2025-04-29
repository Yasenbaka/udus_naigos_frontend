<script setup lang="ts">

import BaSchoolSideMenuComp from "@/components/BlueArchive/BaSchool/BaSchoolSideMenuComp.vue";
</script>

<template>
  <el-container>
    <BaSchoolSideMenuComp/>
    <el-main style="padding: 0">
      <RouterView/>
    </el-main>
  </el-container>

</template>

<style scoped lang="css">

</style>
