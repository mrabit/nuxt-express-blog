<style scoped>
.paging {
  border-bottom: 1px solid #ccc;
  padding-bottom: 15px;
}

.location_href {
  display: block;
  white-space: inherit;
}

</style>
<template>
  <section class="row padder">
    <mip-cambrian site-id="1595463988626710"></mip-cambrian>
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
          <div class="meta">
            <small class="text-muted">
              <span id="changyan_count_unit">{{ article.visit_number }}</span> 浏览
            </small>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 section-content">
          <div class="entry-content m-t-md block markdown-body" id="entry-content">
            <blockquote class="hidden-xs reprint_url" v-if="article.reprint_url">
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
      <div class="line line-dashed article-b-b line-lg"></div>
      <div class="details_info">
        <p class="text-ellipsis location_href">
          <nuxt-link :to="'/details/' + $route.params.id">
            <span style="color:#666;">
               本文链接：{{ location_href }}
            </span>
          </nuxt-link>
        </p>
        <div class="share-component m-b">
          <span>分享到：</span>
          <a class="share-icon fa fa-weibo" target="_blank" :href="share.weibo"></a>
          <a href="javascript:;" class="share-icon fa fa-wechat" target="_blank">
            <div class="wechat-qrcode">
              <h4>微信扫一扫：分享</h4>
              <div class="qrcode">
                <canvas id="share-qrcode" width="100" height="100"></canvas>
              </div>
              <div class="help">
                <p>微信里点“发现”，扫一下</p>
                <p>二维码便可将本文分享至朋友圈。</p>
              </div>
            </div>
          </a>
          <a class="share-icon fa fa-qq" target="_blank" :href="share.qq"></a>
          <a class="share-icon fa fa-twitter" target="_blank" :href="share.twitter"></a>
          <a class="share-icon fa fa-google-plus" target="_blank" :href="share.google"></a>
        </div>
        <p>--
          <acronym title="End of File">EOF</acronym> --</p>
      </div>
      <div class="post-info">
        <p style="margin-bottom: 15px">
          作者
          <a href="/about" :data-user="article.uname">
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
        <nuxt-link name="next" :to="'/details/' + adjoin[1]['id']" class="pull-left" v-if="adjoin[1]">
          &lt;&lt;&nbsp;{{ adjoin[1]['title'] }}
        </nuxt-link>
        <nuxt-link name="prev" :to="'/details/' + adjoin[0]['id']" class="pull-right" v-if="adjoin[0]">
          {{ adjoin[0]['title'] }}&nbsp;&gt;&gt;
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
import moment from "moment";
const QRCode = require("qrcode");
const MarkdownIt = require("markdown-it");

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
        if (d.data.result.adjoin) {
          adjoin.push(d.data.result.adjoin[0] || null);
          adjoin.push(d.data.result.adjoin[1] || null);
        }
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
      loading: true,
      share: {
        weibo: "",
        qq: "",
        twitter: "",
        google: ""
      }
    };
  },
  computed: {
    location_href() {
      return (
        (!process.server ? window.location.origin : "https://blog.mrabit.com") +
        "/details/" +
        this.$route.params.id
      );
    },
    is_html() {
      return !!this.article.is_html;
    },
    user() {
      return this.$store.getters["index/getUser"];
    },
    title() {
      return this.article.title + " - " + this.user.blog_name;
    },
    description() {
      return this.article.content
        .substring(0, 150)
        .replace(/\r\n/g, "")
        .replace(/\n/g, "")
        .replace(/#+/g, ",") + "...";
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
    },
    formatDate(date) {
      return moment(date).format("YYYY-MM-DDTHH:mm:ss");
    }
  },
  mounted() {
    QRCode.toCanvas(document.getElementById('share-qrcode'), this.location_href, {
      width: 100,
      height: 100
    })
    this.share = {
      weibo: `http://service.weibo.com/share/share.php?url=${this.location_href}&title=${this.title}&pic=`,
      qq: `http://connect.qq.com/widget/shareqq/index.html?url=${this.location_href}&title=${this.title}&source=mrabit&desc=${this.description}`,
      twitter: `https://twitter.com/intent/tweet?text=${this.title}&url=${this.location_href}&via=biabia123456`,
      google: `https://plus.google.com/share?url=${this.location_href}`
    }
  },
  head() {
    let config = {
      title: this.title,
      meta: [{
        hid: "description",
        name: "description",
        content: this.description
      }],
      link: [{
          rel: "canonical",
          href: this.location_href
        }
        // {
        //   rel: 'stylesheet',
        //   href: 'https://c.mipcdn.com/static/v1/mip.css'
        // }
      ],
      script: [{
          type: "application/ld+json",
          innerHTML: `        {
            "@context": "https://ziyuan.baidu.com/contexts/cambrian.jsonld",
            "@id": "${this.location_href}",
            "appid": "1595463988626710",
            "title": "${this.title}",
            "pubDate": "${this.formatDate(this.article.create_time)}",
            "upDate": "${this.formatDate(this.article.modify_time || this.article.create_time)}"
        }`
        },
        {
          src: "https://c.mipcdn.com/static/v1/mip.js"
        },
        {
          src: "https://c.mipcdn.com/extensions/platform/v1/mip-cambrian/mip-cambrian.js"
        }
      ],
      __dangerouslyDisableSanitizers: ["script"]
    };
    const og = [{
        property: "og:type",
        content: "article"
      },
      {
        property: "og:title",
        content: this.title
      },
      {
        property: "og:description",
        content: this.description
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
        content: this.description
      },
      {
        property: "twitter:title",
        content: this.title
      }
    ];
    config.meta = config.meta.concat(og, twitter);
    return config;
  }
};

</script>
