<template>
  <div class="addrs">
    <div class="addr" v-for="(item,index) in addressList" :key="item.id" @click="selectAddr(index,item)">
      <div class="flag" :class="{active: activeIndex == index}"></div>
      <div class="addr-right">
        <div class="title" :class="{active: activeIndex == index}">{{item.title}}</div>
        <div class="address">{{item.address}}</div>
      </div>
    </div>
  </div>
</template>
<script>
var QQMapWX = require('../../../../lib/qqmap-wx-jssdk.min.js')

export default {
  data () {
    return {
      addressList: [
      ],
      activeIndex: -1
    }
  },
  computed: {

  },
  components: {

  },
  mounted () {
    this.activeIndex = -1
    this.qqmapsdk = new QQMapWX({
      key: 'SDKBZ-66T34-UZPUY-DDPCH-GO6DK-AYFKQ'
    })
    let { city, address } = this.$root.$mp.query
    this.getAddrs(city, address)
  },
  onUnload () {

  },
  methods: {
    getAddrs (city, address) {
      const that = this
      this.qqmapsdk.getSuggestion({
        region: city,
        keyword: address,
        page_size: 10,
        success: function (res) {
          let addrs = res.data
          if (addrs.length > 0) {
            that.addressList = []

            addrs.map(item => {
              that.addressList.push({
                id: item.id,
                title: item.title,
                address: item.address,
                ...item.location
              })
            })
          } else {
            wx.showToast({
              title: '暂无搜索结果',
              icon: 'none'
            })
          }
        },
        fail: function (res) {
          console.log('错误信息', res)
        }
      })
    },
    selectAddr (index, item) {
      console.log('选择', item)
      this.activeIndex = index
      this.$store.commit('ADDR_SET', item)
      wx.navigateBack({
        delta: 1
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .addrs {
    padding-bottom: 80rpx;
    .addr {
      display: flex;
      padding: 30rpx 30rpx 0;
      .flag {
        margin-top: 8rpx;
        margin-right: 30rpx;
        width: 20rpx;
        height: 20rpx;
        background: @border_gray;
        border-radius: 50%;
        &.active {
          background: @color-orange;
        }
      }
      .addr-right {
        border-bottom: 1px solid @line;
        padding-bottom: 30rpx;
        flex: 1;
        .title {
          font-size: 28rpx;
          margin-bottom: 15rpx;
          &.active {
            color: @color-orange;
          }
        }
        .address {
          font-size: 24rpx;
          color: @disabled;
        }
      }
    }
  }
</style>
