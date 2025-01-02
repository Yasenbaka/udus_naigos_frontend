<script setup lang="ts">
import NoteBgComp from "@/components/Note/NoteBgComp.vue";
import NoteHeaderComp from "@/components/Note/NoteHeaderComp.vue";
</script>

<template>
  <NoteBgComp/>
  <NoteHeaderComp/>
  <div class="note_container">

  </div>
</template>

<style scoped lang="css">
.note_container{
  width: 80%;
}
</style>
