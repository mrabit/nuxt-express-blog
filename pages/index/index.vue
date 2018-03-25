<template>
  <article-list :articles="articles" :loading="loading"></article-list>
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
  components: {
    articleList
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    currentPage() {
      return parseInt(this.$route.params.page || 1);
    },
    user() {
      return this.$store.getters["index/getUser"];
    },
    location_href() {
      return (!process.server ? window.location.origin : "https://blog.mrabit.com");
    }
  },
  head() {
    const title = this.user.blog_name;
    let config = {
      title: title
    };
    const og = [{
      property: 'og:title',
      content: title
    }, {
      property: 'og:description',
      content: title
    }, {
      property: 'og:url',
      content: this.location_href,
    }, {
      property: 'og:site_name',
      content: this.user.blog_name
    }]
    const twitter = [{
        property: 'twitter:description',
        content: title
      },
      {
        property: 'twitter:title',
        content: title
      }
    ]
    config['meta'] = Array.prototype.concat.call(og, twitter);
    return config;
  }
};

</script>
