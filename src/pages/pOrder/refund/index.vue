<template>
  <div class="container">
    <div class="first box">
      <div class="items"><span>退款类型</span><span>{{refundMeth==10 ?"我要退货退款":"我要退款(无需退货)"}}<img src="/static/images/arrow.png" alt=""></span></div>
      <div class="hr"></div>
      <div class="items" @click="refundTypeClick(true)"><span>退款范围</span><span>{{refundTypeStr}}<img src="/static/images/arrow.png" alt=""></span></div>
      <div class="hr"></div>
      <div class="items" @click="refundReasonClick(true)"><span>退款原因</span><span>{{refundReasonStr}}<img src="/static/images/arrow.png" alt=""></span></div>
    </div>
    <!--  -->
    <div class="alone box" v-if="aloneflag">
      <div class="title" @click="isShow = true"><span>退款商品</span><span><img src="/static/images/arrow.png" alt=""></span></div>
      <div class="goodsList">
         <div class="items" v-for="items in listGoods" :key="items.g_id">
           <span class="goodsname">{{items.g_title}}</span>
           <span class="unitcount">X
             <span class="count">{{items.osg_count}}</span>
             <span class="unit"></span>
             </span>
          </div>
      </div>
      
    </div>
    <!--  -->
    <div class="second box">
        <div class="items"><span>退款金额</span><span><span>￥</span><span>{{money}}</span></span></div>
        <div class="hr"></div>
        <div class="items"><span>退款说明</span><span></span></div>
        <!-- 防止蒙版击穿 弹出时隐藏 -->
        <div class="refundinfo" v-show="!refundTypeStatus&&!refundReasonStatus"><textarea v-model="refundReason" @change="handele" name="" id="" ></textarea></div>
    </div>
    <div class="third box">
      <div class="items"><span>上传凭证</span><span></span></div>
      <div class="upload" @click="chooseImageTap" v-if="chooseImage">
        <img src="/static/images/xiangjixian.png" alt="">
        <span>上传图片</span>
      </div>
      <div class="uploading" @click="chooseImageTap" v-if="!chooseImage">
        <img :src="pathPics" alt="">
        
      </div>
    </div>
    <!-- <div class="last box">
       <div class="items"><span>联系电话</span><span><input type="text" placeholder="请输入手机号" placeholder-style="color:#ccc;"></span></div>
    </div> -->
    <div class="btn" @click="formSubmit">提交申请</div>
    <!--  -->
    <div class="refundType" v-if="refundTypeStatus">
      <div class="content1">
          <div class="title1">退款范围</div>
          <div class="group">
            <div class="title">
              <div>整单退款</div>
              <div>部分退款</div>
            </div>
            <radio-group class="radio-group" @change="typeRadioChange">
                <radio class="radio" color='#FF0000' v-for="item in refundTypeValue" :key="item.val" :value='item.value'>
                    <span></span>
                </radio>
            </radio-group>
          </div>
              
      </div>
      <div class="btn" @click="refundTypeClick(false)">关闭</div>
    </div>
    <!-- 退款类型弹层 -->
        <div class="refundReason" v-if="refundReasonStatus">
      <div class="content1">
          <div class="title1">退款原因</div>
          <div class="group">
            <div class="title">
              <div>我不想买了</div>
              <div>商家缺货</div>
              <div>质量问题</div>
              <div>包装问题</div>
              <div>信息填写错误，重新下单</div>
              <div>其他原因</div>
            </div>
            <radio-group class="radio-group" @change="reasonRadioChange">
                <radio class="radio" color='#FF0000' v-for="item in refundReasonValue" :key="item.val" :value='item.value'>
                    <span></span>
                </radio>
            </radio-group>
          </div>
              
      </div>
      <div class="btn" @click="refundReasonClick(false)">关闭</div>
    </div>
    <!-- 退款原因弹层 -->


    <!-- 底部弹出组件 -->
    <div class="popup-modal bottom-modal" :class="{show: isShow}">
      
      <div class="popup-dialog">
        <div class="popover-content">
          <div class="title center">
            退款商品
          </div>
          <div class="goods flex" v-for="(items,index) in listGoods" :key="items.g_id">
            <div class="goods-name">{{items.g_title}}</div>
            <div class="goods-nums">
              <add :num="items.osg_count" @add="addGood(items,index)" @reduce="reduceGood(items,index)"></add>
            </div>
          </div>
          <div class="button" @click="sureModal">
            确定
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {goodRefundApply, refundApplyRequest, getMyAccount} from '../../../utils/api'
  import add from '@/components/add'

  export default {
    data () {
      return {
        data: '',
        aloneflag: false,
        chooseImage: true,
        refundTypeStr: '请选择',
        refundTypeValue: [
          {str: '整单', value: '10'},
          {str: '部分', value: '20'}],
        refundReasonValue: [
          {str: '我不想买了', value: '28'},
          {str: '商家缺货', value: '1'},
          {str: '质量问题', value: '2'},
          {str: '包装问题', value: '3'},
          {str: '信息填写错误，重新下单', value: '4'},
          {str: '其他原因', value: '5'}],
        refundReasonStr: '请选择',
        refundTypeStatus: false,
        refundReasonStatus: false,
        // 退款参数
        orderId: '20191208175614414064',
        goodsStr: '17784,1',
        pathPics: '/static/images/xiangjixian.png',
        refundMeth: '',
        refundReason: '',
        refundScope: '',
        refundType: '',
        listGoods: '', // 商品列表
        money: '',
        isShow: false,
        isRefund: false,
        goodList: [] // 商品列表副本
      }
    },
    computed: {
  
    },
    components: {
      add
    },
    mounted () {
      this.orderId = this.$root.$mp.query.orderId // 接收退款订单
      this.refundMeth = this.$root.$mp.query.refundMeth // 接收退货类型 10 20
      this.money = this.$root.$mp.query.money // 退款金额
      console.log('orderId: ', this.orderId)
      console.log('refundMeth: ', this.refundMeth)
       this.refundApplyRequest()
    },
    onUnload () {
      this.refundTypeStr = '请选择'
      this.refundReasonStr = '请选择'
      this.refundMeth = ''
      this.refundReason = ''
      this.refundScope = ''
      this.refundType = ''
      this.listGoods = '' // 商品列表
      this.goodList = []
      this.isRefund = false
      this.isShow = false
      this.refundTypeStatus = false
      this.refundReasonStatus = false
      this.aloneflag = false
    },
    methods: {
      calcPrice () {
        let money = 0
        this.listGoods.forEach(e => {
          var price = e.osg_price
          var count = e.osg_count
          money += price * count
        })
        this.money = money
      },
      sureModal () {
        this.isShow = false
        var Goodstr = this.listGoods.map(e => {
          var gid = e.g_id
          var count = e.osg_count
            var str = gid + ',' + count
            return str
        })
  
        this.goodsStr = Goodstr.join('#')
      },
      addGood (params, index) {
        if (this.goodList[index].osg_count == params.osg_count) {
          wx.showToast({
            title: '退款数量超出',
            icon: 'none'
          })
        } else {
          params.osg_count++
          this.calcPrice()
        }
        console.log('add', params)
      },
      reduceGood (params, index) {
        if (this.listGoods.length == 1) {
          return
        }
        if (params.osg_count == 1) { // 移除
          this.listGoods.splice(index, 1)
          params.osg_count--
          this.calcPrice()
          console.log(this.listGoods, '--')
        } else {
          params.osg_count--
          this.calcPrice()
        }
        console.log('reduce', params)
      },
      refundApplyRequest: async function () {
        var result1 = await getMyAccount()
        var userId = result1.result.result.member.mid
        console.log(result1.result.result.member.mid)
        var orderId = this.orderId
        var refundMethSelected = this.refundMeth
        var result2 = await refundApplyRequest({userId, orderId, refundMethSelected})
        if (result2.result.errCode == 'USER_100') {
          this.isRefund = true
          wx.showToast({
            title: '您有正在退款中的订单，不可再发起退单申请',
            icon: 'none'
          })
        }
        this.listGoods = result2.result.result.listGoods
        this.goodList = JSON.parse(JSON.stringify(this.listGoods))
        //  获取并重构退货商品
        var Goodstr = this.listGoods.map(e => {
          var gid = e.g_id
          var count = e.osg_count
            var str = gid + ',' + count
            return str
        })
        this.goodsStr = Goodstr.join('#')
      },
      // handele () {
      //   console.log(this.refundReason)
      // },
      formSubmit: function () {
        if (this.isRefund) {
          return wx.showToast({
            title: '您有正在退款中的订单，不可再发起退单申请',
            icon: 'none'
          })
        }
        if (!this.refundScope) {
          return wx.showToast({
            title: '请选择退款类型',
            icon: 'none'
          })
        }
        if (!this.refundType) {
          return wx.showToast({
            title: '请选择退款原因',
            icon: 'none'
          })
        }
        if (!this.refundReason) {
          return wx.showToast({
            title: '请输入退款说明',
            icon: 'none'
          })
        }
        this.goodRefundApply()
        console.log(this.orderId, this.goodsStr, this.pathPics, this.refundMeth, this.refundReason, this.refundScope, this.refundType)
      },
      refundTypeClick: function (status) {
        this.refundTypeStatus = status
      },
      refundReasonClick: function (status) {
        this.refundReasonStatus = status
      },
      typeRadioChange: function (e) {
        var flag = e.mp.detail.value
        if (flag === '10') {
          this.refundTypeStr = '整单退款'
          this.aloneflag = false
        } else if (flag === '20') {
          this.refundTypeStr = '部分退款'
          this.aloneflag = true
        }
        this.refundScope = e.mp.detail.value
        console.log('radio发生change事件，携带value值为：', this.refundScope)
         this.refundTypeStatus = false
      },
      reasonRadioChange: function (e) {
        this.refundType = e.mp.detail.value
        switch (this.refundType) {
          case '28':
            this.refundReasonStr = '我不想买了'
              break
          case '1':
            this.refundReasonStr = '商家缺货'
            break
          case '2':
            this.refundReasonStr = '质量问题'
            break
          case '3':
            this.refundReasonStr = '包装问题'
            break
          case '4':
            this.refundReasonStr = '信息填写错误，重新下单'
            break
          case '5':
            this.refundReasonStr = '其他原因'
            break
        }
        console.log('radio发生change事件，携带value值为：', this.refundType)
        this.refundReasonStatus = false
      },
      chooseImageTap: function () {
        var that = this
        this.chooseImage = false
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths
              that.pathPics = tempFilePaths[0]
                console.log(tempFilePaths)
            }
          })
        // wx.showActionSheet({
        //   itemList: ['从相册中选择', '拍照'],
        //   itemColor: '#00000',
        //   success: function (res) {
        //     that.chooseImage = false
        //     console.log('res.cancel: ' + res.cancel)
        //     if (!res.cancel) {
        //       if (res.tapIndex === 0) {
        //         console.log('本地选择')
        //         wx.chooseImage({
        //           count: 1,
        //           sizeType: ['original', 'compressed'],
        //           sourceType: 'album',
        //           success (res) {
        //             // tempFilePath可以作为img标签的src属性显示图片
        //             const tempFilePaths = res.tempFilePaths
        //               that.pathPics = tempFilePaths[0]
        //             console.log(tempFilePaths)
        //           }
        //         })
        //       } else if (res.tapIndex === 1) {
        //         console.log('调用相机')
        //         wx.chooseImage({
        //           count: 1,
        //           sizeType: ['original', 'compressed'],
        //           sourceType: ['album', 'camera'],
        //           success (res) {
        //             // tempFilePath可以作为img标签的src属性显示图片
        //             const tempFilePaths = res.tempFilePaths
        //             that.pathPics = tempFilePaths[0]
        //              console.log(tempFilePaths)
        //           }
        //         })
        //       }
        //     }
        //   }
        // })
