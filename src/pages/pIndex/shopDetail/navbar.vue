<template>
    <div class="comp-navbar">
        <div class="placeholder-bar" :style="{height: navBarHeight + 'px'}">
        </div>
        <div class="navbar" :style="{height: navBarHeight + 'px', backgroundColor:navBackgroundColor}">
            <div class="nav-statusbar" :style="{height: statusBarHeight + 'px'}">

            </div>
            <div class="titlebar" :style="{height: titleBarHeight + 'px' }">
                <slot></slot>
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
      }
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
          self.statusBarHeight = system.statusBarHeight
          self.platform = system.platform
          self.model = system.model
          self.brand = system.brand
          self.system = system.system

          let platformReg = /ios/i
          // if (platformReg.test(system.platform)) {
          //   self.titleBarHeight = 44
          // } else {
          //   self.titleBarHeight = 48
          // }
          self.titleBarHeight = ((wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2) + wx.getMenuButtonBoundingClientRect().height

          self.navBarHeight = self.statusBarHeight + self.titleBarHeight
        }
      })
    },
    mounted () {
    },
    methods: {
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
      }
    }
  }
</script>

<style lang="less" scoped>
  .comp-navbar {
    width: 100vw;
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