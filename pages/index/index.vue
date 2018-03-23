<template>
  <article-list :articles="articles"></article-list>
</template>
<script>
import axios from "~/plugins/axios";
import articleList from "~/components/index/article_list.vue";
export default {
  asyncData({
    error
  }) {
    return axios
      .get("/article/get_lists/1/5")
      .then(d => {
        return {
          articles: d.data
        };
      })
      .catch(e => {
        error({
          statusCode: 500,
          message: e.message
        });
      });
  },
  components: {
    articleList
  },
  computed: {
    currentPage() {
      return parseInt(this.$route.params.page || 1);
    },
    user() {
      return this.$store.getters["index/getUser"];
    }
  }
  // watch: {
  //   $route: "get_lists"
  // },
  // methods: {
  //   get_lists() {
  //     var currentPage = this.currentPage;
  //     this.get("/article/get_lists/" + currentPage + "/5").then(d => {
  //       this.articles = d.data;
  //     });
  //   }
  // }
};

</script>
