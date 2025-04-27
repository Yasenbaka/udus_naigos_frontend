import BlueArchiveView from "@/views/BlueArchiveView.vue";
import BaWorkUDUSComp from "@/components/BlueArchive/BaWork/BaWorkUDUSComp.vue";
import BaStudentComp from "@/components/BlueArchive/BaStudent/BaStudentComp.vue";
import BaStudentUploadComp from "@/components/BlueArchive/BaStudent/BaStudentUploadComp.vue";

export default {
  path: '/ba',
  name: 'BlueArchive',
  component: BlueArchiveView,
  redirect: {name: 'BlueArchiveWorkUDUS'},
  children: [
    {
      path: 'work',
      name: 'BlueArchiveWorkUDUS',
      component: BaWorkUDUSComp
    },
    {
      path: 'student',
      name: 'BlueArchiveStudent',
      component: BaStudentComp,
      redirect: {name: 'BlueArchiveStudentUpload'},
      children: [
        {
          path: 'upload',
          name: 'BlueArchiveStudentUpload',
          component: BaStudentUploadComp
        },
        {
          path: 'update',
          name: 'BlueArchiveStudentUpdate',
        },
        {
          path: 'delete',
          name: 'BlueArchiveStudentDelete',
        }
      ]
    }
  ]
}
