<script setup lang="ts">
import fileSvg from "@/assets/file.svg";
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http.ts";
import type {FileObjectImpl} from "@/interface/FIleImpl.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";

const fileObjects = ref<Array<FileObjectImpl> | null>(null);
const objectDialog = ref<{isDialog: boolean; object: FileObjectImpl | null}>({isDialog: false, object: null});

const deleteObject = (object: FileObjectImpl | null): void => {
  if (object === null) {
    showExceptionNotice();
    return;
  }
  httpSpring({
    url: 'api/file/delete',
    method: 'DELETE',
    headers: {Authorization: window.localStorage.getItem('token')},
    params: {object_name: object.name}
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('green', res?.data?.data);
      fetchMinioItems();
      objectDialog.value.isDialog = false;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

const itemClicked = (object: FileObjectImpl) => {
  objectDialog.value = {isDialog: true, object: object};
}

const fetchMinioItems = () => {
  httpSpring({
    url: 'api/file/objects',
    method: 'GET',
    headers: {
      Authorization: window.localStorage.getItem('token')
    }
  }).then(async res => {
    if (res?.data?.code === 0) {
      fileObjects.value = res?.data?.data;
      if (!fileObjects.value) return;
      for (const key in fileObjects.value) {
        const response = await fetch(fileObjects.value[key].url, {method: 'HEAD'});
        const contentType = response.headers.get('content-type') || '';
        fileObjects.value[key].isImage = contentType.startsWith('image/');
      }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}
onMounted(() => {
  fetchMinioItems();
})
</script>

<template>
  <el-dialog v-model="objectDialog.isDialog" :title="`文件：${objectDialog.object?.name}`" append-to-body destroy-on-close align-center>
    <div class="dialog_body" style="display: flex; justify-content: center; flex-direction: column;">
      <div class="dialog_body_image_box" style="width: 100%; text-align: center;">
        <img :src="objectDialog.object?.url" alt="image" style="max-width: 100%; max-height: 500px"/>
      </div>
      <div class="dialog_body_buttons" style="text-align: center;">
        <el-button type="danger" @click="deleteObject(objectDialog.object)">删除该文件</el-button>
      </div>
    </div>
  </el-dialog>
  <div class="save_space_item_box" v-if="fileObjects">
    <div class="save_space_item" v-for="item in fileObjects" :key="item.name" @click="itemClicked(item)">
      <div class="save_space_item_cover_box">
        <img class="save_space_item_cover" v-if="item.isImage" :src="item.url" alt="image"/>
        <img class="save_space_item_cover" v-else :src="fileSvg" alt="image"/>
      </div>
      <p>{{item.name}}</p>
      <div class="save_space_item_size_box">
        <p>{{item.size_text}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.save_space_item_box {
  width: 98%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 auto;
  gap: 10px;
  align-items: center;
}
.save_space_item:hover {
  cursor: pointer;
}
.save_space_item {
  border: 1px solid #57505d;
  width: 250px;
  height: 150px;
  position: relative;
}
.save_space_item_cover_box {
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6e6e6;
}
.save_space_item_cover {
  max-height: 100%;
  max-width: 100%;
}
.save_space_item {
  white-space: normal; /* 允许文本正常换行 */
  word-wrap: break-word; /* 在必要时拆分长单词以适应容器 */
  overflow: hidden; /* 防止内容溢出容器 */
}

.save_space_item p {
  margin: 0; /* 移除默认的段落上下边距，以防影响布局 */
}
.save_space_item .save_space_item_size_box:hover {
  opacity: 1;
}
.save_space_item .save_space_item_size_box {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #57505d80;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .3s ease;
}
.save_space_item .save_space_item_size_box p {
  font-size: 26px;
  font-weight: bold;
  color: white;
}
</style>
