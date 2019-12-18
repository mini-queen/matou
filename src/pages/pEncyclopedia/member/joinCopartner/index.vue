
<template>
  <div class="container">
    <div class="user-shipment space-between">
      <div class="user-left">
        <img :src="member.mheadurl" alt="">
        <span class="nick">{{member.mnickname}}</span>
      </div>
      <div class="user-right">
        <div class="button" v-if="memberType == 'ordinary'">普通用户</div>
        <div class="user-info" v-if="memberType != 'ordinary'">
          <div class="member-msg">{{ memberType == 'vip' ? 'VIP会员':'合伙人' }}</div>
          <!-- <div class="member-action">续费</div> -->
        </div>
        <!-- <div class="deadline" v-if="memberType != 'ordinary'">有效期截止时间：{{member.mVipExpiry}}</div> -->
      </div>
    </div>
    <div class="section">
      <img class="title-img" src="https://sniu.2dian.com/xcx/static/matou/hehuoquanyi.png" alt="">
      <div class="flex">
        <div class="item" v-for="(item,index) in qyList" :key="index">
          <img class="item-img" :src="item.url" alt="">
          <div class="item-name">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="section flex">
      <div class="pay-item " :class="{active:activeIndex == index}" v-for="(item,index) in payList" :key="index" @click="getActiveIndex(index)">
        <div class="pay-title">{{item.title}}</div>
        <div class="pay-num"> ¥{{item.num}}</div>
        <div class="org-num" v-if="item.orgNum"> ¥{{item.orgNum}}</div>
        <div class="org-num" v-else>{{'会员费'}}</div>
        <img class="yh-img" src="https://sniu.2dian.com/xcx/static/matou/yh.png" alt="" v-if="index != 2">
      </div>
    </div>
    <div class="section" style="background:#f7f7f7">
      <div class="pay-button" @click="payForPartner">立即缴费</div>
      <div class="tip">
        <div class="checkout unselect" v-if="!agreed" @click="agreed = true"></div>
        <image class="checkout selected" v-else @click="agreed = false" src="/static/images/selected.png">
        </image>阅读并同意 <span class="orange" @click="agreement">《便利码头会员服务条款》</span>
      </div>
    </div>
    <div class="section">
      <!-- <div class="bottom flex">
        店铺
        <div>
          晟天便利鹏润花园店
          <div  class="time-tip">(有效期截止：2023-09-19)</div>
        </div>
      </div> -->
      <div class="bottom flex">
        店铺
        <div class="shopAnnuity">
          <div>{{shopName}}</div>
          <div>(店铺有效期截至: {{sAnnuityExpiry}})</div>
        </div>

      </div>
      <div class="bottom flex">
        生效时间
        <div>支付成功后立即生效</div>
      </div>
      <div class="bottom flex">
        有效截止时间
        <div>{{mPartnerExpiry}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import headerUser from '../common/headerUser'
import { getMyAccount, getPartnerInfo } from '../../../../utils/api'
export default {
  components: { headerUser },
  data () {
    return {
      member: '',
      shopInfo: {},
      memberType: '',
      mPartnerExpiry: '',
      PriceVipPay: [// 开通付费时间
        'MEMBER_PARTNER_YEAR3_PRICE', // (开通3年)
        'MEMBER_PARTNER_YEAR2_PRICE', // (开通2年)
        'MEMBER_PARTNER_YEAR1_PRICE'// (开通1年 )

      ],
      payMoney: 333,
      shopId: 0,
      shopName: '',
      sAnnuityExpiry: '',
      VipPay: 'MEMBER_PARTNER_YEAR3_PRICE', // 用户选择的结果
      // msg: '加入vip'
      agreed: false,
      qyList: [{
        url: 'https://sniu.2dian.com/xcx/static/matou/qy1.png',
        name: '分享下单拿红包'
      }, {
        url: 'https://sniu.2dian.com/xcx/static/matou/qy2.png',
        name: '直邀会员享分成'
      }, {
        url: 'https://sniu.2dian.com/xcx/static/matou/qy3.png',
        name: '自购即可得奖励'
      }, {
        url: 'https://sniu.2dian.com/xcx/static/matou/qy1.png',
        name: '邀请好友0元购'
      }],
      activeIndex: 0,
      payList: [{
        title: '开通三年',
        num: 333,
        orgNum: 546
      }, {
        title: '开通两年',
        num: 288,
        orgNum: 364
      }, {
        title: '开通一年',
        num: 182
      }]
    }
  },

  onLoad (option) {
    this.shopId = option.shopId
    this.shopName = option.shopName
    console.log('shopId in join Parter page : ' + this.shopId)
    this.getPartnerInfo()
  },
  computed: {
  },
  mounted () {
    this.getMyAccount()
  },
  onUnload () {
    this.activeIndex = 0
    this.payMoney = 333
    this.shopName = ''
    this.agreed = false
  },
  methods: {
    agreement () { // 跳转协议
      wx.navigateTo({
        url: '/pages/pEncyclopedia/Agreement/main?agreePage=me'
      })
    },
    async getMyAccount () {
      var result = await getMyAccount()
      this.member = result.result.result.member
      this.shopInfo = result.result.result.shop
      this.shopName = result.result.result.shop.sTitle
      // this.sAnnuityExpiry =result.result.result
      console.log(result.result.result.shop, 'shop')
      // this.member.mVipFlag = 0 // 测试数据   0非会员
      // this.member.mPartnerFlag = 0 // 测试数据 0 非合伙人
      if (this.member.mVipFlag == 0 && this.member.mPartnerFlag == 0) {
        this.memberType = 'ordinary'
        var now = new Date()
        var year = now.getFullYear()
        var month = now.getMonth() + 1
        var date = now.getDate()
        this.member.mPartnerExpiry = year + '-' + month + '-' + date
        let newYear = Number(year) + 3
        this.mPartnerExpiry = newYear + this.member.mPartnerExpiry.slice(4)
      } else if (this.member.mPartnerFlag == 1) {
        this.memberType = 'Partner'
        if (this.member.mPartnerExpiry == '') {
          var now2 = new Date()
          var year2 = now2.getFullYear()
          var month2 = now2.getMonth() + 1
          var date2 = now2.getDate()
          this.member.mPartnerExpiry = year2 + '-' + month2 + '-' + date2
          let newYear2 = Number(year2) + 3
          this.mPartnerExpiry = newYear2 + this.member.mPartnerExpiry.slice(4)
        } else {
          this.mPartnerExpiry = this.member.mPartnerExpiry.slice(0, 3) + 3 + this.member.mPartnerExpiry.slice(4)
        }
      } else if (this.member.mVipFlag == 1) {
        this.memberType = 'vip'
        if (this.member.mPartnerExpiry == '') {
          var now3 = new Date()
          var year3 = now3.getFullYear()
          var month3 = now3.getMonth() + 1
          var date3 = now3.getDate()
          this.member.mPartnerExpiry = year3 + '-' + month3 + '-' + date3
          let newYear3 = Number(year3) + 3
          this.mPartnerExpiry = newYear3 + this.member.mPartnerExpiry.slice(4)
        } else {
          this.mPartnerExpiry = this.member.mPartnerExpiry.slice(0, 3) + 3 + this.member.mPartnerExpiry.slice(4)
        }
      }
      console.log('memberType: ', this.memberType)
    },

    async getPartnerInfo () {
      var result = await getMyAccount()

      var sId = result.result.result.shop.sId
      console.log(sId, 'sID')
      var res = await getPartnerInfo({ sId })
      this.sAnnuityExpiry = res.result.result.sAnnuityExpiry
      console.log(res)
    },
    getActiveIndex (e) {
      this.VipPay = this.PriceVipPay[e]
      this.payMoney = this.payList[e].num
      this.activeIndex = e
      var mPartnerExpiry = this.member.mPartnerExpiry
      // mPartnerExpiry = mPartnerExpiry.slice(0, 3)

      if (e == 0) {
        var year1 = Number(mPartnerExpiry.slice(0, 4)) + 3
        this.mPartnerExpiry = year1 + this.member.mPartnerExpiry.slice(4)
      } else if (e == 1) {
        var year2 = Number(mPartnerExpiry.slice(0, 4)) + 2
        this.mPartnerExpiry = year2 + this.member.mPartnerExpiry.slice(4)
      } else {
        var year3 = Number(mPartnerExpiry.slice(0, 4)) + 1
        this.mPartnerExpiry = year3 + this.member.mPartnerExpiry.slice(4)
      }
    },
    agree () {
      if (this.agreed == false) {
        wx.showToast({
          title: '请阅读并同意相关协议,谢谢.',
          icon: 'none',
          duration: 2000
        })
        return false
      } else {
        return true
      }
    },
    payForPartner () {
      if (this.agree()) {
        if (!this.shopId) {
          this.shopId = this.shopInfo.sId
        }
        console.log('shopId: ', this.shopId)
        // 如果勾选 跳转支付
        console.log('pass')
        wx.navigateTo({ url: `/pages/pIndex/goodPay/main?shopId=${this.shopId}&payType=${this.VipPay}&payFlag=parterPay&payMoney=${this.payMoney}` })
      } else {
        console.log('未勾选')
      }
    }
  }

}
</script>

<style lang="less" scoped>
.shopAnnuity {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  div:last-child{
    color: #787878;
    font-size: 12px;
  }
}
.container {
  color: @primary;
  font-size: @fs44;
  width: 100%;
  padding: 0;
  background: #f7f7f7;
  padding-bottom: 30rpx;
  font-size: 12px;
  .checkout {
    display: inline-block;
    width: 30rpx;
    height: 30rpx;
    border: 2rpx solid @line;
    vertical-align: middle;
    margin-right: 10rpx;
    .selected {
      border: none;
    }
  }
  .user-shipment {
    // width: 100%;
    padding: 16rpx 30rpx;
    background: url('https://sniu.2dian.com/xcx/static/matou/memberbg.png');
    background-size: cover;
    .user-left {
      display: flex;
      align-items: center;
      img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
      }
      .nick {
        margin-left: 37rpx;
        color: @color-white;
        font-size: 36rpx;
      }
    }
    .user-right {
      padding-top: 40rpx;
      // padding-right: 30rpx;
      .button {
        .btn--primary();
        width: 126rpx;
        height: 44rpx;
        line-height: 44rpx;
        font-size: 20rpx;
        border-radius: 22rpx;
        background: @color-yellow;
      }
      .user-info {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .member-msg {
          width: 130rpx;
          height: 60rpx;
          background: url('https://sniu.2dian.com/xcx/static/matou/vip.png');
          background-size: cover;
          font-size: 20rpx;
          color: @color-white;
          text-align: center;
          box-sizing: border-box;
          padding-top: 22rpx;
          padding-left: 22rpx;
          margin-bottom: 12rpx;
        }
        .member-action {
          .btn--default();
          width: 82rpx;
          height: 42rpx;
          line-height: 42rpx;
          border-radius: 21rpx;
          margin-left: 30rpx;
        }
      }
      .deadline {
        margin-top: 18rpx;
        font-size: 20rpx;
        color: @color-white;
      }
    }
  }
  .orange {
    color: @color-orange;
  }
  .section {
    box-sizing: border-box;
    width: 100%;
    margin-top: 20rpx;
    padding: 0 30rpx;
    text-align: center;
    background: #fff;
    .title-img {
      margin-top: 36rpx;
      width: 332rpx;
      height: 28rpx;
    }
    .item {
      width: 95rpx;
      margin-top: 60rpx;
      .item-img {
        width: 95rpx;
        height: 110rpx;
      }
      .item-name {
        margin-top: 10rpx;
        margin-bottom: 30rpx;
        font-size: 22rpx;
      }
    }
    .pay-item {
      margin-top: 30rpx;
      margin-bottom: 30rpx;
      width: 210rpx;
      padding: 50rpx 0 70rpx;
      text-align: center;
      border: 2rpx solid #e5e5e5;
      border-radius: 20rpx;
      font-size: 28rpx;
      position: relative;
      &.active {
        background: #f8ecd5;
      }
      .yh-img {
        position: absolute;
        top: -8rpx;
        left: 0;
        width: 57rpx;
        height: 57rpx;
      }
      // .pay-title{
      // }
      .pay-num {
        font-size: 48rpx;
        margin-top: 45rpx;
        margin-bottom: 25rpx;
        color: @color-orange;
      }
      .org-num {
        color: #787878;
        text-decoration: line-through;
      }
    }
    .pay-button {
      height: 90rpx;
      line-height: 90rpx;
      color: #fff;
      font-size: 30rpx;
      background: #fe6a00;
      margin-top: 60rpx;
      border-radius: 10rpx;
    }
    .tip {
      margin-top: 30rpx;
      margin-bottom: 48rpx;
    }
    .bottom {
      margin-left: 5rpx;
      margin-right: 5rpx;
      box-sizing: border-box;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #e5e5e5;
      &:last-of-type {
        border-bottom: none;
      }
    }
    .time-tip {
      color: #787878;
      padding-top: 10rpx;
    }
  }
}
</style>
