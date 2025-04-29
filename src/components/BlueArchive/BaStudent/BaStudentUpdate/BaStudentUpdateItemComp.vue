<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {httpSpring} from "@/utils/http.ts";
import {nextTick, onMounted, ref} from "vue";
import type {BaStudentImpl} from "@/interface/BlueArchiveImpl.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
const route = useRoute();
const router = useRouter();

/**上传Student立绘*/
const bodyRef = ref<HTMLInputElement | null>(null);
const triggerBodyInput = () => {if (bodyRef.value) bodyRef.value.click();}
const selectBodyFile = (e: Event) => {
  const {files} = e.target as HTMLInputElement;
  if (!files || !files.length) return;
  const file = files[0];
  const formData = new FormData();
  formData.append("file", file, `body_${studentForm.value?.cn_name || '未知中文名'}_${file.name}`);
  httpSpring({
    url: 'api/file/upload_by_bucket',
    method: 'POST',
    data: formData,
    params: {bucket_name: 'bluearchive'},
  }).then(res => {
    if (res?.data?.code === 0) {
      if (studentForm.value) {
        studentForm.value.body_image = res?.data?.data;
        showMessageNotice('green', res?.data?.message);
      }
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
      if (studentForm.value && studentForm.value.cn_name) {
        const fileName = `avatar_rectangle_${studentForm.value.cn_name}_${Date.now()}_${coverFilename}`;
        const formData = new FormData();
        formData.append("file", blob, fileName);
        httpSpring({
          url: 'api/file/upload_by_bucket',
          method: 'POST',
          data: formData,
          params: {bucket_name: 'bluearchive'}
        }).then(res => {
          if (res?.data?.code === 0) {
            if (studentForm.value) {
              studentForm.value.avatar_rectangle = res?.data?.data;
              showMessageNotice('green', res?.data?.message);
            }
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

const studentForm = ref<BaStudentImpl | null>(null);

const fetchStudent = () => {
  httpSpring({
    url: 'ba/student/only',
    method: 'GET',
    params: {student_id: route.params.student_id}
  }).then(res => {
    if (res?.data?.code === 0) studentForm.value = res?.data?.data;
    else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

const updateStudentClicked = () => {
  if (studentForm.value
    && studentForm.value.id
    && studentForm.value.cn_name !== ''
    && studentForm.value.en_name
    && studentForm.value.avatar_rectangle !== ''
    && studentForm.value.body_image !== ''
    && studentForm.value.school !== ''
    && studentForm.value.club !== '')
  {
    httpSpring({
      url: 'ba/student/up_student',
      method: 'POST',
      headers: {Authorization: window.localStorage.getItem('token')},
      data: studentForm.value,
      params: {up_type: 'update'}
    }).then(res => {
      if (res?.data?.code === 0) {
        showMessageNotice('green', res?.data?.message);
        setTimeout(() => {
          router.back();
        }, 1000);
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();});
  } else {
    showMessageNotice('red', '缺少必要参数！');
  }
}

onMounted(() => {
  fetchStudent();
  console.log(route.params.student_id);
})
</script>

<template>
  <el-main style="max-height: calc(100vh - 56px);">
    <el-form v-if="studentForm" label-width="auto" :model="studentForm" @submit.prevent="updateStudentClicked">
      <el-form-item label="学生ID：">{{studentForm.id}}</el-form-item>
      <el-form-item label="学生中文名："><el-input type="text" v-model="studentForm.cn_name"/></el-form-item>
      <el-form-item label="学生日文名："><el-input type="text" v-model="studentForm.jp_name"/></el-form-item>
      <el-form-item label="学生韩文名："><el-input type="text" v-model="studentForm.kr_name"/></el-form-item>
      <el-form-item label="学生英文名：">{{studentForm.en_name}}（英文名和ID高度绑定，无法修改。）</el-form-item>
      <el-form-item label="学生介绍："><el-input type="text" v-model="studentForm.introduce"/></el-form-item>
      <el-form-item label="学生头像：">
        <input style="display: none" type="file" accept="image/*" ref="avatarRef" @change="selectAvatarFile"/>
        <div @click="triggerAvatarInput" style="width: 96px; height: 128px; border: #1289f8 2px solid; background-color: white; display: flex; align-items: center; justify-content: center; margin-right: 20px">
          <span v-if="studentForm.avatar_rectangle === ''">点击选择</span>
          <img style="width: 100%" v-else :src="studentForm.avatar_rectangle" alt="avatar_rectangle"/>
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
        <el-button v-if="!studentForm.body_image" type="primary" native-type="button" @click="triggerBodyInput">上传图片</el-button>
        <img style="width: 300px" v-if="studentForm.body_image" :src="studentForm.body_image" alt="body_image"/>
        <!--          <el-input type="text" v-model="student.body_image"/>-->
        <!--          <div style="width: 300px; height: 600px; border: #1289f8 2px solid; background-color: white; display: flex; align-items: center; justify-content: center;">-->
        <!--            <span v-if="!student.body_image">点击选择</span>-->
        <!--            <img style="width: 100%" v-else :src="student.body_image" alt="body_image"/>-->
        <!--          </div>-->
      </el-form-item>
      <el-button type="success" native-type="submit">上传修改</el-button>
    </el-form>
  </el-main>
</template>

<style scoped lang="css">

</style>
