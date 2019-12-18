<template>
  <div class="container">
    <div class="bgctop">
      <!-- <img src="https://sniu.2dian.com/xcx/static/matou/kaidian1.png" alt=""> -->
      <div class="bg-img"></div>
      <div class="title">便利码头帮你付房租</div>
            <div class="box">
              <div class="code">
                <img src="https://sniu.2dian.com/xcx/static/matou/erweima2.png" alt="二维码">
                <img @click="handle" src="https://sniu.2dian.com/xcx/static/matou/applybtn.png" alt="申请按钮">
              </div>
              <div class="text">
                  <span>扫一扫添加微信</span>
                  <span @click="callphone">咨询热线：18510503333</span>
              </div>
              
            </div>
    </div>
    <div class="bgcbottom">
      <img src="https://sniu.2dian.com/xcx/static/matou/kaidian2.png" alt="">

    </div>
    <div class="sqbox" v-show="sqone">
      <div class="sq">
        <div class="title"><span>提交申请</span><span @click="handleClose">x</span></div>
        <div class="content">
          <div class="ipt pnhone">
            <span>联系电话:</span>
            <input type="text" placeholder="请输入联系电话" placeholder-style="color:#999999" v-model="myPhone" name="phone" id="">
          </div>
           <div class="ipt code">
             <span>验证码:</span>
            <input placeholder-style="color:#999999" placeholder="请输入验证码" type="text"  v-model="smdCode" name="code" id="">
            <div class="getcode" @click="sendCode">{{getCodeStr}}</div>
          </div>
        </div>
        <div class="btn" @click="doApply">立即申请</div>
      </div>
      
    </div>
    <div class="sqbox"  v-if="msg">
        <div class="msg">
         <div class="title"><span>申请成功</span><span @click="handleClose">x</span></div>
        <div class="contents">申请成功！您的专属业务经理会在三个工作日内跟您联系。</div>
        <div class="btn" @click="handleClose">确定</div>
      </div>
      

      </div>
  </div>
  
