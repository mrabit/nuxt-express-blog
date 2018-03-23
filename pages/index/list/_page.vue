<template>
  <article-list :articles="articles"></article-list>
</template>
<script>
import axios from "~/plugins/axios";
import articleList from "~/components/index/article_list.vue";
export default {
  asyncData({
    params,
    error
  }) {
    return axios
      .get("/article/get_lists/" + params.page + "/5")
      .then(d => {
        if (!d.data.result.article_lists.length) {
          return error({
            statusCode: 404,
            message: "对不起，没有找到这个页面"
          });
        }
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
  }
};

</script>
