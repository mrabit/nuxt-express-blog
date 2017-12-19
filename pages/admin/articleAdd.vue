
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
import util from "util";
import articleEdit from "~/components/admin/article_edit.vue";
export default {
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
  methods: {
    // 获取数据库中标签数据
    get_all_tags() {
      return new Promise(resolve => {
        let aaData = [
          { id: 16, tags_name: "JavaScript" },
          { id: 17, tags_name: "转载" },
          { id: 20, tags_name: "Linux" },
          { id: 21, tags_name: "mysql" },
          { id: 22, tags_name: "PHP" },
          { id: 23, tags_name: "webpack" },
          { id: 24, tags_name: "Raspberry" },
          { id: 25, tags_name: "NodeJS" },
          { id: 26, tags_name: "随笔" },
          { id: 27, tags_name: "微信小程序" },
          { id: 28, tags_name: "github" }
        ];
        aaData.forEach((v, k) => {
          this.tags_map[v.tags_name] = v.id;
        });
        resolve();
      });
      // return this.$http.get("/api/tags/get_all_tags").then(d => {
      //   var data = d.data;
      //   if (data.success) {
      //     var aaData = data.result;
      //     aaData.forEach((v, k) => {
      //       this.tags_map[v.tags_name] = v.id;
      //     });
      //     this.loading = false;
      //   }
      // });
    }
  },
  mounted() {
    this.get_all_tags();
  },
  head() {
    let config = {
      title: "新增文章"
    };
    return config;
  }
};
</script>