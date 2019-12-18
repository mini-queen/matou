<template>
  <div class="container">
    <div class="shopList" v-for="item in shopList" :key="item.sId">
      <div class="shopitem">
        <div class="img" @click="goShopDetail(item.sId)">
          <img :src="baseUrl + item.sPic" alt />
        </div>
        <div class="middle" @click="goShopDetail(item.sId)">
          <div class="Sname">{{item.sTitle}}</div>
          <div>
            <div class="gray yueshou">月售{{item.goodsCount}}单</div>
          </div>
          <div class="gray">
            距您
            <span>{{item.distance}}</span>
          </div>
          <div class="gray shopType" v-if="true">自营商品 ￥0起送</div>
          <div class="gray shopType" v-if="false">￥0起售 | 商城商品 一件包邮</div>
          <div class="tags" v-if="item.sLabel.length<=1"></div>
          <div class="tags" v-else>
            <div class="tagsItems" v-for="(tag,i) in item.sLabel" :key="i">{{tag}}</div>
          </div>
        </div>
        <div class="contact" @click="joinHHR(item.sId, item.sTitle)" v-if="fromType == 0">
          <img src="http://sniu.2dian.com/xcx/static/matou/hehuoren2.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getShopRecommendList } from '@/utils/api'

export default {
  data () {
    return {
      baseUrl: this.$baseUrl,
      shopList: [],
      pageSize: 7,
      pageNo: 1,
      pageCount: 0,
      couponid: 0,
      longitude: 0.0,
      latitude: 0.0,
      fromType: 0 // 1为从超值购跳转过来
    }
  },
  computed: {},
  components: {},

  onLoad (option) {
    this.fromType = option.fromType
    console.log('fromType: ', this.fromType)
  },

  mounted () {
    this.longitude = wx.getStorageSync('LONGITUDE')
    this.latitude = wx.getStorageSync('LATITUDE')
    console.log(this.longitude, 'longitude')
    console.log(this.latitude, 'latitude')
    this.getShopList()
  },

  onReachBottom () {
    this.hasMore = this.pageCount > this.currentPage
    if (this.hasMore) {
      // 模拟请求接口、获取数据、添加数据
      setTimeout(async () => {
        this.pageNo++
        await this.getShopList()
        this.hasMore = false
      }, 500)
    }
  },

  onUnload () {
    this.shopList = []
      this.pageSize = 7
      this.pageNo = 1
      this.pageCount = 0
      this.couponid = 0
      this.longitude = 0.0
      this.latitude = 0.0
      this.fromType = 0 // 1为从超值购跳转过来
  },
  methods: {
    joinHHR (sid, title) {
      wx.navigateTo({
        url: `/pages/pEncyclopedia/member/joinCopartner/main?shopId=${sid}&shopName=${title}`
      })
    },

    // 跳转店铺详情
    goShopDetail (id) {
      wx.navigateTo({
        url: '/pages/pIndex/shopDetail/main?id=' + id
      })
    },

    async getShopList () {
      let param = {
        longitude: this.longitude,
        latitude: this.latitude,
        page: this.pageNo,
        pageSize: this.pageSize
      }
      let res = await getShopRecommendList(param)
      if (res.errCode === 'USER_200') {
        console.log(res)
        let result = res.result.result
        console.log(result)

        if (result) {
          let result = res.result.result
          this.currentPage = result.currentPage
          this.pageCount = result.pageCount
          if (result) {
            let records = result.records
            result.records.map(e => {
              var a = ''

              a = e.sLabel

              e.sLabel = a.split(',')
            })
            this.shopList = this.shopList.concat(records)
          }
        }
      }

      console.log('返回值', this.shopList)
    }
  }
}
</script>

<style lang="less" scope>
.gray {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(120, 120, 120, 1);
}
page {
  background-color: #f7f7f7;
}
.container {
  color: @primary;
  font-size: 12px;

  .shopList {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 10px;
    .shopitem {
      width: 100%;
      height: 274rpx;
      padding: 19.5px 0;
      box-sizing: border-box;
      // border-bottom: 1px solid #E5E5E5;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .img {
        width: 194rpx;
        height: 194rpx;
        img {
          width: 194rpx;
          height: 194rpx;
        }
      }
      .middle {
        width: 200px;
        height: 194rpx;
        margin-left: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        .Saddress {
          width: 147px;
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(120, 120, 120, 1);
        }
        .tags {
          height: 32rpx;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          .tagsItems {
            text-align: center;
            width: 100rpx;
            height: 32rpx;
            border: 1rpx solid rgba(229, 229, 229, 1);
            font-size: 11px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(120, 120, 120, 1);
            margin-left: 5px;
          }
        }
      }
      .contact {
        width: 120px;
        height: 59px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-end;
        margin-top: 20px;
        img {
          width: 115rpx;
          height: 115rpx;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
