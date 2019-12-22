<template>
  <div class="container">
    <div class="section">
      <div class="address flex" @click="selectAddr">
        <span class="tip">{{ detailAddressInfo }}</span>
        <image class="arrow-img" src="/static/images/arrow.png"></image>
      </div>
      <div class="addr-bottom">
        <span class="user-name">{{currentAddress.maName}}</span>
        <span class="tel">{{currentAddress.maPhone}}</span>
      </div>
      <div class="address-tip">预计送达时间依赖于快递运输流程</div>
    </div>
    <div class="section" v-for="(item,index) in dataList" :key="index">
      <div class="title">{{item.shopTitle}}</div>
      <div :class="{hide: showMore}">
        <div class="list-item" v-for="(goodItem,goodIndex) in item.list" :key="goodIndex">
          <div class="flex goods-left">
            <image class="goods-img" :src="baseUrl + goodItem.gbPic"></image>
            <div>
              <div class="item-name">{{goodItem.gbShortName}}</div>
              <div class="item-num">X{{goodItem.buyNum}}</div>
            </div>
          </div>
          <div class="goods-right">
            <div class="item-price"> ¥{{goodItem.gPrice}}</div>
            <!-- <div class="item-org-price"> ¥{{goodItem.gOriginalPrice}}</div> -->
          </div>
        </div>
      </div>
      <div>
        <!-- <div class="list-item flex" v-for="(item,index) in goodListAll" :key="index" >
                <div class="flex">
                    <image class="item-img" :src="item.url"></image>
                    <div>
                        <div class="item-name">{{item.name}}</div>
                        <div class="item-num">x{{item.num}}</div>
                    </div> 
                </div>
                <div>
                    <div class="item-price"> {{item.price}}</div>
                    <div class="item-org-price"> {{item.orgPrice}}</div>
                </div>
            </div> -->
      </div>
      <div class="section-more" @click="showMoreAction(true,0)" v-if="!showMore">
        收起 <image class="arrow-up" src="/static/images/arrow_down.png"></image>
      </div>
      <div class="section-more" @click="showMoreAction(false,3)" v-else>

        展开更多
        <image class="arrow-down" src="/static/images/arrow_down.png"></image>

      </div>
      <div class="section-delivery">
        <div class="flex">
          <span>配送方式</span>
          <span>快递</span>
        </div>
        <div class="item flex">
          <span>配送费</span>
          <span> ¥{{freightPrice}}</span>
        </div>
      </div>
      <div v-if="false" class="section-delivery flex">
        <span>满减优惠</span>
        <span class="color-orange">- 8</span>
      </div>
      <div class="section-favor flex">
        <span v-if="false">已优惠 <span class="color-orange"> 8</span></span>
        <span v-else></span>
        <span>小计 <span class="amount"> ¥{{itemTotalGprice}}</span></span>
      </div>
    </div>
    <div class="section">
      <div class="section-tip flex">
        <span>备注 : <span style="overflow:hidden">{{remark}}</span></span>

        <image class="arrow-img" @click="gotoRemark" src="/static/images/arrow.png"></image>
      </div>
      <div class="section-tip flex">
        <span>如遇缺货</span>
        <span>缺货时电话与我沟通</span>
      </div>
      <div class="section-tip flex noline">
        <span>支付方式</span>
        <span>在线支付</span>
      </div>
    </div>
    <!-- 结算 -->
    <div class="pay-wrap">
      <div class="pay-button flex">
        <span class="favor" v-if="false">已优惠 8 </span>
        <span class="color-orange">合计<span class="amount"> ¥{{itemTotalGprice}}</span></span>
        <span class="go-pay" @click="doGenerateOrder">去结算</span>
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
            <div class="address-item flex" v-for="(item,index) in addressGroup" :key="index">
              <div class="item-left center-left">
                <com-checkbox :value="item.checked" @changeHandle="checkAddr(index)"></com-checkbox>
                <div class="addr-content">
                  <div class="address" @click="checkAddr(index)">{{item.pName + item.cName + item.aName + item.ccName + item.maDetail}} </div>
                  <div class="addr-content_bottom">
                    <span class="user-name">{{item.maName}}</span>
                    <span class="tel">{{item.maPhone}}</span>
                    <div class="tag">
                      <span class="tag-item red" v-if="item.maState">默认</span>
                      <span class="tag-item blue" v-if="item.maLabel==0">公司</span>
                      <span class="tag-item yellow" v-if="item.maLabel==1">家</span>
                      <span class="tag-item green" v-if="item.maLabel==2">学校</span>
                    </div>
                  </div>
                </div>
              </div>
              <img src="/static/images/bianji-3.png" alt="" class="edit" @click="editNewAddress(item.maId)">
            </div>
          </div>
          <div class="addr-extra center-left">
          </div>
          <!-- <div class="addr-items extra">
          <div class="address-item flex" v-for="(item,index) in " :key="index">
            <div class="item-left center-left">
              <div class="addr-content">
                <com-checkbox  :value="item.checked"  @changeHandle="checkAddr(index)"></com-checkbox>
                <div class="address">{{item.maDetail }}</div>
                <div class="addr-content_bottom">
                  <span class="user-name">{{item.maName}}</span>
                  <span class="tel">{{item.maPhone}}</span>
                </div>
              </div>
            </div>
            <img src="/static/images/bianji-3.png" alt="" class="edit" @click="editAddr">
          </div>
        </div> -->
          <div class="addr-actions center" @click="addNewAddress(0)">
            <img src="/static/images/addr-add.png" alt="">
            <span class="tip">新增收货地址</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import comCheckbox from '@/components/checkbox'
