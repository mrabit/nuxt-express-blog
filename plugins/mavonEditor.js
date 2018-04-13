import Vue from 'vue';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

Vue.use(mavonEditor);
let md = mavonEditor.markdownIt;
md.set({ breaks: true });
