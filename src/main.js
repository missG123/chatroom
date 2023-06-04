import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index'
// import "./mock/index.js"
import store from '@/store'
import Ws from './util/websocket'

Vue.use(VueRouter)
Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  beforeCreate() {
    Vue.prototype.$ws = Ws
    Vue.prototype.$bus = this
  },
  render: h => h(App),
}).$mount('#app')
