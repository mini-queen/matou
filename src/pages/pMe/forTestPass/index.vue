<template>
  <div class="container">
    <!-- {{msg}} -->
  
    <a href="/pages/pMe/payPassword/main" class="more-link">设置支付密码</a>
    <a href="/pages/pMe/setpayPassword/main" class="more-link">修改支付密码</a>
    <a href="/pages/pMe/ressetpayPassword/main" class="more-link">密码修改</a>
    <a href="/pages/pMe/changepayPassword/main" class="more-link">修改登录密码</a>
    <a href="/pages/pMe/changePassword/main" class="more-link">修改密码</a>
    <a href="/pages/pMe/forgetPassword/main" class="more-link">忘记密码</a>


    <button class="login-btn" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">微信登录</button>
  </div>
</template>
<script>

import {
  loginByWeixin
} from '../../../utils/user'

export default {
  data () {
    return {
      msg: '测试页面'
    }
  },
  computed: {

  },
  components: {

  },
  mounted () {

  },
  onUnload () {

  },
  methods: {

    bindGetUserInfo () {
      wx.showLoading({
        title: '正在登录...'
      })
      loginByWeixin().then(res => {
        console.log('doLogin..')
        if (res.statusCode === 500) {
          wx.showToast({
            title: '未配置小程序ID',
            mask: true
          })
          return
        }
        console.log(res.data.userInfo)
        this.setData({
          userInfo: res.data.userInfo,
          showLogin: false,
          isShowCoupon: true
        })

        wx.hideLoading()
      }).catch((err) => {
        console.log(err)
        wx.hideLoading()
      })
    }

  }
}
</script>

<style lang="less" scope>
.container {
  color: @primary;
  font-size: 12px;
  text-align:center;

  a{
    margin-top:10px;
    color:#FE6A00
  }
  .login-btn{
    width: 30%;
    height: 98rpx;
    line-height: 98rpx;
    text-align: center;
    background: #09BB07;
    position: fixed;
    bottom: 10%;
    right: 0;
    border-radius: 10px;
    color: #fff;
    font-size: 28rpx;
    z-index: 100000;
  }
}
</style>
