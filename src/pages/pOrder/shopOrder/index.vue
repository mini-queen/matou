<template>
  <div class="shop-order">
     <div class="shop-top">
       <div class="section">
        <div class="shop-tabs">
          <div class="tab-item" :class="{active: tabName=='delivery'}" @click="switchTab('delivery')">商家配送</div>
          <div class="tab-item" :class="{active: tabName=='pickup'}" @click="switchTab('pickup')">到店自提</div>
        </div>
        <div class="shop-address" v-if="tabName=='delivery'">
          <div class="addr-top space-between" @click="selectAddr">
            <div class="address">
              {{ detailAddressInfo }}          
            </div>
            <img src="/static/images/arrow.png" class="more-icon" >
          </div>
          <div class="addr-bottom">
            <span class="user-name">{{currentAddress.maName}}</span>
            <span class="tel">{{currentAddress.maPhone}}</span>
          </div>
          <!-- <div class="addr-delivery center-left">
            3km内预计半小时送达
          </div> -->
        </div>
        <div class="shop-pickup" v-else>
          <div class="address">
             {{shop.sAddressDetail}}
          </div>
          <div class="map">
            <map
              id="map"
              style="width: 100%; height: 100%;"
              :latitude="latitude"
              :longitude="longitude"
              :markers="markers"
              :show-location="true"
              :show-compass="true"
            ></map>
          </div>
          <div class="pick-item space-between" v-if="false">
            <div class="tip">自提时间</div>
            <div class="text">工作日9:00-22:00支持自提</div>
          </div>
          <div class="pick-item space-between">
            <div class="tip">联系方式</div>
            <div class="text" @click="callPhone(shop.sMobile)">
              {{shop.sMobile}}  
              <img src="/static/images/arrow.png" class="more-icon">
            </div>
          </div>
          <div class="addr-delivery center-left">
            <!-- <com-checkbox  :value="agree"  @changeHandle="agree = !agree">
              <span class="agree-text">阅读同意并接受</span>
            </com-checkbox>
            <span class="text">《到店自提服务协议》</span>                 -->
          </div>
        </div>
       </div>
        <div class="section order-shipment" v-for="(item,index) in dataList" :key="index">
          <div class="shop-name">{{item.shopTitle}}</div>
          <div class="goods-list">
            <div class="goods-items" :class="{hide: showMore}">
              <div class="goods-item space-between" v-for="(goodItem,goodIndex) in item.list" :key="goodIndex">
                <div class="goods-left">
                  <img :src="baseUrl + goodItem.gbPic" alt="" class="goods-img">
                  <div class="goods-info">
                    <div class="goods-name">{{goodItem.gbShortName}}</div>
                    <div class="goods-num">×{{goodItem.buyNum}}</div>
                  </div>
                </div>
                <div class="goods-right">
                  <div class="original-price"> ¥{{goodItem.gPrice}}</div>
                  <div class="discount"> ¥{{goodItem.gOriginalPrice}}</div>
                </div>
              </div>
            </div>
            <div class="goods-actions"  @click="showMoreAction(true,0)" v-if="!showMore">
                <span class="tip">点击收起</span>
                <image class="arrow-up" src="/static/images/arrow_down.png"></image>
            </div>
            <div class="goods-actions" @click="showMoreAction(false,3)" v-else>
                <span class="tip">点击展开</span>
                <image class="arrow-down" src="/static/images/arrow_down.png"></image>
            </div>
          </div>
          <div class="order-info">
            <div class="fee-wrap">
              <div class="pick-fee space-between">
                <div class="tip">包装费</div>
                <div class="price"> ¥{{storeFreightPrice}}</div>
              </div>
              <div class="delivery-fee space-between" v-if="tabName == 'delivery'">
                <div class="tip">
                  配送费
                  <span class="desp">（根据实际距离自动计算运费）</span>
                </div>
                <div class="price"> ¥{{freightPrice}}</div>
              </div>
            </div>
            <div class="discount-wrap space-between" v-if="false">
              <div class="discount-left">
                <img src="/static/images/sub-price.png" alt="">
                <span class="text">满减优惠</span>
              </div>
              <div class="price">
                -  8
              </div>
            </div>
            <div class="total-wrap">
              <div class="flex">
                <div class="total-left" v-if="false">
                  <span class="tip">已优惠 </span>
                  <span class="price"> 8元</span>
                </div>
                <div class="total-right center-left">
                  <span class="tip">小计</span>
                  <span class="price"> ¥{{itemTotalGprice}}</span>
                </div>
              </div>
              <div v-if="noVipFlag" @click="goVip" class="order-discount space-between">
                <div class="desp">开通VIP会员/合伙人，享受商品会员价</div>
                <div class="discount-price"> -¥{{priceDifferences}}  >></div>
              </div>
            </div>
          </div>
        </div>
     </div>
     <div class="shop-bottom">
       <div class="item space-between">
         <div @click="gotoRemark" class="tip" style="overflow:hidden">备注: {{remark}}</div>
         <img src="/static/images/arrow.png" @click="gotoRemark" class="more-icon">
       </div>
       <div class="item space-between">
         <div class="tip">如遇缺货</div>
         <div class="text">缺货时电话与我沟通</div>
       </div>
       <div class="item space-between">
         <div class="tip">支付方式</div>
         <div class="text">在线支付</div>
       </div>
     </div>
    <div class="pay-wrap" >
      <div class="pay-button flex">
          <span class="favor" v-if="false">已优惠  8元 </span>
          <div class="color-orange center-left">合计<span class="amount"> ¥{{itemTotalGprice}}</span></div>
          <span class="go-pay" @click="doGenerateOrder">提交订单</span>
      </div>
    </div>
    <!-- 底部弹出组件 -->
   
    <div class="cu-modal bottom-modal" :class="{show: isShow}">
      <div class="cu-dialog"> 
      <div class="popover-content">
        <div class="popover-top flex">
          <span class="cancel" @click="cancelAddr">取消</span>
          <span class="title">选择收货地址</span>
          <span></span>
        </div>
        <div class="addr-items">
          <div class="address-item flex" @click="checkAddr(index)" v-for="(item,index) in nearAddress" :key="index">
             <div class="item-left center-left">
              <com-checkbox  :value="item.checked"  @changeHandle="checkAddr(index)"></com-checkbox>
              <div class="addr-content">
                <div class="address">{{item.pName + item.cName + item.aName + item.ccName + item.maDetail }}</div>
                <div class="addr-content_bottom">
                  <span class="user-name">{{item.maName}}</span>
                  <span class="tel">{{item.maPhone}}</span>
                  <!-- <div class="label center">公司</div> -->
                </div>
              </div>
            </div>
            <img src="/static/images/bianji-3.png" alt="" class="edit" @click="editAddr(item.maId)">
          </div>
        </div>
        <div class="addr-extra center-left">
          超配送范围地址
        </div>
        <div class="addr-items extra">
          <div class="address-item flex" v-for="(item,index) in farAddress" :key="index">
            <div class="item-left center-left">
              <div class="addr-content">
                <div class="address">{{item.pName + item.cName + item.aName + item.ccName + item.maDetail }}</div>
                <div class="addr-content_bottom">
                  <span class="user-name">{{item.maName}}</span>
                  <span class="tel">{{item.maPhone}}</span>
                </div>
              </div>
            </div>
            <img src="/static/images/bianji-3.png" alt="" class="edit" @click="editAddr(item.maId)">
          </div>
        </div>
        <div class="addr-actions center">
          <img src="/static/images/addr-add.png" alt="">
          <span class="tip" @click="addNewAddress(0)">新增收货地址</span>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
