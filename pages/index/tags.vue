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
        <loading :show="!tags_arr.length"></loading>
        <article class="col-xs-12 padder-v" v-if="tags_arr.length">
            <p class="article-title h2">标签</p>
            <div class="entry-content m-t-md">
                <div class="tags_group">
                    <nuxt-link v-for="(vo, key) in tags_arr" :key="key" class="label inline m-t-sm tags m-r-sm " 
                    :to="{ name: 'index-list-page', params: { page: 1 }, query: { tags_id: vo.id }}">
                        {{ vo.tags_name }}（{{ vo.counts }}）
                    </nuxt-link>
                </div>
            </div>
        </article>
    </section>
</template>
<script>
export default {
  data() {
    return {
      tags_arr: [
        { id: 20, tags_name: "Linux", counts: 13 },
        { id: 16, tags_name: "JavaScript", counts: 8 },
        { id: 17, tags_name: "转载", counts: 5 },
        { id: 24, tags_name: "Raspberry", counts: 4 },
        { id: 25, tags_name: "NodeJS", counts: 4 },
        { id: 27, tags_name: "微信小程序", counts: 1 },
        { id: 28, tags_name: "github", counts: 1 },
        { id: 21, tags_name: "mysql", counts: 1 },
        { id: 22, tags_name: "PHP", counts: 1 },
        { id: 23, tags_name: "webpack", counts: 1 },
        { id: 26, tags_name: "随笔", counts: 1 }
      ]
    };
  },
  head() {
    return {
      title: "标签"
    };
  }
};
</script>
