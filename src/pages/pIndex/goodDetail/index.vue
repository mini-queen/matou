<template>
  <div class="container">
    <div class="section-banner">
      <swiper class="banner-wrap" @change="bannerChange">
        <div v-for="(item,index) in bannerList" :key="index">
          <swiper-item class="banner-item">
            <image :src="baseUrl + item.gbpPic" alt="banner-icon" />
          </swiper-item>
        </div>
      </swiper>
      <div class="swiper-num">
        {{current}}/{{bannerNum}}
      </div>
    </div>
    <div class="section-title">
      <div class="flex">
        <div class="name">{{name}}111</div>
        <div class="share flex" @click="share">
          <img class="share-img" src="/static/images/fenxiang.png" alt="">
          <span>分享</span>
          <!-- <button class="share-button" open-type="share">分享</!-->
        </div>
      </div>
      <!-- <div class="sale-num">月售{{saleNum}}单</div> -->
      <div class="sale-num"></div>
      <div class="flex">
        <div>
          <img class="price-img" src="/static/images/price.png" alt="会员价图标">
          <span class="m-price"><span style="font-size:10px"> </span>¥{{mPrice}}</span> 
          <span class="price"> ¥{{price}}</span>
        </div> 
        <div>
          <!-- <span class="limit-num">限{{limtNum}}份</span>   -->
          <span class="cart-button"  @click="addCart" v-if="goodBuyNum == 0">加入购物车</span>
          <div class="add-subtract" v-else>
            <div class="circle subtract" @click="subCart">-</div>
              {{goodBuyNum}}
            <div class="circle add"  @click="addCart">+</div>
          </div>
        </div>
      </div>
    </div>
        <div class="section-note">
        <div v-if="ShopRate > 0">购物奖励<span class="tip">尊享超值权益 买即得码粒<span class="orange-color">   {{ShopRate}}</span>/件</span></div>
        <div class="up-button flex" @click="openVip" v-if="isShowVip">
          <span>升级VIP会员 帮您省出小金库</span> <span class="up-line">立即升级>></span>
        </div>
        <div class="border-line"></div>
        <div v-if="ShopCommission > 0">推广权益<span class="tip">合伙人专享 分享赚码粒<span class="orange-color">   {{ShopCommission}}</span>/件</span></div>
    </div>
    <div class="section-detail">
      <div class="name">商品详情</div>
      <wxParse :content="goodInfo.gDetail"/>
    </div>
    <div class="section-introduce">
       <div class="img" v-if="false">
         <img src="/static/images/shop.jpg" alt="商品图片">
       </div>
       <div class="item-wrap">
          <div class="flex"> 
            <div class="border-line"></div>价格说明<div class="border-line"></div>
          </div>
          <div class="item mt40">
            <span class="item-name">划线价：</span>
            <span>{{linePriceDetail}}</span>
          </div>
          <div class="item">
              <span class="item-name">未划线价：</span>
              <span>{{priceDetail}}</span>
          </div>
          <div class="item">
            *此说明仅当出现价格比较时有效，若商家单独对划线价格进行说明的，以商家的表述为准
          </div>
       </div>
    </div>
    <!-- <div class="section-footer">
      <div class="cart-button-wrap flex">
        <div v-if="cartNum>0" class="cart-img">
          <image src="/static/images/gouwuche.png"/>
          <div class="num">{{cartNum}}</div>
        </div>
        <div v-if="cartNum>0" class="cost-wrap">
          <span class="cost"> {{unitNum*cartNum}}</span>
          <span class="origin-cost"> {{unitOrgNum*cartNum}}</span>
        </div>
        <div v-if="cartNum == 0">
          <image class="cart-img" src="/static/images/gouwuche_unselected.png"/>
          <span style="color:#999;margin-left:20rpx;vertical-align:middle">购物车是空的</span>
        </div>
        <div class="go-account" :class="[cartNum>0?'active':null]" @click="goPay">去结算</div>
      </div>
    </div> -->

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
                    <span @click="clearCart"><image src="/static/images/delect.png" class="delect-img"></image>清空</span>
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
            <!-- <div @click="goPay(cartInfo)" class="buyNow">立即购买</div> -->
        </div>
    </div>
    <!-- 结算按钮 -->
    <div class="pay-button-wrap">
        <div class="pay-button flex" v-if="cartInfo.itemCount>0" >
            <div class="cart-img-red" @click="getCartList({show:true})">
                <image class="cart-img" src="/static/images/gouwuche.png" @click="getCartList({show:true})">
                </image>
                <i class="red-circle">{{cartInfo.itemCount}}</i>
            </div>
            <div @click="getCartList({show:true})">
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

    <div class="poster-modal" v-if="canvasHidden" :catchtouchmove="true">
      <div class='imagePathBox'>
        <button class='baocun' @click='baocun'>保存相册，分享到朋友圈</button>
        <button class='cancelShareBtn' @click='hiddenMaskHidden'>取消</button>
        <!-- <image :src="imagePath" class='shengcheng'></image> 
         -->
      </div>
      <canvas 
        class="myCanvas" 
        canvas-id="mycanvas" 
        :style="{width: screenWidth+'px', height: screenHeight+'px'}"
      />
    </div>
 
    <popup  :isShow="isShow" @closeModal="closeModal">
        <div class="popup-content">
            <div class="title">
              商家配送范围有限，建议分享给您附近朋友
              <image class="close-img" src="/static/images/close.png" @click="isShow=false"></image>
            </div>
            
            <div class="actions space-between">
                <div class="share-wx action">
                    <button open-type="share">
                        <img src="/static/images/weixin2.png" alt="" class="img">
                        <div class="text">微信好友</div>
                    </button>
                </div>
                <div class="poster action" @click="genPoster">
                    <img src="/static/images/poster.png" alt="" class="img">
                    <div class="text">生成海报</div>
                </div>
            </div>
            <div class="btn center" @click="closeModal">取消</div>
        </div>
    </popup>
  </div>
