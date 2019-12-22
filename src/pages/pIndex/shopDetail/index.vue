<template> 
<div class="shop-detail-wrap" v-if="showTotalPage">
    <navigation-bar>
       <div class="bar-wrapper">
          <div class="action-btns">
              <div class="btn-back center" @click="goBack">
                  <img src="/static/images/arrow_down.png" alt="">
              </div>
              <div class="btn-entry center" @click="entry">
                  <img src="/static/images/entry.png" alt="">
              </div>
          </div>
          <div class="search-wrapper center-left" @click="goSearch">
            <img src="/static/images/search.png" alt="" class="search-img" @click="search">
            <!-- <input type="search" class="search-input" disabled  placeholder="店铺内搜索商品"> -->
          </div>
          <tooltip :isFollow='isFollow' :isShow="showTip" @favorite="favorite" @share="share"></tooltip>
       </div>
    </navigation-bar>
    <div class="shop-detail">
        <div class="flex" v-if="noShareFlag">
            <div style="display:flex;">
                <image class="shop-img" 
                    :src="baseUrl+ shopInfo.sPic" 
                    :data-src="baseUrl+ shopInfo.sPic"
                    @click="previewImg"></image>
                <div class="shop-name-wrap">
                    <div class="shop-name">{{shopInfo.sTitle}}</div>
                    <div class="shop-labels flex">
                        <span class="label-item"  v-for="(item,index) in shopLabels" :key="index">
                            {{item}}
                        </span>
                    </div>
                </div>
            </div>
            <image class="zhaomu-img" v-if="isParter != true" src="https://sniu.2dian.com/xcx/static/matou/boss.gif" @click="goJoin"></image>
        </div>
        <!--  -->
            <div class="flex" v-else>
                <div class="bgc">
            <image class=" heard"  :src="memberInfo.mheadurl"></image>
            <div class="shop-name-wrap">
                <div class="member-name">{{memberInfo.mnickname}}</div> 
                <div class="qyy">邀您光临</div>
                <div class="shopname">{{shopInfo.sTitle}}</div>
            </div>
            </div>
            <div>
                <div class="shop-labels flex">
                    <span class="label-item"  v-for="(item,index) in shopLabels" :key="index">
                        {{item}}
                    </span>
                    <image class="zhaomu-img" src="https://sniu.2dian.com/xcx/static/matou/boss.gif" @click="goJoin"></image>
                </div>
            </div>
        </div>
        <!--  -->
        <div class="shop-tip flex">
            <span v-if="shopInfo.sDealType == 0">自营商品￥{{shopInfo.sBasicCharge}} 起送 |  商城商品一件包邮</span>
            <span v-else>￥{{shopInfo.sBasicCharge}} 起售 |  商城商品一件包邮</span>
            <span @click="goMerchant">商家详情>></span>
        </div>
    </div>
    <div class="shop-list">
        <div class="shop-tab-switch flex">
            <div class="item" :class="{'active':activeTab === index?true:false}"  v-for="(item,index) in tabs" :key="index" @click="changeTab(index)">
                {{item}}
                 <div class="item-bottom"></div>
            </div>
        </div>
        <div class="good-list flex"> 
            <!-- 店铺自营 -->
            <template v-if="activeTab === 0" >
                <div class="mask" catchtouchmove="preventD" v-if ='shopState == 1 && hotGoods.length>0' @click="javascript()">
                    <div class="tips">已打烊</div>
                </div>
                <div class="mask2" catchtouchmove="preventD" v-if ='hotGoods.length==0' @click="javascript()">
                    <div class="tips">商品即将上架</div>
                </div>
                <div class="good-item"  v-for="(item,index) in hotGoods" :key="index+100">
                    <image class="good-img" :src="baseUrl + item.gPic" @click="goGoodDetail(item.gId)"></image>
                    <div class="good-detail">
                        <div class="good-name text-ellipsis" @click="goGoodDetail(item.gId)">{{item.gTitle}}</div>
                        <div class="good-price-wrap flex">
                            <div>
                                <image class="price-img" src="/static/images/price.png"></image> 
                                <span> <span class="good-price">¥{{item.gPrice}}</span></span>
                                <!-- <span class="good-org-price" v-if="item.gSellingPrice > 0"> ¥{{item.gSellingPrice}}</span> -->
                                <span class="good-org-price" v-if="item.gOriginalPrice > 0"> ¥{{item.gOriginalPrice}}</span>
                            </div>
                            <div class="gouwuche-img-red">
                                <image class="gouwuche-img"  src="/static/images/gouwuche_unselected.png" @click="addGood(item.gId)"></image>
                                <div class="red-circle" v-if="item.buyNum>0"></div>
                            </div>
                        </div>
                    
                </div>
                </div>
            </template>
           <template v-if="activeTab === 1">
             <!-- 店铺商城 -->
                <div class="good-item"   v-for="(item,index) in hotGoods" :key="index">
                    <image class="good-img" :src="baseUrl + item.gPic" @click="goGoodDetail(item.gId)"></image>
                    <div class="good-detail">
                        <div class="good-name text-ellipsis" @click="goGoodDetail(item.gId)">{{item.gTitle}}</div>
                        <div class="good-price-wrap flex">
                            <div>
                                <div>
                                    <image class="price-img" src="/static/images/price.png"></image> 
                                     <span class="good-price">¥{{item.gPrice}}</span>
                                </div>
                                <div class="good-org-price" style="padding:0">  ¥{{item.gOriginalPrice}}</div>
                            </div>
                            <div class="gouwuche-img-red">
                                <image class="gouwuche-img" src="/static/images/gouwuche_unselected.png" @click="addGood(item.gId)">
                                </image>
                                <div class="red-circle" v-if="item.buyNum>0"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 分类 -->
                <div class="category-wrap" v-for="(item,index) in categoryData" :key="index">
                    <div class="category-img" @click="goTypeGoodList(item.id,index)">
                        <div class="name">{{item.name}}</div>
                        <div class="all">全部>></div>
                    </div>
                    <div class="category-list flex">
                        <div class="item" @click="goGoodDetail(good.gId)"  v-for="(good,goodId) in item.goodslist" :key="goodId">
                            <image class="item-img" :src="baseUrl + good.gPic"></image>
                            <div class="item-name text-ellipsis">
                                {{good.gTitle}}
                            </div>
                            <div class="item-member-price">
                                <image src="/static/images/price.png" class="member-price-img"></image>
                                <span class="member-price"> ¥{{good.gPrice}}</span>
                            </div>
                            <div class="item-price">¥{{good.gOriginalPrice}}</div>
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
                <image class="close-img" src="/static/images/close.png" @click="shopState=showCart=false"></image>
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
            <!-- <div @click="goPay(cartInfo)" class="buyNow">立即购买</div> -->
        </div>
    </div>
    <!-- 结算按钮 -->
    <div class="pay-button-wrap" v-if="isShowCart">
        <div class="pay-button flex" v-if="cartInfo.itemCount>0">
            <div class="cart-img-red" @click="getCartList({show:true})">
                <image class="cart-img" src="/static/images/gouwuche.png" >
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

    <div class="poster-modal" v-if="canvasHidden">
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

    <popup 
      :isShow="isShowShare" 
      @closeModal="closeModalPop" 
    >
    <div class="popup-content">
        <div class="title">
            商家配送范围有限，建议分享给您附近的朋友
            <image class="close-img" src="/static/images/close.png" @click="isShowShare=false"></image>
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
        <div class="btn center" @click="closeModalPop">
            取消
        </div>
    </div>
    </popup>
