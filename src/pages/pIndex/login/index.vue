<template>
  <div class="container">
    <div class="title">登&nbsp;录</div>
    <div class="logo"><img src="https://sniu.2dian.com/xcx/static/matou/logo.png" alt=""></div>
    <div class="loginbtn">
      <div class="btn wx">
        <button class="login-btn btn wx" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">微信登录</button>
      </div>
      <div @click="handle" class="btn other">其他方式登录</div>
    </div>

    <div class="xy">

      登录代表您已阅读并同意
      <span @click="goagree(0)">《用户服务协议》</span> <span @click="goagree(1)">《用户隐私政策》</span>
    </div>
  </div>
</template>
<script>
import { loginByWeixin } from '../../../utils/user'
import { getMemberWx, getMyAccount } from '@/utils/api'
export default {
  data () {
    return {
      agreed: true
    }
  },
  computed: {

  },
  components: {

  },
  mounted () {
    // this.getMemberWx()
  },
  onUnload () {

  },
  methods: {
    goagree (type) {
      type = type == 0 ? 'fw' : 'ys'
      wx.navigateTo({
        url: `/pages/pEncyclopedia/Agreement/main?agreePage=${type}`
      })
    },
    agree () {
      if (this.agreed == false) {
        wx.showToast({
          title: '请阅读并同意相关协议,谢谢.',
          icon: 'none',
          duration: 2000
        })
        return false
      } else {
        return true
      }
    },
    async getMemberWx () {
      if (this.agree()) {
        var res = await getMemberWx()
        return res.errCode
        // console.log(res, 'res')
      }
    },

    async getUserInfo () {
      var result = await getMyAccount()
      this.memberInfo = result.result.result.member
      if (this.memberInfo) {
        return this.memberInfo.mphone
      } else {
        return ''
      }
    },

    handle: function () {
      wx.navigateTo({
        url: '/pages/pMe/loginPassword/main'
      })
    },
    bindGetUserInfo () {
      if (this.agree()) {
        wx.showLoading({
          title: '正在登录...'
        })
        loginByWeixin().then(res => {
          console.log('doLogin..')
          console.log(res.data.userInfo)
          wx.hideLoading()
          wx.showToast({ title: '登录成功', icon: 'none' })
          setTimeout(async () => {
            var result = await getMyAccount()
            let myPhone = result.result.result.member.mphone
            // let myPhone = this.getUserInfo()
            console.log('myPhone', myPhone)
            if (myPhone) {
              // wx.navigateBack({
              //   delta: 1
              // })
              wx.switchTab({
                url: '/pages/index/main' // 绑定了去首页
              })
            } else {
              // wx.switchTab({
              //   url: '/pages/pMe/bindPhone/main' // 未绑定  去绑定
              // })
              wx.navigateTo({
                url: '/pages/pMe/bindPhone/main?type=1'
              })
            }
          }, 1000)
        }).catch((err) => {
          console.log(err)
          wx.hideLoading()
        })
      }
    }

  }
}
</script>

<style lang="less" scoped>
.container {
  color: @primary;
  font-size: @fs44;
  .title {
    margin-top: 60px;
    width: 100%;
    height: 65px;
    font-size: 35px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    text-align: center;
  }
  .logo {
    width: 100%;
    margin-top: 56.5px;
    text-align: center;
    img {
      width: 179px;
      height: 60px;
    }
  }
  .loginbtn {
    margin-top: 63px;
    width: 100%;
    text-align: center;
    height: 112px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .btn {
      width: 310px;
      height: 45px;
      margin: 0 auto;
      border-radius: 22.5px;
      line-height: 45px;
      text-align: center;
      font-size: 20px;
    }
    .wx {
      background-color: #16ab00;
      color: #ffffff;
      img {
        width: 32.5px;
        height: 26.5px;
        vertical-align: middle;
      }
    }
    .other {
      background-color: #f2f2f2;
      color: #333333;
    }
  }
  .xy {
    margin-top: 60rpx;
    width: 100%;
    text-align: center;
    height: 45px;
    box-sizing: border-box;
    color: #787878;
    // line-height: 45px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    span {
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(254, 106, 0, 1);
    }
  }
  .checkout {
    display: inline-block;
    width: 24rpx;
    height: 24rpx;
    border: 1rpx solid @line;
    vertical-align: middle;
    margin-right: 10rpx;
    .selected {
      border: none;
    }
  }
}
</style>
