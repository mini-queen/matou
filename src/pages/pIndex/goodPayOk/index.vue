<template>
<div class="container">
    <image class="success" src="https://sniu.2dian.com/xcx/static/matou/success.png"></image>
    <div class="des">支付成功 !</div> 
    <div class="button" v-if="flag!=1" @click="handle">查看订单</div> 
</div>
</template> 

<script>
  
  export default {
    data () {
      return {
        flag: 0 // 1为vip 和 合伙人支付
  
      }
    },
    onLoad (option) {
      console.log(option.flag, 'option.flag: ')
      this.flag = option.flag // 1为vip 和 合伙人支
      // 1为vip 和 合伙人支付, 跳转到会员列表
      if (this.flag == 1) {
        setTimeout(function () {
             wx.switchTab({
              url: '/pages/member/detail/main'
            })
          }, 2000)
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
        wx.navigateTo({
          url: '/pages/pIndex/orderList/main'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    .container{
        font-size:30rpx;
        background:#fff;
        padding-top:150rpx;
        text-align:center;
        color:#333;
        
        .success{
            width:130rpx;
            height:130rpx;  
        }
        .des{
           font-size:40rpx;
           padding-top:64rpx; 
           padding-bottom:110rpx; 
        }
        .button{
            width:282rpx;
            height:80rpx;
            line-height: 80rpx;
            background: @color-orange;
            color:#fff;
            border-radius: 10rpx;
            margin:0 auto;
        }
    }
</style>