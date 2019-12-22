<template>
<div class="container" >
    <div class="title">
      {{readInfo.title}}
    </div> 
    <div class="tip-wrap" >
      <span>{{readInfo.pubDateStr}}</span>
      <!-- <span class="read-num">{{readInfo.readTimes || 0}}阅读</span> -->
    </div>
    <!-- <div class="content"> 
      <p class="section">
        醋可以增进食欲，促进胃酸的分泌，所以吃了加醋的食物，食欲会大增。同时食醋还可以减少盐的摄入量，让食物更有味道，有效降低罹患高血压等心脑血管疾病的风险。
      </p>
      <p class="section">
        另外，食醋作为维C的保护剂，可以使食物中的水溶性维生素的化学结构更稳定，使其不易因烹煮而遭到分解，减少亚硝酸盐的产生，更好的保护维C不被破坏。
         当然食醋在食物的去腥、杀菌、提鲜方面，也有其独特的优势。这看似不起眼的一点点醋，往往会让我们的饮食锦上添花，吃出健康。 
      </p>
      <p>喝醋真的能软化血管吗？答案肯定是：不能！</p>
      <p class="section">
        据调查，我国60岁以上的老人中，有八成以上患有不同程度的“动脉硬化”，于是各种“软化血管”、“检测血管健康”的小妙招四处传播开来，让很多老人深信不疑。                    
      </p>
      <p class="section">
        首先，对于生理年龄增高造成的动脉硬化，绝不能用什么喝醋、吃醋蛋、柠檬水、姜汁等“妙方”治疗动脉硬化。
      </p>
      <p class="section">
        其次，对于已经造成动脉硬化的病人，即使吃遍所有偏方，用尽洪荒之力也不可能将其软化。即便是一些还没有钙化的斑块，也只有极少数人能够通过改善生活方式和服用他汀类药物，使斑块回缩。可以说，能稳定住不让其发展，就已经做的非常好了。
      </p>
    </div> --> 
    <div class="content" :class="token? '' : 'nologin'">
      <wxParse :content="readInfo.detail"/>
      <div v-if="token==''" @click="loginIn" class='btn'><img src="https://sniu.2dian.com/xcx/static/matou/hongbao2.png" alt=""> 继续阅读领红包<img src="/static/images/arrow_down.png" alt=""></div>
    </div>
    <div class="operate flex">
        <div @click="follow" v-if="isFollow ==0">
          <image src="/static/images/favorite.png"></image><span>收藏</span>
        </div>
        <div @click="follow" v-else>
          <image src="/static/images/shoucang_selected.png"></image><span>收藏</span>
        </div>
        <div @click="like" v-if="isLike==0">
          <image src="https://sniu.2dian.com/xcx/static/matou/zanno.png"></image><span>点赞</span>
        </div>
          <div @click="like" v-else>
          <image src="/static/images/dianzan_selected.png"></image><span>点赞</span>
        </div>
        <div>
           <button open-type='share' class="btnShare">
          <image src="/static/images/share.png"></image><span>分享</span>
        </button>
        </div>
       

    </div>
    <div class="recommend-wrap" v-if="isShowBottomShop">
      <div class="recommend">
          <div class="title">
            <image class="good-img" src="/static/images/tuijian.png"></image>好店推荐
          </div>
         <div class="item-wrap flex">
          <image class="item-img" :src="baseUrl+shopInfo.sPic"></image>
          <div>
            <div class="item-name"> {{shopInfo.gTitle}}</div>
            <div class="item-tip flex">月售{{shopInfo.orderNumMonth}}单 <span>{{shopInfo.dis_m}}m</span></div>
            <div class="item-tip">{{' '+shopInfo.sBasicCharge+'起送 | 10km内免费配送'}}</div>
            <div class="item-tip ">
              <span class="item-label" v-for="(item,index) in shopInfo.sLabel" :key="index">{{item}}</span>
            </div> 
          </div>
        </div>
      </div>
    </div>
    <!-- vip红包 -->
    <image class="vip-red-packet" v-if="isVip" @click="gotoMember" src="https://sniu.2dian.com/xcx/static/matou/receivered.png"></image>
    <!-- 登录弹窗 -->
    <div class="login-tip-dialog modal-mask" catchtouchmove="true" v-if="showLoginDialog">
        <div class="modal-content">
          <div class="header">
              温馨提示
            <image class="close-img" src="/static/images/close.png" @click="showLoginDialog = false"></image>
          </div>
          <div class="content">
              登录后浏览生活百科能领红包赚返利，边看边赚，快点登录吧！
          </div>
          <div class="footer">
              <div class="login-button" @click="loginIn">立即登录领红包</div>
          </div>
        </div>
    </div> 
    <!-- 红包弹层 -->
    <div class="red-wrapper" :catchtouchmove="true" v-if="showRedGet">
      <div class="red get" @click="encyRedGet">
        <div class="tip">领红包</div>
      </div>
    </div>
    <div class="red-wrapper" :catchtouchmove="true" v-if="showRed" @click="showRed = false">
      <div class="red" @click.capture="()=>{return false}">
        <div class="tip">红包到账</div>
        <div class="amount">￥{{redMoney}}</div>
      </div>
    </div>
    <!-- 跳转到VIP弹层 -->
    <div class="red-wrapper" :catchtouchmove="true" v-if="showGotoVip" @click="showGotoVip = false">
      <div class="red" @click.capture="()=>{return false}">
        <div class="tip" @click="gotoMember">开通会员领红包>></div>
      </div>
    </div>
