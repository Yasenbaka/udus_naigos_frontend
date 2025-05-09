<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {httpSpring} from "@/utils/http.ts";
import type {BlogImpl} from "@/interface/BlogImpl.ts";
import FluentEditor from "@opentiny/fluent-editor";
import Cropper from "cropperjs";
const route = useRoute();
const router = useRouter();

const blogDetail = ref<BlogImpl | null>(null);
const copperShow = ref<boolean>(false);
const coverImageValue = ref<string | null>(null);
const coverInputRef = ref<HTMLInputElement | null>(null);

function editBlogClicked() {
  httpSpring({
    url: 'api/blog/update',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('token')
    },
    data: blogDetail.value
  }).then(res => {
    if (res?.data?.code === 0) {
      showMessageNotice('green', res?.data?.data);
      router.back();
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}

let coverFilename: string | undefined = undefined;
let cropper: Cropper | null = null;
const triggerInput = () => {if (coverInputRef.value) coverInputRef.value.click();}
const initCropper = () => {
  if (cropper !== null) cropper.destroy();
  const image = document.getElementById("coverImage") as HTMLImageElement;
  cropper = new Cropper(image, {
    viewMode: 1, aspectRatio: 1200/345, cropBoxResizable: false, toggleDragModeOnDblclick: false, movable: false, preview: '.image_preview'
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
const handleUploadCover = (blob: Blob, saveTarget: number) => {
  console.log('diaoyong');
  const fileName = `${Date.now()}_${coverFilename}_${saveTarget === 0? '400': saveTarget === 1? '800': '1200'}`;
  const formData = new FormData();
  formData.append("file", blob, fileName);
  httpSpring({
    url: 'api/file/upload',
    method: "POST",
    headers: {"Content-Type": "multipart/form-data", Authorization: window.localStorage.getItem("token")},
    data: formData
  }).then(res => {
    if (res?.data?.code === 0) {
      if (!blogDetail.value) return;
      switch (saveTarget) {
        case 0: {
          blogDetail.value.cover_image = res?.data?.data;
          showMessageNotice('green', res?.data?.message + '：400px');
          break;
        }
        case 1: {
          blogDetail.value.cover_image_800 = res?.data?.data;
          showMessageNotice('green', res?.data?.message + '：800px');
          break;
        }
        case 2: {
          blogDetail.value.cover_image_1200 = res?.data?.data;
          showMessageNotice('green', res?.data?.message + '：1200px');
          break;
        }
        default: break;
      }
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
}
const uploadCoverClicked = () => {
  const cropperCanvas = cropper?.getCroppedCanvas({
    width: 400, height: 115, imageSmoothingEnabled: true, imageSmoothingQuality: "high"
  });
  cropperCanvas?.toBlob(blob => {
    if (blob) {
      handleUploadCover(blob, 0);
    }
  })
  const cropperCanvas800 = cropper?.getCroppedCanvas({
    width: 800, height: 230, imageSmoothingEnabled: true, imageSmoothingQuality: "high"
  });
  cropperCanvas800?.toBlob(blob => {
    if (blob) {
      handleUploadCover(blob, 1);
    }
  })
  const cropperCanvas1200 = cropper?.getCroppedCanvas({
    width: 1200, height: 345, imageSmoothingEnabled: true, imageSmoothingQuality: "high"
  });
  cropperCanvas1200?.toBlob(blob => {
    if (blob) {
      handleUploadCover(blob, 2);
    }
  })
}

function fetchBlog(blogId: string) {
  httpSpring({
    url: 'api/blog/only',
    method: 'GET',
    params: {blog_id: blogId}
  }).then(res => {
    if (res?.data?.code === 0) {
      blogDetail.value = res?.data?.data;
      if (!blogDetail.value) {showExceptionNotice(); return;}
      initEditor();
      httpSpring({
        url: 'users/other/nickname',
        method: 'GET',
        params: {uuid: blogDetail.value.author}
      }).then(res => {
        if (res?.data?.code === 0) {
          if (!blogDetail.value) {showExceptionNotice(); return;}
          blogDetail.value.author_cn = res?.data?.data;
        } else showMessageNotice('red', res?.data?.message);
      })
    } else showMessageNotice('red', res?.data?.message);
  }).catch(() => {showExceptionNotice();});
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
    editor = new FluentEditor('#blog_edit_editor', {
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
    editor.root.innerHTML = blogDetail.value?.content || '';
    editor.on('text-change', () => {
      if (blogDetail.value) blogDetail.value.content = editor?.root.innerHTML || '';
    });
  });
}

onMounted(() => {
  const query = route.query;
  if (query.blog_id) {
    const blogId: string = query.blog_id.toString();
    fetchBlog(blogId);
  }
  else showExceptionNotice();
})
</script>

<template>
  <el-dialog v-model="copperShow" class="copper_dialog" title="更换文章封面图" style="width: auto;">
    <input type="file" style="display: none" accept="image/*" ref="coverInputRef" @change="selectCoverFile"/>
    <div style="">
      <p>1200px * 345px效果（用于Banner、推荐、头图）</p>
      <div class="cover_box" style="width: calc(400px*3); height: calc(115px*3); border: #DE91A9FF solid 1px">
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
      <div class="image_preview_box ">
        <el-button v-if="coverImageValue" type="success" native-type="button" @click="uploadCoverClicked">确定使用</el-button>
        <el-button v-if="coverImageValue" type="warning" native-type="button" @click="triggerInput">重新选择</el-button>
        <p>800px * 230px效果（用于头图、预览）</p>
        <div class="image_preview"
             style="width: calc(400px * 2);
          height: calc(115px * 2);
           border: #DE91A9FF 1px solid;overflow: hidden"></div>
      </div>
      <div class="image_preview_box">
        <p>400px * 115px效果（用于作品栏）</p>
        <div class="image_preview"
             style="width: 400px;
          height: 115px;
           border: #DE91A9FF 1px solid;overflow: hidden"></div>
      </div>
    </div>
  </el-dialog>
  <div class="blog_edit_box">
    <div class="blog_edit_title_bar">
      <h2>文章修改</h2>
      <p>文章作者：{{blogDetail?.author_cn || '尚无归属'}}</p>
    </div>
    <div class="blog_edit_detail" v-if="blogDetail">
      <img class="blog_edit_detail_cover" v-if="blogDetail.cover_image" :src="blogDetail.cover_image" alt="cover_image"/>
      <div class="blog_edit_detail_form">
        <el-form :model="blogDetail">
          <el-form-item label="文章标题："><el-input type="text" v-model="blogDetail.name"/></el-form-item>
          <el-form-item label="文章标签："><el-input type="text" v-model="blogDetail.label"/></el-form-item>
          <el-form-item label="文章附件："><el-input type="text" v-model="blogDetail.attachment"/></el-form-item>
        </el-form>
      </div>
    </div>
    <div class="blog_edit_button_bar">
      <el-button type="primary" native-type="button" @click="copperShow = true">更换封面</el-button>
      <el-button type="success" native-type="button" @click="editBlogClicked">确定修改并上传文章</el-button>
    </div>
    <div id="blog_edit_editor"></div>
  </div>
</template>

<style scoped lang="css">
.blog_edit_box{
  width: 100%;
  background-color: #ffffff90;
  .blog_edit_title_bar{
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .blog_edit_detail{
    display: flex;
    flex-direction: row;
    gap: 30px;
    .blog_edit_detail_cover{
      width: 400px;
      height: 115px;
    }
    .blog_edit_detail_form {
      flex: 1;
    }
  }
  .blog_edit_button_bar{
    text-align: center;
    margin: 20px auto;
  }
}
</style>
