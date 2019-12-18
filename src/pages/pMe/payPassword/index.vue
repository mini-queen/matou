<template>
  <div class="container">
    <div class="hr"></div>
   <div class="form">
     <div class="card" @click="setPayPassword">
       <span>设置支付密码</span>
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
      // 修改支付密码
      setPayPassword (maid) {
        wx.navigateTo({url: `/pages/pMe/setpayPassword/main`})
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
 
  .form{
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin-top: 10px;
    .card{
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
