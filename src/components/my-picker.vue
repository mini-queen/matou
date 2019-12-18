<template>
<div class="my-picker-wrap"  catchtouchmove="return">
    <div class="my-picker" v-if="position == 'bottom'">
        <div class="content">
            <div class="item" v-for="(item,index) in data" :key="index" @click="select(item)">
                {{item.name}}
            </div>
        </div>

    </div>
    <div v-else>
      <slot></slot>  
    </div>
</div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    position: {
      type: String,
      default: 'bottom'
    }
  },
  onLoad () {
    this.isShow = false
  },
  data () {
    return {
      // isShow: false,
      dataList: [{name: '拍照'}, {name: '从相册中选择'}]
    }
  },
  methods: {
    cancle () {
      this.isShow = false
    },
    select (item) {
      this.isShow = false
      this.$emit('changeSelect', item)
    }
  }
}
</script>
<style lang="less" scoped>
.my-picker-wrap{
    position: fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    z-index:9999;
    background:rgba(0,0,0,.36);
    text-align:center;
    font-size:30rpx;
    visibility:block;
    transition: visibility .2s linear;
    &.hidden{
       visibility: hidden;
        .my-picker{
            height: 0;
        }
    }
   .my-picker{
        position:absolute;    
        bottom:30rpx;
        left:30rpx;
        right:30rpx;
        height:300rpx;
        transition:height .2s linear;
        .content{
            border-radius: 10rpx;
            background: #fff;
            .item{
                line-height:90rpx;
                height:90rpx;
                border-bottom:1rpx solid @line;
                &:last-of-type{
                    border-bottom:none;
                }
            }
        }
        .cancle{
            background: #fff;
            border-radius: 10rpx;
            margin-top:4rpx;
            line-height:90rpx;
            height:90rpx;
        }
   }
   
}
</style>