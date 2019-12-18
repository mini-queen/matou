<template>
  <div class="container">
    <div class="phoneform">
      <div class="phone">
        <img src="/static/images/user.png" alt />
        <input type="text" placeholder="请输入手机号" v-model="mobile" placeholder-style="color:#CCCCCC" />
      </div>
      <div class="code">
        <img src="/static/images/code.png" alt />
        <input type="text" v-model="m_code" placeholder="请输入验证码" placeholder-style="color:#CCCCCC" />
        <div class="getCode" @click="getCode">{{getCodeStr}}</div>
      </div>
    </div>
    <div class="btn" @click="goBind">确定</div>
    <div class="hr"></div>
    <div class="moreInfo">
      <div class="title">绑定手机号，享受优质服务</div>
      <div class="card">
        <img src="/static/images/ico3.png" alt />
        <div>
          <div class="title">找回密码</div>
          <div class="info">忘记密码时，随时通过手机重新设置密码；</div>
        </div>
      </div>
      <div class="card">
        <img src="/static/images/ico2.png" alt />
        <div>
          <div class="title">方便快捷</div>
          <div class="info">手机号登录，方便快捷；</div>
        </div>
      </div>
      <div class="card">
        <img src="/static/images/ico4.png" alt />
        <div>
          <div class="title">账户安全</div>
          <div class="info">确保账户安全，不被他人盗用；</div>
        </div>
      </div>
      <div class="card">
        <img src="/static/images/ico1.png" alt />
        <div>
          <div class="title">获取资讯</div>
          <div class="info">及时获取便利码头最新优惠资讯；</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCode, bindingPhoneNum } from '@/utils/api'
export default {
  data () {
    return {
      mobile: '',
      type: 'bindPhone',
      m_code: '',
      getCodeStr: '获取验证码'
    }
  },
  onLoad (option) {
      this.jumptype = option.type // type为1 表示绑定手机号后返回首页
  },
  computed: {},
  components: {},
  mounted () {},
  onUnload () {},
  methods: {
    async getCode () {
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
      var params = {
        mobile: this.mobile,
        type: this.type
      }
      if (this.mobile) {
        var res = await getCode(params)
      } else {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 2000
        })
        return
      }

      if (res.result.errCode == 'USER_200') {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
      } else if (res.result.errMsg == '该手机号已被绑定') {
        wx.showToast({
          title: '该手机号已被绑定',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '发生错误',
          icon: 'success',
          duration: 2000
        })
      }
    },
    async goBind () {
      var params = {
        m_phone: this.mobile,
        m_code: this.m_code
      }
      var res = await bindingPhoneNum(params)
      console.log(res)
      if (res.result.errCode == 'USER_200') {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
        if (this.jumptype == 1) {
          setTimeout(function () {
                 wx.switchTab({
                    url: '/pages/index/main' // 绑定了去首页
                  })
              }, 1000)
        } else {
           setTimeout(function () {
                 wx.navigateBack({
                  delta: 1
                  })// 返回上一页面
              }, 1000)
        }
      } else {
        wx.showToast({
          title: res.result.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  color: @primary;

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
  .hr {
    width: 100%;
    height: 10px;
    background-color: #f7f7f7;
    margin-top: 30px;
  }
  .moreInfo {
    padding: 0px 32.5px;
    box-sizing: border-box;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > .title {
      font-size: 14px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #e5e5e5;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .card {
      height: 35px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      img {
        width: 30px;
        height: 35px;
      }
      > div {
        margin-left: 15px;
        > .title {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(120, 120, 120, 1);
        }
        .info {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }
    }
  }
}
</style>
