<template>
  <div class="main">
    <!-- 主页搜索 -->
    <template v-if="searchType == 0">
      <div class="searchBox">
        <div class="input">
          <input placeholder-style="color:#EDEDED" @blur="changeFlag()" @focus="changeFlag()" type="search" v-model="searchName" />
          <img src="../../../../static/images/search.png" alt />
        </div>
        <div class="right" @click="searchGoodindex">搜索</div>
      </div>
      <!-- 热词列表 -->
      <div class="Keys" v-show='flag'>
        <div class="keysBox">
          <div class="title">
            <div class="text">最近搜索</div>
            <div class="del" @click="deleteUserSearcHis">
              <img src="../../../../static/images/delect.png" alt />
            </div>
          </div>
          <div class="keys" :class="more==true ? 'moreActive':'noMore'">
            <div v-for="(item,i) in sKeys" :key="item">
              <div class="keyitem" @click="searchindex(item.gsKeyword)" v-if="i<7">{{item.gsKeyword}}</div>
            </div>
            <div :class="more==true? 'hiden':'more'" @click="moreKeys" v-if="sKeys.length>=7">
              <img src="../../../../static/images/arrow.png" alt />
            </div>
            <div v-for="(item,i) in sKeys" :key="item">
              <div class="keyitem" @click="searchindex(item.gsKeyword)" v-if="i>=7">{{item.gsKeyword}}</div>
            </div>
          </div>
        </div>

        <div class="keysBox">
          <div class="title">
            <div class="text">热门搜索</div>
            <div class="del">
              <!-- <img src="../../../../static/images/delect.png" alt /> -->
            </div>
          </div>
          <div class="keys">
            <div v-for="item in hKeys" @click="searchindex(item.gsKeyword)" :key="item" class="keyitem">{{item.gsKeyword}}</div>
          </div>
        </div>
      </div>
      <!-- else -->
      <div class="noShop" v-if="noShop">
        <img src="http://sniu.2dian.com/xcx/static/matou/noshopdata.png" alt="">
        <div class='title'>没有符合条件的商家或商品</div>
      </div>
      <div class="recommend" v-show="!flag">
        <div class="recommend-items">
          <div class="recommend-item"  v-for="(shop,index) in shopList" :key="index">
            <div class="recommend-top" @click="goShopDetail(shop.sId)">
              <img :src="baseUrl+shop.sPic" alt class="shop-img" />
              <div class="shop-name">{{shop.sTitle}}</div>
              <div class="distance">距您{{shop.distance}}</div>
              <div class="mask"></div>
            </div>
            <div class="recommend-bottom" >
              <div class="goods-item center" @click="goGoodDetail(goods.gId)" v-for="(goods,inx) in shop.children" :key="inx" v-if="inx < 2">
                <img :src="baseUrl+goods.gPic" alt class="goods-img" v-if="goods.gPic" />
                <img src="https://sniu.2dian.com/xcx/static/matou/defaultgood.png" alt class="goods-img" v-else />
              </div>
            </div>
          </div>
        </div>

        <!-- 百科 -->
        <div class="bkList">
          <div class="card" @click="goDetail(item)" v-for="(item,index) in encyList" :key="index">
            <img :src="baseUrl+item.picSmall" alt="">
            <div class="TitleContent">
              <div class="title">{{item.title}}</div>
              <div class="time">
                <span>{{item.pubDateStr}}</span>
                <span>{{item.readTimes || 0}}<span>阅读</span></span>
                <div><span class="tags" v-if="item.isOriginal == '1'">原创</span></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 触底加载 -->
        <div class="more-wrapper" v-show="hasMore">
          <span class="more-text">努力加载中···</span>
        </div>
        <!-- <div class="more-wrapper">
          <span class="more-text">我是有底线的</span>
        </div> -->
      </div>
    </template>
    <!--  -->
    <template v-else>
      <div class="searchBox">
        <div class="input">
          <input placeholder-style="color:#EDEDED" @blur="changeFlag()" @focus="changeFlag()" type="search" v-model="searchName" />
          <img src="../../../../static/images/search.png" alt />
        </div>
        <div class="right" @click="searchGoodshop">搜索</div>
      </div>
      <!-- 热词列表 -->
      <div class="Keys" v-show='flag'>
        <!--  -->
        <div class="keysBox">
          <div class="title">
            <div class="text">最近搜索</div>
            <div class="del" @click="deleteUserSearcHis">
              <img src="../../../../static/images/delect.png" alt />
            </div>
          </div>
          <div class="keys" :class="moreActive">
            <div v-for="(item,i) in sKeys" :key="item">
              <div class="keyitem" @click="searchshop(item.gsKeyword)">{{item.gsKeyword}}</div>
            </div>
            <!-- <div :class="more==true? 'hiden':'more'" @click="moreKeys" v-if="sKeys.length>=7">
              <img src="../../../../static/images/arrow.png" alt />
            </div> -->
            <!-- <div v-for="(item,i) in sKeys" :key="item">
              <div class="keyitem" @click="searchshop(item.gsKeyword)" v-if="i>=7">{{item.gsKeyword}}</div>
            </div> -->
          </div>
        </div>

        <div class="keysBox">
          <div class="title">
            <div class="text">热门搜索</div>
            <div class="del">
              <!-- <img src="../../../../static/images/delect.png" alt /> -->
            </div>
          </div>
          <div class="keys">
            <div v-for="item in hKeys" @click="searchshop(item.gsKeyword)" :key="item" class="keyitem">{{item.gsKeyword}}</div>
          </div>
        </div>
        <!--  -->
      </div>
      <div class="noShop" v-if="noShop">
        <img src="http://sniu.2dian.com/xcx/static/matou/noshopdata.png" alt="">
        <div class='title'>没有符合条件的商家或商品</div>
      </div>
      <!--  -->
      <template v-if="!flag">
        <!-- 下面是商品列表 -->
        <div class="shop-list">
          <div class="good-list flex">

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
                    <image class="gouwuche-img" src="/static/images/gouwuche_unselected.png" @click="addGood(item.gId, item.gbSalePlat)">
                    </image>
                    <div class="red-circle" v-if="item.buyNum>0"></div>
                  </div>
                </div>
              </div>
            </div>
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
                      <div><span class="item-price"> ¥{{good.gPrice}}</span></div>
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
              <span class="price"> ¥{{cartInfo.itemTotalGprice}}</span>
              <!-- <span class="org-price"> {{cartInfo.itemTotalGOriginalPrice}}</span> -->
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
      </template>

      <!-- 结束111 -->
    </template>
    <template v-if="recommendShop.length!=0">
      <div class="recommend bottom">
        <div class="title">为您推荐</div>
        <div class="recommend-items">
          <div class="recommend-item" @click="goShopDetail(shop.sId)" v-for="(shop,index) in recommendShop" :key="index">
            <div class="recommend-top">
              <img :src="baseUrl+shop.sPic" alt class="shop-img" />
              <div class="shop-name">{{shop.sTitle}}</div>
              <div class="distance">距您{{shop.distance}}</div>
              <div class="mask"></div>
            </div>
            <div class="recommend-bottom">
              <div class="goods-item center" @click="goGoodDetail(goods.gId)" v-for="(goods,inx) in shop.children" :key="inx" v-if="inx < 2">
                <img :src="baseUrl+goods.gPic" alt class="goods-img" v-if="goods.gPic" />
                <img src="https://sniu.2dian.com/xcx/static/matou/defaultgood.png" alt class="goods-img" v-else />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { getUserSearcHis, searchGoods, shopGoodsList, shopHotGoodsList, shopAddGood, shopDelGood, shopCartList, shopCartClear, shopCartVerify, deleteUserSearcHis } from '@/utils/api'
