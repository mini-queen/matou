<template>
  <div class="container">
 <div class="messageList">
   <div class="card">
     <div class="time">2019-07-22 16:06:11</div>
     <div class="content">
       <div class="title">奖励到账通知</div>
       <div class="msg">
         <p> 亲爱的用户，您刚刚获得邀请奖励5.68元钱已经发放到您的账户，请您注意查收。
         <br/> 优惠活动多多，消费购好礼。</p>
        </div>
     </div>
   </div>
      <div class="card">
     <div class="time">2019-07-22 16:06:11</div>
     <div class="content">
       <div class="title">奖励到账通知</div>
       <div class="msg">
         <p> 亲爱的用户，您刚刚获得邀请奖励5.68元钱已经发放到您的账户，请您注意查收。
         <br/> 优惠活动多多，消费购好礼。</p>
        </div>
     </div>
   </div>
      <div class="card">
     <div class="time">2019-07-22 16:06:11</div>
     <div class="content">
       <div class="title">奖励到账通知</div>
       <div class="msg">
         <p> 亲爱的用户，您刚刚获得邀请奖励5.68元钱已经发放到您的账户，请您注意查收。
         <br/> 优惠活动多多，消费购好礼。</p>
        </div>
     </div>
   </div>
 </div>
  </div>
</template>
<script>

export default {
  data () {
    return {

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
  methods: {

  }
}
</script>

<style lang="less" scope>
page{
  background-color: #F7F7F7;
}
.container {
  height: 100vh;
  position: relative;
  color: @primary;
  font-size: 12px;
  text-align:left;
  margin: 0;
  padding: 0;
  width: 100%;
  .messageList{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .card{
      width: 92%;
      height: 159px;
      padding: 0 15px;
      display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
   
    .time{
      height: 49px;
      width: 100%;
      text-align: center;
      line-height: 49px;
    }
    .content{
      background-color: #fff;
      // height: 110px;
      padding: 20px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .title{
        font-size: 13px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
      }
      .msg{
        font-size:12px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(142,142,142,1);
      }
    }
    }
  }
}
</style>
