<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {ThemeBriefImpl} from "@/interface/ThemeImp.ts";
import {httpSpring} from "@/utils/http.ts";
import {useRouter} from "vue-router";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
const router = useRouter();

const themeList = ref<Array<ThemeBriefImpl> | null>(null);
const themeListShow = ref<Array<ThemeBriefImpl> | null>(null);
const searchInputText = ref<string | null>(null);

const itemClicked = (theme_id: string) => {
  router.push({name: 'WorkDetail', query: {theme_id: theme_id}});
}

const searchRemoveClicked = () => {
  if (themeList.value === null) return;
  themeListShow.value = null;
  searchInputText.value = null;
  themeListShow.value = themeList.value;
}

function splitSearchInput (): Array<string> {
  if (searchInputText.value === null || searchInputText.value === '') return [];
  return searchInputText.value.split('#');
}
// 交集检索
const intersectionSearchClicked = () => {
  const keywords: Array<string> = splitSearchInput();
  if (keywords.length === 0) {
    showMessageNotice('red', '请输入关键词，多个关键词用#号分隔')
    return;
  }
  if (themeList.value === null) return;
  themeListShow.value = [];
  for (let i = 0; i < themeList.value.length; i++) {
    let isEligibleCount: number = 0;
    for (let j = 0; j < keywords.length; j++) {
      if (themeList.value[i].name.includes(keywords[j])){
        isEligibleCount += 1;
      }
    }
    if (isEligibleCount === keywords.length) {
      themeListShow.value.push(themeList.value[i]);
    }
  }
}
// 并集检索
const unionSearchClicked = () => {
  const keywords: Array<string> = splitSearchInput();
  if (keywords.length === 0) {
    showMessageNotice('red', '请输入关键词，多个关键词用#号分隔')
    return;
  }
  if (themeList.value === null) return;
  themeListShow.value = [];
  for (let i = 0; i < themeList.value.length; i++) {
    for (let j = 0; j < keywords.length; j++) {
      if (themeList.value[i].name.includes(keywords[j])){
        themeListShow.value.push(themeList.value[i]);
        break;
      }
    }
  }
}

function fetchAllThemeBrief() {
  httpSpring({
    url: 'api/theme/me_all_brief',
    method: 'GET',
    headers: { Authorization: window.localStorage.getItem('token')}
  }).then(res => {
    if (res?.data?.code === 0){
      themeList.value = res.data?.data;
      themeListShow.value = res.data?.data;
      console.log(themeList.value);
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();})
}
onMounted(() => {
  fetchAllThemeBrief();
})
</script>

<template>
  <div class="work_all_box" v-if="themeListShow">
    <div class="work_all_search_bar">
      <input class="work_all_search_input" type="text" placeholder="作品名关键词搜索，多个关键词请#号分隔" v-model="searchInputText" />
      <button class="work_all_search_button" @click="unionSearchClicked" title="查找所有关键词符合的结果">并集检索</button>
      <button class="work_all_search_button" @click="intersectionSearchClicked" title="查找关键词严格匹配的结果">交集检索</button>
      <button class="work_all_search_button remove" @click="searchRemoveClicked">重置</button>
    </div>
    <div class="work_all_item_box">
      <div class="work_all_item" v-for="(item, index) in themeListShow" :key="index" @click="itemClicked(item.theme_id)">
        <img v-if="item.header_image" :src="item.header_image" alt="header_img"/>
        <p v-else>{{item.name}}</p>
      </div>
    </div>
  </div>
  <div class="work_all_box no_fetch" v-else>
    <p>加载中…</p>
  </div>
</template>

<style scoped lang="css">
.work_all_box {
  display: flex;
  flex-direction: column;
  gap: 30px;
  .work_all_search_bar{
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    .work_all_search_input[type="text"]:focus{
      background-color: rgba(255, 255, 255, 1);
    }
    .work_all_search_input[type="text"]::placeholder{
      color: rgb(201, 45, 115);
    }
    .work_all_search_input{
      width: 400px;
      border: 2px solid rgba(222, 145, 169, 1);
      background-color: rgba(255, 255, 255, 0.5);
      padding: 10px;
      font-size: 16px;
      outline: none; /* 移除默认的焦点边框 */
      transition: background-color 0.3s ease;
      border-radius: 20px;
    }
    .work_all_search_button:hover{
      background-color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
    .work_all_search_button{
      border-radius: 20px;
      transition: background-color .3s ease;
      padding: 0 20px;
      font-size: 18px;
      color: rgb(201, 45, 115);
      background-color: rgba(255, 255, 255, .5);
      border: 2px solid rgba(222, 145, 169, 1);
    }
    .remove{
      background-color: rgba(222, 145, 169, .5);
    }
  }
  .work_all_item_box{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    .work_all_item:hover {
      cursor: pointer;
      transform: translateY(-5px);
      box-shadow: rgba(222, 145, 169, 1) 0 10px 10px ;
    }
    .work_all_item {
      transition: transform .3s ease, box-shadow .3s ease;
      width: 250px;
      height: 130px;
      border: white 5px solid;
      box-shadow: rgba(222, 145, 169, .5) 0 5px 5px ;
      border-radius: 20px;
      overflow: hidden;
    }
  }
}
.no_fetch{
  color: #3f3f61;
  font-size: 24px;
  font-weight: bold;
}
</style>
