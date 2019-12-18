<template>
    <div class="comp-navbar">
        <div class="placeholder-bar" :style="{height: navBarHeight + 'px'}">
        </div>
        <div class="navbar" :style="{height: navBarHeight + 'px', backgroundColor:navBackgroundColor}">
            <div class="nav-statusbar" :style="{height: statusBarHeight + 'px'}">

            </div>
            <div class="titlebar" :style="{height: titleBarHeight + 'px' }">
                <div class="bar-wrapper">
                  <img src="/static/images/dingweidian.png" @click="gotoLocation" alt="" class="map-img">
                  <span class="address" @click="gotoLocation">{{address || '定位中'}} > </span>
                    <div class="search-wrapper center-left">
                      <img src="/static/images/search.png" alt="" class="search-img">
                      <div @click="search"><input type="text" class="search-input" placeholder="搜索" @input="search"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    props: {
      // 导航栏背景色
      navBackgroundColor: {
        default: 'transparent'
      },
      // home按钮的路径
      homePath: {
        required: false,
        default: ''
      },
      // 定位地点
      address: String
    },
    data () {
      return {
        statusBarHeight: '', // 状态栏高度
        titleBarHeight: '', // 标题栏高度
        navBarHeight: '', // 导航栏总高度
        platform: '',
        model: '',
        brand: '',
        system: ''
      }
    },
    beforeMount () {
      const self = this
      wx.getSystemInfo({
        success (system) {
          console.log(`system:`, system)
          self.statusBarHeight = system.statusBarHeight
          self.platform = system.platform
          self.model = system.model
          self.brand = system.brand
          self.system = system.system

          let platformReg = /ios/i
          if (platformReg.test(system.platform)) {
            self.titleBarHeight = 44
          } else {
            self.titleBarHeight = 48
          }

          self.navBarHeight = self.statusBarHeight + self.titleBarHeight
        }
      })
    },
    mounted () {
    },
    methods: {
      goSearch () {
        let token = wx.getStorageSync('DIAN_TOKEN')
        if (!token) {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
        }
         wx.navigateTo({
              url: '/pages/pIndex/searchKeys/main'
          })
      },
      backClick () {
        if (this.getCurrentPages().length === 1) {
          // 打开分享卡片无法回退
          wx.redirectTo({
            url: this.homePath
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      },
      homeClick () {
        wx.switchTab({
          url: this.homePath
        })
      },
      gotoLocation () {
        //  wx.navigateTo({
        //       url: '/pages/pMe/addressListForSelect/main?address=${this.address}'
        //   })
          wx.navigateTo({url: `/pages/pMe/addressListForSelect/main?address=${this.address}`})
      },
      search (e) { // 搜索
        let token = wx.getStorageSync('DIAN_TOKEN')
        if (!token) {
          wx.navigateTo({
              url: '/pages/pIndex/login/main'
          })
          return
        }
         wx.navigateTo({
              url: '/pages/pIndex/searchKeys/main?type=0'
          })
        // this.$emit('inputSearch', e.target.value)
      }
    }
  }
</script>

<style lang="less" scoped>
  .bar-wrapper {
    display: flex;
    align-items: center;
    padding-left: 30rpx;
    height: 100%;
    .map-img {
      width: 35rpx;
      height: 40rpx;
    }
    .address {
      margin: 0 14rpx;
      font-size: 26rpx;
    }
    .search-wrapper {
      background: @input-bg;
      width: 300rpx;
      height: 50rpx;
      padding-left: 20rpx;
      .search-img {
        width: 28rpx;
        height: 28rpx;
      }
      .search-input {
        margin-left: 20rpx;
        font-size: 28rpx;
      }
    }
  }
  .comp-navbar {
    // width: 100vw;
    .navbar {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      z-index: 10000;
      .nav-statusbar {
        width: 100vw;
        background: @color-white;
      }
      .titlebar {
        width: 100vw;
        background: @color-white;
      }
    }
  }
</style>