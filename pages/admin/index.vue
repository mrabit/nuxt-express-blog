<template>
  <section class="app-content">
    <div class="app-content-body">
      <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-n font-thin h3">总览</h1>
      </div>
      <div class="wrapper clearfix m-b-md">
        <div class="row">
          <div class="col-md-6 col-sm-12 m-b-md">
            <el-card class="w-full">
              <div slot="header" class="clearfix" style="height: 20px;">
                <span>今日访客{{visit_today?`(${visit_today})`:''}}</span>
                <el-select size="mini" @change="initVisitor" class="pull-right" v-model="value" placeholder="请选择">
                  <el-option v-for="value in selection" :key="value" :label="'时间间隔：' + value + '小时'" :value="value">
                  </el-option>
                </el-select>
              </div>
              <div id="visitor" style="width: 100%; height: 250px">
              </div>
            </el-card>
          </div>
          <div class="col-md-6 col-sm-12 m-b-md">
            <el-card class="w-full">
              <div slot="header" class="clearfix">
                <span>CPU使用率(%)</span>
              </div>
              <div id="cpuUtilization" style="width: 100%; height: 250px">
              </div>
            </el-card>
          </div>
          <div class="col-md-8 col-sm-12 m-b-md">
            <el-card class="w-full">
              <div slot="header" class="clearfix">
                <span>公网带宽(bit/s)</span>
              </div>
              <div id="internetRate" style="width: 100%; height: 500px">
              </div>
            </el-card>
          </div>
          <div class="col-md-4 col-sm-12 m-b-md">
            <el-card class="w-full">
              <div slot="header" class="clearfix">
                <span>阅读TOP10</span>
              </div>
              <div style="width: 100%; height: 500px">
                <ul class="list-group m-b-none no-border">
                  <li class="list-group-item no-border no-padder m-b-sm" v-for="(item,index) in readRank" :key="index">
                    <span class="pull-right font-thin text-muted inline">{{item.visit_number}}</span>
                    <a :href="'/details/' + item.id" :title="item.title" target="_blank" class="reading-rank">{{index+1}}.{{item.title}}</a>
                  </li>
                </ul>
              </div>
            </el-card>
          </div>
          <div class="col-md-6 col-sm-12 m-b-md">
            <el-card class="w-full">
              <div slot="header" class="clearfix">
                <span>磁盘使用量(GB)</span>
              </div>
              <div id="diskusageInfo" style="width: 100%; height: 250px">
              </div>
            </el-card>
          </div>
          <div class="col-md-6 col-sm-12 m-b-md">
            <el-card class="w-full">
              <div slot="header" class="clearfix">
                <span>内存使用率(%)</span>
              </div>
              <div id="memoryUsedutilization" style="width: 100%; height: 250px">
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import {
  mapGetters
} from "vuex";
import moment from 'moment';
export default {
  computed: {
    ...mapGetters({
      user: "admin/getUser"
    })
  },
  data() {
    return {
      // 访客统计
      visitor: {
        tooltip: {
          show: true,
          formatter: '{b}点<br>访客人数：{c}'
        },
        xAxis: {
          axisLabel: {
            interval: 0
          },
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        grid: {
          left: '5%',
          right: '5%',
          top: 20,
          bottom: 20
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true,
          symbolSize: 6,
          itemStyle: {
            color: '#314058'
          }
        }]
      },
      // cpu使用率
      cpuUtilization: {
        tooltip: {
          show: true,
          formatter: '{b}<br>CPU使用率(%)：{c}'
        },
        grid: {
          left: 40,
          right: '5%',
          top: 20,
          bottom: 20
        },
        xAxis: {
          axisLabel: {
            interval: (index, value) => {
              return parseInt((value || '')
                .split(':')[1]) % 15 == 0
            }
          },
          type: 'category',
          data: [],
          axisPointer: {
            show: true
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter(value, index) {
              return value + "%";
            }
          }
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#314058'
          }
        }]
      },
      // 公网带宽
      internetRate: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          },
          formatter: '{b}<br>公网流出带宽：{c0} kb/s<br>公网流入带宽：{c1} kb/s'
        },
        legend: {
          data: ['公网流出带宽', '公网流入带宽'],
          x: 'right'
        },
        axisPointer: {
          link: {
            xAxisIndex: 'all'
          }
        },
        grid: [{
          left: 70,
          right: 20,
          height: '35%'
        }, {
          left: 70,
          right: 20,
          top: '58%',
          height: '35%'
        }],
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              onZero: true
            },
            data: []
          },
          {
            gridIndex: 1,
            type: 'category',
            boundaryGap: false,
            axisLine: {
              onZero: true
            },
            data: [],
            position: 'top'
          }
        ],
        yAxis: [{
            name: '公网流入带宽(bits/s)',
            type: 'value',
            axisLabel: {
              formatter(value, index) {
                return value + "kb";
              }
            }
          },
          {
            gridIndex: 1,
            name: '公网流出带宽(bits/s)',
            type: 'value',
            inverse: true,
            axisLabel: {
              formatter(value, index) {
                return value + "kb";
              }
            }
          }
        ],
        series: [{
            name: '公网流出带宽',
            type: 'line',
            symbolSize: 8,
            smooth: true,
            hoverAnimation: false,
            data: []
          },
          {
            name: '公网流入带宽',
            type: 'line',
            smooth: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            symbolSize: 8,
            hoverAnimation: false,
            data: []
          }
        ]
      },
      // 磁盘使用量
      diskusageInfo: {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br>磁盘的已用存储空间：{c0} GB<br>磁盘的剩余存储空间：{c1} GB',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['磁盘的已用存储空间', '磁盘的剩余存储空间'],
          x: 'right'
        },
        grid: {
          left: 10,
          right: '5%',
          top: 50,
          bottom: 5,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name: '磁盘总量(GB)',
          type: 'value',
          axisLabel: {
            formatter(value, index) {
              return value + "GB";
            }
          }
        },
        series: [{
            name: '磁盘的已用存储空间',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {
                color: '#F7887F',
                opacity: 0.5
              }
            },
            lineStyle: {
              normal: {
                color: 'transparent'
              }
            },
            showSymbol: false,
            smooth: true,
            data: []
          },
          {
            name: '磁盘的剩余存储空间',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {
                color: '#70D6AE',
                opacity: 0.5
              }
            },
            lineStyle: {
              normal: {
                color: 'transparent'
              }
            },
            showSymbol: false,
            smooth: true,
            data: []
          }
        ]
      },
      // 内存使用率
      memoryUsedutilization: {
        tooltip: {
          show: true,
          formatter: '{b}<br>内存使用率(%)：{c}'
        },
        grid: {
          left: 40,
          right: '5%',
          top: 20,
          bottom: 20
        },
        xAxis: {
          axisLabel: {
            interval: (index, value) => {
              return parseInt((value || '')
                .split(':')[1]) % 15 == 0
            }
          },
          type: 'category',
          data: [],
          axisPointer: {
            show: true
          }
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLabel: {
            formatter(value, index) {
              return value + "%";
            }
          }
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#314058'
          }
        }]
      },
      // 阅读排行
      readRank: [],
      selection: [1, 2, 3, 4],
      value: 2,
      visit_today: 0
    }
  },
  methods: {
    // 获取访客统计
    initVisitor(val = 2) {
      const myChart = echarts.init(document.getElementById('visitor'));
      myChart.showLoading();
      this.$http.get(`/api/visitor/get_visitor_today/${val}`).then(d => {
        if (d.data.success) {
          const result = d.data.result;
          const xData = [],
            sData = [];
          this.visit_today = 0;
          for (let i in result) {
            xData.push(i);
            sData.push(result[i]);
            this.visit_today += result[i];
          }
          // debugger;
          this.visitor.xAxis['data'] = xData;
          this.visitor.series[0]['data'] = sData;
          myChart.setOption(this.visitor);
          myChart.hideLoading();
        }
      })
    },
    // 获取cpu使用率
    initCpuUtilization() {
      const myChart = echarts.init(document.getElementById('cpuUtilization'));
      myChart.showLoading();
      this.$http.get('/api/ecs/get_cpu_utilization').then(d => {
        if (d.data.success) {
          const result = d.data.result;
          const data = result.datapoints;
          const seriesData = data.map(k => {
            return k.Average
          })
          const xAxisData = data.map(k => {
            return moment(k.timestamp)
              .format('HH:mm:ss')
          });
          this.cpuUtilization.xAxis['data'] = xAxisData;
          this.cpuUtilization.series[0]['data'] = seriesData;
          myChart.setOption(this.cpuUtilization);
          myChart.hideLoading();
        }
      })
    },
    // 获取公网带宽
    initInternetRate() {
      const myChart = echarts.init(document.getElementById('internetRate'));
      myChart.showLoading();
      this.$http.get('/api/ecs/get_internet_rate').then(d => {
        if (d.data.success) {
          const result = d.data.result;
          const {
            InternetInRate,
            InternetOutRate
          } = result;
          this.internetRate.xAxis[0]['data'] = InternetInRate.datapoints.map(k => moment(k.timestamp).format('HH:mm:ss'));
          this.internetRate.xAxis[1]['data'] = InternetOutRate.datapoints.map(k => moment(k.timestamp).format('HH:mm:ss'));
          this.internetRate.series[0]['data'] = InternetOutRate.datapoints.map(k => (k.Average / 8 / 1000).toFixed(2));
          this.internetRate.series[1]['data'] = InternetInRate.datapoints.map(k => (k.Average / 8 / 1000).toFixed(2));
          myChart.setOption(this.internetRate);
          myChart.hideLoading();
        }
      })
    },
    // 获取磁盘使用量
    intiDiskusageInfo() {
      const myChart = echarts.init(document.getElementById('diskusageInfo'));
      myChart.showLoading();
      this.$http.get('/api/ecs/get_diskusage_info').then(d => {
        if (d.data.success) {
          const result = d.data.result;
          const {
            diskusage_free,
            diskusage_used,
            diskusage_total
          } = result;
          this.diskusageInfo.yAxis.max = (diskusage_total.datapoints[0].Average / 1024 / 1024 / 1024).toFixed(2);
          this.diskusageInfo.xAxis.data = diskusage_total.datapoints.map(k => moment(k.timestamp).format('HH:mm:ss'));
          this.diskusageInfo.series[0]['data'] = diskusage_used.datapoints.map(k => (k.Average / 1024 / 1024 / 1024).toFixed(2));
          this.diskusageInfo.series[1]['data'] = diskusage_free.datapoints.map(k => (k.Average / 1024 / 1024 / 1024).toFixed(2));
          myChart.setOption(this.diskusageInfo);
          myChart.hideLoading();
        }
      })

    },
    // 获取内存使用率
    initMemoryUsedutilization() {
      const myChart = echarts.init(document.getElementById('memoryUsedutilization'));
      myChart.showLoading();
      this.$http.get('/api/ecs/get_memory_usedutilization').then(d => {
        if (d.data.success) {
          const result = d.data.result;
          const data = result.datapoints;
          const seriesData = data.map(k => {
            return k.Average
          })
          const xAxisData = data.map(k => {
            return moment(k.timestamp)
              .format('HH:mm:ss')
          });
          this.memoryUsedutilization.xAxis['data'] = xAxisData;
          this.memoryUsedutilization.series[0]['data'] = seriesData;
          myChart.setOption(this.memoryUsedutilization);
          myChart.hideLoading();
        }
      })
    },
    // 获取阅读排行
    getReadRank() {
      this.$http.get('/api/article/get_read_rank').then(d => {
        if (d.data.success) {
          this.readRank = d.data.result;
        }
      })
    }
  },
  mounted() {
    this.initVisitor();
    this.initCpuUtilization();
    this.initInternetRate();
    this.getReadRank();
    this.intiDiskusageInfo();
    this.initMemoryUsedutilization();
  },
  head() {
    return {
      title: "首页 - " + this.user.blog_name
    };
  }
};

</script>
