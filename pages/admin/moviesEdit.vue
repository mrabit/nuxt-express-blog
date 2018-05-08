<template>
  <section class="app-content">
    <div class="app-content-body">
      <loading :show="loading"></loading>
      <div v-show="!loading">
        <div class="bg-light lter b-b wrapper-md">
          <h1 class="m-n font-thin h3">修改观影记录</h1>
        </div>
        <div class="wrapper clearfix m-b-md">
          <movie-edit :loading="loading" :movie="movie" :id="id"></movie-edit>
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
  middleware: "movie_edit",
  components: {
    movieEdit
  },
  data() {
    return {
      movie: {
        watch_time: +new Date()
      },
      id: 0,
      loading: true
    };
  },
  computed: {
    ...mapGetters({
      user: "admin/getUser"
    })
  },
  mounted() {
    this.id = this.$route.query.id;
    this.$http.get('/api/movies/get_details/' + this.id).then(d => {
      const data = d.data;
      const {
        movie_name,
        movie_img,
        watch_time,
        movie_url
      } = data.result;
      this.movie = {
        movie_name,
        movie_url,
        watch_time: watch_time,
        movie_img: !!movie_img ? [{
          name: movie_img.split('/').pop(),
          url: movie_img
        }] : []
      };
      this.loading = false;
    })
  },
  head() {
    let config = {
      title: "编辑观影记录 - " + this.user.blog_name
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
