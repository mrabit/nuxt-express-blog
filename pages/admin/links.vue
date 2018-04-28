<template>
  <section class="app-content">
    <div class="app-content-body">
      <loading :show="loading"></loading>
      <div v-show="!loading">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">友链配置</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <div class="pull-right m-b-sm">
            <button class="btn btn-info w-xs" @click="handleAdd">新增</button>
          </div>
          <el-table :data="tableData" stripe class="w-full">
            <el-table-column prop="id" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="site_name" label="网站名称">
            </el-table-column>
            <el-table-column prop="site_url" label="网站地址" width="300">
              <template slot-scope="scope">
                <a :href="scope.row.site_url" target="_blank">{{ scope.row.site_url }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="release_time" label="添加时间" width="180">
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <button class="btn btn-default btn-sm w-xs m-r-xs" @click="handleEdit(scope.row.id)">编辑</button>
                <el-popover placement="top" trigger="click" v-model="scope.row.visable">
                  <p>删除操作将无法撤回,是否继续？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visable = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDelete(scope.row.id)">确定</el-button>
                  </div>
                  <button class="btn btn-default btn-sm w-xs" type="button" slot="reference">删除</button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="pull-right m-t-md">
            <el-pagination :current-page="pagination.currentPage" @current-change="getLinksList" :page-size="pagination.pageSize" layout="total, prev, pager, next" :total="pagination.total">
            </el-pagination>
          </div>
          <el-dialog :title="!formData.id?'新增':'修改'" :lock-scroll="false" :visible.sync="dialogVisible" @close="dialogClose" width="50%">
            <el-row>
              <el-col :span="18" :offset="3">
                <el-form :model="formData" :rules="formData_rule" ref="formData" label-width="100px" label-position="right">
                  <el-form-item label="ID：" v-if="formData.id" prop="id">
                    <el-input v-model="formData.id" disabled="disabled"></el-input>
                  </el-form-item>
                  <el-form-item label="网站名称:" prop="site_name">
                    <el-input v-model="formData.site_name"></el-input>
                  </el-form-item>
                  <el-form-item label="网站地址:" prop="site_url" width="180">
                    <el-input v-model="formData.site_url"></el-input>
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
      formData: {
        id: 0,
        site_name: "",
        site_url: ""
      },
      formData_rule: {
        site_name: [{
          required: true,
          message: "请输入网站名称",
          trigger: "blur"
        }],
        site_url: [{
            required: true,
            message: "请输入网站地址",
            trigger: "blur"
          },
          {
            validator: checkUrl,
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      loading: true,
      dialogVisible: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    ...mapGetters({
      user: "admin/getUser"
    })
  },
  methods: {
    getLinksList(currentPage = 1) {
      this.pagination.currentPage = currentPage;
      return this.$http
        .get(
          "/api/links/getLinksList/" +
          currentPage +
          "/" +
          this.pagination.pageSize
        )
        .then(d => {
          if (d.data.success) {
            const result = d.data.result;
            this.tableData = result.aaData;
            this.pagination.total = result.count;
          }
          this.loading = false;
        });
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = "/api/links/addLinks";
          if (this.formData.id) {
            url = "/api/links/updateLinks";
          }
          this.$http.post(url, this.formData).then(result => {
            this.$notify({
              title: "成功",
              message: (!this.formData.id ? "新增" : "修改") + "友链成功!",
              type: "success",
              position: "bottom-right"
            });
            this.dialogVisible = false;
            this.getLinksList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDelete(id) {
      this.$http
        .post("/api/links/deleteLinks", {
          id
        })
        .then(d => {
          this.$notify({
            title: "成功",
            message: "删除友链成功!",
            type: "success",
            position: "bottom-right"
          });
          this.getLinksList(this.pagination.currentPage);
        });
    },
    handleEdit(id) {
      this.$http.get("/api/links/getLinksDetails/" + id).then(d => {
        if (d.data.success) {
          this.formData = d.data.result;
          this.dialogVisible = true;
        }
      });
    },
    handleAdd() {
      this.dialogVisible = true;
    },
    dialogClose() {
      this.formData = {
        id: 0,
        site_name: "",
        site_url: ""
      };
    }
  },
  mounted() {
    this.getLinksList();
  },
  head() {
    return {
      title: "友链管理 - " + this.user.blog_name
    };
  }
};

</script>
