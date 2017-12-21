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
              {{tag.tags_name}}
          </el-tag>
        </div>
      </div>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
export default {
  asyncData() {
    return axios.get("/api/tags/get_all_tags").then(d => {
      return {
        tags: d.data.result
      };
    });
  },
  mounted() {},
  head() {
    let config = {
      title: "标签管理 - " + this.$store.getters['admin/getUser'].blog_name
    };
    return config;
  }
};
</script>
