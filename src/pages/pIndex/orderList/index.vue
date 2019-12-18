<template>
  <div class="order-list-wrap">
    <div class="swipter-tab flex">
      <div class="swipter-tab-item" :class="{active:item.id == activeIndex?true:false}" v-for="(item,index) in tabItems" :key="index" @click="changeTab(item.id)">
        {{item.name}}
      </div>
    </div>
    <div class="order-list" v-if="orderList.records && orderList.records.length>0">
      <div class="order-item" v-for="(shopItem,key) in orderList.records" :key="key">
        <div class="item-title flex" v-if="shopItem.orderSource!=10">
          <div class="title">
            <image class="shop-img" src="https://sniu.2dian.com/xcx/static/matou/dianpu.png"></image>
            {{shopItem.shopTitle}}
          </div>
          <div class="color-orange">{{statusObject[shopItem.orderState]}}</div>
        </div>
        <div class="item-title flex" @click="goDetail(shopItem.orderId)" v-else>
          <div class="title">下单时间：{{shopItem.orderAddTimeFormat}}</div>
          <div class="color-orange">
            {{statusObject[shopItem.orderState]}}
          </div>
        </div>
        <div class="item-content">
          <div class="item-img-wrap flex" @click="goDetail(shopItem.orderId)" v-if=" shopItem.orderGoodDetail  && shopItem.orderGoodDetail.length>1">
            <image class="item-img" v-for="(item,index) in shopItem.orderGoodDetail" :key="index" :src="baseUrl+item.gPic"></image>
          </div>
          <div class="item-img-wrap flex" @click="goDetail(shopItem.orderId)" v-else>
            <image class="item-img" v-if="shopItem.orderGoodDetail && shopItem.orderGoodDetail[0]" :src="baseUrl+shopItem.orderGoodDetail[0].gPic"></image>
            <div class="item-tip" style="width: 150px;">
              {{ shopItem.orderGoodDetail && shopItem.orderGoodDetail[0] ? shopItem.orderGoodDetail[0].gTitle : ''}}
            </div>
            <div class="item-num">
              ¥ {{shopItem.orderGoodDetail && shopItem.orderGoodDetail[0]  ? shopItem.orderGoodDetail[0].goodPrice : ''}}
              <div class="num">
                x {{shopItem.orderGoodDetail && shopItem.orderGoodDetail[0] ? shopItem.orderGoodDetail[0].goodCount: '' }}
              </div>
            </div>
          </div>
          <div class='item-des flex'>
            <!-- <div class="des-button">{{orderSourceMap[shopItem.orderSource]}}-{{orderTakeMethMap[shopItem.orderSource]}}</div> -->
            <div class="des-button">{{shopItem.orderStatusStr}}</div>
            <div class="flex">
              <span class="item-num">共{{shopItem.orderGoodCount}}件</span>
              <span class="item-amount"> ¥ {{shopItem.orderPayPrice}}</span>
            </div>
          </div>
          <!-- 操作按钮  待确认与完善 -->
          <div class="item-footer flex">
            <div class="footer-left">
              <div v-if="shopItem.orderState == 0 && shopItem.orderSource == 10" class="time-wrapper">
                <img src="/static/images/clock.png" alt="" class="img">
                剩余: {{shopItem.time}}
              </div>
            </div>
            <div class="footer-right">

              <!-- 邀请奖励 -->
              <template v-if="shopItem.isSupportGroup == 1">
                <button open-type='share' class="btn">
                      <span class="pay-button">邀好友赚奖励</span>
                 </button>
               </template>

              <!-- 退款 -->
              <template v-if="shopItem.isSupportReturn == 1">
                <span class="pay-button" v-if="shopItem.orderRefundState == 1">退款处理中</span>
                <!-- <span class="pay-button" v-if="shopItem.orderRefundState != 1 && shopItem.orderSource!=10" @click="rebackMoney(shopItem)">退款</span> -->
              </template>
              <!-- 待支付 -->
              <template v-if="shopItem.orderState == 0">
                <span class="pay-button" @click="doCancelOrder(shopItem.orderId)">取消订单</span>
                <span class="pay-button  active" @click="gotoPay(shopItem)">去支付</span>
              </template>
              <!-- 待收货 -->
              <!-- <template v-if="((shopItem.orderState == 1|| shopItem.orderState==2))"> -->
                <!-- 快递30 -->
                <span class="pay-button  active" v-if="shopItem.orderTakeMeth==30&&(shopItem.orderState == 1||shopItem.orderState == 2)" @click="doConfirmOrder(shopItem.orderId)">确认收货</span>
                <!-- 自提10 -->
                <span class="pay-button  active" @click="showGetGoodPicture(shopItem)" v-if="(shopItem.orderState == 1&&shopItem.orderTakeMeth==10)||(shopItem.orderState == 2&&shopItem.orderTakeMeth==10)">取货</span>
              <!-- </template> -->
              <!-- 已完成 -->
              <template v-if="shopItem.orderSource!=10&&(shopItem.orderState == 3||shopItem.orderState ==4||shopItem.orderState ==5||shopItem.orderState ==6||shopItem.orderState ==7)">
                <span class="pay-button" @click="doBuyAgainOrder(shopItem.orderId)">再来一单</span>
              </template>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-text" v-else>暂无数据</div>
    <!-- 触底 -->
    <div class="more-wrapper" v-show="hasMore">
      <span class="more-text">努力加载中···</span>
    </div>
    <div class="more-wrapper" v-show="pageCount == currentPage">
      <span class="more-text">我是有底线的</span>
    </div>
  </div>
