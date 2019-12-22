<template>
  <div class="index-wrapper">
    <navigation-bar :address="addr" @inputSearch="inputSearch" @click="goSearch">
    </navigation-bar>
    <div class="index-top space-around">
      <div class="item" @click="goFunc(item.flag)" v-for="(item,index) in topList" :key="index">
          <img :src="item.img" alt="" >
          <div class="tip">{{item.tip}}</div>
      </div>
    </div>
    <div class="banner space-between">
      <div class="item" @click="goFunc(item.flag)" v-for="(item,index) in bannerList" :key="index">
          <img :src="item.img" alt="" >
          <div class="tip">{{item.tip}}</div>
      </div>
    </div>
    <div class="recommend">
      <div class="title">好店推荐</div>
      <div class="recommend-items">
        <div class="recommend-item"  v-for="(shop,index) in shopList" :key="index">
          <div class="recommend-top" @click="goShopDetail(shop.sId)">
            <img :src="baseUrl+shop.sPic" alt="" class="shop-img">
            <div class="shop-name">{{shop.sTitle}}</div>
            <div class="distance">距您{{shop.distance}}</div>
            <div class="mask"></div>
          </div>
          <div class="recommend-bottom">
            <div class="goods-item center" @click="goGoodDetail(goods.gId)"  v-for="(goods,inx) in shop.children" :key="inx" v-if="inx < 2">
              <img :src="baseUrl+goods.gPic" alt="" class="goods-img" v-if="goods.gPic">
              <img src="https://sniu.2dian.com/xcx/static/matou/defaultgood.png" alt="" class="goods-img" v-else>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 触底加载 -->
    <div class="more-wrapper" v-show="hasMore">
      <span class="more-text">努力加载中···</span>
    </div>
    <div class="more-wrapper" v-show="pageCount == currentPage">
      <span class="more-text">我是有底线的</span>
    </div>
  </div>
