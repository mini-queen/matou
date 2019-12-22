
<template>
  <div class="member-center">
    <div class="user-shipment space-between">
      <div class="user-left">
        <img :src="member.mheadurl" alt="">
        <span class="nick">{{member.mnickname}}</span>
      </div>
      <div class="user-right">
        <div class="button" v-if="memberType == 'ordinary'">普通用户</div>
        <div class="user-info" v-if="memberType != 'ordinary'">
          <div class="member-msg">{{ showName }}</div>
          <div class="member-action" @click="gotoContinue">续费</div>
        </div>
        <div class="deadline" v-if="memberType != 'ordinary'">有效期截止时间：{{showtime}}</div>
      </div>
    </div>
    <div class="user-rights">
      <div class="rights-title">
        <img src="/static/images/crown-red.png" alt="">
        <span class="desp">尊享权益</span>
      </div>
      <div class="rights-item" v-for="(item,index) in diamondList" :key="index">
        <img src="/static/images/diamond.png" alt="">
        <span class="desp">{{item.name}}</span>
      </div>
      <div class="rights-item" v-for="(item,index) in collarList" :key="index" v-show="memberType != 'ordinary'">
        <img src="/static/images/collar.png" alt="">
        <span class="desp">{{item.name}}</span>
      </div>
    </div>
    <div class="extra-rights" v-if="memberType == 'vip'">
      <div class="rights-title">
        <img src="/static/images/crown-yellow.png" alt="">
        <span class="desp">升级店铺合伙人获得额外权益</span>
      </div>
      <div class="rights-item" v-for="(item,index) in cupList" :key="index">
        <img src="/static/images/cup.png" alt="">
        <span class="desp">{{item.name}}</span>
      </div>
    </div>
    <div class="extra-rights" v-if="memberType == 'ordinary'">
      <div class="rights-title">
        <img src="/static/images/crown-yellow.png" alt="">
        <span class="desp">升级VIP会员获得额外权益</span>
      </div>
      <div class="rights-item" v-for="(item,index) in collarList" :key="index">
        <img src="/static/images/collar.png" alt="">
        <span class="desp">{{item.name}}</span>
      </div>
    </div>
    <div class="shop-partner" v-if="memberType == 'ordinary'">
      <div class="partner-content space-between">
        <div class="desp" @click="payForVip">便利码头VIP会员</div>
        <div class="button" @click="payForVip">立即开通</div>
      </div>
    </div>
    <div class="extra-rights" v-if="memberType == 'ordinary'">
      <div class="rights-title">
        <img src="/static/images/crown-yellow.png" alt="">
        <span class="desp">升级店铺合伙人获得额外权益</span>
      </div>
      <div class="rights-item" v-for="(item,index) in collarList" :key="index">
        <img src="/static/images/collar.png" alt="">
        <span class="desp">{{item.name}}</span>
      </div>
      <div class="rights-item" v-for="(item,index) in cupList" :key="index">
        <img src="/static/images/cup.png" alt="">
        <span class="desp">{{item.name}}</span>
      </div>
    </div>
    <div class="shop-partner" v-if="memberType == 'vip' || memberType == 'ordinary'">
      <div class="partner-content space-between">
        <div class="desp">便利码头店铺合伙人</div>
        <div class="button" @click="goLookShops">浏览店铺</div>
      </div>
    </div>
    <div class="partner-upgrade" v-if="memberType == 'vip' || memberType == 'ordinary'">
      <div class="upgrade-title">
        升级店铺合伙人
      </div>
      <img src="https://sniu.2dian.com/xcx/static/matou/hehuoren.png" alt="" class="upgrade-img">
    </div>
  </div>
