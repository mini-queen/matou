<template>
  <div class="val-order">
    <div class="selected-addr space-between" @click="selectAddr" v-if="ogTakeMeth==2">
      <div class="addr-left">
        <div class="address">{{ detailAddressInfo }}</div>
        <span class="addr-user_name">{{sName}}</span>
        <span class="addr-tel">{{sPhone}}</span>
      </div>
      <img src="/static/images/arrow.png" class="more-icon" />
    </div>
    <div class="val-address" v-else>
      <div class="adr-top">取货地点</div>
      <div class="adr-bottom space-between" @click="goLookShops">
        <div class="tip">{{shopOnSaleCount}}家店铺支持取货</div>
        <img src="/static/images/arrow.png" class="more-icon" />
      </div>
    </div>
    <!-- <div v-if="!flag" @click="gotoBuyVip" class="order-discounts space-between">
        <div class="desp">开通VIP会员/合伙人，享受商品会员价</div>
         <div class="discount-price">- 9元 >></div> -->
    <!-- <div class="discount-price"> >></div>
      </div>  -->
    <div class="order-detail">
      <div class="order-title">{{goodsListByShop.s_title}}</div>
      <div class="order-shipment space-between" v-for="items in goodsList" :key="items.g_id">
        <div class="shipment-left">
          <img :src="baseUrl + items.g_pic" alt class="goods-img" />
          <div class="goods-info">
            <div class="goods-name">{{items.g_title}}</div>
            <div class="goods-desp">
              <span class="goods-rule"></span>
              <!-- 规格 -->
              <!-- <span class="goods-msg">{{items.class2_name}}</span> -->
            </div>
          </div>
        </div>
        <div class="shipment-right">
          <div class="goods-price"> ¥{{items.og_price}}</div>
          <div class="goods-num">×{{items.mcd_count}}</div>
        </div>
      </div>
      <div class="order-remark space-between" v-if="ogTakeMeth==2">
        <div class="tip">配送方式</div>
        <div class="msg color-primary" v-if="ogTakeMeth == 2">快递</div>
        <!-- <div class="msg color-primary" v-if="ogTakeMeth == 1">自提</div> -->
      </div>
      <div class="order-remark space-between" v-if="ogTakeMeth == 2">
        <div class="tip">配送费</div>
        <div class="msg color-primary"> ¥{{peisong}}</div>
      </div>
      <div class="order-remark space-between">
        <div class="tip">备注</div>
        <input class="msg" placeholder="点击输入备注" v-model="remarks" />
      </div>
      <div class="order-total">
        <div class="total-goods">共{{mcd_count?mcd_count:'1'}}件商品</div>
        <div class="total-price">
          小计：
          <span class="price"> ¥{{goodsPriceTotal}}</span>
        </div>
      </div>
      <div @click="gotoBuyVip" v-if="!flag" class="order-discount space-between">
        <div class="desp">开通VIP会员/合伙人，享受商品会员价</div>
        <div class="discount-price">{{goodsListByShop.price_differences==0? '' : '- ¥ ' +goodsListByShop.price_differences}}>></div>
      </div>
    </div>
    <div class="payment">
      <div class="pay-title">支付方式</div>
      <div class="payment-list">
        <div class="payment-item space-between" v-for="(item,index) in paymentList" :key="index">
          <div class="payment-way">
            <img :src="item.url" alt />
            <span class="text">
              {{item.name}}
              <template v-if="item.code == 'mali'">（可用： {{myMali}}）</template>
            </span>
          </div>
          <div class="payment-checkbox">
            <comCheckbox :value="item.isCheck" @changeHandle="checkHandler(item)" v-if="item.code=='wepay' || myMali >= goodsPriceTotal"></comCheckbox>
          </div>
        </div>
      </div>
    </div>
    <div class="order-text">
      <img src="/static/images/smile.png" alt />
      <span class="text">支付成功后，分享邀请好友购买，赚取邀请奖励！</span>
    </div>
    <div class="order-bar">
      <div class="bar-left">应支付： ¥{{goodsPriceTotal + peisong}}</div>
      <div class="button" @click="pay">立即支付</div>
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
                <com-checkbox :value="item.checked" @changeHandle="checkAddr(index)"></com-checkbox>
                <div class="addr-content">
                  <div class="address">{{item.pName + item.cName + item.aName + item.ccName + item.maDetail }}</div>
                  <div class="addr-content_bottom">
                    <span class="user-name">{{item.maName}}</span>
                    <span class="tel">{{item.maPhone}}</span>
                    <!-- <div class="label center">公司</div> -->
                  </div>
                </div>
              </div>
              <img src="/static/images/bianji-3.png" alt class="edit"  @click="editAddr(item.maId)" />
            </div>
          </div>
          <!-- <div class="addr-extra center-left">
          超配送范围地址
        </div>
        <div class="addr-items extra">
          <div class="address-item flex" v-for="(item,index) in farAddress" :key="index">
            <div class="item-left center-left">
              <div class="addr-content">
                <div class="address">{{item.ccName + item.aName + item.ccName + item.maDetail }}</div>
                <div class="addr-content_bottom">
                  <span class="user-name">{{item.maName}}</span>
                  <span class="tel">{{item.maPhone}}</span>
                </div>
              </div>
            </div>
            <img src="/static/images/bianji-3.png" alt="" class="edit" @click="editAddr">
          </div>
          </div>-->
          <div class="addr-actions center">
            <img src="/static/images/addr-add.png" alt />
            <span class="tip" @click="addNewAddress(0)">新增收货地址</span>
          </div>
        </div>
      </div>
    </div>

    <popup :isShow="isShowPass" mode="payment" :data="paymentData" @closeModal="closeModal" @paySuccess="paySuccess" @forgetPwd="forgetPwd"></popup>

  </div>