</div>
</template>
<script>
import { getEncyListDetail, encyLike, encyFollow, encyRedFinish, encyRedJudge, encyRedGet, getMyAccount } from '@/utils/api'
import wxParse from 'mpvue-wxparse'
 export default {
   data () {
     return {
       token: '',
      //  msg: '',
       publicShare: this.$publicShare,
       isShowBottomShop: false, // 是否显示底部商家
       title: ' 健康科普：喝醋能软化血管这些谣言，你中招了吗？', // 标题
       release_time: '2019-09-10', // 文章时间
       reading_num: 1000, // 阅读时长
       showLoginDialog: false, // 显示登录提示
       endTimeFlag: false, // 是否到达阅读限时
       baseUrl: this.$baseUrl,
       smallexpireTime: 15, // 计时器 阅读时长
       riId: '', // 红包ID
       readInfo: {}, // 文章相关
       shopInfo: {}, // 推荐店铺相关
       rmrId: '',
       isBottom: false,
      //  time: -1,
       showRed: false, // 显示红包
       showRedGet: false, // 是否获得红包
       redMoney: 0, // 红包金额
       isFollow: 0, // 是否收藏
       isLike: 0, // 是否点赞
       isVip: false, // 是否vip
       memberInfo: {}, // 用户信息
       isCanGetPackage: false, // 是否有可以获得红包的资格
       showGotoVip: false, // 是否显示加入vip
       myPhone: '', // 用户手机号
       isCanShowTips: false // 是否显示提示
     }
   },
   computed: {

   },
   components: {
     wxParse
   },
   mounted () {
     this.isBottom = false
     const { riId, rcId } = this.$root.$mp.query
     console.log('riid in mounted: ')
     this.riId = riId
     console.log(this.riId)
     this.getData(riId, rcId)

     let token = wx.getStorageSync('DIAN_TOKEN')
     this.token = token
     if (token) {
          this.encyRedFinish(riId)
     }
   },
   onUnload () {
     this.isShowBottomShop = false
     this.isCanShowTips = false
     this.rmrId = ''
     this.endTimeFlag = false
     this.showRedGet = false
     this.showRed = false
     this.showGotoVip = false
     this.token = ''
     this.myPhone = ''
   },
   onShow () {
     this.getMyAccount() //  获取个人信息来 判断当前用户是否绑定了手机号
     this.isCanShowTips = true
     this.endTimeFlag = false
     // this.showRedGet = false
     this.showRed = false
     let token = wx.getStorageSync('DIAN_TOKEN')
     let userInfo = wx.getStorageSync('userInfo')
     this.isVip = userInfo.mVipFlag == 0 && userInfo.mPartnerFlag == 0
     console.log('token: ' + token)
     if (token == '') {
        this.showLoginDialog = true
     } else {
       this.showLoginDialog = false
     }
     this.token = token
   },
   onReachBottom () {
      // this.showRedGet = true
      this.isBottom = true

      if (this.endTimeFlag && this.isCanGetPackage && this.rmrId != '') { // 如果阅读时间够了，并且触底了，则弹出领取红包窗口
          console.log('领红包了')
          this.showRedGet = true
      }

      // if (this.diff) {
      //   // let diff = +new Date() - this.time
      // } else {
      //   console.log('过期了时间')
      // }
   },
   // 分享按钮
   onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: this.readInfo.title,
        imageUrl: this.publicShare,
        path: '/pages/pEncyclopedia/detail/main?articleId=' + this.riId + '&referId=' + this.rcId
      }
    },
   methods: {
     // 跳转vip
     goVip () {
       console.log(1)
       wx.navigateTo({
          url: '/pages/pEncyclopedia/member/joinVip/main'
       })
     },
// 获得用户信息
    async getMyAccount () {
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (token) {
        var result = await getMyAccount()
        this.myPhone = result.result.result.member.mphone
      }
    },
     // 登录
     loginIn () {
       wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
     },
     // 跳转到会员页面
     gotoMember () {
        wx.switchTab({ // 跳转会员中心
                          url: '/pages/member/detail/main'
        })
     },
     judgeRed () { // 是否可以打开红包
        this.encyRedJudge()
     },
     async encyRedFinish (riId) { // 红包渲染完成
      // console.log(this.riId)
       let param = {
          articleId: riId,
          referId: ''
        }
        let res = await encyRedFinish(param)
        if (res.errCode === 'USER_200') {
          let result = res.result.result

          if (result) {
            this.rmrId = result.rmrId
          }

          this.encyRedJudge()
        }
     },
     async encyRedJudge () { // 是否可领取红包
        let param = {
          rmrId: this.rmrId
        }
        let res = await encyRedJudge(param)
        console.log(res)
        if (res.errCode === 'USER_200') {
          let result = res.result.result
          if (result) {
            console.log('result.isReceive: ', result.isReceive)
            if (result.isReceive) {
             // this.encyRedGet()
              this.isCanGetPackage = true
            } else {
              this.isCanGetPackage = false
            }
          }
        }
     },
     async encyRedGet () { // 领取红包接口
        let param = {
          rmrId: this.rmrId
        }
        if (!this.myPhone) { // 如果没有绑定手机号跳转到绑定手机号页面
            wx.navigateTo({
                url: '/pages/pMe/bindPhone/main'
            })
            return
        }
        let res = await encyRedGet(param)
        console.log(12, res)
        if (res.errCode === 'USER_200') {
          let result = res.result.result
          this.showRedGet = false
          if (result) {
            if (result.code == 200) { // 领取红包成功
               this.showRed = true
               this.redMoney = result.num
               this.rmrId = ''
               console.log(result.num)
            } else if (result.code == 100) { // 领取失败
                this.showGotoVip = true
                // wx.showToast({
                //       title: result.msg,
                //       icon: 'none',
                //       duration: 2000
                //     })
            }

            console.log('结果', result)
          }
        }
     },
     async follow () { // 收藏
     let token = wx.getStorageSync('DIAN_TOKEN')
     if (!token) {
         wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
     }
     this.isFollow = this.isFollow ? 0 : 1
        let param = {
          riId: this.riId,
          status: this.isFollow
        }
        let res = await encyFollow(param)
        if (res.errCode === 'USER_200') {
          let result = res.result.result
          if (result) {
            wx.showToast({
              title: result.smg
            })
            console.log('结果', result.smg)
          }
        }
     },
     async like () { // 点赞
     let token = wx.getStorageSync('DIAN_TOKEN')
     if (!token) {
         wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
     }
     this.isLike = this.isLike ? 0 : 1
        let param = {
          riId: this.riId,
          status: this.isLike
        }
        let res = await encyLike(param)
        if (res.errCode === 'USER_200') {
          let result = res.result.result

          if (result) {
            wx.showToast({
              title: result.smg
            })
            console.log('结果', result.smg)
          }
        }
     },
     timeDown () { // 阅读倒计时
        // const endTime = this.readInfo.expireTime
        // const nowTime = new Date()
        // console.log('endTime: ' + endTime)
        // console.log('nowTime: ' + nowTime.getTime())
      //  let leftTime = parseInt((endTime - nowTime.getTime()) / 1000)
        this.timer = setTimeout(() => {
            if (this.smallexpireTime <= 0) {
                clearTimeout(this.timer)
                this.endTimeFlag = true
                if (!this.isBottom && this.isCanShowTips) {
                    // this.$vux.toast.text('阅读完文章,可以领红包哦!');
                    wx.showToast({
                      title: '阅读完文章,可以领红包哦!',
                      icon: 'none',
                      duration: 2000
                    })
                } else {
                    // this.getJudgeGain()
                }
            } else {
                this.smallexpireTime = this.smallexpireTime - 1
                this.timeDown()
            }
        }, 1000)
    },
    // 获取文章详情
     async getData (riId, rcId) {
       console.log('getData riId : ' + riId)
        let param = {
          articleId: riId,
          referId: rcId
        }
        let res = await getEncyListDetail(param)
        if (res.errCode === 'USER_200') {
          let result = res.result.result

          if (result) {
            console.log('详情结果', result)
            this.readInfo = result.readInfoVO
            let expireTime = this.readInfo.expireTime
            this.smallexpireTime = this.readInfo.smallexpireTime
            this.isLike = result.readLike ? 0 : 1
            this.isFollow = result.readFollow ? 0 : 1
            let token = wx.getStorageSync('DIAN_TOKEN')
             if (!token) {
                this.isLike = 0
                this.isFollow = 0
             }
            // let nowTime = +new Date()
            // console.log(nowTime)
            // let diff = expireTime - nowTime
            // console.log('diff: ')
            // console.log(diff)
            // if (diff > 0) {
            //   this.time = nowTime
            //   this.diff = diff
            // } else {
            //   this.diff = ''
            // }
            this.shopInfo = result.shopAndGoods
            if (this.shopInfo.sTitle == '') {
              this.isShowBottomShop = false
            } else {
              this.isShowBottomShop = true
              if (this.shopInfo.sLabel) {
              this.shopInfo.sLabel = this.shopAndGoods.sLabel.split(',')
              } else {
                this.shopInfo.sLabel = ['', '']
              }
            }

            this.timeDown() // 开始计算时间
          }
        }
      }

   }
 }
