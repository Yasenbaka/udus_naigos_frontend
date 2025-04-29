<script setup lang="ts">
import "@/components/BlueArchive/BaSchoolCSS.css";
import "@/components/BlueArchive/BaStudentCSS.css"
import "@/components/BlueArchive/BaClubCSS.css"
import {onMounted, ref} from "vue";
import type {BaSchoolClubImpl, BaSchoolImpl} from "@/interface/BlueArchiveImpl.ts";
import {httpSpring} from "@/utils/http.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {useRouter} from "vue-router";
const router = useRouter();

const schoolList = ref<Array<BaSchoolImpl> | null>(null);
const schoolClubList = ref<Array<BaSchoolClubImpl> | null>(null);
const schoolCLubForm = ref<BaSchoolClubImpl | null>(null);

const schoolSelected = (school_id: string) => {
  schoolCLubForm.value = null;
  fetchSchoolClubList(school_id);
}

const schoolClubSelected = (club_id: string) => {
  httpSpring({url: 'ba/school/club/only', method: 'GET', params: {club_id}})
    .then(res => {
      if (res?.data?.code == 0) schoolCLubForm.value = res?.data?.data;
      else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
}
const fetchAllSchool = () => {
  httpSpring({
    url: 'ba/school/all', method: 'GET'
  }).then(res => {
    if (res?.data?.code === 0) {
      schoolList.value = res?.data?.data;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}
const fetchSchoolClubList = (school_id: string) => {
  httpSpring({url: 'ba/school/club/clubs_by_school', method: 'GET', params: {school_id}})
    .then(res => {
      if (res?.data?.code === 0) {
        schoolClubList.value = res?.data?.data;
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
}
const updateSchoolClubClicked = () => {
  if (schoolCLubForm.value && schoolCLubForm.value.cn_name !== '') {
    httpSpring({
      url: 'ba/school/club/up_club',
      method: 'POST',
      headers: {Authorization: window.localStorage.getItem('token')},
      data: schoolCLubForm.value,
      params: {up_type: 'update'}
    }).then(res => {
      if (res?.data?.code === 0) {
        showMessageNotice('green', res?.data?.data);
        router.go(0);
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
  }
}
onMounted(() => {
  fetchAllSchool();
})
</script>

<template>
  <h3>筛选条件：选择一个学园</h3>
  <div class="schools_box" v-if="schoolList">
    <div class="school_item" v-for="(item, index) in schoolList" :key="index" @click="schoolSelected(item.id)">
      <img :src="item.logo" alt="school_item"/>
      <p>{{item.cn_name}}</p>
    </div>
  </div>
  <h3 style="margin-top: 20px" v-if="schoolClubList">筛选条件：选择一个部团</h3>
  <div class="clubs_box" v-if="schoolClubList">
    <div class="club_item" v-for="(item, index) in schoolClubList" :key="index" @click="schoolClubSelected(item.id)">
      <img v-if="item.logo && item.logo !== ''" :src="item.logo" alt="club_item"/>
      <p>{{item.cn_name}}</p>
    </div>
  </div>
  <el-form style="margin-top: 20px" v-if="schoolCLubForm" :model="schoolCLubForm" label-width="auto" @submit.prevent="updateSchoolClubClicked">
    <el-form-item label="部团中文名："><el-input type="text" v-model="schoolCLubForm.cn_name"/></el-form-item>
    <el-form-item label="部团日文名："><el-input type="text" v-model="schoolCLubForm.jp_name"/></el-form-item>
    <el-form-item label="部团韩文名："><el-input type="text" v-model="schoolCLubForm.kr_name"/></el-form-item>
    <el-form-item label="部团英文名："><el-input type="text" v-model="schoolCLubForm.en_name"/></el-form-item>
    <el-form-item label="部团标志URL：">
      <el-input type="text" v-model="schoolCLubForm.logo"/>
      <img style="width: 50px" v-if="schoolCLubForm.logo && schoolCLubForm.logo !== ''" :src="schoolCLubForm.logo" alt="club_logo"/>
    </el-form-item>
    <el-form-item label="部团背景图URL：">
      <el-input type="text" v-model="schoolCLubForm.bg"/>
      <img style="width: 200px" v-if="schoolCLubForm.bg && schoolCLubForm.bg !== ''" :src="schoolCLubForm.bg" alt="club_bg"/>
    </el-form-item>
    <el-button type="success" native-type="submit">上传修改</el-button>
  </el-form>
</template>

<style scoped lang="css">
</style>
