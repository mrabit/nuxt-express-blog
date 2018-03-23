<template>
  <div>
    <headerComponent v-if="!login"></headerComponent>
    <side v-if="!login"></side>
    <nuxt-child></nuxt-child>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import side from "~/components/admin/side.vue";
import headerComponent from "~/components/admin/header.vue";
export default {
  fetch({
    store,
    params
  }) {
    return axios.get("/user/profile").then(res => {
      res.data.result.blog_name += "的博客";
      store.commit("admin/changeUser", res.data.result);
    });
  },
  components: {
    side,
    headerComponent
  },
  computed: {
    login() {
      var reg = /\/admin\/login*/;
      // 是否是后台登录页面
      return reg.test(this.$route.path);
    }
  }
};

</script>
</script>
