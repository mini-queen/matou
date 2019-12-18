<template>
<div class="header-user flex">
    <div> 
        <img class="user-avatar" :src="avatorImg" alt="avator">
        <span class="user-name">{{nick}}</span>
    </div>
    <div class="button-wrap" v-if="userType == 0">
      <span class="user-button">普通用户</span>
    </div>
    <!-- vip/合伙人 -->
    <div class="button-wrap" :data-userType ="userType" v-if="userType == 1">
        <div class="out-img">会员</div>
        <span class="fee-button">续费</span>
    </div>
        <div class="button-wrap" v-if="userType == 3">
        <div class="out-img">合伙人</div>
        <span class="fee-button">续费</span>
    </div>
    <div class="time" v-if="userType != 0">
      <slot></slot> 
    </div>
</div>
</template>
<script>
export default{
  name: 'headser-user',
  props: {
    userType: {
      type: String,
      default: ''
    },
    avatorImg: {
      type: String,
      default: ''
    },
    nick: {
      type: String,
      default: '用户名'
    }
  },
  data () {
    return {
      avatorImg: '/static/images/shop.png'
    }
  },
  mounted () {
    console.log(this.userType)
  }
}
</script>  
<style lang="less" scoped>
.header-user{
    box-sizing: border-box;
    width:100%;
    padding:0 30rpx;
    height:142rpx;
    color:#fff;
    background-image: url(https://sniu.2dian.com/xcx/static/matou/memberbg.png);
    background-size:100% auto;
    font-size:12px;
    position: relative;
    .user-avatar{
      width:119rpx;
      height:119rpx;
      border-radius: 50%;
      vertical-align: middle;
    }
    .user-name{
      font-size:36rpx;
      margin-left:38rpx;
      vertical-align: middle;
    }
     .time{
        position:absolute;
        right:30rpx;
        bottom:10rpx;
        font-size:20rpx;
      }
    .button-wrap{
       vertical-align: middle;
       .user-button{
        padding:8rpx 26rpx;
        font-size:20rpx;
        border-radius: 50rpx;
        vertical-align: middle;
        background: #feaf30; 
      }
      .out-img{
        margin-top:-10rpx;
        display: inline-block;
        width:124rpx;
        height:57rpx;
        line-height: 57rpx;
        text-align:center;
        font-size:20rpx;
        color:#fff;
        vertical-align: middle;
        background-image:url(https://sniu.2dian.com/xcx/static/matou/vip.png);
        background-position: -4rpx -4rpx;
        background-size:100% 100%;
        background-repeat: no-repeat;
      }
      .fee-button{
        box-sizing:border-box;
        font-size:20rpx;
        padding:6rpx 20rpx;
        color:#FE6A00;
        border-radius: 18rpx;
        border:1rpx solid #FE6A00;
        margin-left:30rpx;
        vertical-align: middle
      }
     
    }
  }
</style>