<template>
  <div class="container">
    <div class="swipter-tab flex">
          <div class="swipter-tab-item"  :class="{active:index == activeIndex?true:false}" v-for="(item,index) in tabItems" :key="index"
              @click="doChange(index)">
              {{item.name}}
          </div>
    </div>
    <!-- 收藏店铺 -->
    <div class="buyshop" v-if="activeIndex == 0" >
      <div 
        class="shopList" 
        @click="goShopDetail(item.sId)"  
        v-for="item in shopList" 
        :key="item.sId"
        @touchstart="touchStart($event,activeIndex)" 
        @touchend="touchEnd($event,index,activeIndex)" 
        :data-type="item.scrollType"
        >
        <div class="shopitem">
          <div class="img">
            <img :src="baseUrl + item.sPic" alt="">
          </div>
          <div class="middle">
            <div class="Sname">{{item.sTitle}}</div>
            <div class="Saddress">{{item.sAddressDetail}}</div>
          </div>
          <div class="contact">
            <!-- <div class="phone">{{item.sMobile}}</div> -->
            <div class="jl">距您<span>{{item.distance}}</span></div>
          </div>
        </div>
        <div class="cancel center" @click.stop="cancel(index,activeIndex)">
              取消收藏
        </div>
      </div>
    </div>
     <!-- 收藏0元购 -->
     <div class="buygood" v-if="activeIndex == 1">
            <div class="goods" 
              @click="goGoodDetail(item)"  
              v-for="(item,index) in goodList" 
              :key="index"
              @touchstart="touchStart($event,activeIndex)" 
              @touchend="touchEnd($event,index,activeIndex)" 
              :data-type="item.scrollType"
              >
                <div class="goods-item flex">
                  <div class="goods-img center">
                    <img :src="baseUrl+item.gPic" alt="" class="img">
                  </div>
                  <div class="goods-info">
                    <div class="goods-name">{{item.gTitle}}</div>
                    <!-- <div class="goods-desp">
                      {{item.gBq1}} | {{item.gBq2}}
                    </div> -->
                  
                    <div class="info-bottom">
                      <span class="discount"> ¥{{item.gSellingPrice}}</span>
                      <span class="original-price"> ¥{{item.gOriginalPrice}}</span>
                    </div>
                  </div>
                </div>
                <div class="cancel center" @click.stop="cancel(index,activeIndex)">
                  取消收藏
                </div>
            </div>
            
       </div>

    <!-- 收藏文章 -->
    <div class="bkList" v-if="activeIndex == 2">
      <div class="card" 
        @click="goWzDetail(item)"  
        v-for="(item,index) in acticleList" 
        :key="index"
        @touchstart="touchStart($event,activeIndex)" 
        @touchend="touchEnd($event,index,activeIndex)" 
        :data-type="item.scrollType"
        >
        <div class="card-item flex">
          <img :src="baseUrl+item.picSmall" alt="" >
          <div class="TitleContent">
            <div class="title">{{item.title}}</div>
            <div class="time">
              <span>{{item.pubDateStr}}</span>
              <span>{{item.readTimes || 0}}<span>阅读</span></span>
              <div><span class="tags" v-if="item.isOriginal == '1'">原创</span></div>
            </div>
          </div>
        </div>
        <div class="cancel center" @click.stop="cancel(index,activeIndex)">
              取消收藏
        </div>
      </div>
    </div>
    <!-- 空数据 -->
    <div class="more-wrapper" v-show="isShowNodata">
      <div class="more-text">
        <image class="empty-img" src="http://sniu.2dian.com/xcx/static/matou/nocollect.png"></image>
      </div>
       暂无数据
    </div>
  </div>
</template>
<script>
import {getShopCollectList, getAticleList, doFollowShop, valueCollect, encyFollow} from '@/utils/api'

