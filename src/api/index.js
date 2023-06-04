import axios from 'axios'
import store from '@/store'

//全局参数，自定义参数可在发送请求时设置
// axios.defaults.timeout = 300000000 //超时时间ms
axios.defaults.withCredentials = true

// 创建一个axios实例
const request = axios.create({
  // 配置
  baseURL: '/api',
  timeout: 8000
})




// 请求时的拦截
//回调里面不能获取错误信息
request.interceptors.request.use(
  function (config) {
    if (store.state.user.token) {
      config.headers.token = store.state.user.token
    }
    return config;
  },
  function (error) {
    // 当请求异常时做一些处理
    console.log('请求异常：' + JSON.stringify(error));
    return Promise.reject(error);
  }
);
request.interceptors.response.use(function (response) {

  return response
}, function (error) {
  // Do something with response error
  console.log('响应出错：' + error)
  return Promise.reject(error)
})

export default request
