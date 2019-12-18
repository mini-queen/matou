<template>
  <div class="container">
    <div class="search">
      <div class="box">
        <img src="/static/images/search.png" alt="">
      </div>
      <input confirm-type='search' type="text" placeholder-style="color:#ccc" :placeholder="keys" name="" id="">

    </div>
    <!-- 搜索条 -->
    <!-- 没有搜到结果 -->
    <div class="result" v-if="nogoods">
      <img src="/static/images/nogoods.png" alt="">
      <div class="tips">没有符合条件的商家或商品</div>
    </div>
    <!-- 没有搜到结果 -->

    <!-- 有结果 -->
     <div class="result" v-if="!nogoods">
      <!-- 结果列表 -->
    </div>
    <!-- 有结果 -->
    <div class="tuijian">为您推荐</div>
    <div class="tjpic">
      <div class="item">
        <div class="shopname">
          <div>林家便利超市</div>
          <div>距您<span>127</span>km</div>
        </div>
        <img src="/static/images/shop.png" alt="">
        <div class="tjgoods">
          <img src="/static/images/shop.png" alt="">
          <img src="/static/images/shop.png" alt="">
        </div>
      </div>
        <div class="item">
        <div class="shopname">
          <div>林家便利超市</div>
          <div>距您<span>127</span>km</div>
        </div>
        <img src="/static/images/shop.png" alt="">
        <div class="tjgoods">
          <img src="/static/images/shop.png" alt="">
          <img src="/static/images/shop.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      keys: '冰淇淋',
      nogoods: true
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
  background-color: #f7f7f7;
}
.container {
  color: @primary;
  font-size: 12px;
  // text-align:center;
  .search{
    width: 100%;
    height: 48px;
    padding: 6px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid #E5E5E5;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    input{
      width: 90%;
      height: 32px;
      background-color: #EDEDED;
      line-height: 32px;
    }
    .box{
      width: 10%;
      height: 32px;
      background-color: #EDEDED;
      img{
      width: 14px;
      height: 14px;
      position: absolute;
      top: 15px;
      left: 15px;
    }
    }
    
  }
  .result{
    width: 100%;
    min-height: 267px;
    background-color: #FFFFFF; 
    img{
      margin-top: 69px;
      margin-left: 126.5px;
      width: 121.5px;
      height: 81px;
    }
    .tips{
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-top: 20px;
      font-size:13px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(153,153,153,1);
    }

  }
  .tuijian{
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding-left: 15px;
    background-color: #fff;
    font-size:17px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .tjpic{
    width: 100%;
    padding: 25px 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .item{
      width: 167px;
      height: 250.5px;
      background-color: #fff;
      margin-right: 11px;
      position: relative;
      &:nth-child(2n){
        margin-right: 0;
      }
      .shopname{
        position: absolute;
        left: 10px;
        top: 122.5px;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        div:last-child{
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(229,229,229,1);
        }
      }
      img{
        width: 167px;
        height: 167px;

      }
      .tjgoods{
        width: 167px;
        height: 83.5px;
        img{
           width: 83.5px;
           height: 83.5px;
        }
      }
    }
  }
}
</style>
