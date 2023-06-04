import { reqLogin, reqUserInfo } from "@/api/user";
const state = {
    token: localStorage.getItem('token'),
    userInfo: JSON.parse(sessionStorage.getItem('userInfo'))
};
const actions = {
    async userLogin(context, data) {
        let res = await reqLogin(data);
        if (res.status === 200) {
            localStorage.setItem('token', res.data.token)
            context.commit('UserLogin', res.data.token);
            return 'OK'
        }
        return Promise.reject(new Error('fail'));
    },
    async getUserInfo(context, data) {
        console.log('getuserinfo')
        let res = await reqUserInfo();
        if (res.status == 200) {
            sessionStorage.setItem('userInfo', JSON.stringify(res.data))
            context.commit('GetUserInfo', res.data)
            return 'Ok'
        }
        return Promise.reject(new Error('fail'));
    }

};
const mutations = {
    UserLogin(state, data) {
        state.token = data
    },
    GetUserInfo(state, data) {
        state.userInfo = data
    }
};
const getters = {};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}