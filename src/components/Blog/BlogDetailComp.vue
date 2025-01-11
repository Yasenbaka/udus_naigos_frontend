<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {httpSpring} from "@/utils/http.ts";
import type {BlogImpl} from "@/interface/BlogImpl.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
const route = useRoute();
const router = useRouter();

interface ItemImpl{
  title: string; router_name: string; explain?: string;
}
const itemList: Array<ItemImpl> = [
  {title: '修改', router_name: 'BlogEdit', explain: '对文章进行修改'},
  {title: '删除', router_name: 'BlogDelete'},
  {title: '评论', router_name: 'BlogComment', explain: '功能尚在开发中'},
]

const blogDetail = ref<BlogImpl | null>(null);

function fetchBlogDetail(blog_id: string) {
  httpSpring({
    url: 'api/blog/only',
    method: 'GET',
    params: {blog_id: blog_id}
  }).then(res => {
    if (res?.data?.code === 0){
      blogDetail.value = res?.data?.data;
    } else {
      showMessageNotice('red', res?.data?.message);
    }
  }).catch(() => {showExceptionNotice();})
}

onMounted(() => {
  const query = route.query;
  if (query?.blog_id) {
    fetchBlogDetail(query?.blog_id.toString());
  }
})
</script>

<template>
  <div class="blog_detail_box">
    {{blogDetail? blogDetail: ''}}
  </div>
</template>

<style scoped lang="css">

</style>
