<template>
  <section class="app-content">
    <div class="app-content-body">
      <loading :show="loading"></loading>
      <div v-show="!loading">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">添加观影记录</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <movie-edit :loading="loading" :movie="movie"></movie-edit>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import movieEdit from '~/components/admin/movie_edit.vue';
import {
  mapGetters
} from "vuex";
export default {
  components: {
    movieEdit
  },
  data() {
    return {
      movie: {
        movie_name: "",
        movie_img: [],
        movie_url: "",
        watch_time: +new Date()
      },
      loading: true
    };
  },
  computed: {
    ...mapGetters({
      user: "admin/getUser"
    })
  },
  mounted() {
    this.loading = false;
  },
  head() {
    let config = {
      title: "添加观影记录 - " + this.user.blog_name
    };
    return config;
  }
};

</script>
<style>
.el-upload__input {
  display: none !important;
}

</style>
