<template>
    <div>
        <headerComponent v-if="!login"></headerComponent>
        <side v-if="!login"></side>
        <nuxt-child></nuxt-child>
    </div>
</template>
<script>
import side from "~/components/admin/side.vue";
import headerComponent from "~/components/admin/header.vue";
export default {
  components: {
    side,
    headerComponent
  },
  computed: {
    login() {
      var reg = /\/admin\/login*/;
      // 是否是后台路径
      return reg.test(this.$route.path);
    }
  }
};
</script>
</script>