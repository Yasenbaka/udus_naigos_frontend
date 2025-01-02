<script setup lang="ts">
import {onMounted, ref} from "vue";
import HomeBgComp from "@/components/Home/HomeBgComp.vue";
import HomeHeaderComp from "@/components/Home/HomeHeaderComp.vue";
import HomeNoTokenComp from "@/components/Home/HomeNoTokenComp.vue";
import HomeUserComp from "@/components/Home/HomeUserComp.vue";
import HomeUIComp from "@/components/Home/HomeUIComp.vue";
import HomeFuncItemComp from "@/components/Home/HomeFuncItemComp.vue";

const isToken = ref<boolean>(false);

onMounted(() => {
  isToken.value = !!window.localStorage.getItem('token');
})
</script>

<template>
  <HomeBgComp/>
  <HomeHeaderComp/>
  <div class="home_container" v-if="isToken">
    <HomeUserComp/>
<!--    <HomeFuncItemComp/>-->
    <HomeUIComp/>
  </div>
  <div class="home_container" v-else>
    <HomeNoTokenComp/>
  </div>
<!--  <div class="foot_notice">-->
<!--    <p>当你进入了这个主页，而不是功能页面，那就意味着你不对劲！</p>-->
<!--    <p>奶果服务站可没有按钮指向奶果空间管理站的主页，不要偷偷的来主页哦。</p>-->
<!--  </div>-->
</template>

<style scoped lang="sass">
.home_container
  margin: 30px auto 0 auto
  width: 90vw
  display: flex
  flex-wrap: wrap
  gap: 30px
.foot_notice
  width: 90vw
  margin: 30px auto 0
  text-align: center
  color: white
  font-size: 20px
  padding: 20px
  background-color: #2c3e5090
  letter-spacing: 1px
</style>
