<template>
  <div class="purchase">
    <div class="goods space-between" @click="goDetail(item)" v-for="(item,index) in purchaseList" :key="index">
      <div class="goods-left center-left">
        <div class="goods-img" >
          <span class="flag center" :class="[classMap[item.ogCurrState] || 'end']">{{statusMap[item.ogCurrState] || '活动已结束'}}</span>
          <img :src="baseUrl+item.gPic" alt="" class="img">
        </div>
        <div class="goods-info">
          <div class="goods-name">{{item.gTitle}}</div>
          <div class="goods-desp">
            {{item.gBq1}} | {{item.gBq2}}
          </div>
          <div class="reward center">邀请奖励每单{{item.gOneMoney}}码粒</div>
          <div class="info-bottom">
            <img src="/static/images/member-price.png" alt="">
            <span class="discount"> ¥{{item.gPriceGroups}}</span>
            <span class="original-price"> ¥{{item.gSellingPrice}}</span>
          </div>
        </div>
      </div>
      <div class="goods-right">
        <div class="button" v-if="item.ogCurrState == 100">0元购</div>
        <div v-else-if="item.ogCurrState == 200">
          <div class="tip">距开始</div>
          <!-- 12:12:12 -->
          <div class="button time">{{item.time}}</div>
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
  import { getPurchaseList } from '@/utils/api'
  export default {
    data () {
      return {
        baseUrl: this.$baseUrl,
        pageSize: 10,
        pageNo: 1,
        pageCount: 0,
        currentPage: -1,
        purchaseList: [], // 订单列表
        hasMore: false, // 是否有更多数据加载
        statusMap: { // 活动状态
          100: '热销',
          200: '即将开始'
        },
        classMap: { // 活动状态码
          100: 'hot',
          200: 'pending'
        }
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
      this.getList()
    },
    onUnload () {
      // 清除定时器
      clearInterval(this.timer)
    },
    onPullDownRefresh () {
      this.pageNo = 1
      this.getList(true)
    },
    onReachBottom () {
      this.hasMore = this.pageCount > this.currentPage
      if (this.hasMore) {
        // 模拟请求接口、获取数据、添加数据
        setTimeout(async () => {
          this.pageNo++
          await this.getList()
          this.hasMore = false
        }, 1000)
      }
    },
    methods: {
      // 获取零元购列表
      async getList (init = false) {
        let param = {
          curr: this.pageNo,
          rows: this.pageSize,
          city: '北京市'
        }
        let res = await getPurchaseList(param)
        if (res.errCode === 'USER_200') {
          let result = res.result.result
          this.currentPage = result.currentPage
          this.pageCount = result.pageCount
          if (result) {
            let records = result.records
            // .map(item => { 测试倒计时
            //   item.ogCurrState = 200
            //   return item
            // })
            if (init) {
              this.purchaseList = records
              setTimeout(() => {
                wx.stopPullDownRefresh()
              }, 500)
            } else {
              this.purchaseList = this.purchaseList.concat(records)
            }
            this.reciprocal(this.purchaseList)
          }
        }
      },
      //  倒计时
      reciprocal (items) {
        if (this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
          items.forEach(item => {
            this.countdown(item)
          })
        }, 1000)
      },
      countdown (item) {
        // let diff = item.ogEtime - +new Date() 测试倒计时
        let diff = item.ogStime - +new Date()
        if (diff >= 0 && item.ogCurrState == 200) {
          let intDiff = Math.floor(diff / 1000)
          let day = 0
          let hour = 0
          let minute = 0
          let second = 0 // 时间默认值
          if (intDiff > 0) {
            // 计算相关的天，小时，还有分钟，以及秒
            // day = Math.floor(intDiff / (60 * 60 * 24))
            // 天和小时合体
            hour = Math.floor(intDiff / (60 * 60))
            minute = Math.floor(intDiff / 60) - hour * 60
            second = Math.floor(intDiff) - hour * 60 * 60 - minute * 60
          }
          // hour = '0' + hour
          minute = String(minute).padStart(2, '0')
          second = String(second).padStart(2, '0')
          item.time = `${hour}:${minute}:${second}`
          intDiff--
          if (intDiff < 0) {
            item.time = '00:00:00'
          }
        } else {
          item.time = '00:00:00'
        }
        this.$forceUpdate()
      },
      // 跳转详情
      goDetail (item) {
        console.log('跳转详情', item)
        if (item.ogCurrState != 100 && item.ogCurrState != 200) { return }
        wx.navigateTo({
          url: `/pages/pIndex/valueDetail/main?ogId=${item.og_id}&id=${item.gId}&gsGroup=${item.gsGroup}`
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.purchase {
  color: @primary;
  background: @color-white;
  padding: 0 30rpx;
  .goods {
    padding: 40rpx 0;
    border-bottom: 1px solid @line;
    &:last-of-type {
      border-bottom: none;
    }
    .goods-left {
      .goods-img {
        width: 200rpx;
        height: 200rpx;
        position: relative;
        margin-right: 20rpx;
        .flag {
          position: absolute;
          left: 0;
          top: 0;
          width: 134rpx;
          height: 32rpx;
          color: @color-white;
          font-size: 22rpx;
          &.hot {
            background: @color-orange;
          }
          &.pending {
            background: @label_font;
          }
          &.end {
            background: @border_gray;
          }
        }
        .img {
          width: 110rpx;
          height: 110rpx;
          position: absolute;
          bottom: 0;
          transform: translateX(-50%);
          left: 50%;
        }
      }
      .goods-info {
        .goods-name {
          width: 300rpx;
          font-size: 26rpx;
          margin-bottom: 10rpx;
          .ellipsis();
        }
        .goods-desp {
          font-size: 24rpx;
          color: @disabled;
        }
        .reward {
          margin-top: 24rpx;
          width: 228rpx;
          height: 38rpx;
          background: @label_orange;
          color: @color-orange;
          font-size: 22rpx;
        }
        .info-bottom {
          margin-top: 20rpx;
          img {
            width: 73rpx;
            height: 24rpx;
          }
          .discount {
            font-size: 32rpx;
            margin-right: 18rpx;
            color: @color-orange;
          }
          .original-price {
            font-size: 22rpx;
            color: @disabled;
          }
        }
      }
    }
    .goods-right {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      .button {
        .btn--primary();
        width: 100rpx;
        height: 50rpx;
        line-height: 50rpx;
        font-size: 24rpx;
        border-radius: 6rpx;
        &.time {
          width: 120rpx;
        }
      }
      .tip {
        margin-bottom: 8rpx;
        font-size: 22rpx;
        color: @color-orange;
        text-align: center;
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
