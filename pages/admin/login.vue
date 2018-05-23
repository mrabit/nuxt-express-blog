<style lang="scss">
.login {
  .input-with-login {
    width: 200px;
    input {
      border-radius: 0 !important;
      height: 36px;
    }
    button {
      width: 45px;
      height: 36px;
      padding: 0;
    }
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #27c24c;
    border-color: #27c24c;
  }
  .el-tabs__item {
    color: #8391a5;
    &:hover {
      color: #409eff;
      cursor: pointer;
    }
  }
  .qrcode {
    width: 150px;
    height: 150px;
  }
}

</style>
<template>
  <section class="app-content m-l-none login">
    <div class="modal-over bg-black">
      <div class="verticalCenter w-full h-full">
        <div v-show="!tokenAuth" class="animated fadeInUp text-center" style="width:300px;">
          <div class="thumb-lg">
            <!-- <img src="/Uploads/Picture/2017-06-06/59369fb016efa.png" class="img-circle"> -->
            <img :src="user.user_header_img" class="img-circle">
          </div>
          <p class="h4 m-t m-b">{{ user.uname }}</p>
          <el-form :inline="true" :model="formData" :rules="rules" class="m-t" ref="formData">
            <el-form-item>
              <el-input type="password" placeholder="输入密码进行下一步" class="hide"></el-input>
            </el-form-item>
            <el-form-item prop="upwd">
              <el-input type="password" placeholder="输入密码进行下一步" v-model="formData.upwd" class="input-with-login" @focus="formData.visibility = false" @keyup.enter.native="submitForm('formData')" :disabled="formData.logining">
                <el-button slot="append" class="btn btn-success no-border" native-type="button" @click="submitForm('formData')">
                  <i class="fa fa-arrow-right" :class="{'fa-spin fa-spinner': formData.logining}"></i>
                </el-button>
              </el-input>
              <span v-if="!formData.logining" class="help-block m-b-none text-danger m-t-none text-left text-xs" :style="{ visibility: formData.visibility?'visible':'hidden' }" style="line-height: 18px">{{ formData.error }}</span>
              <span v-if="formData.logining" class="help-block m-b-none text-success m-t-none text-left text-xs" :style="{ visibility: formData.logining?'visible':'hidden' }" style="line-height: 18px">正在登录, 请稍候...</span>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="tokenAuth" class="padder">
          <div class="col-md-12 text-center"><i class="fa fa-spin fa-spinner fa-2x"></i>
            <div class="clear m-t-xs"><span class="text-xs">请稍后...</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
const WebStorageCache = require("web-storage-cache");
const config = require("../../server/config");
const md5 = require("md5");
import {
  mapGetters
} from "vuex";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        this.formData.error = "请输入密码";
        this.formData.visibility = true;
      }
      callback();
    };
    const validateLength = (rule, value, callback) => {
      if (!this.formData.visibility) {
        this.formData.error = "长度在 5 到 10 个字符";
      }
      this.formData.visibility = value.length < 5 || value.length > 10;
      callback();
    };
    return {
      formData: {
        uname: "admin",
        upwd: "",
        error: "密码错误,请重试",
        visibility: false,
        logining: false
      },
      rules: {
        upwd: [{
            validator: validatePass,
            trigger: "change"
          },
          {
            validator: validateLength,
            trigger: "change"
          }
        ]
      },
      wsCache: null,
      tokenAuth: true
    };
  },
  computed: {
    ...mapGetters({
      user: "admin/getUser"
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!this.formData.visibility) {
          this.formData.logining = true;
          this.$http
            .post("/api/login", {
              uname: this.formData.uname,
              upwd: md5(this.formData.upwd)
            })
            .then(
              result => {
                setTimeout(_ => {
                  if (result.data.success) {
                    this.loginSuccess(result.data.token, result.data.user);
                  } else {
                    this.formData.logining = false;
                    this.$message.error(result.data.message);
                  }
                }, 1500);
              },
              err => this.$message.error(err.message)
            );
        }
      });
    },
    loginSuccess(token, user) {
      this.wsCache.set(
        "token", {
          token: token,
          user: user
        }, {
          exp: 60 * 60
        }
      );
      user.blog_name += "的博客";
      this.$store.commit("admin/changeUser", user);
      this.$store.commit("admin/changeTokenAuth", true);
      this.$router.push(this.$route.query.redirect || "/admin");
    }
  },
  created() {
    if (!process.server) {
      this.wsCache = new WebStorageCache();
      const token = this.wsCache.get("token");
      // 本地缓存存在token， 判断token是否失效
      // 不存在 显示登录框
      if (token) {
        this.$http.post("/api/check_token").then(
          result => {
            setTimeout(_ => {
              this.$store.commit("admin/changeTokenAuth", true);
              this.$router.push(this.$route.query.redirect || "/admin");
            }, 1500);
          },
          _ => {
            this.tokenAuth = false;
          }
        );
      } else {
        this.tokenAuth = false;
      }
    }
  },
  head() {
    return {
      title: "登录 - " + this.user.blog_name
    };
  }
};

</script>
