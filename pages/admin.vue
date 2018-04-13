<template>
  <div>
    <headerComponent v-if="!login"></headerComponent>
    <side v-if="!login"></side>
    <nuxt-child></nuxt-child>
    <footerComponent v-if="!login"></footerComponent>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import side from "~/components/admin/side.vue";
import headerComponent from "~/components/admin/header.vue";
import footerComponent from "~/components/admin/footer.vue";
import WebStorageCache from 'web-storage-cache';
export default {
  middleware: "checkAuth",
  fetch({
    store,
    params
  }) {
    return axios.get("/api/user/profile").then(res => {
      res.data.result.blog_name += "的博客";
      store.commit("admin/changeUser", res.data.result);
    });
  },
  components: {
    side,
    headerComponent,
    footerComponent
  },
  computed: {
    login() {
      var reg = /\/admin\/login*/;
      // 是否是后台登录页面
      return reg.test(this.$route.path);
    }
  },
  mounted() {
    //进入页面不为登录页判断token权限
    if (this.$route.path != "/admin/login") {
      this.$http.post('/api/check_token').then(d => {
        this.$store.commit('admin/changeTokenAuth', true);
      });
    }
  }
};

</script>
