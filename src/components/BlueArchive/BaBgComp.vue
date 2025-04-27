<script setup lang="ts">

</script>

<template>
  <div class="bg_box">
    <video class="bgv" src="@/assets/BlueArchive/home1.mp4" type="video/mp4" autoplay muted loop/>
  </div>
</template>

<style scoped lang="css">
.bg_box {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -5;
}
.bgv {
  min-height: 100%
}

.zhezhao {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .replace_bg {
    min-width: 100%;
    z-index: -2;
  }
}
</style>
