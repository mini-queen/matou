<template>
  <div class="container">
    <div class="title">
      <div class="zh">升级中敬请期待</div>
      <div class="en">Stay tuned for the upgrade</div>
    </div>
    <div class="pic">
      <div class="img"></div>
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

<style lang="less" scoped>
.container {
  color: @primary;
  font-size: @fs44;
  .title{
    width: 100%;
    text-align: center;
    margin-top: 80px;
    .zh{
      font-size:22.5px;
      font-family:FZLanTingHei-L-GBK;
      font-weight:400;
      color:rgba(44,44,44,1);
      line-height:72px;
    }
    .en{
      font-size:16px;
      font-family:FZLanTingHei-L-GBK;
      font-weight:400;
      color:rgba(154,154,154,1);
      line-height:60px;
    }
  }
  .pic{
    margin-top:55px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .img{
      width: 225.5px;
      height: 198px;
    background-image: url(http://sniu.2dian.com/xcx/static/matou/update.png);
    background-size: 225.5px 198px;
    }
  }
}
</style>
