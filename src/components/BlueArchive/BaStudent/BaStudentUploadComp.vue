<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import type {BaSchoolClubImpl, BaSchoolImpl, BaStudentImpl} from "@/interface/BlueArchiveImpl.ts";
import {httpSpring} from "@/utils/http.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {useRouter} from "vue-router";
const router = useRouter();

const uploadStudent = () => {
  if (student.value.id
    && student.value.cn_name !== ''
    && student.value.en_name
    && student.value.avatar_rectangle !== ''
    && student.value.body_image !== ''
    && student.value.school !== ''
    && student.value.club !== ''
  ) {
    httpSpring({
      url: 'ba/student/up_student',
      method: 'POST',
      data: student.value,
      params: {up_type: 'upload'},
      headers: {Authorization: window.localStorage.getItem('token')},
    }).then(res => {
      if (res?.data?.code === 0) {
        showMessageNotice('green', res?.data?.message);
        setTimeout(() => {
          router.go(0);
        }, 1000);
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
  }
}

/**上传Student立绘*/
const bodyRef = ref<HTMLInputElement | null>(null);
const triggerBodyInput = () => {if (bodyRef.value) bodyRef.value.click();}
const selectBodyFile = (e: Event) => {
  const {files} = e.target as HTMLInputElement;
  if (!files || !files.length) return;
  const file = files[0];
  const formData = new FormData();
  formData.append("file", file, `body_${student.value.cn_name}_${file.name}`);
  httpSpring({
    url: 'api/file/upload_by_bucket',
    method: 'POST',
    data: formData,
    params: {bucket_name: 'bluearchive'},
  }).then(res => {
    if (res?.data?.code === 0) {
      student.value.body_image = res?.data?.data;
      showMessageNotice('green', res?.data?.message);
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

/**上传Student头像相关*/
import Cropper from "cropperjs";
const copperShow = ref<boolean>(false);
const avatarRef = ref<HTMLInputElement | null>(null);
const avatarValue = ref<string | null>(null);
let coverFilename: string | undefined = undefined;
let cropper: Cropper | null = null;
const triggerAvatarInput = () => {if (avatarRef.value) avatarRef.value.click();}
const initCropper = (width: number, height: number) => {
  if (cropper !== null) cropper.destroy();
  const image = document.getElementById("copper_image") as HTMLImageElement;
  cropper = new Cropper(image, {
    viewMode: 1, aspectRatio: width/height, cropBoxResizable: false, toggleDragModeOnDblclick: false, movable: false, preview: '.image_preview'
  })
}
const selectAvatarFile = (e: Event) => {
  avatarValue.value = null;
  const {files} = e.target as HTMLInputElement;
  if (!files || !files.length) return;
  const file = files[0];
  coverFilename = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = (e: Event) => {
    avatarValue.value = String(reader.result);
    if (avatarRef.value) avatarRef.value.value = "";
    nextTick(() => {
      copperShow.value = true;
      initCropper(192, 256);
    })
  }
}
const uploadAvatarClicked = () => {
  const cropperCanvas = cropper?.getCroppedCanvas({
    width: 192, height: 256, imageSmoothingEnabled: true, imageSmoothingQuality: "high"
  });
  cropperCanvas?.toBlob(blob => {
    if (blob) {
      console.log(blob);
      // const fileName = `${Date.now()}_${coverFilename}`;
      if (student.value.cn_name) {
        const fileName = `avatar_rectangle_${student.value.cn_name}_${Date.now()}_${coverFilename}`;
        const formData = new FormData();
        formData.append("file", blob, fileName);
        httpSpring({
          url: 'api/file/upload_by_bucket',
          method: 'POST',
          data: formData,
          params: {bucket_name: 'bluearchive'}
        }).then(res => {
          if (res?.data?.code === 0) {
            student.value.avatar_rectangle = res?.data?.data;
            showMessageNotice('green', res?.data?.message);
          } else showMessageNotice('red', res?.data?.message);
        }).catch(() => {showExceptionNotice();});
      }
      else {
        showMessageNotice('red', '需要先写入中文名！')
      }
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

watch(() => student.value.en_name, (newVal: string | null) => {
  if (newVal !== null) {
    student.value.id = newVal.toLowerCase().replace(/\s/g, '_');
  }
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
        <el-menu-item @click="schoolSelected(item.id)" v-for="(item, index) in schoolList" :index="item.id" :key="index">
          <img style="width: 20px" v-if="item.logo && item.logo !== ''" :src="item.logo" alt="school_logo">
          {{item.cn_name}}
        </el-menu-item>
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
        <el-menu-item @click="clubSelected(item.id)" v-for="(item, index) in schoolClubList" :index="item.id" :key="index">
          <img style="width: 30px;" v-if="item.logo && item.logo !== ''" :src="item.logo" alt="club_logo">
          {{item.cn_name}}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="max-height: calc(100vh - 56px);">
      <el-form :model="student" label-width="auto" v-if="isFormShow" @submit.prevent="uploadStudent">
        <el-form-item label="学生隶属：">
          <p>学园：{{cnNameById(student.school, 'school')}}</p>&nbsp;&nbsp;&nbsp;
          <p>部团：{{cnNameById(student.club, 'club')}}</p>
        </el-form-item>
        <el-form-item label="学生ID：">
          <span>{{student.id}}</span>
        </el-form-item>
        <el-form-item label="学生中文名：">
          <el-input type="text" v-model="student.cn_name" placeholder="必须"/>
        </el-form-item>
        <el-form-item label="学生日文名：">
          <el-input type="text" v-model="student.jp_name" placeholder="非必须"/>
        </el-form-item>
        <el-form-item label="学生韩文名：">
          <el-input type="text" v-model="student.kr_name" placeholder="非必须"/>
        </el-form-item>
        <el-form-item label="学生英文名：">
          <el-input type="text" v-model="student.en_name" placeholder="必须，学生ID将会以该参数生成，请正确格式并留意空格，如：Misono Mika"/>
        </el-form-item>
        <el-form-item label="学生介绍：">
          <el-input type="text" v-model="student.introduce" placeholder="非必须"/>
        </el-form-item>
        <el-form-item label="学生头像：">
          <input style="display: none" type="file" accept="image/*" ref="avatarRef" @change="selectAvatarFile"/>
          <div @click="triggerAvatarInput" style="width: 96px; height: 128px; border: #1289f8 2px solid; background-color: white; display: flex; align-items: center; justify-content: center; margin-right: 20px">
            <span v-if="student.avatar_rectangle === ''">点击选择</span>
            <img style="width: 100%" v-else :src="student.avatar_rectangle" alt="avatar_rectangle"/>
          </div>
          <div style="display: flex; align-items: end; gap: 20px;">
            <img style="max-height: 200px; max-width: 300px" v-if="avatarValue" :src="avatarValue" id="copper_image" alt="avatar_copper"/>
            <el-button v-if="copperShow" type="primary" native-type="button" @click="uploadAvatarClicked">上传</el-button>
            <el-button v-if="copperShow" type="warning" native-type="button" @click="triggerAvatarInput">重选</el-button>
          </div>
          <div v-if="copperShow" style="border: #57505d 2px solid; width: 96px; height: 128px; overflow: hidden" class="image_preview"/>
        </el-form-item>
        <el-form-item label="学生立绘：">
          <input type="file" accept="image/*" ref="bodyRef" @change="selectBodyFile" style="display: none"/>
          <el-button v-if="!student.body_image" type="primary" native-type="button" @click="triggerBodyInput">上传图片</el-button>
          <img style="width: 300px" v-if="student.body_image" :src="student.body_image" alt="body_image"/>
<!--          <el-input type="text" v-model="student.body_image"/>-->
<!--          <div style="width: 300px; height: 600px; border: #1289f8 2px solid; background-color: white; display: flex; align-items: center; justify-content: center;">-->
<!--            <span v-if="!student.body_image">点击选择</span>-->
<!--            <img style="width: 100%" v-else :src="student.body_image" alt="body_image"/>-->
<!--          </div>-->
        </el-form-item>
        <el-button type="success" native-type="submit">上传实体</el-button>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped lang="css">

</style>
