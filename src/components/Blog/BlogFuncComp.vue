<script setup lang="ts">
interface ItemImpl {
  title: string; router_name: string; explain?: string;
}
const itemList: Array<ItemImpl> = [
  {title: '所有文章', router_name: 'Blog'},
  {title: '上传文章', router_name: 'BlogUpload'},
  {title: '评论管理', router_name: 'BlogCommand'}
]
</script>

<template>
  <div class="blog_func_box">
    <div class="blog_func_item" v-for="item in itemList" :key="item.router_name">{{item.title}}</div>
  </div>
</template>

<style scoped lang="css">
.blog_func_box{
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .blog_func_item:hover{
    cursor: pointer;
    background-color: #6784a1;
  }
  .blog_func_item{
    transition: .3s ease;
    height: 40px;
    color: white;
    flex: 1;
    background-color: #8ea4c8;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
