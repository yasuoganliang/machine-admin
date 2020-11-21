import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Router from 'vue-router'
import store from './store'
import './plugins/element.js'

// 导入iconfont 的自定义图标
import './assets/iconfont/iconfont.css';
// 饼图
import Pie from 'v-charts/lib/pie.common';
//地图
import Map from 'v-charts/lib/map.common'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component(Pie.name, Pie);
Vue.component(Map.name, Map);
//把vuex定义成全局组件
Vue.prototype.$store = store
// 使用全局变量
import global_msg from './global.js'   //注意文件路径，实际路径以项目目录结构为准
Vue.prototype.$global_msg = {
  host: null
};

// 使用全局变量
import getInterfaceInfo from './getInterfaceInfo.js'   //注意文件路径，实际路径以项目目录结构为准
Vue.prototype.$local_host = getInterfaceInfo();

// 接口错误拦截
axios.interceptors.response.use(res => {
  // console.log("response: ", res);
  if (res.data.statusCode === 700) {
    app && app.$message({
      type: 'warning',
      message: '登录身份过期，请重新登录。'
    })
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    router.push({name: 'login'})
    return Promise.reject(new Error('身份过期'))
  } else {
    return res.data
  }
}, err => {
  app.$notify.error({
    title: '服务错误',
    message: '服务器响应错误 ' + err.message
  })
  return Promise.reject(err)
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)

}
let app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
