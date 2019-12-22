<template>
  <div class="withdraw">
    <div class="takeout">
      <div class="takeout-bottom flex">
        <div class="take-money  center-left">
          <span class="unit"> ¥ </span>
          <input type="text" :value="tackMoney" @change="changeMoney" placeholder="请输入提现金额">
        </div>
        <div class="tip" @click="getAll">全部取出</div>
      </div>
    </div>
        <div class="amount center-left">
      可提现码粒 : {{totalMoney}} <span class="tips">{{totalMoney}}元</span> 
    </div>
    <div class="withdraw-count center-right">
      本日剩余提现次数：{{surplus}}
    </div>
    <div class="withdraw-ways">
      <div class="title">提现方式</div>
      <div class="bank center-left">
        <div class="radio"></div>
        <span class="tip">银联卡</span>
      </div>
    </div>

    <div class="withdraw-section">

      <div class="item flex">
        <div class="tip">收款人</div>
        <input type="text" v-model="userName" @change="changeUserName" placeholder="请输入收款人姓名">
      </div>
      <div class="item flex">
        <div class="tip">开户行</div>
        <div class="select" @click="show">
          <span v-if="selectedBank">
            {{selectedBank}}
          </span>
          <span v-else>请选择</span>
          <img src="/static/images/arrow.png" class="more-icon">
        </div>
      </div>
      <div class="item flex">
        <div class="tip">开户支行</div>
        <input type="text" v-model="bank" @change="changeBank" placeholder="请输入开户支行">
      </div>
      <div class="item flex">
        <div class="tip">收款账号</div>
        <input type="text" v-model="account" @change="changeAccount" placeholder="请输入收款账号">
      </div>
    </div>
    <div class="rules">
      <div class="title">提现规则：</div>
      <div class="rule-item space-between">
        <div class="tip">
            单笔上限金额：{{upLimit}}元                            
        </div>
        <div class="text">
            单笔最低金额：{{downLimit}}元
        </div>
      </div>
      <div class="rule-item space-between">
        <div class="tip">
            单日提现次数：{{dayLimit}}次                                   
        </div>
        <div class="text">
            单月提现次数：{{monthLimit}}次
        </div>
      </div>
    </div>
    <div class="button" @click="withdraw">
      申请取出
    </div>
    <!-- 底部弹出组件 -->
    <popup 
      :isShow="isShow" 
      mode="withdraw"
      :data="bankList"
      @closeModal="closeModal"
      @sure="sure" 
      @cancel="closeModal"
    ></popup>
  </div>
</template>
<script>
import popup from '@/components/popup'
import { applyInit, doApply } from '@/utils/api'
  export default {
    data () {
      return {
        // isShow: false,
        bankList: [], // 银行列表
        tackMoney: '', // 全部提现
        totalMoney: 0, // 所有余额
        userName: '', // 用户名
        bank: '', // 银行名
        selectedBank: '', // 选择银行
        selectBankCode: '', // 对应标识
        account: '', // 收款账号
        phone: '', // 手机号
        dayLimit: '', // 每日限制
        downLimit: '', //
        monthLimit: '', // 月次数
        upLimit: '', //
        surplus: 0 // 本日剩余次数

      }
    },
    onLoad (option) {
      // this.totalMoney = option.mali
    },
    computed: {

    },
    components: {
      popup
    },
    onShow () {
      let userNameLocal = wx.getStorageSync('TIXIAN_USERNAME')
      if (userNameLocal) {
        this.userName = wx.getStorageSync('TIXIAN_USERNAME')
        this.selectedBank = wx.getStorageSync('TIXIAN_SELECTBANK')
        this.account = wx.getStorageSync('TIXIAN_ACCOUNT')
        this.bankName = wx.getStorageSync('TIXIAN_BANKNAME')
      }
    },
    mounted () {
      this.applyInit()
    },
    onUnload () {

    },

    methods: {
      show () {
        this.isShow = true
      },
      closeModal () {
        this.isShow = false
      },
      doPhone (e) {
         let phoneValue = e.mp.detail.value
         console.log('phoneValue: ' + phoneValue)
      },

      getAll () {
        console.log('totalMoney:' + this.totalMoney)
         this.tackMoney = this.totalMoney
      },

      changeMoney (e) {
          this.tackMoney = e.mp.detail.value
      },

      changeUserName (e) {
         let myUserName = e.mp.detail.value
         this.userName = myUserName
         console.log('myUserName: ' + myUserName)
      },

      changeAccount (e) {
         this.account = e.mp.detail.value
      },

      changeBank (e) {
         this.bank = e.mp.detail.value
      },

      // test () {
      //    console.log('phone: ' + this.phone)
      //    console.log('userName: ' + this.userName)
      // },
      async withdraw () { // 申请取出
          console.log(this.userName)
          let param = {
            amount: this.tackMoney,
            bank: this.selectedBank,
            accountNo: this.account,
            bankName: this.bank,
            name: this.userName,
            type: 3,
            bankId: this.selectBankCode
          }

           wx.setStorageSync('TIXIAN_USERNAME', this.userName)
           wx.setStorageSync('TIXIAN_SELECTBANK', this.selectedBank)
           wx.setStorageSync('TIXIAN_ACCOUNT', this.account)
           wx.setStorageSync('TIXIAN_BANKNAME', this.bankName)

          console.log(param)
          let res = await doApply(param)
          console.log(res)
          console.log(res.result.errCode)
          if (res.result.errCode == 'USER_200') {
            console.log(res)
            wx.showToast({
                title: '提交成功', // 提示的内容,
                icon: 'none', // 图标,
                duration: 2000, // 延迟时间,
                mask: true, // 显示透明蒙层，防止触摸穿透,
                success: res => {

                }
              })
              setTimeout(function () {
                 wx.navigateBack({
                  delta: 1
                  })// 返回上一页面
              }, 2000)
          } else {
            console.log(res.errMsg)
              wx.showToast({
              title: res.result.errMsg, // 提示的内容,
              icon: 'none', // 图标,
              duration: 2000, // 延迟时间,
              mask: true, // 显示透明蒙层，防止触摸穿透,
              success: res => {

              }
            })
          }
          console.log('返回值', res)
      },
// 数据初始化
      async applyInit () {
          let res = await applyInit({})
          if (res.errCode === 'USER_200') {
            console.log(res)
            let result = res.result.result
            console.log(result)
            if (result) {
              // this.tackMoney = result.amountLimit
              this.totalMoney = result.amountLimit
              this.surplus = result.surplus
              this.dayLimit = result.dayLimit
              this.downLimit = result.downLimit
              this.monthLimit = result.monthLimit
              this.upLimit = result.upLimit
              this.bankList = result.banks.map((item) => {
                  return {name: item.dictLabel, code: item.dictCode}
              })
            }
          }
          console.log('this.tackMoney: ' + this.tackMoney)
          console.log('返回值', res)
      },
      sure (item) {
        this.closeModal()
        this.selectedBank = item.name
        this.selectBankCode = item.code
      }
    }
  }
