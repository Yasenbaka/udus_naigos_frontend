import { createRouter, createWebHistory } from 'vue-router';
import ReplaceRouter from "@/router/RouterList/ReplaceRouter.ts";
import HomeRouter from "@/router/RouterList/HomeRouter.ts";
import UploadWorksRouter from "@/router/RouterList/UploadWorksRouter.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    HomeRouter,
    ReplaceRouter,
    UploadWorksRouter,
  ],
})

export default router
