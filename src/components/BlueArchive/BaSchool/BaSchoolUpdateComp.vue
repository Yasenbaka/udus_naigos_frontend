<script setup lang="ts">
import "@/components/BlueArchive/BaSchoolCSS.css";
import type {BaSchoolImpl} from "@/interface/BlueArchiveImpl.ts";
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {useRouter} from "vue-router";
const router = useRouter();

const schoolList = ref<Array<BaSchoolImpl> | null>(null);
const schoolForm = ref<BaSchoolImpl | null>(null);

const updateSchoolClicked = () => {
  if (
    schoolForm.value
    && schoolForm.value.id !== ''
    && schoolForm.value.cn_name !== ''
    && schoolForm.value.logo !== ''
  ) {
    httpSpring({
      url: 'ba/school/up_school',
      method: 'POST',
      headers: {Authorization: window.localStorage.getItem("token")},
      data: schoolForm.value,
      params: {up_type: 'update'}
    }).then(res => {
      if (res?.data?.code === 0) {
        showMessageNotice('green', res?.data?.message);
        router.go(0);
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
  }
}

const fetchAllSchool = () => {
  httpSpring({url: 'ba/school/all', method: 'GET'})
    .then(res => {
      if (res?.data?.code === 0) {
        schoolList.value = res?.data?.data;
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
}

const fetchSchool = (school_id: string) => {
  httpSpring({url: 'ba/school/only', method: 'GET', params: {school_id}})
    .then(res => {
      if (res?.data?.code === 0) {
        schoolForm.value = res?.data?.data;
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
}

onMounted(() => {
  fetchAllSchool();
})
</script>

<template>
  <div class="schools_box" v-if="schoolList">
    <div @click="fetchSchool(item.id)" class="school_item" v-for="(item, index) in schoolList" :key="index">
      <img v-if="item.logo" :src="item.logo" alt="school_logo"/>
      <p>{{item.cn_name}}</p>
    </div>
  </div>
  <el-form v-if="schoolForm" label-width="auto" :model="schoolForm" style="width: 900px;" @submit.prevent="updateSchoolClicked">
    <el-form-item label="学园ID："><el-input type="text" v-model="schoolForm.id"/></el-form-item>
    <el-form-item label="学园中文名："><el-input type="text" v-model="schoolForm.cn_name"/></el-form-item>
    <el-form-item label="学园日文名："><el-input type="text" v-model="schoolForm.jp_name"/></el-form-item>
    <el-form-item label="学园韩文名："><el-input type="text" v-model="schoolForm.kr_name"/></el-form-item>
    <el-form-item label="学园英文名："><el-input type="text" v-model="schoolForm.en_name"/></el-form-item>
    <el-form-item label="学园介绍："><el-input type="text" v-model="schoolForm.introduce"/></el-form-item>
    <el-form-item label="学园标志URL：">
      <el-input type="text" v-model="schoolForm.logo"/>
      <img style="width: 100px" v-if="schoolForm.logo" :src="schoolForm.logo" alt="school_logo">
    </el-form-item>
    <el-form-item label="学园表示（美化）URL：">
      <el-input type="text" v-model="schoolForm.beautify_logo"/>
      <img style="width: 100px" v-if="schoolForm.beautify_logo" :src="schoolForm.beautify_logo" alt="school_logo">
    </el-form-item>
    <el-form-item label="学园背景图URL：">
      <el-input type="text" v-model="schoolForm.bg"/>
      <img style="width: 300px;" v-if="schoolForm.bg" :src="schoolForm.bg" alt="school_bg">
    </el-form-item>
    <el-button type="primary" native-type="submit">上传修改</el-button>
  </el-form>
</template>

<style scoped lang="css">

</style>
