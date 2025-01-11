import BlogView from "@/views/BlogView.vue";
import BlogAllComp from "@/components/Blog/BlogAllComp.vue";
import BlogDetailComp from "@/components/Blog/BlogDetailComp.vue";

export default {
  path: '/blog',
  component: BlogView,
  children: [
    {
      path: '',
      name: 'Blog',
      component: BlogAllComp,
    },
    {
      path: 'detail',
      name: 'BlogDetail',
      component: BlogDetailComp
    }
  ]
}
