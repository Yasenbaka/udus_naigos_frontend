<script setup lang="ts">
import '@opentiny/fluent-editor/style.css';
import {useRoute, useRouter} from "vue-router";
import {nextTick, onMounted, ref} from "vue";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {httpSpring} from "@/utils/http.ts";
import type {ThemeImp} from "@/interface/ThemeImp.ts";
import type {FluentEditor} from "@opentiny/fluent-editor/types/fluent-editor";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"
const route = useRoute();
const router = useRouter();

const valueHtml = ref<string>('<p>请等待加载</p>');
const themeDetail = ref<ThemeImp | null>(null);
const whyEditShow = ref<boolean>(false);
const copperShow = ref<boolean>(false);
const coverImageValue = ref<string | null>(null);
const coverInputRef = ref<HTMLInputElement | null>(null);

let coverFilename: string | undefined = undefined;

let cropper: Cropper | null = null;
const triggerInput = () => {if (coverInputRef.value) coverInputRef.value.click();}
const initCropper = () => {
  if (cropper !== null) cropper.destroy();
  const image = document.getElementById("coverImage") as HTMLImageElement;
  cropper = new Cropper(image, {
    viewMode: 1, aspectRatio: 250/130, cropBoxResizable: false, toggleDragModeOnDblclick: false, movable: false, preview: '.image_preview'
  })
}
const selectCoverFile = (e: Event) => {
  coverImageValue.value = null;
  const {files} = e.target as HTMLInputElement;
  if (!files || !files.length) return;
  const file = files[0];
  coverFilename = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = (e: Event) => {
    coverImageValue.value = String(reader.result);
    if (coverInputRef.value) coverInputRef.value.value = "";
    nextTick(() => {initCropper();})
  }
}
const uploadCoverClicked = () => {
  const cropperCanvas = cropper?.getCroppedCanvas({
    width: 250, height: 130, imageSmoothingEnabled: true, imageSmoothingQuality: "high"
  });
  cropperCanvas?.toBlob(blob => {
    if (blob) {
      console.log(blob);
      const fileName = `${Date.now()}_${coverFilename}`;
      const formData = new FormData();
      formData.append("file", blob, fileName);
      httpSpring({
        url: "api/file/upload",
        method: "POST",
        headers: {"Content-Type": "multipart/form-data", Authorization: window.localStorage.getItem("token")},
        data: formData
      }).then(res => {
        if (res?.data?.code === 0) {
          showMessageNotice('green', res?.data?.message);
          if (themeDetail.value) themeDetail.value.header_image = res?.data?.data;
          copperShow.value = false;
        } else showMessageNotice('red', res?.data?.message);
      }).catch(err => {console.error(err); showExceptionNotice();})
    }
  })
}

const whyEditClicked = () => {whyEditShow.value = true;}

