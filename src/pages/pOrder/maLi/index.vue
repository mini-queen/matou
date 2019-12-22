<template>
  <div class="container">
   <div class="balance">
     <div class="balanTitle">
       <div>
         <img src="http://sniu.2dian.com/xcx/static/matou/malibai.png" alt="">
         <span>码粒</span>
       </div>
       <div class="tips">
         * 1码粒=1元，可在平台消费使用
       </div>
       
     </div>
     <div class="balanCount">
       <span class="count">{{mali}}</span>
       <div class="tixian" @click="Tixian" v-if="mPartnerFlag == 1">提现</div>
       <!-- <div class="tixian" @click="Tixian">提现</div> -->
     </div>
     <div class="hr"></div>
     <div class="balanAwait">
       <div @click="goCredit">待入帐:<span>{{bean}}</span>码粒 >></div>
     </div>

   </div>
   <div class="record">
     <div>交易记录</div>
     <picker @change="bindPickerChange" range-key='dictLabel'  :range='typeList'>
     <div class="picker">筛选</div>
     </picker>
   </div>
   <div class="card">
   <!-- <div class="card" v-for="(items,i) in timeGroup" :key="i"> -->
     <!-- <div class="timeTitle" >{{items}}</div> -->
     <div  v-for="item in PriceDetail" :key="item.mpAddtime" >
     <!-- <div class="whitebg" v-show="item.timeGroup==items"> -->
       <div class="whitebg">
       <div class="log" v-if="item">
         <div class="left">
           <div class="type">{{item.mpMesg}}</div>
           <div class="time">{{item.mpAddtime}}</div>
         </div>
         <div class="right"><span :class="item.mpCnt==1?'reduce':'add'"> {{item.mpCnt==1?'-':'+'}}{{item.mpPrice}}  </span></div>
       </div>
      </div>
     </div>
   </div>
  </div>
</template>
<script>
  import {getMpTypeList, getPriceDetail, getMyAccount} from '../../../utils/api'
  import {formatTime} from '../../../utils/util'
  export default {
    data () {
      return {
        // show: true,
        typeList: [], // 类型列表
        mali: '', // 码粒
        bean: '', // 待入帐
        PriceDetail: [], // 交易记录
        page: 1,
        pageSize: 40,
        dictValue: '', // 类型值
        timeGroup: '',
        mPartnerFlag: 0
      }
    },
    computed: {
  
    },
    components: {

    },
    onShow () {
      this.dictValue = ''
      this.page = 1
      this.PriceDetail = []
      this.getTypeList()
      this.getPriceDetail()
      this.getMemberPrice()
    },
    mounted () {
  
    },
    onUnload () {
  
    },
    methods: {
      getMemberPrice: async function () {
        var result = await getMyAccount()
        this.bean = result.result.result.member.mbean
        this.mali = result.result.result.member.mprice
        this.mPartnerFlag = result.result.result.member.mPartnerFlag
      },
      bindPickerChange: async function (e) {
        this.page = 0
        this.PriceDetail = []
        this.dictValue = this.typeList[e.mp.detail.value].dictValue
        //
          var page = this.page
          var pageSize = this.pageSize
          var mpType = this.dictValue
          var params = {page, pageSize, mpType}
        let PriceDetail = await getPriceDetail(params)
       this.PriceDetail = PriceDetail.result.result.records
        for (let i = 0; i < this.PriceDetail.length; i++) {
        this.PriceDetail[i].mpAddtime = formatTime(new Date(this.PriceDetail[i].mpAddtime))
      }
        console.log(this.PriceDetail, this.dictValue)
  },
  // 获取交易类型
     async getTypeList () {
           var typeList = await getMpTypeList()
        var type = typeList.result.result
         this.typeList = type
    },
    getPriceDetail: async function () {
      var page = this.page
      var pageSize = this.pageSize
      var mpType = this.dictValue
      var params = {page, pageSize, mpType}
      let PriceDetail = await getPriceDetail(params)
    console.log(mpType, 'mpType')
    console.log(PriceDetail, 'PriceDetail')
     var newDataList = PriceDetail.result.result.records // 加载新数据
      for (let i = 0; i < newDataList.length; i++) {
        newDataList[i].mpAddtime = formatTime(new Date(newDataList[i].mpAddtime))
      }
    //  this.PriceDetail = Object.assign(this.PriceDetail, this.PriceDetail, PriceDetails) // 合并新旧数据
    this.PriceDetail = this.PriceDetail.concat(newDataList)
      //     var timeGroup = [] // 时间分组数组
      //     // 重构数据-时间与时间分组
      //     if (PriceDetails) {
      //        var newPriceDetail = PriceDetails.map((e, i) => {
      //     var time = e.mpAddtime
      //     e.mpAddtime = formatTime(new Date(time))
      //     e.timeGroup = e.mpAddtime.substr(0, 10)
      // })
      //     }
          // 时间分组数组
  
      // this.timeGroup = Array.from(new Set(timeGroup))
       console.log(this.PriceDetail)
        // console.log(this.timeGroup)
    },
    Tixian: function () {
      wx.navigateTo({
        url: '/pages/pOrder/withdraw/main?mali=' + this.mali
      })
    },
    goCredit: function () {
            wx.navigateTo({
        url: '/pages/pMe/records/main'
      })
    }
  
    },
    onReachBottom () {
      this.page++
      console.log(this.page, 'this.page')
      this.getPriceDetail()
    }
  
  }
