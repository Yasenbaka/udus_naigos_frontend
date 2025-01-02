<script setup lang="ts">
import BG from "@/assets/Note/Note_BG.jpg";
import zhezhao from "@/assets/Home/zhezhao.png";
</script>

<template>
  <div class="note_bg_box">
<!--    <img class="zhezhao" :src="zhezhao" alt="zhezhao"/>-->
    <img class="replace_bg" :src="BG" alt="bg"/>
  </div>
</template>

<style scoped lang="css">
.note_bg_box{
  position: fixed;
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
  z-index: -1;
}
.zhezhao{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.replace_bg {
  min-width: 100%;
  z-index: -2;
}
</style>

