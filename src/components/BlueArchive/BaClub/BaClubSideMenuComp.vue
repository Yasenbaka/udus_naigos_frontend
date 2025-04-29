<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter();

const itemClicked = (routerName: string) => {
  router.push({name: routerName});
}

const menuList: Array<{title: string; router_name: string}> = [
  {title: '新增部团', router_name: 'BlueArchiveClubUpload'},
  {title: '更改部团', router_name: 'BlueArchiveClubUpdate'},
  {title: '删除部团', router_name: 'BlueArchiveClubDelete'},
]
</script>

<template>
  <el-aside style="width: 150px">
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          style="min-height: calc(100vh - 56px);"
          background-color="#1289f880"
          active-text-color="#ffd04b"
          text-color="#fff"
          default-active="BlueArchiveClubUpload"
        >
          <el-menu-item @click="itemClicked(item.router_name)" v-for="(item, index) in menuList" :index="item.router_name" :key="index">{{item.title}}</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<style scoped lang="css">

</style>