function fetchTheme (theme_id: string | undefined) {
  if (typeof theme_id === 'undefined') {showMessageNotice('red', '无效参数！');}
  httpSpring({
    url: 'api/theme/only',
    method: 'GET',
    params: {theme_id: theme_id}
  }).then(res => {
    if (res?.data?.code === 0){
      themeDetail.value = res?.data?.data;
      valueHtml.value = themeDetail.value?.detail_html || '<p>您未编辑详情页面</p>';
      editor.root.innerHTML = valueHtml.value;
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();})
}

const editThemeCheck = () => {
  if (!themeDetail.value) {showExceptionNotice(); return;}
  themeDetail.value.detail_html = valueHtml.value;
  httpSpring({
    url: 'api/theme/update',
    method: 'PUT',
    headers: {"Content-Type": "application/json", Authorization: window.localStorage.getItem("token")},
    data: themeDetail.value
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('green', res?.data?.data);
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();})
}

onMounted(() => {
  fetchTheme(route.query.theme_id?.toString());
  initEditor();
})

let editor: FluentEditor;

function initEditor() {
  import("@opentiny/fluent-editor").then(mod => {
    const FluentEditor = mod.default;
    editor = new FluentEditor('#editor', {
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
    editor.root.innerHTML = valueHtml?.value || '';
    editor.on('text-change', () => {
      valueHtml.value = editor.root.innerHTML;
      console.log(valueHtml.value);
    });
  })
}
</script>

<template>
  <el-dialog v-model="whyEditShow" title="为何只能有限修改？">
    <h2>解释：</h2>
    <p>对于系统而言，您发布作品文章后，将生成固定的分类编号。</p>
    <p>这是唯一的，只属于您的作品的，倘若您更换分类，要重新生成编号。</p>
    <h2>解决：</h2>
    <p>所以在实际操作中，若您需要更换分类，请重新上传作品。</p>
    <p>若您有评论、反馈等，想用在新作品上，您可以选择<strong> [继承作品] </strong>。</p>
    <p>继承作品时请您先上传新的作品，并保证您旧作品没有被您删除，系统在继承成功后会为您自动删除旧作品。</p>
  </el-dialog>
  <el-dialog v-model="copperShow" class="copper_dialog" title="更换作品封面图">
    <input type="file" style="display: none" accept="image/*" ref="coverInputRef" @change="selectCoverFile"/>
    <div style="display: flex; align-items: end; gap: 20px">
      <div class="cover_box" style="width: calc(250px*2); height: calc(130px*2); border: #DE91A9FF solid 1px">
        <img v-if="coverImageValue" :src="coverImageValue" alt="cover" id="coverImage"
             style="width: 100%; height: 100%;"/>
        <div v-else
             style="width: 100%;
          height: 100%;
            display: flex;
             align-items: center;
              justify-content: center">
          <el-button native-type="button" @click="triggerInput">请选择图片</el-button>
        </div>
      </div>
      <div class="image_preview_box">
        <el-button v-if="coverImageValue" type="success" native-type="button" @click="uploadCoverClicked">确定使用</el-button>
        <el-button v-if="coverImageValue" type="warning" native-type="button" @click="triggerInput">重新选择</el-button>
        <p>250px * 130px效果</p>
        <div class="image_preview"
             style="width: 250px;
          height: 130px;
           border: #DE91A9FF 1px solid;overflow: hidden"></div>
      </div>
    </div>
  </el-dialog>
  <header class="work_edit_header">
    <h1>修改作品文章</h1>
    <p @click="whyEditClicked">为何不能修改分类？</p>
  </header>
  <div class="work_edit_detail_box" v-if="themeDetail">
    <img class="work_edit_detail_cover" v-if="themeDetail?.header_image" :src="themeDetail.header_image" alt="header_img"/>
    <el-form class="work_edit_detail_form" label-width="auto" :model="themeDetail" @submit.prevent="editThemeCheck">
      <el-form-item label="作品名："><el-input type="text" v-model="themeDetail.name"/></el-form-item>
      <el-form-item label="作品介绍："><el-input type="textarea" v-model="themeDetail.introduce"/></el-form-item>
      <el-form-item label="作品下载地址："><el-input type="text" v-model="themeDetail.url"/></el-form-item>
      <el-form-item label="更改封面与确定修改：">
        <el-button type="primary" @click="copperShow = true" native-type="button">更换封面</el-button>
        <el-button type="success" native-type="submit" style="width: 150px">确定修改并上传作品</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="work_edit_box">
    <div id="editor"></div>
  </div>
</template>

<style scoped lang="css">
.work_edit_header{
  width: 100%;
  height: 80px;
  background-color: #DE91A9FF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  p{
    letter-spacing: 1px;
  }
}
.work_edit_detail_box{
  display: flex;
  gap: 30px;
  .work_edit_detail_cover{
    width: calc(250px * 2);
    height: calc(130px * 2);
  }
  .work_edit_detail_form{
    flex: 1;
  }
}
</style>
