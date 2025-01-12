<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
const route = useRoute();

const blogId = ref<string | null>(null);

onMounted(() => {
  const query = route.query;
  if (query.blog_id) blogId.value = query.blog_id.toString();
  else showExceptionNotice();
})
</script>

<template>
  <div class="blog_edit_box">

  </div>
</template>

<style scoped lang="css">

</style>
