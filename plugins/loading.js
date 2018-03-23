import loading from '../components/loading.vue';
import Vue from 'vue';

const Loading = {
  loading
};

const install = function(Vue, opts = {}) {
  Vue.component('loading', loading);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
Vue.use(Object.assign(Loading, { install }));
