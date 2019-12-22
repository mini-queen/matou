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
    <!-- <header-user :userType='Type' :avatorImg='member.mheadurl' :nick="member.mnickname"></header-user> -->
     <div class="section">
      <img class="title-img" src="https://sniu.2dian.com/xcx/static/matou/hyqy.png" alt="">
      <div class="flex">
        <div class="item" v-for="(item,index) in qyList" :key="index">
          <img class="item-img" :src="item.url" alt="">
          <div class="item-name">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="section flex">
        <div class="pay-item" :class="{active:activeIndex ==index?true:false}" v-for="(item,index) in payList" :key="index" @click="getActiveIndex(index)">
          <!-- activeIndex = index -->
          <div class="pay-title">{{item.title}}</div>
          <div class="pay-num"> ¥{{item.num}}</div>
          <div class="org-num" v-if="item.orgNum"> ¥{{item.orgNum}}</div>
          <div class="" v-else>{{'会员费'}}</div>
          <img class="yh-img" src="https://sniu.2dian.com/xcx/static/matou/yh.png" alt="" v-if="index !=2">
        </div>
    </div>
    <div class="section" style="background:#f7f7f7">
      <div class="pay-button" @click="payForVip">立即缴费</div>
      <div class="tip">
        <div class="checkout unselect" v-if="!agreed" @click="agreed = true"></div> 
        <image class="checkout selected" v-else  @click="agreed = false"  src="/static/images/selected.png"></image>
         阅读并同意 <span class="orange" @click="agreement">《便利码头会员服务条款》</span>
      </div>
    </div>
    <div class="section" >
      <div class="bottom flex">
        生效日期<div>支付成功后立即生效</div>
      </div>
       <div class="bottom flex">
       有效截止时间<div>{{mVipExpiry}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import headerUser from '../common/headerUser'
  import {getMyAccount} from '../../../../utils/api'
export default {
  components: {headerUser},
  data () {
    return {
      // Type: '', // 0 普通 1会员 3合伙人
      // msg: '加入vip'
      memberType: '',
      PriceVipPay: [// 开通付费时间
        'MEMBER_VIP_YEAR3_PRICE', // (开通3年)
        'MEMBER_VIP_YEAR2_PRICE', // (开通2年)
       'MEMBER_VIP_YEAR1_PRICE'// (开通1年 )

      ],
      payMoney: 66.6,
      VipPay: 'MEMBER_VIP_YEAR3_PRICE', // 用户选择的结果
      mVipExpiry: '',
      agreed: false,
      myPhone: '', // 用户手机号
      member: '',
      activeIndex: 0,
      qyList: [{
        url: 'https://sniu.2dian.com/xcx/static/matou/baike2.png',
        name: '读百科抢红包'
      }, {
        url: 'https://sniu.2dian.com/xcx/static/matou/qy3.png',
        name: '自购即可得奖励'
      }, {
        url: 'https://sniu.2dian.com/xcx/static/matou/qy4.png',
        name: '邀请好友0元购'
      }],
      payList: [{
        title: '开通三年',
        num: 66.6,
        orgNum: 109.5
      }, {
        title: '开通两年',
        num: 58.8,
        orgNum: 73
      }, {
        title: '开通一年',
        num: 36.5
      }]
    }
  },
  computed: {
  },
  onShow () {
    this.getMyAccount()
  },
  mounted () {

  },
  onUnload () {
    this.activeIndex = 0
    this.payMoney = 66.6
    this.VipPay = 'MEMBER_VIP_YEAR3_PRICE'
    this.mVipExpiry = ''
    this.agreed = false
    this.myPhone = ''
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
        this.myPhone = result.result.result.member.mphone
        // console.log(result.result.result.member)
        // this.member.mVipFlag = 0 // 测试数据   0非会员
        // this.member.mPartnerFlag = 0 // 测试数据 0 非合伙人
        if (this.member.mVipFlag == 0 && this.member.mPartnerFlag == 0) {
          this.memberType = 'ordinary'
          var now = new Date()
          var addYear = 0
          if (this.activeIndex == 0) {
            addYear = 3
          } else if (this.activeIndex == 1) {
            addYear = 2
          } else if (this.activeIndex == 2) {
            addYear = 1
          }
          var year = now.getFullYear()
          var month = now.getMonth() + 1
          var date = now.getDate()
          this.member.mVipExpiry = year + '-' + month + '-' + date
          let newYear = Number(year) + addYear
          this.mVipExpiry = newYear + this.member.mVipExpiry.slice(4)
        } else if (this.member.mVipFlag == 1) {
          this.memberType = 'vip'
           this.mVipExpiry = this.member.mVipExpiry.slice(0, 3) + 3 + this.member.mVipExpiry.slice(4) // 默认付款三年
        } else if (this.member.mPartnerFlag == 1) {
           this.memberType = 'Partner'
           this.mVipExpiry = this.member.mVipExpiry.slice(0, 3) + 3 + this.member.mVipExpiry.slice(4) // 默认付款三年
        }
      },
      getActiveIndex (e) {
        this.VipPay = this.PriceVipPay[e]
        this.payMoney = this.payList[e].num
        this.activeIndex = e
        var mVipExpiry = this.member.mVipExpiry
        // mVipExpiry = mVipExpiry.slice(0, 3)
        if (e == 0) {
          // this.mVipExpiry = mVipExpiry + 3 + this.member.mVipExpiry.slice(4)
          var year1 = Number(mVipExpiry.slice(0, 4)) + 3
          this.mVipExpiry = year1 + this.member.mVipExpiry.slice(4)
        } else if (e == 1) {
           // this.mVipExpiry = mVipExpiry + 2 + this.member.mVipExpiry.slice(4)
          var year2 = Number(mVipExpiry.slice(0, 4)) + 2
          this.mVipExpiry = year2 + this.member.mVipExpiry.slice(4)
        } else {
          var year3 = Number(mVipExpiry.slice(0, 4)) + 1
          this.mVipExpiry = year3 + this.member.mVipExpiry.slice(4)
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
   payForVip () {
     if (!this.myPhone) { // 如果没有绑定手机号跳转到绑定手机号页面
            wx.navigateTo({
                url: '/pages/pMe/bindPhone/main'
            })
            return
        }
     if (this.agree()) {
      // 如果勾选 跳转支付
      wx.navigateTo({url: `/pages/pIndex/goodPay/main?payType=${this.VipPay}&payFlag=vipPay&payMoney=${this.payMoney}`})
     }
   }
  }
}
</script>

<style lang="less" scoped>
.container {
  color: @primary;
  font-size: @fs44;
  width:100%;
  padding:0; 
  background:#f7f7f7;
  padding-bottom:30rpx;
  font-size:12px;
  .checkout{
    display: inline-block;
    width:30rpx;
    height:30rpx;
    border:1rpx solid @line;
    vertical-align: middle;
    margin-right:10rpx;
    .selected{
      border:none;
    }
  }
    .user-shipment {
    // width: 100%;
    padding: 16rpx 30rpx;
    background: url("https://sniu.2dian.com/xcx/static/matou/memberbg.png");
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
          background: url("https://sniu.2dian.com/xcx/static/matou/vip.png");
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
  .orange{
    color:@color-orange
  }
   .section{
    box-sizing: border-box;
    width:100%;
    margin-top:20rpx;
    padding:0 30rpx;
    text-align:center;
    background: #fff;
    .title-img{
      margin-top:36rpx;
      width:332rpx;
      height:28rpx;
    }
    .item{
      flex-grow: 1;
       width:95rpx;
       margin-top:60rpx;
        .item-img{
          width:95rpx;
          height:110rpx;
        }
        .item-name{
          margin-top:10rpx;
          margin-bottom:30rpx;
          font-size:22rpx;
        }
    }
    .pay-item{
      margin-top:30rpx;
      margin-bottom:30rpx;
      width:210rpx;
      padding:50rpx 0 70rpx;
      text-align:center;
      border:2rpx solid #e5e5e5;
      border-radius: 20rpx;
      font-size:28rpx;
      position: relative;
      &.active{
        background:#F8ECD5; 
      }
      .yh-img{
        position: absolute;
        top:-8rpx;
        left:0;
        width:57rpx;
        height:57rpx; 
      }
      // .pay-title{
      // }
      .pay-num{
        font-size:48rpx;
        margin-top:45rpx;
        margin-bottom:25rpx;
        color:@color-orange
      }
      .org-num{
        color:#787878;
        text-decoration: line-through
      }
    }
    .pay-button{
      height:90rpx;
      line-height:90rpx;
      color:#fff;
      font-size: 30rpx;
      background: #FE6A00;
      margin-top:60rpx;
      border-radius: 10rpx;
    }
    .tip{
      margin-top:30rpx;
      margin-bottom:48rpx;
    }
    .bottom{
      margin-left:5rpx;
      margin-right:5rpx;
      box-sizing: border-box;
      padding:30rpx 0;
      border-bottom:1rpx solid #e5e5e5;
      &:last-of-type{
        border-bottom:none
      }
    }
    .time-tip{
      color:#787878;
      padding-top:10rpx;
    }
  }
}

</style>
