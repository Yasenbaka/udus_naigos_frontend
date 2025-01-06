<script setup lang="ts">
import '@opentiny/fluent-editor/style.css';
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {showExceptionNotice, showMessageNotice} from "@/utils/MsgNotific.ts";
import {httpSpring} from "@/utils/http.ts";
import type {ThemeImp} from "@/interface/ThemeImp.ts";
import type {FluentEditor} from "@opentiny/fluent-editor/types/fluent-editor";
const route = useRoute();
const router = useRouter();

const valueHtml = ref<string>('<p>请等待加载</p>');
const themeDetail = ref<ThemeImp | null>(null);
const whyEditShow = ref<boolean>(false);

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
  <header class="work_edit_header">
    <h1>修改作品文章</h1>
    <p @click="whyEditClicked">为何不能修改分类？</p>
  </header>
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
</style>
