<style scoped>
.paging {
  border-bottom: 1px solid #ccc;
  padding-bottom: 15px;
}
</style>
<template>
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

                    <div id="editormd" v-if="!is_html">
                        <textarea name="editormd" style="display: none" v-html="article.content"></textarea>
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
            <nuxt-link name="prev" 
                :to="{ name: 'index-details-id', params: { id: adjoin[0]['id'] }}" class="pull-left" v-if="adjoin[0]">
                &lt;&lt;&nbsp;{{ adjoin[0]['title'] }}
            </nuxt-link>
            <nuxt-link name="next" 
                :to="{ name: 'index-details-id', params: { id: adjoin[1]['id'] }}" class="pull-right" v-if="adjoin[1]">
                {{ adjoin[1]['title'] }}&nbsp;&gt;&gt;
            </nuxt-link>
        </nav>
        <p class="h1 text-muted m-t-md">Comments</p>
        <!--PC版-->
        <!-- <div id="SOHUCS" sid="{$article['result']['id']}"></div> -->
    </article>
</template>
<script>
export default {
  data() {
    return {
      article: {
        id: 45,
        title: "小程序 - bing每日一图",
        reprint_url: "",
        is_html: 0,
        content:
          "1. 小程序刚出来的时候使用过,当时炒的很火的小程序,不去试试水怎么可以,不过当时不对个人开发者开放,后来小程序对个人开发者开放后修改了部分代码并发布\n\n2. 当时博客前端代码是用`jQuery`的js框架,`bootstrap`的css框架,`requireJS`的模块化引入工具写的,后台代码由`ThinkPHP3.2` + `Mysql`实现.\n\n3. 小程序需要网站`HTTPS`化,正好服务器是阿里云的就直接申请了证书实现了网站的`SSL`.\n\n4. 博客写了个定时任务爬去Bing每日图片并存放在七牛云储存,所以小程序可以直接读取数据库里的数据去七牛云储存取数据出来.\n\n5. 前段时间学习了`Vue.js`就把博客重构了一遍,使用Vue.js + `express` + mysql实现了效果并利用`JWT`进行权限认证,`redis`储存JWT生成的token值,`websocket`进行后台管理系统的踢人操作.\n\n6. HTML版bing每日一图:\n[https://blog.mrabit.com/bing.html](https://blog.mrabit.com/bing.html)\n\n7. 小程序二维码:\n![](/Uploads/Picture/2017-11-02/1509630999.jpg)",
        uname: "admin",
        create_time: "2017-11-02 21:56:55",
        release_time: "11月02,2017",
        modify_time: "2017-11-02 22:10:16"
      },
      adjoin: [
        { id: 44, title: "nginx配置websocket的wss   " },
        { id: 46, title: "websocket配合小程序实现扫码登录" }
      ]
    };
  },
  computed: {
    location_href() {
      return "/details/" + this.$route.params.id;
    },
    is_html() {
      return !!this.article.is_html;
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      editormd.markdownToHTML("editormd", {
        htmlDecode: "style,script,iframe", // you can filter tags decode
        emoji: true,
        taskList: true,
        tex: true, // 默认不解析
        flowChart: true, // 默认不解析
        sequenceDiagram: true // 默认不解析
      });
    });
  },
  head() {
    let config = {
      title: this.article.title,
      script: []
    };
    let script = [
      "/js/editormd/editormd.js",
      "/js/editormd/lib/marked.min.js",
      "/js/editormd/lib/prettify.min.js",
      "/js/editormd/lib/raphael.min.js",
      "/js/editormd/lib/underscore.min.js",
      "/js/editormd/lib/sequence-diagram.min.js",
      "/js/editormd/lib/flowchart.min.js",
      "/js/editormd/lib/jquery.flowchart.min.js"
    ];
    script.map(src => {
      config.script.push({
        type: "text/javascript",
        src: src
      });
    });
    return config;
  }
};
</script>