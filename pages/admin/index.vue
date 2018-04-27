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
          type: 'value'
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
      cpuUtilization: {
        tooltip: {
          show: true,
          formatter: '{b}<br>CPU使用率(%)：{c}'
        },
        grid: {
          left: '5%',
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
          max: 10
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
      internetRate: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        legend: {
          data: ['公网流入带宽', '公网流出带宽'],
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
                return value / 1000 + "k";
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
                return value / 1000 + "k";
              }
            }
          }
        ],
        series: [{
            name: '公网流入带宽',
            type: 'line',
            symbolSize: 8,
            smooth: true,
            hoverAnimation: false,
            data: []
          },
          {
            name: '公网流出带宽',
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
      readRank: [],
      selection: [1, 2, 3, 4],
      value: 2,
      visit_today: 0
    }
  },
  methods: {
    initVisitor(val = 2) {
      let myChart = echarts.init(document.getElementById('visitor'));
      myChart.showLoading();
      this.$http.get(`/api/visitor/get_visitor_today/${val}`).then(d => {
        if (d.data.success) {
          let result = d.data.result;
          let xData = [],
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
    initCpuUtilization() {
      let myChart = echarts.init(document.getElementById('cpuUtilization'));
      myChart.showLoading();
      this.$http.get('/api/ecs/get_cpu_utilization').then(d => {
        if (d.data.success) {
          let result = d.data.result;
          var data = result.datapoints;
          var seriesData = data.map(k => {
            return k.Average
          })
          var xAxisData = data.map(k => {
            return moment(k.timestamp)
              .format('HH:mm:ss')
          });
          let yAxisMax = Math.floor(seriesData.reduce((p, next) => p + next, 0) / seriesData.length * 2);
          this.cpuUtilization.xAxis['data'] = xAxisData;
          this.cpuUtilization.yAxis['max'] = yAxisMax;
          this.cpuUtilization.series[0]['data'] = seriesData;
          myChart.setOption(this.cpuUtilization);
          myChart.hideLoading();
        }
      })
    },
    initInternetRate() {
      let myChart = echarts.init(document.getElementById('internetRate'));
      myChart.showLoading();
      this.$http.get('/api/ecs/get_internet_rate').then(d => {
        if (d.data.success) {
          let result = d.data.result;
          let {
            InternetInRate,
            InternetOutRate
          } = result;
          this.internetRate.xAxis[0]['data'] = InternetInRate.datapoints.map(k => moment(k.timestamp).format('HH:mm:ss'));
          this.internetRate.xAxis[1]['data'] = InternetOutRate.datapoints.map(k => moment(k.timestamp).format('HH:mm:ss'));
          this.internetRate.series[0]['data'] = InternetInRate.datapoints.map(k => k.Average.toFixed(2));
          this.internetRate.series[1]['data'] = InternetOutRate.datapoints.map(k => k.Average.toFixed(2));
          myChart.setOption(this.internetRate);
          myChart.hideLoading();
        }
      })
    },
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
  },
  head() {
    return {
      title: "首页 - " + this.user.blog_name
    };
  }
};

</script>