// 引入SDK核心类
import comCheckbox from '@/components/checkbox'
import popup from '@/components/popup'
import {checkGetOrderInfo, generateOrder, getOrderInfo, getMyAccount} from '@/utils/api'
var QQMapWX = require('../../../../lib/qqmap-wx-jssdk.min.js')
export default {
  data () {
    return {
      baseUrl: this.$baseUrl,
      // 参数
        shopId: null,
        gbSalePlat: null,
        ocIds: null,
        maId: null,
        deliveryType: null,
      //
      dataList: [], // 数据 数组
      shopTitle: '', // 店铺标题
      itemGOriginalPrice: 0, // 原价
      itemTotalGprice: 0, // 小计
      storeFreightPrice: 0, // 包装费
      freightPrice: 0, // 配送费
      priceDifferences: 0, // 享受会员价
      remark: '', // 备注
      nearAddress: [], // 近距离
      farAddress: [], // 远距离
      currentAddress: {}, // 当前的选择地址
      detailAddressInfo: '请选择地址', // 当前详情的地址
      addressID: 0, // 当前地址id
      orderId: '', // 订单ID
      shop: {}, // 商户信息
      myPhone: '', // 当前人手机号
      isShow: false, // 地址弹层
      // agree: false,
      tabName: 'delivery', // 展示配送信息
      showMore: false, // 收起展开
      // items: 3,
      latitude: 40.01453,
      longitude: 116.352449,
      // shopDetailAddress: '',
      noVipFlag: false, // 会员标识
      markers: [ // 超市信息
      //   {
      //   id: 1,
      //   latitude: 40.01453,
      //   longitude: 116.352449,
      //   width: 15,
      //   height: 21,
      //   name: '今日头条',
      //   iconPath: '/static/images/map-marker.png',
      //   callout: {
      //     content: '',
      //     color: '#999',
      //     fontSize: '14',
      //     borderColor: '#cecece',
      //     borderRadius: 24,
      //     borderWidth: '1',
      //     display: 'ALWAYS',
      //     bgColor: '#ffffff',
      //     padding: 10
      //   }
      // }
      ]
    }
  },
  computed: {

  },
  components: {
    comCheckbox, popup
  },
 async mounted () {
    this.qqmapsdk = new QQMapWX({
      key: 'SDKBZ-66T34-UZPUY-DDPCH-GO6DK-AYFKQ'
    })
    wx.setStorage({
      key: 'remark',
      data: ''
    })
  },
  onLoad (option) {
    this.shopId = option.shopId
    this.gbSalePlat = option.gbSalePla
    this.ocIds = option.ocIds
  },
  onShow () {
    this.doGetOrderInfo()
    this.getMyAccountInfo()
    // console.log('onShow', this)
    // this.remark = wx.getStorage('remark')
    // console.log('remark: ' + this.remark)
        var _this = this
    wx.getStorage({
  key: 'remark',
  success (res) {
      _this.remark = res.data
    console.log(res.data, _this.remark)
  }
})
  },
  onUnload () {
    this.myPhone = ''
  },
  methods: {
    async getMyAccountInfo () {
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (token) {
        var res = await getMyAccount()
        var mVipFlag = res.result.result.member.mVipFlag
        var mPartnerFlag = res.result.result.member.mPartnerFlag
        this.noVipFlag = mVipFlag + mPartnerFlag == 0
        this.myPhone = res.result.result.member.mphone
      }
    },
    goVip () {
      wx.navigateTo({
        url: '/pages/pEncyclopedia/member/joinVip/main'
      })
    },
    callPhone (myPhone) {
            wx.makePhoneCall({
                phoneNumber: myPhone
             })
        },
    switchTab (name) {
      this.tabName = name
    },
    showMoreAction (status, items) {
      this.showMore = status
      // this.items = items
    },
    closeModal () {
      this.isShow = false
    },
    selectAddr () {
      this.isShow = true
    },
    cancelAddr () {
      this.closeModal()
    },
    checkAddr (index) { // 地址列表选则
      console.log(index)
      this.currentAddress = this.nearAddress[index]
      this.closeModal()
      this.addressID = this.currentAddress.maId
      this.detailAddressInfo = this.currentAddress.pName + this.currentAddress.cName + this.currentAddress.aName + this.currentAddress.ccName + this.currentAddress.maDetail
    },
    editAddr (maid) { // 编辑地址
    console.log(maid, 'maid')
      wx.navigateTo({url: `/pages/pMe/addAddress/main?maId=${maid}`})
    },

    addNewAddress (maid) {
      console.log('addNewAddress...')
      wx.navigateTo({url: `/pages/pMe/addAddress/main?flag=add&maId=0`})
    },
// 写备注
    gotoRemark () {
        wx.navigateTo({url: `/pages/pOrder/orderRemark/main`})
    },
     // 获取结算前的订单信息
    async doGetOrderInfo () {
        let params = {
            gbSalePlat: this.gbSalePlat, // 0自营 1商城
            shopId: this.shopId,
            ocIds: this.ocIds,
            maId: '',
            deliveryType: 10
        }
        console.log('checkGetOrderInfo params: ')
        console.log(params)
        let data = await checkGetOrderInfo(params)
        if (data) {
          this.dataList = data.result.result.items
          this.shopTitle = data.result.result.items[0].shopTitle
          this.itemGOriginalPrice = data.result.result.totalGOriginalPrice
          this.itemTotalGprice = data.result.result.totalGPrice
          this.storeFreightPrice = data.result.result.storeFreightPrice
          this.freightPrice = data.result.result.freightPrice
          this.priceDifferences = data.result.result.priceDifferences
          console.log(data)
          console.log(data.result.result.memberAddressList.nearItems)
          this.nearAddress = data.result.result.memberAddressList.nearItems
          this.farAddress = data.result.result.memberAddressList.farItems
          this.shop = data.result.result.shop
          this.latitude = data.result.result.shop.sLat
          this.longitude = data.result.result.shop.sLon
          console.log('nearAddress:')
          console.log(this.nearAddress)
        }
        console.log(data)
    },

    // 开始提交订单
    async doGenerateOrder () {
      if (!this.myPhone) { // 如果没有绑定手机号跳转到绑定手机号页面
            wx.navigateTo({
                url: '/pages/pMe/bindPhone/main'
            })
            return
        }

        if (this.addressID == 0 && this.tabName == 'delivery') {
          wx.showToast({
            title: '地址不能为空', // 提示的内容,
            icon: 'none', // 图标,
            duration: 2000, // 延迟时间,
            mask: true, // 显示透明蒙层，防止触摸穿透,
            success: res => {}
          })
          return
        }
        let deliveryTypeSelected
        if (this.tabName == 'delivery') {
            deliveryTypeSelected = 20
        } else if (this.tabName == 'pickup') {
            deliveryTypeSelected = 10
        }
        let params = {
            gbSalePlat: this.gbSalePlat, // 0自营 1商城
            shopId: this.shopId,
            ocIds: this.ocIds,
            maId: this.addressID,
            deliveryType: deliveryTypeSelected,
            cusMemo: this.remark
        }
        console.log('generateOrder params: ')
        console.log(params)
        let data = await generateOrder(params)
        console.log(data)

         if (data.result.errCode != 'USER_200') {
            wx.showToast({
              title: data.result.errMsg, // 提示的内容,
              icon: 'none', // 图标,
              duration: 2000, // 延迟时间,
              mask: true, // 显示透明蒙层，防止触摸穿透,
              success: res => {}
            })
            return
        }

        if (data) {
           // 跳转到支付页面
           this.orderId = data.result.result.osOrderId
           console.log('orderId: ' + this.orderId)
           wx.navigateTo({url: `/pages/pIndex/goodPay/main?orderId=${this.orderId}&shopName=${this.shopTitle}`})
        }
    }

  }
}
</script>
<style lang="less" scoped>


