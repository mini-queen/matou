<template>
  <div class="val-detail">
    <div class="tabs">
      <div class="tab-item center" :class="{active:isGoodsShow}" @click="switchTab(true)">
        商品
      </div>
      <div class="tab-item center" :class="{active:!isGoodsShow}" @click="switchTab(false)">
        详情
      </div>
    </div>
    <div class="goods-wrapper" v-if="isGoodsShow">
      <div class="swiper-wrapper">
        <swiper
          indicator-dots="true"
          :autoplay="isAuto"
          duration="1000"
          class="swiper"
          >
            <swiper-item v-for="(item, index) in imgUrls" :key="index" class="swiper-item">
                <img :src="baseUrl+item.gpPic" @click="toLink(item)" class="slide-image" />
            </swiper-item>
        </swiper>
      </div>
      <div class="goods">
        <div class="goods-top">
          <div class="goods-title">{{gTitle || ''}}</div>
          <div class="goods-desp">
            {{gBq1 || ''}} | {{gBq2 || ''}}
          </div>
          <div class="goods-msg space-between">
            <div class="msg-left">
              <span class="goods-label"></span>
              <span class="price-discount">￥{{goodsInfo.gsPrice}}</span>
              <span class="price-original">￥{{goodsInfo.gPrice}}</span>
            </div>
            <div class="msg-right">
              <span class="goods-num">限购{{goodsInfo.gsLimit}}份</span>
            </div>
          </div>
        </div>
        <div class="goods-selected space-between" @click.stop="selectGoods">
          <div class="selected-left">
            已选：{{currRule?currRule :classes.glName}}
            <!-- 500ml/瓶 -->
          </div>
          <div class="selected-arrow">
            <img src="/static/images/arrow.png" class="more-icon">
          </div>
        </div>
      </div>
      <div class="friends">
        <!-- 邀请的朋友购买了显示 -->
        <div class="friends-title space-between" v-if="yqfriends">  
          <div class="tip">
            好友都买了
          </div>
          <div class="back-money">
            累计获得邀请返利：
            <span class="money">{{rewardReceived}}元</span>
          </div>
        </div>
        <div class="friends-group" v-if="friendsList && friendsList.length>0">
          <div class="friends-item" v-for="(item,index) in friendsList" :key="index">
            <div v-if="index < friendsLimit">
              <!-- <div class="img" :style="{'backgroundImage': `url(${item.mheadurl})`}"></div> -->
              <img class="img" :src="item.mheadurl" alt="">
              <div class="friend-name">{{item.mnickname}}</div>
            </div>
            <div v-else>
              <div class="img">
                <img src="/static/images/group-bottom.png" alt="" class="expand-img" @click="expand(true)" v-if="isExpand">
                <img src="/static/images/group-top.png" alt="" class="expand-img" @click="expand(false)" v-else>
              </div>
              <div class="friend-name">查看全部</div>
            </div>
          </div>
        </div>
        <div class="friends-bottom space-between" v-if="numberRemaining > 0 && OrderGroupsMember && OrderGroupsMember.ogmParentId">
          <div class="invite-friend">
            再邀
            <span class="friend-num">{{numberRemaining}}</span>
            位好友，99元待领取
          </div>
          <button open-type='share' class="button">
            点击领取
          </button>
        </div>
      </div>
      <div class="shops">
        <!-- <div class="shop-title space-between">
          <div class="tip">60家店铺支持取货</div>
          <div class="more">
            更多
            <img src="/static/images/arrow.png" class="more-icon">
          </div>
        </div> -->
        <div class="shop-list">
          <div class="shop-item space-between" @click="goShopDetail(item.sId)" v-for="(item,index) in shopList" :key="index">
            <div class="item-left">
              <!-- sPic -->
              <img class="shop-img" :src="item.sPic ? baseUrl+item.sPic : '/static/images/shop.png'"/>
              <span class="shop-name">{{item.sTitle}}</span>
              <!-- <span class="shop-name">鹏润花园店</span> -->
            </div>
            <div class="item-right">
              <span class="shop-distance">{{item.distance}}</span>
              <!-- <span class="shop-distance">2.2km</span> -->
              <!-- <div class="button">进店</div> -->
            </div>
          </div>
        </div>
      </div>
      <!-- 购买了显示 -->
      <div class="invite-rebate"  v-if="memberBuy">
        <div class="invite-title">
          邀请好友享返利
        </div>
        <div class="invite-title_sub">
          下单支付成功后，邀请好友购买此商品可获得返利
        </div>
        <div class="invite-img">
          <img src="https://sniu.2dian.com/xcx/static/matou/goodrules.png" mode="aspectFit">
        </div>
      </div>
      <div class="dsc">{{gDetail}}</div>
    </div>
    <div class="detail-wrapper" v-else>
      <wxParse :content="goodInfo.gDetail"/>
    </div>
    <div class="buying-bar">
      <div class="home bar-item" @click="goHome">
        <div>
          <img src="/static/images/shouye-orange.png" class="home-img bar-item-img">
          <span class="home-desp bar-item-desp">首页</span>
        </div>
      </div>
      <div class="collect bar-item" @click="collect">
        <div>
          <img v-if="isFollow == 0" src="/static/images/collect.png" class="collect-img bar-item-img">
           <img v-else src="/static/images/collect-orange.png" class="collect-img bar-item-img">
          <span class="collect-desp bar-item-desp">收藏</span>
        </div>
      </div>
      <div class="button" @click="goShopping">
        立即抢购
      </div>
    </div>
    <!-- 底部弹出组件 -->
    <div class="popup-modal bottom-modal" :class="{show: isShow}">
      
      <div class="popup-dialog"><div class="close" @click="close">X</div>
        <div class="popover-content">
          <div class="goods-info">
            <img :src="baseUrl+imgUrls[0].gpPic" alt="" class="goods-img">
            <div class="info-right">
              <div class="goods-top">
                <span class="goods-label"></span>
                <span class="price-discount">￥{{goodsInfo.gsPrice}}</span>
                <span class="price-original">￥{{goodsInfo.gPrice}}</span>
              </div>
              <div class="goods-bottom">
                产品名称
                <span class="goods-name">{{gTitle || ''}}</span>
              </div>
            </div>
          </div>
          <div class="goods-format">
            <div class="tip">
              规格
            </div>
            <div class="format-list">
              <div class="format-item" v-for="(item,index) in classes" :key="index" @click="selectRule(item)">
                <!-- 500ml/瓶 -->
                {{item.glName}}
              </div>
            </div>
          </div>
          <div class="goods-nums">
            <div class="tip">
              购买数量
            </div>
            <div class="nums-calc">
              <add :num="goodNum" @add="addGood(good)" @reduce="reduceGood(good)" @numHandle="numHandle(good)"></add>
              <span class="stock">库存：{{goodsInfo.count}}件</span>
            </div>
          </div>
          <div class="button" @click="sure">
            确认
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import popup from '@/components/popup'
  import add from '@/components/add'
  import { getGreatValueGoods, getGreatValueGoodsOther, valueCollect, littleBuynow } from '@/utils/api'
  import wxParse from 'mpvue-wxparse'
  export default {
    data () {
      return {
        token: '', // 全局token 验证登录返回后的身份
        yqfriends: '', // 邀请好友后显示
        memberBuy: '', // 自己购买后显示
        baseUrl: this.$baseUrl,
        isShow: false,
        isAuto: true,
        OrderGroupsMember: {},
        imgUrls: [
          { url: '/static/images/shop.png' },
          { url: '/static/images/shop.png' }
        ],
        goodNum: 1,
        friendsList: 10,
        isExpand: true,
        stock: '',
        gsLimit: '',
  
        shopList: [],
        numberRemaining: 0,
        rewardReceived: 0,
        originalPrice: 31.8,
        gsPrice: 38.8,
        gTitle: '',
        gBq1: '',
        gBq2: '',
        friendsLimit: 9,
        ogmParentId: '',
        goodsInfo: {},
        classes: [],
        currRule: '',
        shopId: '',
        ogTakeMeth: '', // 配送方式 1自提  2快递
        shopOnSaleCount: 0,
        isFollow: 0,
        isGoodsShow: true,
        goodInfo: {},
        mcdIds: '', // 订单ID
        alertMsg: '' //  取不到订单ID时的提示信息
      }
    },
    computed: {

    },
    components: {
      wxParse, popup, add
    },
    onShow () {
      this.token = wx.getStorageSync('DIAN_TOKEN')
      console.log(this.token)
      this.doLittleBuynow()
    },
    async mounted () { // 原参数 id, ogId
      let { id, ogId, gsGroup } = this.$root.$mp.query
      console.log('传参', this.$root.$mp.query)
      this.id = id
      this.ogId = ogId
      this.gsGroup = gsGroup
      let res = await getGreatValueGoods({id: id, ogId: ogId, longitude: '114', latitude: '40'})
  
      if (res.errCode === 'USER_200') {
        let result = res.result.result
        this.isFollow = result.goodsState
        if (result) {
          console.log('返回值', result)

          this.shopList = result.shopOnSaleList // 店铺列表 sPic sTitle distance
          this.friendsList = result.inviteMemberList // 好友列表 m_headurl m_nickname
          this.imgUrls = result.photo
          this.numberRemaining = result.numberRemaining
          this.rewardReceived = result.rewardReceived
          this.originalPrice = result.good.gOriginalPrice
          this.gsPrice = result.good.gPrice
          this.gTitle = result.good.gTitle
          this.gBq1 = result.good.gBq1
          this.gBq2 = result.good.gBq2
          this.shopId = result.good.gShopId
          this.gsLimit = result.good.gLimit // 限制份数
          this.classes = result.class1
          this.ogTakeMeth = result.ogTakeMeth
          this.shopOnSaleCount = result.shopOnSaleCount
          this.ogmParentId = result.OrderGroupsMember.ogmParentId
          this.goodInfo = result.good
          this.OrderGroupsMember = result.OrderGroupsMember
  
          this.memberBuy = this.friendsList.length !== 0
          this.yqfriends = this.friendsList.length > 0
        }
      }

       this.doLittleBuynow()

      let res1 = await getGreatValueGoodsOther({group: gsGroup, ogId: ogId})
      let ret = res1.result.result
      if (ret) {
        this.goodsInfo = ret
        console.log(this.goodsInfo)
      }
      this.selectRule(this.classes[0])
    },
    onUnload () {
       this.isShow = false
        this.isAuto = true
        this.imgUrls = [
          { url: '/static/images/shop.png' },
          { url: '/static/images/shop.png' }
        ]
        this.goodNum = 1
        this.friendsList = 0
        this.isExpand = true
        this.stock = ''
        this.gsLimit = ''
  
        this.shopList = []
        this.numberRemaining = 0
        this.rewardReceived = 0
        this.originalPrice = 0
        this.gsPrice = 0
        this.gTitle = ''
        this.gBq1 = ''
        this.gBq2 = ''
        this.friendsLimit = 9
        this.ogmParentId = ''
        this.goodsInfo = {}
        this.classes = []
        this.currRule = ''
        this.shopId = ''
        this.ogTakeMeth = '' // 配送方式 1自提  2快递
        this.shopOnSaleCount = 0
        this.isFollow = 0
        this.isGoodsShow = true
        this.goodInfo = {}
        this.mcdIds = '' // 订单ID
        this.alertMsg = '' //  取不到订单ID时的提示信息
    },
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        console.log(res.target)
        let token = wx.getStorageSync('DIAN_TOKEN') ? wx.getStorageSync('DIAN_TOKEN') : this.token
        return {
          title: '您的好友邀请您0元领好礼，赶快行动吧',
          path: `/pages/pIndex/valueDetail/main?id=${this.id}&group=${this.gsGroup}&ogs_id=${this.ogId}&combineRefer=${this.ogmParentId}&refer=true&token=` + token,
          imageUrl: this.baseUrl + this.imgUrls[0].gpPic
        }
      }
    },
    methods: {
      // 切换tab
      switchTab (status) {
        this.isGoodsShow = status
      },
      // 选择规格
      close () {
        this.isShow = false
      },
      selectRule (item) {
        this.currRule = item.glName
      },

      // 跳转店铺详情
      goShopDetail (id) {
        wx.navigateTo({
              url: '/pages/pIndex/shopDetail/main?id=' + id
          })
      },

      // 订单初始化接口
      async doLittleBuynow () {
        let params = {
              group: this.gsGroup,
              count: this.goodNum,
              og_id: 0,
              ogs_id: this.ogId
          }
        console.log('doLittleBuynow param: ')
        console.log(params)
        let data = await littleBuynow(params)
        console.log('doLittleBuynow result: ')
        console.log(data)
        if (data) {
          console.log('data.errCode: ', data.result.errCode)
          if (data.result.errCode == 'USER_200') {
            this.mcdIds = data.result.result.mcd_id
            // this.getCarDetailGoods()
          } else {
            this.alertMsg = data.result.errMsg
            //  wx.showToast({
            //   title: data.result.errMsg,
            //   icon: 'none'
            // })
          }
        }
    },
      expand (status) {
          this.friendsLimit = status ? this.friendsList.length : 9
          this.isExpand = !status
      },
      addGood (params) {
        let token = wx.getStorageSync('DIAN_TOKEN') ? wx.getStorageSync('DIAN_TOKEN') : this.token
            if (!token) {
            wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
        }
        console.log(this.goodsInfo.gsLimit)
        if (this.goodNum >= this.goodsInfo.gsLimit) {
          wx.showToast({
            title: '达到限购啦',
            icon: 'none'
          })
          return
        }
        this.goodNum++
        console.log('add', params)
      },
      reduceGood (params) {
        if (this.goodNum === 1) return
        this.goodNum--
        console.log('reduce', params)
      },
      numHandle (params) {
        console.log('numHandle', params)
      },
      goShopping () {
        let token = wx.getStorageSync('DIAN_TOKEN') ? wx.getStorageSync('DIAN_TOKEN') : this.token
        if (!token) {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
        } else {
          this.isShow = true
        }
      },
      selectGoods () {
        console.log('选择')
        this.isShow = true
      },
      sure () { // 确认商品
        let token = wx.getStorageSync('DIAN_TOKEN') ? wx.getStorageSync('DIAN_TOKEN') : this.token
        if (token) {
          console.log(token, 'token')
          if (this.mcdIds == '') {
              wx.showToast({
                title: this.alertMsg,
                icon: 'none'
              })
              return
          }
          wx.navigateTo({url: `/pages/pIndex/valueOrder/main?mcdIds=${this.mcdIds}&ogId=${this.ogId}&gsGroup=${this.gsGroup}&goodNum=${this.goodNum}&shopId=${this.shopId}&ogTakeMeth=${this.ogTakeMeth}&shopOnSaleCount=${this.shopOnSaleCount}`})
        } else {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
        }
      },
      closeModal () {
        this.isShow = false
      },
      toLink (item) {
        console.log(item)
      },
      goHome () {
        wx.switchTab({
          url: '/pages/index/main'
        })
      },
      async collect () {
        let token = wx.getStorageSync('DIAN_TOKEN') ? wx.getStorageSync('DIAN_TOKEN') : this.token
        if (token) {
            this.isFollow = this.isFollow == 0 ? 1 : 0
        let res = await valueCollect({fgGoodsId: this.id, state: this.isFollow, fgOrderGoodsId: this.ogId})
            wx.showToast({
              title: res.result.result.msg == '已关注' ? '已收藏' : '取消收藏'
            })
        console.log('收藏', res.result.result.msg)
        } else {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
        }
      },
      receive () { // 点击领取
        console.log('点击领取')
      }
    }
  }
