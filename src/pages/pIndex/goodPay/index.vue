<template>
<div class="container">
    <div class="pay-amount">
        <div> <span class="num">¥{{orderPrice}}</span></div>
        <div class="title">{{shopName}}</div>
        <div class="time" v-if="isShowLeftTime == true">
            支付剩余时间&nbsp;{{time}}
        </div>
    </div>
    <div class="pay-method">
        <div class="title">支付方式</div> 
        <div class="item-wrap">
            <div class="item flex" v-for="(item,index) in paymentList" :key="index">  
                <div>
                    <image class="item-img" :src="item.url"></image>
                    <span class="item-name">{{item.name}}</span> 
                    <span class="item-award" v-if="false">奖   {{item.award}}</span>  
                    <div class="item-use" v-if="item.use">可用： {{myMali}}</div>
                </div>
                <div>
                  <comCheckbox :value="item.isCheck" @changeHandle="checkHandler(item)" v-if="item.type=='wx' || myMali >= orderPrice"></comCheckbox>
                </div>
            </div>
        </div>
    </div>
    <div class="pay-button" @click="surePay">确认支付</div>
    <!-- 支付弹窗 -->
    <popup :isShow="showPay" @closeModal="closePay">
        <div class="pay-dialog-wrap">
          <div class="title">
            确认支付
            <image @click="closePay"  class="close-img" src="/static/images/close.png"></image>
          </div>
          <div class="amount-wrap"> &nbsp;<span class="amount">{{orderPrice}}</span></div> 
          <div class="method flex">
            <span style="color:#787878">付款方式</span><span>码粒</span>
          </div>
          <div class="button" @click="doPayPassword">立即支付</div>
        </div>
    </popup>
    <!-- 支付密码弹窗 -->
    <popup 
      :isShow="isShow" 
      mode="payment"
      :data="paymentData"
      @closeModal="closeModal" 
      @paySuccess="paySuccess"
      @forgetPwd="forgetPwd"
    ></popup>
    <!--  -->
