<template>
  <section class="row padder">
    <loading :show="loading"></loading>
    <article class="col-xs-12 padder-v m-b-n-md">
      <p class="article-title h2">观影记录</p>
      <div class="entry-content m-t-md">
        <section class="row movie_content">
          <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 m-b" v-for="(item,index) in movies_lists" :key="index">
            <div class="tl-content panel no-padder b-a">
              <a :href="item.movie_url" target="_blank" class="text-center clearfix img-full">
                <img class="movie_img" :src="item.movie_img" :alt="'电影：《' + item.movie_name + '》封面'">
              </a>
              <div class="hbox text-center b-t b-light movie_details">
                <span class="col padder-v text-muted b-r b-light">
                  {{item.watch_time}}
                </span>
                <a :title="item.movie_name" target="_blank" :href="item.movie_url" class="col padder-v text-muted">
                  查看详情
                </a>
              </div>
            </div>
          </div>
        </section>
        <nav class="padder text-center paging" v-if="movies_lists.length">
          <nuxt-link name="prev" v-if="this.currentPage > 1" :to="prev" class="pull-left">&lt;&lt;&nbsp;上一页</nuxt-link>
          <nuxt-link name="next" v-if="this.currentPage < this.totalPage" :to="next" class="pull-right">下一页&nbsp;&gt;&gt;</nuxt-link>
        </nav>
        <div class="text-left padder text-md" v-if="!movies_lists.length" style="min-height: 15vh">
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
    params,
    query,
    error
  }) {
    return axios
      .get(
        "/movies/get_lists/" +
        params.page +
        "/8"
      )
      .then(d => {
        // if (!d.data.result.movies_lists.length) {
        //   return error({
        //     statusCode: 404,
        //     message: "对不起，没有找到这个页面"
        //   });
        // }
        return {
          movies_lists: d.data.result.movies_lists,
          totalPage: d.data.result.totalPage,
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
    // 上一页
    prev() {
      let config = "/movies/" + (this.currentPage - 1);
      return config;
    },
    // 下一页
    next() {
      let config = "/movies/" + (this.currentPage + 1);
      return config;
    },
    // 当前页
    currentPage() {
      return parseInt(this.$route.params.page) || 1;
    },
    user() {
      return this.$store.getters["index/getUser"];
    },
    location_href() {
      return (
        (!process.server ? window.location.origin : "https://blog.mrabit.com") +
        "/movies"
      );
    }
  },
  methods: {

  },
  head() {
    const title = "观影记录 - " + this.user.blog_name;
    let config = {
      title
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
<style>
.movie_content {
  /* display: -webkit-box; */
  /* display: -webkit-flex; */
  /* display: -ms-flexbox; */
  /* display: flex; */
  /* flex-wrap: wrap; */
}

.movie_content>[class*='col-'] {
  /* display: flex; */
  /* flex-direction: column; */
  /* height: 250px; */
}

.movie_img {
  min-height: 360px;
  height: 360px;
  -o-object-fit: cover;
  object-fit: cover;
}

.movie_details {
  /* position: absolute;
  bottom: -59px;
  height: auto;
  background: #fff; */
}

</style>
