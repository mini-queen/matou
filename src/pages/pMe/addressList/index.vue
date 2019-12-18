<template>
  <div class="container">
    <div class="AddressList">
     <div v-for="(item,index) in addressList" :key="index"> 
        <div class="AdressCard" >
          <!-- 屏幕有左右滑动问题，暂时注释
            <div>
            <div class="xm">{{item.maName}}</div>
            <div class="xb">(女士)</div>
            <div class="phone">{{item.maPhone}}</div>
            <div class="tag"><span>默认</span><span>公司</span></div> 
          </div>
          <div class="address">{{item.maDetail}}</div>
          <div class="edit" @click="addNewAddress(item.maId)"></div> -->
          <div class="addr-left">
            <div class="addr-userinfo" @click="editNewAddress(item.maId)">
              <span class="xm">{{item.maName}}</span>
              <span class="phone">{{item.maPhone}}</span>
              <!-- 暂时隐藏 -->
              <div class="tag">
                <span class="tag-item red" v-if="item.maState">默认</span>
                <span class="tag-item blue" v-if="item.maLabel==0">公司</span>
                <span class="tag-item yellow" v-if="item.maLabel==1">家</span>
                <span class="tag-item green" v-if="item.maLabel==2">学校</span>
              </div>
            </div>
            <div class="address">
              {{item.pName + item.cName + item.aName + item.ccName + item.maDetail}}
            </div>
          </div>
          <div class="addr-right">
            <div class="edit" @click="editNewAddress(item.maId)"></div>
          </div>
        </div> 
        <div class="hr"></div>
    </div>
    
   </div>
   <!-- 地址列表 -->
    <div class="btnOk" @click="addNewAddress(0)">新增收货地址</div>
  </div>
</template>
<script>
  import {getUserAddress} from '@/utils/api'
  export default {
    data () {
      return {
         addressList: [],
         default: false
      }
    },

   onLoad (option) {
  
    },
    onShow () {
       this.doGetUserList()
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
  
    },
    onUnload () {
  
    },
    methods: {

    addNewAddress (maid) {
      console.log('addNewAddress...')
      wx.navigateTo({url: `/pages/pMe/addAddress/main?maId=${maid}` + `&flag=add`})
    },
    editNewAddress (maid) {
       wx.navigateTo({url: `/pages/pMe/addAddress/main?maId=${maid}` + `&flag=edit`})
    },
      // 获取
    async doGetUserList () {
        let params = {
  
        }
        let data = await getUserAddress(params)
        if (data) {
          // this.data = data.result.result
          this.addressList = data.result.result.list
        }
        console.log(data)
    }
  
    }
  }
</script>

<style lang="less" scope>
.container {
  height: 100vh;
  background-color: #F7F7F7;
  color: @primary;
  font-size: 12px;
  text-align:left;
  margin: 0;
  padding: 0;
  a{
    margin-top:10px;
    color:#FE6A00
  }
  .AddressList{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 10px 0;
    margin-bottom: 40px;
    .title{
      margin: 8px 0 15px 15px;
      font-family:PingFang SC;
      font-weight:700;
      color:rgba(51,51,51,1);
    }
    .AdressCard{
      background-color: #fff;
      display: flex;
      align-content: space-between; 
      border-bottom: #e5e5e5 solid 1px;
      padding: 40rpx 30rpx;
      .addr-left {
        flex-basis: 80%;
        .addr-userinfo {
          font-size: 30rpx;
          .xm {
            color: @primary;
            margin-right: 40rpx;
          }
          .phone {
            color: @primary;
          }
          .tag{
            font-size: 12px;
            display: inline-block;
            margin-left: 24rpx;
            .tag-item{
              width: 30px;
              height: 15px;
              margin: 0 4px;
              text-align: center;
              }
              .green{
                color: rgb(84, 251, 42);
                background-color: rgb(227, 255, 204);
              }
              .red{
                background-color: #FCDDDD;
              color: #FB2A2A;
              }
              .yellow{
                background-color: #FCEBCC;
              color: #FE6A00;
              }
              .blue{
                background-color: #DDEFFC;
              color: #38A4F0;
              }
            }
          }
        }
        .address {
          margin-top: 20rpx;
          color: @grey;
          font-size: 26rpx;
        }
      }
      .addr-right {
        flex-basis: 20%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .edit{
          background-image: url(http://sniu.2dian.com/xcx/static/matou/bianji-3.png);
          background-size:18px;
          background-repeat:no-repeat;
          width: 18px;
          height: 18px;
          // position: absolute;
          // left: 312px;
          // top: 38px;
        }
      }
      // flex-direction: column;
      // justify-content: flex-start;
      // position: relative;
      // padding-left: 5px;
      // padding-right: 5px;
      // 屏幕有左右滑动问题，暂时注释
      // >div{
      //   width: 80%;
      //   font-size: 15px;
      //   display: flex;
      //   flex-direction: row;
      //   margin: 20px 15px 10px 15px;
      //   .xm{
      //     font-family:PingFang SC;
      //     font-weight:400;
      //     margin-right: 15px;
      //     color:rgba(51,51,51,1);
      //   }
      //   .xb{
      //     margin: 0 10px 0 5px;
      //   }
      //   .phone{
      //     margin: 0 5px;
      //   }
      //   .tag{
      //     font-size: 12px;
      //     >span{
      //       display: inline-block;
      //       width: 30px;
      //       height: 15px;
      //       margin: 0 4px;
      //       background-color: #FCDDDD;
      //       color: #FB2A2A;
      //       text-align: center;
      //       &:nth-child(2){
      //          background-color: #DDEFFC;
      //          color: #38A4F0;
      //       }
      //     }
      //   }
      // }
      // .address{
      //   margin: 0px 15px 20px 15px;
      //   color: #787878;
      //   text-align: left;
      // }
     
    }
  }
  //  .hr{
  //    margin: 0 auto;
  //     width:345px;
  //     height:1px;
  //     background:rgba(229,229,229,1);
  //  }
  .btnOk{
   width: 100%;
   height: 45px;
   line-height: 45px;
   text-align: center;
   background-color: #FE6A00;
   color: #fff;
   font-size: 15px;
   position: fixed;
   bottom: 0;
 }


</style>