</template>
<script>
  import { getGoodsDetail, getIndustryRate, shopAddGood, shopDelGood, shopCartList, shopCartClear, shopCartVerify, genSharepic, getMyAccount } from '@/utils/api'
  import wxParse from 'mpvue-wxparse'
  import popup from '@/components/popup'
  let Fly = require('flyio/dist/npm/wx')
  export default {
    components: {
      wxParse, popup
    },
    data () {
      return {
        baseUrl: this.$baseUrl,
        baseUrl3: this.$baseUrl3,
        shareUrlServer: this.$sharePic,
        isShow: false,
        msg: '代销商品详情',
        name: '',
        saleNum: 0,
        mPrice: 0,
        price: 0,
        goodId: 0, // 商品ID
        awardPrice: 0,
        amount: 0,
        originAmount: 0,
        goodInfo: {}, // 商品基本信息
        bannerList: [], // 轮播图
        ShopRate: 0, // 购物奖励
        ShopCommission: 0, // 推广权益
        shareImg: '', // 从服务器端获取的小程序码
        currentImgFromLocal: '',
        goodBuyNum: 0, // 当前购物车当中该商品的数量
        bgImg: '',
        imagePath: '',
        currentImg: '',
        erweimaImg: '',
        canvasHidden: false,
        gbSalePlat: 0,
        cartInfo: {},
        showCart: false,
        current: 1,
        cartNum: 0,
        limtNum: 2,
        unitNum: 9.9,
        unitOrgNum: 12.6,
        count: 1,
        shopDetail: '',
        linePriceDetail: '',
        priceDetail: '',
        screenWidth: 375,
        screenHeight: 667,
        shareUrl: '',
        isShowVip: true
      }
    },
    computed: {
      bannerNum () {
        return this.bannerList.length
      }
    },
    onLoad (option) {
      console.log(option)
      // console.log('option.id:' + option.id)
      if (option.id != undefined && option.id > 0) {
        this.goodId = option.id
      }
       console.log('goodId:' + this.goodId)

       if (option.scene) {
        let scene = decodeURIComponent(option.scene)
          // &是我们定义的参数链接方式
          let param1 = scene.split('&')[0]
          let param2 = scene.split('&')[1]
          console.log(param1)
            console.log(param2)
        // 其他逻辑处理。。。。。
      }
    },
    mounted () {
      this.getGoodDetailInfo()
      this.getMyAccount()
      const that = this
      wx.getSystemInfo({
        success (system) {
            console.log('区域', system.safeArea)
            that.screenWidth = system.safeArea.width * 0.8
            that.screenHeight = system.safeArea.bottom - 220
        }
      })
    },
    onUnload () {
      this.showCart = false
      this.cartNum = 0
      this.canvasHidden = false
      this.cartInfo = {}
      this.goodInfo = {}
      this.isShow = false
      this.name = ''
      this.saleNum = 0
      this.mPrice = 0
      this.goodId = 0
      this.awardPrice = 0
      this.amount = 0
      this.originAmount = 0
      this.isShowVip = true
    },
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
      }
      return {
              title: this.name,
              path: `/pages/pIndex/goodDetail/main?id=` + this.goodId
              // imageUrl: this.baseUrl + this.imgUrls[0].gpPic
      }
    },
    methods: {

      getMyAccount: async function () {
        var result = await getMyAccount()
        this.mPartnerFlag = result.result.result.member.mPartnerFlag
        this.mVipFlag = result.result.result.member.mVipFlag
        if (this.mPartnerFlag == 1 || this.mVipFlag == 1) {
          this.isShowVip = false
        }
      },

      async doGenSharepic () {
        let jumpUrl = 'pages/pIndex/goodDetail/main'
        let params = this.goodId + '&123'
        let data = await genSharepic({page: jumpUrl, scene: params})
        this.shareUrl = this.shareUrlServer + data.result.result
        console.log(this.shareUrl, 'erweima')
      },

      async getGoodDetailInfo () { // 获取详情
        let data = await getGoodsDetail({salePlat: 1, gId: this.goodId})
        console.log('返回值', data)
        console.log('返回值', data.errCode)
        this.goodInfo = data.result.result.goods
        this.mPrice = this.goodInfo.gPrice
        this.price = this.goodInfo.gOriginalPrice
        this.name = this.goodInfo.gTitle
        this.gbSalePlat = this.goodInfo.gbSalePlat
        this.goodBuyNum = this.goodInfo.buyNum
        this.bannerList = data.result.result.photo
        console.log('bannerList:')
        console.log(this.bannerList)
        this.currentImg = this.$baseUrl + this.bannerList[0].gbpPic
        console.log('currentImg: ' + this.$baseUrl + this.currentImg)
        this.getIndustryRateData(this.goodInfo.gId, this.goodInfo.gShopId)
        this.getCartList()
      },
  
      async getIndustryRateData (getGid, getSid) { // 推广佣金及返利
          let params = {
              gId: getGid, // 商品id
              sId: getSid // 店铺id
          }
          let data = await getIndustryRate(params)
          this.ShopRate = data.result.result.ShopRate
          this.ShopCommission = data.result.result.ShopCommission
      },
      // 1.购物车列表
      async getCartList (option) {
          let params = {
              gbSalePlat: this.gbSalePlat, // 0自营 1商城
              shopId: this.goodInfo.gShopId
          }
          let result = (await shopCartList(params)).result.result.items[0]
          // this.cartInfo = result
          this.cartInfo = Object.assign({}, result)
          if (this.cartInfo.itemCount != undefined) {
              this.cartNum = this.cartInfo.itemCount
          }
          console.log('cart count: ')
          console.log(this.cartInfo.itemCount)
          if (option.show) {
              this.showCart = true
          }
          // console.log(result, '购物车列表')
      },
      // 2.添加商品
      async addGood (goodId) {
        let token = wx.getStorageSync('DIAN_TOKEN')
        if (!token) {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
        }
          let params = {
              gId: goodId,
              count: 1,
              shopId: this.goodInfo.gShopId,
              gbSalePlat: this.gbSalePlat
          }
          let result = await shopAddGood(params)
          this.getCartList()
          if (this.goodInfo.gId == goodId) { this.goodBuyNum++ }
          // console.log(result, '添加商品')
      },
      // 3.删除商品
      async delGood (goodId, count, item) {
        let token = wx.getStorageSync('DIAN_TOKEN')
        if (!token) {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
        }
          // count--
          let params = {
              gId: goodId,
              count: count,
              shopId: this.goodInfo.gShopId,
              gbSalePlat: this.gbSalePlat
          }
        let result = await shopDelGood(params)
        if (this.goodBuyNum > 0 && this.goodInfo.gId == item.goodsId) {
          this.goodBuyNum--
        }
        this.getCartList({show: true})
        // console.log(result, '删除商品')
      },

      async delOneGood (goodId) {
        let token = wx.getStorageSync('DIAN_TOKEN')
        if (!token) {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
        }
        // this.cartNum = this.cartNum - 1
        if (this.goodBuyNum == 0) { return }
        if (this.goodBuyNum > 0) {
          this.goodBuyNum--
        }
        let params = {
              gId: goodId,
              count: this.goodBuyNum,
              shopId: this.goodInfo.gShopId,
              gbSalePlat: this.gbSalePlat
        }
        let result = await shopDelGood(params)
  
        this.getCartList({show: false})
        // console.log(result, '删除商品')
      },

      // 6.清空购物车
      async clearCart () {
          let params = {
            gbSalePlat: this.gbSalePlat,
            shopId: this.goodInfo.gShopId
          }
          let result = await shopCartClear(params)
          this.goodBuyNum = 0
          console.log('clear done..')
          this.getCartList()
          this.getHotGoods()
          this.showCart = false
      },
      // 购物车添加商品
      addNum (num, item) {
        item.buyNum++
        this.addGood(item.goodsId)
      },
      // 购物车删除商品
      subNum (num, item) {
        if (item.buyNum > 0) {
          item.buyNum--
        }
  
        this.delGood(item.goodsId, item.buyNum, item)
      },
  
      // banner-num change
      bannerChange (e) {
        this.current = e.target.current + 1
      },
      // 开通vip
      openVip () {
        let token = wx.getStorageSync('DIAN_TOKEN')
        if (!token) {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
        }
        wx.navigateTo({url: '/pages/pEncyclopedia/member/joinVip/main'})
      },

      // 本商品数量加1
      addCart () {
        this.addGood(this.goodInfo.gId)
      },
      // 本商品数量减1
      subCart () {
        // this.cartNum -= 1
        this.delOneGood(this.goodInfo.gId)
      },
       // 去结算
      async goPay (option) {
        let token = wx.getStorageSync('DIAN_TOKEN')
        if (!token) {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
        }
          let result = await this.payVerify(option)
          if (result.errCode == 'USER_200') {
              console.log('gbSalePlat: ' + this.gbSalePlat)
              // 校验成功
              if (this.gbSalePlat == 0) {
                  // 自营商品订单
                  wx.navigateTo({url: `/pages/pOrder/shopOrder/main?shopId=${this.goodInfo.gShopId}&gbSalePla=${this.gbSalePlat}&ocIds=${option.ocIds}`})
              } else {
                  // 商城商品订单
                  wx.navigateTo({url: `/pages/pIndex/goodOrder/main?shopId=${this.goodInfo.gShopId}&gbSalePla=${this.gbSalePlat}&ocIds=${option.ocIds}`})
              }
          }
      },
      // 8.结算调用
      async payVerify (option) {
          let params = {
              gbSalePlat: this.gbSalePlat,
              shopId: this.goodInfo.gShopId,
              ocIds: option.ocIds
          }
          let result = await shopCartVerify(params)
          return result
      },
      // w 375 h 667
      // 将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
      createNewImg: function () {
        console.log('createNewImg begin...')
        var that = this
        var context = wx.createCanvasContext('mycanvas')
        context.fillStyle = '#FF0000'
        context.fillRect(0, 0, this.screenWidth, this.screenHeight)
        context.drawImage(this.bgImg, 0, 0, this.screenWidth, this.screenHeight)
        context.save() // 保存当前context的状态
        console.log('currentImgFromLocal : ' + this.currentImgFromLocal)
        // 绘制商品图片
        context.lineWidth = 1
        context.strokeStyle = '#787878'
        context.fillStyle = '#fff'
        let areaImgW = 200
        let areaImgH = 150
        let areaImgX = (this.screenWidth - areaImgW) / 2
        let areaImgY = 30
        let gImgW = 130
        let gImgH = 130
        let gImgX = (areaImgW - gImgW) / 2 + areaImgX
        let gImgY = (areaImgH - gImgH) / 2 + areaImgY
        context.strokeRect(areaImgX, areaImgY, areaImgW, areaImgH)
        context.fillRect(areaImgX, areaImgY, areaImgW, areaImgH)
        context.drawImage(that.currentImgFromLocal, gImgX, gImgY, gImgW, gImgH)

        // var name = ''
        // context.moveTo(0, 600)
        // 绘制标题
        context.setFillStyle('#333')
        context.setTextAlign('center')
        context.setFontSize(18)
        context.fillText(this.name, this.screenWidth / 2, areaImgH + 100)
        context.stroke()
        // 绘制价格
        context.setFillStyle('#FE6A00')
        context.setTextAlign('center')
        context.setFontSize(16)
        context.fillText(' ' + this.mPrice, this.screenWidth / 2 - 25, areaImgH + 130)
        context.stroke()
        // 会员价
        context.setFillStyle('#787878')
        context.setTextAlign('center')
        context.setFontSize(12)
        context.fillText(' ' + this.price, this.screenWidth / 2 + 25, areaImgH + 130)
        context.stroke()
  
        console.log('shareImg: ' + this.shareImg)
        let qrW = 100
        let qwH = 100
        let qrX = (this.screenWidth - qrW) / 2
        let qrY = areaImgH + 180
        // 绘制二维码
        context.drawImage(this.erweimaImg, qrX, qrY, qrW, qwH)

        context.draw()

        wx.hideLoading()

        // that.setData({
        //   maskHidden: true,
        //   isShowHaibao: false,
        // });

        // 将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              success: function (res) {
                console.log('canvasToTempFilePath')
              var tempFilePath = res.tempFilePath
              that.imagePath = tempFilePath
                this.canvasHidden = true
              },
              fail: function (res) {
                console.log(res)
            }
            })
        }, 200)
      },
      // 点击保存到相册
      baocun: function () {
        var that = this
        console.log('save done ...')
        console.log(this.imagePath)

        wx.canvasToTempFilePath({
                    canvasId: 'mycanvas',
                    success: function (res) {
                    console.log('canvasToTempFilePath')
                    var tempFilePath = res.tempFilePath
                    console.log(tempFilePath, 'tempFilePath')
                    this.imagePath = res.tempFilePath
                    this.canvasHidden = true

                        wx.saveImageToPhotosAlbum({
                          filePath: res.tempFilePath,
                          success (myres) {
                            wx.showModal({
                              content: '图片已保存到相册，赶紧晒一下吧~',
                              showCancel: false,
                              confirmText: '好的',
                              confirmColor: '#333',
                              success: function (myres) {
                                if (myres.confirm) {
                                  console.log('用户点击确定')
                                /* 该隐藏的隐藏 */
                                }
                              },
                              fail: function (myres) {
                                console.log(11111)
                              }
                            })
                          }
                        })
                    },
                    fail: function (res) {
                      console.log(res)
                  }
                  })
    },
    // 点击生成
    formSubmit: function (e) {
      var that = this
      this.maskHidden = true
      // wx.showToast({
      //     title: '生成中...',
      //     icon: 'loading',
      //     duration: 2000
      //   })
      wx.showLoading({
           title: '生成中...'
      })
      this.requestShareimg()
    },

    async requestShareimg () {
      var that = this
      this.shareImg = this.shareUrl
      console.log('request share img: ' + this.shareImg)
      wx.getImageInfo({ // 获取动态生成的二维码图片
          src: this.shareImg,
          success: res => {
            console.log('first invoke getImageInfo')
            console.log(res.path)
            this.erweimaImg = res.path
            wx.getImageInfo({ // 商品图片
              src: that.currentImg,
              success: res => {
                console.log('second invoke getImageInfo')
                console.log(res.path)
                this.currentImgFromLocal = res.path
                 wx.getImageInfo({ // 商品图片
                    src: 'https://sniu.2dian.com/xcx/static/matou/sharebg2.png',
                    success: res => {
                      console.log('third invoke getImageInfo')
                      console.log(res.path)
                      this.bgImg = res.path
                      // 开始生成分享图片
                      that.createNewImg()
                  }
                  })
            }
            })
          }
        })

      // const request = new Fly()
      // var that = this
      // request.post('https://mk.2dian.com.cn/xcx/login/getAccessToken', {
      //   id: 90
      // })
      // .then(function (res) {
      //     console.log('invoked.....')
      //     console.log(res)
  
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    },
    // 分享按钮点击事件
    share () {
        console.log('分享')
        this.isShow = true
        this.doGenSharepic()
    },
    closeModal () {
      this.isShow = false
    },
    // 生成海报 canvasHidden
    genPoster () {
        console.log('生成海报')
        this.closeModal()
        this.formSubmit()
        this.canvasHidden = true
    },
    hiddenMaskHidden () {
      this.canvasHidden = false
    }
  }
  
}
</script>
<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.buyNow{
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 45px;
  background-color: #FE6A00;
  color:#fff;
  text-align: center;
  line-height: 45px;
  font-size: 16px;

}
.popup-content {
    width: 100%;
    background: @color-white;
    .title {
        margin-top: 33rpx;
        font-size: 24rpx;
        text-align: center;
    }
    .close-img{
        position: absolute;
        right:30rpx;
        top:30rpx;
        padding:0 30rpx;
    }
    .actions {
        margin: 90rpx 110rpx 56rpx;
        .action {
            text-align: center;
            button{
                border:none;
                padding:0;
                display: inline-block;
                vertical-align: middle;
                border-color:#fff!important;
                background:#fff;
                line-height: initial;
                &::after{
                border:none !important
                }
            }
            .img {
                width: 70rpx;
                height: 70rpx;
            }
            .text {
                margin-top: 18rpx;
                font-size: 24rpx;
                color: @grey;
            }
        }
    }
    .btn {
        font-size: 28rpx;
        border-top: 1px solid @line;
        height: 90rpx;
    }
}
.orange-color{
  color:@color-orange
}
.tip{
  color:@grey
}
.mt40{
  margin-top:30rpx;
}

