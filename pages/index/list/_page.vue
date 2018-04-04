<template>
  <article-list :articles="articles" :loading="loading"></article-list>
</template>
<script>
import axios from "~/plugins/axios";
import articleList from "~/components/index/article_list.vue";
export default {
  asyncData({
    params,
    query,
    error
  }) {
    return axios
      .get(
        "/article/get_lists/" +
        params.page +
        "/5" +
        (query.tags_id ? "?tags_id=" + query.tags_id : "")
      )
      .then(d => {
        if (!d.data.result.article_lists.length) {
          return error({
            statusCode: 404,
            message: "对不起，没有找到这个页面"
          });
        }
        return {
          articles: d.data,
          loading: false
        };
      })
      .catch(e => {
        error({
          statusCode: 500,
          message: e.message
        });
      });
  },
  data() {
    return {
      loading: true
    };
  },
  components: {
    articleList
  }
};

</script>
