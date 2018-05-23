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
                <el-option v-for="(item,index) in domains" :key="index" :label="'.' + item.DomainName" :value="item.DomainName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="m-r-xs" @click="handleCurrentChange">查询</el-button>
              <el-button type="primary" @click="handleAdd">新增</el-button>
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
              <template slot-scope="scope">
                <span>{{formatLine(scope.row.Line)}}</span>
              </template>
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
                <button class="btn btn-default btn-sm w-xs m-r-xs" type="button" @click="handleEditRecordInfo(scope.row.RecordId)" slot="reference">
                  编辑
                </button>
                <button class="btn btn-default btn-sm w-xs m-r-xs" type="button" @click="handleSetRecordStatus(scope.row.RecordId,scope.row.Status)" slot="reference">
                  {{scope.row.Status == "ENABLE" ? "暂停" : "启用"}}
                </button>
                <el-popover placement="top" trigger="click" v-model="scope.row.visable">
                  <p>删除操作将无法撤回,是否继续？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visable = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDelete(scope.row.RecordId)">确定</el-button>
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
          <el-dialog :title="!formData.RecordId?'新增':'修改'" :lock-scroll="false" :visible.sync="dialogVisible" @close="dialogClose" width="50%">
            <el-row>
              <el-col :span="18" :offset="3">
                <el-form :model="formData" :rules="formData_rule" ref="formData" label-width="100px" label-position="right">
                  <el-form-item v-if="formData.RecordId" label="RecordId：">
                    <el-input :disabled="true" v-model="formData.RecordId"></el-input>
                  </el-form-item>
                  <el-form-item label="记录类型：" prop="Type">
                    <el-select v-model="formData.Type" class="w-full" placeholder="请选择">
                      <el-option v-for="item in typeList" :key="item.name" :label="item.name" :value="item.name">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 12px">{{ item.description }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="主机记录：" prop="RR">
                    <el-input v-model="formData.RR">
                      <template slot="append">{{formInline.domainame}}</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="解析线路：" prop="Line">
                    <el-select v-model="formData.Line" class="w-full" placeholder="请选择">
                      <el-option v-for="item in lineList" :key="item.name" :label="item.name" :value="item.value">
                        <span style="float: left">{{ item.name }}</span>
                        <span v-if="item.description" style="float: right; color: #8492a6; font-size: 12px">{{ item.description }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="记录值：" prop="Value">
                    <el-input v-model="formData.Value"></el-input>
                  </el-form-item>
                  <el-form-item label="MX优先级：" prop="Priority" v-if="formData.Type == 'MX'">
                    <el-select v-model="formData.Priority" class="w-full" placeholder="请选择">
                      <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="TTL值：" prop="TTL">
                    <el-select v-model="formData.TTL" class="w-full" placeholder="请选择">
                      <el-option v-for="item in ttlList" :key="item.name" :label="item.name" :value="item.value">
                        <span style="float: left">{{ item.name }}</span>
                        <span v-if="item.description" style="float: right; color: #8492a6; font-size: 12px">{{ item.description }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="pull-right m-b-none">
                    <el-button type="primary" @click="handleSubmit('formData')">立即{{!formData.RecordId?'新增':'修改'}}</el-button>
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
export default {
  data() {
    // validator
    return {
      formInline: {
        keyword: "",
        domainame: "",
      },
      formData: {
        RR: "",
        Type: "A",
        Value: "",
        TTL: "600",
        Priority: "1",
        Line: "default"
      },
      domains: [],
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      loading: true,
      dialogVisible: false,
      formData_rule: {
        RR: {
          required: true,
          message: "请输入主机记录",
          trigger: "blur"
        },
        Type: {
          required: true,
          message: "请选择解析记录类型",
          trigger: "blur"
        },
        Value: {
          required: true,
          message: "请输入记录值",
          trigger: "blur"
        },
        TTL: {
          required: true,
          message: "请输入TTL值",
          trigger: "blur"
        },
        Priority: {
          required: true,
          message: "请选择MX记录的优先级",
          trigger: "blur"
        },
        Line: {
          required: true,
          message: "请选择解析线路",
          trigger: "blur"
        }
      },
      typeList: [{
        name: "A",
        description: "将域名指向一个IPV4地址"
      }, {
        name: "CNAME",
        description: "将域名指向另外一个域名"
      }, {
        name: "AAAA",
        description: "将域名指向一个IPV6地址"
      }, {
        name: "NS",
        description: "将子域名指定其他DNS服务器解析"
      }, {
        name: "MX",
        description: "将域名指向邮件服务器地址"
      }, {
        name: "SRV",
        description: "记录提供特定的服务的服务器"
      }, {
        name: "TXT",
        description: "文本长度限制512，通常做SPF记录（反垃圾邮件）"
      }, {
        name: "CAA",
        description: "CA证书颁发机构授权校验"
      }, {
        name: "显性URL",
        description: "将域名302重定向到另外一个地址"
      }, {
        name: "隐性URL",
        description: "与显性URL类似，但是会隐藏真实目标地址"
      }],
      lineList: [{
        name: '默认',
        value: 'default',
        description: '必填！未匹配到智能解析线路时，返回【默认】线路设置结果'
      }, {
        name: '中国联通',
        value: 'unicom'
      }, {
        name: '中国电信',
        value: 'telecom'
      }, {
        name: '中国移动',
        value: 'mobile'
      }, {
        name: '中国教育网',
        value: 'edu'
      }, {
        name: '境外',
        value: 'oversea',
        description: '向除中国大陆以外的其他国家和地区，返回设置的记录值'
      }, {
        name: '百度',
        value: 'baidu'
      }, {
        name: '必应',
        value: 'biying'
      }, {
        name: '谷歌',
        value: 'google'
      }],
      ttlList: [{
          name: "10分钟",
          value: 10 * 60
        },
        {
          name: "30分钟",
          value: 30 * 60
        },
        {
          name: "1小时",
          value: 60 * 60
        },
        {
          name: "12小时",
          value: 60 * 60 * 12
        },
        {
          name: "1天",
          value: 60 * 60 * 24
        },
      ]
    }
  },
  methods: {
    formatLine(val) {
      return this.lineList.find(v => {
        return v.value == val;
      }).name || val;
    },
    getDomainList() {
      return this.$http.get('/api/alidns/get_domain_list').then(d => {
        if (d.data.success) {
          this.domains = d.data.result;
          this.formInline.domainame = this.domains[0].DomainName;
        }
      })
    },
    handleCurrentChange(currentPage = 1) {
      this.currentPage = currentPage;
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
          this.loading = false;
        }
      })
    },
    handleEditRecordInfo(RecordId) {
      this.$http.get('/api/alidns/get_domain_record_info', {
        params: {
          RecordId
        }
      }).then(d => {
        if (d.data.success) {
          this.formData = d.data.result;
          this.handleAdd();
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
          this.handleCurrentChange(this.currentPage);
          this.$notify({
            title: "成功",
            message: "状态更改成功!",
            type: "success"
          });
        }
      })
    },
    handleAdd() {
      this.dialogVisible = true;
    },
    dialogClose() {
      this.formData = {
        RR: "",
        Type: "A",
        Value: "",
        TTL: "600",
        Priority: "1",
        Line: "default"
      };
      this.$refs['formData'].resetFields();
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            RR: this.formData.RR,
            Type: this.formData.Type,
            Value: this.formData.Value,
            TTL: this.formData.TTL,
            Priority: this.formData.Priority,
            Line: this.formData.Line,
            RecordId: this.formData.RecordId
          };
          let url = "/api/alidns/add_domain_record";
          if (params.RecordId) {
            url = "/api/alidns/update_domain_record";
          } else {
            params['DomainName'] = this.formInline.domainame;
          }
          this.$http.post(url, params).then(d => {
            if (d.data.success) {
              this.$notify({
                title: "成功",
                message: (!this.formData.RecordId ? "新增" : "修改") + "云解析成功!",
                type: "success",
                position: "bottom-right"
              });
              this.dialogVisible = false;
              this.handleCurrentChange(this.formData.RecordId ? 1 : this.currentPage);
            } else {
              this.$notify({
                title: "错误",
                message: d.data,
                type: "error",
                position: "bottom-right"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDelete(RecordId) {
      this.$http
        .post("/api/alidns/delete_domain_record", {
          RecordId
        })
        .then(d => {
          if (d.data.success) {
            this.$notify({
              title: "成功",
              message: "删除云解析成功!",
              type: "success",
              position: "bottom-right"
            });
            this.handleCurrentChange(this.currentPage);
          } else {
            this.$notify({
              title: "错误",
              message: d.data,
              type: "error",
              position: "bottom-right"
            });
          }
        });
    }
  },
  created() {
    this.getDomainList().then(this.handleCurrentChange);
  }
}

</script>
