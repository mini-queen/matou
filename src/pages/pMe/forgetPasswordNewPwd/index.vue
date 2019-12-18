<template>
  <div class="container">
   <div class="ipt"><div class="label">新密码</div><div><input v-model="pwd" type="password" placeholder="6-20位数字、字母或符号组合"></div></div>
    <div class="ipt2"><div class="label">确认密码</div><div><input v-model="pwdTwo" type="password" placeholder="请输入确认密码"></div></div>
   <div class="btn"><button @click="handle" :disabled='btnStatus' size="default">下一步</button></div>
  </div>
</template>
<script>
  import {forgetPwd} from '../../../utils/api'
  export default {
    data () {
      return {
        btnStatus: false,
        phone: '',
        code: '',
        pwd: '',
        pwdTwo: ''
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
      this.phone = this.$root.$mp.query.phone
      this.code = this.$root.$mp.query.code
    },
    onUnload () {
  
    },
    methods: {
      async handle () {
        var mobile = this.phone
        var code = this.code
        var pwd = this.pwd
        var pwdTwo = this.pwdTwo
        console.log(mobile, code, pwd, pwdTwo)
        var res = await forgetPwd({mobile, code, pwd, pwdTwo})
        console.log(res)
        if (res.result.errCode === 'USER_200') {
          wx.navigateTo({
            url: '/pages/pMe/forgetPasswordSuccess/main'
  })
        } else if (this.pwd !== this.pwdTwo) {
          wx.showToast({
            title: res.result.errMsg,
            icon: 'none',
            duration: 2000
          })
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

<style lang="less" scope>
page{
  background-color: #F7F7F7;
}
.container {
  color: @primary;
  font-size: @fs44;
  .ipt{
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin-top: 10px;
    font-size: 14px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;
.label{
  margin: 0 15px;
}
div>input{
  height: 20px;
  width: 200px;
  font-size: 14px;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
}
  }
  .ipt2{
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    margin-bottom: 10px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;
.label{
  margin: 0 15px;
}
div>input{
  height: 20px;
   width: 200px;
  font-size: 14px;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
}
  }
  .btn{
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    color:#FFFFFF;
    button{
      background-color: #FE6A00;
      color: #FDC399;
    
    }
  }
}
</style>
