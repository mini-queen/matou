<template>
  <div class="container">
    <div class="hr"></div>
   <div class="form">
     <div class="card" @click="refundApplyRequest('10')">
       <div class="left">
         <img src="/static/images/tuikuan1.png" alt="">
         <div class="content" >
           <span>我要退货退款</span>
           <span>已收到货，需要退还已收到的货物</span>
         </div>
         </div>
       <span> <img src="/static/images/arrow.png" alt=""></span>
     </div>
      <div class="card" @click="refundApplyRequest('20')">
         <div class="left">
         <img src="/static/images/tuikuan2.png" alt="">
         <div class="content"  >
           <span>我要退款(无需退货)</span>
           <span>未收到货，或与商家协商之后申请</span>
         </div>
         </div>
       <span> <img src="/static/images/arrow.png" alt=""></span>
     </div>
   </div>
   <div class="tips">为了退款流程顺利，请在申请退款前与商家先行沟通</div>
  </div>
</template>
<script>
  // import {refundApplyRequest, getMyAccount} from '../../utils/api'
  export default {
    data () {
      return {
        orderId: '',
        money: 0 // 退款金额
      }
    },
    onLoad (option) {
      console.log(option.orderId, 'option.orderId', option.money)
      this.orderId = option.orderId
      this.money = option.money
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
      // this.orderId = this.$root.$mp.query.orderId
    },
    onUnload () {
      this.money = 0
    },
    methods: {
      refundApplyRequest: async function (refundMeth) {
           wx.navigateTo({
             url: '/pages/pOrder/refund/main?money=' + this.money + '&refundMeth=' + refundMeth + '&orderId=' + this.orderId
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
    // height: 102px;
    .card{
      background-color: #fff;
      height: 75px;
      width: 100%;
      padding: 0 15px;
      // line-height: 50px;
      display: flex;
      flex-direction: row;
      justify-content:space-between;
      align-items: center;
      box-sizing: border-box;
      .left{
        width: 250px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        img{
          width: 23px;
          height: 23px;
          
        }
        .content{
          display: flex;
        flex-direction: column;
        justify-content: flex-start;
          span:first-child{
            font-size:14px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1); 
          }
          span:last-child{
            font-size:12px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(120,120,120,1);
            margin-top: 5px;

          }
          } 
      }
      span{
        img{
          width: 5.5px;
          height: 10px;
        }
      }
    }
  }
  .tips{
    width: 100%;
    margin-top: 60px;
    text-align: center;
    font-size:12px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(153,153,153,1);
  }
}
</style>
