<script setup lang="ts">

import WorkBgComp from "@/components/Work/WorkBgComp.vue";
import WorkHeaderComp from "@/components/Work/WorkHeaderComp.vue";
import WorkFuncComp from "@/components/Work/WorkFuncComp.vue";
</script>

<template>
  <WorkBgComp/>
  <WorkHeaderComp/>
  <div class="work_container">
    <WorkFuncComp/>
    <RouterView/>
  </div>
</template>

<style scoped lang="css">
@keyframes work_container_in {
  0%{
    opacity: 0;
    transform: translateY(20px);
  }
  100%{
    opacity: 1;
    transform: translateY(0);
  }
}
.work_container{
  animation: work_container_in 1s .5s forwards ease;
  opacity: 0;
  transform: translateY(20px);
  margin: 0 auto;
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
