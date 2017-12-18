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
import side from "~/components/index/side.vue";
import footerComponent from "~/components/index/footer.vue";
export default {
  components: {
    side,
    footerComponent
  }
};
</script>
