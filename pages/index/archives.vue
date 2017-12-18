<template>
  <section class="row padder">
    <article class="col-xs-12 padder-v" v-if="article_list.length">
        <p class="article-title h2">归档</p>
        <div class="entry-content m-t-md">
            <article class="list-group archives_list" v-for="(vo, key) in article_list" :key="key">
                <p class="h4 font-bold month_time">
                    <time :datetime="vo.archives_time">{{ vo.archives_time }}</time>({{ vo.aaData.length }})</p>
                <ul class="padder-lg padder-v  m-l-md">
                    <li v-for="(data, k) in vo.aaData" :key="k">
                        <nuxt-link :to="{ name: 'index-details-id', params: { id: data.id }}" :title="data.title">{{ data.title }}</nuxt-link>
                        <span class="date m-l-sm hidden-xs">{{ data.create_time }}</span>
                    </li>
                </ul>
            </article>
        </div>
    </article>
  </section>
</template>
<script>
export default {
  data() {
    return {
      article_list: [
        {
          archives_time: "2017年11月",
          aaData: [
            {
              id: 47,
              title: "gitlab/github 多账户下设置 ssh keys",
              create_time: " 2017-11-08"
            },
            {
              id: 46,
              title: "websocket配合小程序实现扫码登录",
              create_time: " 2017-11-05"
            },
            {
              id: 44,
              title: "nginx配置websocket的wss   ",
              create_time: " 2017-11-02"
            },
            { id: 45, title: "小程序 - bing每日一图", create_time: " 2017-11-02" },
            {
              id: 43,
              title: "NodeJS+ws模块实现websocket通讯",
              create_time: " 2017-11-01"
            }
          ]
        },
        {
          archives_time: "2017年10月",
          aaData: [
            { id: 42, title: "CentOS7 下pm2开机自启动", create_time: " 2017-10-29" },
            {
              id: 40,
              title: "树莓派Raspberry Pi 3 安装图形化工具VNCserver",
              create_time: " 2017-10-10"
            },
            {
              id: 38,
              title: "树莓派Raspberry Pi 3 安装NodeJS",
              create_time: " 2017-10-05"
            },
            {
              id: 39,
              title: "树莓派Raspberry Pi 3 安装nginx服务",
              create_time: " 2017-10-05"
            },
            {
              id: 37,
              title: "树莓派Raspberry Pi 3 安装CentOS7",
              create_time: " 2017-10-04"
            }
          ]
        },
        { archives_time: "2017年09月", aaData: [] },
        {
          archives_time: "2017年08月",
          aaData: [
            {
              id: 35,
              title: "Spring Boot 和 webpack dev server 联合开发",
              create_time: " 2017-08-29"
            },
            { id: 34, title: "【转】JS实现SVG图形转存为图片下载", create_time: " 2017-08-28" }
          ]
        },
        {
          archives_time: "2017年07月",
          aaData: [
            { id: 33, title: "CentOS7 配置密钥免密码登录", create_time: " 2017-07-13" },
            {
              id: 32,
              title: "CentOS7 安装测速工具speedtest",
              create_time: " 2017-07-10"
            },
            {
              id: 31,
              title: "CentOS7 yum安装php5.6",
              create_time: " 2017-07-09"
            },
            {
              id: 30,
              title: "【转】Javascript 中的神器——Promise",
              create_time: " 2017-07-08"
            },
            {
              id: 29,
              title: "CentOS7 yum安装mysql5.6",
              create_time: " 2017-07-07"
            }
          ]
        },
        {
          archives_time: "2017年06月",
          aaData: [
            {
              id: 24,
              title: "CentOS7 安装并配置使用vsftpd",
              create_time: " 2017-06-09"
            },
            {
              id: 25,
              title: "CentOS7 使用无线WiFi连接并设置为开机启动",
              create_time: " 2017-06-09"
            },
            {
              id: 26,
              title: "CentOS7 一键增加删除防火墙端口",
              create_time: " 2017-06-09"
            },
            {
              id: 27,
              title: "CentOS7 电源管理关闭笔记本合盖睡眠待机",
              create_time: " 2017-06-09"
            },
            { id: 23, title: "【译】是什么使一名好程序员变得伟大", create_time: " 2017-06-05" },
            {
              id: 18,
              title: "【转载】为什么 [ ] 是 false 而 !![ ] 是 true",
              create_time: " 2017-06-03"
            },
            {
              id: 19,
              title: "【译】征服 JavaScript 面试：什么是闭包？",
              create_time: " 2017-06-03"
            }
          ]
        }
      ]
    };
  },
  head() {
    return {
      title: "归档"
    };
  }
};
</script>
