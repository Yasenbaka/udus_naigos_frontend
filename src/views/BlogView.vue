<script setup lang="ts">

import BlogHeaderComp from "@/components/Blog/BlogHeaderComp.vue";
import BlogFuncComp from "@/components/Blog/BlogFuncComp.vue";
import BlogBgComp from "@/components/Blog/BlogBgComp.vue";
</script>

<template>
  <BlogBgComp/>
  <BlogHeaderComp/>
  <div class="blog_container">
    <BlogFuncComp/>
    <RouterView/>
  </div>
</template>

<style scoped lang="css">
.blog_container{
  width: 80%;
  margin: 0 auto;
}
</style>
