/**
 * 用户相关服务
 */

// import fetch from './http'
const util = require('./util.js')
const api = require('./api.js')
let Fly = require('flyio/dist/npm/wx')

// let token

/**
 * 调用微信登录
 */
export function loginByWeixin () {
  let code = null
  console.log('loginByWeixin..')
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code
      console.log('code: ' + code)
      return util.getUserInfo()
    }).then((userInfo) => {
      // 登录远程服务器
      console.log(api.AuthLoginByWeixin)
      console.log(userInfo)
      const request = new Fly()
      // 添加请求拦截器
      request.interceptors.request.use((config, promise) => {
        // 给所有请求添加自定义header
        config.headers['X-Tag'] = 'flyio'

        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        config.headers['sign'] = 'bba3323921709ed27e2fdb459ca65b70'
        config.headers['X-SZK-Channel'] = 'small'
        config.headers['token'] = ''
        // 可以通过promise.reject／resolve直接中止请求
        // promise.resolve("fake data")
        return config
      })
      request.get(api.AuthLoginByWeixin, {
        code: code, data: JSON.stringify(userInfo)
      })
        .then(function (res) {
          console.log('invoked.....')
          console.log(res)
          console.log(res.data)
          console.log('res.data.token: ' + res.data.result.result.token)
          wx.setStorageSync('DIAN_TOKEN', res.data.result.result.token)
          console.log('res.errCode: ' + res.data.result.errCode)
          if (res.data.result.errCode === 'USER_200') {
            console.log('res.data.userInfo: ' + res.data.result.result)
            console.log('res.data.token: ' + res.data.result.result.token)
            // 存储用户信息
            wx.setStorageSync('userInfo', res.data.result.result)
            wx.setStorageSync('DIAN_TOKEN', res.data.result.result.token)
            // wx.showToast({title: '登录成功', icon: 'none'})
            // setTimeout(async () => {
            //   wx.switchTab({
            //     url: '/pages/index/main'
            //   })
            // }, 1000)

            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch(function (error) {
          console.log(error)
        })

      // console.log('start invoke.....')
      // fetch(api.AuthLoginByWeixin, { code: code, data: JSON.stringify(userInfo) }, 'get').then(res => {
      //   console.log('res.data: ' + res.result)
      //   console.log('result: ' + res.result.result)
      //   console.log('result: ' + res.result.result.token)
      //   // let resData = JSON.parse(res)
      //   // console.log('resData: ' + resData)
      //   if (res.data.errCode === 'USER_200') {
      //     console.log('res.data.userInfo: ' + res.data.userInfo)
      //     console.log('res.data.token: ' + res.data.token)
      //     // 存储用户信息
      //     wx.setStorageSync('userInfo', res.data.result.result)
      //     console.log('res.data.token: ' + res.data.result.result.token)
      //     resolve(res)
      //   } else {
      //     reject(res)
      //   }
      // }).catch((err) => {
      //   reject(err)
      // })

      // util.request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'GET').then(res => {
      //   console.log('res.statusCode: ' + res.statusCode)
      //   if (res.statusCode === 500) {
      //     wx.showToast({
      //       image: '/static/images/icon_error.png',
      //       title: '未配置小程序ID',
      //       mask: true
      //     })
      //     return
      //   }

      //   if (res.statusCode === 200) {
      //     console.log('res.data.userInfo: ' + res.data.userInfo)
      //     console.log('res.data.token: ' + res.data.token)
      //     // 存储用户信息
      //     wx.setStorageSync('userInfo', res.data.userInfo)
      //     wx.setStorageSync('DIAN_TOKEN', res.data.token)

      //     resolve(res)
      //   } else {
      //     reject(res)
      //   }
      // }).catch((err) => {
      //   reject(err)
      // })
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 判断用户是否登录
 */
export function checkLogin () {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('DIAN_TOKEN')) {
      util.checkSession().then(() => {
        resolve(true)
      }).catch(() => {
        // reject(false)
      })
    } else {
      // reject(false)
    }
  })
}
