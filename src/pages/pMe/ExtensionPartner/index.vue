<template>
  <div class="container">
   <div class="codegroup">
     <div class="pic"></div>
     <div class="title">
       邀请好友成为店铺合伙人
       <br/> 获得邀请奖励
     </div>
    </div>
   <div class="peopleList">
     <div class="title">
       <div>我的邀请记录</div>
       <div>共邀请<span style="color:#FE6A00;font-size:15px;margin:0 3px;">{{peo}}</span>人</div>
       
     </div>
     <div class="hr"></div>
     <!-- <div class="infoCard">
       <div class="cover"><img src="/static/images/user.png" alt=""></div>
       <div class="middle"><div class="nickname">伊丽莎白美女</div><div class="phone">13345678907</div><div class="time"><span>邀请时间</span><span>2019-09-06 &nbsp; 18:24:34</span></div></div>
       <div class="right">普通用户</div>
     </div>
          <div class="infoCard">
       <div class="cover"><img src="/static/images/user.png" alt=""></div>
       <div class="middle"><div class="nickname">伊丽莎白美女</div><div class="phone">13345678907</div><div class="time"><span>邀请时间</span><span>2019-09-06 &nbsp; 18:24:34</span></div></div>
       <div class="right-vip">vip用户<div class="vip">1</div></div>
     </div>
          <div class="infoCard">
       <div class="cover"><img src="/static/images/user.png" alt=""></div>
       <div class="middle"><div class="nickname">伊丽莎白美女</div><div class="phone">13345678907</div><div class="time"><span>邀请时间</span><span>2019-09-06 &nbsp; 18:24:34</span></div></div>
       <div class="right-vip">合伙人<div class="vip">1</div></div>
     </div> -->
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
export default {
  data () {
    return {
      records: '',
      peo: '',
      pageNo: 1,
      pageSize: 10
    }
  },
  computed: {

  },
  components: {

  },
  onReachBottom () {
    this.pageNo = this.pageNo++
   this.getMember()
  },
  mounted () {
     this.getMember()
  },
  onUnload () {

  },
  methods: {
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
  overflow: hidden;

  .codegroup{
    width: 100%;
    height: 306.5px;
    background-color: #fff;
    padding-top: 22px;
    .pic{
     width: 210px;
     height: 210px;
     margin: 0 auto;
     background-image: url(http://sniu.2dian.com/xcx/static/matou/erweima.png);
     background-size: 210px 210px;
     background-repeat: no-repeat;

    }
    .title{
      width: 100%;
      text-align: center;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(120,120,120,1);

    }
  }
  .peopleList{
    width: 100%;
    margin: 0 auto;
    margin-top: 10px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 10px;
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
      width:100%;
      height:1px;
      position: absolute;
      left: 0;
      background:#E5E5E5;
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
