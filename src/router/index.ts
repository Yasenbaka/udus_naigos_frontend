import { createRouter, createWebHistory } from 'vue-router';
import ReplaceRouter from "@/router/RouterList/ReplaceRouter.ts";
import HomeRouter from "@/router/RouterList/HomeRouter.ts";
import UploadWorksRouter from "@/router/RouterList/UploadWorksRouter.ts";
import AboutView from "@/views/AboutView.vue";
import UploadBlogRouter from "@/router/RouterList/UploadBlogRouter.ts";
import NoteRouter from "@/router/RouterList/NoteRouter.ts";
import BlogRouter from "@/router/RouterList/BlogRouter.ts";
import WorkRouter from "@/router/RouterList/WorkRouter.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/about', name: 'About', component: AboutView},
    HomeRouter,
    ReplaceRouter,
    NoteRouter,
    BlogRouter,
    WorkRouter,
    UploadWorksRouter,
    UploadBlogRouter
  ],
})

export default router
