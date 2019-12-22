<template>
    <div class="comp-navbar">
        <div class="placeholder-bar" :style="{height: navBarHeight + 'px'}">

        </div>
        <div class="navbar" :style="{height: navBarHeight + 'px', backgroundColor:navBackgroundColor}">
            <div class="nav-statusbar" :style="{height: statusBarHeight + 'px'}">

            </div>
            <div class="titlebar" :style="{height: titleBarHeight + 'px' }">
                <div class="bar-options">
                    <div class="opt opt-back" v-if='backVisible' @click='backClick()'>
                        <img src='/static/images/more.png' alt="" class="back-image">
                    </div>
                    <div class="line" v-if='backVisible && homePath'></div>
                    <div class="opt opt-home" v-if='homePath' @click='homeClick()'>
                        <img src="/static/images/fenxiang.png" alt="" class="home-image">
                    </div>
                </div>
                <div class="bar-title" :style="[{color:titleColor}]">
                    {{title}}
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
      // 标题颜色
      titleColor: {
        default: '#ffffff'
      },
      // 标题文字
      title: {
        required: false,
        default: '道道'
      },
      // 是否显示后退按钮
      backVisible: {
        required: false,
        default: false
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
          console.log(`system:`, system)
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
      console.log(`this.backVisible:`, this.backVisible)
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
      width: 100%;
      .nav-titlebar {
        // border: 1px solid green;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .bar-options {
          width: 170rpx;
          height: 60rpx;
          /*&.single {*/
            /*width: 87px;*/
            /*height: 30px;*/
          /*}*/
          display: flex;
          /*border: 1px solid hsla(0, 0%, 100%, .25);*/
          border: 1px solid rgba(255,255,255, 0.2);
          box-sizing: border-box;
          align-items: center;
          justify-content: space-around;
          position: absolute;
          left: 7px;
          display: flex;
          align-items: center;
          background: rgba(0,0,0, 0.1);
          border-radius: 27px;
          padding-right: 5rpx;
          .opt {
            width: 50rpx;
            height: 50rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .opt-back {
            .back-image {
              width: 36rpx;
              height: 34rpx;
            }
          }
          .line {
            display: block;
            height: 30rpx;
            width: 1px;
            background-color: rgba(255,255,255, 0.2);
          }
          .opt-home {
            .home-image {
              width: 36rpx;
              height: 34rpx;
            }
          }
        }
        .bar-title {
          width: 45%;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
    }
    .placeholder-bar{
      background-color: transparent;
      width: 100%;
    }
  }
</style>