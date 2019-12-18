<template>
  <div class="container">
 <div class="messageList">
    <div class="tips">暂无消息</div>
   <!-- <div class="card" @click="gotoDetail(1)">
     <div class="left">
       <div class="ico"><div class="msgCount">10</div><img src="https://sniu.2dian.com/xcx/static/matou/msg36.png" alt=""></div>
       <div class="content">
         <div class="title">系统通知</div>
         <div class="msg">奖励到</div>
       </div>
     </div>
     <div class="right">
       2019-07-22
     </div>
   </div>
      <div class="card" @click="gotoDetail(1)">
     <div class="left">
       <div class="ico"><div class="msgCount">10</div><img src="https://sniu.2dian.com/xcx/static/matou/msg36.png" alt=""></div>
       <div class="content">
         <div class="title">系统通知</div>
         <div class="msg">奖励到账</div>
       </div>
     </div>
     <div class="right">
       2019-07-22
     </div>
   </div> -->
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

    gotoDetail (id) {
      wx.navigateTo({
        url: '/pages/pMe/messageDetails/main?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scope>
page{
  background-color: #ffffff;
}
.container {
  
  position: relative;
  color: @primary;
  font-size: 12px;
  text-align:left;
  margin: 0;
  padding: 0;
  background-color: #fff;
  width: 100%;
  .messageList{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #fff;
    .tips{
    width: 100%;
    margin-top: 15px;
    margin-bottom: 70px ;
    text-align: center;
    font-size:12px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(120,120,120,1);
   }
    .card{
      width: 92%;
      height: 80px;
      padding: 0 15px;
      display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom:1px solid #ccc;
    .left{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .ico{
        margin-right: 15px;
        position: relative;
        img{
          width: 35px;
          height: 35px;
         }
         .msgCount{
           width: 20px;
           height: 20px;
           border-radius: 50%;
           background-color: #ff0000;
           color: #fff;
           position: absolute;
           top: -5px;
           right: -5px;
           text-align: center;
         }
    }
    
    }
    }
  }
}
</style>