</template>
<script>
  
  import navigationBar from './navbar'
  import { getIndexGoods, getMyAccount } from '@/utils/api'
  // import { debounce } from '@/utils/tool'
  var QQMapWX = require('../../../lib/qqmap-wx-jssdk.min.js')
  export default {
    data () {
      return {
        baseUrl: this.$baseUrl,
        publicShare: this.$publicShare,
        topList: [ // 顶部导航按钮
          {img: '/static/images/qr-code.png', tip: '付款码', flag: 1},
          {img: 'https://sniu.2dian.com/xcx/static/matou/collect.png', tip: '收藏', flag: 222},
          {img: '/static/images/zuji.png', tip: '浏览足迹', flag: 3},
          {img: '/static/images/recharge.png', tip: '话费充值', flag: 4}
        ],
        bannerList: [ // 导航按钮
          {img: 'https://sniu.2dian.com/xcx/static/matou/fujin.png', tip: '附近的店', flag: 5},
          {img: 'https://sniu.2dian.com/xcx/static/matou/lingyuan.png', tip: '0元购', flag: 6},
          {img: 'https://sniu.2dian.com/xcx/static/matou/baike.png', tip: '生活百科', flag: 7},
          {img: 'https://sniu.2dian.com/xcx/static/matou/huiyuan.png', tip: '会员中心', flag: 8},
          {img: 'https://sniu.2dian.com/xcx/static/matou/kaidian.png', tip: '轻松开店', flag: 9}
        ],
        hasMore: false, // 是否有更多数据 加载
        items: 6,
        shopList: [], // 店铺列表
        pageSize: 10,
        pageNo: 1,
        pageCount: 0,
        currentPage: -1,
        addr: '', // 当前地址
        mPartnerFlag: 0 // 合伙人标识 0 否 1是
      }
    },
    computed: {

    },
    components: {
      navigationBar
    },
    async mounted () {
      this.qqmapsdk = new QQMapWX({
        key: 'SDKBZ-66T34-UZPUY-DDPCH-GO6DK-AYFKQ'
      })
      this.getLocation()
      await this.getGoods()
      let token = wx.getStorageSync('DIAN_TOKEN')

      // wx.setStorageSync('DIAN_TOKEN', '7bfddc5771c6e4429e573c81de7b42fc')

      console.log('token: ' + token)
      if (token) {
        console.log('has token ...')
      } else {
        console.log('no token ...')
      }
    },
    onLoad (option) {
      // this.refresh = option.refresh
      // console.log('refresh: ', this.refresh)
    },
    onShow () {
      let currentAddress = wx.getStorageSync('CURRENT_ADDRESS')
      if (currentAddress) {
         this.addr = currentAddress
      }
       // 清除上一次的缓存
      let isRefresh = wx.getStorageSync('isRefresh')
      console.log('isRefresh: ', isRefresh)
      if (isRefresh == 1) {
        this.pageNo = 1
        this.shopList = []
        this.getGoods()
        wx.removeStorageSync('isRefresh')
      }
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (token) {
        this.getMyAccount()
      }
    },
    onUnload () {

    },
    onReachBottom () {
      this.hasMore = this.pageCount > this.currentPage
      if (this.hasMore) {
        // 模拟请求接口、获取数据、添加数据
        setTimeout(async () => {
          this.pageNo++
          await this.getGoods()
          this.hasMore = false
        }, 1200)
      }
    },
    // 分享按钮
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        console.log(res.target)
        let token = wx.getStorageSync('DIAN_TOKEN')
      }
      return {
          title: '便利码头',
          path: `/pages/index/main`,
          imageUrl: this.publicShare
        }
    },
    methods: {
  
      // inputSearch: debounce(function (val) {
      //   console.log('搜', val)
      // }, 500),
     // 获取当前定位
      getLocation () {
        const that = this
        wx.getLocation({
          type: 'wgs84',
          isHighAccuracy: true,
          success (res) {
            const {latitude, longitude} = res
            that.longitude = longitude
            that.latitude = latitude
            wx.setStorageSync('LONGITUDE', longitude)
            wx.setStorageSync('LATITUDE', latitude)
            that.qqmapsdk.reverseGeocoder({
              location: {
                latitude,
                longitude
              },
              success: function (res) {
                console.log(res.result, 'wx.getLocation')
                that.addr = res.result.ad_info.district
                wx.setStorageSync('CURRENT_ADDRESS', that.addr)
                 wx.setStorageSync('CURRENT_CITY', that.addr)
                console.log('定位信息', that.addr)
                that.getGoods()
              },
              fail: function (error) {
                console.error(error)
                that.addr = '定位失败'
                that.getGoods()
              }
            })
          }
        })
      },
        // 获取会员信息
    async getMyAccount () {
          var result = await getMyAccount()
          this.member = result.result.result.member
          this.mPartnerFlag = this.member.mPartnerFlag
          if (this.mPartnerFlag == 1) {
             this.topList.forEach(item => {
                if (item.flag == 222) { // 判断是否为收藏
                  item.img = '/static/images/yaoqing.png'
                  item.tip = '推广邀请'
                  item.flag = 2
                }
                // if (goodId == item.gId) {
                //     item.buyNum = item.buyNum + 1
                // }
              })
          }
        },
        // 跳转 搜素页
      goSearch () {
        let token = wx.getStorageSync('DIAN_TOKEN')
        if (!token) {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
        }
         wx.navigateTo({
              url: '/pages/pIndex/searchKeys/main'
          })
      },
      // 跳转店铺详情
      goShopDetail (id) {
        wx.navigateTo({
              url: '/pages/pIndex/shopDetail/main?id=' + id
          })
      },

      // 跳转商品详情
      goGoodDetail (id) {
        wx.navigateTo({
              url: '/pages/pIndex/goodDetail/main?id=' + id
          })
      },

      // 功能跳转
      goFunc (flag) {
        let token = wx.getStorageSync('DIAN_TOKEN')
        if (flag == 1 || flag == 2 || flag == 3 || flag == 4 || flag == 222) {
          if (!token) {
            wx.navigateTo({
                url: '/pages/pIndex/login/main'
            })
            return
          }
        }
  
        if (flag == 1) { // 付款码
            wx.navigateTo({
              url: '/pages/pOrder/payCode/main'
          })
        } else if (flag == 2) { // 推广邀请
          wx.navigateTo({
              url: '/pages/pMe/Extension/main'
          })
        } else if (flag == 3) { // 浏览足迹
          wx.navigateTo({
              url: '/pages/pMe/footprint/main'
          })
        } else if (flag == 4) { // 话费充值
          wx.navigateTo({
              url: '/pages/pMe/systemUpgradeHF/main?name=话费充值'
          })
        } else if (flag == 5) { // 附近的店
          wx.navigateTo({
              url: '/pages/pOrder/shopMap/main'
          })
        } else if (flag == 6) { // 0元购
          wx.switchTab({
            url: '/pages/order/main'
          })
        } else if (flag == 7) { // 百科
          wx.switchTab({
            url: '/pages/encyclopedia/main'
          })
        } else if (flag == 8) { // 会员
          wx.switchTab({
            url: '/pages/member/detail/main'
          })
        } else if (flag == 9) { // 轻松开店
          wx.navigateTo({
              url: '/pages/pMe/kaidian/main'
          })
        } else if (flag == 222) { // 收藏
          wx.navigateTo({
            url: '/pages/pMe/collectList/main'
          })
        }
      },
        // 获取首页推荐店铺
      async getGoods () {
          let longitude = wx.getStorageSync('LONGITUDE')
          let latitude = wx.getStorageSync('LATITUDE')
          console.log('longitude: ', longitude)
          console.log('latitude: ', latitude)
          if (!longitude) {
               longitude = 116.348215
               latitude = 39.732494
          }
          let param = {
            longitude: longitude,
            latitude: latitude,
            page: this.pageNo,
            pageSize: this.pageSize
          }
          let res = await getIndexGoods(param)
          if (res.errMsg === '接口调用成功') {
            let result = res.result.result
            this.currentPage = result.currentPage
            this.pageCount = result.pageCount
            if (result) {
              let records = result.records.map(item => {
                if (!item.children.length) {
                  item.children = [{}, {}]
                } else if (item.children.length === 1) {
                  item.children.push({})
                }
                return item
              })
              this.shopList = this.shopList.concat(records)
            }
          }
          console.log('返回值', res)
        }
    }
  }
