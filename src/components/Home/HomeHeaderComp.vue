<script setup lang="ts">

</script>

<template>
  <header class="udus_header">
    <p>增删改查-奶果空间管理</p>
    <h1 class="header_udus_title_en">
      U<span class="header_udus_title_detail">pload</span>
      D<span class="header_udus_title_detail">elete</span>
      U<span class="header_udus_title_detail">pdate</span>
      S<span class="header_udus_title_detail">elect</span>
    </h1>
    <h2 class="header_udus_title_zh">在这里管理您的文章、作品、存储</h2>
  </header>
</template>

<style scoped lang="sass">
@keyframes home_header_in
  0%
    transform: translateY(-50px)
  100%
    transform: translateY(0)
@mixin home_header_in_ani
  animation: home_header_in forwards ease .5s
.udus_header
  @include home_header_in_ani()
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 90vw
  height: 150px
  margin: 0 auto
  background-color: #2c3e5090
  color: white
  text-align: center
  font-size: 20px
  .header_udus_title_en
    transform: translateY(-10px)
    .header_udus_title_detail
      font-size: 20px
  .header_udus_title_zh
    transform: translateY(-10px)
    font-size: 20px
  p
    margin: 0
    padding: 0
    font-size: 16px
    letter-spacing: 2px
</style>