</div>
</template>
<script>
import navigationBar from './navbar'
import tooltip from './tooltip'
import popup from '@/components/popup'
import {getMyAccount, shopGoodsList, shopHotGoodsList, shopAddGood, shopDelGood, shopCartList, shopCartClear, shopCartVerify, doFollowShop, addShopTrack, genSharepic} from '@/utils/api'
export default{
  components: {popup, navigationBar, tooltip},
  data () {
    return {
        shopState: 0, // 店铺状态 0-开店，1-闭店  -1 待开  -2 待开 （已认证）
        goodName: null,
        showTotalPage: false, // 是否显示整个页面，先隐藏待加载完成后再显示
        shareUrlServer: this.$sharePic,
        shopId: 0,
        isParter: false, //  是否合伙人
        baseUrl: this.$baseUrl2,
        shopInfo: {}, // 店铺信息
        shopLabels: [], // 店铺标签
        hotGoods: [], // 商品信息
        showTip: false, // 分享菜单
        showCart: false, // 购物车显示隐藏
        shopName: '',
        tabs: ['店铺自营', '店铺商城'],
        activeTab: 1, // 默认店铺商城
        payIndex: 0,
        cartList: [],
        cartInfo: {},
        categoryData: [],
        memberInfo: '',
        PartnerFlag: false,
        isShow: false, // 分享弹窗显示/隐藏
        noShareFlag: true, // 分享被打开时判断是否是合伙人分享 true是普通分享 false 是合伙人分享
        shareUrl: '',
        isShowShare: false, // 底部分享框弹出
        shareImg: '', // 从服务器端获取的小程序码
        currentImgFromLocal: '',
        bgImg: '',
        imagePath: '',
        currentImg: '',
        erweimaImg: '',
        screenWidth: 375,
        screenHeight: 667,
        canvasHidden: false,
        isFollow: 0,
        isShowCart: true // 是否显示底部结算按钮
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

  onShow () {
     this.getCartList()
  },

   onLoad (option) {
    console.log('option.id: ' + option.id)
    this.shopId = option.id
    this.getAll()
 },

  mounted () {
      // this.PartnerFlag = this.memberInfo.mPartnerFlag != 1 // 不等于等于 1 是非合伙人
    //   this.PartnerFlag = this.$root.$mp.query.mPartnerFlag
    //   console.log(this.PartnerFlag, this.memberInfo.mPartnerFlag)
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
    this.hotGoods = []
    this.activeTab = 1
    this.categoryData = []
    this.showTip = false
    this.shopState = 0
    this.isShowShare = false
    this.isShow = false
    this.isShowCart = true
    this.showTotalPage = false
    this.memberInfo = ''
    this.shopInfo = {}
    this.shopLabels = []
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    console.log(res.target)
    }
    this.isShowShare = false
    return {
            title: this.shopInfo.sTitle,
            path: `/pages/pIndex/shopDetail/main?id=` + this.shopInfo.sId,
            imageUrl: this.baseUrl + this.shopInfo.sPic
    }
  },
  methods: {
      previewImg (e) { // 点击预览图片
        var current = e.target.dataset.src
        wx.previewImage({
            current: current,
            urls: [current]
        })
      },
      javascript () { // 阻止点击穿透

      },
      goSearch () { // 跳转搜索
      console.log(1)
        wx.navigateTo({
            url: '/pages/pIndex/searchKeys/main?type=shop&shopId=' + this.shopId
        })
      },

    async doGenSharepic () {
        let jumpUrl = 'pages/pIndex/goodDetail/main'
        let params = this.goodId + '&123'
        let data = await genSharepic({page: jumpUrl, scene: params})
        this.shareUrl = this.shareUrlServer + data.result.result
        console.log(this.shareUrl, 'erweima')
    },
    getAll () {
        this.getGoodsCateGory()
        this.getHotGoods()
        this.showTotalPage = true
        this.getMemberInfo()
        this.doAddShopTrack()
    },
    search () {
        console.log('搜索')
       wx.navigateTo({
           url: `/pages/pIndex/searchKeys/main?type=shop`
       })
    },
     // 跳转商品详情
    goGoodDetail (id) {
      console.log('goodId in shopDetail:' + id)
      wx.navigateTo({
            url: `/pages/pIndex/goodDetail/main?id=${id}`
         })
    },
    // 跳转分类列表
    goTypeGoodList (typeId, index) {
        var typeName = this.categoryData[index].name
      console.log('typeId in shopDetail:' + typeId)
       console.log(this.categoryData[index].name)
      wx.navigateTo({
            url: '/pages/pIndex/typeGoodList/main?shopId=' + this.shopId + '&typeId=' + typeId + '&typeName=' + typeName
         })
    },
  async  getMemberInfo () {
       var res = await getMyAccount()
       this.memberInfo = res.result.result.member
       console.log('member', res.result.result)
       if (this.memberInfo.mPartnerFlag == 1) {
               this.isParter = true
        } else {
              this.isParter = false
        }
    },
    changeSearch (name) {
        this.goodName = name
        console.log(this.goodName, 'input goodname')
    },
    // 增加店铺浏览足迹
    async  doAddShopTrack () {
       var res = await addShopTrack({shopId: this.shopId})
       this.memberInfo = res.result.result.member
       console.log(res.result.result.member)
    },

    // 收藏
    async favorite () {
        this.isFollow = this.isFollow == 0 ? 1 : 0
       console.log('do favorite')
       let params = {
            sId: this.shopId,
            state: this.isFollow
        }
       var res = await doFollowShop(params)
       if (res) {
           if (res.errCode == 'USER_200') {
               wx.showToast({
                title: '操作成功',
                icon: 'loading',
                duration: 2000
            })
            this.showTip = false
           }
       }
    },
    // 分享按钮点击事件
    share () {
        console.log('分享')
        this.showTip = false
        this.isShowShare = true
        this.doGenSharepic()
    },
    // 关闭分享弹窗
    closeModal () {
        this.isShow = false
    },

    // 关闭底部分享弹出窗
    closeModalPop () {
        console.log('closeModalPop')
        this.isShowShare = false
    },

    // 1.商品分类（商城）
    async getGoodsCateGory () {
        let params = {
            shopId: this.shopId,
            salePlat: 1
        }
        let result = (await shopGoodsList(params)).result.result
        this.categoryData = result.listTypeSecondAndGoods
        // console.log(result, 'getGoodsList', this.categoryData)
    },
    // 2. 热销商品(0:自营1.商城)
    async getHotGoods (option) {
        this.hotGoods = []
        if (this.activeTab == 0) { // 自营热销商品
            console.log('request my hotGoods')
            let params = {
            shopId: this.shopId,
            salePlat: 0,
            pageNo: 1,
            pageSize: 300
            }
            let result = (await shopGoodsList(params)).result.result
            this.shopInfo = result.shop
            this.isFollow = result.shop.isFollow
            this.currentImg = this.$baseUrl + this.shopInfo.sPic
            this.shopLabels = result.shop.sLabel ? result.shop.sLabel.split(',') : []
            this.shopLabels = this.shopLabels.filter(item => item.length > 0)
            this.hotGoods = result.goodsList
            this.shopState = result.shop.sBusinessState // 等于一闭店 如果闭店 添加蒙板
        } else if (this.activeTab == 1) { // 商城热销商品
            console.log('request shop hotGoods')
            let params = {
            shopId: this.shopId,
            salePlat: this.activeTab,
            typeFirst: -2
            }
            let result = (await shopHotGoodsList(params)).result.result
            this.shopInfo = result.shop
            this.isFollow = result.shop.isFollow
            this.currentImg = this.$baseUrl + this.shopInfo.sPic
            this.shopLabels = result.shop.sLabel ? result.shop.sLabel.split(',') : []

            this.shopLabels = this.shopLabels.filter(item => item.length > 0)
           // console.log('shopLables length1111: ', this.shopLables.length)
            // this.shopLabels.forEach(item => {
            //   console.log('label:', item)
            //   console.log(item.length)
            //   if (item.length > 0) {
            //       return item
            //   }
            // })
            this.hotGoods = result.listTypeSecondAndGoods[0].goods
        }

        console.log(this.hotGoods, '热销商品')
        console.log(this.shopInfo, '店铺信息')
    },
    // 3.购物车列表
    async getCartList (option) {
        console.log('getCartList invoke..')
        let params = {
            gbSalePlat: this.activeTab, // 0自营 1商城
            shopId: this.shopId
        }
        let result = (await shopCartList(params)).result.result.items[0]
        console.log('result: ', result)
        if (!result) {
            console.log('begin clear status...')
            this.hotGoods.forEach(item => {
                item.buyNum = 0
            })
        }
        // this.cartInfo = result
        this.cartInfo = Object.assign({}, result)
        if (option.show) {
            this.showCart = true
        }
        console.log('this.cartInfo: ', this.cartInfo)

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
        this.hotGoods.forEach(item => {
            if (goodId == item.gId) {
                item.buyNum = item.buyNum + 1
            }
          })

        // this.getHotGoods()
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
       this.getCartList({show: true})
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
        wx.navigateTo({url: `/pages/pIndex/merchantDetail/main?shopId=${this.shopId}`})
    },
    // 招募老板/店铺合伙人
    goJoin () {
        wx.navigateTo({url: `/pages/pEncyclopedia/member/joinCopartner/main?shopId=${this.shopId}`})
    },
    // 切换商品类型tab
    changeTab (index) {
        this.activeTab = index
        this.getHotGoods({salePlat: index})
        this.getCartList()
    },
    // 切换购物车tab
    changeCartTab (index) {
        this.activeTab = index
        this.getCartList()
        this.changeTab(index)
    },
    // 去结算
    async goPay (option) {
        let result = await this.payVerify(option)
        if (result.errCode == 'USER_200') {
            console.log('activeTab: ' + this.activeTab)
            // 校验成功
            if (this.activeTab == 0) {
                // 自营商品订单
                wx.navigateTo({url: `/pages/pOrder/shopOrder/main?shopId=${this.shopId}&gbSalePla=${this.activeTab}&ocIds=${option.ocIds}`})
            } else {
                // 商城商品订单
                wx.navigateTo({url: `/pages/pIndex/goodOrder/main?shopId=${this.shopId}&gbSalePla=${this.activeTab}&ocIds=${option.ocIds}`})
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
        let areaImgY = 50
        let gImgW = 130
        let gImgH = 130
        let gImgX = (areaImgW - gImgW) / 2 + areaImgX
        let gImgY = (areaImgH - gImgH) / 2 + areaImgY
        context.strokeRect(areaImgX, areaImgY, areaImgW, areaImgH)
        context.fillRect(areaImgX, areaImgY, areaImgW, areaImgH)
        context.drawImage(that.currentImgFromLocal, gImgX, gImgY, gImgW, gImgH)

        // context.strokeRect(38, 20, 300, 250)
        // context.fillRect(38, 20, 300, 250)
        // context.drawImage(that.currentImgFromLocal, 88, 45, 200, 200)

        // var name = ''
        // context.moveTo(0, 600)
        // 绘制标题
        context.setFillStyle('#333')
        context.setTextAlign('center')
        context.setFontSize(18)
        context.fillText(this.shopInfo.sTitle, this.screenWidth / 2, areaImgH + 100)
        context.stroke()
        // 绘制价格
        // context.setFillStyle('#FE6A00')
        // context.setTextAlign('center')
        // context.setFontSize(16)
        // context.fillText(' ' + this.mPrice, this.screenWidth / 2 - 25, areaImgH + 130)
        // context.stroke()
        // // 会员价
        // context.setFillStyle('#787878')
        // context.setTextAlign('center')
        // context.setFontSize(12)
        // context.fillText(' ' + this.price, this.screenWidth / 2 + 25, areaImgH + 130)
        // context.stroke()

        console.log('shareImg: ' + this.shareImg)
        let qrW = 100
        let qwH = 100
        let qrX = (this.screenWidth - qrW) / 2
        let qrY = areaImgH + 150
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
              console.log(tempFilePath, 'tempFilePath')
              this.imagePath = res.tempFilePath
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
        // this.isShowCart = true

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
      // this.shareImg = 'https://mk.2dian.com.cn/xcx/static/img/shop/201912/20191208105517156228.png'
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

    // 生成海报 canvasHidden
    genPoster () {
        console.log('生成海报')
        this.closeModal()
        this.closeModalPop()
        this.formSubmit()
        this.canvasHidden = true
        this.isShowShare = false
        this.isShowCart = false
    },
    hiddenMaskHidden () {
      this.canvasHidden = false
      this.isShowCart = true
    }

  }
}
</script>  
<style lang="less" scoped>
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
            margin: 180rpx auto 0;
        }
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
.zhaomu-img{
    width:110rpx;
    height:250rpx;
    }
.heard{
    width: 75px;
    height: 75px;
    border-radius: 50%;
}
.qyy{
    color: #999;
    font-size: 15px;
}
.shopname{
    color: #FE6A00;
    font-size: 15px;
}
.bgc{
    width:550rpx;
height:150rpx;
background:rgba(255,255,255,0.6);
border-radius:75rpx;
display: flex;
flex-direction: row;
justify-content: space-between;
}
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
.shop-detail-wrap{
    background:@color-bg;
    padding-bottom:160rpx;
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
    .category-img{
        width:100%;
        height:200rpx;
        text-align:center;
        color:#fff;
        background-image:url(https://sniu.2dian.com/xcx/static/matou/typebg.png);
        background-size:100% 100%;
        position: relative;
        .name{
            font-size:50rpx;
            line-height: 200rpx;
        }
        .all{
            position: absolute;
            right:30rpx;
            bottom:30rpx;
            font-size:28rpx;
        }
    }
    .shop-detail{
        background: linear-gradient(90deg,rgba(188,189,210,1),rgba(219,217,228,1));
        padding: 0rpx 30rpx 32rpx 30rpx;
        color:#fff;
        box-sizing: border-box;
        .shop-img{
            width:182rpx;
            height:182rpx;
            border-radius: 9px;
        }
        .shop-name-wrap{
            flex-grow: 1;
            padding-left:30rpx;
            padding-top: 20rpx;
            max-width: 370rpx;
            .shop-name{
                font-size:32rpx;
            } 
            .shop-labels{
                margin-top: 12px;
                width: 180px;
                // justify-content: space-between;
                // justify-content: space-around;
                justify-content: flex-start;
                .label-item{
                    padding:2rpx 4rpx;
                    font-size:22rpx;
                    border:1rpx solid #fff;
                    margin-right:10rpx;
                }
                .zhaomu-img{
                    width:110rpx;
                    height:250rpx;
                }
            }
        }
        .shop-tip{
            font-size:24rpx;
            // padding-top:26rpx;
        }
        .member-name{
            font-size:20px;
            font-family:PingFang SC;
            font-weight:500;    
            color:rgba(254,106,0,1);
        }
    }
    .shop-list{
        width:100%;
        box-sizing: border-box;
        .shop-tab-switch{
            width:100%;
            padding:30rpx;
            font-size:30rpx;
            background: #fff;
            color:#333;
            box-sizing: border-box;
            .item{
                flex-grow: 1;
                text-align:center;
                position: relative;
                &:first-of-type{
                    border-right:1rpx solid @line
                }
                &.active{
                    color:@color-orange;
                    .item-bottom{
                        width:30%;
                    }
                }
                .item-bottom{
                    position:absolute;
                    bottom:-30rpx;
                    left:0;
                    right:0;
                    width:0;
                    height:2rpx;
                    background: @color-orange;
                    margin:0 auto;
                    transition:all .3s ease;
                }
            }
            .item-left{
                border-right:1rpx solid @line
            }

        }
        .good-list{
            margin-top:18rpx;
            padding:0 30rpx;
            flex-wrap: wrap;
            box-sizing: border-box;
            width:100%;
            .good-item{
                box-sizing: border-box;
                background: #fff;
                width:334rpx;
                border:2rpx solid @line;
                margin-bottom:20rpx;
                border-radius: 10rpx;
                .good-img{
                    width:100%;
                    height:334rpx;
                }
                .good-detail{
                    box-sizing: border-box;
                    padding:20rpx;
                    .good-name{
                        font-size:26rpx;
                        height:100rpx;
                        padding-bottom:20rpx;
                        overflow: hidden;
                    }
                    .good-price-wrap{
                        box-sizing: border-box;
                        padding-top:30rpx;
                        font-size:26rpx;
                        color:@color-orange;
                        text-align:left;
                        .price-img{
                            width:72rpx;
                            height:24rpx;
                        }
                        .good-price{
                            font-size:36rpx; 
                        }
                        .good-org-price{
                        //    text-decoration: line-through;
                           padding-left:10rpx;
                           color:@grey;
                        }
                        .gouwuche-img{
                            width:52rpx;
                            height:52rpx;
                        }
                        .gouwuche-img-red{
                            position: relative;
                            .red-circle{
                                position: absolute;
                                top:4rpx;
                                right:0;
                                display: inline-block;
                                width:18rpx;
                                height:18rpx;
                                background: red;
                                border-radius: 50%;  
                            }
                        }
                    }  
                }
            }
        }
    }
        .mask2{ //商品未上架
        position: fixed;
        top: 42%;
        left: 0;
        width: 100%;
        height: 48vh;

        opacity: 0.7;
        background-color: #fff;
        background-image: url(http://sniu.2dian.com/xcx/static/matou/tocoming.png);
        background-position: 50% 10%;
        background-size: 298rpx 298rpx;
        background-repeat: no-repeat;
        z-index: 9009009;
        .tips{
            text-align: center;
            line-height: 45rpx;
            font-size: 14px;
            width: 200rpx;
            height: 45rpx;
            position: absolute;
           bottom: 40%;
            right: 36%;

        }
    }
    .mask{ //闭店
        position: fixed;
        top: 42%;
        left: 0;
        width: 100%;
        height: 100vh;
        opacity: 0.7;
        background-color: #ccc;
        background-image: url(https://sniu.2dian.com/xcx/static/matou/dayang.png);
        background-position: 50% 10%;
        background-size: 298rpx 298rpx;
        background-repeat: no-repeat;
        z-index: 900;
        .tips{
            text-align: center;
            line-height: 45rpx;
            font-size: 14px;
            width: 200rpx;
            height: 45rpx;
            position: absolute;
           bottom: 65%;
            right: 36%;

        }
    }
    // 分类
    .category-wrap{
        margin-top:30rpx;
        width:100%;
        .category-list{
            width:100%;
            justify-content: flex-start;
            overflow-x: auto;
            .item{
                width:220rpx;
                border-radius: 10rpx;
                margin-top:14rpx;
                font-size:24rpx;
                border:1rpx solid @line;
                margin-right:10rpx;
                background: #fff;
                .item-img{
                    width:220rpx;
                    height:220rpx;
                }
                .item-name{
                    padding:10rpx 20rpx;
                    padding-bottom:0;
                    font-size:24rpx;
                }
                .item-member-price{
                    padding-top:6rpx;
                    padding-left:20rpx;
                    font-size:26rpx;
                    color:@color-orange;
                    .member-price-img{
                        width:60rpx;
                        height:18rpx;
                        padding-right:10rpx;
                    } 
                }
                .item-price{
                    padding:0rpx 20rpx 10rpx 20rpx;
                    font-size:24rpx;
                    color:@grey;
                }  
            }
        }
    }
    // 结算按钮
    .pay-button-wrap{
        box-sizing: border-box;
        position:fixed!important;
        z-index:999999999;
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
        z-index:19009010;
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
}
</style>