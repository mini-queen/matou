<template>
<div class="order-detail-wrap" v-if="orderInfo">
    <div class="header-status">
        <div class="status">
            {{orderStatusMap[orderInfo.orderState]}}订单
        </div>
        <div class="time">
            <!-- 剩余29分58秒自动关闭 -->
            <!-- {{orderInfo.orderPayTime}} -->
        </div>
    </div>
    <!-- 配送方式-->
   <div class="delivery-method-wrap">
       <!-- 商家配送 -->
       <div class="method-wrap" v-if="orderInfo.mailMethod == 20">
           <div class="receipter-address flex">
               <div><image class="address-img" src="https://sniu.2dian.com/xcx/static/matou/address.png"></image></div>
                <div>
                    <div class="name">{{orderInfo.mailUserName}} &nbsp;&nbsp;{{orderInfo.mailUserPhone}}</div>
                    <div class="address">{{orderInfo.mailUserAddress}}</div>
                </div>
           </div>
           <div class="method-detail">
               <div class="item">配送方式：商家配送</div>  
               <div class="item flex">
                   <span>配送员：{{orderInfo.deliverUserName}} </span>
                   <span>
                       <image class="phone-img" src="https://sniu.2dian.com/xcx/static/matou/phone.png"></image>
                       <span style="padding-left:30rpx">{{orderInfo.deliverUserPhone}}</span>
                   </span>
                </div> 
                <div class="item"> 送达时间：{{orderInfo.deliverCompleteTime}} </div>
            </div>  
       </div>
       <!-- 快递 -->
       <div class="method-wrap" v-if="orderInfo.mailMethod == 30">
           <div class="receipter-address flex">
                <div><image class="address-img" src="https://sniu.2dian.com/xcx/static/matou/address.png"></image></div>
                <div>
                    <div class="name"> {{orderInfo.mailUserName}}&nbsp;&nbsp;{{orderInfo.mailUserPhone}}</div>
                    <div class="address">{{orderInfo.mailUserAddress}}</div>
                </div>
           </div>
           <div class="method-detail">
                <div class="item">配送方式：快递</div>  
            </div>  
       </div>
        <!-- 到店自提 -->
       <div class="method-wrap" v-if="orderInfo.mailMethod	== 10">
           <div class="method-detail">
               <div class="item">配送方式：到店自提</div> 
                <div class="item">商家地址：{{orderInfo.mailUserAddress}}</div>  
                <div class="item">联系方式：{{orderInfo.mailUserPhone}}</div>
                <div class="item">提货时间：{{orderInfo.deliverCompleteTime}}</div>
           </div>
       </div>
   </div>
   <!-- 商品详情 -->
   <div class="good-detail-wrap" v-if="orderInfo.orderGoodDetail">
       <div >
            <div class="shop-name flex" @click="goShopDetail(orderInfo.shopId)">
                <span>{{orderInfo.shopName}}</span>
                <image src="/static/images/arrow.png" class="arrow-img"></image>
            </div>
            <div class="good-list">
                <div class="good-item flex" v-for="(item,index) in orderInfo.orderGoodDetail" :key="index">
                    <image class="good-img" :src="baseUrl+item.gPic"></image>
                    <div class="good-detail">
                        <div class="flex">
                            <span style="width: 420rpx;">{{item.gTitle}}</span>
                            <span> ¥{{item.gPrice}}</span>
                        </div>
                        <div class="flex" style="font-size:26rpx;color:#787878">
                            <span>x {{item.goodCount}}</span>
                            <span style="text-decoration:line-through"> ¥{{item.gOriginalPrice}}</span>
                        </div> 
                    </div>
                </div>
            </div>
            <div class="good-des" v-if="orderInfo.mailMethod != 10">
                <div class="flex" v-if="orderInfo.packMoney > 0">
                    <span>包装费</span>
                    <span> ¥{{orderInfo.packMoney}}</span>
                </div>
                <div class="flex" style="margin-top:40rpx">
                    <span>配送费<span class="color-grey">（根据实际距离自动计算运费）</span></span>
                    <span> ¥{{orderInfo.mailMoney}}</span>
                </div>
            </div> 
            <!-- <div class="good-des flex">
              <span><span class="cut-img">减</span>满减优惠</span>
              <span class="color-orange">- {{orderInfo.orderCouponPrice}}</span>
            </div> -->
            <div class="good-des flex">
              <!-- <span class="color-grey">已优惠&nbsp;&nbsp;<span class="color-orange"> {{orderInfo.orderCouponPrice}}</span></span> -->
              <span class="color-grey">小计 <span class="amount"> ¥{{orderInfo.orderTotalPrice}}</span></span>
            </div> 
            <!-- 拨打电话 -->
            <div class="shop-phone" @click="callPhone">
               <image class="phone-img" src="/static/images/phone_call.png"></image> 
               <span class="phone-text">拨打电话</span>
            </div>  
        </div>
   </div>
   <!-- 订单详情 -->
   <div class="order-detail">
       <div class="detail-item flex">
            <span>订单号码</span>
            <span>{{orderInfo.orderId}}</span>
       </div>
        <div class="detail-item flex">
            <span>下单时间</span>
            <span>{{orderCreatetime}}</span>
       </div>
        <div class="detail-item flex" v-if="orderInfo.orderState != 0 && orderInfo.orderState != 4">
            <span>支付方式</span>
            <span>{{payMethodMap[orderInfo.payMethod]}}</span>
       </div>
        <div class="detail-item flex" v-if="orderInfo.orderState != 0 && orderInfo.orderState != 4">
            <span>支付时间</span>
            <span>{{orderPayTime}}</span>
       </div>
        <div class="detail-item flex">
            <div style="width:100rpx;">备注</div>
            <div style="padding-left:30rpx">
                 {{orderInfo.orderUserMark}}
            </div>
       </div>


       <div class="detail-item flex" v-if="orderInfo.orderState === 3||orderInfo.orderState === 7">
           <div v-if="orderInfo.mailMethod=='10'">
                <span>取货时间</span>
                <span>{{orderCompleteTimeLong}}</span>
            </div>
       </div>

       <div class="detail-item flex" v-if="orderInfo.orderState === 3||orderInfo.orderState === 7">
           <div v-if="orderInfo.mailMethod=='10'">
                <span>取货门店：</span>
                <span>{{orderInfo.shopName}}</span>
            </div>
       </div>

        <!-- <div class="detail-item flex">
            <span>如遇缺货</span>
            <span>缺货时电话与我沟通</span>
       </div> -->
   </div>
   <!-- 退款详情 /-->
   <div class="order-detail" v-if="orderInfo.orderRefundState != 0">
        <div class="detail-item flex">
            <span>退款状态</span>
            <span class="color-orange">{{orderRefundStateMap[orderInfo.orderRefundState]}}</span>
       </div>
        <div class="detail-item flex">
            <span>申请退款时间</span>
            <span>{{applyTime}}</span>
       </div>
        <div class="detail-item flex">
            <span>退款类型</span>
            <span class="color-orange">
                {{refundMethMap[orderInfo.orderShopGoodsRefundApply.refundMeth]}}-{{refundScopeMap[orderInfo.orderShopGoodsRefundApply.refundScope]}}
            </span>
       </div>
        <div class="detail-item">
            <div class="detail-good-label">退款商品</div>
            <div class="detail-good-item flex" v-for="(item,index) in orderInfo.orderGoodDetail" :key="index">
                <image class="good-img" :src="baseUrl+item.gPic"></image>
                <div class="good-item">
                    <div class="good-item-title">{{item.gTitle}}</div>
                    <div class="good-item-price"> ¥{{item.gPrice}}</div>
                </div>
                <div class="good-item-num">
                    退{{item.goodCount}}件
                </div>
            </div>
           
        </div>
        <div class="detail-item flex">
            <span>申请退款金额</span>
            <span>¥{{orderInfo.orderShopGoodsRefundApply.refundApplyPrice}}</span>
       </div>
        <div class="detail-item flex">
            <span>退款原因</span>
            <span>{{orderInfo.orderShopGoodsRefundApply.refundReason}}</span>
       </div>
        <div class="detail-item flex" v-if="orderInfo.orderShopGoodsRefundApply.refundRealPrice">
            <span>退款说明</span>
            <span></span>
       </div>
       <div class="detail-item flex" v-if="orderInfo.orderShopGoodsRefundApply.refundDealTime">
            <span>退款时间</span>
            <span>{{orderInfo.orderShopGoodsRefundApply.refundDealTime}}</span>
       </div>
        <div class="detail-item flex" v-if="orderInfo.orderShopGoodsRefundApply.refundRealPrice">
            <span>退款金额</span>
            <span>¥{{orderInfo.orderShopGoodsRefundApply.refundRealPrice}}</span>
       </div>
       <div class="button-group flex" v-if="orderInfo.isSupportReturn == 1&&orderInfo.orderRefundState != 1 &&orderInfo.orderSource==20">
           <span class="auto-button" @click="doShowApply">申请平台介入</span>
           <!-- <span class="auto-button bg-orange">修改退款申请</span> -->
       </div>
   </div>
   <!-- 底部 -->
   <div class="footer flex">
        <!-- <span class="auto-button">取消订单</span> -->
        <!-- 待支付 -->
        <div v-if="orderInfo.orderState == 0">
            <span class="auto-button" @click="doCancelOrder(orderId)">取消订单</span>
            <span class="auto-button bg-orange" @click="gotoPay">去支付</span>
        </div>

         <!-- 确认收货 -->
        <div v-if="orderInfo.mailMethod==30&&(orderInfo.orderState == 1||orderInfo.orderState == 2)">
            <span class="auto-button bg-orange" @click="doConfirmOrder(orderId)">确认收货</span>
        </div>

         <!-- 取货 -->
        <div v-if="(orderInfo.orderState == 1&&orderInfo.mailMethod==10)||(orderInfo.orderState == 2&&orderInfo.mailMethod==10)">
            <!-- 自提10 -->
            <span class="auto-button bg-orange" @click="showGetGoodPicture(orderInfo)" >取货</span>
        </div>

        <!-- 已完成 -->
        <div v-if="orderInfo.orderSource!=10&&(orderInfo.orderState == 3||orderInfo.orderState ==4||orderInfo.orderState ==5||orderInfo.orderState ==6||orderInfo.orderState ==7)">
            <span class="auto-button" @click="doBuyAgainOrder(orderId)">再来一单</span>
        </div>
         <!-- 退款 -->
         <div v-if="orderInfo.isSupportReturn == 1">
            <span class="auto-button" v-if="orderInfo.orderRefundState == 1">退款处理中</span>
            <span class="auto-button" @click="rebackMoney(orderId)" v-if="orderInfo.orderRefundState!=1 && orderInfo.orderSource!=10">退款</span>
         </div>
         <!-- 邀请奖励 -->
         <div v-if="orderInfo.isSupportGroup == 1">
             <button open-type='share' class="btn">
                <span class="auto-button2 bg-orange2">邀好友赚奖励</span>
            </button>
            
         </div>
   </div>

   <!-- <div class="footer flex" v-if="orderInfo.orderState == 1 || orderInfo.orderState == 2">
        <span class="auto-button">退款</span>
        <span class="auto-button bg-orange">确认收货</span>
   </div> -->
   <!-- 申请平台介入 -->
   <div class="my-picker-wrap" v-if="isShow" catchtouchmove="return">
    <div>
          <div class="flatform-apply">
                <div class="title">
                    申请平台介入
                    <image class="close-img" src="/static/images/close.png" @click="close"></image>
                    </div>
                <div class="content">
                    如遇订单退款/退货问题，请联系平台客服。
                    <div class="img-wrap">
                        <div class="img-title">平台客服</div>
                        <image class="wx-img" src="http://sniu.2dian.com/xcx/static/matou/erweima.png"></image>
                    </div>
                </div>
                <div class="bottom">
                    拨打电话400-011-1818
                </div>
          </div>
     </div>
  </div>
    <!-- <my-picker ref="apply" position="center">   
    </my-picker> -->
