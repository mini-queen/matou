<template>
  <div class="container">

  </div>
</template>
<script>

export default {
  data () {
    return {
      name: ''

    }
  },
  onLoad (option) {
    if (option.name) {
       this.name = option.name
    }
    wx.setNavigationBarTitle({
      title: this.name
    })
  },
  computed: {

  },
  components: {

  },
  mounted () {

  },
  onUnload () {
    this.name = ''
  },
  methods: {

  }
}
</script>

<style lang="less" scope>
.container {
  color: @primary;
  font-size: 12px;
  text-align:center;
  width: 100%;
  height: 100vh;
  background-image: url(https://sniu.2dian.com/xcx/static/matou/qidai.png);
  background-size: cover;
  background-repeat: no-repeat;
  
}
</style>
