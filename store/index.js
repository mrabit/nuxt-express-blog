import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    modules: {
        admin: {
            namespaced: true,
            state: {
                isCollapse: false,
                user: {}
            },
            getters: {
                getIsCollapse: (state, getters, rootState) => {
                    return state.isCollapse
                },
                getUser: (state, getter, rootState) => {
                    return state.user;
                }
            },
            mutations: {
                changeIsCollapse(state) {
                    state.isCollapse = !state.isCollapse;
                },
                changeUser(state, val) {
                    state.user = val;
                }
            }
        },
        frontend: {
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