</div>
</template>
<script>
import MyPicker from '../../../components/my-picker'
import {formatTime} from '../../../utils/util'
import {orderDetail, confirmOrder, cancelOrder, buyAgainOrder} from '@/utils/api.js'
export default {
  components: {MyPicker},
  data () {
    return {
        baseUrl: this.$baseUrl,
        publicShare: this.$publicShare,
        orderId: null, // 订单ID
        orderStatusMap: {0: '待支付', 1: '待收货', 2: '已发货', 3: '已收货', 4: '已取消（超时）', 5: '已取消（退货）', 6: '已取消（未取）', 7: '已完成（部分退货）'},
        payMethodMap: {0: '码粒支付', 1: '支付宝', 2: '微信支付', 3: '店铺余额', 4: '连锁余额'},
        orderRefundStateMap: {0: '未退', 1: '退款中', 2: '退款已完成'},
        refundMethMap: {10: '我要退货退款', 20: '我要退款'},
        refundScopeMap: {10: '整单退款', 20: '部分退款'},
        orderInfo: { // 订单信息
            orderShopGoodsRefundApply: {} // 退款状态
        },
        // showPlatform: true,
        orderCreatetime: '', // 订单创建时间
        orderPayTime: '', // 支付时间
        isShow: false, // 是否显示平台接入弹窗
        orderCompleteTimeLong: '', // 取货时间
        applyTime: '' // 申请退款时间
    }
  },
  mounted () {
    this.getDetail()
  },
  onLoad (option) {
      console.log('option.orderId: ', option.orderId)
      this.orderId = option.orderId
  },

  onUnload () {
      this.orderInfo = {
          orderShopGoodsRefundApply: {}
      }
      this.orderId = null
      this.isShow = false
  },
  onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      let token = wx.getStorageSync('DIAN_TOKEN')
      return {
        title: '邀请好友赚取奖励',
        path: '/pages/index/main?token=' + token,
        imageUrl: this.publicShare
      }
    },
  methods: {
    // close () {
    //   this.isShow = false
    // },
    // doShowApply () {
    //   console.log('showApply...')
    //   this.isShow = true
    // },

    // 1.订单详情
    async getDetail () {
       wx.showLoading({
          title: '加载中'
       })
        console.log('getDetail...')
        let params = {
            orderId: this.orderId
        }
        let result = (await orderDetail(params)).result.result
        this.orderInfo = result
        wx.hideLoading()
        console.log('orderInfo: ', this.orderInfo)
        this.orderCreatetime = formatTime(new Date(this.orderInfo.orderCreateTime))
        this.orderPayTime = formatTime(new Date(this.orderInfo.orderPayTime))
        this.orderCompleteTimeLong = formatTime(new Date(this.orderInfo.orderCompleteTimeLong))
        console.log(this.orderInfo.mailMethod, 'mailMethod')
        console.log(this.orderInfo.orderRefundState, 'orderShopGoodsRefundApply')
        console.log(result, '详情')

        if (this.orderInfo.orderShopGoodsRefundApply.applyTime) {
            this.applyTime = this.orderInfo.orderShopGoodsRefundApply.applyTime.slice(0, 10)
        }
    },

    callPhone () {
        console.log('call phone')
        wx.makePhoneCall({
            phoneNumber: this.orderInfo.shopTel,
            success: (res) => {
                console.log(res)
            }
        })
    },
    // 确认收货
    async doConfirmOrder (orderId) {
      let params = {
        oId: orderId
      }
      let result = (await confirmOrder(params)).result
      console.log(result.errCode, 'doConfirmOrder errCode')
      if (result.errCode == 'USER_200') {
          wx.showToast({title: '操作成功', icon: 'none'})
         // this.getList()
         setTimeout(function () {
                 wx.navigateBack({
                  delta: 1
                  })// 返回上一页面
              }, 2000)
      } else {
          wx.showToast({title: result.errMsg, icon: 'none'})
      }
    },
    // 取消订单
    async doCancelOrder (orderId) {
      let params = {
        oId: orderId
      }
      let result = (await cancelOrder(params)).result
      console.log(result.errCode, 'doCancelOrder errCode: ')
      if (result.errCode == 'USER_200') {
          wx.showToast({title: '操作成功', icon: 'none'})
          setTimeout(function () {
                 wx.navigateBack({
                  delta: 1
                  })// 返回上一页面
              }, 2000)
          // this.getList()
      } else {
          wx.showToast({title: result.errMsg, icon: 'none'})
      }
    },

    // 再来一单
    async doBuyAgainOrder (orderId) {
      let params = {
        oId: orderId
      }
      console.log('doBuyAgainOrder')
      console.log('params: ', params)
      let result = (await buyAgainOrder(params)).result
      console.log(result.errCode, 'doCancelOrder errCode: ')
      console.log(result.result.shopId, 'result.result.result.shopId: ')
      console.log(result.result.gbSalePlat, 'gbSalePlat: ')
      if (result.errCode == 'USER_200') {
          wx.showToast({title: '操作成功', icon: 'none'})
          wx.navigateTo({
              url: '/pages/pIndex/shopDetail/main?id=' + result.result.shopId + '&gbSalePlat=' + result.result.gbSalePlat
          })
      } else {
          wx.showToast({title: result.errMsg, icon: 'none'})
      }
    },
    // 退款
    rebackMoney (orderId) {
      wx.navigateTo({
        url: '/pages/pOrder/refundMenu/main?orderId=' + orderId + '&money=' + this.orderInfo.orderTotalPrice
      })
    },
    // 去支付
    gotoPay () {
       console.log('orderId: ', this.orderId)
       wx.navigateTo({url: `/pages/pIndex/goodPay/main?orderId=` + this.orderId})
    },
    // 跳转店铺详情
    goShopDetail (id) {
        wx.navigateTo({
              url: '/pages/pIndex/shopDetail/main?id=' + id
          })
    },
    // 显示提货二维码
    showGetGoodPicture (item) {
       // 是否显示门店列表
       let isShowShopList = 0 // 0不展示 1为展示
       if (item.mailMethod == '10' && item.orderSource == '10') {
          isShowShopList = 1
       }
      wx.navigateTo({
        url: '/pages/pMe/Coupon/main?flag=2&shopId=' + item.shopId + '&shopTitle=' + item.shopName + '&isShowShopList=' + isShowShopList + '&orderShopId=' + item.orderShopId + '&goodNumber=' + item.goodNumber + '&goodUnit=' + item.goodUnit + '&reqDecryStr=' + item.reqDecryStr + '&orderId=' + item.orderId
      })
    }
  }
}
</script>
<style lang="less" scoped>
.btn{
margin-left: 0px;
&::after {
    border: none;
}
}
button[btn]{
    &::after{
        content: "";
        width: 0;
        height: 0;
        background: transparent;
        font-size: 14px;
    }
}