</script>
<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
  .nologin{
    max-height: 130vh;
    overflow: hidden;
    // margin-bottom: 60px;
  }
  .btn{
    position: absolute;
    bottom: 0px;
    text-align: center;
    background-color: rgba(247, 247, 247,.99);
    border: 1rpx solid #E5E5E5;
    line-height: 100rpx;
    height: 100rpx;
    width: 690rpx;
    left: 30rpx;
    img{
      width: 57rpx;
      height: 57rpx;
      vertical-align: middle;
      margin-right: 45rpx;
    }
    img:last-child{
      margin-left:20rpx; 
      width: 30rpx;
      height: 17rpx;
    }
  }
.btnShare{
  background-color: #fff;
  // color: #fff;
  border: none;
  font-size:26rpx;
    color:@grey;
    border-top:1rpx solid @line;
    // margin-top:40rpx;
}
button{
  border: 0;
  &::after{
    content: '';
    width: 0;
    height: 0;
  }
}
.red-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  .red {
    width: 354rpx;
    height: 459rpx;
    background-image: url('https://sniu.2dian.com/xcx/static/matou/regbg2.png');
    background-size: cover;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    color: @color-white;
    z-index: 100;
    &.get {
      background-image: url('https://sniu.2dian.com/xcx/static/matou/redNoopen.png');
    }
    .tip {
      font-size: 30rpx;
      margin: 200rpx 0 50rpx 0;
    }
    .amount {
      font-size: 70rpx;
      font-weight: 500;
    }
  }
}
.right{
  float:right;
}

