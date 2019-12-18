<template>
  <div class="purchase">
    <div class="box">
      <div class="title">随时随地，让购物更便捷</div>
      <div class="code">
        <!-- <img src="https://sniu.2dian.com/xcx/static/matou/kefuerweima.png" alt=""> -->
         <canvas class='canvas' canvas-id='canvas'></canvas>
        <div class="tips">可在任意便利码头联盟商户使用</div>
        </div>
      <div class="select">
        <div class="pay" @click="showSelect">
          <div>
            <img class="payico" :src='showPic' alt="">
          <span>{{paystr}}</span>
          </div>
          
          <img class="jiantou" src="/static/images/arrow.png" alt="">
        </div>
        <div class="tips">优先使用此付款方式</div>
      </div>
    </div>
    <!--  -->
     <div class="payType" v-show="show">
      <div class="content1">
          <div class="title1">
            <div class="one">
              <div class="title">请选择优先付款方式</div><img  @click="showSelect" src="/static/images/close.png" alt="">
            </div>
            <div class="tips">优先使用所选付款方式，如付款失败将尝试使用其他方式完成付款</div>
            </div>
          <div class="group">
            <div class="title" @click="selectPay">
              <div class="item" id="1" ><img src="/static/images/weixinpay.png" alt="">{{payMode[1].name}}</div>
              <div class="item" id="2"><img src="http://sniu.2dian.com/xcx/static/matou/mali2.png" alt="">{{payMode[2].name}}(可用:{{myMali}})</div>
              <!-- <div class="item"> <img src="/static/images/ml.png" alt="">码粒（可用：100.99）</div> -->
            </div>
          </div>          
      </div>
    </div>
  </div>
</template>
<script>
import {getPayQrcode, getFKMState, getMyAccount} from '@/utils/api'
const QRCode = require('../../../../lib/weapp-qrcode.min.js')
  export default {
    data () {
      return {
          payico: '',
          paystr: '微信支付',
          showPic: '/static/images/weixinpay.png',
          show: false,
          memberInfo: {},
           myMali: 0,
          fkm: '',
          state: '',
          pay_way: '',
          timer: null,
          isStart: true, // 是否开始轮询检查
          payMode: [
            {},
            {
              id: 1,
              name: '微信支付',
              showPic: '/static/images/weixinpay.png'
            },
            {
              id: 2,
              name: '码粒',
              showPic: 'http://sniu.2dian.com/xcx/static/matou/mali2.png'
            }
          ]
      }
    },
    computed: {

    },
    components: {

    },
    onShow () {
      this.isStart = true
    },
    mounted () {
      this.getMyAccount()
      this.doGetPayQrcode(1)
    },
    onUnload () {
      clearTimeout(this.timer)
      this.timer = null
      this.isStart = false
    },
    onReachBottom () {

    },
    methods: {
      async getMyAccount () {
        var result = await getMyAccount()
        this.memberInfo = result.result.result.member
        if (this.memberInfo) {
            this.myMali = this.memberInfo.mprice
            console.log(this.myMali, 'this.myMali')
        }
       },
      rpx2px (rpx) {
        const rate = wx.getSystemInfoSync().windowWidth / 750
        return rate * rpx
      },
       // 获取付款码
      async doGetPayQrcode (type) {
        var data = await getPayQrcode({type: type})
        this.fkm = data.result.result.fkm
        console.log(this.fkm)
        this.genQtCode(this.fkm)
       },
       // 生成二维码
      genQtCode (code) {
         // var genStr = ('01;' + this.$route.$mp.query.code + '-' + this.$route.$mp.query.id + ';' + this.$route.$mp.query.number + ';' + this.$route.$mp.query.unit + ';' + this.$route.$mp.query.reqdecrystr + '')
         // var genStr = (code)
       console.log('code: ' + code)
       var qrcode = new QRCode('canvas', {
            // usingIn: this,
            text: code,
            width: this.rpx2px(404),
            height: this.rpx2px(404),
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        })
        this.checkPay()
     },

     // 检查付款码是否已经支付
      async doCheckQrcode () {
        var data = await getFKMState({fkm: this.fkm})
        console.log(data)
        this.pay_way = data.result.result.pay_way
        this.state = data.result.result.state
       },

      checkPay () {
        this.timer = setTimeout(() => {
            this.doCheckQrcode()
            if (this.pay_way == 0 && this.state == 1) {
                clearTimeout(this.timer)
                wx.navigateTo({url: '/pages/pIndex/goodPayOk/main'})
            } else if (this.pay_way == 1 && this.state == 0) {
                clearTimeout(this.timer)
                wx.navigateTo({url: '/pages/pIndex/goodPayOk/main'})
            } else {
                 if (this.isStart) { this.checkPay() }
            }
        }, 3000)
    },
      showSelect: function () {
        this.show = !this.show
      },
      selectPay: function (e) {
          var id = e.target.id
          console.log(id, 'id')
        this.paystr = this.payMode[id].name
        this.showPic = this.payMode[id].showPic
        this.show = false
        this.doGetPayQrcode(id)
      }
  }
  }
