<template>
  <div class="val-unpay">
    <div class="unpay-top">
      <div class="top-text">待支付订单</div>
      <div class="time-countdown">
        剩余{{time}}自动关闭
      </div>
    </div>
    <div class="val-goods">
      <div class="goods-top space-between">
        <div class="goods-info">
          <img src="/static/images/shop.png" alt="" class="goods-img">
          <div class="info-right">
            <div class="goods-name">农夫山泉饮用水农夫山山泉...</div>
            <div class="goods-num">×2</div>
          </div>
        </div>
        <div class="goods-price"> 30.9</div>
      </div>
      <div class="goods-total">
        <span class="tip">小计</span>
        <span class="total-price"> 61.8</span>
      </div>
    </div>
    <div class="val-order">
      <div class="order-cell space-between">
        <div class="order-tip">订单号码</div>
        <div class="order-right">
          <span class="order-no">{{orderNo}}</span>
          <span class="button" @click="copy">复制</span>
        </div>
      </div>
      <div class="order-cell space-between">
        <div class="order-tip">下单时间</div>
        <div class="order-right">
          <span class="order-time">2019-07-18 18:32:42</span>
        </div>
      </div>
      <div class="order-cell space-between">
        <div class="order-tip">支付方式</div>
        <div class="order-right">
          <span class="payment-way">在线支付</span>
        </div>
      </div>
      <div class="order-cell space-between">
        <div class="order-tip">支付时间</div>
        <div class="order-right">
          <span class="payment-time">2019-07-18 18:33:42</span>
        </div>
      </div>
    </div>
    <div class="val-pickup">
      <div class="order-cell space-between">
        <div class="order-tip">取货时间</div>
        <div class="order-right">
          <span class="pickup-time">2019-07-18 18:33:42</span>
        </div>
      </div>
      <div class="order-cell space-between">
        <div class="order-tip">取货门店</div>
        <div class="order-right">
          <span class="pickup-shop">鹏润花园店</span>
        </div>
      </div>
    </div>
    <div class="order-bar">
      <div class="button btn-cancel"  @click="cancelOrder">
        取消订单
      </div>
      <div class="button btn-pay" @click="pay">
        去支付
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        time: '30分00秒',
        orderNo: '1234567891234567'
      }
    },
    computed: {

    },
    components: {
    },
    mounted () {
      // 模拟从接口获取 生成订单时间
      this.getDiffTime()
    },
    onUnload () {
      clearInterval(this.timer)
      this.time = '30分00秒'
    },
    methods: {
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
          this.time = `${minute}分${second}秒`
          intDiff--
          if (intDiff < 0) {
            clearInterval(this.timer)
            this.time = '00分00秒'
          }
        }, 1000)
      },
      copy () {
        wx.setClipboardData({
          data: this.orderNo,
          success: function (res) {
            wx.showToast({
              title: '订单号码已复制',
              icon: 'none'
            })
          }
        })
      },
      pay () {
        // console.log('去支付..')
      },
      cancelOrder () {
        console.log('取消订单')
      }
    }
  }
</script>

<style lang="less" scoped>
.val-unpay {
  color: @primary;
  background-color: @color-bg;
  padding-bottom: 128rpx;
  .unpay-top {
    // height: 210rpx;
    background-color: @color-orange;
    color: @color-white;
    text-align: center;
    padding: 46rpx 0 76rpx 0;
    .top-text {
      font-size: 50rpx;
      font-weight: 500;
    }
    .time-countdown {
      margin-top: 16rpx;
      font-size: 24rpx;
    }
  }
  .val-goods {
    background-color: @color-white;
    margin-top: 20rpx;
    padding: 40rpx 30rpx;
    .goods-top {
      padding-bottom: 40rpx;
      border-bottom: solid 1px @line;
      .goods-info {
        display: flex;
        align-items: center;
        .goods-img {
          border: solid 1px @line;
          width: 110rpx;
          height: 110rpx;
          margin-right: 20rpx;
        }
        .goods-name {
          font-size: 28rpx;
        }
        .goods-num {
          margin-top: 20rpx;
          font-size: 28rpx;
          color: @grey;
        } 
      }
      .goods-price {
        font-size: 30rpx;
        padding-top: 10rpx;
      }
    }
    .goods-total {
      margin-top: 58rpx;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .tip {
         font-size: 28rpx;
         color: @grey;
      }
      .total-price {
        margin-left: 35rpx;
        font-size: 40rpx;
      }
    }
  }
  .val-order {
    background-color: @color-white;
    margin-top: 20rpx;
    padding: 0rpx 30rpx;
    .order-cell {
      padding: 40rpx 0;
      border-bottom: solid 1px @line;
      &:last-of-type {
        border-bottom: none;
      }
      .order-tip {
        font-size: 28rpx;
        color: @grey;
      }
      .order-right {
        .order-no {
          font-size: 28rpx;
          color: @grey;
        }
        .order-time {
          font-size: 28rpx;
          color: @grey;
        }
        .payment-way {
          font-size: 28rpx;
          color: @grey;
        }
        .payment-time {
          font-size: 28rpx;
          color: @grey;
        }
        .button {
          .btn--default();
          margin-left: 46rpx;
          padding: 2rpx 6rpx;
        }
      }
    }
  }
  .val-pickup {
    background-color: @color-white;
    margin-top: 20rpx;
    padding: 0rpx 30rpx;
    .order-cell {
      padding: 40rpx 0;
      border-bottom: solid 1px @line;
      &:last-of-type {
        border-bottom: none;
      }
      .order-tip {
        font-size: 28rpx;
        color: @grey;
      }
      .order-right {
        .pickup-time {
          font-size: 28rpx;
        }
        .pickup-shop {
          font-size: 28rpx;
        }
      }
    }
  }
  .order-bar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 98rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: solid 1px @line;
    background-color: @color-white;
    .button {
      font-size: 28rpx;
      font-weight: 400;
      &.btn-cancel {
        .btn--default();
        width: 164rpx;
        height: 60rpx;
        line-height: 60rpx;
        margin-right: 30rpx;
        border-radius: 30rpx;
      }
      &.btn-pay {
        .btn--primary();
        width: 164rpx;
        height: 60rpx;
        line-height: 60rpx;
        color: @color-white;
        border-radius: 30rpx;
        margin-right: 30rpx;
      }
    }
    

  }
}
</style>
