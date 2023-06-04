import request from "./index.js";

export const reqGetUnRead = (params) => request({
    url: '/noread/getNoread',
    method: 'GET',
    params
})
export const reqSaveNoRead = (data) => request({
    url: '/noread/saveNoread',
    method: 'POST',
    data
})
export const reqRemoveNoRead = (params) => request({
    url: '/noread/removeNoread',
    method: 'DELETE',
    params
})