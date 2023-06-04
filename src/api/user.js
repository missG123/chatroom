import request from './index';
// 登录
export const reqLogin = (data) => request({
    url: '/login',
    method: 'POST',
    data
})
// 获取用户信息
export const reqUserInfo = () => request({
    url: '/getUser',
    method: 'GET'
})
export const reqRegister = (data) => request({
    url: '/register',
    method: 'POST',
    data
})
export const reqHasUser = (params) => request({
    url: '/getHasUser',
    method: 'GET',
    params
})
// 模糊查询
export const reqSearchUser = (params) => request({
    url: '/searchUser',
    method: 'GET',
    params
})
// 添加朋友
export const reqAddFriend = (data) => request({
    url: '/addFriend',
    method: 'POST',
    data
})