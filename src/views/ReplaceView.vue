<script setup lang="ts">
import replaceBg from "@/assets/Replace/bg.jpg";
import zhezhao from "@/assets/Home/zhezhao.png";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import type {ReplaceParamImp} from "@/interface/ReplaceParamImp.ts";
import type {UserArchiveImp} from "@/interface/UserArchiveImp.ts";
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
const userArchivePinia = useUserArchivePinia();
const router = useRouter();

const queryStatus = ref<number>(0);
const jumpCount = ref<number>(3);
const replaceParam = ref<ReplaceParamImp>({
  token: {isHave: false, value: null},
  target: {isHave: false, value: null},
});
const userArchive = ref<UserArchiveImp | null>(null);

function handleParam() {
  window.localStorage.setItem('token', replaceParam.value.token.value);
  userArchivePinia.fetchUserArchive();
}
function handleJumpRouter() {
  queryStatus.value = 1;
  setInterval(() => {
    if (jumpCount.value <= 0) {
      if (replaceParam.value.target.isHave) {
        router.replace({name: replaceParam.value.target.value});
      } else {
        router.replace({name: 'Home3'});
      }
    } else jumpCount.value--;
  }, 1000);
}

function returnOriginView() {
  queryStatus.value = 2;
  setInterval(() => {
    if (jumpCount.value <= 0) window.history.back();
    else jumpCount.value--;
  }, 1000)
}

onMounted(() => {
  const route = useRoute();
  const queryObj = route.query;
  if (queryObj?.token) {
    replaceParam.value.token = {isHave: true, value: queryObj.token};
    if (queryObj.target) {
      replaceParam.value.target = {isHave: true, value: queryObj.target};
    }
    handleParam();
  } else {
    returnOriginView();
  }
})

watch(() => userArchivePinia.userArchive, (newVal: UserArchiveImp) => {
  userArchive.value = newVal as UserArchiveImp;
  handleJumpRouter();
})
</script>

<template>
  <div class="replace_bg_box">
    <img class="zhezhao" :src="zhezhao" alt="zhezhao"/>
    <img class="replace_bg" :src="replaceBg" alt="bg"/>
  </div>
  <header class="replace_header">
    <h3 class="status_box">
      {{queryStatus === 0? '正在处理重置参数！':
      queryStatus === 1? 1 <= jumpCount? `处理完成！${jumpCount}秒后跳转指定页面！`: '如没有跳转，请手动跳转或反馈问题！':
          queryStatus === 2? `缺少必要的重置参数！${jumpCount}秒后返回原页面！`: '发生不可预测的异常！'}}
    </h3>
  </header>
  <div class="replace_container">
    <div class="param_box">
      <ul>
        <li>TOKEN：{{replaceParam.token.isHave? '已取值': '未知值'}}</li>
        <li>TARGET：{{replaceParam.target.isHave? replaceParam.target.value: 'NORMAL'}}</li>
      </ul>
    </div>
    <div class="user_archive_box" v-if="userArchive">
      <img class="avatar" :src="userArchive.avatar" alt="avatar"/>
      <div class="detail_box">
        <ul>
          <li>昵称#编号：{{`${userArchive.nickname} #${userArchive.id}`}}</li>
          <li>电子邮箱：{{userArchive.email}}</li>
          <li>QQ：{{userArchive.qq_id}}</li>
          <li>布丁/好感度：{{`${userArchive.score}个 / ${userArchive.favorite}点`}}</li>
        </ul>
      </div>
    </div>
    <div class="user_archive_box no" v-else>
      未找到用户
    </div>
  </div>
</template>

<style scoped lang="sass">
.replace_bg_box
  position: fixed
  width: 100%
  max-height: 100vh
  overflow: hidden
  z-index: -1
  .zhezhao
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
  .replace_bg
    min-width: 100%
    z-index: -2
.replace_header
  width: 90vw
  height: 60px
  margin: 0 auto
  border-radius: 0 0 50px 50px
  background-color: #57505d80
  .status_box
    text-align: center
    font-weight: bold
    color: white
    letter-spacing: 1px
    line-height: 60px
    font-size: 20px
.replace_container
  width: 80vw
  margin: 0 auto
  .param_box
    margin-top: 30px
    width: 100%
    height: 100px
    background-color: #57505d80
    border-radius: 30px
    display: flex
    align-items: center
    justify-content: center
    ul
      margin: 0
      padding: 0
      li
        list-style: none
        text-align: center
        color: white
        letter-spacing: 1px
  .user_archive_box
    width: 100%
    height: 300px
    background-color: #57505d80
    border-radius: 30px
    margin-top: 30px
    display: flex
    align-items: center
    position: relative
    .avatar
      position: absolute
      right: 60%
      height: 80%
      border-radius: 50%
      border: #eec9cd 6px solid
    .detail_box
      position: absolute
      left: 45%
      flex: 1
      ul
        li
          color: white
          font-size: 18px
          letter-spacing: 1px
</style>
