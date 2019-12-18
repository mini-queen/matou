<template>
  <div class="container">
    <div class="top">
      <div class="left">
        <span><img src="https://sniu.2dian.com/xcx/static/matou/gongzhonghao.png" alt="便利码头公众号"></span>
        <span><div class="title">便利码头公众号</div> </span>
      </div>
       <div class="right">
       <span><img src="https://sniu.2dian.com/xcx/static/matou/kefuerweima.png" alt="便利码头客服"></span>
        <span><div class="title">便利码头客服</div> </span>
      </div>

    </div>
    <div @click="callphone" class="bottom">
      <img src="/static/images/kefu.png" alt="">
      <span>官方客服热线：400-011-1818</span>
      <img src="/static/images/dianhua2.png" alt="">
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
     callphone () {
         wx.makePhoneCall({
                phoneNumber: '4000111818'
             })
      }
  }
}
</script>

<style lang="less" scope>
.container {
  color: @primary;
  font-size: 12px;
  height: 100vh;
  position: relative;
  .top{
    width: 100%;
    height: 314px;
    background-image: url(https://sniu.2dian.com/xcx/static/matou/aboutbg.png);
    background-size: 375px 314px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .left{
      width: 140px;
      height: 170px;
      span{
          width: 140px;
         
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
        img{
          width: 140px;
          height: 140px;
          background-color: #ccc;
        }
        .title{
          width: 140px;
          height: 24px;
          text-align: center;
          margin-top: 10px;
        }   
        
      }
    }
    .right{
      width: 140px;
      height: 170px;
      span{
          width: 140px;
         
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(255,255,255,1);
        img{
          width: 140px;
          height: 140px;
          background-color: #ccc;
        }
        .title{
          width: 140px;
          height: 24px;
          text-align: center;
          margin-top: 10px;
        }   
        
      }
    }
  }
  .bottom{
    width: 100%;
    height: 45px;
    position: absolute;
    bottom: 45px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    img{
      width: 22.5px;
      height: 22.5px;
      margin-right: 30px;
      margin-left: 15px;
      &:last-child{
        margin-right: 30px;
        margin-left:63px;
      }
    }
    span{
      font-size:14px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
    }
  }
}
</style>
