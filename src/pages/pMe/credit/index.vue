<template>
<div class="credit-wrap">
    <div class="item-list">
        <div class="item" v-for="(item,index) in dataList" :key="index">
            <div class="flex">
                <span>{{item.name}}</span>
                <span :class="{orange:item.status == 0?true:false}"> &nbsp;{{item.num}}</span>
            </div>
            <div class="flex tip">
                <span>{{item.time?item.time:''}}</span>
                <span>{{statusObj[item.status]}}</span>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default{
  data () {
    return {
      dataList: [
        {id: 1, name: '奖励类型', num: 50, status: 0, time: null},
        {id: 1, name: '奖励类型', num: 50, status: 1, time: '2019-09-11 10:19:1'}
      ],
      statusObj: {
        0: '待入账',
        1: '已入账'
      }
    }
  }
}
</script>
<style lang="less" scoped>
    .credit-wrap{
        background: @color-bg;
        min-height:100vh;
        font-size:28rpx;
        padding-top:20rpx;
        .item-list{
            padding:0 30rpx;
            background: #fff;
            .item{
                padding:36rpx 0;
                border-bottom:1rpx solid @line;
                &:last-of-type{
                    border-bottom:none;
                }
                .tip{
                    font-size:24rpx; 
                    padding-top:14rpx;
                    color:@grey
                }
                .orange{
                    color:@color-orange
                }
            }
        }
    }
</style>