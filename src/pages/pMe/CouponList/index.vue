<template>
  <div class="container">
  <!-- <div class="tabbar">
    <div :class="tabitems1"  data-current="0" @click="checkCurrent(0)">未使用</div>
    <div :class="tabitems2"  data-current="1" @click="checkCurrent(1)">已使用</div>
    <div :class="tabitems3"  data-current="2" @click="checkCurrent(2)">已过期</div>
  </div> -->

    <div class="swipter-tab flex">
          <div class="swipter-tab-item"  :class="{active:index == activeIndex?true:false}" v-for="(item,index) in tabItems" :key="index"
              @click="doChange(index)">
              {{item.name}}
          </div>
    </div>

    <div class="coupon-list">
      <div class="card" @click="gotoCouponDetail(item, item.reqDecryStr)" :class="{Usable: activeIndex == 0,Unusable: activeIndex!=0}" v-for="(item,index) in encyList" :key="index">
        <div class="liwupic"><img src="/static/images/liwu.png" alt=""></div>
        <div class="content">
          <div class="contop">
              <div class="middle">
                <div class="title">{{item.c_title}}</div>
                <span>仅限盐城市亭湖区门店使用</span>
              </div>
              <div class="icon" v-show="activeIndex == 2"> 
                  <img src="/static/images/pic1.png" alt="">
              </div>
              <div class="icon" v-show="activeIndex == 1"> 
                  <img src="/static/images/pic2.png" alt="">
              </div>
          </div>
          <div class="time">
            <div class="left">{{item.cEtime}}到期</div>
            <div class="right" v-show="activeIndex == 0">立即使用</div>
          </div>
        </div>
      </div>
    </div> 
    <div class="more-wrapper" v-show="isShowNodata">
      <div class="more-text">
        <image class="empty-img" src="http://sniu.2dian.com/xcx/static/matou/nocollect.png"></image>
      </div>
       暂无数据
    </div>
  </div>
</template>
<script>
import { couponList, getEncyList } from '@/utils/api'

export default {
  data () {
    return {
      currentData: 0,
      activeIndex: 0,
      encyList: [],
      pageSize: 10,
      pageNo: 1,
      isShowNodata: false,
      tabItems: [{id: 1, name: '未使用'}, {id: 2, name: '已使用'}, {id: 3, name: '已过期'}]
    }
  },
  computed: {

  },
  components: {

  },
  async mounted () {
    // console.log(result)
    this.getList()
  },
  onUnload () {

  },
  methods: {

     gotoCouponDetail (item, reqDecryStr) {
       if (this.activeIndex == 1 || this.activeIndex == 2) {
         return
       }
      console.log('reqDecryStr: ' + reqDecryStr)
      console.log(item)
      console.log('reqdecrystr: ' + item.reqdecrystr)
      // { id:c_id, code: c_number, number: g_number, unit: g_unit,reqdecrystr:reqdecrystr }});
      wx.navigateTo({
        url: '/pages/pMe/Coupon/main?flag=1&id=' + item.c_id + '&code=' + item.c_number + '&number=' + item.g_number + '&unit=' + item.g_unit + '&reqdecrystr=' + reqDecryStr
      })
    },

    doChange (index) {
      this.activeIndex = index
      // this.isShowNodata = true
      this.getList()
    },

    async getList () {
      this.encyList = []
      // let param = {
      //   page: this.pageNo,
      //   pageSize: this.pageSize
      // }
      let res = await couponList({c_state: this.activeIndex + 1})
      if (res.errCode === 'USER_200') {
        // console.log(res)
        let result = res.result.result
        if (result) {
          let records = result
          if (records.length > 0) {
            this.encyList = records
            this.isShowNodata = false
          } else {
            this.isShowNodata = true
          }
        }
        console.log(this.encyList)
      }
      // console.log('返回值', res)
    },

    checkCurrent: function (e) {
      const that = this
      if (that.currentData === e) {
        return false
      } else {
        that.currentData = e
      }
    }
  }
}
</script>