.my-picker-wrap{
    position: fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    z-index:9999;
    background:rgba(0,0,0,.36);
    text-align:center;
    font-size:30rpx;
    visibility:block;
    transition: visibility .2s linear;
    &.hidden{
       visibility: hidden;
        .my-picker{
            height: 0;
        }
    }
   .my-picker{
        position:absolute;    
        bottom:30rpx;
        left:30rpx;
        right:30rpx;
        height:300rpx;
        transition:height .2s linear;
        .content{
            border-radius: 10rpx;
            background: #fff;
            .item{
                line-height:90rpx;
                height:90rpx;
                border-bottom:1rpx solid @line;
                &:last-of-type{
                    border-bottom:none;
                }
            }
        }
        .cancle{
            background: #fff;
            border-radius: 10rpx;
            margin-top:4rpx;
            line-height:90rpx;
            height:90rpx;
        }
   }
   
}

.order-detail-wrap{
    font-size:28rpx;
    background: @color-bg;
    color:@primary;
    padding-bottom:140rpx;
    .arrow-img{
        width:16rpx;
        height:30rpx;
    }
    .good-img{
        width:100rpx;
        height:100rpx;
    }
    .phone-img{
        width:40rpx;
        height:40rpx;
        vertical-align: middle;  
    }
    .wx-img{
        width: 194rpx;
        height:194rpx;
    }
    .cut-img{
        font-size:24rpx;
        padding:4rpx 6rpx;
        color:#fff;
        background: @color-orange;
        border-radius:5rpx;
        margin-right:20rpx; 
    }
    .close-img{
        width:30rpx;
        height:30rpx;
    }
    .color-grey{
        color:@grey;
    }
    .color-orange{
        color:@color-orange;
    }
    .auto-button{
        padding:16rpx 30rpx;
        border-radius: 30rpx;
        border:1rpx solid @line;
        margin-left:30rpx;
        &.bg-orange{
            background: @color-orange;
            color:#fff;
        }
    }
     .auto-button2{
        padding:16rpx 30rpx;
        border-radius: 30rpx;
        // border:1rpx solid @line;
        margin-left:0rpx;
        font-size: 14px;
        background: transparent;
        &.bg-orange2{
            background: @color-orange;
            color:#fff;
        }
    }
    .header-status{
        height:200rpx;
        width:100%;
        text-align:center;
        background:@color-orange;
        color:#fff;
        .status{
            font-size:50rpx;
            padding-top:44rpx;
        }
        .time{
            font-size:24rpx;
            padding-top:10rpx;
        }
    }
    .delivery-method-wrap{
        width:100%;
        padding:0 30rpx;
        background: #fff;
        margin-top:20rpx;
        box-sizing: border-box;
        .address-img{
            width:50rpx;
            height:50rpx;
            padding-right: 20rpx;      
        }
        .method-wrap{
            .receipter-address{
                 border-bottom:1rpx solid @line;
                .name{
                    padding-top:48rpx;   
                }
                .address{
                  padding:30rpx 0;
                  color:@grey
                } 
            }
            .method-detail{
                padding:10rpx 0 60rpx 0;
                color:@grey;
                .item{
                    padding-top:30rpx;
                }
            }
        }
    }
    .good-detail-wrap{
        margin-top:20rpx;
        padding:30rpx;
        background: #fff;
        .shop-name{
            border-bottom:1rpx solid @line;
            padding:20rpx 0;
        }
        .good-list{
            border-bottom:1rpx solid @line;
            padding-bottom:40rpx;
            .good-item{
                margin-top:40rpx;
            }
            .good-detail{
                flex-grow:1;
                padding-left:20rpx;  
            }
        }
        .good-des{
            padding:40rpx 0;
            border-bottom:1rpx solid @line;
            justify-content: flex-end;
            .amount{
               font-size:40rpx;
               padding-left: 50rpx;
               color:@primary
            }
        }
        .shop-phone{
            width:100%;
            padding:50rpx 0;
            text-align:center;
            color:@grey;
            .phone-text{
                padding-left:20rpx;
                vertical-align: middle
            }
        }
    }
    .order-detail{
        margin-top:20rpx;
        background: #fff;  
        padding:0 30rpx;
        box-sizing: border-box;
        color:@grey;
        .detail-item{
            padding:40rpx 0;
            border-bottom:1rpx solid @line; 
            .detail-good-label{
                padding-bottom:30rpx;
            }
            .detail-good-item{
                .good-item{
                    flex-grow:1;
                    justify-content: flex-start;
                    padding-left:14rpx;
                    .good-item-title{
                        color:#333;
                    }
                    .good-item-price{
                        color:@color-orange;
                        font-size:24rpx;
                        line-height: 84rpx;
                    }
                    
                }
            }
        }
        .button-group{
            justify-content: flex-end;
            padding-top:64rpx;
            padding-bottom:40rpx;
        }
    }
    
    .footer{
        position: fixed;
        bottom:0;
        width:100%;
        height:98rpx;
        padding:0 30rpx;
        box-sizing: border-box;
        background: #fff;
        justify-content: flex-end;
    }
    .flatform-apply{
        position: absolute;
        width:650rpx;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        background: #fff;
        border-radius:10rpx; 
        .title{
            box-sizing: border-box;
            margin:0 30rpx;
            font-size:30rpx;
            height:90rpx;
            line-height:90rpx;
            text-align:center;
            border-bottom:1rpx solid @line;
            position: relative;
            color:#333;
            .close-img{
                position: absolute;
                right:30rpx;
                top:30rpx;
            }
        }
        .content{
            padding:40rpx 0;
            background: #fff;
            .img-wrap{
                width:276rpx;
                // height:298rpx;
                margin:60rpx auto;
                padding:20rpx 0;
                box-sizing: border-box;
                border:1rpx solid @line;
                .img-title{
                    padding-bottom:20rpx;
                }
            }
        }
        .bottom{
            width:100%;
            height:80rpx;
            line-height:80rpx;
            background:#FE6A00;
            color:#fff;
            text-align:center;
        }
    }
}
</style>