<script setup lang="ts">
import defaultAvatar from "@/assets/About/default_avatar.jpg";
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import {onMounted, ref, watch} from "vue";
import type {UserArchiveImp} from "@/interface/UserArchiveImp.ts";
const userArchivePinia = useUserArchivePinia();

const itemList: Array<{title: string, title_en: string, router_name: string}> = [
  {title: '所有文章', router_name: '', title_en: 'All articles'},
  {title: '所有学习', router_name: '', title_en: 'All learning'},
  {title: '所有作品', router_name: '', title_en: 'All works'},
  {title: '作品删除', router_name: '', title_en: 'Delete works'},
  {title: '作品修改', router_name: '', title_en: 'Update works'},
]

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
    <div class="home_func_item_box">
      <div class="home_func_item" v-for="(item, index) in itemList" :key="index">
        <img class="kuangbg" src="@/assets/Home/kuangbg.svg" alt="kuang"/>
        <div class="home_func_item_inner">
          <p>{{item.title}}</p>
          <p>{{item.title_en}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.home_user_card_func_item_box
  width: 100%
  height: 300px
  display: flex
  gap: 30px
  .home_func_item_box
    flex: 1
    display: flex
    gap: 30px
    flex-wrap: wrap
    justify-content: space-between
    .home_func_item:hover
      background-color: #2c3e50
      cursor: pointer
    .home_func_item
      transition: background-color .3s ease
      width: 260px
      height: 135px
      background-color: #2c3e5080
      display: flex
      align-items: center
      justify-content: center
      position: relative
      overflow: hidden
      .kuangbg
        position: absolute
      .home_func_item_inner
        text-align: center
        font-size: 20px
        color: white
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
</style>