</template>
<script>
import popup from '@/components/popup'
import comCheckbox from '@/components/checkbox'
import { wxPay, CarDetailGoods, getUserAddress, payWxLittle, littleBuynow, getMyAccount, getMd5Encryption } from '@/utils/api'
export default {
  data () {
    return {
      mcd_count: 0,
      flag: false, // 是否是非会员
      isShow: false,
      isShowPass: false,
      paymentData: {
        title: '请输入支付密码'
      },
      nearAddress: [], // 近距离
      // farAddress: [], // 远距离
      currentAddress: {}, // 当前的选择地址
      detailAddressInfo: '请选择地址', // 当前详情的地址
      addressID: 0, // 当前地址id
      sPhone: '联系方式',
      sName: '姓名',
      baseUrl: this.$baseUrl,
      mcdIds: 0, // 订单号
      myMali: 0, //
      og_id: 0, // 拼团活动ID
      gbSalePlat: '', // 1:商城  0自营
      goodsList: '', // 商品信息
      goodsListByShop: '', // 店铺信息
      goodsPriceTotal: '',
      shopId: 0, //
      ogTakeMeth: 0, // 配送方式 1自提  2快递
      shopOnSaleCount: 0,
      // beanTotal: '',
      peisong: 0,
      selectedAddr: true,
      isCheck: true,
      remarks: '',
      paymentList: [
        {
          code: 'wepay',
          name: '微信支付',
          isCheck: true,
          url: 'http://sniu.2dian.com/xcx/static/matou/weixinpay.png'
        },
        {
          code: 'mali',
          name: '码粒',
          isCheck: false,
          url: 'http://sniu.2dian.com/xcx/static/matou/mali2.png'
        }
      ]
    }
  },
  computed: {},
  components: {
    comCheckbox,
    popup
  },
  onShow () {
    this.getAddress()
  },
  onLoad () {
    this.getMyAccount()
  },
  created () {
    // this.getMyAccount()
  },
  mounted () {
    let { id, mcdIds, ogId, gsGroup, goodNum, shopId, ogTakeMeth, shopOnSaleCount } = this.$root.$mp.query
    this.ogId = ogId
    this.mcdIds = mcdIds
    this.shopId = shopId
    this.gsGroup = gsGroup
    this.goodNum = goodNum
    this.ogTakeMeth = ogTakeMeth
    this.shopOnSaleCount = shopOnSaleCount
    console.log('ogTakeMeth: ', ogTakeMeth)
    // this.doLittleBuynow()
    this.getCarDetailGoods()
    this.getMyAccount()
  },
  onUnload () {
    this.isShow = false
    this.isShowPass = false
     this.remarks = ''
  },
  methods: {
     editAddr (maid) { // 编辑地址
    console.log(maid, 'maid')
      wx.navigateTo({url: `/pages/pMe/addAddress/main?maId=${maid}`})
    },
    // 获取地址
    async getAddress () {
      var res = await getUserAddress()
      this.nearAddress = res.result.result.list
      this.detailAddressInfo = this.nearAddress[0].pName + this.nearAddress[0].cName + this.nearAddress[0].aName + this.nearAddress[0].ccName + this.nearAddress[0].maDetail
      this.sName = this.nearAddress[0].maName
      this.sPhone = this.nearAddress[0].maPhone
      this.addressID = this.nearAddress[0].maId
      console.log(res.result.result.list)
    },

    gotoBuyVip () {
      console.log('gotoBuyVip')
      // 开通VIP会员
      wx.navigateTo({
        url: '/pages/pEncyclopedia/member/joinVip/main'
      })
    },

    // 跳转浏览店铺
    goLookShops () {
      wx.navigateTo({ url: `/pages/pOrder/shopListForpay/main?fromType=1` })
    },

    addNewAddress (maid) {
      console.log('addNewAddress...')
      wx.navigateTo({ url: `/pages/pMe/addAddress/main?flag=add&maId=${maid}` })
    },

    // 用户信息
    async getMyAccount () {
      console.log('获取用户信息')
      var result = await getMyAccount()
      console.log(result)
      this.memberInfo = result.result.result.member
      if (this.memberInfo) {
        // this.flag = this.memberInfo.mPartnerFlag + this.memberInfo.mVipFlag > 0
        this.myMali = this.memberInfo.mprice
        if (this.memberInfo.mPartnerFlag == 1 || this.memberInfo.mVipFlag == 1) {
          this.flag = true
        } else {
          this.flag = false
        }
      }
    },
    // 获取订单
    getCarDetailGoods: async function () {
      var params = {
        mcdIds: this.mcdIds,
        ogId: this.og_id
      }
      var res = await CarDetailGoods(params)
      this.goodsListByShop = res.result.result.goodsList[0]
      this.goodsList = res.result.result.goodsList[0].goodsByShopIdList
      this.goodsPriceTotal = res.result.result.goodsList[0].s_goods_price
      this.mcd_count = res.result.result.goodsList[0].mcd_count
      // this.beanTotal = res.result.result.beanTotal
      console.log('this.goodsListByShop', this.goodsListByShop)
      console.log('this.goodsList', this.goodsList)
      console.log('this.goodsPriceTotal', this.goodsPriceTotal)
    },
    // 订单初始化接口
    // async doLittleBuynow () {
    //     let params = {
    //           group: this.gsGroup,
    //           count: this.goodNum,
    //           og_id: 0,
    //           ogs_id: this.ogId
    //       }
    //     console.log('doLittleBuynow param: ')
    //     console.log(params)
    //     let data = await littleBuynow(params)
    //     console.log('doLittleBuynow result: ')
    //     console.log(data)
    //     if (data) {
    //       console.log('data.errCode: ', data.result.errCode)
    //       if (data.result.errCode == 'USER_200') {
    //         this.mcdIds = data.result.result.mcd_id
    //         this.getCarDetailGoods()
    //       } else {
    //          wx.showToast({
    //           title: data.result.errMsg,
    //           icon: 'none'
    //         })
    //       }
    //     }
    // },

    shuffle (size) {
      let json =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/'
      let arr = json.split('')
      size = size ? Math.min(arr.length, size) : arr.length
      for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * arr.length)
        const item = arr[randomIndex]
        arr[randomIndex] = arr[i]
        arr[i] = item
      }
      arr.length = size
      return arr.join('')
    },
    checkHandler (item) {
      let payment = this.paymentList.find(item => item.isCheck)
      if (item.isCheck === false && (payment && payment.name !== item.name)) {
        if (this.goodsPriceTotal + this.peisong > this.myMali) {
          wx.showToast({
            title: '余额不足,请切换支付方式',
            icon: 'none'
          })
          return
        }
        payment.isCheck = false
        item.isCheck = true
      } else {
        item.isCheck = !item.isCheck
      }
    },
    doPayPassword (title, tip) { // 打开支付弹框
      this.isShowPass = true
    },

    forgetPwd () { // 忘记密码
      console.log('忘记密码处理..')
      wx.navigateTo({
        url: '/pages/pMe/ressetpayPassword/main'
      })
    },

    paySuccess (arr) { // 密码输入完成, 开始码粒支付
      this.isShow = false
      wx.showToast({ title: arr.join(''), icon: 'none' })
      this.payPassword = arr.join('')
      this.beginMaliPay()
    },

    async beginMaliPay () { // 开始码粒支付
      let md5params = {
        str: this.payPassword
      }
      let md5Data = await getMd5Encryption(md5params)
      console.log('md5Data : ' + md5Data.result.result)
      // let md5Str = this.getMd5()
      let params = {
        memberCarIds: this.mcdIds,
        bean: 0,
        type: 0,
        memberAddressId: this.shopId,
        typeAddress: 0,
        deviceType: 3,
        remarks: this.remarks,
        ogId: 0,
        uId: -1,
        price: this.goodsPriceTotal,
        password: md5Data.result.result
      }
      console.log('mali pay params: ')
      console.log(params)
      let data = await payWxLittle(params)
      console.log(data)
      if (data.result.errCode == 'USER_200') {
        wx.navigateTo({ url: '/pages/pIndex/goodPayOk/main' })
      } else {
        wx.showToast({ title: data.result.errMsg, icon: 'none' })
        if (data.result.errCode == 'PayError_002') { // 未设置支付密码
          setTimeout(function () {
            wx.navigateTo({ url: '/pages/pMe/setpayPassword/main' })
          }, 2000)
        }
      }
    },

    async pay () {
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (!token) {
        wx.navigateTo({
          url: '/pages/pIndex/login/main'
        })
        return
      }
      console.log('do pay start...')
      if (this.paymentList.findIndex(item => item.isCheck) === -1) {
        return wx.showToast({ title: '请选择支付方式', icon: 'none' })
      }
      console.log('get here...')
      let payment = this.paymentList.find(item => item.isCheck)

      if (payment.code == 'mali') {
        console.log('payment.code: ' + payment.code)
        this.isShowPass = true
        // this.isShow = true
        return
      }

      let params = {
        memberCarIds: this.mcdIds,
        bean: 0,
        type: 2,
        price: 1,
        memberAddressId: this.addressID,
        typeAddress: 1,
        deviceType: 3,
        ogId: 0
      }

      let data = await payWxLittle(params)
      console.log('返回值', data.result.result.timeStamp)
      // 微信支付功能
      wx.requestPayment({
        timeStamp: data.result.result.timeStamp, // 后端返回
        nonceStr: data.result.result.nonceStr, // 后端返回
        package: data.result.result.package, // 统一下单接口返回的 prepay_id 参数 后端返回
        signType: 'MD5',
        paySign: data.result.result.paySign, // 签名 后端返回
        success: function (res) {
          console.log(res)
          // 支付成功，进入支付成功页
          wx.showToast({ title: '支付成功', icon: 'none' })
          wx.navigateTo({ url: '/pages/pIndex/goodPayOk/main' })
        },
        fail: function (err) {
          console.log(err)
          // 支付失败，跳转订单页面
          wx.showToast({ title: '支付失败', icon: 'none' })
        }
      })
      console.log('支付123..')
    },
    // 地址相关 ==复制来的
    showMoreAction (status, items) {
      this.showMore = status
      // this.items = items
    },
    closeModal () {
      this.isShow = false
      this.isShowPass = false
    },
    selectAddr () {
      console.log(1)
      this.isShow = true
    },
    cancelAddr () {
      this.closeModal()
    },
    checkAddr (index) {
      // 地址列表选则
      console.log(index)
      this.currentAddress = this.nearAddress[index]
      this.closeModal()
      this.sPhone = this.currentAddress.maPhone
      this.sName = this.currentAddress.maName
      this.addressID = this.currentAddress.maId
      this.detailAddressInfo = this.currentAddress.pName + this.currentAddress.cName + this.currentAddress.aName + this.currentAddress.ccName + this.currentAddress.maDetail
    }
  }
}
</script>

