<script setup lang="ts">
import defaultAvatar from "@/assets/About/default_avatar.jpg";
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import {onMounted, ref, watch} from "vue";
import type {UserArchiveImp} from "@/interface/UserArchiveImp.ts";
const userArchivePinia = useUserArchivePinia();

const userArchive = ref<UserArchiveImp>({...userArchivePinia.userArchive});

onMounted(() => {
  if (window.localStorage.getItem('token')) {
    userArchive.value = userArchivePinia.userArchive;
  }
})

watch(() => userArchivePinia.userArchive, (newVal: UserArchiveImp) => {
  userArchive.value = newVal;
})
</script>

<template>
  <div class="home_user_card_func_item_box">
    <div class="home_user_card" v-if="userArchive">
      <img class="home_user_card_avatar" :src="userArchive?.avatar || defaultAvatar" alt="avatar" title="前往奶果服务个人中心页"/>
      <ul class="home_user_card_detail_box">
        <li>昵称 #UID：{{`${userArchive.nickname} #${userArchive.id}`}}</li>
        <li>电子邮箱：{{userArchive.email}}</li>
      </ul>
    </div>
    <div class="home_user_space_box">
      <p class="home_user_space_detail">最大存储空间：200 MB</p>
      <p class="home_user_space_detail">已用存储空间：0 MB</p>
      <p class="home_user_space_detail">剩余存储空间：200 MB</p>
      <p style="font-size: 18px">单击此卡条，进入个人奶果空间，管理个人存储内容</p>
<!--      <button>进入存储空间</button>-->
    </div>
  </div>
</template>

<style scoped lang="sass">
.home_user_card_func_item_box
  width: 100%
  height: 300px
  display: flex
  gap: 30px
  .home_user_card
    width: 30%
    height: 100%
    position: relative
    overflow: hidden
    background-color: #2c3e5090
    .home_user_card_detail_box
      li
        font-size: 18px
        color: white
    .home_user_card_avatar:hover
      opacity: .1
      cursor: pointer
    .home_user_card_avatar
      transition: opacity .3s ease
      opacity: 1
      width: 100%
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
  .home_user_space_box:hover
    background-color: #2c3e5095
    cursor: pointer
  .home_user_space_box
    transition: background-color .3s ease
    background-color: #2c3e5080
    flex: 1
    color: white
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    .home_user_space_detail
      font-size: 20px
</style>
