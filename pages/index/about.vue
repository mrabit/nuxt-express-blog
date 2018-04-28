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
const MarkdownIt = require("markdown-it");
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
    },
    location_href() {
      return (
        (!process.server ? window.location.origin : "https://blog.mrabit.com") +
        "/about"
      );
    }
  },
  methods: {
    formatEditormd(val) {
      return this.md.render(val);
    }
  },
  head() {
    const title = "关于 - " + this.user.blog_name;
    let config = {
      title,
      meta: [{
        hid: "description",
        name: "description",
        content: this.user.about
          .substring(0, 150)
          .replace(/\r\n/g, "")
          .replace(/\n/g, "")
          .replace(/#+/g, ",") + "..."
      }]
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
    config["meta"] = config.meta.concat(og, twitter);
    return config;
  }
};

</script>
