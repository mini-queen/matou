<template>
  <div class="container">
    <div class="logo">
      <img src="https://sniu.2dian.com/xcx/static/matou/logo.png" alt />
    </div>
    <div class="phoneform">
      <div class="phone">
        <img src="/static/images/user.png" alt />
        <input type="number" placeholder="请输入手机号" v-model="phone" placeholder-style="color:#CCCCCC" />
      </div>
      <div class="code">
        <img src="/static/images/code.png" alt />
        <input type="number" v-model="code" placeholder="请输入验证码" placeholder-style="color:#CCCCCC" />
        <div class="getCode" @click="getCode">{{getCodeStr}}</div>
      </div>
      <div class="phone">
        <img src="/static/images/yaoqingren.png" alt />
        <input
          type="number"
          v-model="inviterPhone"
          placeholder="选填,请输入邀请人手机号"
          placeholder-style="color:#CCCCCC"
        />
      </div>
    </div>
    <div class="btn" @click="loginByPhone">立即登录</div>
    <div class="xieyi">
      <div class="left">
        <checkbox color="#FE6A00" :value="str" :checked="checked" />我已阅读并同意
      </div>
      <div class="right">
        《便利码头平台服务协议》
        <br />《便利码头隐私政策》
      </div>
    </div>
    <div class="otherlogin">
      <div class="title">
        <div class="hr"></div>
        <div>其他登录方式</div>
        <div class="hr"></div>
      </div>
      <div class="content">
        <img src="/static/images/weixin2.png" alt />
      </div>
    </div>
  </div>
</template>
<script>
import { getCode, phoneLogin } from '../../../utils/api'
export default {
  data () {
    return {
      checked: 'checked',
      phone: '',
      code: '',
      inviterPhone: '',
      getCodeStr: '获取验证码',
      str: ''
    }
  },
  computed: {},
  components: {},
  mounted () {},
  onUnload () {},
  methods: {
    // 验证不能为空
    checkingNull: function (val) {
      return val !== '' && val !== null
    },
    loginByPhone: async function () {
      var phone = this.phone
      var code = this.code
      var arr = [phone, code]
      if (arr.every(this.checkingNull)) {
        // console.log('通过验证')
      } else {
        wx.showToast({
          title: '手机号或验证码不能为空',
          icon: 'none',
          duration: 2000
        })
        return
      }

      var inviterPhone = this.inviterPhone
      var res = await phoneLogin({ phone, code, inviterPhone })
      console.log(res, { phone, code, inviterPhone })
    },
    getCode: async function () {
      // 验证码倒计时
      var countdown = 60
      var _ = this
      function settime () {
        if (countdown === 0) {
          _.getCodeStr = ' 获取验证码'
          countdown = 60
        } else if (countdown <= 0) {
          _.getCodeStr = '获取验证码'
        } else {
          _.getCodeStr = '重新发送(' + countdown + ')'
          countdown--
          setTimeout(function () {
            settime()
          }, 1000)
        }
      }

      // --
      settime()
      var mobile = this.phone
      var type = 'login' // 验证码类型
      var res = await getCode({ mobile, type })
      console.log(res)
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
    height: 165px;
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
        width: 70%;
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
        font-size: 10px;
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
  .xieyi {
    width: 100%;
    height: 29px;
    margin-top: 30px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    .left {
      color: #333333;
    }
    .right {
      color: #fe6a00;
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
