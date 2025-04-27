<script setup lang="ts">
import BaBgComp from "@/components/BlueArchive/BaBgComp.vue";
import BaSideMenuComp from "@/components/BlueArchive/BaSideMenuComp.vue";
import BaHeaderComp from "@/components/BlueArchive/BaHeaderComp.vue";

</script>

<template>
  <BaBgComp/>
  <el-container>
    <BaSideMenuComp/>
    <el-main style="padding: 0">
      <BaHeaderComp/>
      <RouterView/>
    </el-main>
  </el-container>
</template>

<style scoped lang="css">
.avatar{
  background-color: #545c64;
}
.--el-menu-bg-color {
  background: #1289f8;
}
</style>
