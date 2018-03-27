import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  modules: {
    admin: {
      namespaced: true,
      state: {
        isCollapse: false,
        user: {},
        tokenAuth: false
      },
      getters: {
        getIsCollapse: state => state.isCollapse,
        getUser: state => state.user,
        getTokenAuth: state => state.tokenAuth
      },
      mutations: {
        changeIsCollapse(state) {
          state.isCollapse = !state.isCollapse;
        },
        changeUser(state, val) {
          state.user = val;
        },
        changeTokenAuth(state, val) {
          state.tokenAuth = val;
        }
      }
    },
    index: {
      namespaced: true,
      state: {
        user: {}
      },
      getters: {
        getUser(state) {
          return state.user;
        }
      },
      mutations: {
        changeUser(state, val) {
          state.user = val;
        }
      }
    }
  }
});

export default store
