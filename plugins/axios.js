import * as axios from 'axios'
import Vue from 'vue';

let options = {}
    // The server-side needs a full url to works
if (process.server) {
    options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
}

Vue.prototype.$http = axios;

export default axios.create(options)