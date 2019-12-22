<template>
  <div class="container">
    <!-- {{msg}} -->
     <a href="/pages/pIndex/shopDetail/main" class="more-link">店铺详情</a> 
    <a href="/pages/pIndex/merchantDetail/main" class="more-link">商家详情</a>
    <a href="/pages/pIndex/goodDetail/main" class="more-link">代销商品详情</a> 
    <a href="/pages/pIndex/goodOrder/main" class="more-link">代销商品提交订单</a> 
    <a href="/pages/pIndex/goodPay/main" class="more-link">代销商品支付</a> 
    <a href="/pages/pIndex/goodPayOk/main" class="more-link">代销商品支付成功</a> 
    <a href="/pages/pIndex/orderList/main" class="more-link">订单</a> 
    <a href="/pages/pIndex/orderDetail/main" class="more-link">订单详情</a> 
    <a href="/pages/pIndex/valueDetail/main" class="more-link">超值商品详情</a>
    <a href="/pages/pIndex/valueOrder/main" class="more-link">超值提交订单</a>
    <a href="/pages/member/detail/main" class="more-link">会员中心</a>
    <a href="/pages/pEncyclopedia/member/joinVip/main" class="more-link">开通vip会员</a>
    <a href="/pages/pEncyclopedia/member/joinCopartner/main" class="more-link">开通店铺合伙人</a>
    <a href="/pages/pEncyclopedia/detail/main" class="more-link">生活百科</a>
    <a href="/pages/pMe/setting/main" class="more-link">我的设置</a>
    <a href="/pages/pMe/transaction/main" class="more-link">交易记录</a>
    <a href="/pages/pOrder/shopMap/main" class="more-link">店铺地图</a>
    <a href="/pages/pOrder/shopOrder/main" class="more-link">店铺商品-提交订单</a>
    <a href="/pages/pOrder/payment/main" class="more-link">输入支付密码</a>
    <a href="/pages/pOrder/withdraw/main" class="more-link">申请提现</a>
    <a href="/pages/pIndex/index/main" class="more-link">首页</a>  
    <a href="/pages/pMe/CouponList/main" class="more-link">优惠券列表</a>
    <a href="/pages/pEncyclopedia/memberActivity/main" class="more-link">会员活动</a>
    <a href="/pages/pMe/Coupon/main" class="more-link">展示优惠券</a>
    <a href="/pages/pMe/addAddress/main" class="more-link">新增收货地址</a>
    <a href="/pages/pOrder/orderRemark/main" class="more-link">订单备注</a>
    <a href="/pages/pIndex/typeGoodList/main" class="more-link">分类列表</a>
    <a href="/pages/pMe/addressList/main" class="more-link">地址列表</a>
    

    <button class="login-btn" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">微信登录</button>
  </div>
</template>
<script>

import {
  loginByWeixin
} from '../../../utils/user'

export default {
  data () {
    return {
      msg: '首页'
    }
  },
  computed: {

  },
  components: {

  },
  mounted () {
     // wx.setStorageSync('DIAN_TOKEN', 'ff09a43dfe91b7525d28ca37f4140b63')
  },
  onUnload () {

  },
  methods: {

    bindGetUserInfo () {
      wx.showLoading({
        title: '正在登录...'
      })
      loginByWeixin().then(res => {
        console.log('doLogin..')
        if (res.statusCode === 500) {
          wx.showToast({
            title: '未配置小程序ID',
            mask: true
          })
          return
        }
        console.log(res.data.userInfo)
        this.setData({
          userInfo: res.data.userInfo,
          showLogin: false,
          isShowCoupon: true
        })

        wx.hideLoading()
      }).catch((err) => {
        console.log(err)
        wx.hideLoading()
      })
    }

  }
}
</script>

<style lang="less" scope>
.container {
  color: @primary;
  font-size: 12px;
  text-align:center;

  a{
    margin-top:10px;
    color:#FE6A00
  }
  .login-btn{
    width: 100%;
    height: 98rpx;
    line-height: 98rpx;
    background: #09BB07;
    margin-top: 30rpx;
    // position: fixed;
    // bottom: 10%;
    // left: 0;
    // z-index: 100000;
    border-radius: 0;
    color: #fff;
    font-size: 28rpx;
  }
}
</style>