</script>

<style lang="less" scoped>
.index-wrapper {
  color: @primary;
  background-color: @color-bg;
  padding: 34rpx 30rpx 0;
  
  .index-top {
    margin-bottom: 30rpx;
    .item {
      text-align: center;
      img {
        width: 50rpx;
        height: 48rpx;
      }
      .tip {
        font-size: 24rpx;
        margin-top: 24rpx;
      }
    }
  }
  .banner {
    background-color: @color-white;
    border-radius: 30rpx;
    padding: 30rpx 20rpx;
    .item {
      text-align: center;
      img {
        width: 90rpx;
        height: 86rpx;
      }
      .tip {
        color: @grey;
        font-size: 24rpx;
        margin-top: 30rpx;
      }
    }
  }
  .recommend {
    .title {
      margin: 30rpx 0 38rpx 0;
      font-size: 40rpx;
    }
    .recommend-items {
      display: flex;
      flex-wrap: wrap;
      .recommend-item {
        margin-bottom: 22rpx;
        flex: 0 0 calc(50% - 12rpx);
        &:nth-child(odd) {
          margin-right: 20rpx;
        }
        .recommend-top {
          position: relative;
          width: 334rpx;
          height: 334rpx;
          .mask {
            width: 334rpx;
            height:134rpx;
            position: absolute;
            z-index: 1;
            bottom: 0;
            left: 0;
            background-image: url('https://sniu.2dian.com/xcx/static/matou/wordbg.png');
            background-size: cover;
          }
          .shop-img {
            width: 334rpx;
            height: 334rpx;
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;
          }
          .shop-name {
            position: absolute;
            z-index: 3;
            left: 20rpx;
            bottom: 35rpx;
            font-size: 30rpx;
            color: @color-white;
          }
          .distance {
            position: absolute;
            z-index: 3;
            left: 20rpx;
            bottom: 5rpx; 
            font-size: 24rpx;
            color: @line;
          }
        }
        .recommend-bottom {
          display: flex;
          .goods-item {
            width: 167rpx;
            height: 167rpx;
            box-sizing: border-box;
            border-right: 1px solid @line;
            background: @color-white;
            &:last-of-type {
              border-right: none;
            }
            .goods-img {
              // width: 58rpx;
              // height: 137rpx;
              width: 167rpx;
              height: 167rpx;
            }
          }
        }
      }
    }
  }
  .more-wrapper {
    margin: 20rpx 0;
    text-align: center;
    .more-text {
      font-size: 24rpx;
      color: @border_gray;
    }
  }
}
</style>
