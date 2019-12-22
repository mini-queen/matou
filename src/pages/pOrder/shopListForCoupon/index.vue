<template>
  <div class="container">
    <div class="shopList" v-for="item in shopList" :key="item.sId">
      <div class="shopitem">
        <div class="img">
          <img :src="baseUrl + item.sPic" alt="">
        </div>
        <div class="middle">
          <div class="Sname">{{item.sTitle}}</div>
          <div class="Saddress">{{item.sAddressDetail}}</div>
        </div>
        <div class="contact">
          <div class="phone">{{item.sMobile}}</div>
          <!-- <div class="jl">距您<span>{{item.distance}}</span>km</div> -->
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {couponShopList, getShoplistByOrderId} from '@/utils/api'

export default {
  data () {
    return {
      baseUrl: this.$baseUrl,
      shopList: [ // 店铺列表

      ],
      pageSize: 10,
      pageNo: 1,
      pageCount: 0,
      couponid: 0, // 优惠券ID
      flag: 1, // 1为展示优惠券店铺列表 2 为展示取货店铺列表
      orderId: '' // 订单id
    }
  },
  computed: {

  },
  components: {
  },

  onLoad (option) {
    this.couponid = option.couponid
    this.flag = option.flag
    this.orderId = option.orderId // 订单ID
    console.log('id: ' + this.couponid)
    console.log('orderId: ' + this.orderId)
 },

  mounted () {
    if (this.flag == 1) {
      this.getShopList()
    } else if (this.flag == 2) {
      this.getShopByOrderId()
    }
  },

   onReachBottom () {
      this.hasMore = this.pageCount > this.currentPage
      if (this.hasMore) {
        // 模拟请求接口、获取数据、添加数据
        setTimeout(async () => {
          this.pageNo++
          if (this.flag == 1) {
            await this.getShopList()
          } else if (this.flag == 2) {
            await this.getShopByOrderId()
          }
          this.hasMore = false
        }, 1000)
      }
    },

  onUnload () {

  },
  methods: {
    //  根据订单ID获取店铺列表
    async getShopByOrderId () {
      let param = {
          os_order_id: this.orderId,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
          let res = await getShoplistByOrderId(param)
          if (res.errCode === 'USER_200') {
            console.log(res)
            let result = res.result.result
            console.log(result)
            if (result) {
              let result = res.result.result
              this.currentPage = result.currentPage
              this.pageCount = result.pageCount
              if (result) {
                let records = result.records
                this.shopList = this.shopList.concat(records)
              }
            }
          }

          console.log('返回值', res)
      },
    // 根据优惠券ID获取店铺列表
    async getShopList () {
      let param = {
          c_id: this.couponid,
          page: this.pageNo,
          pageSize: this.pageSize
        }
          let res = await couponShopList(param)
          if (res.errCode === 'USER_200') {
            console.log(res)
            let result = res.result.result
            console.log(result)
            if (result) {
              let result = res.result.result
              this.currentPage = result.currentPage
              this.pageCount = result.pageCount
              if (result) {
                let records = result.records
                this.shopList = this.shopList.concat(records)
              }
            }
          }

          console.log('返回值', res)
      }

  }
}
</script>

<style lang="less" scope>
page{
  background-color: #f7f7f7;
}
.container {
  color: @primary;
  font-size: 12px;
  background-color: #fff;
  .shopList{
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    .shopitem{
      width: 100%;
      height: 98px;
      padding: 19.5px 0;
      box-sizing: border-box;
      border-bottom: 1px solid #E5E5E5; 
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .img{
        width: 59px;
        height: 59px;
        img{
            width: 59px;
            height: 59px;
        }
      }
      .middle{
        width: 240px;
        height: 59px;
        margin-left: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size:16px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        .Saddress{
          width: 147px;
          height: 32px;
          overflow: hidden;
          font-size:13px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(120,120,120,1);
        }
      }
      .contact{
        width: 80px;
        height: 59px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-end;
        .phone{
          font-size:13px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(120,120,120,1);
        }
        .jl{
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
