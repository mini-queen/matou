<template>
<div class="container">
  <div class="details">
    <div class="img"><img :src="baseSrc +rulePic" alt=""></div>
    <div class="price"><span> </span>{{ruleAmount}}</div>
    <div class="btn" @click="payForCoupon"><button>立即购买</button></div>
    <div class="other">查看其他会员专享活动</div>
  </div>
  <div class="meinfo">
    <div class="title">会员专享说明：</div>
    <p>1、会员专享活动为店铺专门为广大用户推出的优惠专享活动；</p>
<p>2、用户购买24瓶晟不分梨酒，获得店铺会员卡内余额6888.88 元；支付成功立即到账；</p>
<p>3、余额可以继续在便利码头平台消费使用；</p>
<p>4、购买的商品将以优惠券形式发送到账户，用户可凭优惠券到店铺取货。</p>
  </div>
  </div>
</template>
<script>
  import {wxPartnerPay} from '@/utils/api'
  export default {
    data () {
      return {
        baseSrc: this.$baseUrl,
        ruleAmount: '',
        rulePic: ''
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
      this.ruleAmount = this.$mp.query.ruleAmount
      this.rulePic = this.$mp.query.rulePic
      console.log(this.$mp.query)
    },
    onUnload () {
  
    },
    methods: {

      payForCoupon () {
        wx.navigateTo({url: `/pages/pIndex/goodPay/main?payFlag=couponPay&payMoney=${this.ruleAmount}`})
      }
  
    }
  }
</script>

<style lang="less" scope>
page{
  background-color:#F7F7F7;
}
.container {
  color: @primary;
  font-size: @fs44;
  .details{
    padding: 20px 15px;
    background-color: #fff;
    .img{
       width:345px;
      height:115px;
      img{
        width:345px;
        height:115px;
      }
    }
    .price{
      font-size: 30px;
      margin: 47.5px 0 40px 0;
      text-align: center;
      span{
        font-size: 25px;
      }
    }
    .btn{
      button{
        background-color: #FE6A00;
        color: #fff;
      }
    }
    .other{
      margin: 25px 0 20px 0;
      font-size: 12px;
      width: 100%;
      text-align: center;
      color: #999999;
    }
  }
  .meinfo{
      width: 100%;
      padding: 25px 15px;
      box-sizing: border-box;
    .title{
      font-size:13px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(120,120,120,1);
    }
    >p{
       font-size:12px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(120,120,120,1);
    }
  }
}
</style>
