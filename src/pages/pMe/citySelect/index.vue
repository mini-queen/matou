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
        {{item.cname}}
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
            :scroll-into-view="toView" 
            @scroll="scroll"
          >
            <div class="city-items" v-for="(city,index) in cityList" :key="index">
              <div class="city-title center-left" :id="city.pinyinPrefix">{{city.pinyinPrefix}}</div>
              <div class="city-item center-left" v-for="(item,inx) in city.citys" :key="inx" @click="selectItem(item)">
                {{item.cname}}
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
  export default {
    data () {
      return {
        city: '',
        cityList: [],
        barList: [],
        activeBar: 'A',
        toView: 'A',
        searchList: []
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
      const { city } = this.$root.$mp.query
      this.city = city
      this.init()
      this.getCitys()
    },
    onUnload () {
  
    },
    methods: {
      init () { // 初始化变量
        this.activeBar = 'A'
        this.toView = 'A'
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
      selectCity (item) {
        this.activeBar = item
        this.toView = item
        wx.showToast({
          title: item,
          icon: 'none',
          duration: 500
        })
      },
      scroll (e) {
        console.log('滚动', e)
      },
      selectItem (item) {
        this.$store.commit('CITY_SET', item.cname)
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
