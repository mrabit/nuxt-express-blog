<style>
.bg-dark {
  background-color: #324157;
}

.app-aside-folded .el-menu--collapse {
  width: 60px;
}

</style>
<template>
  <div class="app-aside hidden-xs bg-dark" :class="{'off-screen': offScreen}">
    <div class="clearfix hidden-xs text-center hide show" id="aside-user">
      <div class="dropdown wrapper" v-show="tokenAuth">
        <div>
          <span class="thumb-lg w-auto-folded avatar m-t-sm">
              <img :src="user.user_header_img" class="img-full" alt="...">
          </span>
        </div>
        <div class="hidden-folded clearfix">
          <span class="clear">
            <span class="block m-t-sm">
                <strong class="font-bold text-lt">{{user.uname}}</strong>
            </span>
          <span class="text-muted text-xs block">欢迎回来.</span>
          <span class="text-muted text-xs block" v-if="user.last_login_time">上次登录: {{user.last_login_time | format_time}}</span>
          <span class="text-muted text-xs block" v-if="user.last_login_ip">上次登录ip: {{user.last_login_ip}}</span>
          </span>
          <div class="quick-stats">
            <ul class="no-padder">
              <li class="inline">
                <span>{{article_count}}
                    <i>今日文章</i>
                </span>
              </li>
              <li class="inline">
                <span>{{visitor.visit_today || 0}}
                    <i>今日访客</i>
                </span>
              </li>
              <li class="inline">
                <span>{{visitor.visit_all || 0}}
                    <i>历史访客</i>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="verticalCenter" style="height:290px;" v-if="!tokenAuth">
        <div><i class="fa fa-spin fa-spinner"></i>
          <span class="block">数据加载中...</span></div>
      </div>
      <div class="line dk hidden-folded"></div>
    </div>
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @select="select_menu" :collapse="isCollapse" :unique-opened="true" :router="true" background-color="#324157" text-color="#a6a8b1" active-text-color="#20a0ff">
      <el-menu-item index="/admin">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2" class="bg-dark">
        <template slot="title">
          <i class="el-icon-message"></i>
          <span slot="title">文章管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/articleList">文章列表</el-menu-item>
          <el-menu-item index="/admin/articleAdd">发布文章</el-menu-item>
          <el-menu-item index="/admin/articleEdit">修改文章</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3" class="bg-dark">
        <template slot="title">
          <i class="el-icon-message"></i>
          <span slot="title">标签管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/articleTags">标签展示</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4" class="bg-dark">
        <template slot="title">
          <i class="el-icon-message"></i>
          <span slot="title">友链管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/links">友链配置</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5" class="bg-dark">
        <template slot="title">
          <i class="el-icon-message"></i>
          <span slot="title">用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/profile">修改资料</el-menu-item>
          <el-menu-item index="/admin/wxAuth">微信权限</el-menu-item>
          <el-menu-item index="/admin/editAbout">修改关于</el-menu-item>
          <el-menu-item index="/admin/passwd">修改密码</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import moment from "moment";
import {
  mapGetters
} from "vuex";
var WebStorageCache = require("web-storage-cache");
var config = require("../../server/config");

export default {
  data() {
    return {
      offScreen: false,
      wsCache: null,
      visitor: {},
      article_count: 0
    };
  },
  filters: {
    format_time(time) {
      return moment(time * 1000).format("YYYY-MM-DD HH:mm");
    }
  },
  computed: {
    ...mapGetters({
      user: "admin/getUser",
      tokenAuth: "admin/getTokenAuth"
    }),
    isCollapse() {
      var boolean = this.$store.getters["admin/getIsCollapse"];
      if (typeof document === "object") {
        var body = document.body;
        if (body.clientWidth <= 768) {
          this.offScreen = boolean;
          return false;
        } else {
          boolean
            ?
            body.classList.add("app-aside-folded") :
            body.classList.remove("app-aside-folded");
        }
      }
      return boolean;
    }
  },
  methods: {
    select_menu(index) {
      var isOpened = document.getElementsByClassName("is-opened")[0];
      if (index.indexOf("-") < 0 && isOpened) {
        var elMenu = isOpened.getElementsByClassName("el-submenu__title")[0];
        elMenu.click();
      }
    }
  },
  mounted() {
    this.$http.all([
        this.$http.get('/api/visitor/get_visitor_count'),
        this.$http.get('/api/article/get_article_count_today')
      ])
      .then(this.$http.spread((visitor, article_count) => {
        this.visitor = visitor.data.result;
        this.article_count = article_count.data.result;
      }));

  }
};

</script>
