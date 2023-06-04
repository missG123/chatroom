import { reqRemoveNoRead, reqSaveNoRead } from '@/api/noread';
import Vue from 'vue'
const state = {
    noread: {},
}
const actions = {
    async setNoRead(context, data) {
        console.log('setNoRead', data)
        context.commit('SetNoRead', data);
        let res = await reqSaveNoRead(data)
    },
    async removeNoRead(context, data) {
        context.commit('RemoveNoRead', data)
        let res = await reqRemoveNoRead(data)
    },
    saveFirst(context, data) {
        context.commit('SaveFirst', data);
    }

}
const mutations = {
    SetNoRead(state, data) {
        let key = data.from;
        if (state.noread.hasOwnProperty(key)) {
            let count = state.noread[key] + 1;
            Vue.set(state.noread, key, count);
        } else {
            Vue.set(state.noread, key, 1);
        }

    },
    RemoveNoRead(state, data) {
        Vue.set(state.noread, data.from, 0)
    },
    SaveFirst(state, data) {
        for (let item of data) {
            let key = item._id;
            if (state.noread.hasOwnProperty(key)) {
                let count = state.noread[key] + item.sum;
                Vue.set(state.noread, key, count)
            } else {
                Vue.set(state.noread, key, item.sum)
            }
        }
    }

}
const getters = {

}
export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
