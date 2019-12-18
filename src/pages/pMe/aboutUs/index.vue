<template>
  <div class="container">
    
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
  height: 2436rpx;
  width: 100%;
  position: relative;
  background-image: url(https://sniu.2dian.com/xcx/static/matou/aboutus.png);
  background-size: 750rpx 2436rpx;
}
</style>
