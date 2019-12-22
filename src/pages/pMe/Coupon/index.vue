<template>
  <div class="container">
    <div class="title">{{showName}}</div>
    <div class="codebox">
     <div class="code">
       <canvas class='canvas' canvas-id='canvas'></canvas>
     </div>
     <div class="footer">
       <div>可在任意便利码头联盟商户使用</div>
       <div class="hr"></div>
       <div class="shop" @click="gotoShopList" v-if="isShowShopList == 1">
         <div class="s">
           <img src="/static/images/shopico.png" alt="">
          <div>查看门店,就近取货</div>
          </div>
         <img src="/static/images/arrow.png" alt="">
       </div>
         <div class="shop"  v-if="isShowShopList != 1 && shopTitle">
         <div class="s">
          <div style="margin-left: 60px">{{shopTitle}}</div>
          </div>
         <span></span>
       </div>
       <!-- <div class="shop" @click="goShopDetail" v-if="isShowShopList != 1 && shopTitle">
         <div class="s">
          <div style="margin-left: 10px">{{shopTitle}}</div>
          </div>
         <img src="/static/images/arrow.png" alt="">
       </div> -->

       </div>
   </div>
  </div>   
</template>
<script>
 const QRCode = require('../../../../lib/weapp-qrcode.min.js')

export default {
  data () {
    return {

      isShowShopList: 0, // 是否显示门店列表 0不展示 1为展示
      shopTitle: '', // 店铺名称
      showName: '' // 显示名称
 
    }
  },
  computed: {
 
  },
  components: {

  },
  onLoad (option) {
    this.flag = option.flag
    // 优惠券扫描使用
    if (this.flag == 1) {
      this.id = option.id
      this.code = option.code
      this.number = option.number
      this.unit = option.unit
      this.reqdecrystr = option.reqdecrystr
      console.log(option)
      wx.setNavigationBarTitle({
        title: '优惠券'
        })
      this.showName = '好礼扫出来'
      this.genQtCode(this.code, this.id, this.number, this.unit, this.reqdecrystr)
    } else if (this.flag == 2) { // 订单列表取货
      this.shopId = option.orderShopId
      this.goodNumber = option.goodNumber
      this.goodUnit = option.goodUnit
      this.reqDecryStr = option.reqDecryStr
      this.orderId = option.orderId
      this.isShowShopList = option.isShowShopList
      this.shopTitle = option.shopTitle
      this.jumpShopId = option.shopId
      console.log(option)
      this.showName = '码上取货'
      wx.setNavigationBarTitle({
        title: '取货'
        })
      this.genQtCodeForOrder(this.shopId, this.goodNumber, this.goodUnit, this.reqDecryStr)
    }
 },
  mounted () {
    // var qrcode = new QRCode('canvas', {
    //         // usingIn: this,
    //         text: 'https://tool.lu/js/',
    //         width: this.rpx2px(404),
    //         height: this.rpx2px(404),
    //         colorDark: '#000000',
    //         colorLight: '#ffffff',
    //         correctLevel: QRCode.CorrectLevel.H
    //     })
  },
  onUnload () {
    this.isShowShopList = 0
    this.shopTitle = ''
  },
  methods: {

    // 跳转店铺详情
      goShopDetail (id) {
        wx.navigateTo({
              url: '/pages/pIndex/shopDetail/main?id=' + this.jumpShopId
          })
      },

    rpx2px (rpx) {
      const rate = wx.getSystemInfoSync().windowWidth / 750
      return rate * rpx
    },
    // 优惠券扫描使用
    genQtCode (code, id, number, unit, reqdecrystr) {
         // var genStr = ('01;' + this.$route.$mp.query.code + '-' + this.$route.$mp.query.id + ';' + this.$route.$mp.query.number + ';' + this.$route.$mp.query.unit + ';' + this.$route.$mp.query.reqdecrystr + '')
         var genStr = ('01;' + code + '-' + id + ';' + number + ';' + unit + ';' + reqdecrystr + '')
         console.log('genStr: ' + genStr)
       var qrcode = new QRCode('canvas', {
            // usingIn: this,
            text: genStr,
            width: this.rpx2px(404),
            height: this.rpx2px(404),
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        })
    },
    // 订单列表取货
    genQtCodeForOrder (shopId, number, unit, reqdecrystr) {
         // var genStr = ('01;' + this.$route.$mp.query.code + '-' + this.$route.$mp.query.id + ';' + this.$route.$mp.query.number + ';' + this.$route.$mp.query.unit + ';' + this.$route.$mp.query.reqdecrystr + '')
         var genStr = ('00;' + shopId + ';' + number + ';' + unit + ';' + reqdecrystr + '')
         console.log('genStr: ' + genStr)
       var qrcode = new QRCode('canvas', {
            // usingIn: this,
            text: genStr,
            width: this.rpx2px(404),
            height: this.rpx2px(404),
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        })
    },
    gotoShopList () {
        wx.navigateTo({
              url: '/pages/pOrder/shopListForCoupon/main?flag=1&couponid=' + this.id + '&flag=' + this.flag + '&orderId=' + this.orderId
        })
   }

  }
}
</script>

<style lang="less" scope>
page{
    background-color: #EBB347;
}
.container {
  position: relative;
  color: @primary;
  font-size: 12px;
  text-align:left;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-size: 375px;
  background-repeat: no-repeat;
  .title{
    width: 100%;
    text-align: center;
    line-height: 24px;
    font-size:24px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
    margin-top: 60px;
      }
  .codebox{
    position: absolute;
    top:57px;
    left: 61px;
    width: 260px;
    height: 310px;
    padding: 13px 0px;
    background-color: #fff;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border: 2.5px solid rgba(234, 178, 73, 0.555);
    box-shadow: 1px 1px 5px #fff;
    box-sizing: border-box;
    .code{
      width: 202px;
      height: 202px;
      margin: 20px 30px 0 30px;
      background-color: #ccc; 
      .canvas {
        width: 100%;
        height: 100%;
      }
      img{
        width: 202px;
        height: 202px;
      }
    }
    .footer{
      text-align: center;
      margin-top: 9px;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .hr{
      width:199px;
      height:1px;
      margin:  0 auto;
      background:#E5E5E5;
    }
    .shop{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-right: 30px;
      box-sizing: border-box;
      .s{
        display: flex;
        width: 141px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-left: 33px;
         img{
          width: 18px;
          height: 15px;

      }
      }
      .title{
        margin-left:15px;
      }
      img{
        width: 8px;
        height: 13px;
      }
   
       

    }
  }
    }  
    
}
</style>
