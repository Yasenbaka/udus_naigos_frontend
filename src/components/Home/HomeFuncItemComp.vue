<script setup lang="ts">
const itemList: Array<{title: string, title_en: string, router_name: string}> = [
  {title: '所有文章', router_name: '', title_en: 'All articles'},
  {title: '所有学习', router_name: '', title_en: 'All learning'},
  {title: '所有作品', router_name: '', title_en: 'All works'},
  {title: '作品删除', router_name: '', title_en: 'Delete works'},
  {title: '作品修改', router_name: '', title_en: 'Update works'},
]
</script>

<template>
  <div class="home_func_item_box">
    <div class="home_func_item" v-for="(item, index) in itemList" :key="index">
      <img class="kuangbg" src="@/assets/Home/kuangbg.svg" alt="kuang"/>
      <div class="home_func_item_inner">
        <p>{{item.title}}</p>
        <p>{{item.title_en}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
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
</style>
