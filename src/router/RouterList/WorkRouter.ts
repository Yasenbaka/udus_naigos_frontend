import WorkView from "@/views/WorkView.vue";
import WorkAllComp from "@/components/Work/All/WorkAllComp.vue";
import WorkDetailComp from "@/components/Work/WorkDetailComp.vue";

export default {
  path: '/work',
  component: WorkView,
  children: [
    {
      path: '',
      name: 'Work',
      component: WorkAllComp
    },
    {
      path: 'detail',
      name: 'WorkDetail',
      component: WorkDetailComp
    }
  ]
}
