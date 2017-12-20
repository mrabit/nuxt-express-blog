<template>
    <section class="app-content">
        <div class="app-content-body">
          <div class="bg-light lter b-b wrapper-md">
              <h1 class="m-n font-thin h3">微信权限管理</h1>
          </div>
          <div class="wrapper clearfix m-b-md">
              <div class="pull-right m-b-sm">
                  <button class="btn btn-info w-xs" @click="handleAdd">新增</button>
              </div>
              <el-table :data="tableData" stripe class="w-full">
                  <el-table-column prop="id" label="ID" width="80">
                  </el-table-column>
                  <el-table-column prop="OPEN_ID" label="OPEN_ID">
                  </el-table-column>
                  <el-table-column prop="nick_name" label="昵称" width="180">
                      <template slot-scope="scope">
                          <span>{{ scope.row.nick_name }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column prop="release_time" label="发布时间" width="180">
                  </el-table-column>
                  <el-table-column label="操作" width="220">
                      <template slot-scope="scope">
                          <button class="btn btn-default btn-sm w-xs" @click="handleEdit(scope.row.id)">编辑</button>
                          <el-popover placement="top" trigger="click" v-model="scope.row.visable">
                              <p>删除操作将无法撤回,是否继续？</p>
                              <div style="text-align: right; margin: 0">
                                  <el-button size="mini" type="text" @click="scope.row.visable = false">取消</el-button>
                                  <el-button type="primary" size="mini" @click="handleDelete(scope.row.id)">确定</el-button>
                              </div>
                              <button class="btn btn-default btn-sm w-xs" type="button" 
                                  slot="reference">删除</button>
                          </el-popover>
                      </template>
                  </el-table-column>
              </el-table>
              <div class="pull-right m-t-md">
                  <el-pagination
                      :current-page="pagination.currentPage"
                      @current-change="getAuthList"
                      :page-size="pagination.pageSize"
                      layout="total, prev, pager, next"
                      :total="pagination.total">
                  </el-pagination>
              </div>
              <el-dialog
                  :title="!formData.id?'新增':'修改'"
                  :lock-scroll="false"
                  :visible.sync="dialogVisible"
                  @close="dialogClose"
                  width="50%">
                  <el-row>
                      <el-col :span="18" :offset="3">
                          <el-form :model="formData" :rules="formData_rule" ref="formData"
                            label-width="100px" label-position="right">
                              <el-form-item label="ID：" v-if="formData.id" prop="id">
                                  <el-input v-model="formData.id" disabled="disabled"></el-input>
                              </el-form-item>
                              <el-form-item label="OPEN_ID：" prop="OPEN_ID">
                                  <el-input v-model="formData.OPEN_ID"></el-input>
                              </el-form-item>
                              <el-form-item label="昵称：" prop="nick_name" width="180">
                                  <el-input v-model="formData.nick_name"></el-input>
                              </el-form-item>
                              <el-form-item class="pull-right m-b-none">
                                  <el-button type="primary" @click="handleSubmit('formData')">立即{{!formData.id?'新增':'修改'}}</el-button>
                                  <el-button @click="dialogVisible = false">取消</el-button>
                              </el-form-item>
                          </el-form>
                      </el-col>
                  </el-row>
              </el-dialog>
          </div>
        </div>
    </section>
</template>
<script>
import axios from '~/plugins/axios';
export default {
  data() {
    return {
      formData: {
        id: 0,
        OPEN_ID: "",
        nick_name: ""
      },
      formData_rule: {
        OPEN_ID: [
          { required: true, message: "请输入用户的OPEN_ID", trigger: "blur" }
        ],
        nick_name: [{ required: true, message: "请输入用户昵称", trigger: "blur" }]
      },
      tableData: [],
      dialogVisible: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  methods: {
    getAuthList(currentPage = 1) {
      this.pagination.currentPage = currentPage;
      return axios
        .get(
          "/api/wx/getAuthList/" + currentPage + "/" + this.pagination.pageSize
        )
        .then(d => {
          if (d.data.success) {
            var result = d.data.result;
            this.tableData = result.aaData;
            this.pagination.total = result.count;
          }
        });
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var url = "/api/wx/addAuth";
          if (this.formData.id) {
            url = "/api/wx/updateAuth";
          }
          this.$http.post(url, this.formData).then(result => {
            this.$notify({
              title: "成功",
              message: (!this.formData.id ? "新增" : "修改") + "用户成功!",
              type: "success",
              position: "bottom-right"
            });
            this.dialogVisible = false;
            this.getAuthList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDelete(id) {
      this.$http.post("/api/wx/deleteAuth", { id }).then(d => {
        this.$notify({
          title: "成功",
          message: "删除用户成功!",
          type: "success",
          position: "bottom-right"
        });
        this.getAuthList(this.pagination.currentPage);
      });
    },
    handleEdit(id) {
      this.formData = {
        id: 53,
        OPEN_ID: "oqMgS0WXm5BonhyCCN-hrrtRWU3E",
        nick_name: "alert"
      };
      this.dialogVisible = true;
    },
    handleAdd() {
      this.dialogVisible = true;
    },
    dialogClose() {
      this.formData = {
        id: 0,
        OPEN_ID: "",
        nick_name: ""
      };
    }
  },
  mounted() {
    this.getAuthList();
  },
  head() {
    let config = {
      title: "微信权限管理"
    };
    return config;
  }
};
</script>
