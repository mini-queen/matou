<template>
  <div class="container">
    <div class="hr"></div>
    <div class="form" v-if="mpwd==1">
      <div class="card">
        <div>原登录密码</div>
        <input
          type="password"
          v-model="originalPwd"
          placeholder="请输入原始密码"
          placeholder-style="color:#CCCCCC"
        />
      </div>
      <div class="card">
        <div>新登录密码</div>
        <input
          type="password"
          v-model="pwd"
          placeholder="请输入新登录密码"
          placeholder-style="color:#CCCCCC"
        />
      </div>
      <div class="card">
        <div>确认新登录密码</div>
        <input
          type="password"
          v-model="pwdTwo"
          placeholder="请再次输入新登录密码"
          placeholder-style="color:#CCCCCC"
        />
      </div>
    </div>
    <div class="form" v-else>
      <div class="card">
        <div>登录密码</div>
        <input
          type="password"
          v-model="pwd"
          placeholder="请输入登录密码"
          placeholder-style="color:#CCCCCC"
        />
      </div>
      <div class="card">
        <div>确认登录密码</div>
        <input
          type="password"
          v-model="pwdTwo"
          placeholder="请再次输入登录密码"
          placeholder-style="color:#CCCCCC"
        />
      </div>
    </div>
    <div class="tips">
      <img src="/static/images/tips.png" alt />
      <span>登录密码由6-20位数字、字母、符号组成</span>
    </div>
    <div @click="handle(mpwd)" class="btn">确定</div>
  </div>
</template>
<script>
import { changePwd, getMd5Encryption } from '../../../utils/api'
export default {
  data () {
    return {
      mpwd: '', // 1 已经设置密码 0 未设密码
      originalPwd: '',
      pwd: '',
      pwdTwo: ''
    }
  },
  computed: {},
  components: {},
  mounted () {
    // let userInfo = wx.getStorageSync('userInfo')
    this.mpwd = this.$mp.query.mpwd
    // this.mpwd = userInfo.mpwd
    console.log(this.mpwd)
  },
  onUnload () {
      this.originalPwd = ''
      this.pwd = ''
      this.pwdTwo = ''
  },
  methods: {
    async getMd5 (str) {
      let params = {
        str: str
      }
      console.log('getMd5 params: ')
      console.log(params)
      let data = await getMd5Encryption(params)
      console.log(data)
      return data.result.result
    },
    handle: async function (mpwd) {
      var originalPwd = await this.getMd5(this.originalPwd)
      var pwd = await this.getMd5(this.pwd)
      var pwdTwo = await this.getMd5(this.pwdTwo)
      if (mpwd == 1) {
      var res1 = await changePwd({ originalPwd, pwd, pwdTwo })
      if (res1.result.errCode == 'USER_200' && this.mpwd == 1) {
        setTimeout(() => {
         wx.showToast({
          title: '修改成功'
        })
        }, 400)
              setTimeout(() => {
          wx.navigateBack({
          delta: 1
      })
        }, 800)
      } else if (res1.result.errCode == 'USER_200' && this.mpwd == 0) {
          setTimeout(() => {
         wx.showToast({
          title: '设置成功'
        })
        }, 500)
              setTimeout(() => {
          wx.navigateBack({
          delta: 1
      })
        }, 500)
      } else {
        wx.showToast({
          title: '请检查并重新输入'
        })
      }
      console.log(res1)
      } else {
        originalPwd = ''
      var res = await changePwd({ originalPwd, pwd, pwdTwo })
      if (res.result.errCode == 'USER_200' && this.mpwd == 1) {
         setTimeout(() => {
         wx.showToast({
          title: '修改成功'
        })
        }, 400)
        setTimeout(() => {
          wx.navigateBack({
          delta: 1
      })
        }, 800)
      } else if (res.result.errCode == 'USER_200' && this.mpwd == 0) {
         setTimeout(() => {
         wx.showToast({
          title: '设置成功'
        })
        }, 400)
              setTimeout(() => {
          wx.navigateBack({
          delta: 1
      })
        }, 800)
      } else {
        wx.showToast({
          title: '请检查并重新输入'
        })
      }
      console.log(res)
      }
    }
  }
}
</script>

<style lang="less" scope>
page {
  background-color: #f7f7f7;
}
.container {
  color: @primary;

  .form {
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    .card {
      height: 50px;
      width: 100%;
      padding: 0 15px;
      line-height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #f7f7f7;
      box-sizing: border-box;
      input {
        width: 200px;
        margin-left: 14px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(204, 204, 204, 1);
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
  }
  .tips {
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    width: 100%;
    text-align: center;
    margin: 25px auto;
    img {
      width: 16px;
      height: 18px;
      vertical-align: bottom;
    }
  }
}
</style>
