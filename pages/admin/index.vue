<template>
  <section class="app-content">
    <div class="app-content-body">
      <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-n font-thin h3">总览</h1>
      </div>
      <div class="wrapper clearfix m-b-md">
        <div class="row">
          <div class="col-md-6 col-sm-12">
            <div class="panel wrapper">
              <el-select size="mini" @change="initVisitor" class="pull-right" v-model="value" placeholder="请选择">
                <el-option v-for="value in selection" :key="value" :label="'时间间隔：' + value + '小时'" :value="value">
                </el-option>
              </el-select>
              <h4 class="font-thin m-t-none m-b text-muted">今日访客{{visit_today?`(${visit_today})`:''}}</h4>
              <div id="visitor" style="width: 100%; height: 350px">
              </div>
            </div>
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
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
export default {
  // mounted() {
  //   this.$http.post('/api/check_token');
  // },
  computed: {
    ...mapGetters({
      user: "admin/getUser"
    })
  },
  data() {
    return {
      option: {
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
          this.option.xAxis['data'] = xData;
          this.option.series[0]['data'] = sData;
          myChart.setOption(this.option);
          myChart.hideLoading();
        }
      })
    }
  },
  mounted() {
    this.initVisitor();
  },
  head() {
    return {
      title: "首页 - " + this.user.blog_name
    };
  }
};

</script>
