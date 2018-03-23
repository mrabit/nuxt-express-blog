<template>
  <footer id="footer" class="inner text-center content">
    <div class="padder clearfix">
      <div class="col-xs-12">
        <p class="padder-v m-b-none" style="line-height: 1.8;border-top: 1px solid #ccc;font-size: .9em;">
          <nuxt-link to="/"> © 2017&nbsp;-&nbsp; {{ user.blog_name }} &nbsp;-&nbsp;</nuxt-link>
          <a target="_blank" rel="nofollow" class="external beian" href="http://www.miitbeian.gov.cn/">蜀ICP备15034839号-1</a>
        </p>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  computed: {
    user() {
      return this.$store.getters["index/getUser"];
    }
  }
};

</script>
