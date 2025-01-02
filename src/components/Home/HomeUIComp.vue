<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter();

const itemList: Array<{title: string, router_name: string, img_url: string | null, title_en: string}> = [
  {title: '学习笔记（上传）', router_name: '', img_url: null, title_en: 'Upload Learning notes'},
  {title: '博客文章（上传）', router_name: 'UploadBlog', img_url: null, title_en: 'Upload Blog articles'},
  {title: '作品成果（上传）', router_name: 'UploadWorks', img_url: null, title_en: 'Upload Works'},
]
const itemClicked = (routerName: string) => {
  router.push({name: routerName});
}
</script>

<template>
  <div class="home_upload_item_box">
    <div class="home_upload_item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item.router_name)">
      <img class="home_upload_item_bg" src="@/assets/Home/button_title_bg.svg" alt="button_img"/>
      <div class="home_upload_item_inner">
        <p>{{item.title}}</p>
        <p>{{item.title_en}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.home_upload_item_box
  width: 100%
  display: flex
  gap: 30px
  flex-wrap: wrap
  justify-content: space-between
  .home_upload_item:hover
    background-color: #2c3e50
    cursor: pointer
  .home_upload_item
    transition: background-color .3s ease
    width: 500px
    height: 260px
    background-color: #2c3e5080
    position: relative
    overflow: hidden
    display: flex
    align-items: center
    justify-content: center
    .home_upload_item_bg
      position: absolute
      height: 100%
    .home_upload_item_inner
      text-align: center
      font-size: 24px
      color: white
</style>
