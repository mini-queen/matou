<template>
  <div class="shop-map">
    <div class="section-map">
        <!-- :scale="scale" -->
      <map
        id="map"
        style="width: 100%; height: 100%;"
        :latitude="latitude"
        :longitude="longitude"
        :markers="markers"
        :show-location="true"
        :show-compass="true"
        @markertap="markertap"
        @callouttap="callouttap"
      ></map>
      <div class="search-bar center">
        <picker mode="region" class="search-area" :value="region" :custom-item="customItem" @change="bindRegionChange">
          {{region[0]}}{{region[1]}}{{region[2]}}
          <img src="/static/images/area-arrow.png" alt="">
        </picker>
        <div class="search-input">
          <img src="/static/images/search.png" alt="">
          <input type="text" :value="address" placeholder="请输入小区或地段名" @blur="inputBlur">
        </div>
        <div class="tip" @click="searchAddr">搜索</div>
      </div>
    </div>
    <div class="section-shop space-between">
      <div class="shop-left" @click="goShopDetail(shopInfo.sId)">
        <img :src="baseUrl+shopInfo.sPic" alt="" class="goods-img">
        <div class="goods-info">
          <div class="shop-name">{{shopInfo.sTitle}}</div>
          <div class="shop-sale">月售 {{shopInfo.sale}}单</div>
          <div class="shop-delivery">￥{{shopInfo.sBasicCharge}}起送 | {{shopInfo.sRan}}m内免配送费 </div>
          <div class="shop-labels">
            <!-- <span class="label">蛋糕蛋卷</span>
            <span class="label">土产干货</span> -->
            <span class="label" v-for="(item,index) in shopInfo.labels" :key="index">{{item}}</span>
          </div>
          <div class="info-bottom">
            <!-- <span class="favorable">满39减8</span> 
            <span class="favorable">满99减28</span>  -->
            <!-- <span class="open-time">24小时营业</span> -->
          </div>
        </div>
      </div>
      <div class="shop-right">
        <img src="/static/images/closed.png" v-if="shopInfo.sOpen > 0" alt="" class="closed">
        <div class="distance">{{shopInfo.distance}}</div>
      </div>
    </div>
  </div>
</template>
<script>
// 引入SDK核心类
import { getShopMap } from '@/utils/api'
import { mapGetters } from 'vuex'

var QQMapWX = require('../../../../lib/qqmap-wx-jssdk.min.js')

