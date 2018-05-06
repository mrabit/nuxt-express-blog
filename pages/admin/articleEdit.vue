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
import articleEdit from "~/components/admin/article_edit.vue";
export default {
  middleware: "article_edit",
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
    this.$http.get("/api/tags/get_all_tags")
      .then(d => {
        let aaData = d.data.result;
        let tags_map = {};
        aaData.forEach((v, k) => {
          tags_map[v.tags_name] = v.id;
        });
        return tags_map;
      })
      .then(tags_map => {
        this.$http.get("/api/article/get_details/" + this.$route.query.id).then(d => {
          const data = d.data;
          const result = data.result;
          result.private = "" + result.private;
          this.article = result;
          this.tags_map = tags_map;
          this.loading = false;
        });
      });
  },
  head() {
    let config = {
      title: "修改文章 - " + this.$store.getters['admin/getUser'].blog_name
    };
    return config;
  }
};

</script>
