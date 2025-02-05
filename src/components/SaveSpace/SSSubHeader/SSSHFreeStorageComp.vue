<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {FileMaxStorageImpl} from "@/interface/FIleImpl.ts";
import {httpSpring} from "@/utils/http.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";

const bucketDetail = ref<FileMaxStorageImpl | null>(null);

const fetchStorage = () => {
  httpSpring({
    url: 'api/file/bucket/detail',
    method: 'GET',
    headers: {Authorization: window.localStorage.getItem('token')}
  }).then(res => {
    if (res?.data?.code === 0) {
      bucketDetail.value = res?.data?.data;
      if (!bucketDetail.value) return;
      const storageIcon = document.getElementById('free_storage_i');
      if (!storageIcon) return;
      let proportionBy: number = (1 - ((bucketDetail.value.size/(1024 * 1024)) / (bucketDetail.value.max_size/(1024 * 1024)))) * 100;
      console.log('proportion', proportionBy);
      if (bucketDetail.value.size === -1) proportionBy = 100;
      storageIcon.style.width = `${proportionBy}%`;
      if (proportionBy <= 0) {
        storageIcon.style.backgroundColor = '#ff0000';
        storageIcon.style.width = '100%';
        const characterCN = document.getElementById('character_cn');
        const characterData = document.getElementById('character_data');
        if (characterCN && characterData) {
          characterCN.style.color = '#fff';
          characterData.style.color = '#fff';
        }
      } else if (0 < proportionBy && proportionBy < 10) {
        storageIcon.style.backgroundColor = '#ff0000';
      }  else if (10 <= proportionBy && proportionBy < 50) {
        storageIcon.style.backgroundColor = '#fff200';
      } else {
        storageIcon.style.backgroundColor = '#55ff00';
      }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

onMounted(() => {
  fetchStorage();
})
</script>

<template>
  <div class="free_storage_box">
    <i id="free_storage_i"></i>
    <div class="free_storage_character_box">
      <p class="free_storage_character" id="character_cn">存储空间</p>
      <p class="free_storage_character_data" id="character_data">{{bucketDetail?.size_text || '0MB'}}(Used) / {{bucketDetail?.max_size_text || '0MB'}}(Max)</p>
    </div>
  </div>
</template>

<style scoped lang="css">
.free_storage_box {
  width: 300px;
  height: 100%;
  border-radius: 10px;
  border: #57505d solid 1px;
  overflow: hidden;
  box-shadow: #57505d 0 0 5px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.free_storage_box i{
  top: 0;
  left: 0;
  z-index: -1;
  position: absolute;
  transition: 1s ease;
  display: block;
  height: 100%;
  box-shadow: #57505d 0 0 5px;
  width: 0;
}
.free_storage_box .free_storage_character_box {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.free_storage_character_box p {
  margin: 0;
  color: #57505d;
}
.free_storage_character_box .free_storage_character {
  font-weight: bold;
  font-size: 16px;
}
</style>
