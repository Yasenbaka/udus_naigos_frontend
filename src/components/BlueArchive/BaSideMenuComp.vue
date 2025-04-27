<script setup lang="ts">
import {onMounted, ref} from "vue";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {httpSpring} from "@/utils/http.ts";
import {useRouter} from "vue-router";
const router = useRouter();

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const subMenuClicked = (routerName: string) => {
  router.push({name: routerName});
}

onMounted(() => {
  if (!window.localStorage.getItem('token')) {
    showMessageNotice('red', '登录失效！');
    router.back();
  }
  else {
    httpSpring({
      url: 'users/archive/me_permi',
      method: 'GET',
      headers: {Authorization: window.localStorage.getItem('token')}
    }).then(res => {
      if (res?.data?.code === 0) {
        const permission: number = res.data?.data?.permissions as number;
        if (permission < 1 << 3) {
          menuList.value = [
            {title: '作品管理', router_name: 'BlueArchiveWork', sub_menu: [
                {title: '增删改查', router_name: 'BlueArchiveWorkUDUS'},
                {title: '作品认领', router_name: 'BlueArchiveClaim'},
                {title: '评论管理', router_name: 'BlueArchiveComment'}
              ]}
          ]
        }
        else {
          menuList.value = [
            {title: '作品管理', router_name: 'BlueArchiveWork', sub_menu: [
                {title: '增删改查', router_name: 'BlueArchiveWorkUDUS'},
                {title: '作品认领', router_name: 'BlueArchiveClaim'},
                {title: '评论管理', router_name: 'BlueArchiveComment'}
              ]},
            {title: '后台管理', router_name: 'BlueArchiveManage', sub_menu: [
                {title: '作品超管', router_name: 'BlueArchiveWorkAdmin'},
                {title: '学园', router_name: 'BlueArchiveSchool'},
                {title: '部团', router_name: 'BlueArchiveClub'},
                {title: '学生', router_name: 'BlueArchiveStudent'}
              ]},
          ]
        }
      }
      else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();})
  }
})

const menuList = ref<Array<{title: string, router_name: string, sub_menu: Array<{title: string, router_name: string}>}> | null>(null);
</script>

<template>
  <el-aside style="width: 250px;">
    <el-row class="tac">
      <el-col :span="24" style="max-height: 100vh; overflow: auto;">
        <!--              <h5 class="mb-2">Custom colors</h5>-->
        <el-menu
          style="min-height: 100vh;"
          active-text-color="#ffd04b"
          background-color="#1289f880"
          class="el-menu-vertical-demo"
          default-active="BlueArchiveWorkUDUS"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
          v-if="menuList"
        >
          <el-sub-menu v-for="(item, index) in menuList" :index="item.router_name" :key="index">
            <template #title>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item @click="subMenuClicked(subItem.router_name)" v-for="(subItem, subIndex) in item.sub_menu" :index="subItem.router_name" :key="subIndex">{{subItem.title}}</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<style scoped lang="css">

</style>
