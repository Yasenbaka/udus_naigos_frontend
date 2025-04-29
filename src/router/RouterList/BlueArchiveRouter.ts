import BlueArchiveView from "@/views/BlueArchiveView.vue";
import BaWorkUDUSComp from "@/components/BlueArchive/BaWork/BaWorkUDUSComp.vue";
import BaStudentComp from "@/components/BlueArchive/BaStudent/BaStudentComp.vue";
import BaStudentUploadComp from "@/components/BlueArchive/BaStudent/BaStudentUploadComp.vue";
import BaSchoolComp from "@/components/BlueArchive/BaSchool/BaSchoolComp.vue";
import BaSchoolUpdateComp from "@/components/BlueArchive/BaSchool/BaSchoolUpdateComp.vue";
import BaSchoolUpdateFormComp from "@/components/BlueArchive/BaSchool/BaSchoolUpdateFormComp.vue";
import BaStudentUpdateComp from "@/components/BlueArchive/BaStudent/BaStudentUpdate/BaStudentUpdateComp.vue";
import BaStudentUpdateItemComp from "@/components/BlueArchive/BaStudent/BaStudentUpdate/BaStudentUpdateItemComp.vue";
import BaClubComp from "@/components/BlueArchive/BaClub/BaClubComp.vue";
import BaClubUploadComp from "@/components/BlueArchive/BaClub/BaClubUploadComp.vue";
import BaClubUpdateComp from "@/components/BlueArchive/BaClub/BaClubUpdateComp.vue";

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
      path: 'club',
      name: 'BlueArchiveClub',
      component: BaClubComp,
      redirect: {name: 'BlueArchiveClubUpload'},
      children: [
        {
          path: 'upload',
          name: 'BlueArchiveClubUpload',
          component: BaClubUploadComp
        },
        {
          path: 'update',
          name: 'BlueArchiveClubUpdate',
          component: BaClubUpdateComp,
        }
      ]
    },
    {
      path: 'school',
      name: 'BlueArchiveSchool',
      component: BaSchoolComp,
      redirect: {name: 'BlueArchiveSchoolUpload'},
      children: [
        {
          path: 'upload',
          name: 'BlueArchiveSchoolUpload',
        },
        {
          path: 'update',
          name: 'BlueArchiveSchoolUpdate',
          component: BaSchoolUpdateComp,
          children: [
            {
              path: ':school_id',
              name: 'BlueArchiveSchoolUpdateForm',
              component: BaSchoolUpdateFormComp
            }
          ]
        }
      ]
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
          children: [
            {
              path: '',
              name: 'BlueArchiveStudentUpdate',
              component: BaStudentUpdateComp
            },
            {
              path: ':student_id',
              props: true,
              name: 'BlueArchiveStudentUpdateItem',
              component: BaStudentUpdateItemComp
            }
          ]
        },
        {
          path: 'delete',
          name: 'BlueArchiveStudentDelete',
        }
      ]
    }
  ]
}
