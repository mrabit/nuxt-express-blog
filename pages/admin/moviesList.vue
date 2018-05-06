<style>
.el-date-editor--daterange.el-input {
  width: 320px;
}

</style>
<template>
  <section class="app-content">
    <div class="app-content-body">
      <loading :show="loading"></loading>
      <div v-show="!loading">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">观影列表</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
            <el-form-item label="电影名称：">
              <el-input v-model="formInline.movie_name" placeholder="电影名称,支持模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox label=" 观看时间：" name="type" v-model="formInline.need_time"></el-checkbox>
              <el-date-picker format="yyyy-MM-dd hh:mm:ss" v-model="formInline.watch_time" :disabled="!formInline.need_time" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="primary" @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" stripe class="w-full">
            <el-table-column prop="id" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="movie_name" label="电影名称">
            </el-table-column>
            <el-table-column label="豆瓣URL" width="400">
              <template slot-scope="scope">
                <a :href="scope.row.movie_url" target="_blank" class="text-ellipsis-1">{{ scope.row.movie_url }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="watch_time" label="观影时间" width="180">
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <router-link class="btn btn-default btn-sm w-xs m-r-xs" :disabled="!!parseInt(scope.row.is_html)" :to="'/admin/moviesEdit?id=' + scope.row.id">编辑</router-link>
                <el-popover placement="top" trigger="click" v-model="scope.row.visable">
                  <p>删除操作将无法撤回,是否继续？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visable = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
                  </div>
                  <button class="btn btn-default btn-sm w-xs" type="button" slot="reference">删除</button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="pull-right m-t-md">
            <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import util from "util";
import axios from "~/plugins/axios";
export default {
  data() {
    return {
      formInline: {
        movie_name: "",
        need_time: false,
        watch_time: "",
        params: ""
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      loading: true
    };
  },
  methods: {
    handleCurrentChange(currentPage = 1) {
      let url = util.format(
        "/api/movies/get_lists/%s/%s",
        currentPage,
        this.pageSize
      );
      if (this.formInline.params) {
        url += this.formInline.params;
      }
      this.$http.get(url).then(d => {
        const data = d.data;
        if (data.success) {
          const result = data.result;
          this.tableData = result.movies_lists;
          this.total = result.count;
          this.loading = false;
        }
      });
    },
    onSubmit() {
      const params = [];
      if (this.formInline.movie_name) {
        params.push("movie_name=" + this.formInline.movie_name);
      }
      const time = this.formInline.watch_time;
      if (
        this.formInline.need_time &&
        !!time &&
        typeof time === "object" &&
        time[0] &&
        time[1]
      ) {
        params.push("startime=" + Date.parse(new Date(time[0])) / 1000);
        params.push("&endtime=" + Date.parse(new Date(time[1])) / 1000);
      }
      let params_url = "";
      if (params.length) {
        params_url = "?" + params.join("&");
      }
      this.formInline.params = params_url;

      this.handleCurrentChange(1);
    },
    handleDelete(row) {
      row.visable = false;
      this.$http.post("/api/movies/delete_movie", {
        id: row.id
      }).then(d => {
        if (d.data.success) {
          this.handleCurrentChange();
          this.$notify({
            title: "成功",
            message: "观影记录删除成功!",
            type: "success"
          });
        }
      });
    },
    resetForm(formName) {
      this.formInline.movie_name = "";
      this.formInline.need_time = false;
      this.formInline.watch_time = "";
      this.onSubmit();
    }
  },
  mounted() {
    this.handleCurrentChange();
  },
  head() {
    let config = {
      title: "电影列表 - " + this.$store.getters['admin/getUser'].blog_name
    };
    return config;
  }
};

</script>