import popup from '@/components/popup'
export default {
  data () {
    return {
      noShop: false, // 搜索为空 显示
      baseUrl: this.$baseUrl,
      recommendShop: '', // 搜索为空  推荐店铺
      shopList: [],
      encyList: '',
      searchName: '',
      hotGoods: [],
      sKeys: [

      ],
      hKeys: [

      ],
      more: false,
      flag: true,
      latitude: 0.0,
      longitude: 0.0,
      searchType: '', // 0首页搜索 1店铺搜索
      shopId: '',
      showCart: false,
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
  created () {

  },
  onLoad (option) {
    this.flag = true
    this.getUserSearcHis()
    this.getCartList()
    this.searchType = this.$mp.query.type

    console.log('option.shopId: ' + option.shopId)
    console.log('option.typeId: ' + option.typeId)
    this.shopId = option.shopId
  },
  onUnload () {
    this.recommendShop = []
    this.showCart = false
    this.shopList = []
    this.hotGoods = []
    this.encyList = []
    this.searchName = ''
  },
  mounted () {
    this.getUserSearcHis()
    this.getCartList()
    //  console.log(this.hKeys, this.sKeys)
  },
  methods: {
    async deleteUserSearcHis () {
      var res = await deleteUserSearcHis()
      this.sKeys = ''
      console.log(res)
    },
    changeFlag (e) {
      this.noShop = false
      this.recommendShop = ''
      this.flag = !this.flag
      console.log(this.flag)
    },
    moreKeys () {
      this.more = !this.more
    },
    async getUserSearcHis () {
      var res = await getUserSearcHis()
      this.hKeys = res.result.result.hotSearchList
      this.sKeys = res.result.result.searchList
      console.log(1111, this.hKeys, this.sKeys)
    },
    // 店铺关键字搜索
    async searchshop (keys) {
      this.flag = false
      wx.showLoading({
        title: '加载中'
      })

      // this.noShop = false
      this.getUserSearcHis()
      console.log(keys, 'keys')
      this.searchName = keys
      let params = {
        latitude: this.latitude,
        longitude: this.longitude,
        searchName: this.searchName,
        sId: this.shopId
      }
      var res = await searchGoods(params)
      // this.shopList = res.result.result.shop
      // this.encyList = res.result.result.articles
      this.recommendShop = res.result.result.recommendShop

      if (res.result.result.shop.length !== 0) {
        console.log(2)
        this.hotGoods = res.result.result.shop[0].children
      } else {
        console.log(1)
        this.hotGoods = ''
        this.noShop = true
        this.flag = false
        wx.showToast({
          title: '没有搜索结果'
        })
        console.log(this.hotGoods, 'hotGoods result')
      }
      wx.hideLoading()
    },
    // 首页的关键字搜索
    async searchindex (keys) {
       this.noShop = false
      this.flag = false
      wx.showLoading({
        title: '加载中'
      })

      this.getUserSearcHis()
      console.log(keys, 'keys')
      this.searchName = keys
      let params = {
        latitude: this.latitude,
        longitude: this.longitude,
        searchName: this.searchName
        // sId: this.shopId
      }
      var res = await searchGoods(params)
      this.shopList = res.result.result.shop
      this.encyList = res.result.result.articles
      this.recommendShop = res.result.result.recommendShop
      if (this.searchType !== 0) {
        this.hotGoods = res.result.result.shop[0].children
        wx.hideLoading()
      }

      if (this.shopList + this.encyList == 0) {
        this.noShop = true
        wx.showToast({
          title: '没有搜索结果'
        })
        wx.hideLoading()
      }
    },
    // 首页搜索
    async searchGoodindex () {
      this.flag = false
      wx.showLoading({
        title: '加载中'
      })
      let params = {
        latitude: this.latitude,
        longitude: this.longitude,
        searchName: this.searchName
      }
      var res = await searchGoods(params)
      this.shopList = res.result.result.shop
      this.encyList = res.result.result.articles
      this.recommendShop = res.result.result.recommendShop
      console.log(this.recommendShop, 'recommendShop')
      if (this.shopList + this.encyList == 0) {
        this.noShop = true
        wx.showToast({
          title: '没有搜索结果'
        })
      }
      console.log(res.result.result)
      wx.hideLoading()
    },
    // 店铺商品搜索
    async searchGoodshop () {
      wx.showLoading({
        title: '加载中'
      })
      this.flag = false
      // this.noShop = false
      var params = {
        //  firstType: this.firstType,
        latitude: this.latitude, // 33.327474,
        longitude: this.longitude, // 120.097976,
        sId: this.shopId, // 店铺id
        searchName: this.searchName // 搜索关键字
      }
      var result = await searchGoods(params)
      this.recommendShop = result.result.result.recommendShop
      console.log(this.recommendShop, 'recommendShop')
      console.log(result.result.result.shop.length, 'result.result.result.shop[0].length != 0')
      if (result.result.result.shop.length !== 0) {
        console.log(2)
        this.hotGoods = result.result.result.shop[0].children
      } else {
        console.log(1)
        this.hotGoods = ''
        this.noShop = true
        wx.showToast({
          title: '没有搜索结果'
        })
        console.log(this.hotGoods, 'hotGoods result')
      }
      wx.hideLoading()
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
    goDetail (item) {
      wx.navigateTo({
        url: '/pages/pEncyclopedia/detail/main?riId=' + item.riId + '&rcId=' + item.rcId
      })
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
      console.log(result, '购物车列表')
    },
    // 4.添加商品
    async addGood (goodId, gbSalePlat) {
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
        gbSalePlat: gbSalePlat
      }
      console.log('addGood...')
      let result = await shopAddGood(params)
      // this.getHotGoods()
      // this.getCartList()
      // this.searchGoodshop()
      this.hotGoods.forEach(item => {
        if (goodId == item.gId) {
          item.buyNum = item.buyNum + 1
        }
      })
      this.getCartList()
      console.log('addEnd...')
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
<style lang="less" scope>
.noShop {
  width: 100%;
  height: 84vh;
  position: relative;
  .title {
    width: 100%;
    height: 80px;
    text-align: center;
    font-size: 12px;
    color: #cdcdcd;
    position: absolute;
    top: 207px;
  }
  img {
    width: 120px;
    height: 80px;
    position: absolute;
    top: 120px;
    left: 120px;
  }
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

.bottom {
  position: fixed;
  padding: 0 10px;
  bottom: 0;
  width: 100%;
}
image {
  width: 24rpx;
  height: 24rpx;
}
page {
  background-color: @color-bg;
}
.more-wrapper {
  margin: 20rpx 0;
  text-align: center;
  .more-text {
    font-size: 24rpx;
    color: @border_gray;
  }
}
.noMore {
  overflow: hidden;
  max-height: 170rpx;
}
.hiden {
  display: none !important;
}
.main {
  width: 100%;
  // height: 100vh;
  .searchBox {
    width: 100%;
    height: 88rpx;
    background-color: #fff;
    padding: 12rpx 26rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .back {
      img {
        transform: rotate(180deg);
        width: 17rpx;
        height: 30rpx;
      }
    }
    .input {
      width: 600rpx;
      height: 64rpx;
      position: relative;
      background-color: #f2f2f2;
      border-radius: 8rpx;
      input {
        margin-left: 70rpx;
        width: 420rpx;
        height: 64rpx;
        overflow: hidden;
      }
      img {
        position: absolute;
        left: 20rpx;
        top: 18rpx;
        width: 28rpx;
        height: 28rpx;
      }
    }
    .right {
      height: 60rpx;
      width: 84rpx;
      line-height: 64rpx;
      text-align: center;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(81, 81, 81, 1);

      border: 0.5px solid #ccc;
      border-radius: 5%;
    }
  }
  .Keys {
    border-top: 1px solid 1px solid rgba(229, 229, 229, 1);
    width: 100%;
    box-sizing: border-box;
    .keysBox {
      margin-top: 56rpx;
      width: 100%;
      .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 32rpx;
        box-sizing: border-box;
        margin-bottom: 5px;
        .text {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .del {
          img {
            width: 32rpx;
            height: 30rpx;
          }
        }
      }
      .keys {
        margin-top: 30rpx;
        width: 100%;
        padding: 0 32rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        .keyitem {
          margin: 15rpx;
          height: 60rpx;
          padding: 0 16rpx;
          text-align: center;
          line-height: 60rpx;
          box-sizing: border-box;
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          border-radius: 30rpx;
          background: rgba(242, 242, 242, 1);
          color: rgba(120, 120, 120, 1);
        }
        .more {
          margin: 15rpx;
          height: 60rpx;
          width: 60rpx;
          padding: 0 16rpx;
          text-align: center;
          line-height: 60rpx;
          box-sizing: border-box;
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          border-radius: 60rpx;
          background: rgba(242, 242, 242, 1);
          color: rgba(120, 120, 120, 1);
          img {
            vertical-align: middle;
            transform: rotate(90deg);
            width: 17rpx;
            height: 30rpx;
          }
        }
      }
    }
  }
}
.recommend {
  margin-top: 20rpx;
  .title {
    margin: 30rpx 0 38rpx 0;
    font-size: 24rpx;
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

.bkList {
  padding: 0px 15px 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  background-color: #fff;
  .card {
    height: 111px;
    width: 345px;
    padding: 20px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid rgba(229, 229, 229, 1);

    img {
      width: 97px;
      height: 70px;
    }
    .TitleContent {
      width: 235px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        width: 235px;
        height: 40px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .time {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        text-align: center;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(120, 120, 120, 1);
        line-height: 40px;
        .tags {
          width: 36px;
          height: 17px;
          line-height: 17px;
          display: inline-block;
          background: rgba(252, 235, 204, 1);
          border-radius: 16px 18px 0px 16px;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(254, 106, 0, 1);
          text-align: center;
        }
      }
    }

    &:last-child {
      border: none; //最后一个不要显示边框
    }
  }
  // shop搜索
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
            // text-decoration: line-through;
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
  z-index: 10000;
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
  z-index: 9999;
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
</style>  
