<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue'
import type {UserArchiveImp} from "@/interface/UserArchiveImp.ts";
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import type {ThemeClassifyBriefImpl, ThemeSubcategoryImpl} from "@/interface/ThemeImp.ts";
import {httpSpring} from "@/utils/http.ts";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
const userArchivePinia = useUserArchivePinia();

const editorRef = shallowRef<Editor | null>(null); // 编辑器实例，必须用 shallowRef
const toolbarConfig: Record<string, any> = {}
const editorConfig = { placeholder: '请输入内容...您无需输入作品名的标题大字，当您在右侧输入作品名后，服务器会自动生成标题大字！作品下载地址和作品简介您可以自行在这里编辑，这时您就无需再在右侧输入了！' }

const valueHtml = ref<string>('')// 内容 HTML
const userArchive = ref<UserArchiveImp>(userArchivePinia.userArchive);
const allClassifyAndSubcategoryList = ref<{
  classify_list: Array<ThemeClassifyBriefImpl>;
  subcategory_list: Array<ThemeSubcategoryImpl>;
} | null>(null);

const uploadButtonClicked = () => {

}

onMounted(() => {
  httpSpring({
    url: 'api/theme/all_classify_subcategory',
    method: 'GET',
  }).then(res => {
    if (res?.data?.code === 0){
      allClassifyAndSubcategoryList.value = res?.data?.data;
    } else console.error(res?.data?.message);
  }).catch(err => {console.error(err)});
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: Editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

watch(() => userArchivePinia.userArchive, (newVal: UserArchiveImp) => {userArchive.value = newVal})
</script>

<template>
  <header class="upload_works_header">
    <p class="upload_works_header_name">{{`${userArchive?.nickname|| '未命名'}`}}</p>
    <p class="upload_works_header_title">上传您的作品成果</p>
  </header>
  <div class="upload_works_container">
    <div class="upload_works_editor_box">
      <div class="upload_works_editor_title">
        <p>您可以自行设计您的作品在这里展示文章，效果会根据奶果服务站所展示位置自动优化</p>
        <button class="upload_button">确认发布文章</button>
      </div>
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
      />
    </div>
    <div class="upload_works_form_box">
      <div v-if="allClassifyAndSubcategoryList">
        <p class="upload_works_form_title">请选择作品分类</p>
        <div class="upload_works_classify_box">
          <label v-for="item in allClassifyAndSubcategoryList.classify_list" :key="item.classify_id">
            <input type="radio" name="classify_radio" :value="item.classify_value"/>{{item.zhsg_name}}
          </label>
        </div>
        <p class="upload_works_form_title">请选择二级分类</p>
        <div class="upload_works_subcategory_box">
          <label v-for="item in allClassifyAndSubcategoryList.subcategory_list" :key="item.subcategory">
            <input type="radio" name="classify_radio" :value="item.category_value"/>{{item.zhsg_name}}
          </label>
        </div>
        <p class="upload_works_form_title">请输入作品名</p>
        <input class="upload_works_form_input_bar" type="text" placeholder="请输入…"/>
        <p class="upload_works_form_title">请输入作品下载地址（非必须）</p>
        <input class="upload_works_form_input_bar" type="text" placeholder="您可以在左侧自行设计下载地址"/>
        <p class="upload_works_form_title">请输入作品简介（非必须）</p>
        <input class="upload_works_form_input_bar" type="text" placeholder="您可以在左侧自行设计简介"/>
        <p class="upload_works_form_title">请上传作品封面图</p>
        <div class="upload_works_form_img_bar"></div>
      </div>
      <div v-else>加载中……</div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.upload_works_header
  width: 100vw
  display: flex
  flex-direction: column
  text-align: center
  padding: 10px
  background-color: #2c3e50
  color: white
  .upload_works_header_name
    font-size: 1.2rem
    font-weight: bold
.upload_works_container
  width: 90vw
  margin: 0 auto
  display: flex
  gap: 30px
  .upload_works_editor_box
    width: 70%
    height: 80vh
    border: 1px solid #2c3e5080
    border-top: none
    .upload_works_editor_title
      border-bottom: 1px solid #2c3e5080
      letter-spacing: 1px
      display: flex
      align-items: center
      font-size: 16px
      .upload_button:hover
        background-color: #2c3e50
        cursor: pointer
      .upload_button
        transition: background-color .3s ease
        margin: 0 0 0 auto
        background-color: #22303e
        border: none
        color: white
        padding: 15px
        font-size: 16px
  .upload_works_form_box
    max-height: 80vh
    overflow: auto
    .upload_works_form_img_bar
      width: 100%
      height: 160px
      border: #2c3e5080 1px solid
    .upload_works_form_input_bar
      width: 100%
      height: 30px
    .upload_works_form_title
      font-size: 19px
      border-bottom: 1px solid #2c3e5080
      margin: 10px auto
      letter-spacing: 1px
    .upload_works_classify_box, .upload_works_subcategory_box
      display: flex
      gap: 20px
      flex-wrap: wrap
      margin-bottom: 30px
</style>
