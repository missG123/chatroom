import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import noRead from './noRead'
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        user,
        noRead
    }
})