.clearfix:after{
  content:'';
  display:block;
  height:0;
  clear:both;
  visibility:hidden;
}
.container {
  width:100%;
  color: @primary;
  font-size: 30rpx;
  line-height: 55rpx;
  padding:40rpx 0 60rpx 0;
  align-items: start;
  box-sizing: border-box;
  .title{
    font-size:40rpx;
    line-height: 56rpx;
    padding:0 30rpx;
  }
  .tip-wrap{
    margin-top:30rpx;
    padding:0 30rpx;
    color:@grey;
    .read-num{
      padding-left:47rpx;
    }
  }

  .content{
    position: relative;
    padding:0 30rpx;
    .section{
      margin-top:40rpx;
      text-indent: 2em;
    }
  }
  .operate{
    width:100%;
    padding:40rpx 30rpx;
    box-sizing: border-box;
    font-size:26rpx;
    color:@grey;
    border-top:1rpx solid @line;
    margin-top:40rpx;
    image{
      width:42rpx;
      height:42rpx;
      vertical-align: middle;
      margin-right:20rpx;
    }
    span{
       vertical-align: middle;
    }
  }
  .recommend-wrap{
    padding:30rpx;
    width:100%;
    box-sizing: border-box;
     .recommend{
        width:100%;
        box-sizing: border-box;
        border:1rpx solid @line;
        padding:0 20rpx;
        .title{
          font-size:30rpx;
          padding-left:0;
          padding-right:0;
          padding-top:36rpx;
          padding-bottom:18rpx;
          border-bottom:1rpx solid @line;
          .good-img{
            width:32rpx;
            height:30rpx;
            padding-right:20rpx;
          }
        }
        .item-wrap{
          padding:50rpx 20rpx;
          .item-img{
            width:178rpx;
            height:194rpx;
          }
          .item-name{
            font-size:30rpx;
          }
          .item-tip{
            color:@grey;
            font-size:24rpx;
          }
          .item-label{
            border:1rpx solid @line;
            margin-right:10rpx;
            padding:4rpx 7rpx;
            font-size:22rpx;
          }
        }
    }
  }
  .vip-red-packet{
      width:140rpx;
      height:145rpx;
      position: fixed;
      right:30rpx;
      top:426rpx;
  }
  //
  .modal-mask{
    position: fixed;
    left:0;
    top:0;
    right:0;
    bottom:0;
    z-index:999;
    background:rgba(0,0,0,0.5);
    display: flex;
    align-items:center;
    justify-content: center;
    .modal-content{
      margin:0 auto;
      width:650rpx;
      border-radius: 10rpx;
      padding:0 35rpx;
      box-sizing: border-box;
      background: #fff;
      color:30rpx;
    //  position: absolute;
    //  top:50%;
    //  left:50%;
    //  transform:translate(-50%,-50%)
      .header{
        font-size:30rpx;
        border-bottom:1rpx solid @line;
        line-height: 110rpx;
        height:110rpx;
        text-align:center;
        overflow: hidden;
        position: relative;
        
        .close-img{
          width:28rpx;
          height:28rpx; 
          position: absolute;
          top:50%;
          margin-top:-14rpx;
          right:0
        }
        
      }
      .content{
        padding:34rpx 0;
        font-size:28rpx;
      }
      .footer{
        margin: 30rpx 0 60rpx 0;
        width:100%;
        height:90rpx;
        line-height: 90rpx;
        text-align:center;
        background: @color-orange;
        border-radius:10rpx;
        color:#fff;
      }
    }
  }
}
</style>