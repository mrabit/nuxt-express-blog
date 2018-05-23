<template>
  <section class="app-content">
    <div class="app-content-body">
      <loading :show="loading"></loading>
      <div v-show="!loading">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">云解析列表</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
            <el-form-item label="关键字：">
              <el-input v-model="formInline.keyword" placeholder="关键字,支持模糊搜索"></el-input>
            </el-form-item>
            <el-form-item label="域名：">
              <el-select v-model="formInline.domainame" placeholder="请选择">
                <el-option v-for="(item,index) in domains" :key="index" :label="item.DomainName" :value="item.DomainName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="m-r-xs" @click="handleCurrentChange">查询</el-button>
              <el-button type="primary" @click="handleCurrentChange">新增</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" stripe class="w-full">
            <!-- <el-table-column prop="id" label="序号" width="80">
            </el-table-column> -->
            <el-table-column prop="Type" align="center" label="记录类型" width="100">
            </el-table-column>
            <el-table-column prop="RR" align="center" label="主机记录" width="100">
            </el-table-column>
            <el-table-column prop="Line" align="center" label="解析线路(isp)" width="130">
            </el-table-column>
            <el-table-column prop="Value" label="记录值">
            </el-table-column>
            <el-table-column prop="Priority" align="center" label="MX优先级" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.Priority || '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="TTL" align="center" label="TTL值" width="100">
            </el-table-column>
            <el-table-column prop="Status" align="center" label="状态" width="100">
              <template slot-scope="scope">
                <span class="text-success" :class="{'text-danger':scope.row.Status != 'ENABLE' }">
                    {{ scope.row.Status == "ENABLE" ? "启用中": "已暂停" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="320">
              <template slot-scope="scope">
                <router-link class="btn btn-default btn-sm w-xs m-r-xs" :disabled="!!parseInt(scope.row.is_html)" :to="'/admin/articleEdit?id=' + scope.row.id">编辑</router-link>
                <button class="btn btn-default btn-sm w-xs m-r-xs" type="button" @click="handleSetRecordStatus(scope.row.RecordId,scope.row.Status)" slot="reference">
                  {{scope.row.Status == "ENABLE" ? "暂停" : "启用"}}
                </button>
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
export default {
  data() {
    return {
      formInline: {
        keyword: "",
        domainame: "",
      },
      domains: [],
      tableData: [],
      total: 0,
      pageSize: 10,
      loading: true
    }
  },
  methods: {
    getDomainList() {
      return this.$http.get('/api/alidns/get_domain_list').then(d => {
        if (d.data.success) {
          this.domains = d.data.result;
          this.formInline.domainame = this.domains[0].DomainName;
        }
        this.loading = false;
      })
    },
    handleCurrentChange(currentPage = 1) {
      let url = `/api/alidns/get_domain_records/${currentPage}/${this.pageSize}`;
      this.$http.get(url, {
        params: {
          keyword: this.formInline.keyword,
          domainame: this.formInline.domainame
        }
      }).then(d => {
        if (d.data.success) {
          this.tableData = d.data.result.DomainRecords.Record;
          this.total = d.data.result.TotalCount;
        }
      })
    },
    handleSetRecordStatus(RecordId, Status) {
      Status = Status == "ENABLE" ? "Disable" : "Enable";
      this.$http.post('/api/alidns/set_domain_record_status', {
        RecordId,
        Status
      }).then(d => {
        if (d.data.success) {
          this.handleCurrentChange();
          this.$notify({
            title: "成功",
            message: "状态更改成功!",
            type: "success"
          });
        }
      })
    }
  },
  created() {
    this.getDomainList().then(this.handleCurrentChange);
  }
}

</script>
