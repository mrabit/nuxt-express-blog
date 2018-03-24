<template>
  <div class="clearfix">
    <nav id="sidebar" class="behavior_1">
      <div class="text-center m-t-lg profile">
        <nuxt-link to="/" class="block">
          <img :src="user.user_header_img" class="thumb-lg avatar image_logo" alt="">
        </nuxt-link>
        <span class="m-t-md block h4 sidebar_title hidden-sm hidden-xs">{{ user.blog_name }}</span>
      </div>
      <ul class="nav_list padder-lg">
        <li class="list-inline m-t-md block" v-for="(item, index) in side_btn" :key="index">
          <nuxt-link class="block" :to="item.href" :title="item.title">
            <i :class="item.icons" @click="removeCLass(!isSide)"></i>
            <span class="text-md visible-md-inline visible-lg-inline">{{ item.span }}</span>
          </nuxt-link>
        </li>
        <li class="list-inline m-t-md">
          <nuxt-link :to="item.href" v-if="item.href != '#'" target="_blank" class="share" v-for="(item, index) in share_btn" :key="index">
            <i :class="item.icons" @click="removeCLass(!isSide)"></i>
          </nuxt-link>
        </li>
      </ul>
    </nav>
    <header class="header navbar navbar-inverse navbar-fixed-top visible-xs-block">
      <div id="menuToggle" @click="removeCLass(!isSide)">
        <i class="fa fa-align-justify"></i>
      </div>
      <p class="text-center text-lg header_title m-b-none">{{ user.blog_name }}</p>
      <nuxt-link to="/" class="me">
        <img :src="user.user_header_img" class=" avatar " alt="">
      </nuxt-link>
    </header>
    <div id="sidebar-mask"></div>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
export default {
  data() {
    return {
      isSide: false,
      side_btn: [{
          title: "首页",
          span: "首页",
          icons: "iconfont fa fa-home",
          href: "/"
        },
        {
          title: "归档",
          span: "归档",
          icons: "iconfont fa fa-archive",
          href: "/archives"
        },
        {
          title: "标签",
          span: "标签",
          icons: "iconfont fa fa-tags",
          href: "/tags"
        },
        {
          title: "关于",
          span: "关于",
          icons: "iconfont fa fa-user",
          href: "/about"
        },
        {
          title: "bing每日图片",
          span: "图片",
          icons: "iconfont fa fa-file-image-o",
          href: "/bing"
        },
        {
          title: "友链",
          span: "友链",
          icons: "iconfont fa fa-share-alt",
          href: "/links"
        }
      ],
      share_btn: [{
          href: "#",
          icons: "fa fa-weibo iconfont"
        },
        {
          href: "#",
          icons: "fa fa-github iconfont"
        },
        {
          href: "#",
          icons: "fa fa-twitter iconfont"
        }
      ]
    };
  },
  computed: {
    user() {
      return this.$store.getters["index/getUser"];
    }
  },
  methods: {
    removeCLass(boolean) {
      this.isSide = boolean;
      var body = document.body;
      boolean ? body.classList.add("side") : body.classList.remove("side");
    }
  },
  mounted() {
    document.getElementById("sidebar-mask").onclick = () => {
      this.removeCLass(false);
    };
    this.share_btn[0].href = this.user.weibo;
    this.share_btn[1].href = this.user.github;
    this.share_btn[2].href = this.user.twitter;
  }
};

</script>
