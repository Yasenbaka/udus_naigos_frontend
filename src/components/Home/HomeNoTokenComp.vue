<script setup lang="ts">
const itemList: Array<{title: string, url: string}> = [
  {title: 'Naigos奶果服务站主页', url: 'https://naigos.cn'},
  {title: 'Naigos奶果服务站登录页', url: 'https://naigos.cn/sign'}
]

const itemClicked = (url: string) => {
  window.location.href = url;
}
</script>

<template>
  <div class="home_no_token_box">
    <p>未检测到登录状态便访问了 奶果空间 ，为了您的账号隐私安全。</p>
    <p>奶果空间不能为您提供登录服务。</p>
    <p>请您返回 <a href="https://naigos.cn">奶果服务站</a> 登录后通过 奶果服务站 访问本空间！</p>
    <p>若您在 奶果服务站 已经登录，请尝试再次从 奶果服务站 进入本空间</p>
  </div>
  <div class="home_no_token_item_box">
    <div class="home_no_token_item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item.url)">{{item.title}}</div>
  </div>
</template>

<style scoped lang="sass">
@keyframes home_no_token_in
  0%
    opacity: 0
    transform: translateY(-30px)
  100%
    opacity: 1
    transform: translateY(0)
@mixin home_no_token_in_ani
  animation: home_no_token_in forwards ease .5s .2s
@mixin home_no_token_item_in_ani
  animation: home_no_token_in forwards ease .5s .4s
.home_no_token_box
  @include home_no_token_in_ani()
  opacity: 0
  width: 100%
  background-color: #2c3e5080
  padding: 20px
  text-align: center
  color: white
  font-size: 20px
  p
    a
      text-decoration: none
      color: #a7d5ff
.home_no_token_item_box
  @include home_no_token_item_in_ani()
  opacity: 0
  display: flex
  gap: 30px
  .home_no_token_item:hover
    cursor: pointer
    background-color: #2c3e50
    transition: background-color .3s ease
  .home_no_token_item
    letter-spacing: 1px
    font-size: 18px
    padding: 10px
    background-color: #2c3e5080
    color: #fff
</style>
