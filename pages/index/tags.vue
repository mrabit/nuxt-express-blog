<style>
.tags_group .tags {
  border: 1px solid rgba(36, 121, 204, 0.8);
  color: rgba(36, 121, 204, 0.8);
  padding: 0 30px;
  line-height: 40px;
  font-weight: normal;
  position: relative;
}

.tags_group .tags:hover {
  /*font-weight:bold;*/
  border-color: #2479cc;
  color: #2479cc;
}

.tags_group .tags:hover i {
  display: block !important;
  position: absolute;
  right: 2px;
  top: 2px;
}
</style>

<template>
    <section class="row padder">
        <loading :show="loading"></loading>
        <article class="col-xs-12 padder-v">
            <p class="article-title h2">标签</p>
            <div class="entry-content m-t-md">
                <div class="tags_group">
                    <a v-for="(vo, key) in tags_arr" :key="key" class="label inline m-t-sm tags m-r-sm " 
                    :href="'/details/1?tags_id=' + vo.id">
                        {{ vo.tags_name }}（{{ vo.counts }}）
                    </a>
                </div>
                <div class="text-left padder" v-if="!tags_arr.length" style="min-height: 20vh">
                    暂无数据
                </div>
            </div>
        </article>
    </section>
</template>
<script>
import axios from "~/plugins/axios";
import loading from "~/components/loading.vue";
export default {
  asyncData({ error }) {
    return axios
      .get("/article_tags")
      .then(d => {
        return {
          tags_arr: d.data.result
        };
      })
      .catch(e => {
        error({ statusCode: 500, message: e.message });
      });
  },
  components: {
    loading
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["index/getUser"];
    }
  },
  mounted() {
    // setTimeout(_ => {
    //   this.loading = false;
    // }, 500);
  },
  head() {
    return {
      title: "标签 - " + this.user.blog_name
    };
  }
};
</script>
