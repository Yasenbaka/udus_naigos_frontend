<script setup lang="ts">
import "@/components/BlueArchive/BaSchoolCSS.css";
import "@/components/BlueArchive/BaStudentCSS.css"
import "@/components/BlueArchive/BaClubCSS.css"
import {onMounted, ref} from "vue";
import type {BaSchoolClubImpl, BaSchoolImpl, BaStudentImpl} from "@/interface/BlueArchiveImpl.ts";
import {httpSpring} from "@/utils/http.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {useRouter} from "vue-router";
const router = useRouter();

const studentList = ref<Array<BaStudentImpl> | null>(null);
const schoolList = ref<Array<BaSchoolImpl> | null>(null);
const schoolClubList = ref<Array<BaSchoolClubImpl> | null>(null);
const studentShowList = ref<Array<BaStudentImpl> | null>(null);

const schoolSelected = (school_id: string) => {
  fetchSchoolClubList(school_id);
  if (studentList.value) {
    studentShowList.value = [];
    for (const student of studentList.value) {
      if (student.school === school_id) {
        studentShowList.value.push(student);
      }
    }
  }
}

const schoolClubSelected = (club_id: string) => {
  if (studentList.value) {
    studentShowList.value = [];
    for (const student of studentList.value) {
      if (student.club === club_id) {
        studentShowList.value.push(student);
      }
    }
  }
}

const studentSelected = (student_id: string) => {
  router.push({name: 'BlueArchiveStudentUpdateItem', params: {student_id}});
}

const fetchAllStudent = () => {
  httpSpring({
    url: 'ba/student/all', method: 'GET'
  }).then(res => {
    if (res?.data?.code === 0) {
      studentList.value = res?.data?.data;
      studentShowList.value = res?.data?.data;
    } else showMessageNotice('red', res?.data?.message);
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
onMounted(() => {
  fetchAllStudent();
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
  <h3 style="margin-top: 20px">筛选条件：选择一个学生</h3>
  <div class="students_box" v-if="studentShowList">
    <div class="student_item" v-for="(item, index) in studentShowList" :key="index" @click="studentSelected(item.id)">
      <img :src="item.avatar_rectangle" alt="avatar" />
      <span>{{item.cn_name}}</span>
    </div>
  </div>
</template>

<style scoped lang="css">
</style>
