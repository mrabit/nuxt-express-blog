<template>
  <section class="row padder">
    <loading :show="loading"></loading>
    <article class="col-xs-12 padder-v">
      <p class="article-title h2">关于</p>
      <div class="entry-content m-t-md">
        <div id="editormd" v-html="formatEditormd(user.about)" v-highlight>
        </div>
      </div>
    </article>
  </section>
</template>
<script>
var MarkdownIt = require('markdown-it');
export default {
  data() {
    return {
      loading: false,
      md: new MarkdownIt()
    };
  },
  computed: {
    user() {
      return this.$store.getters["index/getUser"];
    }
  },
  methods: {
    formatEditormd(val) {
      return this.md.render(val);
    }
  },
  mounted() {
    // editormd.markdownToHTML("editormd", { // htmlDecode: "style,script,iframe", // you can filter tags decode // emoji: true, // taskList: true, // tex: true, // 默认不解析 // flowChart: true, // 默认不解析 // sequenceDiagram: true // 默认不解析 // });

    // setTimeout(_ => {
    //   this.loading = false;
    // }, 500);
  },
  head() {
    let config = {
      title: "关于 - " + this.user.blog_name
    };
    return config;
  }
};

</script>
