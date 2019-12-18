<template>
  <div class="container">
    <div class="title">
      <div class="bg">
        <div class="info">覆盖衣、食
          、住、行等多个品类的生活服务商，
          为每位用户打造三公里生活圈。</div>
      </div>
    </div>
    <div class="select">
      <div :class="item1" @click="handle(1)">平台介绍</div>
      <div :class="item2" @click="handle(2)">开店要求</div>
      <div :class="item3" @click="handle(3)">开店流程</div>
    </div>
    <div class="swiper">
      <!-- <swiper autoplay='false' :current="current" @change="swChange" > -->
        <div class="swiper-item" v-if="current==1">
          <img class="img1" src="http://sniu.2dian.com/xcx/static/matou/kaidianintro.png" alt="">
        </div>
        <div class="swiper-item" v-if="current==2">
          <img class="img2" src="http://sniu.2dian.com/xcx/static/matou/kaidianyaoqiu.jpg" alt="">
        </div class="swiper-item"  >
        <div class="swiper-item" v-if="current==3">
          <img class="img3" src="http://sniu.2dian.com/xcx/static/matou/kaidianliuc.png" alt="">
        </div>
      <!-- </swiper> -->

    </div>
    <div class="btn" @click="joinNow">申请开店</div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      item1: 'actived',
      item2: 'item',
      item3: 'item',
      current: 1
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
    swChange: function (e) {
      // console.log(e.mp.detail.current)

      // console.log(this.item1, this.item2, this.item3)
    },
    handle: function (e) {
      if (e === 1) {
        this.current = 1
      } else if (e === 2) {
          this.current = 2
      } else {
          this.current = 3
      }
      switch (e) {
        case 1:
          this.item1 = 'actived'
          this.item2 = 'item'
          this.item3 = 'item'
          break
          case 2:
           this.item1 = 'item'
          this.item2 = 'actived'
          this.item3 = 'item'
          break
          case 3:
           this.item1 = 'item'
          this.item2 = 'item'
          this.item3 = 'actived'
          break
      }
    },
    joinNow () {
      wx.navigateTo({
        url: '/pages/pOrder/shopJoin/main'
      })
    }
}
}
</script>

<style lang="less" scope>
swiper{
  height: 57vh;
  width: auto;
}
swiper-item{
  overflow: scroll;
}
page{
  background-color: #f7f7f7;
}
.container {
  color: @primary;
  font-size: 12px;
  text-align:center;
  // position: relative;
  .title{
    width: 100%;
    height: 100%;
    padding: 10px 15px;
    box-sizing: border-box;
    .bg{
      width: 345px;
      height: 132px;
      background-image: url(https://sniu.2dian.com/xcx/static/matou/ruzhubg.png);
      background-size: 345px 132px;
      overflow: hidden;
      .info{
        width: 321px;
        height: 33px;
        font-size:14px;
        margin: 78.5px 14px 20px 14px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
      }
    }
  }
  .select{
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 18px 15px;
    box-sizing: border-box;
    background-color: #fff;
    .item{
      height: 37px;
      width: 75px;
      text-align: center;
      line-height: 37px;
      font-size:15px;
      font-family:PingFang SC;
      font-weight:500;
      
    }
    .actived{
      height: 37px;
      width: 75px;
      text-align: center;
      line-height: 37px;
      font-size:15px;
      font-family:PingFang SC;
      font-weight:500;
      border-bottom: 1px solid #FE6A00;
      color:rgba(254,106,0,1);
    }
  }
  .swiper{
    width: 100%;
    // height: 1600px;
    margin-top: 10px;
    background-color: #fff;
    .img1{
    width: 375px;
    height: 1600px;
    .img2{
      width: 375px;
    height: 208px;
    }
    .img3{
       width: 375px;
    height: 208px;
    }
    }
  }
  .btn{
    width: 100%;
    height: 45px;
    text-align: center;
    line-height: 45px;
    background-color: #fe6a00;
    color: #fff;
    position: fixed;
    bottom: 0;
    font-size:15px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
}
</style>
