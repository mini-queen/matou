<template>
  <div class="container">
   <div class="icongroup">
      <button @click="goShare" class="button">
          <img src="https://sniu.2dian.com/xcx/static/matou/mianinvate.png"/>
        </button> 
        <button open-type='share' class="button">
           <img src="https://sniu.2dian.com/xcx/static/matou/shareinvate.png"/>
        </button> 
   </div>
   <div class="peopleList">
     <div class="title">
       <div>我的邀请记录</div>
       <div>共邀请<span style="color:#FE6A00;font-size:15px">{{peo}}</span>人</div>
       
     </div>
     <div class="hr"></div>
     <div v-for="item in records" :key="item.mvalidtime">
       <!--  -->
      <div class="infoCard" v-if="item.mVipFlag ==1">
       <div class="cover"><img :src="item.mheadurl" alt=""></div>
       <div class="middle"><div class="nickname">{{item.mnickname}}</div><div class="phone">{{item.mphone}}</div><div class="time"><span>邀请时间: </span><span>{{item.maddtime}}</span></div></div>
       <div class="right-vip">vip用户<div class="vip">1</div></div>
     </div>
          <div class="infoCard" v-else-if="item.mPartnerFlag ==1">
<div class="cover"><img :src="item.mheadurl" alt=""></div>
       <div class="middle"><div class="nickname">{{item.mnickname}}</div><div class="phone">{{item.mphone}}</div><div class="time"><span>邀请时间: </span><span>{{item.maddtime}}</span></div></div>
       <div class="right-vip">合伙人<div class="vip">1</div></div>
     </div>
     <div class="infoCard" v-else>
<div class="cover"><img :src="item.mheadurl" alt=""></div>
       <div class="middle"><div class="nickname">{{item.mnickname}}</div><div class="phone">{{item.mphone}}</div><div class="time"><span>邀请时间: </span><span>{{item.maddtime}}</span></div></div>
       <div class="right">普通用户</div>
     </div>
     <!--  --> 
     </div>
   </div>
   <div class="footer">
     便利码头 本地生活服务商
   </div>
  </div>
</template>
<script>
import {getInviterMemberList} from '../../../utils/api'
import { parse } from 'semver'
export default {
  data () {
    return {
      tuiShare: this.$tuiShare, // 分享推广图片
      records: {},
      peo: '',
      pageNo: 1,
      pageSize: 10
    }
  },
  computed: {

  },
  components: {

  },
  mounted () {
    this.getMember()
  },
  onUnload () {

  },
  onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      let token = wx.getStorageSync('DIAN_TOKEN')
        return {
          title: '便利码头',
          path: `/pages/index/main`,
          imageUrl: this.tuiShare + '?token?' + token
      }
    },
  methods: {
    goShare () {
      wx.navigateTo({
        url: '/pages/pMe/F2FExtension/main'
      })
    },
    async getMember () {
      var params = {
      pageNo: this.pageNo,
      pageSize: this.pageSize
      }

      var result = await getInviterMemberList(params)
      this.records = result.result.result.records
      this.peo = this.records.length
      console.log(result.result.result.records)
    }
  }
}
</script>

<style lang="less" scope>
page{
  background-color: #F69301;
}
button{
  background-color: rgba(255, 255, 255,0);
  // opacity:0
  border: none;
}
button::after {

width: 0;
height: 0;
}
.container {
  position: relative;
  color: @primary;
  font-size: 12px;
  text-align:left;
  margin: 0;
  padding: 0;
  width: 100%;
background-color: #F69301;
  background-image: url(https://sniu.2dian.com/xcx/static/matou/sharebg.png);
  background-size: 375px;
  background-repeat: no-repeat;
  overflow: hidden;
  .icongroup{
    width: 100%;
    position: absolute;
    top:250px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    img{
      width: 98.5px;
      height: 110.5px;
    }
  }
  .peopleList{
    margin: 0 auto;
    margin-top: 390px;
    width: 325px;
    // height: 355px;
    padding: 10px;
    background-color: #FDE3C9;
    border-radius: 10px;
    position: relative;
    .title{
      font-size: 15px;
      font-weight: 500;
      margin: 15px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .hr{
      width:345px;
      height:1px;
      position: absolute;
      left: 0;
      background:rgba(232,199,149,1);
      border-radius:0px 1px 1px 1px;
    }
    .infoCard{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 22px 0 0 0;
      height: 80px;
      border-bottom: 1px solid #e8c795;
      &:last-child{
        border-bottom: 0;
      }
      .cover{
        width: 45px;
        height: 45px;
        border-radius: 45px;
        // background-color: #fff;
        img{
          width: 45px;
          height: 45px;
           border-radius: 45px;
        }
      }
      .middle{
        width: 200px;
        height: 55px;
        // background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .phone{
          color: #787878;
        }
        .time{
          color:#787878;
        }
      }
      .right{
        width: 58px;
        height: 17px;
        border-radius: 8px;
        background-color: #FCEBCC;
        color: #FE6A00;
        text-align: center;
      }
      .right-vip{
        position: relative;
        width: 58px;
        height: 17px;
        border-radius: 8px;
        background-color: #FCEBCC;
        color: #FE6A00;
        text-align: center;
        .vip{
          width: 15.5px;
          height: 16.5px;
          background-image: url(../../../../static/images/crown-yellow.png);
          background-size:15.5px 16.5px;
          position: absolute;
          top:-10px;
          left: -8px;
          transform: rotate(-45deg);
        }
      }
    }
  }
  .footer{
    width: 100%;
    text-align: center;
    margin: 25px 0;
    color: #fff;
  }
}
</style>