</template>
<script>
import { formatTime, formatTimeStr } from '../../../utils/util'
import { orderList, confirmOrder, cancelOrder, buyAgainOrder } from '@/utils/api.js'
export default {
  data () {
    return {
      hasMore: false,
      baseUrl: this.$baseUrl,
      publicShare: this.$publicShare,
      activeIndex: '',
      tabItems: [{ id: '', name: '全部' }, { id: '0', name: '待支付' }, { id: '1,2', name: '待收货' }, { id: '3,7', name: '已完成' }, { id: '4,5,6', name: '已取消' }],
      orderList: [],
      statusObject: { 0: '待支付', 1: '待收货', 2: '已收货', 3: '已完成', 4: '已取消', 5: '已取消' }, // 订单状态 4:已取消（超时）5:已取消（退货）
      orderSourceMap: { 10: '团购订单', 20: '商品订单', 30: '代销订单' }, // 订单来源
      orderTakeMethMap: { 10: '自提', 20: '送货上门', 30: '快递' }, // 取货方式
      // statusButton: {1: '去支付', 2: '取货', 3: '再来一单', 4: '邀请好友赚奖励', 5: '退款处理中'},
      currentPage: -1,
      pageCount: null,
      pageNo: 1,
      pageSize: 10

    }
  },
  onLoad (option) {
    this.pageNo = 1
    console.log(option.currentIndex, 'currentIndex: ')
    if (option.currentIndex) {
      this.activeIndex = this.tabItems[option.currentIndex].id
      this.getList()
    } else {
      this.getList()
    }
  },
  onShow () {
    this.getList()
  },
  onUnload () {
    clearInterval(this.timer)
    this.activeIndex = ''
  },
  // 触底加载
  onReachBottom () {
    this.hasMore = this.pageCount > this.currentPage
    if (this.hasMore) {
      setTimeout(async () => {
        this.hasMore = false
        this.pageNo++
        await this.getList(true)
      }, 1000)
    }
  },

  mounted () {

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
    // 切换
    changeTab (id) {
      this.activeIndex = id
      this.pageNo = 1
      this.pageCount = null
      this.getList()
    },

    // 订单状态
    orderText (item) {
      let orderSource = item.orderSource
      let orderTakeMeth = item.orderTakeMeth
      let orderSourceText = orderSource == 10 ? '0元购' : orderSource == 20 ? '自营订单' : orderSource == 30 ? '商城订单' : ''
      let orderTakeMethText = orderTakeMeth == 10 ? '自提' : orderTakeMeth == 20 ? '商家配送' : orderTakeMeth == 30 ? '快递' : ''
      return orderSourceText + '-' + orderTakeMethText
    },

    // 订单列表
    async getList (flag) {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orderState: this.activeIndex
      }
      let orderRecords
      let result = (await orderList(params)).result.result
      this.pageCount = result.pageCount
      this.currentPage = result.currentPage
      if (flag) {
        orderRecords = result.records
        this.orderList.records = this.orderList.records.concat(orderRecords)
      } else {
        this.orderList = result
      }
      this.orderList.records.forEach(item => {
        item.orderAddTimeFormat = formatTimeStr(new Date(item.orderAddTime))
        item.orderStatusStr = this.orderText(item)
      })

      this.reciprocal(this.orderList.records)
    },
    reciprocal (items) {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        items.forEach(item => {
          if (item.orderState == 0 && item.orderSource == 10) {
            this.countdown(item)
          }
        })
      }, 1000)
    },
    countdown (item) {
      let diff = item.orderOverTime - +new Date()
      if (diff >= 0) {
        let intDiff = Math.floor(diff / 1000)
        let day = 0
        let hour = 0
        let minute = 0
        let second = 0 // 时间默认值
        if (intDiff > 0) {
          // 计算相关的天，小时，还有分钟，以及秒
          day = Math.floor(intDiff / (60 * 60 * 24))
          // 天和小时合体
          hour = Math.floor(intDiff / (60 * 60))
          minute = Math.floor(intDiff / 60) - hour * 60
          second = Math.floor(intDiff) - hour * 60 * 60 - minute * 60
        }
        // hour = '0' + hour
        minute = String(minute).padStart(2, '0')
        second = String(second).padStart(2, '0')
        item.time = `${minute}:${second}`
        intDiff--
        if (intDiff < 0) {
          item.time = '00:00'
        }
      } else {
        item.time = '00:00'
      }
      this.$forceUpdate()
    },
    // 确认收货
    async doConfirmOrder (orderId) {
      let params = {
        oId: orderId
      }
      let result = (await confirmOrder(params)).result
      console.log(result.errCode, 'doConfirmOrder errCode')
      if (result.errCode == 'USER_200') {
        wx.showToast({ title: '操作成功', icon: 'none' })
        this.getList()
      } else {
        wx.showToast({ title: result.errMsg, icon: 'none' })
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
        wx.showToast({ title: '操作成功', icon: 'none' })
        this.getList()
      } else {
        wx.showToast({ title: result.errMsg, icon: 'none' })
      }
    },

    // 再来一单
    async doBuyAgainOrder (orderId) {
      let params = {
        oId: orderId
      }
      let result = (await buyAgainOrder(params)).result
      console.log(result.errCode, 'doCancelOrder errCode: ')
      console.log(result.result.shopId, 'result.result.result.shopId: ')
      console.log(result.result.gbSalePlat, 'gbSalePlat: ')
      if (result.errCode == 'USER_200') {
        wx.showToast({ title: '操作成功', icon: 'none' })
        wx.navigateTo({
          url: '/pages/pIndex/shopDetail/main?id=' + result.result.shopId + '&gbSalePlat=' + result.result.gbSalePlat
        })
      } else {
        wx.showToast({ title: result.errMsg, icon: 'none' })
      }
    },
    // 退款
    rebackMoney (item) {
      wx.navigateTo({
        url: '/pages/pOrder/refundMenu/main?orderId=' + item.orderId
      })
    },
    // 去支付
    gotoPay (item) {
      wx.navigateTo({ url: `/pages/pIndex/goodPay/main?orderId=` + item.orderId })
    },
    // 显示提货二维码
    showGetGoodPicture (item) {
      // 是否显示门店列表
       let isShowShopList = 0 // 0不展示 1为展示
       if (item.orderTakeMeth == '10' && item.orderSource == '10') {
          isShowShopList = 1
       }
      wx.navigateTo({
        url: '/pages/pMe/Coupon/main?flag=2&shopId=' + item.shopId + '&shopTitle=' + item.shopTitle + '&isShowShopList=' + isShowShopList + '&orderShopId=' + item.orderShopId + '&goodNumber=' + item.goodNumber + '&goodUnit=' + item.goodUnit + '&reqDecryStr=' + item.reqDecryStr + '&orderId=' + item.orderId
      })
    },
    // 详情
    goDetail (id) {
      // console.log(id)
      wx.navigateTo({ url: `/pages/pIndex/orderDetail/main?orderId=${id}` })
    }
  }
}
</script>
<style lang="less" scoped>
.footer-right{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  button{
    background-color: #fff;
  }
}
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