.cu-modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1110;
	opacity: 0;
	outline: 0;
	// text-align: center;
	-ms-transform: scale(1.185);
	transform: scale(1.185);
	backface-visibility: hidden;
	perspective: 2000rpx;
	background: rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease-in-out 0s;
	pointer-events: none;
}

.cu-modal::before {
	content: "\200B";
	display: inline-block;
	height: 100%;
	vertical-align: middle;
}

.cu-modal.show {
	opacity: 1;
	transition-duration: 0.3s;
	-ms-transform: scale(1);
	transform: scale(1);
	overflow-x: hidden;
	overflow-y: auto;
	pointer-events: auto;
}

.cu-dialog {
	position: relative;
	display: inline-block;
	vertical-align: middle;
	margin-left: auto;
	margin-right: auto;
	width: 680rpx;
	max-width: 100%;
	background-color: #f8f8f8;
	border-radius: 10rpx;
	overflow: hidden;
}

.cu-modal.bottom-modal::before {
	vertical-align: bottom;
}

.cu-modal.bottom-modal .cu-dialog {
	width: 100%;
	border-radius: 0;
}

.cu-modal.bottom-modal {
	margin-bottom: -1000rpx;
}

.cu-modal.bottom-modal.show {
	margin-bottom: 0;
}

