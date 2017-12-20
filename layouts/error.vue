<template>
    <div class="container">
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
    </div>
</template>
<script>
export default {
  props: ["error"],
  head() {
    return {
      title: this.error.statusCode + " - " + this.error.message
    };
  }
};
</script>
