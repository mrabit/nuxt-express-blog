<style scoped>
#view>article.col-xs-12:nth-child(1) {
  margin-top: 0 !important;
}

.no-gutter.verticalCenter {
  min-height: inherit;
}

</style>
<template>
  <section class="row padder m-b-n-sm">
    <div id="view" class="clearfix">
      <loading :show="loading"></loading>
      <p v-if="tags_id" class="article-title h2 padder-v padder">标签 - {{tags_name}} <small>共找到结果 {{count}} 条</small></p>
      <article class="col-xs-12 m-t-md" v-for="(vo, key) in article_lists" :key="key">
        <div class="row verticalCenter no-gutter">
          <div class="col-xs-12 col-sm-8 text-left">
            <p class="article-title h2">
              <nuxt-link :to="'/details/' + vo.id" :title="vo.title">{{ vo.title }}</nuxt-link>
            </p>
          </div>
          <div class="col-sm-4 hidden-xs text-right">
            <div class="meta l-h-2x">
              <span class="author"> {{ vo.uname }} </span>
              <span>发布于</span>
              <time :datetime="vo.create_time">{{ vo.release_time }}</time>
            </div>
            <div class="meta">
              <small class="text-muted">
                  <span :id="'sourceId::' + vo.id" class="cy_cmt_count">{{ vo.visit_number }}</span> 浏览
              </small>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 section-content">
            <div class="entry-content m-t-md block show-section-block markdown-body">
              <blockquote class="hidden-xs reprint_url" v-if="vo.reprint_url">
                <p>原文：
                  <!-- 外链需要使用a标签 -->
                  <a :href="vo.reprint_url" target="_blank">{{ vo.reprint_url }}</a>
                </p>
              </blockquote>
              <div class="editormd_container" v-if="!vo.is_html" :id="vo.id" v-html="formatEditormd(vo.content)" v-highlight>
              </div>
              <div v-else v-html="unescape(vo.content)">
              </div>
            </div>
            <div class="show_all"></div>
            <p class="more m-b-none m-t-md">
              <nuxt-link :to="'/details/' + vo.id">阅读全文</nuxt-link>
            </p>
          </div>
        </div>
        <div class="line line-dashed article-b-b line-lg "></div>
      </article>
      <div class="text-left padder text-md" v-if="!article_lists.length" style="min-height: 15vh">
        暂无数据
      </div>
    </div>
    <nav class="padder text-center" style="margin-bottom: 8px" v-if="article_lists.length">
      <nuxt-link name="prev" v-if="this.currentPage > 1" :to="prev" class="pull-left">&lt;&lt;&nbsp;上一页</nuxt-link>
      <nuxt-link name="next" v-if="this.currentPage < this.totalPage" :to="next" class="pull-right">下一页&nbsp;&gt;&gt;</nuxt-link>
      <span class="w-sm text-center">
          <nuxt-link to="/archives">博客归档</nuxt-link>
      </span>
    </nav>
  </section>
</template>
<script>
var MarkdownIt = require("markdown-it");
export default {
  props: {
    articles: Object,
    loading: Boolean
  },
  data() {
    return {
      md: new MarkdownIt()
    };
  },
  computed: {
    //   总页数
    totalPage() {
      return this.articles.result.totalPage;
    },
    // 文章集合
    article_lists() {
      return this.articles.result.article_lists;
    },
    // 标签
    tags_id() {
      return this.$route.query.tags_id;
    },
    // 上一页
    prev() {
      // let config = {
      //   name: "index-list-page",
      //   params: { page: this.currentPage - 1 }
      // };
      // if (this.tags_id) {
      //   config["query"] = {
      //     tags_id: this.tags_id
      //   };
      // }
      let config = "/list/" + (this.currentPage - 1);
      if (this.tags_id) {
        config += "?tags_id=" + this.tags_id;
      }
      return config;
    },
    // 下一页
    next() {
      // let config = {
      //   name: "index-list-page",
      //   params: { page: this.currentPage + 1 }
      // };
      // if (this.tags_id) {
      //   config["query"] = {
      //     tags_id: this.tags_id
      //   };
      // }
      let config = "/list/" + (this.currentPage + 1);
      if (this.tags_id) {
        config += "?tags_id=" + this.tags_id;
      }
      return config;
    },
    // 当前页
    currentPage() {
      return parseInt(this.$route.params.page) || 1;
    },
    tags_name() {
      return this.articles.result.tags_name;
    },
    count() {
      return this.articles.result.count;
    },
    user() {
      return this.$store.getters["index/getUser"];
    }
  },
  methods: {
    unescape: function(html) {
      return html
        .replace(html ? /&(?!#?\w+;)/g : /&/g, "&amp;")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
    },
    formatEditormd(val) {
      return this.md.render(val);
    }

    // formatEditormd() {
    //   this.$nextTick(() => {
    //     var editormd_arr = document.getElementsByClassName(
    //       "editormd_container"
    //     );

    //     for (var i = 0; i < editormd_arr.length; i++) {
    //       var temp = editormd_arr[i];
    //       editormd.markdownToHTML(temp["id"], {
    //         htmlDecode: "style,script,iframe", // you can filter tags decode
    //         emoji: true,
    //         taskList: true,
    //         tex: true, // 默认不解析
    //         flowChart: true, // 默认不解析
    //         sequenceDiagram: true // 默认不解析
    //       });
    //     }
    //     this.loading = false;
    //   });
    // }
  },
  // watch: {
  //   articles(val, oldVal) {
  //     this.loading = true;
  //     setTimeout(_ => {
  //       this.loading = false;
  //       this.formatEditormd();
  //     }, 500);
  //   }
  // },
  mounted() {
    // this.formatEditormd();
    // setTimeout(_ => {
    //   this.loading = false;
    // }, 500);
  },
  head() {
    let config = {
      title:
        (this.$route.path === "/" ?
          "首页" :
          this.tags_id ? "标签 - " + this.tags_name : "列表页") +
        " - " +
        this.user.blog_name,
      meta: [{
        hid: "description",
        name: "description",
        content: this.article_lists
          .map(v => {
            return v.title;
          })
          .join(",")
      }]
    };
    return config;
  }
};

</script>
