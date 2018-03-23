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
      <div class="modal-over bg-black" >
          <div class="verticalCenter w-full h-full">
              <div class=" animated fadeInUp text-center" style="width:300px;">
                  <div class="thumb-lg">
                      <img src="/Uploads/Picture/2017-06-06/59369fb016efa.png" class="img-circle">
                  </div>
                  <p class="h4 m-t m-b">{{ formData.uname }}</p>
                  <el-form :inline="true" :model="formData" :rules="rules" class="m-t" ref="formData">
                    <el-form-item>
                      <el-input type="password" placeholder="输入密码进行下一步" class="hide"></el-input>
                    </el-form-item>
                    <el-form-item prop="upwd">
                        <el-input type="password" placeholder="输入密码进行下一步" v-model="formData.upwd" class="input-with-login"
                            @focus="formData.visibility = false" @keyup.enter.native="submitForm('formData')" :disabled="formData.logining">
                            <el-button slot="append" class="btn btn-success no-border" native-type="button" @click="submitForm('formData')">
                                <i class="fa fa-arrow-right" :class="{'fa-spin fa-spinner': formData.logining}"></i>
                            </el-button>
                        </el-input>
                        <span v-if="!formData.logining" class="help-block m-b-none text-danger m-t-none text-left text-xs" :style="{ visibility: formData.visibility?'visible':'hidden' }"
                        style="line-height: 18px">{{ formData.error }}</span>
                        <span v-if="formData.logining" class="help-block m-b-none text-success m-t-none text-left text-xs" :style="{ visibility: formData.logining?'visible':'hidden' }"
                        style="line-height: 18px">正在登录, 请稍候...</span>
                    </el-form-item>
                  </el-form>
              </div>
          </div>
      </div>
  </section>
</template>
<script>
var WebStorageCache = require("web-storage-cache");

var QRCode = require("qrcode");
var config = require("../../server/config");
var md5 = require("md5");

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        this.formData.error = "请输入密码";
        this.formData.visibility = true;
      }
      callback();
    };
    var validateLength = (rule, value, callback) => {
      if (!this.formData.visibility) {
        this.formData.error = "长度在 5 到 10 个字符";
      }
      this.formData.visibility = value.length < 5 || value.length > 10;
      callback();
    };
    return {
      activeName: "passwd",
      formData: {
        uname: "admin",
        upwd: "",
        error: "密码错误,请重试",
        visibility: false,
        logining: false
      },
      rules: {
        upwd: [
          { validator: validatePass, trigger: "change" },
          { validator: validateLength, trigger: "change" }
        ]
      },
      wss: null,
      qrcode_url: "",
      qrcode_message: "请扫码登录.",
      wsCache: null
    };
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
        "token",
        {
          token: token,
          user: user
        },
        { exp: 60 * 60 }
      );
      user.blog_name += "的博客";
      this.$store.commit("admin/changeUser", user);
      this.$router.push("/admin");
    }
  },
  mounted() {
    this.wsCache = new WebStorageCache();
  },
  head() {
    return {
      title: "登录 - " + this.$store.getters["admin/getUser"].blog_name
    };
  }
};
</script>