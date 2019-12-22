<template>
  <div class="container">
    <div class="msg" @click="goMsg">
      <img src="/static/images/message.png" alt="">
    </div>
    <div class="header">
      <div class="coverbox">
        <img class="cover" :src="userHeadpic" alt="" @click="doLogin">
        <div class="nickname">
          <div>{{member.mnickname}}</div>
          <!--  -->
          <div class="touguanbox" v-if="member.mPartnerFlag==1">合伙人
            <img class='touguan' style=" width: 13.5px;height: 13.5px;" src="https://sniu.2dian.com/xcx/static/matou/touguan.png" alt="">
          </div>
          <div class="touguanbox" v-else-if="member.sPartnerFlag !=1 && member.mVipFlag!=1" @click="doLogin">{{isLogin==true? '普通用户': '请先登录'}}
            <!-- <img class='touguan' style=" width: 13.5px;height: 13.5px;" src="https://sniu.2dian.com/xcx/static/matou/touguan.png" alt="">  -->
          </div>

          <div class="touguanbox" v-else-if="member.mVipFlag==1&&member.mPartnerFlag ==0">vip会员
            <img class='touguan' style=" width: 13.5px;height: 13.5px;" src="https://sniu.2dian.com/xcx/static/matou/touguan.png" alt="">
          </div>
          <!--  -->
        </div>
      </div>
      <div class="paycode">
        <div class="codebox" @click="goFunc(15)">
          <img src="https://sniu.2dian.com/xcx/static/matou/fukuan.png" alt="">付款码</div>
      </div>
    </div>
    <div class="orderbox">
      <div class="one" @click="goFunc(1)"><span>订单</span><span>查看全部订单</span> </div>
      <div class="two">
        <div class="icoCard" @click="goFunc(17,1)">
          <img style="width:44rpx;height:49rpx;" src="https://sniu.2dian.com/xcx/static/matou/daizhifu.png" alt="">
          <span>待支付</span>
        </div>
        <div class="icoCard" @click="goFunc(17, 2)">
          <img style="width:52rpx;height:46rpx;" src="https://sniu.2dian.com/xcx/static/matou/daishouhuo.png" alt="">
          <span>待收货</span>
        </div>
        <div class="icoCard" @click="goFunc(17, 3)">
          <img style="width:47rpx;height:47rpx;" src="https://sniu.2dian.com/xcx/static/matou/finish.png" alt="">
          <span>已完成</span>
        </div>
        <div class="icoCard" @click="goFunc(17, 4)">
          <img style="width:43rpx;height:47rpx;" src="https://sniu.2dian.com/xcx/static/matou/yiquxiao.png" alt="">
          <span>已取消</span>
        </div>
      </div>
    </div>
    <div class="list">
      <!--  -->
      <div class="one">
        <div class="smallCard" @click="goFunc(16)">
          <img src="http://sniu.2dian.com/xcx/static/matou/mali2.png" alt="">
          <span>码粒</span>
        </div>
        <div class="smallCard" @click="goFunc(13)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myMember.png" alt="">
          <span>会员中心</span>
        </div>
        <div class="smallCard" @click="goFunc(3)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myCoupon.png" alt="">
          <span>优惠券</span>
        </div>
        <div class="smallCard" @click="goFunc(4)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myCollect.png" alt="">
          <span>收藏</span>
        </div>
      </div>
      <div class="one">
        <div class="smallCard" @click="goFunc(5)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myChongzhi.png" alt="">
          <span>话费充值</span>
        </div>
        <div class="smallCard" @click="goFunc(55)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myHuoche.png" alt="">
          <span>火车票机票</span>
        </div>
        <div class="smallCard" @click="goFunc(6)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myActivity.png" alt="">
          <span>会员活动</span>
        </div>
        <div class="smallCard" @click="goFunc(7)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myAddress.png" alt="">
          <span>收货地址</span>
        </div>
      </div>
      <div class="one" v-if="PartnerFlag">
        <div class="smallCard" @click="goFunc(8)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myInvate.png" alt="">
          <span>邀请好友</span>
        </div>

        <div class="smallCard" @click="goFunc(10)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myService.png" alt="">
          <span>联系我们</span>
        </div>
        <div class="smallCard" @click="goFunc(11)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myKaidian.png" alt="">
          <span>轻松开店</span>
        </div>
        <div class="smallCard" @click="goFunc(20)">
          <img src="https://sniu.2dian.com/xcx/static/matou/myAddress.png" alt="">
          <span>商家入驻</span>
        </div>
      </div>
      <template v-if="!PartnerFlag">
       <!-- 非合伙人 -->

        <div class="one">
      <div class="smallCard" @click="goFunc(10)">
        <img src="https://sniu.2dian.com/xcx/static/matou/myService.png" alt="">
        <span>联系我们</span>
      </div>
      <div class="smallCard" @click="goFunc(11)">
        <img src="https://sniu.2dian.com/xcx/static/matou/myKaidian.png" alt="">
        <span>轻松开店</span>
      </div>
      <div class="smallCard" @click="goFunc(20)">
        <img src="https://sniu.2dian.com/xcx/static/matou/myAddress.png" alt="">
        <span>商家入驻</span>
      </div>
      <div class="smallCard" @click="goFunc(12)">
        <img src="https://sniu.2dian.com/xcx/static/matou/mySetting.png" alt="">
        <span>设置</span>
      </div>
    </div>
    <!--  -->
          
        
      </template>
     
    <div class="one" v-if="PartnerFlag">
      <div class="smallCard" @click="goFunc(12)">
        <img src="https://sniu.2dian.com/xcx/static/matou/mySetting.png" alt="">
        <span>设置</span>
      </div>
      <div class="smallCard" @click="goFunc(none)">
        <!-- <div class="smallCard" @click="goFunc(9)"> -->
        <!-- <img src="https://sniu.2dian.com/xcx/static/matou/myHehuo.png" alt="">
              <span>招募合伙人</span> -->
      </div>

      <div class="smallCard" @click="goFunc(none)">
        <!--占位-->
        <!-- <img src="https://sniu.2dian.com/xcx/static/matou/mySetting.png" alt=""> -->
        <!-- <span>商家入驻</span> -->
      </div>
      <div class="smallCard" @click="goFunc(none)">
        <!--占位-->
        <!-- <img src="https://sniu.2dian.com/xcx/static/matou/mySetting.png" alt=""> -->
        <!-- <span>设置</span> -->
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import { getMyAccount } from '../../utils/api'
export default {
  data () {
    return {
      userHeadpic: 'http://sniu.2dian.com/xcx/static/matou/defaultheadpic.png', // 用户头像
      member: '', // 用户信息
      mPartnerFlag: '', // 合伙人标识 0/1 否/是
      mVipFlag: '', // vip 标识 0 /1 否/ 是
      isLogin: false, // 是否登录标识
      PartnerFlag: '' // 合伙人标识 T/F
    }
  },
  computed: {

  },
  components: {

  },
  onShow () {
    let token = wx.getStorageSync('DIAN_TOKEN')
    // let userInfo = wx.getStorageSync('userInfo')
    //       setTimeout(() => {
    //     if (!token) {
    //     wx.navigateTo({
    //           url: '/pages/pIndex/login/main'
    //       })
    //       }
    //   }, 1400)
    if (token) {
      console.log('token exist')
      this.getMyAccount()
      this.isLogin = true
     // this.mPayPwd = userInfo.mPayPwd
    } else {
      console.log('token not exist')
    }
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
    this.member = []
    this.mPartnerFlag = ''
    this.mVipFlag = ''
  },
  methods: {
    // 跳转消息页
    goMsg () {
      wx.navigateTo({
        url: '/pages/pMe/message/main'
      })
    },
    // 获取用户信息
    async getMyAccount () {
      var result = await getMyAccount()
      this.member = result.result.result.member
      this.mPartnerFlag = this.member.mPartnerFlag
      this.mVipFlag = this.member.mVipFlag
      this.PartnerFlag = this.mPartnerFlag == 1
      this.userHeadpic = this.member.mheadurl
      console.log(this.member, this.mPartnerFlag)
    },
    // 登录
    doLogin () {
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (!token) {
        wx.navigateTo({
          url: '/pages/pIndex/login/main'
        })
      }
    },
    // 功能跳转
    goFunc (flag, index) {
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (!token) {
        wx.navigateTo({
          url: '/pages/pIndex/login/main'
        })
        return
      }
      if (flag == 1) { // 订单列表(全部)
        wx.navigateTo({
          url: '/pages/pIndex/orderList/main?currentIndex=0'
        })
      } else if (flag == 2) { // 推广邀请
        wx.navigateTo({
          url: '/pages/pMe/Extension/main'
        })
      } else if (flag == 3) { // 优惠券
        wx.navigateTo({
          url: '/pages/pMe/CouponList/main'
        })
      } else if (flag == 4) { // 收藏
        wx.navigateTo({
          url: '/pages/pMe/collectList/main'
        })
      } else if (flag == 5) { // 话费充值
        wx.navigateTo({
          url: '/pages/pMe/systemUpgradeHF/main?name=话费充值'
        })
      } else if (flag == 55) { // 火车票
        wx.navigateTo({
          url: '/pages/pMe/systemUpgradeHF/main?name=火车票机票'
        })
      } else if (flag == 6) { // 会员活动
        wx.navigateTo({
          url: '/pages/pEncyclopedia/memberActivity/main?name='
        })
      } else if (flag == 7) { // 地址
        wx.navigateTo({
          url: '/pages/pMe/addressList/main'
        })
      } else if (flag == 8) { // 邀请好友
        wx.navigateTo({
          url: '/pages/pMe/Extension/main'
        })
      } else if (flag == 9) { // 招募合伙人
        wx.navigateTo({
          url: '/pages/pMe/ExtensionPartner/main'
        })
      } else if (flag == 10) { // 联系我们
        wx.navigateTo({
          url: '/pages/pMe/contactUs/main'
        })
      } else if (flag == 11) { // 轻松开店
        wx.navigateTo({
          url: '/pages/pMe/kaidian/main'
        })
      } else if (flag == 12) { // 我的设置
        wx.navigateTo({
          url: '/pages/pMe/setting/main'
        })
      } else if (flag == 13) { // 会员中心
        wx.switchTab({
          url: '/pages/member/detail/main'
        })
      } if (flag == 15) { // 付款码
        wx.navigateTo({
          url: '/pages/pOrder/payCode/main'
        })
      } if (flag == 16) { // 码粒
        wx.navigateTo({
          url: '/pages/pOrder/maLi/main'
        })
      } if (flag == 17) { // 订单列表(状态列表)
        wx.navigateTo({
          url: '/pages/pIndex/orderList/main?currentIndex=' + index
        })
      } if (flag == 20) { // 商家入驻
        wx.navigateTo({
          url: '/pages/pOrder/shopJoinInfo/main'
        })
      }
    }
  }
}
</script>

