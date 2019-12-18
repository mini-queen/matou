<template>
  <div class="shop-detail-wrap">
    <div class="searchbox">
      <img src="../../../../static/images/search.png" alt="">
      <input type="text" v-model="searchKey" placeholder="搜索" placeholder-style="color:#CCCCCC">
      <div class="btn" @click="searchGoods">搜索</div>
    </div>

    <div class="shop-list">

      <div class="good-list flex">

        <template v-if="activeTab === 1">
          <!-- 店铺商城 -->
          <div class="good-item" v-for="(item,index) in hotGoods" :key="index">
            <image class="good-img" :src="baseUrl + item.gPic" @click="goGoodDetail(item.gId)"></image>
            <div class="good-detail">
              <!-- <div class="good-name">{{item.gTitle}}</div> -->
              <div class="good-name" @click="goGoodDetail(item.gId)">{{item.gbShortName}}</div>
              <div class="good-price-wrap flex">
                <div>
                  <div>
                    <image class="price-img" src="/static/images/price.png"></image>
                    <span class="good-price">¥{{item.gPrice}}</span>
                  </div>
                  <div class="good-org-price" style="padding:0"> ¥{{item.gOriginalPrice}}</div>
                </div>
                <div class="gouwuche-img-red">
                  <image class="gouwuche-img" src="/static/images/gouwuche_unselected.png" @click="addGood(item.gId)">
                  </image>
                  <div class="red-circle" v-if="item.buyNum>0"></div>
                </div>
              </div>
            </div>
          </div>

        </template>
      </div>
    </div>
    <!-- 购物车 -->
    <div class="cart-wrap" v-if="showCart">
      <div class="cart-center">
        <div class="title">
          请选择购物车完成结算
          <image class="close-img" src="/static/images/close.png" @click="showCart=false"></image>
        </div>
        <div class="tab-wrap flex">
          <div class="tab-item" v-for="(item,index) in tabs" :key="index" :class="{active:activeTab === index?true:false}" @click="changeCartTab(index)">
            {{item}}
            <div class="tab-bottom"></div>
          </div> 
        </div>
        <div class="cart-list">
          <div class="title flex">
            <!-- <span>共{{cartInfo.itemCount}}件商品，已优惠{{favorPirce}}元</span> -->
            <span>共{{cartInfo.itemCount}}件商品</span>
            <span @click="clearCart">
              <image src="/static/images/delect.png" class="delect-img"></image>清空
            </span>
          </div>
          <div class="good-item-wrap">
            <div class="good-item flex" v-for="(good,good_index) in cartInfo.list" :key="good_index">
              <image class="item-img" :src="baseUrl + good.gbPic"></image>
              <div class="item-des">
                <div class="item-name">{{good.gbName}}</div>
                <div class="item-unit">{{good.gUnitLabel}}</div>
                <div class="item-num flex">
                  <div><span class="item-price"> {{good.gPrice}}</span></div>
                  <div class="add-substract-wrap flex">
                    <div class="substract" @click="subNum(good.buyNum,good)">-</div>
                    <div class="num">{{good.buyNum}}</div>
                    <div class="add" @click="addNum(good.buyNum,good)">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 结算按钮 -->
    <div class="pay-button-wrap">
      <div class="pay-button flex" v-if="cartInfo.itemCount>0">
        <div class="cart-img-red">
          <image class="cart-img" src="/static/images/gouwuche.png" @click="getCartList({show:true})">
          </image>
          <i class="red-circle">{{cartInfo.itemCount}}</i>
        </div>
        <div>
          <span class="price"> {{cartInfo.itemTotalGprice}}</span>
          <span class="org-price"> {{cartInfo.itemTotalGOriginalPrice}}</span>
        </div>
        <div class="go-pay" @click="goPay(cartInfo)">去结算</div>
      </div>
      <!-- 空的购物车 -->
      <div class="pay-button flex" v-else>
        <div class="cart-img-red">
          <image class="cart-img" src="/static/images/cart.png">
          </image>
          <span class="empty-text">购物车是空的</span>
        </div>
        <div class="go-pay unactive">去结算</div>
      </div>
    </div>
  </div>
