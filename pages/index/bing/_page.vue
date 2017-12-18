<style>
#view > article.col-xs-12:nth-child(1) {
  margin-top: 0 !important;
}
</style>
<template>
    <section class="row padder">
      <article class="col-xs-12 padder-v m-b-n-md">
          <p class="article-title h2">Bing每日一图</p>
          <div class="entry-content m-t-md">
              <section class="bing_main">
                  <div class="bing_article" @click="open_url(format_img_url(item.img_url))" :data-description="item.img_time" v-for="(item, index) in img_lists" :key="index"
                      :data-title="item.img_title">
                      <img :src="format_img_url(item.img_url) + '-preview.50p'"
                          :title="item.img_title"
                          :alt="item.img_title">
                  </div>
              </section>
              <nav class="padder text-center paging m-t-md">
                  <nuxt-link name="prev" :class="{ invisible: this.currentPage <= 1 }" 
                    :to="{ name: 'index-bing-page', params: { page: this.currentPage - 1} }" class="pull-left">« 上一页</nuxt-link>
                  <nuxt-link name="next" :class="{ invisible: this.currentPage >= this.totalPage }" 
                    :to="{ name: 'index-bing-page', params: { page: this.currentPage + 1} }" class="pull-right">下一页 »</nuxt-link>
                  <span class="w-sm text-center">
                      <a href="/bing" target="_blank">今日美图</a>
                  </span>
              </nav>
          </div>
      </article>
      <div class="text-left padder" v-if="haveNotImage" style="min-height: 15vh">
          暂无数据
      </div>
  </section>
</template>
<script>
// /bing/get_img_lists/1/10
export default {
  data() {
    return {
      img_lists: [
        {
          id: 448,
          img_url: "http://cdn.mrabit.com/1920.2017-12-15.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-15.jpg",
          img_time: "2017-12-15",
          img_title: "塞舌尔群岛附近软珊瑚树中的一颗薄荷海星，塞舌尔 (© Norbert Wu/Minden Pictures)"
        },
        {
          id: 447,
          img_url: "http://cdn.mrabit.com/1920.2017-12-14.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-14.jpg",
          img_time: "2017-12-14",
          img_title: "冥王星的北极 (© J Marshall/Alamy)"
        },
        {
          id: 446,
          img_url: "http://cdn.mrabit.com/1920.2017-12-13.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-13.jpg",
          img_time: "2017-12-13",
          img_title: "弗罗伊登贝格镇，德国 (© Iain Masterton/age fotostock)"
        },
        {
          id: 445,
          img_url: "http://cdn.mrabit.com/1920.2017-12-12.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-12.jpg",
          img_time: "2017-12-12",
          img_title:
            "圣诞市场上出售的地精，意大利佩尔吉内瓦尔苏加纳 (© Flavia Morlachetti/Moment/Getty Images)"
        },
        {
          id: 444,
          img_url: "http://cdn.mrabit.com/1920.2017-12-11.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-11.jpg",
          img_time: "2017-12-11",
          img_title: "卓木拉日峰上的古老宗堡，不丹 (© Alex Treadway/plainpicture)"
        },
        {
          id: 443,
          img_url: "http://cdn.mrabit.com/1920.2017-12-10.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-10.jpg",
          img_time: "2017-12-10",
          img_title: "普托拉纳高原上的北噪鸦，俄罗斯西伯利亚 (© Sergey Gorshkov/Minden Pictures)"
        },
        {
          id: 442,
          img_url: "http://cdn.mrabit.com/1920.2017-12-09.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-09.jpg",
          img_time: "2017-12-09",
          img_title: "老桥，意大利佛罗伦萨 (© Michele Castellani/Alamy)"
        },
        {
          id: 441,
          img_url: "http://cdn.mrabit.com/1920.2017-12-08.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-08.jpg",
          img_time: "2017-12-08",
          img_title: "西贝柳斯纪念碑，芬兰赫尔辛基 (© Ville Heino/500px)"
        },
        {
          id: 440,
          img_url: "http://cdn.mrabit.com/1920.2017-12-07.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-07.jpg",
          img_time: "2017-12-07",
          img_title:
            "【今日大雪】暴风雪中两只在树干上攀爬的大熊猫，中国四川 (© Juan Carlos Munoz/NPL/Minden Pictures)"
        },
        {
          id: 439,
          img_url: "http://cdn.mrabit.com/1920.2017-12-06.jpg",
          img_url_480: "http://cdn.mrabit.com/480.2017-12-06.jpg",
          img_time: "2017-12-06",
          img_title: "南极洲的马图谢维奇冰川 (© NASA)"
        }
      ],
      pageSize: 10,
      totalPage: 45,
      haveNotImage: false
    };
  },
  computed: {
    currentPage() {
      return parseInt(this.$route.params.page || 1);
    }
  },
  methods: {
    open_url(url) {
      var a = document.createElement("a");
      a.href = url;
      a.setAttribute("target", "_blank");
      a.click();
    },
    format_img_url(url) {
      return url.replace("http:", "");
    }
  },
  head() {
    return {
      title: "bing每日一图"
    };
  }
};
</script>