<template>
  <div class="app-content">
    <div class="wrapper">
      首页
    </div>
  </div>
</template>
<script>
import {
  mapGetters
} from "vuex";
export default {
  // mounted() {
  //   this.$http.post('/api/check_token');
  // },
  computed: {
    ...mapGetters({
      user: "admin/getUser"
    })
  },
  head() {
    return {
      title: "首页 - " + this.user.blog_name
    };
  }
};

</script>
