<style>
.radio {
  margin-left: initial;
  margin-bottom: initial;
  margin-top: initial;
}

.w-full-important {
  width: 100% !important;
}

.input-new-tag.el-input {
  width: 80px;
}

</style>
<template>
  <el-row>
    <el-col :span="22" :offset="2">
      <el-form label-position="right" label-width="120px" ref="articleForm" :model="article">
        <el-form-item label="文章标题：">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="转载地址：">
          <el-input v-model="article.reprint_url"></el-input>
        </el-form-item>
        <el-form-item label="公开度：">
          <el-radio class="radio" v-model="article.private" label="0">公开</el-radio>
          <el-radio class="radio" v-model="article.private" label="1">不公开</el-radio>
        </el-form-item>
        <el-form-item label="文章正文：">
          <!-- <div id="editormd" class="w-full-important">
            <textarea style="display:none;" v-model="content"></textarea>
          </div> -->
          <mavon-editor ref='md' @imgAdd="$imgAdd" :externalLink="external_link" class="w-full-important" v-model="article.content" :ishljs="true"></mavon-editor>
        </el-form-item>
        <el-form-item label="标签填写：">
          <el-tag :key="index" v-for="(id, tag, index) in article.tags" class="m-r-sm" :closable="true" :close-transition="false" @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <div v-if="inputTagsVisible" class="inline" @blur="handleInputConfirm">
            <el-input class="input-new-tag" id="inputTagsValue" v-model="inputTagsValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm">
            </el-input>
            <el-select v-model="TagsSelected" @change="select_tags" placeholder="请选择" size="mini">
              <el-option v-for="(id, key) in tags_map" :key="id" :label="key" :value="key">
              </el-option>
            </el-select>
          </div>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
        <el-form-item class="pull-right">
          <el-button type="primary" @click="submitForm('articleForm')">{{ submit_text }}</el-button>
          <el-button @click="resetForm('articleForm')" v-if="show_reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    article: Object,
    tags_map: Object,
    loading: Boolean
  },
  data() {
    return {
      inputTagsVisible: false,
      inputTagsValue: "",
      TagsSelected: "",
      external_link: false
    };
  },
  computed: {
    // 文章内容符号转码
    content() {
      return this.unescape(this.article.content);
    },
    // 提交按钮文本
    submit_text() {
      return this.$route.query.id ? "立即更新" : "立即创建";
    },
    // 是否显示重置按钮
    show_reset() {
      return !this.$route.query.id;
    }
  },
  methods: {
    uploadImage(image, type, pos) {
      // base64编码图片字符串
      this.$http.post('/upload/local_base64', {
        image,
        type
      }).then(d => {
        if (d.data.status === 0) {
          this.$refs.md.$img2Url(pos, d.data.path);
        } else {
          this.$notify.error({
            message: '上传失败.'
          });
        }
      });
    },
    // 图片上传
    $imgAdd(pos, $file) {
      var imageFormats = ["jpg", "jpeg", "gif", "png", "bmp", "webp"];
      // 将图片上传到服务器.
      var isImage = new RegExp("(\\.(" + imageFormats.join("|") + "))$", "ig"); // /(\.(webp|jpg|jpeg|gif|bmp|png))$/
      var type = $file.name.match(isImage);
      if ($file.name == "") {
        this.$notify({
          message: '请选择图片.',
          type: 'warning'
        });
        this.$refs.md.$refs.toolbar_left.$imgDelByFilename(pos);
        return false;
      }
      if (!isImage.test($file.name)) {
        this.$notify({
          message: '文件格式不允许，请上传' + imageFormats.join(", "),
          type: 'warning'
        });
        this.$refs.md.$refs.toolbar_left.$imgDelByFilename(pos);
        return false;
      }
      var reader = new FileReader();
      reader.onload = (e) => {
        this.uploadImage(e.target.result, type[0], pos);
      };
      reader.readAsDataURL($file);
    },
    // 符号转码
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
    // 删除标签
    handleClose(tag) {
      delete this.article.tags[tag];
      var clone = Object.assign({}, this.article.tags);
      this.article.tags = clone;
    },
    // 点击新增标签,显示输入框
    showInput() {
      this.inputTagsVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 新增标签,提交输入框
    handleInputConfirm() {
      let inputTagsValue = this.inputTagsValue;
      if (inputTagsValue) {
        this.article.tags[inputTagsValue] = this.tags_map[inputTagsValue] || 0;
      }
      this.inputTagsVisible = false;
      this.inputTagsValue = "";
    },
    // 选择下拉框中已有标签
    select_tags(tags) {
      this.inputTagsValue = tags;
      this.handleInputConfirm();
      this.TagsSelected = "";
    },
    // 文章提交
    submitForm(formName) {
      if (this.$route.query.id) {
        this.$http.post("/api/article/update_article", this.article).then(d => {
          if (d.data.success) {
            this.$router.push("/admin/articleList");
            this.$notify({
              title: "成功",
              message: "文章更新成功!",
              type: "success"
            });
          }
        });
      } else {
        this.$http.post("/api/article/insert_article", this.article).then(d => {
          if (d.data.success) {
            this.$router.push("/admin/articleList");
            this.$notify({
              title: "成功",
              message: "文章新增成功!",
              type: "success"
            });
          }
        });
      }
    },
    // 文章重置
    resetForm(formName) {
      this.article = {
        title: "",
        reprint_url: "",
        private: "0",
        content: "",
        create_user_id: 1,
        tags: {}
      };
    }
  }
};

</script>