export default {
  data () {
    return {
      baseUrl: this.$baseUrl,
      currentData: 0,
      activeIndex: 0,
      encyList: [],
      shopList: [], // 店铺列表
      goodList: [], // 零元购列表
      acticleList: [], // 文章列表
      pageSize: 10,
      pageNo: 1,
      isShowNodata: false,
      tabItems: [{id: 1, name: '店铺'}, {id: 2, name: '0元购'}, {id: 3, name: '文章'}]
    }
  },
  computed: {

  },
  components: {

  },
  async mounted () {
    // console.log(result)
    this.getList()
  },
  onUnload () {

  },
  methods: {
    // 取消收藏
    async cancel (index, activeIndex) {
      console.log('取消收藏', index)
      let params
      let res
      if (activeIndex == 0) {
        params = {
            sId: this.shopList[index].sId,
            state: 0
        }
        res = await doFollowShop(params)
        if (res) {
            if (res.errCode == 'USER_200') {
              this.getList()
            }
        }
      } else if (activeIndex == 1) {
        params = {
            fgGoodsId: this.goodList[index].fgGoodsId,
            fgOrderGoodsId: this.goodList[index].fgOrderGoodsId,
            state: 0
        }
        res = await valueCollect(params)
        if (res) {
            if (res.errCode == 'USER_200') {
              this.getList()
            }
        }
      } else if (activeIndex == 2) {
        params = {
            riId: this.acticleList[index].riId,
            status: 0
        }
        res = await encyFollow(params)
        if (res) {
            if (res.errCode == 'USER_200') {
              this.getActileList()
            }
        }
      }
    },
    // 滑动开始
    touchStart (e, activeIndex) {
      // 获取移动距离，可以通过打印出e，然后分析e的值得出
      this.startX = e.mp.changedTouches[0].clientX
      console.log('touchStart: ', e)
    },
    // 滑动结束
    touchEnd (e, index, activeIndex) {
      console.log('touchEnd: ', e)
      // 获取移动距离
      this.endX = e.mp.changedTouches[0].clientX
      if (this.startX - this.endX > 10) {
        if (activeIndex == 0) {
          for (let i = 0; i < this.shopList.length; i++) {
            this.shopList[i].scrollType = 0
          }
          this.shopList[index].scrollType = 1
        } else if (activeIndex == 1) {
          for (let i = 0; i < this.goodList.length; i++) {
            this.goodList[i].scrollType = 0
          }
          this.goodList[index].scrollType = 1
        } else if (activeIndex == 2) {
          for (let i = 0; i < this.acticleList.length; i++) {
            this.acticleList[i].scrollType = 0
          }
          this.acticleList[index].scrollType = 1
        }
      } else if (this.startX - this.endX < -10) {
        if (activeIndex == 0) {
          for (let i = 0; i < this.shopList.length; i++) {
            this.shopList[i].scrollType = 0
          }
        } else if (activeIndex == 1) {
          for (let i = 0; i < this.goodList.length; i++) {
            this.goodList[i].scrollType = 0
          }
        } else if (activeIndex == 2) {
          for (let i = 0; i < this.acticleList.length; i++) {
            this.acticleList[i].scrollType = 0
          }
        }
      }
    },
    // 跳转店铺详情
    goShopDetail (id) {
      wx.navigateTo({
            url: '/pages/pIndex/shopDetail/main?id=' + id
         })
    },
    // 跳转零元购详情
    goGoodDetail (item) {
        console.log('零元购跳转详情', item)
        wx.navigateTo({
          url: `/pages/pIndex/valueDetail/main?ogId=${item.fgOrderGoodsId}&id=${item.fgGoodsId}&gsGroup=${item.gsGroup}`
        })
    },

    // 跳转文章详情
    goWzDetail (item) {
        wx.navigateTo({
          url: '/pages/pEncyclopedia/detail/main?riId=' + item.riId + '&rcId=' + item.rcId
        })
    },

    doChange (index) {
      this.activeIndex = index
      // this.isShowNodata = true
      if (this.activeIndex == 0 || this.activeIndex == 1) {
        this.getList()
        this.acticleList = []
      } else {
        this.getActileList()
      }
    },

    async getList () {
      this.encyList = []
      let param = {
        latitude: 39.732494,
        longitude: 116.348215
      }
      let res = await getShopCollectList(param)
      if (res.errCode === 'USER_200') {
        console.log(res)
        let result = res.result.result
        if (result) {
          this.shopList = result.followShops.map(item => {
            item.scrollType = 0
            return item
          })
          this.goodList = result.followGoods.map(item => {
            item.scrollType = 0
            return item
          })
          if (this.activeIndex == 0 && this.shopList.length == 0) {
            this.isShowNodata = true
          } else if (this.activeIndex == 1 && this.goodList.length == 0) {
            this.isShowNodata = true
          } else {
             this.isShowNodata = false
          }
        }
      }
      console.log('返回值', res)
    },

    async getActileList () {
      let wzparam = {
        page: 1,
        pageSize: 1000
      }

      let wzData = await getAticleList(wzparam)
      if (wzData) {
        this.acticleList = wzData.result.result.records.map(item => {
          item.scrollType = 0
          return item
        })
        if (this.acticleList.length == 0) {
          this.isShowNodata = true
        } else {
          this.isShowNodata = false
        }
      }
    },

    checkCurrent: function (e) {
      const that = this
      if (that.currentData === e) {
        return false
      } else {
        that.currentData = e
      }
    }
  }
}
</script>

