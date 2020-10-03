import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import router from './router'	//引用router
import VueResource from 'vue-resource'
import {axios} from "axios"
import './assets/icon/iconfont.css'
import landType from './assets/json/landType.json'
import Vuex from 'vuex'
import store from './api/store'



Vue.use(Vuex)
Vue.use(VueResource);
Vue.prototype.$echarts = echarts
Vue.prototype.$ajax = axios

Vue.use(ElementUI)

export const eventBus = new Vue()

new Vue({
  render: h => h(App),
  store,
  router	//加到这里渲染到视图
}).$mount('#app')
