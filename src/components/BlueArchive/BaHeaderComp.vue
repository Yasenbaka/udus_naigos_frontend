<script setup lang="ts">
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import {onMounted, ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interface/UserArchiveImpl.ts";
import type {UserPermiImp} from "@/interface/UserPermiImp.ts";
import {httpSpring} from "@/utils/http.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
const userArchivePinia = useUserArchivePinia();

const userArchive = ref<UserArchiveImpl>(userArchivePinia.userArchive);
const userPermission = ref<UserPermiImp | null>(null);

const fetchUserPermission = () => {
  httpSpring({url: 'users/archive/me_permi', method: 'GET', headers: {Authorization: window.localStorage.getItem("token")}})
    .then(res => { if (res?.data?.code === 0) userPermission.value = res?.data?.data as UserPermiImp; else showMessageNotice('red', res?.data?.message);})
  .catch(() => {showExceptionNotice();});
}

onMounted(() => {
  fetchUserPermission();
})

watch(() => userArchivePinia.userArchive, (newVal: UserArchiveImpl) => {
  userArchive.value = newVal;
})
</script>

<template>
  <el-header height="56px" style="background-color: #ffd04b80; display: flex; align-items: center; justify-content: space-between; flex-direction: row">
    <div style="display: flex; align-items: center; gap: 16px;">
      <img style="width: 50px; border: white 2px solid" v-if="userArchive.avatar !== ''" :src="userArchive.avatar || ''" alt="avatar">
      <span style="font-weight: bold; font-size: 18px" v-if="userPermission">{{userArchive.nickname}} （{{userPermission.cn}}）</span>
    </div>
    <div style="display: flex; flex-direction: column; align-items: end;">
      <span style="font-size: 18px; font-weight: bold">管理BlueArchive相关</span>
      <span>BA内容区别于其他美化主题等作品内容而独立存储</span>
    </div>
  </el-header>
</template>

<style scoped lang="css">

</style>
