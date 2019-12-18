<template>
  <div class="container">
    <div class="successIcon">
      <img src="/static/images/okstatus.png" alt="">
    </div>
    <div class="tips">恭喜您，密码重置成功</div>
    <div class="btn" @click="handle">立即登录</div>
  </div>
</template>
<script>
  
  export default {
    data () {
      return {

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
      handle: function () {
        wx.reLaunch({ // 界面重定向到登录页
          url: '/pages/pMe/loginPassword/main'
        })
      }
    }
  }
</script>

<style lang="less" scope>
page{
  background-color: #f7f7f7f7;
}
.container {
  color: @primary;
  font-size: @fs44;
  .successIcon{
    margin-top: 124px;
    text-align: center;
    width: 100%;
    img{
      width: 65px;
      height: 65px;
      margin: 0 auto;
    }
  }
  .tips{
    width: 100%;
    margin-top: 40px;
    margin-bottom: 50px;
    text-align: center;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
  .btn{
    width:345px;
    height:45px;
    background:rgba(254,106,0,1);
    border-radius:5px;
    color: #fff;
    margin: 0 auto;
    text-align: center;
    line-height: 45px;
  }
}
</style>
