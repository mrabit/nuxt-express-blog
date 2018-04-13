<style>
.w-full-important {
  width: 100% !important;
}

</style>
<template>
  <div class="app-content">
    <div class="app-content-body">
      <loading :show="loading"></loading>
      <div v-show="!loading">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">关于</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <el-row>
            <el-col :span="22" :offset="2">
              <el-form label-position="right" label-width="120px" ref="aboutForm" :model="profile">
                <el-form-item label="关于：">
                  <!-- <div id="editormd" class="w-full-important">
                    <textarea style="display:none;" v-html="profile.about"></textarea>
                  </div> -->
                  <mavon-editor ref='md' @imgAdd="$imgAdd" :externalLink="external_link" class="w-full-important" v-model="profile.about" :ishljs="true"></mavon-editor>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      markdown: {},
      profile: {},
      loading: true,
      external_link: false
    };
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
    submitForm() {
      this.$http
        .post("/api/user/edit_about", {
          about: this.profile.about
        })
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
      this.profile.about = "";
    }
  },
  mounted() {
    this.$http.get("/api/user/about").then(d => {
      this.profile = d.data.result;
      this.loading = false;
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