</script>

<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.val-detail {
  color: @primary;
  background-color: @color-bg;
  .tabs {
    width: 100vw;
    height: 88rpx;
    display: flex;
    justify-content: center;
    font-size: 28rpx;
    background-color: @color-white;
    position: fixed;
    z-index: 999;
    border-bottom: 1px solid @line;
    top: 0;
    left: 0;
    .tab-item {
      width: 174rpx;
      height: 80rpx;
      &.active {
        border-bottom: 1px solid @color-orange;
        color: @color-orange;
      }
    }
  }
  .goods-wrapper {
    margin-top: 88rpx;
  }
  .detail-wrapper {
    margin-top: 88rpx;
    padding-top: 20rpx;
    background-color: @color-white; 
    margin-bottom: 80rpx;
    /deep/ .wxParse {
      .p {
        margin: 0;
      }
    }
  }
  .swiper-wrapper {
    width: 100%;
    height: 700rpx;
    border-top: 2rpx solid @line;
    border-bottom: 2rpx solid @line;
    background-color: @color-white;
    .swiper {
      height: 100%;
      .swiper-item {
        text-align: center;
        padding-top: 62rpx;
        .slide-image {
          // width: 457rpx;
          height: 545rpx;
        }
      }
    }

  }
  .goods {
    background-color: @color-white;
    .goods-top {
      padding: 40rpx 30rpx;
      .goods-title {
        margin-bottom: 28rpx;
        font-size: 30rpx;
      }
      .goods-desp {
        color: @disabled;
        margin-bottom: 45rpx;
        font-size: 24rpx;
      }
      .goods-msg {
        .msg-left {
          .goods-label {
            width: 73rpx;
            height: 24rpx;
            display: inline-block;
            background-image: url("../../../../static/images/member-price.png");
            background-size: cover;
            background-position: center;
          }
          .price-discount {
            margin-left: 2rpx;
            color: @color-orange;
            font-size: 32rpx;
          }
          .price-original {
            margin-left: 18rpx;
            color: @disabled;
            font-size: 24rpx;
          }
        }
        .msg-right {
          .goods-num {
            color: @grey;
            font-size: 26rpx;
          }
        }
      }
    }
    .goods-selected {
      padding: 40rpx 30rpx;
      border-top: solid 2rpx @line;
      .selected-left {
        font-size: 26rpx;
      }
      .selected-arrow {
        .more-icon {
          padding-left: 20rpx;
          width: 11rpx;
          height: 20rpx;
        }
      }
    }
  }
  .friends {
    margin-top: 20rpx;
    background-color: @color-white;
    .friends-title {
      padding: 30rpx;
      border-bottom: 2rpx solid @line;
      .tip {
        font-size: 24rpx;
      }
      .back-money {
        font-size: 24rpx;
        .money {
          margin-left: 4rpx;
          color: @color-orange;
        }
      }
    }
    .friends-group {
      padding: 0 30rpx;
      .friends-item {
        text-align: center;
        width: 20%;
        margin-top: 40rpx;
        display: inline-block;
        .img {
          width:60rpx;
          height:60rpx;
          border-radius:50%;
          // background-color: @grey;
          margin: 0 auto;
          .expand-img {
            width: 60rpx;
            height: 60rpx;
          }
        }
        .friend-name {
          margin-top: 18rpx;
          font-size:24rpx;
        }
      }
    }
    .friends-bottom {
      margin-top: 60rpx;
      padding: 0 30rpx 30rpx;
      align-items: center;
      .invite-friend {
        font-size: 24rpx;
        .friend-num {
          color: @color-orange;
        }
      }
      .button {
        .btn--default();
        margin: 0;
      }
    }
  }
  .shops {
    margin-top: 20rpx;
    background-color: @color-white;
    .shop-title {
      padding: 30rpx;
      border-bottom: 2rpx solid @line;
      .tip {
        font-size: 24rpx;
      }
      .more {
        font-size: 24rpx;
        .more-icon {
          margin-left: 4rpx;
          width: 11rpx;
          height: 20rpx;
        }
      }
    }
    .shop-list {
      padding: 30rpx 30rpx 20rpx;
      margin-bottom: 50px;
      .shop-item {
        margin-bottom: 30rpx;
        .item-left {
          display: flex;
          align-items: center;
          .shop-img {
            width: 100rpx;
            height: 80rpx;
          }
          .shop-name {
            margin-left: 20rpx;
            font-size: 28rpx;
          }
        }
        .item-right {
          display: flex;
          align-items: center;
          .shop-distance {
            color: @disabled;
            font-size: 24rpx;
          }
          .button {
            margin-left: 50rpx;
            .btn--default();
            width: 90rpx;
          }
        }
      }
    }
  }
  .invite-rebate {
    margin-top: 20rpx;
    background-color: @color-white;
    text-align: center;
    margin-bottom: 100rpx;
    .invite-title {
      padding-top: 50rpx;
      font-size: 30rpx;
      &_sub {
        padding-top: 20rpx;
        margin-bottom: 30rpx;
        color: @grey;
        font-size: 24rpx;
      }
    }
    .invite-img {
      img {
        width: 90%;
        height: 130rpx;
      }
    }
  }
  .buying-bar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 100rpx;
    display: flex;
    // z-index: 99;
    .bar-item {
      width: 100rpx;
      height: 100rpx;
      border: solid 1px @grey;
      border-right: none;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @color-white;
      &-img {
        width: 44rpx;
        height: 36rpx;
      }
      &-desp {
        display: block;
        margin-top: 4rpx;
        color: @color-orange;
        font-size: 22rpx;
      }
    }
    .button {
      .btn--primary();
    }
  }
  .popup-modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1110;
    opacity: 0;
    outline: 0;
    -ms-transform: scale(1.185);
    transform: scale(1.185);
    backface-visibility: hidden;
    perspective: 2000rpx;
    background: rgba(0, 0, 0, 0.6);
    transition: all 0.3s ease-in-out 0s;
    pointer-events: none;
    &::before {
      content: "\200B";
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
    &.show {
      opacity: 1;
      transition-duration: 0.3s;
      -ms-transform: scale(1);
      transform: scale(1);
      overflow-x: hidden;
      overflow-y: auto;
      pointer-events: auto;
    }
    &.bottom-modal { 
      margin-bottom: -1000rpx;
      &::before {
        vertical-align: bottom;
      }
      &.show {
        margin-bottom: 0;
      }
      .address-dialog {
        width: 100%;
        border-radius: 0;
      }
    }
    .popup-dialog {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin-left: auto;
      margin-right: auto;
      width: 100vw;
      // max-width: 100%;
      background-color: #f8f8f8;
      border-radius: 10rpx 10rpx 0 0;
      overflow: hidden;
      .close{
      width: 14px;
      height: 14px;
      text-align: center;
      position: absolute;
      right: 12px;
      top: 12px;
    }
    }
    
  }
  .popover-content {
    width: 100%;
    // height: 720rpx;
    .goods-info {
      padding: 30rpx;
      border-bottom: 2rpx solid @line;
      display: flex;
      .goods-img {
        width: 100rpx;
        height: 100rpx;
        border: solid 1px @line;
      }
      .info-right {
        margin-left: 26rpx;
        .goods-top {
          
          .goods-label {
              width: 73rpx;
              height: 24rpx;
              display: inline-block;
              background-image: url("../../../../static/images/member-price.png");
              background-size: cover;
              background-position: center;
            }
            .price-discount {
              margin-left: 2rpx;
              color: @color-orange;
              font-size: 32rpx;
            }
            .price-original {
              margin-left: 18rpx;
              color: @disabled;
              font-size: 24rpx;
            }
        }
        .goods-bottom {
          margin-top: 26rpx;
          color: @grey;
          font-size: 24rpx;
        }
      }

    }
    .goods-format {
      padding: 50rpx 30rpx;
      border-bottom: solid 1px @line;
      .tip{
        font-size: 30rpx;
      }
      .format-list {
        margin-top: 30rpx;
        .format-item {
          width: 160rpx;
          height: 60rpx;
          background-color: @line;
          font-size: 24rpx;
          text-align: center;
          line-height: 60rpx;
          margin-right: 16rpx;
        }
      }
    }
    .goods-nums {
      padding: 50rpx 30rpx;
      border-bottom: solid 1px @line;
      .tip{
        font-size: 30rpx;
      }
      .nums-calc {
        margin-top: 30rpx;
        display: flex;
        align-items: center;
        .stock {
          margin-left: 40rpx;
          font-size: 24rpx;
          color: @grey;
        }
      }
     
    }
    .button {
      margin-top: 30rpx;
      .btn--primary();
      width: 100%;
    }
  }
}
</style>
