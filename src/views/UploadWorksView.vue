<script setup lang="ts">
import '@opentiny/fluent-editor/style.css';
import {ref, onMounted, watch, nextTick} from 'vue'
import type {UserArchiveImpl} from "@/interface/UserArchiveImpl.ts";
import {useUserArchivePinia} from "@/stores/UserArchivePinia.ts";
import type {ThemeClassifyBriefImpl, ThemeImp, ThemeSubcategoryImpl} from "@/interface/ThemeImp.ts";
import {httpSpring} from "@/utils/http.ts";
const userArchivePinia = useUserArchivePinia();
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"
import FluentEditor from '@opentiny/fluent-editor';
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";

// const toolbarConst = [
//   ['undo', 'redo', 'clean'],
//   [{ direction: 'rtl' }],
//   [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: ['songti', 'yahei', 'kaiti', 'heiti', 'lishu', 'mono', 'arial', 'arialblack', 'comic', 'impact', 'times'] }, { size: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] }],
//   ['bold', 'italic', 'strike', 'underline'],
//   [{ color: [] }, { background: [] }],
//   [{ align: '' }, { align: 'center' }, { align: 'right' }],
//   [{ script: 'sub' }, { script: 'super' }],
//   ['link', 'image', 'file', 'better-table'],
//   ['emoji', 'video', 'formula', 'fullscreen'],
// ]

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
const imageDataUrl = ref<string | null>(null);
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
  reader.onloadend = () => {
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
          imageDataUrl.value = res?.data?.data;
          copperShow.value = false;
        } else showMessageNotice('red', res?.data?.message);
      }).catch(err => {console.error(err); showExceptionNotice();})
    }
  })
}

// 触发文件输入元素的点击事件
const triggerFileInput = () => {
  copperShow.value = true;
};

const deleteImageClicked = () => {imageDataUrl.value = null;}

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

let editor: FluentEditor | null = null;
function editorImageHandler(image: File, callback: (imageUrl: string) => void) {
  const data = new FormData();
  data.append('file', image, Date.now().toString());
  httpSpring({
    url: 'api/file/upload',
    method: 'POST',
    headers: {"Content-Type": "multipart/form-data", Authorization: window.localStorage.getItem('token')},
    data: data
  }).then(res => {
    if (res?.data?.code === 0){
      callback(res?.data?.data);
    } else showMessageNotice('red', res?.data?.message);
  }).catch(err => {console.error(err); showExceptionNotice();})
}
function editorFileUploadHandler(file: File, callback: (responseUrl: string) => void) {
  const data = new FormData();
  data.append('file', file, Date.now().toString());
  httpSpring({
    url: 'api/file/upload',
    method: 'POST',
    headers: {"Content-Type": "multipart/form-data", Authorization: window.localStorage.getItem('token')},
    data: data
  }).then(res => {
    if (res?.data?.code === 0){
      callback(res?.data?.data);
    } else showMessageNotice('red', res?.data?.message);
  }).catch(err => {console.error(err); showExceptionNotice();})
}
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
      },
      uploadOption: {
        fileUpload: ({ file, callback }) => {
          editorFileUploadHandler(file, (responseUrl) => {
            callback({
              code: 0,
              message: 'Upload success!',
              data: {
                responseUrl,
              },
            });
          });
        },
        imageUpload: ({ file, callback }) => {
          editorImageHandler(file, (imageUrl) => {
            callback({
              code: 0,
              message: 'Upload success!',
              data: {
                imageUrl,
              },
            })
          })
        },
      }
    });
    editor.root.innerHTML = valueHtml.value;
    editor.on('text-change', () => {
      valueHtml.value = editor?.root.innerHTML || '';
      console.log(valueHtml.value);
    });
  });
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
<!--  <input type="file" ref="editorImageInput" style="display: none;" @change="handleEditorImageUpload" />-->
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