</div>
</template>
<script>
import popup from '@/components/popup'
import comCheckbox from '@/components/checkbox'
import {getOrderInfo, beginPay, wxGoodsPay, getMd5Encryption, getMyAccount, wxPartnerPay, wxPay, payWxCoupon, toPricePartnerPay, toPriceVipPay} from '@/utils/api'
// import md5 from 'js-md5'
// const md5 = require('js-md5')
// import {MD5} from '@/utils/md5'
export default{
  components: {
    comCheckbox,
    popup
  },
  data () {
    return {
      orderId: '', // 订单id
      showPay: false,
      isShowLeftTime: true, // 是否显示剩余倒计时
      isShow: false, // 是否弹出输入支付密码框
      orderInfo: {},
      memberInfo: {},
      orderPrice: 0,
      payPassword: '', // 用户输入的支付密码
      payType: '', // MEMBER_PARTNER_YEAR1_PRICE，MEMBER_PARTNER_YEAR2_PRICE，MEMBER_PARTNER_YEAR3_PRICE
      shopId: 0, // 店铺ID
      time: '30:00',
      amount: 58.5,
      myMali: 0,
      paymentData: {
          title: '请输入支付密码'
        },
      paymentList: [
        {type: 'wx', name: '微信支付', award: 4.9, isCheck: true, url: 'http://sniu.2dian.com/xcx/static/matou/weixinpay.png'},
        {type: 'mali', name: '码粒', award: 5.9, use: 100.99, isCheck: false, url: 'http://sniu.2dian.com/xcx/static/matou/mali2.png'}
      ],
       paymentListWx: [
        {type: 'wx', name: '微信支付', award: 4.9, isCheck: true, url: 'http://sniu.2dian.com/xcx/static/matou/weixinpay.png'}
      ],
      paymentListBack: [
        {type: 'wx', name: '微信支付', award: 4.9, isCheck: true, url: 'http://sniu.2dian.com/xcx/static/matou/weixinpay.png'},
        {type: 'mali', name: '码粒', award: 5.9, use: 100.99, isCheck: false, url: 'http://sniu.2dian.com/xcx/static/matou/mali2.png'}
      ],
      payMethodName: '微信支付',
      shopName: ''
    }
  },

  onShow () {
     this.paymentList = [
        {type: 'wx', name: '微信支付', award: 4.9, isCheck: true, url: 'http://sniu.2dian.com/xcx/static/matou/weixinpay.png'},
        {type: 'mali', name: '码粒', award: 5.9, use: 100.99, isCheck: false, url: 'http://sniu.2dian.com/xcx/static/matou/mali2.png'}
      ]
  },

  onLoad (option) {
    this.orderId = option.orderId
    this.payFlag = option.payFlag
    this.shopId = option.shopId
    this.shopName = option.shopName
    this.payType = option.payType
    this.payMoney = option.payMoney
    console.log('this.payFlag: ' + this.payFlag)
    console.log('shopId: ' + this.shopId)
    console.log('orderId: ' + this.orderId)
    if (this.payFlag == 'vipPay') { // VIP支付
       this.getMyAccount()
       this.shopName = ''
       this.orderPrice = this.payMoney
       this.isShowLeftTime = false
    } else if (this.payFlag == 'parterPay') { // 合伙人支付
       this.getMyAccount()
       this.shopName = ''
       this.orderPrice = this.payMoney
       this.isShowLeftTime = false
    } else if (this.payFlag == 'couponPay') { // 会员活动支付
       this.getMyAccount()
       this.shopName = ''
       this.orderPrice = this.payMoney
       this.paymentList = this.paymentListWx
       this.isShowLeftTime = false
    } else {
      this.loadOrder()
    }
 },

  mounted () {
    // 模拟从接口获取 生成订单时间
    this.getDiffTime()
  },
  onUnload () {
    clearInterval(this.timer)
    this.time = '30:00'
    this.paymentList = this.paymentListBack
    this.shopName = ''
    this.payMoney = 0
    this.isShowLeftTime = true
  },
  methods: {
    checkHandler (item) {
      console.log('checkHandler')
      let payment = this.paymentList.find(item => item.isCheck)
      if (item.isCheck === false && (payment && payment.name !== item.name)) {
        payment.isCheck = false
        item.isCheck = true
      } else {
        item.isCheck = !item.isCheck
      }
      this.payMethodName = item.name
    },
    getDiffTime () {
      let oldTime = new Date() // new Date(order.created_at);
      let subtractTime = new Date() - oldTime
      if (subtractTime >= 0) {
        this.countdown((30 * 60 * 1000 - subtractTime - 1) / 1000)
      }
    },
    countdown (intDiff) {
      // 倒计时函数
      this.timer = setInterval(() => {
        let day = 0
        let hour = 0
        let minute = 0
        let second = 0 // 时间默认值
        if (intDiff > 0) {
          // 计算相关的天，小时，还有分钟，以及秒
          day = Math.floor(intDiff / (60 * 60 * 24))
          hour = Math.floor(intDiff / (60 * 60)) - day * 24
          minute = Math.floor(intDiff / 60) - day * 24 * 60 - hour * 60
          second = Math.floor(intDiff) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60
        }
        hour = '0' + hour
        minute = String(minute).padStart(2, '0')
        second = String(second).padStart(2, '0')
        this.time = `${minute}:${second}`
        intDiff--
        if (intDiff < 0) {
          clearInterval(this.timer)
          this.time = '00:00'
        }
      }, 1000)
    },

    async getMyAccount () {
        var result = await getMyAccount()
        this.memberInfo = result.result.result.member
        if (this.memberInfo) {
            this.myMali = this.memberInfo.mprice
        }
       },

    async loadOrder () {
      let params = {
            orderId: this.orderId //
        }
      console.log('getOrderInfo params1111: ')
      console.log(params)
      let data = await getOrderInfo(params)
      console.log(data)
      console.log('title')
      // console.log(data.result.result.order.title)
      if (data.errCode == 'USER_200') {
        this.orderInfo = data.result.result.order
        this.memberInfo = data.result.result.member
        this.orderPrice = data.result.result.order.opayPrice
        // this.shopName = data.result.result.order.title
        this.myMali = data.result.result.member.mprice
      }
    },
    surePay () {
      // wx.navigateTo({url: '/pages/pIndex/goodPayOk/main'})
      if (this.payMethodName === '码粒') {
        // 码粒支付
       // this.showPay = true
        // this.orderPrice = this.orderInfo.opayPrice
        if (this.myMali < this.orderPrice) { // 判断当前码粒支付够用
            wx.showToast({title: '码粒不足', icon: 'none'})
            return
        }
        this.doPayPassword()

       // let data = await beginPay(params)
      } else {
        // 微信支付
        this.showPay = false
        if (this.payFlag == 'vipPay') { // VIP支付
          this.beginWxVipPay()
        } else if (this.payFlag == 'parterPay') { // 合伙人支付
          this.beginWxPartnerPay()
        } else if (this.payFlag == 'couponPay') { // 会员活动支付
          this.beginWxCouponPay()
        } else {
          this.beginWxPay()
        }
      }
    },

    closeModal () {
        this.isShow = false
      },
      doPayPassword (title, tip) { // 打开支付弹框
        this.isShow = true
      },
      paySuccess (arr) { // 密码输入完成
        this.isShow = false
        wx.showToast({title: arr.join(''), icon: 'none'})
        this.payPassword = arr.join('')

        if (this.payFlag == 'vipPay') { // VIP码粒支付
          this.beginMaliVipPay()
        } else if (this.payFlag == 'parterPay') { // 合伙人码粒支付
          this.beginMaliParterPay()
        } else if (this.payFlag == 'couponPay') { // 会员活动码粒支付
          // this.beginWxCouponPay()
        } else {
          this.beginMaliPayGood()
        }
      },
      forgetPwd () { // 忘记密码
        console.log('忘记密码处理123.')
       // wx.navigateTo({url: '/pages/pMe/setpayPassword/main'})
        wx.navigateTo({
                   url: '/pages/pMe/ressetpayPassword/main'
               })
      },

   async getMd5 () {
      let params = {
            str: this.payPassword
        }
        console.log('getMd5 params: ')
        console.log(params)
        let data = await getMd5Encryption(params)
        console.log(data)
        return data.result.result
    },

   async beginMaliPayGood () { // 普通商品码粒支付
      let md5params = {
            str: this.payPassword
        }
      let md5Data = await getMd5Encryption(md5params)
      console.log('md5Data : ' + md5Data.result.result)
      // let md5Str = this.getMd5()
      let params = {
            orderId: this.orderId,
            paymentType: 0,
            passwd: md5Data.result.result
           // passwd: '96e79218965eb72c92a549dd5a330112'
        }
        console.log('beginPay params: ')
        console.log(params)
        let data = await beginPay(params)
        console.log(data)
        if (data.result.errCode == 'USER_200') {
           wx.navigateTo({url: '/pages/pIndex/goodPayOk/main'})
        } else {
          // wx.showToast({title: data.result.errMsg, icon: 'none'})
          wx.showToast({title: data.result.errMsg, icon: 'none'})
              if (data.result.errCode == 'PayError_002') { // 未设置支付密码
                setTimeout(function () {
                    wx.navigateTo({url: '/pages/pMe/setpayPassword/main'})
                }, 2000)
              }
        }
    },

    async beginMaliParterPay () { // 合伙人码粒支付
      let md5params = {
            str: this.payPassword
        }
      let md5Data = await getMd5Encryption(md5params)
      console.log('md5Data : ' + md5Data.result.result)
      // let md5Str = this.getMd5()
      let params = {
            payType: this.payType,
            passwd: md5Data.result.result,
            shopId: this.shopId
           // passwd: '96e79218965eb72c92a549dd5a330112'
        }
        console.log('beginPay params: ')
        console.log(params)
        let data = await toPricePartnerPay(params)
        console.log(data)
        if (data.result.errCode == 'USER_200') {
           wx.navigateTo({url: '/pages/pIndex/goodPayOk/main?flag=1'})
        } else {
          // wx.showToast({title: data.result.errMsg, icon: 'none'})
          wx.showToast({title: data.result.errMsg, icon: 'none'})
              if (data.result.errCode == 'PayError_002') { // 未设置支付密码
                setTimeout(function () {
                    wx.navigateTo({url: '/pages/pMe/setpayPassword/main'})
                }, 2000)
              }
        }
    },

    async beginMaliVipPay () { // vip码粒支付
      let md5params = {
            str: this.payPassword
        }
      let md5Data = await getMd5Encryption(md5params)
      console.log('md5Data : ' + md5Data.result.result)
      // let md5Str = this.getMd5()
      let params = {
            payType: this.payType,
            passwd: md5Data.result.result
           // passwd: '96e79218965eb72c92a549dd5a330112'
        }
        console.log('beginPay params: ')
        console.log(params)
        let data = await toPriceVipPay(params)
        console.log(data)
        if (data.result.errCode == 'USER_200') {
           wx.navigateTo({url: '/pages/pIndex/goodPayOk/main?flag=1'})
        } else {
         // wx.showToast({title: data.result.errMsg, icon: 'none'})
            wx.showToast({title: data.result.errMsg, icon: 'none'})
              if (data.result.errCode == 'PayError_002') { // 未设置支付密码
                setTimeout(function () {
                    wx.navigateTo({url: '/pages/pMe/setpayPassword/main'})
                }, 2000)
              }
        }
    },

    // 商品微信支付
    async beginWxPay () {
      let params = {
            orderId: this.orderId,
            paymentType: 1
        }
        console.log('beginPay params: ')
        console.log(params)
       // let data = await beginPay(params)
       let data = await wxGoodsPay(params)
        console.log(data)
        if (data.errCode == 'USER_200') {
                // 微信支付功能
            wx.requestPayment({
              timeStamp: data.result.result.timeStamp, // 后端返回
              nonceStr: data.result.result.nonceStr, // 后端返回
              package: data.result.result.package, // 统一下单接口返回的 prepay_id 参数 后端返回
              signType: 'MD5',
              paySign: data.result.result.paySign, // 签名 后端返回
              'success': function (res) {
                console.log(res)
                // 支付成功，进入支付成功页
                // wx.showToast({title: '支付成功', icon: 'none'})
                wx.navigateTo({url: '/pages/pIndex/goodPayOk/main'})
              },
              'fail': function (err) {
                console.log(err)
                // 支付失败，跳转订单页面
                wx.showToast({title: '支付失败', icon: 'none'})
              }
            })
        }
    },
    // VIP微信支付
    async beginWxVipPay () {
      let params = {
             payType: this.payType
        }
        console.log('beginWxVipPay params: ')
        console.log(params)
       // let data = await beginPay(params)
       let data = await wxPay(params)
        console.log(data)
        if (data.errCode == 'USER_200') {
                // 微信支付功能
            wx.requestPayment({
              timeStamp: data.result.result.timeStamp, // 后端返回
              nonceStr: data.result.result.nonceStr, // 后端返回
              package: data.result.result.package, // 统一下单接口返回的 prepay_id 参数 后端返回
              signType: 'MD5',
              paySign: data.result.result.paySign, // 签名 后端返回
              'success': function (res) {
                console.log(res)
                // 支付成功，进入支付成功页
                // wx.showToast({title: '支付成功', icon: 'none'})
                wx.navigateTo({url: '/pages/pIndex/goodPayOk/main?flag=1'})
              },
              'fail': function (err) {
                console.log(err)
                // 支付失败，跳转订单页面
                wx.showToast({title: '支付失败', icon: 'none'})
              }
            })
        }
    },
    // 合伙人微信支付
    async beginWxPartnerPay () {
      let params = {
            payType: this.payType,
            shopId: this.shopId
        }
        console.log('beginWxPartnerPay params: ')
        console.log(params)
       // let data = await beginPay(params)
       let data = await wxPartnerPay(params)
        console.log(data)
        if (data.errCode == 'USER_200') {
                // 微信支付功能
            wx.requestPayment({
              timeStamp: data.result.result.timeStamp, // 后端返回
              nonceStr: data.result.result.nonceStr, // 后端返回
              package: data.result.result.package, // 统一下单接口返回的 prepay_id 参数 后端返回
              signType: 'MD5',
              paySign: data.result.result.paySign, // 签名 后端返回
              'success': function (res) {
                console.log(res)
                // 支付成功，进入支付成功页
                // wx.showToast({title: '支付成功', icon: 'none'})
                wx.navigateTo({url: '/pages/pIndex/goodPayOk/main?flag=1'})
              },
              'fail': function (err) {
                console.log(err)
                // 支付失败，跳转订单页面
                wx.showToast({title: '支付失败', icon: 'none'})
              }
            })
        }
    },
     // 会员活动微信支付
    async beginWxCouponPay () {
      let params = {
            uId: 0,
            city: '',
            price: this.payMoney
        }
        console.log('beginWxCouponPay params: ')
        console.log(params)
       let data = await payWxCoupon(params)
        console.log(data)
        if (data.errCode == 'USER_200') {
          console.log('timestamp:')
          console.log(data.result.result.timeStamp)
                // 微信支付功能
            wx.requestPayment({
              timeStamp: data.result.result.timeStamp, // 后端返回
              nonceStr: data.result.result.nonceStr, // 后端返回
              package: data.result.result.package, // 统一下单接口返回的 prepay_id 参数 后端返回
              signType: 'MD5',
              paySign: data.result.result.paySign, // 签名 后端返回
              'success': function (res) {
                console.log(res)
                // 支付成功，进入支付成功页
                // wx.showToast({title: '支付成功', icon: 'none'})
                wx.navigateTo({url: '/pages/pIndex/goodPayOk/main'})
              },
              'fail': function (err) {
                console.log(err)
                // 支付失败，跳转订单页面
                wx.showToast({title: '支付失败', icon: 'none'})
              }
            })
        } else {
          wx.showToast({title: '系统失败', icon: 'none'})
        }
    },
    closePay () {
      this.showPay = false
    }
  }
}
</script>
<style  lang="less" scoped>
.container{
    color:@primary;
    background:@color-bg;
    width:100%;
    height:100vh;
    font-size:12px;
    .title{
        color:@grey;
        font-size:28rpx;
        padding:36rpx 0; 
    }
    .pay-amount{
        padding:30rpx;
        background: #fff;
        bottom:1rpx solid @line;
        text-align:center;
        width:100%;
        box-sizing: border-box;
        font-size:30rpx;
        .num{
            padding:40rpx 0;
            font-size:45rpx;  
        }
        .time{
            padding-top:30rpx;
            border-top:1rpx solid @line;
            font-size:26rpx;
            color:@grey;   
        }  

    }
    .pay-method{
        width:100%;
        .title{
            padding-left:30rpx;
        }
        .item-wrap{
            padding:0 30rpx;
            background: #fff;
            border-bottom:1rpx solid @line; 
            color:@grey;
            font-size:30rpx;
            box-sizing: border-box;
            .item{
                padding:50rpx 0;
                .item-img{
                    width:50rpx;
                    height:50rpx;
                    vertical-align: middle;
                }
                .item-name{
                    vertical-align: middle;
                    padding-left:30rpx;
                    padding-right:30rpx;
                }
                .item-award{
                    background: #FCEBCC;
                    border-radius: 25rpx;
                    display: inline;
                    padding:2rpx 20rpx;
                    font-size:30rpx;
                    color:@color-orange
                }
                .item-use{
                    padding-left:80rpx;
                    font-size:26rpx;
                    color:#333;
                }
                &:last-of-type{
                    border-top:1rpx solid @line
                }
            }  
        }
    }
    .pay-button{
        position: absolute;;
        bottom:0;
        width:100%;
        height:90rpx;
        line-height: 90rpx;
        background: @color-orange;
        color:#fff;
        font-size:30rpx;
        text-align:center;
    }
    .pay-dialog-wrap{
      text-align:center;
       position: relative;
      .close-img{
        position: absolute;
        top:44rpx;
        left:30rpx;
        width: 30rpx;
        height:30rpx;
      }
      .title{
        font-size:36rpx;
        text-align:center;
        padding:30rpx 0;
        border-bottom:1rpx solid @line;
        color:#333;
      }
      .amount-wrap{
        padding:120rpx 0;
        .amount{
         font-size:40rpx;
        }
      }
      .method{
        padding:0 30rpx;
      }
      .button{
        margin-top:150rpx;
        margin-bottom:30rpx;
        margin-left:30rpx;
        margin-right:30rpx;
        line-height:90rpx;
        height:90rpx;
        color:#fff;
        background: @color-orange
      }
    }
}
</style>