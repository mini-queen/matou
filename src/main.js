import Vue from 'vue'
import App from './App'
import store from '@/store'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store
Vue.prototype.$baseUrl = 'https://m.bianlimt.com/'
Vue.prototype.$baseUrl2 = 'https://m.bianlimt.com/'
Vue.prototype.$baseUrl3 = 'https://m.bianlimt.com/'
Vue.prototype.$sharePic = 'https://test-webchat.bianlimt.com/'
// 公用的分享图片
Vue.prototype.$publicShare = 'http://sniu.2dian.com/xcx/static/matou/publicShare.png'
// 推广分享邀请中的分享图片
Vue.prototype.$tuiShare = 'http://sniu.2dian.com/xcx/static/matou/tuiShare.png'

const app = new Vue(App)
app.$mount()