import popup from '@/components/popup'
import { checkGetOrderInfo, generateOrder, getOrderInfo, getMyAccount } from '@/utils/api'
export default {
  data () {
    return {
      addressGroup: '', // 快递所有地址
      baseUrl: this.$baseUrl,
      // 参数
      shopId: null,
      gbSalePlat: 1, // 0 自提 1 配送
      ocIds: null, // 订单ID
      maId: null, // 地址ID
      deliveryType: null, // 订单类型
      isShow: false, // 地址弹层
      //
      goodId: null,
      showMore: false, // 展开收起
      dataList: [], // 商品数组
      itemGOriginalPrice: 0, // 商品原价
      itemTotalGprice: 0, // 商品小计
      storeFreightPrice: 0, // 包装费
      freightPrice: 0, // 配送费
      priceDifferences: 0, // 享受会员价
      remark: '', // 备注
      allAddress: [], // 所有距离
      nearAddress: [], // 近距离
      farAddress: [], // 远距离
      currentAddress: {}, // 当前的选择地址
      detailAddressInfo: '请选择地址', // 当前详情的地址
      addressID: 0, // 当前地址id
      orderId: '', // 订单ID
      shop: {}, // 商户信息
      shopTitle: '',
      myPhone: '' // 用户手机号
    }
  },
  mounted () {
    wx.getStorage({
      key: 'remark',
      data: ''
    })
  },
  onLoad (option) {
    console.log(option, 'option')
    this.shopId = option.shopId
    this.gbSalePlat = option.gbSalePlat
    this.ocIds = option.ocIds
  },
  onShow () {
    console.log('onShow...')
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
    this.shopTitle = ''
    this.shop = {}
    this.dataList = []
    this.detailAddressInfo = ''
    this.remark = ''
    this.myPhone = ''
    this.itemGOriginalPrice = 0
    this.itemTotalGprice = 0
    this.storeFreightPrice = 0
    this.freightPrice = 0 // 配送费
    this.priceDifferences = 0 // 享受会员价
  },
  components: {
    comCheckbox, popup
  },
  //   onLoad (option) {
  //     this.goodId = option.goodId
  //   },
  methods: {
    async getMyAccountInfo () {
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (token) {
        var res = await getMyAccount()
        this.myPhone = res.result.result.member.mphone
      }
    },
    // 获取订单信息
    async doGetOrderInfo () {
      let params = {
        // gbSalePlat: this.gbSalePlat, // 0自营 1商城
        gbSalePlat: 1,
        shopId: this.shopId,
        ocIds: this.ocIds,
        maId: '',
        deliveryType: 30
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
        this.allAddress = data.result.result.memberAddressList.items
        this.shop = data.result.result.shop
        this.latitude = data.result.result.shop.sLat
        this.longitude = data.result.result.shop.sLon
        this.addressGroup = this.nearAddress.concat(this.farAddress)
        if (this.addressGroup.length > 0) {
          this.checkAddr(0)
        }
        console.log('nearAddress:')
        console.log(this.addressGroup, 'nearAddress')
        console.log('farAddress:')
        console.log(this.nearAddress)
      }
      console.log(this.shop, 'checkGetOrderInfo')
    },
    // 新增地址
    addNewAddress (maid) {
      console.log('addNewAddress...')
      wx.navigateTo({ url: `/pages/pMe/addAddress/main?flag=add&maId=${maid}` })
    },
    // 开始提交订单
    async doGenerateOrder () {
      if (!this.myPhone) { // 如果没有绑定手机号跳转到绑定手机号页面
        wx.navigateTo({
          url: '/pages/pMe/bindPhone/main'
        })
        return
      }

      if (this.addressID == 0) {
        wx.showToast({
          title: '地址不能为空', // 提示的内容,
          icon: 'none', // 图标,
          duration: 2000, // 延迟时间,
          mask: true, // 显示透明蒙层，防止触摸穿透,
          success: res => { }
        })
        return
      }
      let params = {
        // gbSalePlat: this.gbSalePlat, // 0自营 1商城
        gbSalePlat: 1,
        shopId: this.shopId,
        ocIds: this.ocIds,
        maId: this.addressID,
        // deliveryType: deliveryTypeSelected,
        deliveryType: 30,
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
          success: res => { }
        })
        return
      }

      if (data) {
        // 跳转到支付页面
        this.orderId = data.result.result.osOrderId
        console.log('orderId: ' + this.orderId)
        console.log('shopTitle: ' + this.shopTitle)
        wx.navigateTo({ url: `/pages/pIndex/goodPay/main?orderId=${this.orderId}&shopName=${this.shopTitle}` })
      }
    },

    goPay () {
      wx.navigateTo({ url: '/pages/pIndex/goodPay/main' })
    },
    // 地址相关 ==复制来的
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
      this.currentAddress = this.addressGroup[index]
      this.closeModal()
      this.addressID = this.currentAddress.maId
      // this.detailAddressInfo = this.currentAddress.ccName + this.currentAddress.aName + this.currentAddress.ccName + this.currentAddress.maDetail
      this.detailAddressInfo = this.currentAddress.pName + this.currentAddress.cName + this.currentAddress.aName + this.currentAddress.ccName + this.currentAddress.maDetail
    },
    editNewAddress (maid) {
      wx.navigateTo({ url: `/pages/pMe/addAddress/main?maId=${maid}` + `&flag=edit` })
    },
    gotoRemark () { // 添加备注
      wx.navigateTo({ url: `/pages/pOrder/orderRemark/main` })
    }
    //
  }
}
</script>  
<style lang="less" scoped>
.addr-bottom {
  padding: 30rpx 0;
  font-size: 28rpx;
  color: @grey;
  border-bottom: 1rpx solid #e5e5e5;
  .user-name {
    margin-right: 60rpx;
  }
  .tel {
  }
}
.tag {
  font-size: 12px;
  display: inline-block;
  margin-left: 24rpx;
  .tag-item {
    width: 30px;
    height: 15px;
    margin: 0 4px;
    text-align: center;
  }
  .green {
    color: rgb(84, 251, 42);
    background-color: rgb(227, 255, 204);
  }
  .red {
    background-color: #fcdddd;
    color: #fb2a2a;
  }
  .yellow {
    background-color: #fcebcc;
    color: #fe6a00;
  }
  .blue {
    background-color: #ddeffc;
    color: #38a4f0;
  }
}
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
  content: '\200B';
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
.cu-modal .cu-dialog > .cu-bar:first-child .action {
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
              .user-name,
              .tel {
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

.container {
  padding-top: 30rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
  padding-bottom: 174rpx;
  background: @color-bg;
  background: linear-gradient(
      180deg,
      rgba(254, 106, 0, 1) 0%,
      rgba(254, 106, 0, 0.66) 30%,
      rgba(254, 106, 0, 0) 40%
    ),
    rgba(247, 247, 247) 100%;
  width: 100%;
  font-size: 28rpx;
  box-sizing: borde-box;
  .tip {
    color: @grey;
  }
  .arrow-img {
    width: 12rpx;
    height: 20rpx;
  }

  .color-orange {
    color: @color-orange;
  }
  .section {
    width: 100%;
    border-radius: 10rpx;
    background-color: #ffffff;

    padding: 0 20rpx;
    margin-top: 20rpx;
    box-sizing: border-box;
    .address {
      padding: 5px;

      // border-bottom: 1rpx solid @line;
      // line-height: 94rpx;
      height: 94rpx;
      font-size: 28rpx;
    }
    .address-tip {
      line-height: 94rpx;
      font-size: 26rpx;
      color: @grey;
    }
    .title {
      font-size: 32rpx;
      border-bottom: 1rpx solid @line;
      padding-top: 48rpx;
      padding-bottom: 20rpx;
    }
    .list-item {
      font-size: 28rpx;
      margin-top: 40rpx;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .item-img {
        width: 90rpx;
        height: 90rpx;
        padding-right: 20rpx;
      }
      .item-name {
        width: 420rpx;

        margin-top: 10rpx;
      }
      .item-price {
        font-size: 30rpx;
        margin-top: 10rpx;
      }
      .item-num,
      .item-org-price {
        font-size: 26rpx;
        color: @grey;
        margin: 10rpx 0;
      }
      .item-org-price {
        text-decoration: line-through;
      }
    }
    .section-more {
      padding-top: 36rpx;
      padding-bottom: 40rpx;
      border-bottom: 1rpx solid @line;
      color: @grey;
      font-size: 28rpx;
      text-align: center;
      background: #fff;
      .arrow-down {
        width: 20rpx;
        height: 11rpx;
        padding-left: 20rpx;
      }
      .arrow-up {
        width: 20rpx;
        height: 10rpx;
        transform: rotate(180deg);
        padding-right: 10rpx;
        vertical-align: middle;
        padding-top: 10rpx;
      }
    }
    .section-delivery {
      padding: 40rpx 0;
      border-bottom: 1rpx solid @line;
      font-size: 30rpx;
      .item {
        margin-top: 40rpx;
      }
    }
    .section-favor {
      padding: 40rpx 0;
      color: @grey;
      .amount {
        color: #333;
        font-size: 40rpx;
      }
    }
    .section-tip {
      padding: 40rpx 0;
      color: @grey;
      border-bottom: 1rpx solid @line;
      &.noline {
        border: none;
      }
    }
  }
  .pay-wrap {
    box-sizing: border-box;
    position: fixed;
    z-index: 999;
    bottom: 30rpx;
    right: 30rpx;
    left: 30rpx;
    height: 90rpx;
    font-size: 24rpx;
    color: @grey;
    .pay-button {
      box-sizing: border-box;
      padding-left: 30rpx;
      border-radius: 45rpx;
      border: 1rpx solid #ccc;
      background: #fff;
      span {
        vertical-align: middle;
      }
      .amount {
        font-size: 40rpx;
        padding-left: 20rpx;
      }
      .go-pay {
        width: 200rpx;
        height: 90rpx;
        line-height: 90rpx;
        color: #fff;
        font-size: 30rpx;
        text-align: center;
        border-radius: 45rpx;
        background: @color-orange;
      }
    }
  }
}
image {
  width: 45px;
  height: 45px;
  padding-right: 20rpx;
}
.hide {
  max-height: 150rpx;
  overflow: hidden;
}
.shop-order {
  color: @primary;
  background-color: @color-bg;
  padding-bottom: 180rpx;
  .shop-top {
    background-image: linear-gradient(@color-orange, @color-bg);
    .section {
      background-color: #ffffff;
      // background-color: @color-white;
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
          /deep/ .checkbox-wrapper {
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
    .goods-img {
      width: 90rpx;
      height: 90rpx;
      border: solid 1px @line;
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
          transition: 0.3s max-height linear;
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
            width: 20rpx;
            height: 11rpx;
            transform: rotate(180deg);
          }
          .arrow-down {
            vertical-align: middle;
            width: 20rpx;
            height: 11rpx;
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
  .pay-wrap {
    box-sizing: border-box;
    position: fixed;
    z-index: 999;
    bottom: 30rpx;
    right: 30rpx;
    left: 30rpx;
    height: 90rpx;
    font-size: 24rpx;
    .pay-button {
      box-sizing: border-box;
      padding-left: 30rpx;
      border-radius: 45rpx;
      border: 1rpx solid #ccc;
      background: #fff;
      .favor {
        color: @disabled;
      }
      .color-orange {
        color: @color-orange;
      }
      span {
        vertical-align: middle;
      }
      .amount {
        font-size: 40rpx;
        padding-left: 20rpx;
      }
      .go-pay {
        width: 200rpx;
        height: 90rpx;
        line-height: 90rpx;
        color: #fff;
        font-size: 30rpx;
        text-align: center;
        border-radius: 45rpx;
        background: @color-orange;
      }
    }
  }
}
</style>