</template>
<script>
  import headerUser from '../common/headerUser'
  import {getMyAccount} from '../../../utils/api'
  export default {
    data () {
      return {
        member: '',
        showName: '', // 显示名称
        showtime: '', // 显示到期时间
        msg: '会员中心',
        memberType: 'partner', // vip-VIP会员 partner-合伙人  ordinary-普通用户
        diamondList: [ // 加入会员 推广文案
          { name: '折价购买0元购好物；' },
          { name: '快捷购买店铺及平台海量优质商品；' },
          { name: '用户专享活动：购买指定商品得奖励； ' },
          { name: '购买店铺商品，免配送费送到家；' }
        ],
        collarList: [ // 加入会员 推广文案
          { name: '浏览生活百科拆红包；' },
          { name: '邀请购买平台0元购商品得奖励；' },
          { name: '购买外卖商品及云店商品单单可得奖励；' }
        ],
        cupList: [ // 加入会员 推广文案
          { name: '直邀VIP会员按比例享会员费分成；' },
          { name: '邀请好友下单成功，单单可得邀请奖励；' }
        ]
      }
    },
    computed: {

    },
    components: {
      headerUser
    },
    onShow () {
      this.getMyAccount()
      let token = wx.getStorageSync('DIAN_TOKEN')
      setTimeout(() => {
        if (!token) {
        wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          }
      }, 1400)
    },
    mounted () {
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (!token) {
        wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
      }
    },
    onUnload () {
      this.member = ''
      this.memberType = ''
    },
    methods: {
      // 获取用户信息
      async getMyAccount () {
        var result = await getMyAccount()
        this.member = result.result.result.member
        console.log(result.result.result.member)
        // this.member.mVipFlag = 0 // 测试数据   0非会员
        // this.member.mPartnerFlag = 0 // 测试数据 0 非合伙人
        if (this.member.mVipFlag == 0 && this.member.mPartnerFlag == 0) {
          this.memberType = 'ordinary'
        } else if (this.member.mVipFlag == 1) {
          this.memberType = 'vip'
          this.showName = 'VIP会员'
          this.showtime = this.member.mVipExpiry
        } else if (this.member.mPartnerFlag == 1) {
           this.memberType = 'partner'
           this.showName = '合伙人'
           this.showtime = this.member.mPartnerExpiry
        }
        if (this.member.mPartnerFlag == 1) {
          this.showName = '合伙人'
          this.showtime = this.member.mPartnerExpiry
          this.memberType = 'partner'
        }
      },
       // 续费
       gotoContinue () {
         if (this.memberType == 'vip') {
           wx.navigateTo({
            url: '/pages/pEncyclopedia/member/joinVip/main'
          })
        } else if (this.memberType == 'partner') {
            wx.navigateTo({
            url: '/pages/pEncyclopedia/member/joinCopartner/main'
           })
        }
       },
      // 跳转浏览店铺
      goLookShops () {
          wx.navigateTo({url: `/pages/pOrder/shopListForpay/main?fromType=0`})
      },
      payForVip () {
      wx.navigateTo({
        url: '/pages/pEncyclopedia/member/joinVip/main'
      })
    }
    }
  }
</script>

<style lang="less" scoped>
.member-center {
  color: @primary;
  background-color: @color-bg;
  height: 100vh;
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
  .user-rights {
    margin-top: 20rpx;
    background-color: @color-white;
    padding: 30rpx 0 0rpx 30rpx;
    .rights-title {
      margin-bottom: 40rpx;
      img {
        width: 30rpx;
        height: 27rpx;
      }
      .desp {
        margin-left: 33rpx;
        font-size: 28rpx;
      }
    }
    .rights-item {
      padding-bottom: 30rpx;
      img {
        width: 27rpx;
        height: 22rpx;
        &.collar {
          width: 27rpx;
          height: 31rpx;
        }
      }
      .desp {
        color: @grey;
        margin-left: 33rpx;
        font-size: 24rpx;
      }
    }
  }
  .extra-rights {
    margin-top: 20rpx;
    background-color: @color-white;
    padding: 43rpx 0 0rpx 30rpx;
    .rights-title {
      margin-bottom: 40rpx;
      img {
        width: 31rpx;
        height: 26rpx;
      }
      .desp {
        margin-left: 33rpx;
        font-size: 28rpx;
      }
    }
    .rights-item {
      padding-bottom: 30rpx;
      img {
        width: 27rpx;
        height: 32rpx;
      }
      .desp {
        color: @grey;
        margin-left: 33rpx;
        font-size: 24rpx;
      }
    }
  }
  .shop-partner {
    margin-top: 40rpx;
    padding: 0 30rpx;
    .partner-content {
      padding: 38rpx 30rpx;
      align-items: center;
      background: url("https://sniu.2dian.com/xcx/static/matou/hehuobg.png");
      background-size: cover;
      .desp {
        font-size: 28rpx;
        font-weight:500;
      }
      .button {
        .btn--primary();
        width: 211rpx;
        height: 58rpx;
        line-height: 58rpx;
      }
    }
  }
  .partner-upgrade {
    margin-top: 40rpx;
    background-color: @color-white;
    padding: 40rpx 30rpx 50rpx;
    .upgrade-title {
      text-align: center;
      font-size: 28rpx;
      padding-bottom: 28rpx;
      border-bottom: 2px dashed @dashed;
      margin-bottom: 35rpx;
    }
    .upgrade-img {
      width: 690rpx;
      height: 103rpx;
    }
  }
}
</style>
