<script setup lang="ts">
import '@opentiny/fluent-editor/style.css';
import { ref, onMounted, watch } from 'vue'
import type {UserArchiveImpl} from "@/interface/UserArchiveImpl.ts";
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import type {ThemeClassifyBriefImpl, ThemeImp, ThemeSubcategoryImpl} from "@/interface/ThemeImp.ts";
import {httpSpring} from "@/utils/http.ts";
const userArchivePinia = useUserArchivePinia();
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"

const toolbarConst = [
  ['undo', 'redo', 'clean'],
  [{ direction: 'rtl' }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: ['songti', 'yahei', 'kaiti', 'heiti', 'lishu', 'mono', 'arial', 'arialblack', 'comic', 'impact', 'times'] }, { size: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] }],
  ['bold', 'italic', 'strike', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ align: '' }, { align: 'center' }, { align: 'right' }],
  [{ script: 'sub' }, { script: 'super' }],
  ['link', 'image', 'file', 'better-table'],
  ['emoji', 'video', 'formula', 'fullscreen'],
]

const valueHtml = ref<string>('<p>请在此做您的编辑！</p>')
const userArchive = ref<UserArchiveImpl | null>(null);
const allClassifyAndSubcategoryList = ref<{
  classify_list: Array<ThemeClassifyBriefImpl>;
  subcategory_list: Array<ThemeSubcategoryImpl>;
} | null>(null);
const themeForm = ref<ThemeImp>({name: '', url: null, introduce: null, header_image: null, detail_html: null, theme_id: '', classify_id: null, author: null});
const themeCSForm = ref<{
  classify: {
    classify_id: string | null;
    classify_value: string
  },
  subcategory: {
    subcategory: string;
    category_value: string;
  }
}>({classify: {classify_id: null, classify_value: ''}, subcategory: {subcategory: '', category_value: ''}});
// 使用 ref 来管理文件输入元素和图片数据的 URL
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageDataUrl = ref<string | null>(null);

// 触发文件输入元素的点击事件
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const deleteImageClicked = () => {imageDataUrl.value = null;}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // 设置 canvas 的大小为 250x130
        canvas.width = 250;
        canvas.height = 130;
        // 计算切割区域和缩放比例
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
        const dx = 0, dy = 0, dWidth = 250, dHeight = 130;
        // 根据图片宽高比调整切割区域
        const aspectRatio = img.width / img.height;
        if (aspectRatio > (250 / 130)) {
          // 图片更宽，按高度切割
          sWidth = sHeight * (250 / 130);
          sx = (img.width - sWidth) / 2;
        } else {
          // 图片更高或等比，按宽度切割
          sHeight = sWidth / (250 / 130);
          sy = (img.height - sHeight) / 2;
        }
        // 绘制切割后的图片到 canvas 上
        if (ctx) ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        // 将 canvas 内容转换为 Base64
        imageDataUrl.value = canvas.toDataURL('image/png');
      };

      img.src = (e.target as FileReader).result as string;
    };

    reader.readAsDataURL(file);
  }
};

// 处理文件改变事件
// const handleFileChange = (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   const file = target.files?.item(0);
//
//   if (file && file.type.startsWith('image/')) {
//     const reader = new FileReader();
//
//     reader.onload = (e: ProgressEvent<FileReader>) => {
//       // 将读取到的文件内容（Base64 编码）赋值给 imageDataUrl
//       imageDataUrl.value = (e.target as FileReader).result as string;
//       console.log(imageDataUrl.value);
//     };
//
//     reader.onerror = (error) => {
//       console.error('Error reading file:', error);
//     };
//
//     reader.readAsDataURL(file);
//   } else {
//     console.warn('Please select a valid image file.');
//   }
// };

