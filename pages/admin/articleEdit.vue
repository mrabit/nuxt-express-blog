
<template>
    <section class="app-content">
        <div class="app-content-body">
              <div class="bg-light lter b-b wrapper-md">
                <h1 class="m-n font-thin h3">新增文章</h1>
              </div>
              <div class="wrapper clearfix m-b-md">
                <article-edit :article="article" :tags_map="tags_map"></article-edit>
              </div>
        </div>
    </section>
</template>
<script>
import axios from "~/plugins/axios";
import util from "util";
import articleEdit from "~/components/admin/article_edit.vue";
export default {
  middleware: "article_edit",
  asyncData({ query }) {
    // 获取数据库中标签数据
    return axios
      .get("/api/tags/get_all_tags")
      .then(d => {
        let aaData = d.data.result;
        let tags_map = {};
        aaData.forEach((v, k) => {
          tags_map[v.tags_name] = v.id;
        });
        return tags_map;
      })
      .then(tags_map => {
        return axios.get("/api/article/get_details/" + query.id).then(d => {
          var data = d.data;
          var result = data.result;
          result.private = "" + result.private;
          return {
            article: result,
            tags_map
          };
        });
      });
  },
  components: {
    articleEdit
  },
  data() {
    return {
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
  head() {
    let config = {
      title: "修改文章"
    };
    return config;
  }
};
</script>