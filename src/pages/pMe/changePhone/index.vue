<template>
  <div class="container">
   <div class="phoneform">
     <div class="phone">
       <span>新手机号</span> 
       <input type="text" v-model="mobile" placeholder="请输入手机号" placeholder-style="color:#CCCCCC">
     </div>
     <div class="code"><span>验证码</span>
      <input type="text" v-model="m_code" placeholder="请输入验证码" placeholder-style="color:#CCCCCC">
      <div class="getCode" @click="getCode">{{getCodeStr}}</div>
     </div>
   </div>
   <div class="btn" @click="goBind">确定</div>
   
   </div>
</template>
<script>
  import {bindingPhoneNum, getCode} from '@/utils/api'
  export default {
    data () {
      return {
         mobile: '',
      type: 'bindPhone',
      m_code: '',
      getCodeStr: '获取验证码'
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
  
    },
    onUnload () {
      // this.mobile = ''
      // this.m_code = ''
    },
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
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: '失败,发生未知错误',
          icon: 'success',
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
 
  .phoneform{
    width: 100%;
    height: 111px;
    padding: 20px 32.5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .phone{
      width: 100%;
      border-bottom: 1px solid rgba(229,229,229,1);
      box-sizing:  border-box;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: 30px;
      line-height: 30px;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      img{
        width: 17px;
        height: 17px;
      }
      input{
        margin-left: 14px;
        width: 190px;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(204,204,204,1);
      }
    }
    .code{
      width: 100%;
      border-bottom: 1px solid rgba(229,229,229,1);
      box-sizing:  border-box;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: 30px;
      line-height: 30px;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      img{
        width: 17px;
        height: 17px;
      }
       input{
        margin-left: 14px;
        width: 180px;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(204,204,204,1);
      }
      .getCode{
        width: 65px;
        height: 20px;
        border-radius: 5px;
        text-align: center;
        line-height: 20px;
        font-size:11px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        border: 1px solid #787878;
      }
    }
  }
  .btn{
    margin:  0 auto;
    background-color: #FE6A00;
    color: #FFFFFF;
    width: 310px;
    height: 45px;
    border-radius: 22.5px;
    text-align: center;
    line-height: 45px;
    margin-top: 50px;
  }
  .hr{
    width: 100%;
    height: 10px;
    background-color: #F7F7F7;
    margin-top: 30px;
  }
  
  
}
</style>