<style lang="less" scope>
page{
  background-color: #F7F7F7;
}
.container {
  position: relative;
  color: @primary;
  font-size: 12px;
  text-align:left;
  margin: 0;
  padding: 0;
  width: 100%;
  .more-wrapper {
    margin: 20rpx 0;
    font-size: 24rpx;
    color: #EAB149;
    text-align: center;
    .empty-img{
        width:222rpx;
        height:190rpx;
        padding-bottom:38rpx;
        background-size: 100% 100%;
    }
  }
  // .tabbar{
  //   height: 45px;
  //   width: 100%;
  //   text-align: center;
  //   line-height: 45px;
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: space-around;
  //   background-color: #fff;
  //   border-top: 1px solid #F7F7F7;
  //   box-sizing: border-box;
  //   font-size:15px;
  //   font-family:PingFang SC;
  //   font-weight:400;
 
  //   .tabBorer{
  //     width: 90px;
  //     height: 45px;
  //     color:rgba(254,106,0,1);
  //     border-bottom: 1px solid #FE6A00;//激活状态样式
  //   }
  //   .tabitems{
  //     width: 90px;
  //     height: 45px;
  //     //未激活状态样式
  //   }
  // }
  .swipter-tab{
        position:fixed;
        top:0;
        z-index:999;
        background: #fff;
        width:100%;
        padding:0 30rpx;
        box-sizing: border-box;
        .swipter-tab-item{
            padding-top:44rpx;
            padding-bottom:14rpx;
            font-size: 16px;
            &.active{
                color:@color-orange;
                border-bottom:1rpx solid @color-orange;
            }
        }
    }

  .coupon-list{
        margin-top:100rpx;
        padding:20rpx 0rpx;
        width:100%;
        box-sizing: border-box;

  }
  .card{
    width: 345px;
    height: 95px;
    margin: 0px 15px 10px 15px;
  }

  .Usable{
    background-image: url('https://sniu.2dian.com/xcx/static/matou/couponbk1.png');
    background-size: 345px 95px;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .liwupic{
      width: 100px;
      height: 95px;
      line-height: 95px;
      img{
        width: 44px;
        height: 44px;
        vertical-align: middle;
        margin: 0 28px;
      }
    }
    .content{
      width: 490px;
      height: 95px;
      padding: 0 18px;
      box-sizing: border-box;
       .contop{
          width: 100%;
          height: 63px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px dashed #E5E5E5;
          .middle{
            width: 145px;
            height: 63px;
            box-sizing: border-box;
            padding-bottom:4px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .title{
              padding-top:14px;
              font-size:15px;
              font-family:PingFang SC;
              font-weight:400;
              color:#333;
            }
            span{
              font-size:12px;
              font-family:PingFang SC;
              font-weight:400;
              color:#CCCCCC;
            }
        }
        .icon{
          width: 70px;
          height: 50px;
          border-bottom: 1px dashed #E5E5E5;
          line-height: 50px;
          text-align: center;
          img{
            width: 37px;
            height: 37px;
            vertical-align: middle;
          }
        }
      }
      // .middle{
      //   width: 100%;
      //   height: 50px;
      //   display: flex;
      //   flex-direction: column;
      //   justify-content: space-around;
      //   border-bottom: 1px dashed #E5E5E5;
      //   .title{
      //     font-size:30rpx;
      //     font-family:PingFang SC;
      //     font-weight:400;
      //     color:#333;
      //   }
      //   span{
      //     font-size:24rpx;
      //     font-family:PingFang SC;
      //     font-weight:400;
      //     color:#787878;
      //   }
      // }
      .time{
        height: 32px;
        line-height: 32px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:400;
        color:#CCC;
        .right{
          border: 1px solid #FE6A00;
          color: #FE6A00;
          width:66px;
          height:20px;
          border:1px solid rgba(254,106,0,1);
          border-radius:10px;
          text-align: center;
          line-height: 20px;
        }
      }
    }
  }

  .Unusable{
    background-image: url('https://sniu.2dian.com/xcx/static/matou/couponbk2.png');
    background-size: 345px 95px;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .liwupic{
      width: 100px;
      height: 95px;
      line-height: 95px;
      img{
        width: 44px;
        height: 44px;
        vertical-align: middle;
        margin: 0 28px;
      }
    }
    .content{
      width: 490px;
      height: 95px;
      padding: 0 18px;
      box-sizing: border-box;
      .contop{
        width: 100%;
        height: 63px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px dashed #E5E5E5;
        .middle{
            width: 145px;
            height: 63px;
            box-sizing: border-box;
            padding-bottom:4px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .title{
              padding-top:14px;
              font-size:15px;
              font-family:PingFang SC;
              font-weight:400;
              color:#CCCCCC;
            }
            span{
              font-size:12px;
              font-family:PingFang SC;
              font-weight:400;
              color:#CCCCCC;
            }
      }
      .icon{
        width: 70px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        img{
          width: 37px;
          height: 37px;
          vertical-align: middle;
        }
      }
      }
      
      .time{
        height: 32px;
        line-height: 32px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:400;
        color:#CCCCCC;
       
      }
    }
  }

}
</style>
