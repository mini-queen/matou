<template>
  <div class="purchase">
    <div class="list">
      <div class="items" v-for="item in records" :key="item.awardTime">
        <div class="left">
          <div class="type">{{item.awardType}}</div>
           <div class="time">{{item.awardTime}}</div>
          </div>
       
        <div class="right">
          <span class="status">￥{{item.awardCount}}</span>
          <span :class="item.awardStatus ? 'countadd':'count'">{{item.awardStatus}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        records: [
          {
            awardType: '提现',
            awardStatus: '处理中',
            awardTime: '2019-09-11 10:19:19',
            awardCount: '50.00'
  
          },
           {
            awardType: '提现',
            awardStatus: '成功',
            awardTime: '2019-09-11 10:19:19',
             awardCount: '50.00'
  
          }, {
            awardType: '提现',
            awardStatus: '失败',
            awardTime: '2019-09-11 10:19:19',
             awardCount: '50.00'
  
          },
          {
            awardType: '提现',
            awardStatus: '处理中',
            awardTime: '2019-09-11 10:19:19',
            awardCount: '50.00'
  
          },
           {
            awardType: '提现',
            awardStatus: '成功',
            awardTime: '2019-09-11 10:19:19',
             awardCount: '50.00'
  
          }, {
            awardType: '提现',
            awardStatus: '失败',
            awardTime: '2019-09-11 10:19:19',
             awardCount: '50.00'
  
          }
        ]
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
    },
    onUnload () {
  
    },
    onReachBottom () {
  
    },
    methods: {
  
  }
  }
</script>

<style lang="less" scope>
page{
 background-color: #F7F7F7;
}
img{
  vertical-align: middle;
}
.purchase {
  width: 100%; 
  .list{
    width: 100%;
    margin-top: 10px;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: #fff;
    .items{
      height: 73px;
      width: 100%;
      padding: 15px 0;
      box-sizing: border-box;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .left{
         display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 40%;
        font-size:14px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        .type{
           font-size:14px;
           font-family:PingFang SC;
           font-weight:400;
           color:rgba(51,51,51,1);
        }
        .time{
          margin-top: 10px;
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(153,153,153,1);
        }
      }
      .right{
         display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
        width: 20%;
        .countadd{
         font-size:14px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(254,106,0,1);
        }
        .count{
          font-size:14px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(120,120,120,1);
        }
        span:last-child{
           margin-top: 10px;
          font-size:12px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(153,153,153,1);
           }
      }

    }
  }
}
</style>