</script>

<style lang="less" scoped>
.tips{
  padding: 2rpx 12px;
  background-color: #FCEBCC;
  color: #FE6A00;
  border-radius: 25rpx;
  margin-left: 12rpx;
}
.withdraw {
  color: @primary;
  background-color: @color-bg;
  padding-top: 20rpx;
  padding-bottom: 72rpx;
  .amount {
    background: @color-white;
    padding: 0 30rpx;
    border-bottom: 1px solid @line;
    font-size: 28rpx;
    height: 106rpx;
    color: #999999;
  }
  .takeout {
    background: @color-white;
    padding: 40rpx 30rpx;
    .tip {
      font-size: 30rpx;
    }
    .takeout-bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      // margin-top: 50rpx;
      .take-money {
        display: flex;
        .unit {
          font-size: 60rpx;
          margin-right: 26rpx;
        }
        input {
          font-size: 28rpx;
        }
      }
      .tip {
        font-size: 30rpx;
        color: @color-orange;
      }
    }
  }
  .withdraw-count {
    padding: 0 30rpx;
    font-size: 24rpx;
    color: @disabled;
    height: 102rpx;
  }
  .withdraw-ways {
    background-color: @color-white;
    padding: 40rpx 30rpx;
    .title {
      font-size: 30rpx;
    }
    .bank {
      margin-top: 40rpx;
      .radio {
        width: 40rpx;
        height: 40rpx;
        padding: 2px;
        border: 1px solid @disabled;
        border-radius: 50%;
        background-clip: content-box;
        color: @color-orange;
        box-sizing: border-box;
        background-color: currentColor;
        &:hover {
          // background-color: currentColor;
        }
      }
      .tip {
        font-size: 28rpx;
        margin-left: 20rpx;
      }
    }
  }
  .withdraw-section {
    margin-top: 20rpx;
    background-color: @color-white;
    padding: 0rpx 30rpx;
    .item {
      height: 106rpx;
      border-bottom: 1px solid @line;
      &:last-of-type {
        border-bottom: none;
      }
      .tip {
        font-size: 30rpx;
      }
      input {
        font-size: 30rpx;
        text-align: right;
      }
      .select {
        color: @grey;
        .more-icon {
          width: 11rpx;
          height: 20rpx;
          padding-left: 20rpx;
        }
      }
    }
  }
  .rules {
    margin: 60rpx 0 80rpx;
    padding: 0 30rpx;
    color: @grey;
    .title {
      margin-bottom: 24rpx;
      font-size: 24rpx;
    }
    .rule-item {
      margin-bottom: 12rpx;
      .tip {
        font-size: 24rpx;
      }
      .text {
        font-size: 24rpx;
      }
    }
  }
  .button {
    .btn--primary();
    width: 690rpx;
    height: 90rpx;
    line-height: 90rpx;
    margin: 0 auto;
    font-size: 30rpx;
    border-radius: 10rpx;
  }
}
</style>
