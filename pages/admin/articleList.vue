<style>
.el-date-editor--daterange.el-input {
  width: 320px;
}
</style>
<template>
    <section class="app-content">
      <div class="app-content-body">
        <div class="bg-light lter b-b wrapper-md">
            <h1 class="m-n font-thin h3">文章列表</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="文章标题：">
                    <el-input v-model="formInline.title" placeholder="文章标题,支持模糊搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label=" 发布时间：" name="type" v-model="formInline.need_time"></el-checkbox>
                    <el-date-picker format="yyyy-MM-dd hh:mm:ss" v-model="formInline.release_time" :disabled="!formInline.need_time" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" stripe class="w-full">
                <el-table-column prop="id" label="ID" width="80">
                </el-table-column>
                <el-table-column prop="title" label="标题">
                    <template slot-scope="scope">
                        <a :href="'/details/' + scope.row.id + '.html'" target="_blank">{{ scope.row.title }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="private" label="公开度" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.private | isPrivate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reprint_url" label="是否转载" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.reprint_url | isReprint }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="uname" label="发布者" width="100">
                </el-table-column>
                <el-table-column prop="release_time" label="发布时间" width="180">
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <router-link class="btn btn-default btn-sm w-xs" :disabled="!!parseInt(scope.row.is_html)"
                            :to="'/admin/article_edit.html?id=' + scope.row.id">编辑</router-link>
                        <el-popover placement="top" trigger="click" v-model="scope.row.visable">
                            <p>删除操作将无法撤回,是否继续？</p>
                            <div style="text-align: right; margin: 0">
                              <el-button size="mini" type="text" @click="scope.row.visable = false">取消</el-button>
                              <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
                            </div>
                            <button class="btn btn-default btn-sm w-xs" type="button" 
                              slot="reference">删除</button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pull-right m-t-md">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
        </div>
      </div>
    </section>
</template>
<script>
import util from "util";
export default {
  data() {
    return {
      formInline: {
        title: "",
        need_time: false,
        release_time: "",
        params: ""
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
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
      pageSize: 10
    };
  },
  filters: {
    isReprint(val) {
      return !!val ? "转载" : "原创";
    },
    isPrivate(val) {
      return !!parseInt(val) ? "不公开" : "公开";
    }
  },
  methods: {
    handleCurrentChange(currentPage = 1) {
      var url = util.format(
        "/api/article/get_lists/%s/%s",
        currentPage,
        this.pageSize
      );
      if (this.formInline.params) {
        url += this.formInline.params;
      }

      var result = {
        count: 25,
        article_lists: [
          {
            id: 47,
            title: "gitlab/github 多账户下设置 ssh keys",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-11-08 11:20:23"
          },
          {
            id: 46,
            title: "websocket配合小程序实现扫码登录",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-11-05 00:10:57"
          },
          {
            id: 45,
            title: "小程序 - bing每日一图",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-11-02 21:56:55"
          },
          {
            id: 44,
            title: "nginx配置websocket的wss   ",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-11-02 01:04:03"
          },
          {
            id: 43,
            title: "NodeJS+ws模块实现websocket通讯",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-11-01 11:22:45"
          },
          {
            id: 42,
            title: "CentOS7 下pm2开机自启动",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-10-29 23:47:18"
          },
          {
            id: 40,
            title: "树莓派Raspberry Pi 3 安装图形化工具VNCserver",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-10-10 23:28:56"
          },
          {
            id: 39,
            title: "树莓派Raspberry Pi 3 安装nginx服务",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-10-05 20:32:23"
          },
          {
            id: 38,
            title: "树莓派Raspberry Pi 3 安装NodeJS",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-10-05 17:51:31"
          },
          {
            id: 37,
            title: "树莓派Raspberry Pi 3 安装CentOS7",
            is_html: 0,
            reprint_url: "",
            private: 0,
            uname: "admin",
            release_time: "2017-10-04 17:54:19"
          }
        ]
      };
      for (var i in result.article_lists) {
        result.article_lists[i]["visable"] = false;
      }
      this.tableData = result.article_lists;
      this.total = result.count;
    },
    onSubmit() {
      var params = [];
      if (this.formInline.title) {
        params.push("title=" + this.formInline.title);
      }
      var time = this.formInline.release_time;
      if (
        this.formInline.need_time &&
        typeof time === "object" &&
        time[0] &&
        time[1]
      ) {
        params.push("startime=" + Date.parse(new Date(time[0])) / 1000);
        params.push("&endtime=" + Date.parse(new Date(time[1])) / 1000);
      }
      var params_url = "";
      if (params.length) {
        params_url = "?" + params.join("&");
      }
      this.formInline.params = params_url;

      this.handleCurrentChange(1);
    },
    handleDelete(row) {
      row.visable = false;
      this.$http.post("/api/article/delete_article", { id: row.id }).then(d => {
        if (d.data.success) {
          this.handleCurrentChange();
          this.$notify({
            title: "成功",
            message: "文章删除成功!",
            type: "success"
          });
        }
      });
    }
  },
  mounted() {
    this.handleCurrentChange();
  },
  head() {
    let config = {
      title: "文章列表"
    };
    return config;
  }
};
</script>