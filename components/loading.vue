<style scoped>
.m-h {
  min-height: 100hv;
}
</style>

<template>
    <div class="padder m-t-xl" id="loading" style="min-height: 100vh" v-if="show">
        <div class="col-md-12 text-center">
            <i class="fa fa-spin fa-spinner fa-2x"></i>
            <div class="clear m-t-xs">
                <span class="text-xs">页面正在加载，请稍候...</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    show: Boolean
  }
};
</script>