//         wx.chooseImage({
//           count: 1,
//           sizeType: ['original', 'compressed'],
//           sourceType: ['album', 'camera'],
//           success (res) {
//     // tempFilePath可以作为img标签的src属性显示图片
//     const tempFilePaths = res.tempFilePaths
//   }
// })
      },
       goodRefundApply: async function () {
          // 退款最后提交
          var orderId = this.orderId //= '20191114172010927253'
          var goodsStr = this.goodsStr //= '16105,1'
          var pathPics = this.pathPics //= '/Uploads/ueditor/images/20191203/1575356506959002590.jpg'
          var refundMeth = this.refundMeth// = 20
          var refundReason = this.refundReason //= '备注信息'
          var refundScope = this.refundScope// = 10
          var refundType = this.refundType//= 28
          var result = await goodRefundApply({orderId, goodsStr, pathPics, refundMeth, refundReason, refundScope, refundType})
          console.log('退款提交参数:' + orderId, '结果', result)
          wx.showToast({
            title: '退款已受理',
            icon: 'none'
          })
          if (result.result.errCode == 'USER_200') {
            wx.navigateBack({ // 返回订单详情
              delta: 2
            })
          }
        }
    }
  }
</script>

<style lang="less" scoped>
page{
  background-color: #F7F7F7;
}
.popup-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1110;
  opacity: 0;
  outline: 0;
  -ms-transform: scale(1.185);
  transform: scale(1.185);
  backface-visibility: hidden;
  perspective: 2000rpx;
  background: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-in-out 0s;
  pointer-events: none;
  &::before {
    content: "\200B";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
  &.show {
    opacity: 1;
    transition-duration: 0.3s;
    -ms-transform: scale(1);
    transform: scale(1);
    overflow-x: hidden;
    overflow-y: auto;
    pointer-events: auto;
  }
  &.bottom-modal { 
    margin-bottom: -1000rpx;
    &::before {
      vertical-align: bottom;
    }
    &.show {
      margin-bottom: 0;
    }
    .address-dialog {
      width: 100%;
      border-radius: 0;
    }
  }
  .popup-dialog {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-left: auto;
    margin-right: auto;
    width: 100vw;
    // max-width: 100%;
    background-color: #f8f8f8;
    border-radius: 10rpx 10rpx 0 0;
    overflow: hidden;
    .close{
    width: 14px;
    height: 14px;
    text-align: center;
    position: absolute;
    right: 12px;
    top: 12px;
  }
  }
  
}
.popover-content {
  .title {
    height: 120rpx;
    font-size: 28rpx;
    color: @primary;
  }
  .goods {
    color: @primary;
    padding: 0 20rpx;
    margin-bottom: 20rpx;
    .goods-name {
      font-size: 24rpx;
      width: 440rpx;
      .ellipsis();
    }
    .goods-nums {
      /deep/ .wrap {
        border: none;
        width: initial;
        height: initial;
        .text {
          border: none;
          max-width: 40px;
          font-size: 24rpx;
          height: initial;
        }
        .icon-minus {
          width: 40rpx;
          height: 40rpx;
          border: solid 1px @disabled;
          font-size: 24rpx;
          border-radius: 50%;
        }
        .icon-add {
          width: 40rpx;
          height: 40rpx;
          // border: solid 1px @disabled;
          font-size: 24rpx;
          border-radius: 50%;
          background: @color-orange;
          color: @color-white;
        }
      }
    }
  }
  .button {
    margin-top: 30rpx;
    .btn--primary();
    width: 100%;
  }
}
.container {
  position: relative;
  color: @primary;
  font-size: @fs44;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
 padding-bottom: 55px;
  .box{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #fff;
    margin-top: 10px;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding: 0 15px;
    box-sizing: border-box;
    z-index: 1;
    // .hr{
    //   width: 100%;
    //   height:0.5px;
    //   background:rgba(229,229,229,1);

    // }
  }
  .first{
    height: 290rpx;
    
    .items{
      width: 100%;
      height: 53px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 53px;
      border-bottom: 1rpx solid #e5e5e5;
       span{
        img{
          width: 5.5px;
          height: 10px;
          margin-left: 8.5px;
        }
        &:last-child{
           color:rgba(120,120,120,1);
        }
      }
    }

  }
  .second{
    height: 230px;
    .items{
      width: 100%;
      height: 53px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 53px;
      span{
        img{
          width: 5.5px;
          height: 10px;
          margin-left: 8.5px;
        }
        &:last-child{
          color: #ff0000;
        }
      }
    }
    .refundinfo{
      width:100%;
      height:100px;
      background:rgba(247,247,247,1);
      border:1px solid rgba(229,229,229,1);
      border-radius:2.5px;
      padding: 5px;
      box-sizing: border-box;
      z-index: 0;
      textarea{
        width:98%;
        height:98px;
       
      }
      
      }
  }
  .third{
    height: 155px;
    .items{
      width: 100%;
      height: 53px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 53px;
   
    }
    .upload{
      width: 85px;
      height: 85px;
      border:.5px solid rgba(204,204,204,1);
      display: flex;
      padding: 10px 0;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      font-size:12px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(153,153,153,1);
      img{
        width: 42px;
        height: 33.5px;
      }
    }
        .uploading{
      width: 85px;
      height: 85px;
      border:.5px solid rgba(204,204,204,1);
      display: flex;
      // padding: 10px 0;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      font-size:12px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(153,153,153,1);
      img{
        width: 85px;
        height:85px;
      }
    }
  }
  .last{
    height: 50px;
    margin-bottom: 55px;
    .items{
      width: 100%;
      height: 53px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 53px;
      span{
        img{
          width: 5.5px;
          height: 10px;
          margin-left: 8.5px;
        }
        &:last-child{
         margin: 0 10px;
         height: 45px;
         line-height: 45px;
         display: flex;
         flex-direction: column;
         justify-content: space-around;
        
        }
      }
    }
  }
  .alone{
    width: 100%;
    .title{
      width: 100%;
      height: 53px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 53px;
      span{
        img{
          width: 5.5px;
          height: 10px;
          margin-left: 8.5px;
        }
        &:last-child{
         margin: 0 10px;
         height: 45px;
         line-height: 45px;
         display: flex;
         flex-direction: column;
         justify-content: space-around;
        
        }
      }
    }
    .goodsList{
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .items{
      width: 100%;
      height: 35px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 35px;
      .goodsname{
        width: 70%;
        font-size:13px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:40px;
      }
      .unitcount{
         display: flex;
      flex-direction: row;
      justify-content: space-between;
      .count{
        margin: 0 1px;
      }
      }
    }
    }

  }
  
  .btn{
    height: 45px;
    width: 100%;
    background-color: #FE6A00;
    text-align: center;
    line-height: 45px;
    font-size:15px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
    position: fixed;
    bottom: 0;
    z-index: 8;
  }
  .refundType{
    height: 100%;
    width: 100vw;
    background-color: rgba(0,0,0,.6);
    position: absolute;
    top: 0;
    z-index: 99;
    .content1{
      position: absolute;
      bottom: 0;
      height: 430px;
      width: 100%;
      background-color: #fff;
      font-size:18px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
       z-index: 99;
      .title1{
        width: 100%;
        text-align: center;
        height: 45px;
        line-height: 45px;
         z-index: 99;
      }
      .group{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      // align-items: center;
      font-size:16px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
        .title{
          width: 50%;
          height: 66px;
          padding-left:15px ;
          box-sizing: border-box;
          >div:first-child{
            margin-top: 10rpx;

          }
          >div{
            margin: 0  0 24px 0;
          }
        }
        .radio-group{
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 0px 15px;
      box-sizing: border-box;
      .radio{
        height: 33px;
        width: 100%;
        // margin: 10px 0;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        &:last-child{
           margin-top: 22rpx;
          margin-bottom: 33px;
        }
        &:first-child{
         
        }
        
      }
    }
      }
    
    }
    .btn{
      width: 100%;
      height: 45px;
      text-align: center;
      height: 45px;
      background-color: #FE6A00;
      position: fixed;
      bottom: 0;
      // z-index: 99;
    }
  }
  // 上面是退款类型
    .refundReason{
    height: 100%;
    width: 100vw;
    background-color: rgba(0,0,0,.6);
    position: absolute;
    top: 0;
    z-index: 99;
    .content1{
      position: absolute;
      bottom: 0px;
      height: 430px;
      width: 100%;
      background-color: #fff;
      font-size:18px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
       z-index: 99;
      .title1{
        width: 100%;
        text-align: center;
        height: 45px;
        line-height: 45px;
         z-index: 99;
      }
      .group{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      // align-items: center;
      font-size:16px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
        .title{
          width: 55%;
          height: 290px;
          padding-left:15px ;
          box-sizing: border-box;
          // margin-top: 70rpx;
          >div{
           margin-top: 40rpx;
;

          }
        }
        .radio-group{
          margin-top: 14rpx;

      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 0px 15px;
      box-sizing: border-box;
      .radio{
        margin-bottom: 22.5rpx;
        height: 30px;
        width: 100%;
        // margin: 10px 0;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        &:first-child{
          margin-top: 24rpx;

        }
      }
    }
      }
    
    }
    .btn{
      width: 100%;
      height: 45px;
      text-align: center;
      height: 45px;
      background-color: #FE6A00;
      position: fixed;
      bottom: 0;
    }
  }
  // 退款原因
  
}
</style>
