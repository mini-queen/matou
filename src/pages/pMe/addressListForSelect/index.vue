<template>
  <div class="container">
    <div class="Toast" v-if="msg"><img src="/static/images/xiaoxi.png" alt=""> 因各地区店铺和服务不同，请选择准确的收货地址 <img @click="closeMsg" src="/static/images/X.png" alt=""></div>
    <div class="dztitle">当前定位</div>
    <div class="dwbar">
      <div><img src="/static/images/dingweidian.png" alt=""> {{address =='' ? '定位中': address}}</div>
      <div @click="getLocation"><img src="/static/images/dingwei-4.png" alt="" >重新定位</div>
    </div>
    <div class="dztitle">我的地址</div>
    <div class="AddressList">
      <div v-for="(item,index) in addressList" :key="index">
        <div class="AdressCard" @click="chooseOneAddr(item)">
          <div>
            <div class="xm">{{item.maName}}</div>
            <!-- <div class="xb">(女士)</div> -->
            <div class="phone">{{item.maPhone}}</div>
            <!-- <div class="tag"><span>默认</span><span>公司</span></div> -->
             <div class="tag">
                <span class="tag-item red" v-if="item.maState">默认</span>
                <span class="tag-item blue" v-if="item.maLabel==0">公司</span>
                <span class="tag-item yellow" v-if="item.maLabel==1">家</span>
                <span class="tag-item green" v-if="item.maLabel==2">学校</span>
              </div>
              
          </div>
          <div class="address">{{item.pName + item.cName + item.aName + item.ccName + item.maDetail}}</div>
          <!-- <div class="edit" @click="addNewAddress(item.maId)"></div> -->
        </div>
        <div class="hr"></div>
      </div>
    </div>
    <!-- 地址列表 -->
    <div class="btnOk" v-if="isShowAdd" @click="addNewAddress(0)">新增收货地址</div>
  </div>
</template>
<script>
import { getUserAddress, acquiringPersonnelLocation } from '@/utils/api'
var QQMapWX = require('../../../../lib/qqmap-wx-jssdk.min.js')
export default {
  data () {
    return {
      addressList: [],
      msg: true,
      last_location: '定位中',
      address: '',
      lat: 0.0,
      lng: 0.0,
      isShowAdd: false,
      hand_move: 0 // 是否手动设置
    }
  },

  onLoad (option) {
    this.address = option.address
    console.log(option.address, 'address: ')
  },
  onShow () {
    this.doGetUserList()
    this.acquiringPersonnelLocation()
    let token = wx.getStorageSync('DIAN_TOKEN')
    if (token) {
         this.isShowAdd = true
      }
  },
  computed: {},
  components: {},
  mounted () {
    this.qqmapsdk = new QQMapWX({
        key: 'SDKBZ-66T34-UZPUY-DDPCH-GO6DK-AYFKQ'
      })
  },
  onUnload () {
    wx.hideLoading()
  },
  methods: {
    // 获取当前定位
    async acquiringPersonnelLocation () {
      var params = {
        hand_move: this.hand_move,
        lng: this.lng,
        lat: this.lat
      }
      var res = await acquiringPersonnelLocation(params)
      this.last_location = res.result.result.last_location
      console.log(res)
    },
    addNewAddress (maid) {
      console.log('addNewAddress...')
      let token = wx.getStorageSync('DIAN_TOKEN')
      if (token) {
          wx.navigateTo({ url: `/pages/pMe/addAddress/main?maId=${maid}` + `&flag=add` })
      } else {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
      }
    },
    // 选择地址
    chooseOneAddr (item) {
      console.log(item.ccName, 'ccName')
      console.log(item, 'item: ')
      wx.setStorageSync('CURRENT_ADDRESS', item.ccName)
      wx.setStorageSync('CURRENT_CITY', item.cName)
      wx.setStorageSync('LONGITUDE', item.maLat)
      wx.setStorageSync('LATITUDE', item.maLon)
      wx.setStorageSync('isRefresh', 1)
      wx.switchTab({ // 跳转首页
                          url: '/pages/index/main'
      })
      // wx.navigateBack({
      // delta: 2
      // })// 返回上一页面
    },
    // 获取
    async doGetUserList () {
      let params = {}
      let data = await getUserAddress(params)
      if (data) {
        // this.data = data.result.result
        this.addressList = data.result.result.list
      }
      console.log(data)
    },
    // 重新定位
    getLocation () {
        const that = this
         wx.showLoading({
           title: '重新定位...'
        })
        console.log('getLocation')
        wx.getLocation({
          type: 'wgs84',
          isHighAccuracy: true,
          success (res) {
            console.log(res)
            const {latitude, longitude} = res
            that.longitude = longitude
            that.latitude = latitude
            wx.setStorageSync('LONGITUDE', longitude)
            wx.setStorageSync('LATITUDE', latitude)
            that.qqmapsdk.reverseGeocoder({
              location: {
                latitude,
                longitude
              },
              success: function (res) {
                that.address = res.result.ad_info.city
                console.log('定位信息', that.address)
                 wx.hideLoading()
                 wx.setStorageSync('CURRENT_ADDRESS', that.address)
                 wx.setStorageSync('LONGITUDE', that.longitude)
                 wx.setStorageSync('LATITUDE', that.latitude)
                 wx.setStorageSync('isRefresh', 1)

                  wx.navigateBack({
                  delta: 2
                  })// 返回上一页面
              },
              fail: function (error) {
                console.error(error)
                that.addr = '定位失败'
                 wx.hideLoading()
              }
            })
          }
        })
      },
    closeMsg () {
      this.msg = false
    }
  }
}
</script>

