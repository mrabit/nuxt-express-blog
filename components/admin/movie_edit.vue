<template>
  <el-row>
    <el-col :span="22" :offset="2">
      <el-form :rules="rules" ref="movie" :model="movie" label-width="120px">
        <el-form-item label="输入电影名称：" prop="movie_name">
          <el-input v-model="movie.movie_name"></el-input>
        </el-form-item>
        <el-form-item label="输入豆瓣url：" prop="movie_url">
          <el-input v-model="movie.movie_url"></el-input>
        </el-form-item>
        <el-form-item label="观影时间：" prop="watch_time">
          <el-date-picker v-model="movie.watch_time" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上传电影封面：">
          <el-upload class="upload-demo" :file-list="movie.movie_img" action="" drag :httpRequest="handleChooseImage" :limit="1">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item class="pull-right">
          <el-button type="primary" @click="onSubmit('movie')">{{id == 0 ? '立即添加' : '立即更新'}}</el-button>
          <!-- <el-button @click="resetForm">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    const checkUrl = (rule, value, callback) => {
      const reg = new RegExp("[a-zA-z]+://[^s]*", "ig");
      if (!value || reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的链接地址."));
      }
    };
    return {
      rules: {
        movie_name: [{
          required: true,
          message: "请输入电影名称.",
          trigger: "blur"
        }],
        movie_url: [{
          validator: checkUrl,
          trigger: 'blur'
        }],
        watch_time: [{
          required: true,
          message: "请选择观影时间.",
          trigger: "blur"
        }],
      }
    }
  },
  props: {
    loading: Boolean,
    movie: Object,
    id: {
      type: [Number, String],
      default: 0
    }
  },
  methods: {
    handleChooseImage(input_file) {
      var file = input_file.file;
      var imageFormats = ["jpg", "jpeg", "gif", "png", "bmp", "webp"];
      // 将图片上传到服务器.
      var isImage = new RegExp("(\\.(" + imageFormats.join("|") + "))$", "ig"); // /(\.(webp|jpg|jpeg|gif|bmp|png))$/
      var type = file.name.match(isImage);
      if (file.name == "") {
        this.$notify({
          message: '请选择图片.',
          type: 'warning'
        });
        return false;
      }
      if (!isImage.test(file.name)) {
        this.$notify({
          message: '文件格式不允许，请上传' + imageFormats.join(", "),
          type: 'warning'
        });
        return false;
      }
      var reader = new FileReader();
      reader.onload = (e) => {
        this.uploadImage(e.target.result, type);
      }
      reader.readAsDataURL(file);
    },
    uploadImage(image, type) {
      // base64编码图片字符串
      this.$http.post('/upload/local_base64', {
        image,
        type
      }).then(d => {
        if (d.data.status === 0) {
          this.movie.movie_img = [{
            name: d.data.fileName,
            url: d.data.path
          }];
          this.$notify.success({
            message: '图片上传成功.'
          });
        } else {
          this.$notify.error({
            message: '上传失败.'
          });
        }
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            movie_name: this.movie.movie_name,
            movie_url: this.movie.movie_url,
            movie_img: this.movie.movie_img || [],
            watch_time: Math.ceil(this.movie.watch_time / 1000),
          };
          let url = "/api/movies/insert_movie";
          if (this.id != "0") {
            url = "/api/movies/update_movie";
            params['id'] = this.id;
          }
          this.$http.post(url, params).then(
            result => {
              if (result.data.success) {
                this.$router.push("/admin/moviesList");
                this.$notify({
                  title: "成功",
                  message: `观影记录${this.id=="0"?"新增":"编辑"}成功!`,
                  type: "success"
                });
              } else {
                this.$message.error(result.data.result);
              }
            },
            err => {
              this.$message.error(err);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.movie = {
        movie_name: "",
        movie_img: [],
        movie_url: "",
        watch_time: +new Date()
      };
    }
  }
}

</script>
