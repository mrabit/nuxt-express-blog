<template>
    <section class="row padder">
        <loading :show="loading"></loading>
        <article class="col-xs-12 padder-v">
            <p class="article-title h2">关于</p>
            <div class="entry-content m-t-md">
                <div id="editormd">
                    <textarea name="editormd" style="display: none" v-html="user.about"></textarea>
                </div>
            </div>
        </article>
    </section>
</template>
<script>
import loading from "~/components/loading.vue";
export default {
  components: {
    loading
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["index/getUser"];
    }
  },
  mounted() {
    editormd.markdownToHTML("editormd", {
      htmlDecode: "style,script,iframe", // you can filter tags decode
      emoji: true,
      taskList: true,
      tex: true, // 默认不解析
      flowChart: true, // 默认不解析
      sequenceDiagram: true // 默认不解析
    });
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