</template>
<script>
  import {getCode, VerifyCode, doApplyShops} from '../../../utils/api'
  export default {
    data () {
      return {
        sqone: false,
        msg: false,
        myPhone: '',
        smdCode: '',
        getCodeStr: '获取验证码'
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
  
    },
    onUnload () {
        this.myPhone = ''
        this.smdCode = ''
        this.msg = false
        this.sqone = false
     },
    methods: {
      // 打电话
      callphone () {
        console.log(1)
         wx.makePhoneCall({
                phoneNumber: '18510503333'
             })
      },
      // 发送验证码
   async sendCode () {
     if (this.getCodeStr !== '获取验证码') {
       return
     }
      if (this.myPhone == '') {
          wx.showToast({
                        title: '手机号不能为空',
                        icon: 'none',
                        duration: 2000
          })
          return
        }
              // 验证码倒计时
      var countdown = 60
      var _ = this
      function settime () {
        if (countdown === 0) {
          _.getCodeStr = ' 获取验证码'
          countdown = 60
        } else if (countdown <= 0) {
          _.getCodeStr = '获取验证码'
        } else {
          _.getCodeStr = '重新发送(' + countdown + ')'
          countdown--
          setTimeout(function () {
            settime()
          }, 1000)
        }
      }

      // --
      settime()
        var res = await getCode({mobile: this.myPhone, type: 'applysShops'})
        wx.showToast({
                      title: '验证码已发送',
                      icon: 'none',
                      duration: 2000
        })
    },
      // 开始申请
   async doApply () {
      if (this.myPhone == '') {
          wx.showToast({
                        title: '手机号不能为空',
                        icon: 'none',
                        duration: 2000
          })
          return
        }
      if (this.smdCode == '') {
          wx.showToast({
                        title: '验证码不能为空',
                        icon: 'none',
                        duration: 2000
          })
          return
        }

        var res = await doApplyShops({mobile: this.myPhone, code: this.smdCode, clientSource: 5, memo: ''})
        console.log(res.result.errCode, 'res.result.errCode')
        if (res.result.errCode == 'USER_200') {
          // wx.showToast({
          //             title: '申请成功',
          //             icon: 'none',
          //             duration: 2000
          //  })
           this.handleNext()
        } else {
          wx.showToast({
                      title: res.result.errMsg,
                      icon: 'none',
                      duration: 2000
           })
        }
    },
    handle: function () {
        this.sqone = !this.sqone
    },
      handleNext: function () {
        this.sqone = false
        this.msg = true
    },
     handleClose: function () {
      this.sqone = false
      this.msg = false
    }
    }

  }
</script>

<style lang="less" scoped>
.container {
  color: @primary;
  font-size: @fs44;
  position: relative;
  .bgctop{
    // background-image: url(https://sniu.2dian.com/xcx/static/matou/kaidian1.png);
    // background-repeat: no-repeat;
    // background-size: 375px 429.5px;
    // overflow: hidden;
    position: relative;
    // margin-top:22.5px;
    margin-bottom: 70px;
    width: 100%;
    height: 429.5px;
    >img{
      width: 430px;
      height: 429.5px;
      margin-left: -25px;
    }
    .bg-img {
      width: 100vw;
      height: 859rpx;
      background-image: url(https://sniu.2dian.com/xcx/static/matou/kaidian1.png);
      background-size: cover;
      background-position: center;
    }
    .title{
      position: absolute;
      top: 19px;
      left: 19px;
      font-size: 19px;
      color: #333333;
      font-weight: 500;
    } 
    .box{
      position: absolute;
      top: 365px;
      left: 19px;
      .code{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        span{
          width: 45px
        }
          input{
            width: 200px;
          }
        img{
          width: 73.5px;
          height: 72px;
          margin-right: 19px;
          &:last-child{
            width: 106px;
            height: 42.5px;
            margin-top: 19px;
          }
        }
      }
      .text{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        span{
          width: auto;
          height: 45px;
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(51,51,51,1);
          &:last-child{
            font-size:15px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
            margin-left: 16.5px;
          }
        }
      }
    }
  }
  .bgcbottom{
    width: 375px;
    height: 314px;
    // background-image: url(https://sniu.2dian.com/xcx/static/matou/kaidian2.png);
    // background-repeat: no-repeat;
    img{
    width: 375px;
    height: 314px;
    }
  }
  .sqbox{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,.6);

    .sq{
      position: absolute;
      top: 240px;
      left: 25px;
      width: 325px;
      height: 272.5px;
      background:rgba(255,255,255,1);
      border-radius:5px;
      .title{
       height: 54px;
       width: 100%;
       display: flex;
       flex-direction: row;
       justify-content: space-between;
       text-align: center;
       line-height: 54px;
       font-size:15px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      border-bottom: 1px solid rgba(229,229,229,1);
      span:first-child{
        width: 90%;
        padding-left: 10%;
        box-sizing: border-box;
      }
      span:last-child{
        text-align: left;
        width: 10%;
        font-size: 20px;
      }
      }
      .content{
        padding: 17.5px;
        box-sizing: border-box;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        z-index: 1;
        .ipt{
          height: 51px;
          line-height: 51px;

          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          border-bottom: 1px solid rgba(229,229,229,1);
          input{
            margin-left: 5px;
            margin-top: 15px;
          }
        }
        // .phone{

        // }
        .code{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .getcode{
            width: 77.5px;
            height: 25px;
            border-radius: 12.5px;
            margin-top: 13px;
            border:1px solid rgba(51,51,51,1);
            font-size:12px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
            text-align: center;
            line-height: 25px;
          }
        }
      }
      .btn{
        width:290px;
        height:45px;
        margin-left: 17.5px;
        line-height: 45px;
        background:rgba(254,106,0,1);
        border-radius:5px;
        text-align:center;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
      }
    }
    .msg{
      position: absolute;
      top: 240px;
      left: 25px;
      width: 325px;
      height: 223px;
      background:rgba(255,255,255,1);
      border-radius:5px;
      z-index: 99;
    .title{
       height: 54px;
       width: 100%;
       display: flex;
       flex-direction: row;
       justify-content: space-between;
       text-align: center;
       line-height: 54px;
       font-size:15px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      border-bottom: 1px solid rgba(229,229,229,1);
      span:first-child{
        width: 90%;
        padding-left: 10%;
        box-sizing: border-box;
      }
      span:last-child{
        text-align: left;
        width: 10%;
        font-size: 20px;
      }
      }
      .contents{
        padding: 17.5px;
        margin-bottom: 35px;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
      }
      .btn{
        width: 290px;
        height: 45px;
        margin:  0 auto;
        background-color: #FE6A00;
        text-align: center;
        line-height: 45px;
        border-radius: 5px;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
      }
    }
  }
}
</style>
