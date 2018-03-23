<style>


</style>
<template>
  <div class="app-content">
    <div class="app-content-body">
      <loading :show="loading"></loading>
      <div v-show="!loading">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">标签管理</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <el-tag slot="reference" class="m-r-sm" v-for="tag in tags" :key="tag.name" :closable="true" :type="tag.type">
            {{tag.tags_name}}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tags: [],
      loading: true
    }
  },
  mounted() {
    this.$http.get("/api/tags/get_all_tags").then(d => {
      this.tags = d.data.result;
      this.loading = false;
    });
  },
  head() {
    let config = {
      title: "标签管理 - " + this.$store.getters['admin/getUser'].blog_name
    };
    return config;
  }
};

</script>