export default {
  data () {
    return {
      baseUrl: this.$baseUrl,
      address: '',
      qqmapsdk: '',
      latitude: 39.732494,
      longitude: 116.348215,
      scale: 11,
      sOpen: 0, // 开店状态 0-开店，1-闭店  -1 待开  -2 待开 （已认证）
      markers: [{
        id: 1,
        latitude: 39.732494,
        longitude: 116.348215,
        width: 15,
        height: 21,
        name: '店铺',
        iconPath: '/static/images/map-marker.png',
        callout: {
          content: '店铺',
          color: '#999',
          fontSize: '14',
          borderColor: '#cecece',
          borderRadius: 8,
          borderWidth: '1',
          display: 'ALWAYS',
          bgColor: '#ffffff',
          padding: 10
        }
      }],
      customItem: '全部',
      region: ['北京市', '', ''],
      shopInfo: {},
      shopList: []
    }
  },
  computed: {
    ...mapGetters({
      selectedAddr: 'getAddr'
    })
  },
  watch: {
    selectedAddr (val) {
      // this.address = val.address
      if (val.lat) {
        this.latitude = val.lat
        this.longitude = val.lng
      }
      this.shopMap()
    }
  },
  components: {

  },
  mounted () {
    this.init()
    this.qqmapsdk = new QQMapWX({
      key: 'SDKBZ-66T34-UZPUY-DDPCH-GO6DK-AYFKQ'
    })
    this.mapCtx = wx.createMapContext('map')
    this.shopMap()
  },
  onUnload () {

  },
  methods: {
     // 跳转店铺详情
    goShopDetail (id) {
      wx.navigateTo({
          url: '/pages/pIndex/shopDetail/main?id=' + id
      })
    },
    init () { // 数据初始化
      this.$store.commit('ADDR_SET', {})
      this.address = ''
      let longitudeLocal = wx.getStorageSync('LONGITUDE')
      let latitudeLocal = wx.getStorageSync('LATITUDE')
      console.log('longitudeLocal: ', longitudeLocal)
       console.log('latitudeLocal: ', latitudeLocal)
      if (longitudeLocal) {
        this.longitude = longitudeLocal
        this.latitude = latitudeLocal
      } else {
        this.latitude = 39.732494
        this.longitude = 116.348215
      }
    },
    async shopMap () {
      let param = {
        city: this.region.join('').replace(/([\u4e00-\u9fa5]+)\1([\u4e00-\u9fa5]+)/g, '$1$2').replace('全部', ''), // + this.address,
        latitude: this.latitude,
        longitude: this.longitude
      }
      let res = await getShopMap(param)
      if (res.errCode == 'USER_200') {
        let ret = res.result.result
        console.log('结果', ret)
        if (ret && ret.shopList.length > 0) {
          this.shopList = ret.shopList
          this.shopInfo = ret.shopList[0]
          this.shopInfo.labels = this.shopInfo.sLabel.split(/\s+/)
          this.setMapInfo()
        } else {
          wx.showToast({
            title: '暂无搜索结果',
            icon: 'none'
          })
          this.markers = []
          // this.mapCtx.moveToLocation({
          //   longitude: this.longitude,
          //   latitude: this.latitude
          // })
        }
      }
    },
    setMapInfo () {
      let locations = []
      this.latitude = this.shopInfo.sLat
      this.longitude = this.shopInfo.sLon
      this.markers = this.shopList.map(item => {
        locations.push({
          latitude: item.sLat,
          longitude: item.sLon
        })
        let obj = {
          id: item.sId,
          latitude: item.sLat,
          longitude: item.sLon,
          width: 15,
          height: 21,
          name: item.sTitle,
          iconPath: '/static/images/map-marker.png',
          callout: {
            content: item.sTitle,
            color: '#333',
            fontSize: '14',
            borderColor: '#999',
            borderRadius: 8,
            borderWidth: '1',
            display: 'ALWAYS',
            bgColor: '#ffffff',
            padding: 10
          }
        }
        return obj
      })
      // 调整位置 展示所有marker
      // this.mapCtx.includePoints({
      //   padding: [10],
      //   points: locations
      // })
    },
    // 点击标记点时触发
    markertap (e) {
      this.shopInfo = this.shopList.find(item => item.sId == e.mp.markerId)
      this.latitude = this.shopInfo.sLat
      this.longitude = this.shopInfo.sLon
    },
    // 点击标记点对应的气泡时触发
    callouttap (e) {
      this.shopInfo = this.shopList.find(item => item.sId == e.mp.markerId)
      this.latitude = this.shopInfo.sLat
      this.longitude = this.shopInfo.sLon
    },
    bindRegionChange: function (e) {
      this.region = e.target.value
      this.geoCoder()
    },
    // 地址解析为坐标
    geoCoder () {
      const that = this
      let addr = this.region.join('').replace(/([\u4e00-\u9fa5]+)\1([\u4e00-\u9fa5]+)/g, '$1$2').replace('全部', '')
      this.qqmapsdk.geocoder({
        address: addr,
        success: function (res) {
          let location = res.result.location
          that.latitude = location.lat
          that.longitude = location.lng
          console.log('坐标', location)
        }
      })
    },
    inputBlur (e) {
      this.address = e.target.value
    },
    searchAddr () {
      let city = this.region.join('').replace(/([\u4e00-\u9fa5]+)\1([\u4e00-\u9fa5]+)/g, '$1$2').replace('全部', '')
      wx.navigateTo({
          url: `/pages/pOrder/shopMapList/main?city=${city}&address=${this.address}`
      })
      // const that = this
      // let address = this.region.join('') + this.address
      // this.qqmapsdk.search({
      //   keyword: address,
      //   success: function (res) {
      //     let addrs = res.data
      //     if (addrs.length > 0) {
      //       let locations = []
      //       that.latitude = addrs[0].location.lat
      //       that.longitude = addrs[0].location.lng
      //       that.markers = addrs.map(item => {
      //         locations.push({
      //           latitude: item.location.lat,
      //           longitude: item.location.lng
      //         })
      //         let obj = {
      //           id: item.id,
      //           latitude: item.location.lat,
      //           longitude: item.location.lng,
      //           width: 15,
      //           height: 21,
      //           name: item.title,
      //           iconPath: '/static/images/map-marker.png',
      //           callout: {
      //             content: item.title,
      //             color: '#333',
      //             fontSize: '14',
      //             borderColor: '#999',
      //             borderRadius: 8,
      //             borderWidth: '1',
      //             display: 'ALWAYS',
      //             bgColor: '#ffffff',
      //             padding: 10
      //           }
      //         }
      //         return obj
      //       })
      //       // 调整位置 展示所有marker
      //       that.mapCtx.includePoints({
      //         padding: [10],
      //         points: locations
      //       })
      //       // setTimeout(() => {
      //       //   that.mapCtx.getCenterLocation({
      //       //     success: function (res) {
      //       //       console.log(res.longitude)
      //       //       console.log(res.latitude)
      //       //       that.latitude = res.latitude
      //       //       that.longitude = res.longitude
      //       //     }
      //       //   })
      //       // }, 300)
      //     } else {
      //       wx.showToast({
      //         title: '暂无搜索结果',
      //         icon: 'none'
      //       })
      //     }
      //   },
      //   fail: function (res) {
      //     console.log(345, res)
      //   }
      // })
    }
  }
}
</script>
<style lang="less" scoped>
.shop-map {
  color: @primary;
  background-color: @color-bg;
  .section-map {
    height: calc(100vh - 300rpx);
    .search-bar {
      position: fixed;
      top: 16rpx;
      margin: 0 20rpx;
      border: solid 2rpx #E5E5E5;
      width: 710rpx;
      height: 64rpx;
      background: #fff;
      border-radius: 8rpx;

      .search-area {
        width: 300rpx;
        .ellipsis();
        // display: flex;
        // align-items: center;
        // justify-content: space-between;
        // padding-right: 10rpx;
        border-right: solid 2rpx #E5E5E5;
        font-size: 28rpx;
        img {
          width: 20rpx;
          height: 11rpx;
          vertical-align: 4rpx;
        }
      }
      .search-input {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        width: 290rpx;
        padding-right: 10rpx;
        padding-left: 10rpx;
        border-right: solid 1px @line;
        display: flex;
        img {
          width: 34rpx;
          height: 28rpx;
          margin-right: 6rpx;

        }
      }
      .tip {
        font-size: 28rpx;
        padding-left: 10rpx;
      }
    }
  }
  .section-shop {
    height: 300rpx;
    box-sizing: border-box;
    padding: 30rpx;
    border-top: solid 2px @line;
    background: @color-white;
    .shop-left {
      display: flex;
      .goods-img {
        width: 194rpx;
        height: 210rpx;
        border: solid 1px @line;
      }
      .goods-info {
        margin-left: 20rpx;
        .shop-name {
          font-size: 30rpx;
        }
        .shop-sale {
          margin-top: 10rpx;
          font-size: 24rpx;
          color: @grey;
        }
        .shop-delivery {
          margin-top: 10rpx;
          font-size: 24rpx;
          color: @grey;
        }
        .shop-labels {
          margin-top: 10rpx;
          .label {
            box-sizing: border-box;
            width: 100rpx;
            height: 32rpx;
            font-size: 22rpx;
            color: @grey;
            border: solid 1px @line;
            margin-right: 10rpx;
            padding: 4rpx 6rpx;
          }
        }
        .info-bottom {
          margin-top: 10rpx;
          .favorable {
            box-sizing: border-box;
            padding: 4rpx 6rpx;
            width: 100rpx;
            height: 32rpx;
            font-size: 22rpx;
            color: @color-orange;
            border: solid 1px @color-orange;
            margin-right: 10rpx;
          }
          .open-time {
            font-size: 22rpx;
            color: @grey;
          }
        }
      }
    }
    .shop-right {
      .closed {
        width: 94rpx;
        height: 58rpx;
        margin-bottom: 50rpx;
      }
      .distance {
        font-size: 24rpx;
        color: @disabled;
      }
    }
  }
}
</style>
