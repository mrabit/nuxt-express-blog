<style>
#view > article.col-xs-12:nth-child(1) {
  margin-top: 0 !important;
}
</style>
<template>
    <section class="row padder">
      <loading :show="loading"></loading>
      <article class="col-xs-12 padder-v m-b-n-md" v-show="!loading">
          <p class="article-title h2">Bing每日一图</p>
          <div class="entry-content m-t-md">
              <section class="bing_main">
                  <div class="bing_article" @click="open_url(format_img_url(item.img_url))" :data-description="item.img_time" v-for="(item, index) in img_lists" :key="index"
                      :data-title="item.img_title">
                      <img :src="format_img_url(item.img_url) + '-preview.50p'"
                          :title="item.img_title"
                          :alt="item.img_title">
                  </div>
              </section>
              <nav class="padder text-center paging m-t-md">
                  <a name="prev" :class="{ invisible: this.currentPage <= 1 }" 
                    :href="'/bing/' + (this.currentPage - 1)" class="pull-left">&nbsp;&lt;&lt;上一页</a>
                  <a name="next" :class="{ invisible: this.currentPage >= this.totalPage }" 
                    :href="'/bing/' + (this.currentPage + 1)" class="pull-right">下一页&nbsp;&gt;&gt;</a>
                  <span class="w-sm text-center">
                      <a href="/bing/today" target="_blank">今日美图</a>
                  </span>
              </nav>
          </div>
      </article>
  </section>
</template>
<script>
// /bing/get_img_lists/1/10
import axios from "~/plugins/axios";
import loading from "~/components/loading.vue";
export default {
  asyncData({ params, error }) {
    return axios
      .get("/bing/get_img_lists/" + (params.page || 1) + "/10")
      .then(d => {
        if (!d.data.result.img_list.length) {
          return error({ statusCode: 404, message: "对不起，没有找到这个页面" });
        }
        return {
          img_lists: d.data.result.img_list,
          totalPage: d.data.result.totalPage
        };
      })
      .catch(e => {
        error({ statusCode: 500, message: e.message });
      });
  },
  components: {
    loading
  },
  data() {
    return {
      pageSize: 10,
      loading: false
    };
  },
  computed: {
    currentPage() {
      return parseInt(this.$route.params.page || 1);
    },
    user() {
      return this.$store.getters["index/getUser"];
    }
  },
  methods: {
    open_url(url) {
      var a = document.createElement("a");
      a.href = url;
      a.setAttribute("target", "_blank");
      a.click();
    },
    format_img_url(url) {
      return url.replace("http:", "");
    }
  },
  mounted() {
    // setTimeout(_ => {
    //   this.loading = false;
    // }, 500);
  },
  head() {
    return {
      title: "bing每日一图 - " + this.user.blog_name
    };
  }
};
</script>