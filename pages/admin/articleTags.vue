<style>

</style>
<template>
  <div class="app-content">
      <div class="app-content-body">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">标签管理</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <el-tag slot="reference"
              class="m-r-sm"
                v-for="tag in tags"
              :key="tag.name"
              :closable="true"
              :type="tag.type"
              >
              {{tag.name}}
          </el-tag>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tags: [
        { name: "标签一", type: "" },
        { name: "标签二", type: "gray" },
        { name: "标签三", type: "primary" },
        { name: "标签四", type: "success" },
        { name: "标签五", type: "warning" },
        { name: "标签六", type: "danger" }
      ]
    };
  },
  mounted() {},
  head() {
    let config = {
      title: "标签管理"
    };
    return config;
  }
};
</script>
