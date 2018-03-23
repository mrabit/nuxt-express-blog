<template>
  <div>
    <side></side>
    <section class="content">
      <div class="wrapper">
        <nuxt-child></nuxt-child>
      </div>
    </section>
    <footer-component></footer-component>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import side from "~/components/index/side.vue";
import footerComponent from "~/components/index/footer.vue";
export default {
  fetch({
    store,
    params
  }) {
    return axios.get("/user/profile").then(res => {
      res.data.result.blog_name += "的博客";
      store.commit("index/changeUser", res.data.result);
    });
  },
  components: {
    side,
    footerComponent
  }
};

</script>
