<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {httpSpring} from "@/utils/http.ts";
import type {ThemeImp} from "@/interface/ThemeImp.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
const route = useRoute();
const router = useRouter();

interface ItemImpl{
  title: string; router_name: string; explain?: string;
}
const itemList: Array<ItemImpl> = [
  {title: '修改', router_name: 'WorkEdit', explain: '仅对作品文章的内容进行修改'},
  {title: '删除', router_name: 'WorkDelete'},
  {title: '评论', router_name: 'WorkComment'},
]

const themeDetail = ref<ThemeImp | null>(null);

const itemClicked = (item: ItemImpl) => {
  if (!route.query.theme_id) return;
  function editTheme() {
    router.push({name: 'WorkEdit', query: {theme_id: route.query.theme_id}});
  }
  function delectTheme() {
    httpSpring({
      url: 'api/theme/delete',
      method: 'DELETE',
      headers: {Authorization: window.localStorage.getItem('token')},
      params: {theme_id: route.query.theme_id}
    }).then(res => {
      if (res?.data?.code === 0) {
        showMessageNotice('green', res?.data?.data);
        router.back();
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();})
  }
  switch (item.router_name) {
    case 'WorkEdit': editTheme(); break;
    case 'WorkDelete': delectTheme(); break;
    default: break;
  }
}

function fetchThemeDetail(theme_id: string) {
  httpSpring({
    url: 'api/theme/only',
    method: 'GET',
    params: {theme_id: theme_id}
  }).then(res => {
    if (res?.data?.code === 0){
      themeDetail.value = res?.data?.data;
    } else {
      alert(res?.data?.message);
    }
  })
}

onMounted(() => {
  const query = route.query;
  if (query?.theme_id) {
    fetchThemeDetail(query?.theme_id.toString());
  }
})
</script>

<template>
  <div class="work_detail_box" v-if="themeDetail">
    <div class="work_detail_cover_and_detail_box">
      <img class="work_detail_cover" v-if="themeDetail.header_image" :src="themeDetail.header_image" alt="header_img"/>
      <div class="work_detail_detail_and_item">
        <div class="work_detail_theme_detail_box">
          <h1 class="work_detail_theme_title">{{themeDetail.name}}</h1>
          <p class="work_detail_theme_introduce" v-if="themeDetail.introduce">{{themeDetail.introduce}}</p>
        </div>
        <div class="work_detail_item_box">
          <div class="work_detail_item" v-for="(item, index) in itemList" :key="index" @click="itemClicked(item)" :title="item?.explain || undefined">{{item.title}}</div>
        </div>
      </div>
    </div>
    <div class="work_detail_html_box">
      <div class="work_detail_html_title">
        <h2>作品详情</h2>
        <hr/>
      </div>
      <div style="margin: 0 auto" v-html="themeDetail.detail_html"></div>
    </div>
  </div>
</template>

<style scoped lang="css">
@keyframes work_detail_in {
  0%{
    opacity: 0;
    transform: translateY(20px);
  }
  100%{
    opacity: 1;
    transform: translateY(0);
  }
}
.work_detail_box{
  animation: work_detail_in .5s forwards ease;
  opacity: 0;
  display: flex;
  flex-direction: column;
  .work_detail_cover_and_detail_box{
    display: flex;
    flex-direction: row;
    gap: 30px;
    .work_detail_cover{
      height: 260px;
      border: #fff 5px solid;
      border-radius: 30px;
      box-shadow: 5px 5px 0 rgba(222, 145, 169, 1);
    }
    .work_detail_detail_and_item{
      display: flex;
      flex-direction: column;
      gap: 30px;
      .work_detail_theme_detail_box{
        .work_detail_theme_title{
          font-weight: bold;
          color: #b76a7e;
        }
        .work_detail_theme_introduce{
          color: #523440;
          font-size: 16px;
        }
      }
      .work_detail_item_box{
        display: flex;
        flex-direction: row;
        gap: 20px;
        .work_detail_item:hover{
          background-color: rgba(222, 145, 169, 1);
          cursor: pointer;
        }
        .work_detail_item{
          transition: background-color .3s ease;
          width: 60px;
          height: 60px;
          background-color: rgba(222, 145, 169, .6);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          border-radius: 50%;
        }
      }
    }
  }
  .work_detail_html_box{
    width: 100%;
    background-color: #ffffff50;
    border-radius: 30px;
    margin-top: 30px;
    .work_detail_html_title{
      margin-top: 20px;
      text-align: center;
      font-weight: bold;
      color: #523440;
    }
    hr {
      margin: 20px auto;
    }
  }
}
</style>