.add-subtract{
  width:140rpx;
  display:inline-block;
  .circle{
    display: inline-block;
    width:36rpx;
    height:36rpx;
    line-height:36rpx;
    text-align:center;
    border-radius: 50%;
    border:1rpx solid #999;
   
    &.add{
      background: #FE6A00;
      color:#fff;
      border-color:#FE6A00;
    }
    &.subtract{
      background: #fff;
      color:#999;
    }
  }
}

.poster-modal {
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.6);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10001;
  .imagePathBox{
    // background: red;
    position: absolute;
    width: 100%;
    height: 200rpx;
    left: 0;
    bottom: 0;
    z-index: 10003;
    .shengcheng{
      width: 40%;
      height: 40%;
      // position: fixed;
      // top: 50rpx;
      // left: 50%;
      // margin-left: -40%;
      // z-index: 10;
    }
    .baocun{
      display: block;
      width: 80%;
      height: 80rpx;
      padding: 0;
      line-height: 80rpx;
      text-align: center;
      position: fixed;
      bottom: 100rpx;
      left: 10%;
      background: #ffe200;
      color: #333;
      font-size: 32rpx;
      border-radius: 44rpx;
      border: solid 3rpx @color-white;
    }
    .cancelShareBtn{
      display: block;
      width: 80%;
      height: 80rpx;
      padding: 0;
      line-height: 80rpx;
      text-align: center;
      position: fixed;
      bottom: 10rpx;
      left: 10%;
      background: #ffe200;
      color: #333;
      font-size: 32rpx;
      border-radius: 44rpx;
      border: solid 3rpx @color-white;
    }
  }
  .myCanvas{
    // z-index:10002;
    // position: absolute;
		// top: 0;
    // left: 0;
    margin: 50rpx auto 0;
  }
}

