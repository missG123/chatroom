import request from "./index.js";

export const reqMessage = (params) => request({
    url: '/message/getMessage',
    method: 'GET',
    params
})
export const reqSaveMessage = (data = {}) => {
    if (data.chatType == 2) {
        console.log('api', data)
        return request({
            url: '/message/saveMessage',
            method: 'POST',
            data,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    } else {
        return request({
            url: '/message/saveMessage',
            method: 'POST',
            data,
        })
    }
}
export const reqFile = (params) => request({
    url: '/message/getFileInfo',
    method: 'GET',
    params
})