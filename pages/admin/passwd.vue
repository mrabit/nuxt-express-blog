<template>
    <div class="app-content">
        <div class="app-content-body">
          <div class="bg-light lter b-b wrapper-md">
              <h1 class="m-n font-thin h3">密码修改</h1>
          </div>
          <div class="wrapper clearfix m-b-md">
              <el-row>
                  <el-col :span="14" :offset="5">
                      <el-form :rules="rules" ref="passwd" :model="profile" label-width="160px">
                          <el-form-item label="输入旧密码：" prop="oldPasswd">
                              <el-input type="password" v-model="profile.oldPasswd"></el-input>
                          </el-form-item>
                          <el-form-item label="输入新密码：" prop="newPasswd">
                              <el-input type="password" v-model="profile.newPasswd"></el-input>
                          </el-form-item>
                          <el-form-item label="确认密码：" prop="checkPass">
                              <el-input type="password" v-model="profile.checkPass"></el-input>
                          </el-form-item>
                          <el-form-item class="pull-right">
                              <el-button type="primary" @click="submitForm('passwd')">立即修改</el-button>
                              <el-button @click="resetForm('passwd')">取消</el-button>
                          </el-form-item>
                      </el-form>
                  </el-col>
              </el-row>
          </div>
        </div>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.profile.checkPass !== "") {
        this.$refs.passwd.validateField("checkPass");
      }
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.profile.newPasswd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      profile: {},
      rules: {
        oldPasswd: [
          { required: true, message: "请输入旧密码.", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 18 个字符", trigger: "change" }
        ],
        newPasswd: [
          { required: true, message: "请输入新密码.", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 18 个字符", trigger: "change" }
        ],
        checkPass: [
          { required: true, message: "请再次输入密码.", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 18 个字符", trigger: "change" }
        ]
      },
      wsCache: null
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/user/changePasswd", {
              oldPasswd: this.profile.oldPasswd,
              newPasswd: this.profile.newPasswd
            })
            .then(
              d => {
                if (d.data.success) {
                  wsCache.delete("token");
                  this.$notify({
                    title: "成功",
                    message: "密码修改成功!",
                    type: "success",
                    onClose: _ => {
                      window.location.href = "/admin/login.html";
                    }
                  });
                } else {
                  this.$message({
                    message: d.data.message,
                    type: "error"
                  });
                }
              },
              err => {
                console.log(err);
              }
            );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    var webStorageCache = require("web-storage-cache");
    this.wsCache = new webStorageCache();
  },
  head() {
    let config = {
      title: "密码修改"
    };
    return config;
  }
};
</script>