button[class="baocun"]::after{
  border: 0;
}

.canvas-box
{
  margin-top: 100rpx;
}

.sharebottom
{
  position: fixed;
  left: 0;
  bottom: 0rpx;
  width: 747rpx;
  border:1px solid #efefef;
  background-color: #000000;
  z-index: 99999999999999;
}

.overlay{
  position:fixed;
  top: 0;right: 0;left: 0;bottom: 0;
  z-index: 10001;
}

.container {
  box-sizing: border-box;
  color: @primary;
  font-size:12px;
  width:100%;
  padding:0;
  text-align:left;
  background: @color-bg;
  color:@primary;
  .delect-img{
        width:24rpx;
        height:22rpx;
        vertical-align: middle;
        padding-right:10rpx;
    }
  .close-img{
        width:24rpx;
        height:24rpx;
    }
  .add-substract-wrap {
        .num{
            padding:0 26rpx;
        }
        .add,.substract{
            width:40rpx;
            height:40rpx;
            font-size:24rpx;
            text-align:center;
            border:1rpx solid @line;
            border-radius:50%;
            background:#fff;
            color:#999;
        }
        .add{
            background: @color-orange;
            border-color:@color-orange;
            color:#fff;
            // margin-left:10rpx;
        }
    }
  // 结算按钮
  .pay-button-wrap{
        box-sizing: border-box;
        position:fixed;
        z-index:10000;
        bottom:30rpx;
        padding:0 30rpx;
        height:90rpx;
        width:100%;
        .pay-button{
            box-sizing: border-box;
            padding-left:40rpx;
            height:90rpx;
            border-radius: 45rpx;
            background: #fff;
            border:1rpx solid @line;
            .cart-img-red{
                position: relative;
                .cart-img{
                    width:52rpx;
                    height:52rpx;
                    vertical-align: middle
                }
                .red-circle{
                    position: absolute;
                    top:-10rpx;
                    right:-20rpx;
                    width:40rpx;
                    line-height:30rpx;
                    height:30rpx;
                    border-radius: 50%;
                    background: #FF0000;
                    color:#fff;
                    text-align:center;
                    font-size:20rpx;
                }
                .empty-text{
                    font-size:26rpx;
                    color:@grey;
                    vertical-align: middle;
                    padding-left:30rpx;
                }
            }
            .price{
                font-size:40rpx;
                color:@color-orange;
                padding-left:30rpx;
            }
            .org-price{
                font-size:24rpx;
                color:@grey;
                padding-left:30rpx;
                // text-decoration: line-through
            }
            
            .go-pay{
                width:200rpx;
                height:90rpx;
                line-height: 90rpx;
                text-align:center;
                border-radius: 45rpx;
                color:#fff;
                font-size:30rpx;
                background: @color-orange;
                &.unactive{
                    background:#cdcdcd;
                }
            }
        } 
    }
  // 购物车面板
  .cart-wrap{
        position: fixed;
        width:100%;
        height:100%;
        top:0;
        bottom:0;
        left:0;
        right:0;
        z-index:999;
        background: rgba(0, 0, 0, 0.6);
        .cart-center{
            position: absolute;
            width:100%;
            padding-bottom:140rpx;
            bottom:0rpx;
            background:#fff;
            border-radius: 20rpx 20rpx 0 0;
            .title{
                border-radius: 20rpx 20rpx 0 0;
                width:100%;
                height:90rpx;
                line-height: 90rpx;
                background: #FCEBCC;
                text-align:center;
                color:@grey;
                font-size:24rpx;
                position: relative;  
                .close-img{
                    position: absolute;
                    right:30rpx;
                    top:30rpx;
                    padding:0 30rpx;
                    z-index: 10000;
                }
            }
            .tab-wrap{
                width:100%;
                height:90rpx;
                line-height: 90rpx;
                border-bottom:1rpx solid @line;
                .tab-item{
                    height:90rpx;
                    font-size:30rpx;
                    text-align:center;
                    flex-grow: 1;
                    color:#333;
                    position: relative;
                    .tab-bottom{
                        position: absolute;
                        bottom:0;
                        left:10%;
                        right:10%;
                        width:0;
                        height:2rpx;
                        transition:all .3s linear;
                        background: @color-orange;
                       
                    }
                    &.active{
                        color:@color-orange;
                        .tab-bottom{
                            width:80%; 
                        }
                    } 
                }   
            }
            .cart-list{
                padding:0 30rpx;
                background: #fff;
                .title{
                    font-size:24rpx;
                    color:@grey; 
                    height:70rpx;
                    line-height:70rpx; 
                    background: #fff;
                }
                .good-item-wrap{
                    max-height:600rpx;
                    overflow-y: auto;
                    .good-item{
                        border-top:1rpx solid @line;
                        padding:34rpx 0;
                        .item-img{
                            width:110rpx;
                            height:110rpx;
                            border:1rpx solid @line;
                            margin-right:20rpx;
                        }
                        .item-des{
                            flex-grow:1;
                            text-align:left;
                            .item-name{
                                font-size:28rpx;
                            }
                            .item-unit{
                                font-size:20rpx;
                                color:@grey;
                                padding:10rpx 0;
                            }
                            .item-num{
                                .item-price{
                                    color:@color-orange
                                }
                            }   
                        }
                    }
                }
            }
        } 
    }
  .section-banner{
    box-sizing: border-box;
    background:@color-white;
    height:716rpx;
    width:100%;
    border-top:1rpx solid rgba(229,229,229,1);
    border-bottom:1rpx solid rgba(229,229,229,1);
    position: relative;
    .banner-wrap{
       width:100%;
       height:714rpx;
      .banner-item{
          width:100%;
          height:714rpx;
          image{
            width:100%;
            height:714rpx;
          }
      }
    }
    .swiper-num{
      position: absolute;
      right:70rpx;
      bottom:40rpx;
      width:82rpx;
      line-height:40rpx;
      height:40rpx;
      background:rgba(0,0,0,1);
      opacity:0.2;
      color:#fff;
      border-radius: 20rpx;
      text-align:center;
    }
  }
  .section-title{
     box-sizing: border-box;
     background: @color-white;
     width:100%;
     box-sizing: border-box;
     padding:15px 15px 20px;
     .name{
       font-size:15px;
     }
     .share{
       color:@grey;
       font-size:12px;
       border-left:1rpx solid #e5e5e5;
       margin-left:30rpx;
       position: relative;
       min-width:140rpx;
       .share-img{
         width:36rpx;
         height:36rpx;
         padding-right:10rpx;
         padding-left:30rpx;
       }
       .share-button{
          position:absolute;
          top:0;
          left:0;
          background:#fff;
          width:140rpx;
          padding:0;
          margin:0;
          border:none;
          opacity: 0;
        }
     }
     .sale-num{
       font-size:12px;
       color:#999;
       padding:14px 0;
     }
     .price-img{
       width:73rpx;
       height:24rpx;
     }
     .m-price{
        font-size:16px;
        color:#FE6A00
     }
      .price{
       font-size:10px;
       color:#999;
       margin-left:10px;
     }
     .limit-num{
       font-size:11px;
       color:#FF0000;
       margin-right:10px;
     }
     .cart-button{
       display: inline-block;
       width:84px;
       line-height: 30px;
       text-align:center;
       background: #FE6A00;
       border-radius: 15px;
      color:#fff; 
     }
  }
  .section-detail{
    margin-top:6px;
    padding:15px 20px;
    background: @color-white;
    line-height: 16px;
    color:@grey;
    .name{
      font-size:14px;
      padding-bottom:15px;
      color:@primary;
    }
  }
  .section-note{
    box-sizing: border-box;
    width:100%;
    box-sizing: border-box;
    margin-top:10px;
    padding:15px 20px;
    background: @color-white;
    .tip{
      color:@grey;
      padding-left:30px;
    }
    .border-line{
      width:100%;
      margin-bottom:40rpx;
    }
    .up-button{
      line-height: 60rpx;
      background: #c79169;
      color:@color-white;
      border-radius: 30rpx;
      padding:0rpx 26rpx;
      margin:40rpx 0;
      .up-line{
        display: inline-block;
        border-left:1px solid #fff;
        padding-left:26rpx;
      }
    }
  }
  .section-introduce{
    margin-top:20rpx;
    background: @color-white;
    color:#999;
    padding-bottom:120rpx;
    width:100%;
    box-sizing: border-box;
    .img{

    }
    .border-line{
      width:260rpx;
      height:1rpx;
      background: #e5e5e5;
      vertical-align: middle
     
    }
    .item-wrap{
      padding: 0 30rpx ;
      .item{
        margin-bottom:30rpx;
        .item-name{
          color:@primary
        }
      }
    }
  }
  .section-footer{
    position:fixed;
    bottom:30rpx;
    width:100%;
    padding:0 30rpx;
    box-sizing: border-box;
    .cart-button-wrap{
      line-height: 90rpx;
      height:90rpx;
      box-sizing:border-box;
      border:1rpx solid #ccc;
      border-radius: 45rpx;
      padding-left:40rpx;
      background:rgba(255,255,255,0.9);
      .cart-img{
        width:52rpx;
        height:52rpx;
        position: relative;
        vertical-align: middle;
        image{
          width:100%;
          height:100%;
        }
        .num{
          position: absolute;
          top:-16rpx;
          right:-30rpx;
          width:40rpx;
          height:30rpx;
          line-height:30rpx;
          text-align:center;
          background: #FF0000;
          color:#fff;
          border-radius: 15rpx;
        }
      }
      .cost-wrap{
        flex-grow: 1;
        text-align:left;
          .cost{
            font-size:40rpx;
            color:@color-orange;
            padding-right:30rpx;
            padding-left:60rpx;
            vertical-align: middle;
          }
          .origin-cost{
            font-size:24rpx;
            color:#999;
            vertical-align: middle;
            // text-decoration: line-through;
          }
      }
      .go-account{
        font-size:30rpx;
        color:#fff;
        background:#ccc ;
        padding:0 57rpx;
        line-height: 90rpx;
        height:90rpx;
        border-radius: 45rpx;
        &.active{
          background: @color-orange;
        }
      }

    }
  }
}
</style>
