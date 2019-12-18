// eslint-disable-next-line
var api = require('./api.js')
// eslint-disable-next-line
export function formatTime (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// eslint-disable-next-line
export function formatTimeStr (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

export function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 检查微信会话是否过期
 */
export function checkSession () {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true)
      },
      fail: function () {
        // reject(false)
      }
    })
  })
}

/**
 * 调用微信登录
 */
export function login () {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          // 登录远程服务器
          console.log(res)
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

export function getUserInfo () {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log('getUserInfo success...')
        console.log(res)
        resolve(res)
      },
      fail: function (err) {
        console.log('getUserInfo fail...')
        reject(err)
      }
    })
  })
}

export function redirect (url) {
  // 判断页面是否需要登录
  wx.redirectTo({
    url: url
  })
}

export function showErrorToast (msg) {
  wx.showToast({
    title: msg
  })
}