<style lang="less" scope>
page {
  background-color: #f7f7f7;
}
.container {
  height: 100vh;
  background-color: #f7f7f7;
  color: @primary;
  font-size: 12px;
  text-align: left;
  margin: 0;
  padding: 0;
  a {
    margin-top: 10px;
    color: #fe6a00;
  }
  .Toast {
    width: 750rpx;
    height: 60rpx;
    line-height: 60rpx;
    display: flex;
    padding:  0 30rpx;
    box-sizing: border-box;
    flex-direction: row;
    justify-content: space-between;
    background: rgba(255, 255, 255, 1);
    border-radius: 10rpx;
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(153,153,153,1);
    img{
      margin-top: 19rpx;
      width: 22rpx;
      height: 22rpx;
      vertical-align: middle;
      &:last-child{
        width: 20rpx;
        height: 20rpx;
      }
    }
  }
  .dwbar {
    width: 750rpx;
    height: 100rpx;
    line-height: 100rpx;
    background: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 30rpx;
    box-sizing: border-box;
    font-size:28rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    img{
      width: 26rpx;
      height: 30rpx;
      vertical-align: middle;
      margin-right: 15rpx;
      &:last-child{
        width: 36rpx;
        height: 36rpx;
      }
    }
  }
  .dztitle {
    padding: 0 28rpx;
    box-sizing: border-box;
    height: 100rpx;
    line-height: 100rpx;
    widows: 100%;
  }
  .AddressList {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 10px 0;
    margin-bottom: 40px;
    .title {
      margin: 8px 0 15px 15px;
      font-family: PingFang SC;
      font-weight: 700;
      color: rgba(51, 51, 51, 1);
    }
    .AdressCard {
      background-color: #fff;
      // padding: 20px 15px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-content: space-between;
      position: relative;
      border-bottom: #e5e5e5 solid 1px;
      padding-left: 5px;
      padding-right: 5px;
      > div {
        width: 80%;
        font-size: 15px;
        display: flex;
        flex-direction: row;
        margin: 20px 15px 10px 15px;
        .xm {
          font-family: PingFang SC;
          font-weight: 400;
          margin-right: 15px;
          color: rgba(51, 51, 51, 1);
        }
        .xb {
          margin: 0 10px 0 5px;
        }
        .phone {
          margin: 0 5px;
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
      .address {
        margin: 0px 15px 20px 15px;
        color: #787878;
        text-align: left;
      }
    }
  }
  //  .hr{
  //    margin: 0 auto;
  //     width:345px;
  //     height:1px;
  //     background:rgba(229,229,229,1);
  //  }
  .btnOk {
    margin: 127rpx auto;
    margin-bottom: 127rpx;
    line-height: 45px;
    text-align: center;
    // background-color: #fe6a00;
    color: #FE6A00;
    font-size: 15px;
    width: 280rpx;
    height: 90rpx;
    border: 1px solid rgba(254, 106, 0, 1);
    border-radius: 10rpx;
    // margin-top: 127rpx;
    
  }
}
// .edit{
//   background-image: url(http://sniu.2dian.com/xcx/static/matou/bianji-3.png);
//   background-size:18px;
//   background-repeat:no-repeat;
//   width: 18px;
//   height: 18px;
//   position: absolute;
//   left: 312px;
//   top: 38px;
// }
</style>