<style lang="less" scope>
page{
  background-color: #F7F7F7;
}
.container {
  position: relative;
  color: @primary;
  text-align:left;
  margin: 0;
  padding: 0;
  width: 100vw;
  overflow: hidden;
  font-size: 12px;
  background-color: #fff;
  top: 100rpx;
  .more-wrapper {
    // margin-top: 114rpx;
    padding-top:151rpx;
    padding-bottom:388rpx;
    font-size: 24rpx;
    color: #EAB149;
    text-align: center;
    .empty-img{
        width:222rpx;
        height:190rpx;
        padding-bottom:38rpx;
        background-size: 100% 100%;
    }
  }
  .shopList{
    width: calc(100vw + 154rpx);
    transition: all 0.2s;
    box-sizing: border-box;
    display: flex;
    // margin-top: 50px;
    &[data-type="0"] {
        transform: translate3d(0,0,0);
    }
    &[data-type="1"] {
        transform: translate3d(-154rpx,0,0);
    }
    .cancel {
      width: 154rpx;
      height: inherit;
      background: @color-orange;
      color: @color-white;
    }
    .shopitem{
      width: 100vw;
      height: 98px;
      padding: 19.5px 30rpx;
      box-sizing: border-box;
      border-bottom: 1px solid #E5E5E5; 
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .img{
        width: 59px;
        height: 59px;
        img{
            width: 59px;
            height: 59px;
        }
      }
      .middle{
        width: 200px;
        height: 59px;
        margin-left: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size:16px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        .Saddress{
          width: 147px;
          height: 40px;
          font-size:13px;
          font-family:PingFang SC;
          font-weight:400;
          overflow: hidden;
          text-overflow: ellipsis;
          // color:rgba(120,120,120,1);   //地址过长省略
          // height: 42px;
          // overflow: hidden;
          // white-space: nowrap;
          // line-height: 42px
        }
      }
      .contact{
        width: 120px;
        height: 59px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-end;
        .phone{
          font-size:13px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(120,120,120,1);
        }
        .jl{
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(153,153,153,1);
        }
      }
    }
  }

  .buygood{
    // margin-top: 50px;
  }

  .goods {
    width: calc(100vw + 154rpx);
    transition: all 0.2s;
    
    display: flex;
    &[data-type="0"] {
        transform: translate3d(0,0,0);
    }
    &[data-type="1"] {
        transform: translate3d(-154rpx,0,0);
    }
    .cancel {
      width: 154rpx;
      height: inherit;
      background: @color-orange;
      color: @color-white;
    }
    
    .goods-item {
      width: 100vw;
      padding: 30rpx;
      box-sizing: border-box;
      border-bottom: 1px solid @line;
      &:last-of-type {
        border-bottom: none;
      }
      .goods-img {
        width: 134rpx;
        height: 134rpx;
        margin-right: 20rpx;
        .img {
          width: 110rpx;
          height: 110rpx;
        }
      }
      .goods-info {
        flex: 1;
        .goods-name {
          width: 420rpx;
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

  .bkList {
    .card {
      width: calc(100vw + 154rpx);
      transition: all 0.2s;
      display: flex;
      background-color: #fff;
      &[data-type="0"] {
          transform: translate3d(0,0,0);
      }
      &[data-type="1"] {
          transform: translate3d(-154rpx,0,0);
      }
      .cancel {
        width: 154rpx;
        height: inherit;
        background: @color-orange;
        color: @color-white;
      }
      .card-item{
        width: 100vw;
        padding: 30rpx;
        box-sizing: border-box;
        border-bottom: 1px solid @line;
        &:last-of-type {
          border-bottom: none;
        }
        img{
          width: 97px;
          height: 70px;
        }
        .TitleContent{
          width: 235px;
          // height: 100%;
          // display: flex;
          // flex-direction: column;
          // justify-content: space-between;
            .title{
              width: 235px;
              height: 40px;
              font-size:14px;
              font-family:PingFang SC;
              font-weight:400;
              color:rgba(51,51,51,1);
            }
            .time{
              width: 100%;
              // height: 40px;
              display: flex;
              justify-content: space-between;
              flex-direction: row;
              text-align: center;
              font-size:12px;
              font-family:PingFang SC;
              font-weight:400;
              color:rgba(120,120,120,1);
              margin-top: 40rpx;
              // line-height: 40px;
                .tags{
                  width:36px;
                  height:17px;
                  line-height: 17px;
                  display: inline-block;
                  background:rgba(252,235,204,1);
                  border-radius:16px 18px 0px 16px;
                  font-size:12px;
                  font-family:PingFang SC;
                  font-weight:400;
                  color:rgba(254,106,0,1);
                  text-align: center;
                }
            }

        }
      }
    }
  }

  
  .tabbar{
    height: 45px;
    width: 100%;
    text-align: center;
    line-height: 45px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: #fff;
    border-top: 1px solid #F7F7F7;
    box-sizing: border-box;
    font-size:15px;
    font-family:PingFang SC;
    font-weight:400;
 
    .tabBorer{
      width: 90px;
      height: 45px;
      color:rgba(254,106,0,1);
      border-bottom: 1px solid #FE6A00;//激活状态样式
    }
    .tabitems{
      width: 90px;
      height: 45px;
      //未激活状态样式
    }
  }
  .swipter-tab{
        position:fixed;
        top:0;
        z-index:999;
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        background: #fff;
        width:100%;
        padding:0 30rpx;
        box-sizing: border-box;
        .swipter-tab-item{
          width: 50px;
          text-align: center;
            padding-top:44rpx;
            padding-bottom:14rpx;
            font-size: 16px;
            &.active{
                color:@color-orange;
                border-bottom:1rpx solid @color-orange;
            }
        }
    }

  .coupon-list{
        margin-top:100rpx;
        padding:20rpx 0rpx;
        width:100%;
        box-sizing: border-box;

  }
  .card{
    // width: 345px;
    // height: 95px;
    // margin: 10px 15px;
  }

  .Usable{
    background-image: url('https://sniu.2dian.com/xcx/static/matou/couponbk1.png');
    background-size: 345px 90px;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .liwupic{
      width: 100px;
      height: 95px;
      line-height: 95px;
      img{
        width: 44px;
        height: 44px;
        vertical-align: middle;
        margin: 0 28px;
      }
    }
    .content{
      width: 490px;
      height: 95px;
      padding: 10px 19px 8px 15px;
      box-sizing: border-box;
       .contop{
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .middle{
        width: 145px;
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 1px dashed #E5E5E5;
        .title{
          font-size:15px;
          font-family:PingFang SC;
          font-weight:400;
          color:#CCCCCC;
        }
        span{
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:#CCCCCC;
        }
      }
      .icon{
        width: 70px;
        height: 50px;
        border-bottom: 1px dashed #E5E5E5;
        line-height: 50px;
        text-align: center;
        img{
          width: 37px;
          height: 37px;
          vertical-align: middle;
        }
      }
      }
      .middle{
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 1px dashed #E5E5E5;
        .title{
          font-size:15px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(51,51,51,1);
        }
        span{
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(120,120,120,1);
        }
      }
      .time{
        height: 35px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(120,120,120,1);
        .right{
          border: 1px solid #FE6A00;
          color: #FE6A00;
          width:66px;
          height:20px;
          border:1px solid rgba(254,106,0,1);
          border-radius:10px;
          text-align: center;
          line-height: 20px;
        }
      }
    }
  }
  .Unusable{
    background-image: url('https://sniu.2dian.com/xcx/static/matou/couponbk2.png');
    background-size: 345px 90px;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .liwupic{
      width: 100px;
      height: 95px;
      line-height: 95px;
      img{
        width: 44px;
        height: 44px;
        vertical-align: middle;
        margin: 0 28px;
      }
    }
    .content{
      width: 490px;
      height: 95px;
      padding: 10px 19px 8px 15px;
      box-sizing: border-box;
      .contop{
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .middle{
        width: 145px;
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 1px dashed #E5E5E5;
        .title{
          font-size:15px;
          font-family:PingFang SC;
          font-weight:400;
          color:#CCCCCC;
        }
        span{
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:#CCCCCC;
        }
      }
      .icon{
        width: 70px;
        height: 50px;
        border-bottom: 1px dashed #E5E5E5;
        line-height: 50px;
        text-align: center;
        img{
          width: 37px;
          height: 37px;
          vertical-align: middle;
        }
      }
      }
      
      .time{
        height: 35px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:400;
        color:#CCCCCC;
       
      }
    }
  }

}
</style>