.cu-modal.drawer-modal {
	transform: scale(1);
	display: flex;
}

.cu-modal.drawer-modal .cu-dialog {
	height: 100%;
	min-width: 200rpx;
	border-radius: 0;
	margin: initial;
	transition-duration: 0.3s;
}

.cu-modal.drawer-modal.justify-start .cu-dialog {
	transform: translateX(-100%);
}

.cu-modal.drawer-modal.justify-end .cu-dialog {
	transform: translateX(100%);
}

.cu-modal.drawer-modal.show .cu-dialog {
	transform: translateX(0%);
}
.cu-modal .cu-dialog>.cu-bar:first-child .action{
  min-width: 100rpx;
  margin-right: 0;
  min-height: 100rpx;
}


.popover-content {
  background: @color-white;
  .popover-top {
    height: 114rpx;
    border-bottom: 1px solid @line;
    padding: 0 30rpx;
    .cancel {
      font-size: 30rpx;
      color: @grey;
    }
    .title {
      font-size: 36rpx;
    }
  }
  .addr-items {
    .address-item {
      padding: 40rpx 30rpx;
      border-bottom: 1px solid @line;
      &:last-of-type {
        border-bottom: none;
      }
      .item-left {
        .addr-content {
          width: 490rpx;
          margin-left: 20rpx;
          .address {
            font-size: 30rpx;
          }
          .addr-content_bottom {
            margin-top: 20rpx;
            display: flex;
            align-items: center;
            .user-name {
              font-size: 26rpx;
              color: @grey;
              margin-right: 30rpx;
            }
            .tel {
              font-size: 26rpx;
              color: @grey;
            }
            .label {
              margin-left: 20rpx;
              width: 60rpx;
              height: 30rpx;
              background-color: @label_cyan;
              font-size: 24rpx;
              color: @label_font;
            }
          }
        }
      }
      .edit {
        width: 36rpx;
        height: 36rpx;
      }
    }
    &.extra {
      .address-item {
        border-bottom: 1px solid @line;
        .item-left {
          .addr-content {
            margin-left: 0rpx;
            .address {
              color: @disabled;
            }
            .addr-content_bottom {
              .user-name,.tel {
                color: @disabled;
              }
            }
          }
        }
      }
    }
  }
  .addr-extra {
    height: 60rpx;
    font-size: 28rpx;
    color: @disabled;
    padding-left: 30rpx;
    background: @color-bg;
  }
  .addr-actions {
    height: 140rpx;
    img {
      width: 40rpx;
      height: 40rpx;
    }
    .tip {
      margin-left: 18rpx;
      font-size: 36rpx;
      color: @color-orange;
    }
  }
}
.shop-order {
  color: @primary;
  background-color: @color-bg;
  padding-bottom: 180rpx;
  .shop-top {
    background-image: linear-gradient(@color-orange, @color-bg);
    .section {
      background-color: @color-white;
      border-radius: 10rpx;
      margin: 0 30rpx 20rpx;
      .shop-tabs {
        padding: 30rpx 0;
        border-bottom: 1px solid @line;
        .tab-item {
          font-size: 30rpx;
          font-weight: 400;
          width: 50%;
          border-right: solid 1px @line;
          box-sizing: border-box;
          display: inline-block;
          text-align: center;
          &:last-of-type {
            border-right: none;
          }
          &.active {
            color: @color-orange;
            font-weight: 500;
          }
        }
      }
      .shop-address {
        padding: 40rpx 20rpx 0;
        .addr-top {
          .address {
            width: 580rpx;
            font-size: 34rpx;
          }
          .more-icon {
            width: 11rpx;
            height: 20rpx;
            padding-top: 14rpx;
            padding-left: 20rpx;
          }
        }
        .addr-bottom {
          margin: 30rpx 0;
          font-size: 28rpx;
          color: @grey;
          .user-name {
            margin-right: 60rpx;
          }
          .tel {
            
          }
        }
        .addr-delivery {
          height: 88rpx;
          border-top: solid 1px @line;
          font-size: 26rpx;
          color: @grey;
        }
      }
      .shop-pickup {
        padding: 40rpx 20rpx 0;
        .address {
          font-size: 34rpx;
        }
        .map {
          width: 100%;
          height: 300rpx;
          margin-top: 40rpx;
        }
        .pick-item {
          margin: 36rpx 0;
          .tip {
            font-size: 28rpx;
            color: @grey;
          }
          .text {
            font-size: 28rpx;
            color: @grey;
            .more-icon {
              width: 11rpx;
              height: 20rpx;
              padding-left: 20rpx;
            }
          }
        }
        .addr-delivery {
          height: 88rpx;
          border-top: solid 1px @line;
          font-size: 26rpx;
          color: @grey;
          /deep/
          .checkbox-wrapper {
            .checkbox-input {
              .checkbox-inner {
                border-radius: 6rpx;
              }
            }
          }
          .agree-text {
            margin-left: 20rpx;
          }
          .text {
            color: @color-orange;
            padding-bottom: 8rpx;
          }
        }
      }
    }
    .order-shipment {
      padding: 50rpx 20rpx 0;
      .shop-name {
        font-size: 32rpx;
        font-weight: 500;
        padding-bottom: 20rpx;
        border-bottom: solid 1px @line;
      }
      .goods-list {
        padding-bottom: 40rpx;
        border-bottom: solid 1px @line;
        .goods-items {
          max-height: 1000rpx;
          overflow: hidden;
          transition: .3s max-height linear;
          &.hide {
            max-height: 150rpx;
          }
        }
        .goods-item {
          align-items: center;
          margin-top: 40rpx;
          .goods-left {
            display: flex;
            .goods-img {
              width: 90rpx;
              height: 90rpx;
              border: solid 1px @line;
            }
            .goods-info {
              margin-left: 26rpx;
              .goods-name {
                font-size: 28rpx;
              }
              .goods-num {
                margin-top: 22rpx;
                font-size: 28rpx;
                color: @grey;
              }
            }
          }
          .goods-right {
            .original-price {
              font-size: 30rpx;

            }
            .discount {
              margin-top: 22rpx;
              font-size: 26rpx;
              color: @grey;
              // text-decoration: line-through;
            }
          }
        }
        .goods-actions {
          margin-top: 50rpx;
          text-align: center;
          .tip {
            font-size: 28rpx;
            color: @grey;
            margin-right: 20rpx;
          }
          .arrow-up {
            vertical-align: middle;
            width:20rpx;
            height:11rpx;
            transform:rotate(180deg);
          }
          .arrow-down {
            vertical-align: middle;
            width:20rpx;
            height:11rpx;
          }
        }
      }
      .order-info {
        .fee-wrap {
          padding: 40rpx 0;
          border-bottom: solid 1px @line;
          .pick-fee {
            margin-bottom: 50rpx;
            .tip {
              font-size: 28rpx;
            }
            .price {
              font-size: 30rpx;
            }
          }
          .delivery-fee {
            .tip {
              font-size: 28rpx;
              .desp {
                color: @grey;
              }
            }
            .price {
              font-size: 30rpx;
            }
          }
        }   
      }
      .discount-wrap {
        height: 114rpx;
        align-items: center;
        border-bottom: solid 1px @line;
        .discount-left {
          img {
            width: 34rpx;
            height: 34rpx;
            vertical-align: middle;
          }
          .text {
            font-size: 28rpx;
            margin-left: 20rpx;
          }
        }
        .price {
          font-size: 30rpx;
          color: @color-orange;
        }
      }
      .total-wrap {
        // height: 114rpx;
        padding: 44rpx 0;
        .order-discount {
          margin-top: 20rpx;
          height: 60rpx;
          border-radius: 30rpx;
          background: @color-brown;
          display: flex;
          align-items: center;
          padding-left: 38rpx;
          padding-right: 20rpx;
          color: @color-white;
          .desp {
            font-size: 24rpx;
          }
          .discount-price {
            font-size: 24rpx;
          }
        }
        .total-left {
          font-size: 28rpx;
          .tip {
            color: @grey;
            margin-right: 10rpx;
          }
          .price {
            color: @color-orange;
          }
        }
        .total-right {
          .tip {
            font-size: 28rpx;
            color: @grey;
          }
          .price {
            margin-left: 26rpx;
            font-size: 40rpx;
          }
        }
      }
    }
  }
  .shop-bottom {
      background-color: @color-white;
      border-radius: 10rpx;
      margin: 20rpx 30rpx 0;
      padding: 0 20rpx;
      .item {
        height: 106rpx;
        align-items: center;
        border-bottom: 1px solid @line;
        &:last-of-type {
          border-bottom: none;
        }
        .tip {
          font-size: 28rpx;
          color: @grey;
        }
        .more-icon {
          width: 11rpx;
          height: 20rpx;
          padding-top: 14rpx;
          padding-left: 20rpx;
        }
        .text {
          font-size: 28rpx;
          color: @grey;
        }
      }
  }
  .pay-wrap{
    box-sizing: border-box;
     position: fixed;
     z-index:999;
     bottom:30rpx;
     right:30rpx;
     left:30rpx;
     height:90rpx;
     font-size:24rpx;
     .pay-button{
        box-sizing: border-box;
        padding-left:30rpx;
        border-radius: 45rpx;
        border:1rpx solid #ccc;
        background: #fff; 
        .favor {
          color: @disabled;
        }
        .color-orange {
          color: @color-orange;
        }
        span{
            vertical-align: middle;
        }
        .amount{
            font-size:40rpx;
            padding-left:20rpx;
        }
        .go-pay{
            width:200rpx;
            height:90rpx;
            line-height: 90rpx;
            color:#fff;
            font-size:30rpx;
            text-align:center;
            border-radius: 45rpx;
            background: @color-orange
        }
      }  
   }
}
</style>
