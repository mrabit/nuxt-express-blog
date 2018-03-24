<template>
  <section class="row padder">
    <loading :show="loading"></loading>
    <article class="col-xs-12 padder-v" v-if="!loading">
      <p class="article-title h2">友链</p>
      <div class="entry-content m-t-md">
        <ul class="padder-lg padder-v  m-l-md">
          <li v-for="(item, index) in links_list" :key="index">
            <a target="_blank" :href="item.site_url" :title="item.site_name">{{item.site_name}}</a>
          </li>
        </ul>
        <div class="text-left padder" v-if="!links_list.length" style="min-height: 20vh">
          暂无数据
        </div>
      </div>
    </article>
  </section>
</template>
<script>
import axios from '~/plugins/axios';
export default {
  asyncData({
    error
  }) {
    return axios
      .get("/links/getLinksList")
      .then(d => {
        return {
          links_list: d.data.result,
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
  computed: {
    user() {
      return this.$store.getters["index/getUser"];
    }
  },
  data() {
    return {
      links_list: [],
      loading: true
    };
  },
  head() {
    return {
      title: "友链 - " + this.user.blog_name
    };
  }
};

</script>
