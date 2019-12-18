<template>
  <div class="purchase">
    <div class="list">
      <div class="items" v-for="item in records" :key="item.mbIdmbId">
        <div class="left">
          <div class="type">{{item.mbMesg}}</div>
           <div class="time" v-show="item.mbFla!==0">{{item.mbEntertime}}</div>
          </div>
       
        <div class="right">
          <span :class="item.awardStatus ? 'countadd':'count'">{{item.mbBean}}码粒</span>
          <span class="status">{{item.mbFla==0 ? '待入帐':'已入帐'}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import {findMemberBeanList} from '../../../utils/api'
    import {formatTime} from '../../../utils/util'
  export default {

    data () {
      return {
        pageNo: 1,
        pageSize: 10,
        records: [
    
        ]
      }
    },
    computed: {

    },
    components: {

    },
    mounted () {
      this.getMemberBeanList()
    },
    onUnload () {

    },
    onReachBottom () {

    },
    methods: {
      getMemberBeanList: async function () {
        var params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
       var result = await findMemberBeanList(params)
       this.records = result.result.result.records
        var newP = this.records.map((e, i) => {
          var time = e.mbEntertime
          e.mbEntertime = formatTime(new Date(time))
      })// 格式化时间
      //  console.log(newP)
      }
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
          color:#333333;
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
