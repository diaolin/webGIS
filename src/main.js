import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import router from './router'	//引用router
import VueResource from 'vue-resource'
import axios from "axios"
import './assets/icon/iconfont.css'
import landType from './assets/json/landType.json'
import Vuex from 'vuex'
import store from './api/store'
import vcolorpicker from 'vcolorpicker'
// import Sketch from 'vue-color'
import Sketch from '../node_modules/vue-color/src/components/Sketch'
import instance_ from './api/index';
import instanceget_ from './api/index';


// import 'xe-utils'
// import VXETable from 'vxe-table'
// import 'vxe-table/lib/index.css'
 
// Vue.use(VXETable)

Vue.prototype.instance = instance_  //axios实例
Vue.prototype.instanceget = instanceget_  //axios实例
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;
axios.defaults.timeout = 300000;
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }
    
    // Increase the retry count
    config.__retryCount += 1;
    
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
        return axios(config);
    });
});
Vue.use(vcolorpicker)
Vue.use(Vuex)
Vue.use(VueResource);
// Vue.use(Sketch);
Vue.component("sketch-picker",Sketch);

Vue.prototype.$echarts = echarts
Vue.prototype.$ajax = axios

Vue.use(ElementUI)

export const eventBus = new Vue()

new Vue({
  render: h => h(App),
  store,
  router,	//加到这里渲染到视图,
}).$mount('#app')

