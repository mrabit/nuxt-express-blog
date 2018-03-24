<style scoped>
.paging {
  border-bottom: 1px solid #ccc;
  padding-bottom: 15px;
}

</style>
<template>
  <section class="row padder">
    <loading :show="loading"></loading>
    <article class="col-xs-12">
      <div class="row verticalCenter no-gutter">
        <div class="col-xs-12 col-sm-8 text-left">
          <p class="article-title h2">{{ article.title }}</p>
        </div>
        <div class="col-sm-4 hidden-xs text-right">
          <div class="meta l-h-2x">
            <span class="author"> {{ article.uname }} </span>
            <span>发布于</span>
            <time :datetime="article.create_time">{{ article.release_time }}</time>
          </div>
          <!-- <div class="meta">
                        <small class="text-muted">
                            <span id="changyan_count_unit"></span> Comments</small>
                        <script type="text/javascript" src="https://assets.changyan.sohu.com/upload/plugins/plugins.count.js"></script>
                    </div> -->
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 section-content">
          <div class="entry-content m-t-md block" id="entry-content">
            <blockquote class="hidden-xs" v-if="article.reprint_url">
              <p>原文：
                <a :href="article.reprint_url" target="_blank">{{ article.reprint_url }}</a>
              </p>
            </blockquote>
            <!--遗留问题  数据库存在以前编辑器的文章 需判断-->
            <div id="editormd" v-if="!is_html" v-html="formatEditormd(article.content)" v-highlight>
            </div>
            <div v-else v-html="unescape(article.content)">
            </div>
          </div>
        </div>
      </div>
      <div class="line line-dashed article-b-b line-lg "></div>
      <div class="details_info">
        <nuxt-link :to="location_href">
          <p class="text-ellipsis" style="display: block;white-space: inherit;">
            <span style="color:#666;">本文链接：{{ location_href }}</span>
          </p>
        </nuxt-link>
        <p>--
          <acronym title="End of File">EOF</acronym> --</p>
      </div>
      <div class="post-info">
        <p style="margin-bottom: 15px">
          作者
          <a href="/author/admin" data-user="">
            <code class="notebook">{{ article.uname }}</code>
        </a> 发表于
          <i>{{ article.create_time }}</i>
          <span v-if="article.modify_time">
        ，最后修改于
            <i>{{ article.modify_time }}</i>
        </span>
        </p>
      </div>
      <nav class="text-center clearfix paging" v-if="adjoin">
        <nuxt-link name="prev" :to="'/details/' + adjoin[0]['id']" class="pull-left" v-if="adjoin[0]">
          &lt;&lt;&nbsp;{{ adjoin[0]['title'] }}
        </nuxt-link>
        <nuxt-link name="next" :to="'/details/' + adjoin[1]['id']" class="pull-right" v-if="adjoin[1]">
          {{ adjoin[1]['title'] }}&nbsp;&gt;&gt;
        </nuxt-link>
      </nav>
      <p class="h1 text-muted m-t-md">Comments</p>
      <!--PC版-->
      <!-- <div id="SOHUCS" sid="{$article['result']['id']}"></div> -->
    </article>
  </section>
</template>
<script>
import axios from "~/plugins/axios";
var MarkdownIt = require('markdown-it');

export default {
  asyncData({
    params,
    error
  }) {
    return axios
      .get("/article/get_details/" + params.id)
      .then(d => {
        if (!d.data.result.article.length) {
          return error({
            statusCode: 404,
            message: "对不起，没有找到这个页面"
          });
        }
        let adjoin = [];
        adjoin.push(d.data.result.adjoin[0] || null);
        adjoin.push(d.data.result.adjoin[1] || null);
        return {
          article: d.data.result.article[0],
          adjoin: adjoin,
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
      md: new MarkdownIt(),
      loading: true
    }
  },
  computed: {
    location_href() {
      return (!process.server ? window.location.origin : "https://blog.mrabit.com") + "/details/" + this.$route.params.id
    },
    is_html() {
      return !!this.article.is_html;
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
  },
  head() {
    let config = {
      title: this.article.title + " - " + this.user.blog_name,
      meta: [{
        hid: 'Keywords',
        name: 'Keywords',
        content: this.article.title + "," + this.user.blog_name
      }],
      link: [{
        rel: 'canonical',
        href: this.location_href
      }],
      script: [{
        type: 'application/ld+json',
        innerHTML: `        {
            "@context": "https://ziyuan.baidu.com/contexts/cambrian.jsonld",
            "@id": "${this.location_href}",
            "appid": "1595463988626710",
            "title": "${this.article.title + " - " + this.user.blog_name}",
            "pubDate": "${this.article.create_time}",
            "upDate": "${this.article.modify_time || this.article.create_time}"
        }`
      }],
      __dangerouslyDisableSanitizers: ['script']
    };
    return config;
  }
};

</script>