const uploadButtonClicked = () => {
  if (userArchive.value) themeForm.value.author = userArchive.value.group_real_user_id;
  else {
    // console.log('userArchive为null');
    return;
  }
  console.log(themeCSForm.value);
  if (themeCSForm.value.classify.classify_value === '' || themeCSForm.value.subcategory.category_value === '') {
    // console.log("classify_value或subcategory_value为空");
    return;
  }
  themeForm.value.classify_id = themeCSForm.value.classify.classify_id;
  themeForm.value.theme_id = `${themeCSForm.value.classify.classify_value}_${themeCSForm.value.subcategory.category_value}`;
  themeForm.value.detail_html = valueHtml.value;
  themeForm.value.header_image = imageDataUrl.value;
  if (themeForm.value.name === '') {console.log('themeFormName为空'); return;}
  // console.log('通过全部截获', themeForm.value);
  httpSpring({
    url: 'api/theme/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('token')
    },
    data: themeForm.value
  }).then(res => {
    if (res?.data?.code === 0){
      alert(res?.data?.data);
    } else alert(res?.data?.message);
  }).catch(err => {console.error(err); alert('未知异常！')})
}
function initEditor() {
  import("@opentiny/fluent-editor").then(mod => {
    const FluentEditor = mod.default;
    const editor = new FluentEditor('#editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['undo', 'redo', 'clean'],
          [{ direction: 'rtl' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: ['songti', 'yahei', 'kaiti', 'heiti', 'lishu', 'mono', 'arial', 'arialblack', 'comic', 'impact', 'times'] }, { size: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] }],
          ['bold', 'italic', 'strike', 'underline'],
          [{ color: [] }, { background: [] }],
          [{ align: ['', 'center', 'right']}],
          [{ script: 'sub' }, { script: 'super' }],
          ['link', 'image', 'file', 'better-table'],
          ['emoji', 'video', 'formula', 'fullscreen'],
        ]
      }
    });
    editor.root.innerHTML = valueHtml.value;
    editor.on('text-change', () => {
      valueHtml.value = editor.root.innerHTML;
      console.log(valueHtml.value);
    });
  })
}
onMounted(() => {
  initEditor();
  userArchive.value = userArchivePinia.userArchive;
  httpSpring({
    url: 'api/theme/all_classify_subcategory',
    method: 'GET',
  }).then(res => {
    if (res?.data?.code === 0){
      allClassifyAndSubcategoryList.value = res?.data?.data;
    } else console.error(res?.data?.message);
  }).catch(err => {console.error(err)});
})

watch(() => userArchivePinia.userArchive, (newVal: UserArchiveImpl) => {userArchive.value = newVal})
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
        <button class="upload_button" @click="uploadButtonClicked" type="button">确认发布文章</button>
      </div>
      <div id="editor" style="height: 500px;"></div>
<!--      <Toolbar-->
<!--        style="border-bottom: 1px solid #ccc"-->
<!--        :editor="editorRef"-->
<!--        :defaultConfig="toolbarConfig"-->
<!--      />-->
<!--      <Editor-->
<!--        style="height: 500px; overflow-y: hidden;"-->
<!--        v-model="valueHtml"-->
<!--        :defaultConfig="editorConfig"-->
<!--        @onCreated="handleCreated"-->
<!--      />-->
    </div>
    <div class="upload_works_form_box">
      <div v-if="allClassifyAndSubcategoryList">
        <p class="upload_works_form_title">请选择作品分类</p>
        <div class="upload_works_classify_box">
          <label v-for="item in allClassifyAndSubcategoryList.classify_list" :key="item.classify_id">
            <input type="radio" name="classify_radio" :value="item" v-model="themeCSForm.classify"/>{{item.zhsg_name}}
          </label>
        </div>
        <p class="upload_works_form_title">请选择二级分类</p>
        <div class="upload_works_subcategory_box">
          <label v-for="item in allClassifyAndSubcategoryList.subcategory_list" :key="item.subcategory">
            <input type="radio" name="subcategory_radio" :value="item" v-model="themeCSForm.subcategory"/>{{item.zhsg_name}}
          </label>
        </div>
        <p class="upload_works_form_title">请输入作品名</p>
        <input class="upload_works_form_input_bar" type="text" placeholder="请输入…" v-model="themeForm.name"/>
        <p class="upload_works_form_title">请输入作品下载地址（非必须）</p>
        <input class="upload_works_form_input_bar" type="text" placeholder="您可以在左侧自行设计下载地址" v-model="themeForm.url"/>
        <p class="upload_works_form_title">请输入作品简介（非必须）</p>
        <input class="upload_works_form_input_bar" type="text" placeholder="您可以在左侧自行设计简介" v-model="themeForm.introduce"/>
        <p class="upload_works_form_title">请上传作品封面图<span style="font-size: 14px; letter-spacing: 0; color: #811515">(请使用250px*130px像素图片)</span></p>
        <input type="file" ref="fileInputRef" style="display: none;" @change="handleFileChange" accept="image/*" />
        <div class="upload_works_form_img_bar" v-if="imageDataUrl" @click="triggerFileInput">
          <img class="header_image" :src="imageDataUrl || ''" alt="header_img"/>
        </div>
        <div class="upload_works_form_img_bar no_image" v-else @click="triggerFileInput">
          <p>请选择图片</p>
        </div>
        <button class="delete_image_button" v-if="!!imageDataUrl" @click="deleteImageClicked">删除图片</button>
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
    .delete_image_button:hover
      background-color: #2c3e50
      cursor: pointer
    .delete_image_button
      margin-top: 20px
      transition: background-color .3s ease
      width: 250px * 1.2
      height: 48px
      background-color: #2c3e5080
      border: none
      color: white
      letter-spacing: 1px
      font-size: 16px
    .upload_works_form_img_bar:hover
      cursor: pointer
    .no_image
      display: flex
      align-items: center
      justify-content: center
    .upload_works_form_img_bar
      height: 130px * 1.2
      width: 250px *1.2
      border: #2c3e5080 1px solid
      position: relative
      overflow: hidden
      .header_image
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        width: 100%
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
