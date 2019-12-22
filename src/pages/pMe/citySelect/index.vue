<template>
  <div class="select-citys">
    <div class="search-bar">
      <div class="search-input">
        <img src="/static/images/search.png" alt="">
        <input type="text" :value="address" placeholder="请输入城市名进行搜索" @blur="inputBlur">
      </div>
    </div>
    <div v-if="searchList.length" class="search-list">
      <div 
        class="search-item center-left" 
        v-for="(item,index) in searchList" 
        :key="index"
        @click="selectItem(item)"
      >
        {{item.name}}
      </div>
    </div>
    <div v-else>
      <div class="position-wrapper center-left">
          <img src="https://sniu.2dian.com/xcx/static/matou/dingwei.png" alt="" class="map-img">
          <span class="tip">当前定位城市  {{city}}</span>
        </div>
        <div class="citys-wrapper">
          <scroll-view
            class="city-list"
            :scroll-y="true"
            :scroll-with-animation="true"
            :scroll-top="scrollTop"
            @scroll="scroll"
          >
            <!-- :scroll-into-view="toView"  -->
            <div class="city-items" v-for="(city,index) in cityList" :key="index">
              <div class="city-title center-left" :id="city.pinyinPrefix">{{city.pinyinPrefix}}</div>
              <div class="city-item center-left" v-for="(item,inx) in city.citys" :key="inx" @click="selectItem(item)">
                {{item.name}}
              </div>
            </div>
          </scroll-view>
          <div class="city-bar">
            <div class="bar-item" 
              :class="{active: activeBar == item}" 
              v-for="(item,index) in barList" 
              :key="index"
              @click="selectCity(item)"
            >
              {{item}}
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import { getCityList, getCityByQuery } from '@/utils/api'
import { debounce } from '@/utils/tool'
var QQMapWX = require('../../../../lib/qqmap-wx-jssdk.min.js')
var _this
  export default {
    data () {
      return {
        city: '',
        cityList: [],
        barList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
        't', 'u', 'v', 'w', 'x', 'y', 'z'],
        activeBar: 'a',
        toView: 'a',
        searchList: [],
        scrollTop: 0,
        heights: []
      }
    },
    computed: {

    },
    components: {

    },
    mounted () {
      const that = this
      _this = this
      this.qqmapsdk = new QQMapWX({
        key: 'SDKBZ-66T34-UZPUY-DDPCH-GO6DK-AYFKQ'
      })
      this.qqmapsdk.getCityList({
        success: function (res) { // 成功后的回调
            let cityList = res.result[1]
            cityList = cityList.filter(item => /市/.test(item.fullname)).sort((pre, next) => pre.pinyin[0].localeCompare(next.pinyin[0]))
            that.trans(that.barList, cityList)
            that.calcHeight()
        }
      })
      const { city } = this.$root.$mp.query
      this.city = city
      this.init()
      // this.getCitys()
    },
    onUnload () {

    },
    methods: {
      calcHeight () {
        // city-title
        const that = this
        setTimeout(() => {
          wx.createSelectorQuery().selectAll('.city-title').boundingClientRect(function (rects) {
            console.log(rects, 1111)
            let heights = rects.map(item => item.top)
            let h0 = heights[0]
            that.heights = heights.map(item => {
              item -= h0
              return item
            })
          }).exec()
        }, 1000)
      },
      trans (pins, citys) {
        let cityList = []
        let barList = []
        pins.forEach(pin => {
            let list = citys.filter(c => c.pinyin[0].indexOf(pin) === 0)
            if (list.length) {
              cityList.push({
                pinyinPrefix: pin,
                citys: list
              })
              barList.push(pin)
            }
        })
        this.cityList = cityList
        this.barList = barList
      },
      init () { // 初始化变量
        // this.activeBar = 'a'
        // this.toView = 'a'
        // this.scrollTop = 0
        this.searchList = []
      },
      async getCitys () {
        let res = await getCityList()
        if (res.errCode === 'USER_200') {
          let list = res.result.result
          if (list && list.length > 0) {
            this.cityList = list
            this.barList = list.map(item => item.pinyinPrefix)
          }
        }
      },
      selectCity: debounce((item) => {
        _this.activeBar = item
        // this.toView = item
        _this.scrollTop = _this.heights[_this.barList.indexOf(item)]
        wx.showToast({
          title: item,
          icon: 'none',
          duration: 500
        })
      }, 300),
      scroll: debounce((e) => {
        console.log('滚动', e.target.scrollTop)
        _this.activeBar = _this.findIndex(e.target.scrollTop)
        _this.scrollTop = e.target.scrollTop
        console.log('字母列表', _this.activeBar)
        }, 300),
      findIndex (st) {
        for (var i = 0; i < this.heights.length; i++) {
          if (!this.heights[i + 1]) {
            return this.barList[this.barList.length - 1]
          }
          if (this.heights[i] <= st && this.heights[i + 1] > st) {
            return this.barList[i]
          }
        }
      },
      selectItem (item) {
        this.$store.commit('CITY_SET', item.name)
        wx.navigateBack({
          delta: 1
        })
      },
      async inputBlur (e) {
        let keyword = e.target.value

        let res = await getCityByQuery({query: keyword})
        if (res.errCode === 'USER_200') {
          console.log('结果', res)
          let list = res.result.result
          if (list && list.length > 0) {
            this.searchList = list
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.select-citys {
  color: @primary;
  background: @color-white;
  .search-bar {
    margin: 20rpx 30rpx;
    border: solid 2rpx @disabled;
    height: 64rpx;
    border-radius: 8rpx;
    .search-input {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      height: 64rpx;
      padding-left: 20rpx;
      img {
        width: 30rpx;
        height: 30rpx;
        margin-right: 15rpx;
      }
    }
  }
  .search-list {
    padding: 0 30rpx;
    .search-item {
      height: 86rpx;
      border-bottom: 1px solid @line;
      &:last-of-type {
        border-bottom: none;
      }
    } 
  }
  .position-wrapper {
    padding: 30rpx;
    border-top: solid 1px @line; 
    border-bottom: solid 1px @line;
    .map-img {
      width: 23rpx;
      height: 28rpx;
      margin-right: 10rpx;
    }
    .tip {
      font-size: 28rpx;
    }
  }
  .citys-wrapper {
    margin-top: 20rpx;
    .city-list {
      height: calc(100vh - 180rpx);
      .city-items {
        .city-title {
          height: 60rpx;
          background: @color-bg;
          color: @disabled;
          padding-left: 30rpx;
          font-size: 28rpx;
        }
        .city-item {
          height: 86rpx;
          color: @grey;
          padding-left: 30rpx;
          font-size: 28rpx;
          border-bottom: 1px solid @line;
          margin: 0 80rpx 0 20rpx;
          &:last-of-type {
            border-bottom: none;
          }
        }
      }
    }
    .city-bar {
      position: fixed;
      right: 30rpx;
      bottom: 10rpx;
      z-index: 30;
      background: @color-white;
      padding: 4rpx;
      height: calc(100vh - 220rpx);
      overflow: auto;
      // border: 1px solid @line;
      box-shadow: 0 0 2px 1px @line;
      .bar-item {
        width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        margin-bottom: 16rpx;
        font-size: 24rpx;
        color: @color-orange;
        &:last-of-type {
          margin-bottom: 0;
        }
        &.active {
          background: @line;
          border-radius: 50%; 
        }
      }
    }
  }
  
}
</style>