</script>

<style lang="less" scope>
page{
 background-color: #EAB149;
}
img{
  vertical-align: middle;
}
.purchase {
  width: 100%;
 
 .box{
   margin: 103px 57.5px;
   width: 260px;
   height: 340px;
   background-color: #fff;
   .title{
     width: 100%;
     height: 35px;
     text-align: center;
     line-height: 35px;
     font-size:14px;
      font-family:PingFang SC;
      font-weight:400;
      background-color: #FCF7EF;
      color:rgba(254,106,0,1);
   }
   .code{
     width: 192px;
     height: 220px;
     margin-top: 18px;
      margin-left: 34px;
     display: flex;
     flex-direction: column;
     justify-content: space-between;
     align-items: center;
     img{
       width: 192px;
       height: 192px;

     }
     .canvas {
        width: 100%;
        height: 100%;
      }
     .tips{
       width: 100%;
       height: 28.5px;
       line-height: 28.5px;
       text-align: center;
        font-size:10px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
       border-bottom: 1px solid #E5E5E5;
     }
   }
   .select{
     width: 199px;
     height: 31px;
      margin-left: 34px;
      margin-top: 15px;
      .pay{
        width: 100%;
        height: 19px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .payico{
          width: 16px;
          height: 16px;
        }
        span{
          width: 220px;
          height: 16px;
          margin: 0 0px 0 10px;
          font-size:14px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(51,51,51,1);
        }
        .jiantou{
          width: 8px;
          height: 13px;

        }
      }
      .tips{
        width:198px;
        height:14px;
        margin-top: 6px;
        text-indent: 2em;
        font-size:11px;
        font-family:PingFang SC;
        font-weight:300;
        color:rgba(153,153,153,1);
        line-height:14px;
      }
   }
 }
   .payType{
    height: 100%;
    width: 100vw;
    background-color: rgba(0,0,0,.6);
    position: absolute;
    top: 0;
    z-index: 99;
    .content1{
      position: absolute;
      bottom: 0;
      height: 213px;
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
      font-size:18px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
       z-index: 99;
       border-radius: 5px  5px  0px  0px;
      .title1{
        width: 92%;
        height: 56px;
         z-index: 99;
         padding: 15px;
         padding-bottom: 0px;
         padding-top: 20px;
         
         display: flex;
         flex-direction: column;
         justify-content: flex-start;
         align-items: flex-start;
         border-bottom: 1px solid #E5E5E5;
         .one{
           width: 100%;
           height: 16.5px;
           display: flex;
           flex-direction: row;
           justify-content: space-between;
           .title{
             width: 140px;
             height: 16.5px;
             font-size:14px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
            }
           img{
           width: 15px;
           height: 16.5px;
           vertical-align: middle;
         }
         }
         
         .tips{
          font-size:10px;
          margin-top: 10px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(102,102,102,1);
          margin-bottom: 20px;
         }
      }
      .group{
      width: 100%;
      height: 140px;
      display: flex;
      padding: 15px;
      padding-top: 0px;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      font-size:16px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
        .title{
          width: 100%;
         
          box-sizing: border-box;
          line-height: 46.5px;
          .item{
             height: 46.5px;
             border-bottom: 1px solid #E5E5E5;
             &:last-child{
               border: none;
             }
            img{
              width: 16px;
              height: 16px;
              margin-right: 20.5px;
            }
          }
        }
      }
    
    }

  }
}
</style>
