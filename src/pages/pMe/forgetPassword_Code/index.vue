<template>
  <div class="container">
   <div class="ipt"><div class="label">验证码</div><div><input v-model="code" type="text" placeholder="请输入验证码"></div><div class="getCode" @click="getCode">{{getCodeStr}}</div></div>
   <div class="btn"><button @click="VerifyCodehandle" :disabled='btnStatus' size="default">下一步</button></div>
  </div>
</template>
<script>
  import {getCode, VerifyCode} from '../../../utils/api'
  export default {
    data () {
      return {
        phone: '',
        btnStatus: false,
        code: '',
        getCodeStr: '获取验证码'
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
      this.phone = this.$root.$mp.query.phone
    },
    onUnload () {
  
    },
    methods: {
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
        var type = 'forget'// 验证码类型
        console.log(mobile, type)
        var res = await getCode({mobile, type})
        console.log(res)
      },
      VerifyCodehandle: async function () {
        var m_phone = this.phone
        var m_code = this.code
        var res = await VerifyCode({m_phone, m_code})
        console.log(res)
        if (res.result.errCode === 'USER_200') {
          wx.reLaunch({
            url: '/pages/pMe/forgetPasswordNewPwd/main?phone=' + m_phone + '&code=' + m_code
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
    margin: 10px 0px;
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
  width: 100%;
  font-size: 14px;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
}
.getCode{
        width: 68px;
        height: 26px;
        border-radius: 5px;
        margin-left: 60px;
        text-align: center;
        line-height: 26px;
        font-size:11px;
        font-family:PingFang SC;
        font-weight:400;
        color:#999999;
        border: 1px solid #787878;

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
