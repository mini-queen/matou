<template>
    <div class="transaction"> 
        <!-- 自定义navigationbar <navigation-bar title="哈哈哈哈" titleColor="#000"></navigation-bar>
        {
        "navigationStyle": "custom"
        }
         -->
        <div class="selected-button" @click="select">筛选</div>
        <div class="record-section"  v-for="(cell,cellIndex) in 2" :key="cellIndex">
            <div class="section-top center-left">
                <div class="record-date">
                    <span class="date">2019年7月</span>
                    <div class="actions">
                        <img src="/static/images/sort-top.png" alt=""  class="arrow-top" @click="sortUp">
                        <img src="/static/images/sort-bottom.png" alt=""  class="arrow-bottom" @click="sortDown">
                    </div>
                </div>
            </div>
            <div class="record-list">
                <div class="record-item space-between" v-for="(item,index) in 6" :key="index">
                    <div class="record-left">
                        <div class="record-name">充值（微信）</div>
                        <div class="record-time">2019-07-15  11:22:23</div>
                    </div>
                    <div class="record-money">
                        +50.00
                    </div>
                </div>
            </div>
        </div>  
        <popup 
            :isShow="isShow" 
            @closeModal="closeModal" 
            @sure="sure" 
            @cancel="cancel" 
            :data="selectedList" 
            mode="transaction">
        </popup>
    </div>
</template>
<script>
import navigationBar from './navbar.vue'
import popup from '@/components/popup.vue'
export default{
  data () {
    return {
      isShow: false,
      selectedList: [
        {name: '线上支付（余额）'},
        {name: '线上支付退款（余额）'},
        {name: '全部'},
        {name: '充值（微信）'},
        {name: '充值退款（微信）'}
      ]
    }
  },
  components: {
    navigationBar, popup
  },
  methods: {
    select () {
      console.log('筛选')
      this.isShow = true
    },
    closeModal () {
      this.isShow = false
    },
    sure () {
      this.closeModal()
    },
    cancel () {
      this.closeModal()
    },
    sortUp () {
      console.log('升序')
    },
    sortDown () {
      console.log('降序')
    }
  }
}
</script>
<style lang="less" scoped>
    .transaction {
        color: @primary;
        background-color: @color-bg;
       .selected-button {
           .btn--default();
           position: fixed;
           top: 20rpx;
           right: 20rpx;
       }
       .record-section {
           .section-top {
               height: 100rpx;
               padding-left: 30rpx;
               .record-date {
                   width: 190rpx;
                   height: 60rpx;
                   border-radius: 10rpx;
                   background: @color-white;
                   border: solid 1px @line;
                   display: flex;
                   align-items: center;
                   justify-content: center;
                   .date {
                       font-size: 24rpx;
                   }
                   .actions {
                       margin-left: 20rpx;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                       .arrow-top {
                           width: 18rpx;
                           height: 11rpx;
                       }
                       .arrow-bottom {
                           margin-top: 6rpx;
                           width: 18rpx;
                           height: 11rpx;
                       }
                   }
               }
           }
           .record-list {
               background: @color-white;
               padding: 0 30rpx;
               .record-item {
                   padding: 40rpx 0;
                   border-bottom: 1px solid @line;
                   &:last-of-type {
                       border-bottom: none;
                   }
                   .record-left {
                       .record-name {
                           font-size: 28rpx;
                           margin-bottom: 20rpx;
                       }
                       .record-time {
                           font-size: 24rpx;
                           color: @disabled;
                       }
                   }
                   .record-money {
                       color: @color-orange;
                       font-size: 28rpx;
                       &.cut {
                           color: @primary;
                       }
                   }
               }
           }
       }
    }
</style>