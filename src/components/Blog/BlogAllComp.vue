<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {BlogBriefImpl} from "@/interface/BlogImpl.ts";
import {httpSpring} from "@/utils/http.ts";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {timestampToTime} from "@/utils/TimestampToTime.ts";
import {useRouter} from "vue-router";
const router = useRouter();

const blogList = ref<Array<BlogBriefImpl> | null>(null);

function itemClicked (blog_id: string) {
  router.push({name: 'BlogDetail', query: {blog_id: blog_id}});
}

async function fetchBlogList() {
  await httpSpring({
    url: 'api/blog/eligible_brief',
    method: 'GET',
    headers: {Authorization: window.localStorage.getItem('token')}
  }).then(async res => {
    if (res?.data?.code === 0) {
      blogList.value = res?.data?.data;
      // if (blogList.value) {
      //   for (let i = 0; i < blogList.value.length; i++) {
      //     try {
      //       const nicknameRes = await httpSpring({
      //         url: 'users/other/nickname',
      //         method: 'GET',
      //         params: {uuid: blogList.value[i].author}
      //       });
      //       if (nicknameRes.data.code === 0) {
      //         blogList.value[i].author_cn = nicknameRes.data.data;
      //       } else {
      //         blogList.value[i].author_cn = nicknameRes.data.message;
      //       }
      //     } catch (e) {
      //       console.error(e);
      //       blogList.value[i].author_cn = '请求错误';
      //     }
      //   }
      // }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}
onMounted(() => {
  fetchBlogList();
})
</script>

<template>
  <div class="blog_all_box" v-if="blogList">
    <div class="blog_all_search_bar">
      <input class="blog_all_search_input" type="text" placeholder="多个内容请用#号分隔"/>
      <button class="blog_all_search_button" title="查找所有关键词符合的结果">关键词检索</button>
      <button class="blog_all_search_button" title="查找关键词严格匹配的结果">标签检索</button>
      <button class="blog_all_search_button remove">重置</button>
    </div>
    <div class="blog_all_item_box">
      <div class="blog_all_item" v-for="(item, index) in blogList" :key="index" @click="itemClicked(item.blog_id)">
        <div class="blog_all_item_cover_box" v-if="item.cover_image">
          <img class="blog_all_item_cover" :src="item.cover_image" alt="cover_image"/>
        </div>
        <h2 class="blog_all_item_name">{{item.name}}</h2>
        <div class="blog_all_item_last_date_and_author">
<!--          <p>作者：{{item?.author_cn || '加载中…'}}</p>-->
          <p>最后编辑时间：{{timestampToTime(item.last_date)}}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="blog_all_box no" v-else>
    <p>加载中…</p>
  </div>
</template>

<style scoped lang="css">
@keyframes blog_all_in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.blog_all_box{
  opacity: 0;
  animation: blog_all_in .5s .4s forwards ease;
  padding-top: 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
  .blog_all_search_bar{
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    .blog_all_search_input[type="text"]:focus{
      background-color: rgba(255, 255, 255, 1);
    }
    .blog_all_search_input[type="text"]::placeholder{
      color: #355993;
    }
    .blog_all_search_input{
      width: 400px;
      border: 2px solid rgba(237, 228, 196, 1);
      background-color: rgba(255, 255, 255, 0.5);
      padding: 10px;
      font-size: 16px;
      outline: none; /* 移除默认的焦点边框 */
      transition: background-color 0.3s ease;
    }
    .blog_all_search_button:hover{
      background-color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
    .blog_all_search_button{
      transition: background-color .3s ease;
      padding: 0 20px;
      font-size: 18px;
      color: #355993;
      background-color: rgba(255, 255, 255, .5);
      border: 2px solid rgba(237, 228, 196, 1);
    }
    .remove{
      background-color: rgba(237, 228, 196, .5);
    }
  }
  .blog_all_item_box{
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: space-between;
    .blog_all_item:hover{
      box-shadow: #ede4c4 0 0 10px;
      cursor: pointer;
      background-color: #8da3c6;
      .blog_all_item_cover:hover{
        width: 120%;
      }
    }
    .blog_all_item {
      transition: .3s ease;
      background-color: #fbae5a90;
      width: 400px;
      height: 230px;
      position: relative;

      .blog_all_item_cover_box {
        width: 100%;
        height: 50%;
        overflow: hidden;
        position: relative;

        .blog_all_item_cover {
          transition: .3s ease;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
        }
      }

      .blog_all_item_last_date_and_author {
        position: absolute;
        bottom: 0;
        right: 0;
        color: white;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: end;
      }

      .blog_all_item_name {
        padding: 0 15px;
        font-weight: bold;
      }
    }
  }
}
</style>
