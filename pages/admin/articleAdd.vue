<template>
  <section class="app-content">
    <div class="app-content-body">
      <loading :show="loading"></loading>
      <div v-show="!loading">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">新增文章</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <article-edit :article="article" :tags_map="tags_map" :loading="loading"></article-edit>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "~/plugins/axios";
import articleEdit from "~/components/admin/article_edit.vue";
export default {
  components: {
    articleEdit
  },
  data() {
    return {
      loading: true,
      article: {
        title: "",
        reprint_url: "",
        private: "0",
        content: "",
        create_user_id: 1,
        tags: {}
      },
      tags_map: {}
    };
  },
  mounted() {
    // 获取数据库中标签数据
    return this.$http.get("/api/tags/get_all_tags").then(d => {
      let aaData = d.data.result;
      let tags_map = {};
      aaData.forEach((v, k) => {
        tags_map[v.tags_name] = v.id;
      });
      this.tags_map = tags_map;
      this.loading = false;
    });
  },
  head() {
    let config = {
      title: "新增文章 - " + this.$store.getters['admin/getUser'].blog_name
    };
    return config;
  }
};

</script>
