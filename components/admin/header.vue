<style scoped>
.verticalCenter {
  min-height: 50px;
}

</style>
<template>
  <header id="header" class="app-header navbar" role="menu">
    <!-- navbar header -->
    <div class="navbar-header bg-dark">
      <button class="pull-right visible-xs dk" ui-toggle-class="show" target=".navbar-collapse">
        <i class="glyphicon glyphicon-cog"></i>
      </button>
      <button @click="changeIsCollapse" class="pull-right visible-xs" ui-toggle-class="off-screen" target=".app-aside" ui-scroll="app">
        <i class="glyphicon glyphicon-align-justify"></i>
      </button>
      <!-- brand -->
      <nuxt-link to="/admin" class="navbar-brand text-lt">
        <i class="fa fa-btc"></i>
        <span class="hidden-folded m-l-xs">{{user.blog_name}}</span>
      </nuxt-link>
      <!-- / brand -->
    </div>
    <!-- / navbar header -->
    <!-- navbar collapse -->
    <div class="collapse pos-rlt navbar-collapse box-shadow bg-white-only">
      <!-- buttons -->
      <div class="nav navbar-nav hidden-xs">
        <div @click="changeIsCollapse" class="btn no-shadow navbar-btn">
          <i class="fa fa-dedent fa-fw text"></i>
          <i class="fa fa-indent fa-fw text-active"></i>
        </div>
      </div>
      <!-- / buttons -->
      <!-- link and dropdown -->
      <el-dropdown class="nav navbar-nav hidden-xs w-xxs text-center" @command="routerPush" placement="bottom-end" style="line-height: 50px">
        <span class="el-dropdown-link verticalCenter">
                <span class="hidden-sm hidden-md">New</span>
        <b class="caret"></b>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/admin/articleAdd">新文章</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- / link and dropdown -->
      <!-- search form -->
      <form class="navbar-form navbar-form-sm navbar-left shift" ui-shift="prependTo" data-target=".navbar-collapse" role="search">
        <div class="form-group">
          <div class="input-group">
            <input type="text" class="form-control input-sm bg-light no-border rounded padder" placeholder="Search projects...">
            <span class="input-group-btn">
                <button type="submit" class="btn btn-sm bg-light rounded">
                    <i class="fa fa-search"></i>
                </button>
            </span>
          </div>
        </div>
      </form>
      <!-- / search form -->
      <!-- nabar right -->
      <div class="nav navbar-nav navbar-right padder text-center verticalCenter" style="height:50px;" v-if="!tokenAuth">
        <i class="fa fa-spin fa-spinner"></i>
      </div>
      <el-dropdown class="nav navbar-nav navbar-right padder" v-show="tokenAuth" @command="logout" placement="top">
        <span class="el-dropdown-link verticalCenter">
          <span class="hidden-sm hidden-md">{{user.uname}}</span>
        <b class="caret m-r-sm"></b>
        <span class="thumb-sm avatar">
              <img :src="user.user_header_img" alt="...">
              <i class="on md b-white bottom"></i>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- / navbar right -->
    </div>
    <!-- / navbar collapse -->
  </header>
</template>
<script>
import webStorageCache from "web-storage-cache";
import {
  mapGetters
} from "vuex";
export default {
  data() {
    return {
      wsCache: null
    };
  },
  computed: {
    ...mapGetters({
      user: "admin/getUser",
      tokenAuth: "admin/getTokenAuth"
    })
  },
  methods: {
    changeIsCollapse() {
      this.$store.commit("admin/changeIsCollapse");
    },
    logout() {
      this.$http
        .post("/api/logout", {
          key: this.user.uname
        })
        .then(
          result => {
            this.wsCache.delete("token");
            // this.$store.commit("admin/changeUser", {});
            // window.location.href = "/admin/login";
            this.$router.push('/admin/login');
          },
          err => {
            console.log(err);
          }
        );
    },
    routerPush(url) {
      this.$router.push(url);
    }
  },
  mounted() {
    this.wsCache = new webStorageCache();
  }
};

</script>