<style lang="less" scoped>
.order-discounts {
  width: 85%;
  margin: 0 auto;
  margin-top: 30rpx;
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
.val-order {
  color: @primary;
  background-color: @color-bg;
  .val-address {
    background-color: @color-white;
    padding: 0 30rpx;
    .adr-top {
      padding: 36rpx 0 20rpx 0;
      font-size: 24rpx;
      border-bottom: solid 1px @line;
    }
    .adr-bottom {
      padding: 24rpx 0 32rpx 0;
      .tip {
        font-size: 24rpx;
      }
      .more-icon {
        width: 11rpx;
        height: 20rpx;
      }
    }
  }
  .selected-addr {
    background-color: @color-white;
    padding: 36rpx 30rpx;
    .addr-left {
      .address {
        width: 600rpx;
        font-size: 34rpx;
        font-weight: 400;
        margin-bottom: 26rpx;
      }
      .addr-user_name {
        font-size: 28rpx;
        color: @grey;
      }
      .addr-tel {
        font-size: 28rpx;
        color: @grey;
        margin-left: 50rpx;
      }
    }
    .more-icon {
      width: 11rpx;
      height: 20rpx;
      padding-left: 30rpx;
      padding-top: 16rpx;
    }
  }
  .order-detail {
    background-color: @color-white;
    margin-top: 20rpx;
    padding: 30rpx;
    .order-title {
      font-size: 28rpx;
      padding-bottom: 26rpx;
      border-bottom: solid 1px @line;
      font-weight: 500;
    }
    .order-shipment {
      padding: 42rpx 0;
      border-bottom: solid 1px @line;
      .shipment-left {
        .goods-img {
          width: 110rpx;
          height: 110rpx;
        }
        .goods-info {
          width: 320rpx;
          height: 110rpx;
          overflow: hidden;
          margin-left: 42rpx;
          display: inline-block;
          .goods-name {
            font-size: 28rpx;
            margin-bottom: 26rpx;
          }
          .goods-desp {
            font-size: 26rpx;
            color: @grey;
            .goods-rule {
              margin-right: 55rpx;
            }
            .goods-msg {
            }
          }
        }
      }
      .shipment-right {
        .goods-price {
          font-size: 30rpx;
          margin-bottom: 26rpx;
        }
        .goods-num {
          font-size: 28rpx;
          color: @grey;
        }
      }
    }
    .order-remark {
      margin-top: 50rpx;
      .tip {
        font-size: 28rpx;
      }
      .msg {
        font-size: 28rpx;
        color: @grey;
        &.color-primary {
          color: @primary;
        }
      }
    }
    .order-total {
      margin-top: 50rpx;
      display: flex;
      justify-content: flex-end;
      padding-top: 40rpx;
      border-top: solid 1px @line;
      .total-goods {
        font-size: 24rpx;
        color: @grey;
      }
      .total-price {
        font-size: 24rpx;
        color: @grey;
        margin-left: 68rpx;
        .price {
          color: @color-orange;
          font-size: 28rpx;
        }
      }
    }
    .order-discount {
      margin-top: 30px;
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
  }
  .payment {
    background-color: @color-white;
    margin-top: 20rpx;
    padding: 30rpx;
    .pay-title {
      font-size: 28rpx;
      font-weight: 500;
    }
    .payment-list {
      .payment-item {
        padding-top: 30rpx;
        height: 50rpx;
        align-items: center;
        .payment-way {
          img {
            width: 50rpx;
            height: 50rpx;
            vertical-align: top;
          }
          .text {
            margin-left: 20rpx;
            font-size: 28rpx;
            color: @grey;
          }
        }
        .payment-checkbox {
        }
      }
    }
  }
  .order-text {
    background-color: @color-white;
    margin-top: 20rpx;
    height: 188rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 88rpx;
    img {
      width: 30rpx;
      height: 30rpx;
      margin-right: 20rpx;
    }
    .text {
      font-size: 24rpx;
      color: @grey;
    }
  }
  .order-bar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 88rpx;
    display: flex;
    z-index: 98;
    .bar-left {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 28rpx;
      color: @color-white;
      background-color: @color-btn_grey;
      padding-left: 30rpx;
    }
    .button {
      .btn--primary();
      width: 194rpx;
      height: 88rpx;
      line-height: 88rpx;
    }
  }
  //
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
      background: #ffff;
      padding: 0 20rpx;
      margin-top: 20rpx;
      box-sizing: border-box;
      .address {
        border-bottom: 1rpx solid @line;
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
          // text-decoration: line-through;
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
}
</style>