</script>

<style lang="less" scope>
page{
  background-color: #f7f7f7;
}
.container {
  position: relative;
  color: @primary;
  font-size: @fs44;
  .balance{
    height: 165px;
    background-color: #FE6A00;
    padding:15px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .balanTitle{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      img{
        width: 21.5px;
        height: 21.5px;
        margin-right: 10px;
        vertical-align: middle;
      }
      span{
        height: 21.5px;
        line-height: 21.5px;
        font-size:14px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
      }
      .tips{
        height: 21.5px;
        line-height: 38px;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(253,238,213,1);
      }
    }
    .balanCount{
       display: flex;
      flex-direction: row;
      justify-content: space-between;
      .count{
        font-size:25px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
      }
      .tixian{
        width: 80px;
        height: 30xp;
        text-align: center;
        line-height: 30px;
        border:1px solid rgba(255,255,255,1);
        font-size:14px;
        border-radius:5px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
      }
    }
    .hr{
      width:345px;
      height:1px;
      background:rgba(255,255,255,1);
    }
    .balanAwait{
       display: flex;
      flex-direction: row;
      justify-content: flex-start;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(255,255,255,1);
      span{
        margin-left: 5px;
      }
    }
  }
  .record{
    height:50px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #fff;
    margin-top: 10px;
    line-height: 50px;
    font-size:16px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .card{
    
    .timeTitle{
      height: 40px;
      line-height: 40px;
      background-color: #f7f7f7;
      padding: 0 15px;
      box-sizing: border-box;
      font-size:12px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
    }
    .whitebg{
      width: 100%;
      background-color: #fff;
      padding: 0 15px;
      box-sizing: border-box;
      .log{
        width: 100%;
        height: 73px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;  
        .left{
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(51,51,51,1);
          .type{
            font-size: 14px;
            margin-bottom: 10px;
          }
          .time{
            font-size: 12px;
          }
        }
        .right{
          font-size:14px;
          font-family:PingFang SC;
          font-weight:400;
          .add{
            color:rgba(254,106,0,1);
          }
          .reduce{
            color:#333333;
          }
        }
      }
    }
  }
  .typefilterbox{
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 9;
    background-color: rgba(0, 0, 1, 0.432);
   .typefilter{
     position: fixed;
     bottom: 0;
    height: 277.5px;
    width: 100%;
    z-index: 9;
    padding:15px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
      .one{
        width: 100%;
        height: 45px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
      }
      .list{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 200px;
        font-size:14px;
        font-family:PingFang SC;
        font-weight:400;
        color:#999999;
        .items{
          text-align: center;
          height: 30px;
          width: 100%;
          border-bottom: 0.5px solid #E5E5E5;
          &:last-child{
            border: none;
          }
        }
      }
   }
    
  }
}
</style>
