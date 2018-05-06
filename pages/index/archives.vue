<template>
  <section class="row padder">
    <loading :show="loading"></loading>
    <article class="col-xs-12 padder-v">
      <p class="article-title h2">归档</p>
      <div class="entry-content m-t-md">
        <article class="list-group archives_list" v-for="(vo, key) in article_list" :key="key">
          <p class="h4 font-bold month_time">
            <time :datetime="vo.archives_time">{{ vo.archives_time }}</time>({{ vo.aaData.length }})</p>
          <ul class="padder-lg padder-v  m-l-md">
            <li v-for="(data, k) in vo.aaData" :key="k">
              <!-- <nuxt-link :to="{ name: 'index-details-id', params: { id: data.id }}" :title="data.title">{{ data.title }}</nuxt-link> -->
              <nuxt-link :to="'/details/' + data.id" :title="data.title">{{ data.title }}</nuxt-link>
              <span class="date m-l-sm hidden-xs">{{ data.create_time }}</span>
            </li>
          </ul>
        </article>
        <div class="text-left padder text-md" v-if="!article_list.length" style="min-height: 20vh">
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
      .get("/article/archives")
      .then(d => {
        return {
          article_list: d.data.result,
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
    },
    location_href() {
      return (
        (!process.server ? window.location.origin : "https://blog.mrabit.com") +
        "/archives"
      );
    }
  },
  head() {
    const title = "归档 - " + this.user.blog_name;
    let config = {
      title: title
    };
    const og = [{
        property: "og:title",
        content: title
      },
      {
        property: "og:description",
        content: title
      },
      {
        property: "og:url",
        content: this.location_href
      },
      {
        property: "og:site_name",
        content: this.user.blog_name
      }
    ];
    const twitter = [{
        property: "twitter:description",
        content: title
      },
      {
        property: "twitter:title",
        content: title
      }
    ];
    config["meta"] = Array.prototype.concat.call(og, twitter);
    return config;
  }
};

</script>
