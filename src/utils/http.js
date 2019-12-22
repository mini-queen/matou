// import store from '../store'
// import config from '@/constants/config'
// import {getToken} from './util'
let Fly = require('flyio/dist/npm/wx')
const request = new Fly()
request.config.timeout = 15 * 1000
request.config.baseURL = `https://test-webchat.bianlimt.com`
// request.config.baseURL = `http://192.168.1.197:30006`
request.interceptors.request.use((request) => {
  request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  request.headers['sign'] = 'bba3323921709ed27e2fdb459ca65b70'
  request.headers['X-SZK-Channel'] = 'small'
  request.headers['X-SZK-Token'] = wx.getStorageSync('DIAN_TOKEN')
  // request.headers['X-SZK-Token'] = '7bfddc5771c6e4429e573c81de7b42fc'
  wx.showLoading({ title: '加载中..' })
  return request
})

request.interceptors.response.use(

  (response, promise) => {
    wx.hideLoading()
    return promise.resolve(response.data)
  },
  (err, promise) => {
    wx.hideLoading()
    wx.showToast({
      title: '网络请求失败,请稍后重试',
      icon: 'none',
      duration: 2000
    })
    return promise.resolve(err)
  }
)

const requestNoLoading = new Fly()
requestNoLoading.config.timeout = 15 * 1000
requestNoLoading.config.baseURL = `https://test-webchat.bianlimt.com`
requestNoLoading.interceptors.request.use((request) => {
  request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  request.headers['sign'] = 'bba3323921709ed27e2fdb459ca65b70'
  request.headers['X-SZK-Channel'] = 'small'
  request.headers['X-SZK-Token'] = wx.getStorageSync('DIAN_TOKEN')
  return request
})

requestNoLoading.interceptors.response.use(

  (response, promise) => {
    wx.hideLoading()
    return promise.resolve(response.data)
  },
  (err, promise) => {
    wx.hideLoading()
    wx.showToast({
      title: '网络请求失败,请稍后重试',
      icon: 'none',
      duration: 1000
    })
    return promise.resolve(err)
  }
)

export function fetch (url, params = {}, method = 'post') {
  return new Promise((resolve, reject) => {
    request[method](url, params)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchNoloading (url, params = {}, method = 'post') {
  return new Promise((resolve, reject) => {
    requestNoLoading[method](url, params)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
