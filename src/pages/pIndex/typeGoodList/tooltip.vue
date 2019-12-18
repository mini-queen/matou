<template>
    <div class="tooltip" v-show="isShow">
        <div class="favorite">
            <img src="/static/images/favorite.png" alt="" click="favorite">
            <span class="tip">收藏</span>
        </div>  
        <div class="share">
            <img src="/static/images/share.png" alt="" click="share">
            <button open-type="share" class="share-button tip" @click="share">分享</button>
        </div>  
    </div>
</template>
<script>
  export default {
    props: {
      isShow: false
    },
    data () {
      return {
  
      }
    },
    methods: {
      favorite () {
        this.$emit('favorite')
      },
      share () {
        this.$emit('share')
      }
    }
  }
</script>

<style lang="less" scoped>
.tooltip {
      position: absolute;
      left: 30rpx;
      bottom: -152rpx;
      z-index: 5;
      width:184rpx;
      // height:152rpx;
      border-radius: 10rpx;
      box-shadow:0px 3rpx 4rpx 0rpx rgba(0, 0, 0, 0.1);
      background: @color-white;
      padding: 22rpx 42rpx;
      box-sizing: border-box;
      .favorite {
          margin-bottom: 22rpx;
          img {
              width: 31rpx;
              height: 28rpx;
          }
          .tip {
              margin-left: 15rpx;
              font-size: 28rpx; 
          }
      }
      .share {
          img {
              width: 28rpx;
              height: 28rpx;
              vertical-align: middle;
          }
          .tip {
              margin-left: 15rpx; 
              font-size: 28rpx;
          }
          button{
            border:none;
            padding:0;
            display: inline-block;
            vertical-align: middle;
            border-color:#fff!important;
            background:#fff;
            line-height: none;
            &::after{
              border:none !important
            }
          }
      }
  }
</style>