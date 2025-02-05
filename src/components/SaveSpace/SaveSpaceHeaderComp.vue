<script setup lang="ts">
import defaultAvatar from "@/assets/About/default_avatar.jpg";
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import {ref, watch} from "vue";
import type {UserArchiveImpl} from "@/interface/UserArchiveImpl.ts";
const userArchivePinia = useUserArchivePinia();

const userArchive = ref<UserArchiveImpl>(userArchivePinia.userArchive);

watch(() => userArchivePinia.userArchive, newVal => {
  userArchive.value = newVal;
})
</script>

<template>
  <header class="save_space_header">
    <div class="save_space_header_user_box">
      <img class="save_space_header_avatar" :src="userArchive.avatar || defaultAvatar" alt="avatar"/>
      <div class="save_space_header_name_email">
        <p class="save_space_header_name">{{`${userArchive.nickname} #${userArchive.id}`}}</p>
        <p class="save_space_header_email">{{userArchive.email}}</p>
      </div>
    </div>
    <div class="save_space_header_character_box">
      <h1 class="save_space_header_character">管理存储空间</h1>
      <p class="save_space_header_character_en">Manage storage space</p>
    </div>
  </header>
</template>

<style scoped lang="css">
.save_space_header {
  padding: 0 2rem;
  display: flex;
  height: 60px;
  background-color: #57505d;
  justify-content: space-between;
  align-items: center;
}
.save_space_header_user_box {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}
.save_space_header_user_box .save_space_header_avatar {
  height: 90%;
  border-radius: 50%;
}
.save_space_header_name_email {
  display: flex;
  flex-direction: column;
}
.save_space_header_name_email p {
  margin: 0;
  color: #fff;
}
.save_space_header_name {
  font-size: 18px;
  font-weight: bold;
}
.save_space_header_email {
  font-size: 14px;
}
.save_space_header_character_box {
  text-align: center;
  display: flex;
  flex-direction: column;
  color: #fff;
}
.save_space_header_character {
  margin: 0;
  font-size: 20px;
}
.save_space_header_character_en {
  margin: 0;
}

</style>
