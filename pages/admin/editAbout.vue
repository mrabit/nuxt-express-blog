<style>
.w-full-important {
  width: 100% !important;
}
</style>

<template>
  <div class="app-content">
        <div class="app-content-body">
          <div class="bg-light lter b-b wrapper-md">
              <h1 class="m-n font-thin h3">关于</h1>
          </div>
          <div class="wrapper clearfix m-b-md">
              <el-row>
                  <el-col :span="22" :offset="2">
                      <el-form label-position="right" label-width="120px" ref="aboutForm" :model="profile">
                          <el-form-item label="关于：">
                              <div id="editormd" class="w-full-important">
                                  <textarea style="display:none;" v-html="profile.about"></textarea>
                              </div>
                          </el-form-item>
                          <el-form-item class="pull-right">
                          <el-button type="primary" @click="submitForm"> 立即提交 </el-button>
                          <el-button @click="resetForm">重置</el-button>
                          </el-form-item>
                      </el-form>
                  </el-col>
              </el-row>
          </div>
        </div>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
export default {
  asyncData() {
    return axios.get("/api/user/about").then(d => {
      return {
        profile: d.data.result
      };
    });
  },
  data() {
    return {
      markdown: {}
    };
  },
  methods: {
    submitForm() {
      this.profile.about = this.markdown.getMarkdown();
      this.$http
        .post("/api/user/edit_about", { about: this.profile.about })
        .then(
          d => {
            if (d.data.success) {
              this.$notify({
                title: "成功",
                message: "资料更新成功!",
                type: "success"
              });
            }
          },
          err => console.log(err)
        );
    },
    resetForm() {
      var editormd = document.getElementsByName("clear")[0];
      editormd && editormd.parentNode.click();
    }
  },
  mounted() {
    editormd.toolbarModes.full = [
      "undo",
      "redo",
      "|",
      "bold",
      "del",
      "italic",
      "quote",
      "ucwords",
      "uppercase",
      "lowercase",
      "|",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "|",
      "list-ul",
      "list-ol",
      "hr",
      "|",
      "link",
      "reference-link",
      "image",
      "code",
      "preformatted-text",
      "code-block",
      "table",
      "datetime",
      "emoji",
      "html-entities",
      "pagebreak",
      "|",
      "goto-line",
      "watch",
      "preview",
      "clear",
      "search",
      "|",
      "help"
    ];

    this.$nextTick(_ => {
      this.markdown = editormd("editormd", {
        width: "90%",
        height: 640,
        syncScrolling: "single",
        path: "/js/editormd/lib/",
        imageUpload: true,
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL: "/upload/local_base64"
      });
    });
  },
  head() {
    let config = {
      title: "修改关于 - " + this.$store.getters['admin/getUser'].blog_name
    };
    return config;
  }
};
</script>