<template>
    <section class="row padder">
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
export default {
  data() {
    return {
      user: {
        about:
          "### 一桶浆糊的博客\n###### 击败恶龙的勇士,也渐渐长出了龙鳞\n### About Me\n###### 一桶浆糊，目前任职于勤智数码科技股份有限公司，码农一枚，正在向前端开发工程师的目标奋斗\n###### 专注于WEB前端开发,以前偶尔看看PHP,现在对NodeJS感兴趣，毕竟JavaScript是世界上最好的语言"
      }
    };
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
  },
  head() {
    let config = {
      title: "关于",
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