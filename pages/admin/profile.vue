<template>
  <section class="app-content">
    <div class="app-content-body">
      <loading :show="loading"></loading>
      <div v-show="!loading">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">修改资料</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <el-row :gutter="20">
            <el-col :span="14" :offset="5">
              <el-form :rules="rules" ref="profile" :model="profile" label-width="160px">
                <el-form-item label="输入用户名：" prop="uname">
                  <el-input disabled="disabled" v-model="profile.uname"></el-input>
                </el-form-item>
                <el-form-item label="输入博客名称：" prop="blog_name">
                  <el-input v-model="profile.blog_name"></el-input>
                </el-form-item>
                <el-form-item label="输入微博链接：" prop="weibo">
                  <el-input v-model="profile.weibo"></el-input>
                </el-form-item>
                <el-form-item label="输入github链接：" prop="github">
                  <el-input v-model="profile.github"></el-input>
                </el-form-item>
                <el-form-item label="输入twitter链接：" prop="twitter">
                  <el-input v-model="profile.twitter"></el-input>
                </el-form-item>
                <el-form-item class="pull-right">
                  <el-button type="primary" @click="onSubmit('profile')">立即更新</el-button>
                  <el-button>取消</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import {
  mapGetters
} from "vuex";
export default {
  data() {
    const checkUrl = (rule, value, callback) => {
      const reg = new RegExp("[a-zA-z]+://[^s]*", "ig");
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的链接地址."));
      }
    };
    return {
      profile: {},
      loading: true,
      rules: {
        uname: [{
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        }],
        blog_name: [{
          required: true,
          message: "请输入博客名称",
          trigger: "blur"
        }],
        weibo: [{
            required: true,
            message: "请输入微博链接",
            trigger: "blur"
          },
          {
            validator: checkUrl,
            trigger: "blur"
          }
        ],
        github: [{
            required: true,
            message: "请输入github链接",
            trigger: "blur"
          },
          {
            validator: checkUrl,
            trigger: "blur"
          }
        ],
        twitter: [{
            required: true,
            message: "请输入twitter链接",
            trigger: "blur"
          },
          {
            validator: checkUrl,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      user: "admin/getUser"
    })
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post("/api/user/edit_profile", this.profile).then(
            result => {
              if (result.data.success) {
                this.$notify({
                  title: "成功",
                  message: "用户资料更新成功!",
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
    getProfile(id) {
      this.$http.get("/api/user/profile?id=" + id).then(d => {
        let result = d.data.result;
        this.profile = {
          id: result.id,
          uname: result.uname,
          blog_name: result.blog_name,
          weibo: result.weibo,
          github: result.github,
          twitter: result.twitter,
          user_header_img: result.user_header_img
        };
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getProfile(this.user.id || 1);
  },
  head() {
    let config = {
      title: "修改资料 - " + this.user.blog_name
    };
    return config;
  }
};

</script>
