<template>
  <div class="address-map">
    <div class="search-bar center">
      <div class="search-area" @click="selectCity">
        <img src="https://sniu.2dian.com/xcx/static/matou/dingwei.png" alt="" class="map-img">
        <span class="city">{{selectedCity || city}}</span>
        <img src="/static/images/area-arrow.png" alt="" class="area-arrow">
      </div>
      <div class="search-input">
        <img src="/static/images/search.png" alt="">
        <input type="text" :value="address" placeholder="请输入收货地址" @blur="inputBlur">
      </div>
      <div class="tip" @click="searchAddr">搜索</div>
    </div>
    <div class="map-wrapper" v-if="false">
      <map
        id="map"
        style="width: 100%; height: 100%;"
        :latitude="latitude"
        :longitude="longitude"
        :show-location="true"
        :show-compass="true"
        v-if="showMap"
      ></map>
    </div>
    <div class="addrs">
      <div class="addr" v-for="(item,index) in addressList" :key="item.id" @click="selectAddr(index,item)">
        <div class="flag" :class="{active: activeIndex == index}"></div>
        <div class="addr-right">
          <div class="title" :class="{active: activeIndex == index}">{{item.title}}</div>
          <div class="address">{{item.address}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // 引入SDK核心类
import { mapGetters } from 'vuex'
var QQMapWX = require('../../../../lib/qqmap-wx-jssdk.min.js')
  export default {
    data () {
      return {
        city: '',
        address: '',
        latitude: 40.01453,
        longitude: 116.352449,
        showMap: false,
        addressList: [],
        activeIndex: 0
      }
    },
    computed: {
      ...mapGetters({
        selectedCity: 'getCity'
      })
    },
    components: {

    },
    mounted () {
      this.$store.commit('CITY_SET', '')
      this.qqmapsdk = new QQMapWX({
        key: 'SDKBZ-66T34-UZPUY-DDPCH-GO6DK-AYFKQ'
      })
      this.mapCtx = wx.createMapContext('map')
      this.getLocation()
    },
    onUnload () {
  
    },
    methods: {
      getLocation () {
        const that = this
        wx.getLocation({
          type: 'wgs84',
          isHighAccuracy: true,
          success (res) {
            const {latitude, longitude} = res
            that.longitude = longitude
            that.latitude = latitude
            that.showMap = true
            that.qqmapsdk.reverseGeocoder({
              location: {
                latitude,
                longitude
              },
              success: function (res) {
                that.city = res.result.ad_info.city
              },
              fail: function (error) {
                console.error(error)
              }
            })
          }
        })
      },
      inputBlur (e) {
        this.address = e.target.value
      },
      searchAddr () {
        const that = this
        let city
        city = this.selectedCity ? this.selectedCity : this.city
        // let address = city + this.address
        this.qqmapsdk.getSuggestion({
          region: city,
          keyword: this.address,
          page_size: 5,
          success: function (res) {
            let addrs = res.data
            if (addrs.length > 0) {
              that.addressList = []
              that.latitude = addrs[0].location.lat
              that.longitude = addrs[0].location.lng
              addrs.map(item => {
                that.addressList.push({
                  id: item.id,
                  title: item.title,
                  address: item.address,
                  ...item.location
                })
              })
            } else {
              wx.showToast({
                title: '暂无搜索结果',
                icon: 'none'
              })
            }
          },
          fail: function (res) {
            console.log('错误信息', res)
          }
        })
      },
      selectAddr (index, item) {
        console.log('选择', item)
        this.activeIndex = index
        this.$store.commit('ADDR_SET', item)
        this.$store.commit('ADDR_DETAIL_SET', item)
        wx.navigateBack({
          delta: 1
        })
      },
      selectCity () {
        wx.navigateTo({
          url: '/pages/pMe/citySelect/main?city=' + this.city
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.address-map {
  color: @primary;
  background-color: @color-bg;
  height: 100vh;
  .search-bar {
    margin: 16rpx 30rpx;
    border: solid 2rpx #E5E5E5;
    width: 710rpx;
    height: 64rpx;
    background: #fff;
    border-radius: 8rpx;

    .search-area {
      // width: 170rpx;
      padding: 0 10rpx;
      border-right: solid 2rpx #E5E5E5;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      .city {
        width: 100rpx;
        .ellipsis();
      }
      .map-img {
        width: 23rpx;
        height: 28rpx;
        margin-right: 20rpx;
      }
      .area-arrow {
        width: 20rpx;
        height: 11rpx;
        vertical-align: 4rpx;
        margin-left: 20rpx;
        margin-right: 20rpx;
      }
    }
    .search-input {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      width: 360rpx;
      padding-right: 10rpx;
      padding-left: 10rpx;
      border-right: solid 1px @line;
      display: flex;
      img {
        width: 28rpx;
        height: 28rpx;
        margin-right: 15rpx;
      }
    }
    .tip {
      font-size: 28rpx;
      padding-left: 10rpx;
      min-width: 100rpx;
      text-align: center;
    }
  }
  .map-wrapper {
    // width: 100vw;
    height: 400rpx;
  }
  .addrs {
    padding-bottom: 80rpx;
    .addr {
      display: flex;
      padding: 30rpx 30rpx 0;
      .flag {
        margin-top: 8rpx;
        margin-right: 30rpx;
        width: 20rpx;
        height: 20rpx;
        background: @border_gray;
        border-radius: 50%;
        &.active {
          background: @color-orange;
        }
      }
      .addr-right {
        border-bottom: 1px solid @line;
        padding-bottom: 30rpx;
        flex: 1;
        .title {
          font-size: 28rpx;
          margin-bottom: 15rpx;
          &.active {
            color: @color-orange;
          }
        }
        .address {
          font-size: 24rpx;
          color: @disabled;
        }
      }
    }
  }
}
</style>
