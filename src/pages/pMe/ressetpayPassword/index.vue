<template>
  <div class="container">
    <div class="hr"></div>
   <div class="form">
     <div class="card" @click="changePassword">
       <span>修改支付密码</span>
       <span> <img src="/static/images/arrow.png" alt=""></span>
     </div>
      <div class="card" @click="resetPassword">
       <span>重置支付密码</span>
       <span> <img src="/static/images/arrow.png" alt=""></span>
     </div>
   </div>
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
      changePassword () {
        wx.navigateTo({
          url: '/pages/pMe/changepayPassword/main'
        })
      },
      resetPassword () {
         wx.navigateTo({
          url: '/pages/pMe/setpayPassword/main'
          // 重置支付密码  理论上应该验证手机号
        })
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
 .hr{
   width: 100px;
   height: 10px;
   background-color: #f7f7f7;
 }
  .form{

    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    height: 102px;
    .card{
      background-color: #fff;
      height: 50px;
      width: 100%;
      padding: 0 15px;
      line-height: 50px;
      display: flex;
      flex-direction: row;
      justify-content:space-between;
      align-items: center;
      box-sizing: border-box;
      span{
        img{
          width: 5.5px;
          height: 10px;
        }
      }
    }
  }
}
</style>