<style lang="less" scope>
page {
  background-color: #f7f7f7;
}
.container {
  color: @primary;
  font-size: @fs44;
  position: relative;
  .msg{
    position: absolute;
    top: 3px;
    left: 30rpx;
    img{
      width: 46rpx;
      height: 46rpx
    }
  }
  .header {
    width: 100%;
    height: 174px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    padding: 0 15px;
    box-sizing: border-box;
    background: #fe6a00;
    .coverbox {
      width: 70%;
      height: 174px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .cover {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 30px;
        vertical-align: middle;
        margin-right: 20px;
      }
      .nickname {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        .touguanbox {
          position: relative;
          width: 58px;
          height: 16px;
          border-radius: 8px;
          background-color: #fff;
          font-size: 10px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(246, 179, 10, 1);
          text-align: center;
          line-height: 16px;
          margin-top: 5px;
          .touguan {
            position: absolute;
            top: -6.25px;
            left: -6.25px;
          }
        }
      }
    }
    .paycode {
      width: 30%;
      height: 174px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .codebox {
        text-align: center;
        height: 35px;
        width: 90px;
        border-radius: 17.5px;
        line-height: 35px;
        background-color: #ffffff;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(254, 106, 0, 1);
        img {
          width: 20px;
          height: 20px;
          vertical-align: middle;
          margin-right: 4px;
        }
      }
    }
  }
  .orderbox {
    width: 345px;
    height: 141px;
    position: absolute;
    top: 140px;
    left: 15px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0 10px;
    box-sizing: border-box;

    .one {
      width: 100%;
      height: 100px;
      line-height: 57px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      span:first-child {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      span:last-child {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(120, 120, 120, 1);
        box-sizing: border-box;
      }
    }
    .two {
      width: 100%;
      height: 93.5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 20px 0px 20px 0px;
      .icoCard {
        width: 50px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: center;
        text-align: center;
        img {
          width: 22px;
          height: 24px;
          margin: 0 auto;
        }
        span {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
  .list {
    margin: 0 auto;
    width: 345px;
    min-height: 360px;
    margin-top: 115px;
    margin-bottom: 20px;
    padding: 27.5px 0px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: flex-start;
    border-radius: 10px;
    background-color: #fff;
    .one {
      width: 100%;
      // height:
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 25px;
      &:last-child {
        margin: 0;
      }
      .smallCard {
        width: 60px;
        height: 60px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        img {
          width: 30px;
          height: 30px;
          margin: 0 auto;
        }
        span {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
}
</style>
