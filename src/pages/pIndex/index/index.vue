<template>
  <div class="index-wrapper">
    <navigation-bar>
       <div class="bar-wrapper">
         <img src="/static/images/dingweidian.png" alt="" class="map-img">
         <span class="address">荣景东街 > </span>
          <div class="search-wrapper center-left">
            <img src="/static/images/search.png" alt="" class="search-img">
            <input type="text" class="search-input" placeholder="搜索">
          </div>
       </div>
    </navigation-bar>
    <div class="index-top space-around">
      <div class="item" v-for="(item,index) in topList" :key="index">
          <img :src="item.img" alt="" >
          <div class="tip">{{item.tip}}</div>
      </div>
    </div>
    <div class="banner space-between">
      <div class="item" v-for="(item,index) in bannerList" :key="index">
          <img :src="item.img" alt="" >
          <div class="tip">{{item.tip}}</div>
      </div>
    </div>
    <div class="recommend">
      <div class="title">好店推荐</div>
      <div class="recommend-items">
        <div class="recommend-item" v-for="(shop,index) in shopList" :key="index">
          <div class="recommend-top">
            <img :src="baseUrl+shop.sPic" alt="" class="shop-img">
            <div class="shop-name">{{shop.sTitle}}</div>
            <div class="distance">距您{{shop.distance}}</div>
            <div class="mask"></div>
          </div>
          <div class="recommend-bottom">
            <div class="goods-item center"  v-for="(goods,inx) in shop.children" :key="inx" v-if="inx < 2">
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
  import { getIndexGoods } from '@/utils/api'

  export default {
    data () {
      return {
        baseUrl: this.$baseUrl,
        topList: [
          {img: '/static/images/qr-code.png', tip: '付款码'},
          {img: '/static/images/yaoqing.png', tip: '推广邀请'},
          {img: '/static/images/zuji.png', tip: '浏览足迹'},
          {img: '/static/images/recharge.png', tip: '话费充值'}
        ],
        bannerList: [
          {img: 'https://sniu.2dian.com/xcx/static/matou/fujin.png', tip: '附近的店'},
          {img: 'https://sniu.2dian.com/xcx/static/matou/lingyuan.png', tip: '0元购'},
          {img: 'https://sniu.2dian.com/xcx/static/matou/baike.png', tip: '生活百科'},
          {img: 'https://sniu.2dian.com/xcx/static/matou/huiyuan.png', tip: '会员中心'},
          {img: 'https://sniu.2dian.com/xcx/static/matou/kaidian.png', tip: '轻松开店'}
        ],
        hasMore: false,
        items: 6,
        shopList: [],
        pageSize: 10,
        pageNo: 1,
        pageCount: 0,
        currentPage: -1
      }
    },
    computed: {

    },
    components: {
      navigationBar
    },
    async mounted () {
      await this.getGoods()
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
    methods: {
      async getGoods () {
        let param = {
          longitude: 116.348215,
          latitude: 39.732494,
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
  .bar-wrapper {
    display: flex;
    align-items: center;
    padding-left: 30rpx;
    height: 100%;
    .map-img {
      width: 35rpx;
      height: 40rpx;
    }
    .address {
      margin: 0 14rpx;
      font-size: 26rpx;
    }
    .search-wrapper {
      background: @input-bg;
      width: 300rpx;
      height: 50rpx;
      padding-left: 20rpx;
      .search-img {
        width: 28rpx;
        height: 28rpx;
      }
      .search-input {
        margin-left: 20rpx;
        font-size: 28rpx;
      }
    }
  }
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
            height: 334rpx;
            position: absolute;
            z-index: 1;
            top: 0;
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
            bottom: 60rpx;
            font-size: 30rpx;
            color: @color-white;
          }
          .distance {
            position: absolute;
            z-index: 3;
            left: 20rpx;
            bottom: 24rpx;
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
