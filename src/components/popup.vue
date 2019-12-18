<template>
    <div class="cu-modal bottom-modal" :class="{show: isShow}">
      <div class="cu-dialog">
		<!-- 一般的弹框插槽 -->
        <slot></slot>
		<!-- 交易页面的弹框 -->
		<div class="popup-transaction" v-if="mode=='transaction' || mode=='withdraw'">
			<div class="actions space-between">
				<div class="btn-cancel" @click="cancel">取消</div>
				<div class="btn-sure"  @click="sure">确定</div>
			</div>
			<div class="selected-list">
				<div class="selected-item center" :class="{active: currentIndex == index }" v-for="(item,index) in data" :key="index" @click="selectedItem(index)">
					{{item.name}}
				</div>
			</div>
		</div>
		<!-- 支付密码的弹框 -->
		<div class="popup-payment" v-if="mode=='payment'">
			<div class="popup-top flex">
			<img src="/static/images/close.png" alt="" class="close" @click="close">
			<span class="tip">{{data.title}}</span>
			<span></span>
			</div>
			<div class="passwords-wrapper">
			<div class="passwords">
				<div class="item center" v-for="(item,index) in 6" :key="index">
				<input type="text" :disabled="true" :value="index" :password="true" v-if="pwdArr.length > index">
				</div>
			</div>
			<div class="set-pwd center" v-if="data.setPwd">
				<img src="/static/images/bell.png" alt="">
				支付密码由6位数字组成，进行余额支付时使用
			</div>
			<div class="forget-pwd" @click="forgetPwd" v-else>忘记密码？</div>
			</div>
			<div class="keyboard">
			<div class="item" v-for="(item,index) in 12" :key="index">
				<template v-if="index < 9 || index == 10">
				<div class="cell" @click="numHandler(0)" v-if="index == 10">0</div>
				<div class="cell"  @click="numHandler(index+1)" v-else>{{index + 1}}</div>
				</template>
				<div class="cell" v-if="index == 11" @click="delHandler">
				<img src="/static/images/del-number.png" alt="" class="del">
				</div>
			</div>
			</div>
		</div>
		<!-- 购物车列表 -->
      </div>
    </div>
</template>

<script>

export default {
  data () {
    return {
      pwdArr: [], // 支付页面数据
      currentIndex: -1 // 提现页面数据
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    mode: String, // 由于mpvue的slot不支持变量，用此属性区别是哪个页面，从而去做逻辑处理
    data: [Object, Array] // 个性化弹框的传入值
  },
  methods: {
    close () {
      this.$emit('closeModal')
    },
    // 各个页面的事件

    // 交易页面
    sure () {
      if (this.mode === 'withdraw') {
        this.$emit('sure', this.data[this.currentIndex])
      } else {
        this.$emit('sure')
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    // 支付页面
    delHandler () { // 删除数字
      if (this.pwdArr.length) {
        this.pwdArr.pop()
      }
    },
    numHandler (num) { // 输入数字
      this.pwdArr.push(num)
      if (this.pwdArr.length === 6) {
        this.$emit('paySuccess', this.pwdArr)
        this.pwdArr = []
      }
    },
    forgetPwd () {
      this.$emit('forgetPwd')
    },
    // 提现页面
    selectedItem (index) {
      if (this.mode === 'withdraw') {
        this.currentIndex = index
      }
    }
    // 其他页面
  }
}
</script>

<style lang="less">

.cu-modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1110;
	opacity: 0;
	outline: 0;
	// text-align: center;
	-ms-transform: scale(1.185);
	transform: scale(1.185);
	backface-visibility: hidden;
	perspective: 2000rpx;
	background: rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease-in-out 0s;
	pointer-events: none;
}

.cu-modal::before {
	content: "\200B";
	display: inline-block;
	height: 100%;
	vertical-align: middle;
}

.cu-modal.show {
	opacity: 1;
	transition-duration: 0.3s;
	-ms-transform: scale(1);
	transform: scale(1);
	overflow-x: hidden;
	overflow-y: auto;
	pointer-events: auto;
}

.cu-dialog {
	position: relative;
	display: inline-block;
	vertical-align: middle;
	margin-left: auto;
	margin-right: auto;
	width: 680rpx;
	max-width: 100%;
	background-color: #f8f8f8;
	border-radius: 10rpx;
	overflow: hidden;
}

.cu-modal.bottom-modal::before {
	vertical-align: bottom;
}

.cu-modal.bottom-modal .cu-dialog {
	width: 100%;
	border-radius: 0;
}

.cu-modal.bottom-modal {
	margin-bottom: -1000rpx;
}

.cu-modal.bottom-modal.show {
	margin-bottom: 0;
}

.cu-modal.drawer-modal {
	transform: scale(1);
	display: flex;
}

.cu-modal.drawer-modal .cu-dialog {
	height: 100%;
	min-width: 200rpx;
	border-radius: 0;
	margin: initial;
	transition-duration: 0.3s;
}

.cu-modal.drawer-modal.justify-start .cu-dialog {
	transform: translateX(-100%);
}

.cu-modal.drawer-modal.justify-end .cu-dialog {
	transform: translateX(100%);
}

.cu-modal.drawer-modal.show .cu-dialog {
	transform: translateX(0%);
}
.cu-modal .cu-dialog>.cu-bar:first-child .action{
  min-width: 100rpx;
  margin-right: 0;
  min-height: 100rpx;
}

// 交易页面弹框
.popup-transaction {
	background: @color-white;
	padding: 30rpx 30rpx 0;
	.actions {
		.btn-cancel,.btn-sure {
			font-size: 28rpx;
		}
	}
	.selected-list {
		margin-top: 50rpx;
		max-height: 440rpx;
		overflow: auto;
		.selected-item {
			height: 86rpx;
			border-bottom: solid 1px @line;
			font-size: 28rpx;
			color: @disabled;
			&:last-of-type {
				border-bottom: none;
			}
			&.active {
				color: @color-orange;
			}
		}
	}
}

//支付页面弹框
.popup-payment {
    background: @color-white;
    .popup-top {
      height: 130rpx;
      border-bottom: 1px solid @line;
      padding: 0 30rpx;
      .close {
        width: 30rpx;
        height: 33rpx;
      }
      .tip {
        font-size: 36rpx;
      }
    }
    .passwords-wrapper {
      .passwords {
        width: 540rpx;
        box-sizing: border-box;
        border: solid 1px @line;
        margin: 75rpx auto 0;
        display: flex;
        .item {
          width: 90rpx;
          height: 90rpx;
          border-right: solid 1px @line;
          box-sizing: border-box; 
          input {
            text-align: center;
          }     
          &:last-of-type {
            border-right: none;
          }
        }
      }
      .forget-pwd {
        margin-top: 50rpx;
        text-align: right;
        padding-right: 100rpx;
        color: @color-orange;
        font-size: 28rpx;
	  }
	  .set-pwd {
		color: @disabled;
		font-size: 24rpx;
		margin-top: 22rpx;
		img {
			width: 22rpx;
			height: 26rpx;
			margin-right: 10rpx;
		}
	  }
    }
    
    .keyboard {
      margin-top: 65rpx;
      border-top: solid 2px @line;
      display: flex;
      flex-wrap: wrap;
      .item {
        flex: 0 0 calc(100% / 3);
        height: 100rpx;
        border-right: solid 1px @line;
        border-bottom: solid 1px @line;
        box-sizing: border-box;
        .cell {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50rpx;
          width: 100%;
          height: 100%;
          .del {
            width: 86rpx;
            height: 44rpx;
          }
        }
        
      }
    }
}
</style>
