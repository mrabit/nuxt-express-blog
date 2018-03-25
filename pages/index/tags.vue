<style>
.tags_group .tags {
  border: 1px solid rgba(36, 121, 204, 0.8);
  color: rgba(36, 121, 204, 0.8);
  padding: 0 30px;
  line-height: 40px;
  font-weight: normal;
  position: relative;
}

.tags_group .tags:hover {
  /*font-weight:bold;*/
  border-color: #2479cc;
  color: #2479cc;
}

.tags_group .tags:hover i {
  display: block !important;
  position: absolute;
  right: 2px;
  top: 2px;
}

</style>
<template>
  <section class="row padder">
    <loading :show="loading"></loading>
    <article class="col-xs-12 padder-v">
      <p class="article-title h2">标签</p>
      <div class="entry-content m-t-md">
        <div class="tags_group">
          <nuxt-link v-for="(vo, key) in tags_arr" :key="key" class="label inline m-t-sm tags m-r-sm " :to="'/list/1?tags_id=' + vo.id">
            {{ vo.tags_name }}（{{ vo.counts }}）
          </nuxt-link>
        </div>
        <div class="text-left padder" v-if="!tags_arr.length" style="min-height: 20vh">
          暂无数据
        </div>
      </div>
    </article>
  </section>
</template>
<script>
import axios from "~/plugins/axios";
export default {
  asyncData({
    error
  }) {
    return axios
      .get("/article_tags")
      .then(d => {
        return {
          tags_arr: d.data.result
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
      loading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["index/getUser"];
    },
    location_href() {
      return (!process.server ? window.location.origin : "https://blog.mrabit.com") + "/tags";
    }
  },
  head() {
    const title = "标签 - " + this.user.blog_name;
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