</template>
<script>
import navigationBar from './navbar'
import tooltip from './tooltip'
import popup from '@/components/popup'
import { searchGoods, shopGoodsList, shopHotGoodsList, shopAddGood, shopDelGood, shopCartList, shopCartClear, shopCartVerify, getTypeGoodsList } from '@/utils/api'
export default {
  components: { popup, navigationBar, tooltip },
  data () {
    return {
      searchKey: '',
      goodName: null,
      shopId: 10002059, // 当前店铺id
      latitude: 33.327474, // 当前经纬度
      longitude: 120.097976, // 当前经纬度
      firstType: '', // 一级分类
      baseUrl: this.$baseUrl,
      shopInfo: {},
      shopLabels: [],
      hotGoods: [],
      showTip: false,
      showCart: false,
      shopName: '鑫哲的网络小店',
      tabs: ['店铺自营', '店铺商城'],
      activeTab: 1,
      payIndex: 0,
      cartList: [],
      cartInfo: {},
      categoryData: []
    }
  },
  computed: {
    favorPirce () {
      if (this.cartInfo.itemTotalGOriginalPrice && this.cartInfo.itemTotalGprice) {
        return (this.cartInfo.itemTotalGOriginalPrice * 1 - this.cartInfo.itemTotalGprice * 1).toFixed(2)
      } else {
        return ''
      }
    }
  },

  onLoad (option) {
    console.log('option.shopId: ' + option.shopId)
    console.log('option.typeId: ' + option.typeId)
    this.shopId = option.shopId
    this.firstType = option.typeId
    this.typeName = option.typeName
    wx.setNavigationBarTitle({
      title: this.typeName
    })
  },
  mounted () {
    this.getAll()
  },
  onUnload () {
    this.showCart = false
    this.searchKey = ''
  },
  // onShareAppMessage (res) {
  //     if (res.from == 'button') {
  //     // 页面内分享
  //     }
  //     return {
  //        success: (res) => {
  //            console.log(res, '分享成功')
  //            this.showTip = false
  //        }
  //     }
  // },
  methods: {
       goGoodDetail (id) {
      console.log('goodId in shopDetail:' + id)
      wx.navigateTo({
            url: `/pages/pIndex/goodDetail/main?id=${id}`
         })
    },
    getAll () {
      // this.getGoodsCateGory()
      this.getHotGoods()
      this.getCartList()
    },
    // 搜索
    async searchGoods () {
      var params = {
        firstType: this.firstType,
        latitude: this.latitude, // 33.327474,
        longitude: this.longitude, // 120.097976,
        sId: this.shopId, // 店铺id
        searchName: this.searchKey // 搜索关键字
      }
      var result = await searchGoods(params)
      console.log(result.result.result.shop)
      if (result.result.result.shop.length !== 0) {
        this.hotGoods = result.result.result.shop[0].children
        console.log(this.hotGoods, 'result')
      } else {
          this.hotGoods = ''
          wx.showToast({
              title: '没有搜索结果'
          })
      }
    },
    // 搜索结束

    changeSearch (name) {
      this.goodName = name
      console.log(this.goodName, 'input goodname')
    },
    // 收藏
    favorite () {

    },
    // 分享
    share () {
      this.showTip = false
    },

    // 2. 获取商品列表(0:自营1.商城)
    async getHotGoods (option) {
      let params = {
        shopId: this.shopId,
        salePlat: 1,
        typeFirst: this.firstType
      }
      let result = (await getTypeGoodsList(params)).result.result
      this.shopInfo = result.shop
      this.shopLabels = result.shop.sLabel ? result.shop.sLabel.split(',') : []
      // this.hotGoods = result.listTypeSecondAndGoods[0].goods
      this.hotGoods = result.GoodsList
      // console.log(this.hotGoods, '热销商品')
    },
    // 3.购物车列表
    async getCartList (option) {
      let params = {
        gbSalePlat: this.activeTab, // 0自营 1商城
        shopId: this.shopId
      }
      let result = (await shopCartList(params)).result.result.items[0]
      // this.cartInfo = result
      this.cartInfo = Object.assign({}, result)
      if (option.show) {
        this.showCart = true
      }
      // console.log(result, '购物车列表')
    },
    // 4.添加商品
    async addGood (goodId) {
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (!token) {
        wx.navigateTo({
          url: '/pages/pIndex/login/main'
        })
      }
      let params = {
        gId: goodId,
        count: 1,
        shopId: this.shopId,
        gbSalePlat: this.activeTab
      }
      let result = await shopAddGood(params)
      this.getHotGoods()
      this.getCartList()
      // console.log(result, '添加商品')
    },
    // 5.删除商品
    async delGood (goodId, count, item) {
      count--
      let params = {
        gId: goodId,
        count: count,
        shopId: this.shopId,
        gbSalePlat: this.activeTab
      }
      let result = await shopDelGood(params)
      this.getCartList({ show: true })
      this.getHotGoods()
      // console.log(result, '删除商品')
    },
    entry () {
      this.showTip = !this.showTip
    },
    goBack () {
      wx.navigateBack({
        delta: 1
      })
    },
    // 6.清空购物车
    async clearCart () {
      let params = {
        gbSalePlat: this.activeTab,
        shopId: this.shopId
      }
      let result = await shopCartClear(params)
      this.getCartList()
      this.getHotGoods()
      this.showCart = false
    },
    // 添加商品
    addNum (num, item) {
      item.buyNum++
      this.addGood(item.goodsId)
    },
    // 删除商品
    subNum (num, item) {
      if (item.num > 0) {
        item.buyNum--
      }
      this.delGood(item.goodsId, item.buyNum)
    },
    // 商家详情
    goMerchant () {
      wx.navigateTo({ url: `/pages/pIndex/merchantDetail/main?shopId=${this.shopId}` })
    },
    // 招募老板/店铺合伙人
    goJoin () {
      wx.navigateTo({ url: `/pages/pEncyclopedia/member/joinCopartner/main?shopId=${this.shopId}` })
    },
    // 切换商品类型tab
    changeTab (index) {
      this.activeTab = index
      this.getHotGoods({ salePlat: index })
      this.getCartList()
    },
    // 切换购物车tab
    changeCartTab (index) {
      this.activeTab = index
      this.getCartList()
    },
    // 去结算
    async goPay (option) {
      let result = await this.payVerify(option)
      if (result.errCode == 'USER_200') {
        console.log('activeTab: ' + this.activeTab)
        // 校验成功
        if (this.activeTab == 0) {
          // 自营商品订单
          wx.navigateTo({ url: `/pages/pOrder/shopOrder/main?shopId=${this.shopId}&gbSalePla=${this.activeTab}&ocIds=${option.ocIds}` })
        } else {
          // 商城商品订单
          wx.navigateTo({ url: `/pages/pIndex/goodOrder/main?shopId=${this.shopId}&gbSalePla=${this.activeTab}&ocIds=${option.ocIds}` })
        }
      }
    },
    // 8.结算调用
    async payVerify (option) {
      let params = {
        gbSalePlat: this.activeTab,
        shopId: this.shopId,
        ocIds: option.ocIds
      }
      let result = await shopCartVerify(params)
      return result
    }
  }
}
</script>  
<style lang="less" scoped>
.bar-wrapper {
  display: flex;
  align-items: center;
  padding-left: 30rpx;
  height: 100%;
  position: relative;
  .action-btns {
    width: 170rpx;
    height: 60rpx;
    border: solid 1px @line;
    border-radius: 32rpx;
    display: flex;
    box-sizing: border-box;
    padding: 10rpx;
    margin-right: 30rpx;
    .btn-back {
      flex: 1;
      border-right: solid 1px @line;
      box-sizing: border-box;
      img {
        width: 30rpx;
        height: 20rpx;
        transform: rotate(90deg);
      }
    }
    .btn-entry {
      flex: 1;
      img {
        width: 30rpx;
        height: 21rpx;
      }
    }
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
.shop-detail-wrap {
  background: @color-bg;
  padding-bottom: 160rpx;
  overflow: hidden;
  min-height: 100Vh;
  .searchbox {
    margin: 0 auto;
    margin-top: 20px;
    width: 690rpx;
    height: 32px;
    background-color: #ffffff;
    line-height: 32px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    img {
      margin-left: 10px;
      width: 28rpx;
      height: 28rpx;
      margin-right: 12.5px;
    }
    input {
      width: 521rpx;
    }
    .btn {
      width: 96rpx;
      height: 15px;
      font-size: 14px;
      line-height: 15px;
      text-align: center;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(81, 81, 81, 1);
      border-left: 1px solid #999999;
    }
  }
  .delect-img {
    width: 24rpx;
    height: 22rpx;
    vertical-align: middle;
    padding-right: 10rpx;
  }
  .close-img {
    width: 24rpx;
    height: 24rpx;
  }
  .add-substract-wrap {
    .num {
      padding: 0 26rpx;
    }
    .add,
    .substract {
      width: 40rpx;
      height: 40rpx;
      font-size: 24rpx;
      text-align: center;
      border: 1rpx solid @line;
      border-radius: 50%;
      background: #fff;
      color: #999;
    }
    .add {
      background: @color-orange;
      border-color: @color-orange;
      color: #fff;
      // margin-left:10rpx;
    }
  }
  .category-img {
    width: 100%;
    height: 200rpx;
    text-align: center;
    color: #fff;
    background-image: url(https://sniu.2dian.com/xcx/static/matou/typebg.png);
    background-size: 100% 100%;
    position: relative;
    .name {
      font-size: 50rpx;
      line-height: 200rpx;
    }
    .all {
      position: absolute;
      right: 30rpx;
      bottom: 30rpx;
      font-size: 28rpx;
    }
  }
  .shop-detail {
    background: linear-gradient(
      90deg,
      rgba(188, 189, 210, 1),
      rgba(219, 217, 228, 1)
    );
    padding: 40rpx 30rpx 32rpx 30rpx;
    color: #fff;
    box-sizing: border-box;
    .shop-img {
      width: 182rpx;
      height: 182rpx;
    }
    .shop-name-wrap {
      flex-grow: 1;
      padding-left: 30rpx;
      .shop-name {
        font-size: 32rpx;
      }
      .shop-labels {
        // justify-content: space-between;
        // justify-content: space-around;
        justify-content: flex-end;
        .label-item {
          padding: 2rpx 4rpx;
          font-size: 22rpx;
          border: 1rpx solid #fff;
          margin-right: 10rpx;
        }
        .zhaomu-img {
          width: 110rpx;
          height: 110rpx;
        }
      }
    }
    .shop-tip {
      font-size: 24rpx;
      padding-top: 26rpx;
    }
  }
  .shop-list {
    width: 100%;
    box-sizing: border-box;
    .shop-tab-switch {
      width: 100%;
      padding: 30rpx;
      font-size: 30rpx;
      background: #fff;
      color: #333;
      box-sizing: border-box;
      .item {
        flex-grow: 1;
        text-align: center;
        position: relative;
        &:first-of-type {
          border-right: 1rpx solid @line;
        }
        &.active {
          color: @color-orange;
          .item-bottom {
            width: 30%;
          }
        }
        .item-bottom {
          position: absolute;
          bottom: -30rpx;
          left: 0;
          right: 0;
          width: 0;
          height: 2rpx;
          background: @color-orange;
          margin: 0 auto;
          transition: all 0.3s ease;
        }
      }
      .item-left {
        border-right: 1rpx solid @line;
      }
    }
    .good-list {
      margin-top: 18rpx;
      padding: 0 30rpx;
      flex-wrap: wrap;
      box-sizing: border-box;
      width: 100%;
      .good-item {
        box-sizing: border-box;
        background: #fff;
        width: 334rpx;
        border: 2rpx solid @line;
        margin-bottom: 20rpx;
        border-radius: 10rpx;
        .good-img {
          width: 100%;
          height: 334rpx;
        }
        .good-detail {
          box-sizing: border-box;
          padding: 20rpx;
          .good-name {
            font-size: 26rpx;
            height: 100rpx;
            padding-bottom: 20rpx;
            overflow: hidden;
          }
          .good-price-wrap {
            box-sizing: border-box;
            padding-top: 30rpx;
            font-size: 26rpx;
            color: @color-orange;
            text-align: left;
            .price-img {
              width: 72rpx;
              height: 24rpx;
            }
            .good-price {
              font-size: 36rpx;
            }
            .good-org-price {
              //    text-decoration: line-through;
              padding-left: 10rpx;
              color: @grey;
            }
            .gouwuche-img {
              width: 52rpx;
              height: 52rpx;
            }
            .gouwuche-img-red {
              position: relative;
              .red-circle {
                position: absolute;
                top: 4rpx;
                right: 0;
                display: inline-block;
                width: 18rpx;
                height: 18rpx;
                background: red;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
  }
  // 分类
  .category-wrap {
    margin-top: 30rpx;
    width: 100%;
    .category-list {
      width: 100%;
      justify-content: flex-start;
      overflow-x: auto;
      .item {
        width: 220rpx;
        border-radius: 10rpx;
        margin-top: 14rpx;
        font-size: 24rpx;
        border: 1rpx solid @line;
        margin-right: 10rpx;
        background: #fff;
        .item-img {
          width: 220rpx;
          height: 220rpx;
        }
        .item-name {
          padding: 10rpx 20rpx;
          font-size: 24rpx;
        }
        .item-member-price {
          padding-top: 6rpx;
          padding-left: 20rpx;
          font-size: 26rpx;
          color: @color-orange;
          .member-price-img {
            width: 60rpx;
            height: 18rpx;
            padding-right: 10rpx;
          }
        }
        .item-price {
          padding: 0rpx 20rpx 10rpx 20rpx;
          font-size: 24rpx;
          color: @grey;
        }
      }
    }
  }
  // 结算按钮
  .pay-button-wrap {
    box-sizing: border-box;
    position: fixed;
    z-index: 9999;
    bottom: 30rpx;
    padding: 0 30rpx;
    height: 90rpx;
    width: 100%;
    .pay-button {
      box-sizing: border-box;
      padding-left: 40rpx;
      height: 90rpx;
      border-radius: 45rpx;
      background: #fff;
      border: 1rpx solid @line;
      .cart-img-red {
        position: relative;
        .cart-img {
          width: 52rpx;
          height: 52rpx;
          vertical-align: middle;
        }
        .red-circle {
          position: absolute;
          top: -10rpx;
          right: -20rpx;
          width: 40rpx;
          line-height: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          background: #ff0000;
          color: #fff;
          text-align: center;
          font-size: 20rpx;
        }
        .empty-text {
          font-size: 26rpx;
          color: @grey;
          vertical-align: middle;
          padding-left: 30rpx;
        }
      }
      .price {
        font-size: 40rpx;
        color: @color-orange;
        padding-left: 30rpx;
      }
      .org-price {
        font-size: 24rpx;
        color: @grey;
        padding-left: 30rpx;
        // text-decoration: line-through
      }

      .go-pay {
        width: 200rpx;
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        border-radius: 45rpx;
        color: #fff;
        font-size: 30rpx;
        background: @color-orange;
        &.unactive {
          background: #cdcdcd;
        }
      }
    }
  }
  // 购物车面板
  .cart-wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.6);
    .cart-center {
      position: absolute;
      width: 100%;
      padding-bottom: 140rpx;
      bottom: 0rpx;
      background: #fff;
      border-radius: 20rpx 20rpx 0 0;
      .title {
        border-radius: 20rpx 20rpx 0 0;
        width: 100%;
        height: 90rpx;
        line-height: 90rpx;
        background: #fcebcc;
        text-align: center;
        color: @grey;
        font-size: 24rpx;
        position: relative;
        .close-img {
          position: absolute;
          right: 30rpx;
          top: 30rpx;
          padding: 0 30rpx;
        }
      }
      .tab-wrap {
        width: 100%;
        height: 90rpx;
        line-height: 90rpx;
        border-bottom: 1rpx solid @line;
        .tab-item {
          height: 90rpx;
          font-size: 30rpx;
          text-align: center;
          flex-grow: 1;
          color: #333;
          position: relative;
          .tab-bottom {
            position: absolute;
            bottom: 0;
            left: 10%;
            right: 10%;
            width: 0;
            height: 2rpx;
            transition: all 0.3s linear;
            background: @color-orange;
          }
          &.active {
            color: @color-orange;
            .tab-bottom {
              width: 80%;
            }
          }
        }
      }
      .cart-list {
        padding: 0 30rpx;
        background: #fff;
        .title {
          font-size: 24rpx;
          color: @grey;
          height: 70rpx;
          line-height: 70rpx;
          background: #fff;
        }
        .good-item-wrap {
          max-height: 600rpx;
          overflow-y: auto;
          .good-item {
            border-top: 1rpx solid @line;
            padding: 34rpx 0;
            .item-img {
              width: 110rpx;
              height: 110rpx;
              border: 1rpx solid @line;
              margin-right: 20rpx;
            }
            .item-des {
              flex-grow: 1;
              text-align: left;
              .item-name {
                font-size: 28rpx;
              }
              .item-unit {
                font-size: 20rpx;
                color: @grey;
                padding: 10rpx 0;
              }
              .item-num {
                .item-price {
                  color: @color-orange;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>