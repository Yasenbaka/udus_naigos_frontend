import BlogView from "@/views/BlogView.vue";
import BlogAllComp from "@/components/Blog/BlogAllComp.vue";
import BlogDetailComp from "@/components/Blog/BlogDetailComp.vue";
import BlogEditComp from "@/components/Blog/BlogEditComp.vue";

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
    },
    {
      path: 'edit',
      name: 'BlogEdit',
      component: BlogEditComp
    }
  ]
}
