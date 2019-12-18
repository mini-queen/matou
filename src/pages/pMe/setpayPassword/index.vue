<template>
  <div class="container">
    <div class="hr"></div>
    <div class="form">
      <div class="card">
        <span>支付密码</span>
        <input
          type="password"
          v-model="payPwd"
          placeholder="请输入支付密码"
          maxlength="6"
          placeholder-style="color:#CCCCCC"
        />
      </div>
      <div class="card">
        <span>确认密码</span>
        <input
          type="password"
          v-model="payPwdTwo"
          placeholder="请再次输入支付密码"
          maxlength="6"
          placeholder-style="color:#CCCCCC"
        />
      </div>
    </div>
    <div class="tips">
      <img src="/static/images/tips.png" alt />
      <span>支付密码由6位数字组成，进行余额支付使用。</span>
    </div>
    <div class="btn" @click="setOrResetUserPayPwd">确定</div>
  </div>
</template>
<script>
import { setUserPayPwd, getMd5Encryption } from '@/utils/api'
export default {
  data () {
    return {
      payPwd: '',
      payPwdTwo: ''
    }
  },
  computed: {},
  components: {},
  mounted () {},
  onUnload () {
    this.payPwd = ''
    this.payPwdTwo = ''
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
    async setOrResetUserPayPwd () {
      var params = {
        payPwd: await this.getMd5(this.payPwd),
        payPwdTwo: await this.getMd5(this.payPwdTwo)
      }
      var res = await setUserPayPwd(params)
      if (res.result.errCode == 'USER_200') {
        wx.showToast({
          title: '设置成功'
        })
        setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
        }, 1000)
      } else {
 (
         wx.showToast({
          title: res.result.errMsg
        })
      )
}
      console.log(res)
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
