<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {httpSpring} from "@/utils/http.ts";
import type {BlogImpl} from "@/interface/BlogImpl.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {timestampToTime} from "@/utils/TimestampToTime.ts";
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
const blogLabel = ref<Array<string> | undefined>(undefined);

const itemClicked = (item: ItemImpl): void => {
  function editBlog(routerName: string) {
    if (!blogDetail.value) return;
    router.push({name: routerName, query: {blog_id: blogDetail.value.blog_id}})
  }
  function commentBlog(explain: string) {
    showMessageNotice('red', explain);
  }
  function deleteBlog() {
    if (!blogDetail.value) {
      showExceptionNotice();
      return;
    }
    httpSpring({
      url: 'api/blog/delete',
      method: 'DELETE',
      headers: {Authorization: window.localStorage.getItem('token')},
      params: {blog_id: blogDetail.value.blog_id}
    }).then(res => {
      if (res?.data?.code === 0) {
        showMessageNotice('green', res?.data?.data);
        router.back();
      } else showMessageNotice('red', res?.data?.message);
    }).catch(() => {showExceptionNotice();})
  }
  switch (item.router_name) {
    case 'BlogDelete': deleteBlog(); break;
    case 'BlogComment': commentBlog(item?.explain || ''); break;
    case 'BlogEdit': editBlog(item.router_name); break;
    default: break;
  }
}

function fetchBlogDetail(blog_id: string) {
  httpSpring({
    url: 'api/blog/only',
    method: 'GET',
    params: {blog_id: blog_id}
  }).then(res => {
    if (res?.data?.code === 0){
      blogDetail.value = res?.data?.data;
      if (blogDetail.value) {
        blogLabel.value = blogDetail.value.label?.split('#');
      }
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
  <div class="blog_detail_box" v-if="blogDetail">
    <h1 class="blog_detail_name">{{blogDetail.name}}</h1>
    <div class="blog_detail_cover_and_item_box" v-if="blogDetail.cover_image">
      <div class="blog_detail_cover_box">
        <img class="blog_detail_cover" :src="blogDetail.cover_image" alt="cover_image" />
      </div>
      <div class="blog_detail_item_box">
        <div class="blog_detail_item"
             v-for="item in itemList"
             :key="item.router_name"
             :title="item?.explain || undefined"
             @click="itemClicked(item)"
        >
          {{item.title}}
        </div>
      </div>
    </div>
    <div class="blog_detail_information_box" v-if="blogDetail">
      <div class="blog_detail_information">
        <p>文章标签：</p>
        <p v-for="(item, index) in blogLabel" :key="index">#{{item}}&nbsp;</p>
      </div>
      <div class="blog_detail_information">
        <p>文章附件：</p>
        <p>{{blogDetail.attachment? '存在': '不存在'}}</p>
      </div>
      <div class="blog_detail_information">
        <p>首次上传：</p>
        <p>{{timestampToTime(blogDetail.upload_date)}}</p>
      </div>
      <div class="blog_detail_information">
        <p>最后修改：</p>
        <p>{{timestampToTime(blogDetail.last_date)}}</p>
      </div>
      <div class="blog_detail_html_box">
        <h2>文章内容</h2>
        <hr/>
        <div v-if="blogDetail.content" v-html="blogDetail.content"></div>
        <div v-else>无内容</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
@keyframes blog_detail_in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.blog_detail_box{
  opacity: 0;
  animation: blog_detail_in .5s forwards ease;
  width: 100%;
  background-color: #ffffff90;
  padding-top: 20px;
  .blog_detail_html_box{
    margin-top: 20px;
    width: 100%;
    text-align: center;
    hr{
      margin: 10px auto;
    }
  }
  .blog_detail_information_box{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .blog_detail_information{
      p:first-child{
        font-size: 20px;
        font-weight: bold;
      }
      display: flex;
      align-items: end;
    }
  }
  .blog_detail_name{
    text-align: center;
    font-weight: bold;
    text-shadow: #fbae5a 0 0 5px;
    margin-bottom: 20px;
  }
  .blog_detail_cover_and_item_box {
    display: flex;
    flex-direction: row;
    .blog_detail_cover_box {
      width: calc(400px * 2);
      height: calc(115px * 2);
      position: relative;
      overflow: hidden;
      .blog_detail_cover {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .blog_detail_item_box {
      display: flex;
      flex-direction: row;
      flex: 1;
      .blog_detail_item:hover{
        cursor: pointer;
        background-color: #8ea4c8ff;
      }
      .blog_detail_item{
        color: white;
        font-size: 20px;
        letter-spacing: 1px;
        flex: 1;
        background-color: rgba(142, 164, 200, .9);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
