<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter();

interface ItemImpl {
  title: string; router_name: string;
}
const itemList: Array<ItemImpl> = [
  {title: '所有作品', router_name: 'Work'},
  {title: '评论管理', router_name: 'WorkComment'},
  {title: '反馈管理', router_name: 'WorkFeedback'},
]
const itemClicked = (router_name: string) => {
  router.replace({name: router_name});
}
</script>

<template>
  <div class="work_func_box">
    <div class="work_func_item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item.router_name)">{{item.title}}</div>
  </div>
</template>

<style scoped lang="css">
.work_func_box {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  .work_func_item:hover {
    cursor: pointer;
    background-color: rgba(222, 145, 169, 1);
  }
  .work_func_item{
    transition: background-color .3s ease;
    width: 120px;
    height: 120px;
    background-color: rgba(222, 145, 169, 0.56);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: white;
    letter-spacing: 1px;
  }
}
</style>
