<template>
    <div>
        <side v-if="!className"></side>
        <section :class="{'content': !className, 'app-content': className}">
            <div class="wrapper">
                <section class="row padder">
                    <article class="padder">
                        <h4>对不起，没有找到这个页面</h4>
                        <p>
                            看来你来到了一个渺无人烟的所在。
                            <a href="javascript:history.back();">回去吧</a>。
                        </p>
                    </article>
                </section>
            </div>
        </section>
        <footer-component v-if="!className"></footer-component>
    </div>
</template>
<script>
import side from "~/components/index/side.vue";
import footerComponent from "~/components/index/footer.vue";
export default {
  props: ["error"],
  components: {
    side,
    footerComponent
  },
  computed: {
    className() {
      var reg = /\/admin\/*/;
      // 是否是后台路径
      return reg.test(this.$route.path);
    }
  },
  head() {
    return {
      title: this.error.statusCode + " - " + this.error.message
    };
  }
};
</script>
