<template>
  <div class="wrap">
    <div v-if="num" class="icon-minus" @click="reduce"></div>
    <div v-if="num" class="text" @click="numHandle">{{num}}</div>
    <div class="icon-add" @click="add"></div>
  </div>
</template>

<script>
export default {
  name: 'add',
  props: {
    num: {
      type: Number,
      default: 0
    }
  },
  methods: {
    add () {
      this.$emit('add')
    },
    reduce () {
      this.$emit('reduce')
    },
    numHandle () {
      this.$emit('numHandle')
    }
  }
}
</script>

<style lang="less" scoped>
.wrap {
    width: 210rpx;
    height: 60rpx;
    display: flex;
    border: solid 1px @line;
    .icon-minus,.icon-add {
      width: 60rpx;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @disabled;
      font-size: 28rpx;
    }
    .text {
      width: 90rpx;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      border-left: solid 1px @line;
      border-right: solid 1px @line;
    }
}

</style>