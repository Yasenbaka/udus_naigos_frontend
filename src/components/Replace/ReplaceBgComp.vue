<script setup lang="ts">
import zhezhao from "@/assets/Home/zhezhao.png";
import replaceBg from "@/assets/Replace/bg.jpg";
</script>

<template>
  <div class="replace_bg_box">
    <img class="zhezhao" :src="zhezhao" alt="zhezhao"/>
    <img class="replace_bg" :src="replaceBg" alt="bg"/>
  </div>
</template>

<style scoped lang="sass">
.replace_bg_box
  position: fixed
  width: 100%
  max-height: 100vh
  overflow: hidden
  z-index: -1
  .zhezhao
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
  .replace_bg
    min-width: 100%
    z-index: -2
</style>