.order-list-wrap {
  background: @color-bg;
  font-size: 30rpx;
  min-height: 100vh;
  .empty-text {
    padding-top: 200rpx;
    text-align: center;
    font-size: 24rpx;
    color: @grey;
  }
  .color-orange {
    color: @color-orange;
  }
  .swipter-tab {
    position: fixed;
    top: 0;
    z-index: 999;
    background: #fff;
    width: 100%;
    padding: 0 30rpx;
    box-sizing: border-box;
    .swipter-tab-item {
      padding-top: 44rpx;
      padding-bottom: 14rpx;
      &.active {
        color: @color-orange;
        border-bottom: 1rpx solid @color-orange;
      }
    }
  }
  .order-list {
    margin-top: 100rpx;
    padding: 20rpx 30rpx;
    width: 100%;
    box-sizing: border-box;
    .order-item {
      width: 100%;
      box-sizing: border-box;
      padding: 0 20rpx;
      background: #fff;
      margin-bottom: 30rpx;
      border-radius: 18rpx;
      .item-title {
        height: 70rpx;
        border-bottom: 1rpx solid @line;
        .shop-img {
          width: 32rpx;
          height: 32rpx;
          padding-right: 30rpx;
          vertical-align: middle;
        }
      }
      .item-content {
        .item-img-wrap {
          overflow-x: auto;
          justify-content: flex-start;
          .item-img {
            width: 118rpx;
            height: 118rpx;
            margin: 40rpx 0;
            margin-right: 30rpx;
          }
          .item-tip {
            width: 120px;
            overflow:auto ;
            font-size: 24rpx;
            color: #303030;
            flex-grow: 1;
          }
          .item-num {
            width: 80px;

            // padding-left: 30rpx;
            text-align: right;
            .num {
              color: #787878;
            }
          }
        }
        .item-des {
          padding-bottom: 40rpx;
          border-bottom: 1rpx solid @line;
          .des-button {
            width: 190rpx;
            height: 40rpx;
            line-height: 40rpx;
            color: @color-orange;
            font-size: 22rpx;
            background: #fcebcc;
            border-radius: 0 20rpx 20rpx 20rpx;
            text-align: center;
          }
          .item-num {
            font-size: 24rpx;
            color: @grey;
            padding-right: 54rpx;
          }
          .item-amount {
            font-size: 34rpx;
            color: @color-orange;
          }
        }
        .item-footer {
          padding: 50rpx 0;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          // justify-content: flex-end;
          .footer-left {
            font-size: 24rpx;
            color: @grey;
            .time-wrapper {
              display: flex;
              align-items: center;
              .img {
                width: 28px;
                height: 28px;
                margin-right: 24rpx;
              }
            }
          }
          .pay-button {
            box-sizing: border-box;
            padding: 14rpx 24rpx;
            height: 60rpx;
            // line-height: 60rpx;
            min-width: 150rpx;
            min-height: 60rpx;
            border-radius: 30rpx;
            text-align: center;
            font-size: 26rpx;
            border: 1rpx solid @line;
            margin-left: 10rpx;
            &.active {
              color: @color-orange;
              border-color: @color-orange;
            }
          }
        }
      }
    }
  }
  .more-wrapper {
    padding: 20rpx 0;
    text-align: center;
    .more-text {
      font-size: 24rpx;
      color: @grey;
    }
  }
}
</style>  