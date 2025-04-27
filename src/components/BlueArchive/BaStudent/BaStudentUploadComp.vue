<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import type {BaSchoolClubImpl, BaSchoolImpl, BaStudentImpl} from "@/interface/BlueArchiveImpl.ts";
import {httpSpring} from "@/utils/http.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import Cropper from "cropperjs";

const copperShow = ref<boolean>(false);
const squareAvatarRef = ref<HTMLInputElement | null>(null);
const avatarValue = ref<string | null>(null);
let coverFilename: string | undefined = undefined;
let cropper: Cropper | null = null;
const triggerSquareInput = () => {if (squareAvatarRef.value) squareAvatarRef.value.click();}
const initCropper = (width: number, height: number) => {
  if (cropper !== null) cropper.destroy();
  const image = document.getElementById("coverImage") as HTMLImageElement;
  cropper = new Cropper(image, {
    viewMode: 1, aspectRatio: width/height, cropBoxResizable: false, toggleDragModeOnDblclick: false, movable: false, preview: '.image_preview'
  })
}
const selectSquareAvatarFile = (e: Event) => {
  avatarValue.value = null;
  const {files} = e.target as HTMLInputElement;
  if (!files || !files.length) return;
  const file = files[0];
  coverFilename = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = (e: Event) => {
    avatarValue.value = String(reader.result);
    if (squareAvatarRef.value) squareAvatarRef.value.value = "";
    nextTick(() => {initCropper(200, 200);})
  }
}
const uploadAvatarClicked = () => {
  const cropperCanvas = cropper?.getCroppedCanvas({
    width: 250, height: 130, imageSmoothingEnabled: true, imageSmoothingQuality: "high"
  });
  cropperCanvas?.toBlob(blob => {
    if (blob) {
      console.log(blob);
      const fileName = `${Date.now()}_${coverFilename}`;
      const formData = new FormData();
      formData.append("file", blob, fileName);
      copperShow.value = false;
    }
  })
}

/*选择学园部团等*/
const schoolList = ref<Array<BaSchoolImpl> | null>(null);
const schoolClubList = ref<Array<BaSchoolClubImpl> | null>(null);
const student = ref<BaStudentImpl>({
  id: '', cn_name: '', jp_name: null, kr_name: null, en_name: null, avatar_square: '', avatar_rectangle: '', body_image: '', introduce: null, school: '', club: ''
})

const isSchoolClubShow = ref<boolean>(false);
const isFormShow = ref<boolean>(false);

const schoolSelected = (school_id: string) => {
  isSchoolClubShow.value = true;
  student.value.school = school_id;
  httpSpring({url: 'ba/school/club/clubs_by_school', method: 'GET', params: {school_id: school_id}})
    .then(res => {
      if (res?.data?.code === 0) schoolClubList.value = res?.data?.data; else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
  if (isFormShow.value) {
    isFormShow.value = false;
  }
}

const clubSelected = (club_id: string) => {
  isFormShow.value = true;
  student.value.club = club_id;
}

const cnNameById = (id: string, type: string): string | null => {
  switch (type) {
    case 'school': {
      if (schoolList.value) {
        for (const school of schoolList.value) {
          if (school.id === id) {
            return school.cn_name;
          }
        }
      }
      return null;
    }
    case 'club': {
      if (schoolClubList.value) {
        for (const club of schoolClubList.value) {
          if (club.id === id) {
            return club.cn_name;
          }
        }
      }
      return null;
    }
    default: return null
  }
}

const fetchAllSchools = () => {
  httpSpring({
    url: 'ba/school/all',
    method: 'GET',
  }).then(res => {
    if (res?.data?.code === 0) schoolList.value = res?.data?.data;
    else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

onMounted(() => {
  fetchAllSchools();
})


</script>

<template>
  <el-container>
    <el-aside style="width: 200px">
      <el-menu
        background-color="#ffd04b80"
        style="min-height: calc(100vh - 56px);"
        active-text-color="#fff"
        text-color="#303133"
        v-if="schoolList"
      >
        <el-menu-item @click="schoolSelected(item.id)" v-for="(item, index) in schoolList" :index="item.id" :key="index">{{item.cn_name}}</el-menu-item>
      </el-menu>
    </el-aside>
    <el-aside style="width: 200px" v-if="isSchoolClubShow">
      <el-menu
        background-color="#1289f880"
        style="min-height: calc(100vh - 56px);"
        active-text-color="#fff"
        text-color="#303133"
        v-if="schoolClubList"
      >
        <el-menu-item @click="clubSelected(item.id)" v-for="(item, index) in schoolClubList" :index="item.id" :key="index">{{item.cn_name}}</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="max-height: calc(100vh - 56px);">
      <el-form :model="student" label-width="auto" v-if="isFormShow">
        <el-form-item label="学生隶属：">
          <p>学园：{{cnNameById(student.school, 'school')}}</p>&nbsp;&nbsp;&nbsp;
          <p>部团：{{cnNameById(student.club, 'club')}}</p>
        </el-form-item>
        <el-form-item label="学生ID：">
          <el-input type="text" v-model="student.id"/>
        </el-form-item>
        <el-form-item label="学生中文名：">
          <el-input type="text" v-model="student.cn_name"/>
        </el-form-item>
        <el-form-item label="学生日文名：">
          <el-input type="text" v-model="student.jp_name"/>
        </el-form-item>
        <el-form-item label="学生韩文名：">
          <el-input type="text" v-model="student.kr_name"/>
        </el-form-item>
        <el-form-item label="学生英文名：">
          <el-input type="text" v-model="student.en_name"/>
        </el-form-item>
        <el-form-item label="学生介绍：">
          <el-input type="text" v-model="student.introduce"/>
        </el-form-item>
        <el-form-item label="学生头像（方形）：">
          <input type="text" style="display: none" accept="image/*" ref="squareAvatarRef" @change="selectSquareAvatarFile"/>
          <div @click="triggerSquareInput" style="width: 100px; height: 100px; border: #1289f8 2px solid; background-color: white; display: flex; align-items: center; justify-content: center;">
            点击选择
          </div>
        </el-form-item>
        <el-form-item label="学生头像（竖方形）：">
          <el-input type="text" v-model="student.avatar_rectangle" style="display: none"/>
          <div style="width: 100px; height: 150px; border: #1289f8 2px solid; background-color: white; display: flex; align-items: center; justify-content: center;">
            点击选择
          </div>
        </el-form-item>
        <el-form-item label="学生立绘：">
          <el-input type="text" v-model="student.body_image"/>
          <div style="width: 300px; height: 600px; border: #1289f8 2px solid; background-color: white; display: flex; align-items: center; justify-content: center;">
            <span v-if="!student.body_image">点击选择</span>
            <img style="width: 100%" v-else :src="student.body_image" alt="body_image"/>
          </div>
        </el-form-item>
        <el-button type="primary">上传</el-button>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped lang="css">

</style>
