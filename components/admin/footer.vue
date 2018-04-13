<template>
  <footer id="footer" class="app-footer" role="footer">
    <div class="wrapper b-t bg-light">
      <p class="m-b-none">
        <nuxt-link to="/"> © 2017&nbsp;-&nbsp; {{ user.blog_name }} &nbsp;-&nbsp;</nuxt-link>
        <a target="_blank" rel="nofollow" class="external beian" href="http://www.miitbeian.gov.cn/">蜀ICP备15034839号-1</a>
      </p>
    </div>
  </footer>
</template>
<script>
export default {
  computed: {
    user() {
      return this.$store.getters["admin/getUser"];
    }
  }
};

</script>
