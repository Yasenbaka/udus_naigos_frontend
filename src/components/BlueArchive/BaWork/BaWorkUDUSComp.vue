<script setup lang="ts">

</script>

<template>
  <el-container>
    <el-aside style="width: 200px">
      <el-row class="tac">
        <el-col :span="24">
          <el-menu
            background-color="#1289f880"
            active-text-color="#ffd04b"
            text-color="#fff"
          >
            <el-menu-item index="upload">上传</el-menu-item>
            <el-menu-item index="update">修改</el-menu-item>
            <el-menu-item index="delete">删除</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
  </el-container>
</template>

<style scoped lang="css">

</style>
