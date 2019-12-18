<template>
  <div class="container">
    <div class="logo"><img src="https://sniu.2dian.com/xcx/static/matou/logo.png" alt=""></div>
    <div class="phoneform">
      <div class="phone">
        <img src="/static/images/user.png" alt="">
        <input type="number" placeholder="请输入手机号" v-model="m_phone" placeholder-style="color:#CCCCCC">
      </div>
      <div class="code"><img src="/static/images/code.png" alt="">
        <input type="password" placeholder="请输入登录密码" v-model="m_pwd" placeholder-style="color:#CCCCCC">
      </div>
    </div>
    <div class="btn" @click="loginByPhone">立即登录</div>
    <div class="findPassword">
      <a href="/pages/pMe/forgetPassword/main">忘记密码</a>
    </div>
  </div>
</template>
<script>
import { phoneLogin, getMd5Encryption } from '../../../utils/api'
import store from '../../../store'
export default {
  data () {
    return {
      m_phone: '',
      m_pwd: ''
    }
  },
  computed: {

  },
  components: {

  },
  mounted () {

  },
  onUnload () {
    this.m_phone = ''
    this.m_pwd = ''
  },
  methods: {
    // 验证不能为空
    checkingNull: function (val) {
      return val !== '' && val !== null
    },
    loginByPhone: async function () {
      var loginName = this.m_phone

      let md5Data = await getMd5Encryption({ str: this.m_pwd })
      console.log(md5Data)
      var pwd = md5Data.result.result
      var arr = [loginName, pwd]
      // if (arr.every(this.checkingNull)) {
      //   // console.log('通过验证')
      // } else {
      //   wx.showToast({
      //     title: '手机号或密码不能为空',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   return
      // }
      if (this.m_phone == '') {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.m_pwd == '') {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none',
          duration: 2000
        })
        return
      }
      var res = await phoneLogin({ loginName, pwd })
      console.log(res, { loginName, pwd })
      if (res.errCode == 'USER_200') {
        wx.setStorage({
          key: 'DIAN_TOKEN',
          data: res.result.result.token
        })
        wx.setStorage({
          key: 'userInfo',
          data: res.result.result
        })
        wx.navigateBack({
          delta: 2
        })
        // wx.reLaunch({
        //   url: '/pages/index/main'
        // })
      } else {
        wx.showToast({
          title: '错误,请检查输入'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  color: @primary;
  .logo {
    width: 100%;
    margin-top: 31px;
    margin-bottom: 15px;
    text-align: center;
    img {
      width: 179px;
      height: 60px;
    }
  }
  .phoneform {
    width: 100%;
    height: 111px;
    padding: 20px 32.5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .phone {
      width: 100%;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: 30px;
      line-height: 30px;
      img {
        width: 17px;
        height: 17px;
      }
      input {
        margin-left: 14px;
        width: 215px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(204, 204, 204, 1);
      }
    }
    .code {
      width: 100%;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: 30px;
      line-height: 30px;
      img {
        width: 17px;
        height: 17px;
      }
      input {
        margin-left: 14px;
        width: 215px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(204, 204, 204, 1);
      }
      .getCode {
        width: 65px;
        height: 20px;
        border-radius: 10px;
        text-align: center;
        line-height: 20px;
        font-size: 11px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        border: 1px solid #787878;
      }
    }
  }
  .btn {
    margin: 0 auto;
    background-color: #fe6a00;
    color: #ffffff;
    width: 310px;
    height: 45px;
    border-radius: 22.5px;
    text-align: center;
    line-height: 45px;
    margin-top: 50px;
  }
  .findPassword {
    width: 100%;
    height: 29px;
    margin-top: 30px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    a {
      color: #fe6a00;
      margin-right: 45px;
    }
  }
  .otherlogin {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(120, 120, 120, 1);
    margin-top: 40px;
    .title {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      text-align: center;
      .hr {
        width: 100px;
        height: 0.5px;
        border: 0.5px solid rgba(229, 229, 229, 1);
        border-radius: 0.5px;
        margin: 7px 5px;
      }
    }
    .content {
      width: 100%;
      text-align: center;
      margin-top: 35px;
      img {
        width: 43px;
        height: 43px;
        margin: 0 auto;
        vertical-align: middle;
      }
    }
  }
}
</style>
