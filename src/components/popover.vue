<template>
    <div class="popover-wrapper" :class="[isShow?'show':'',isAnim?'anim':'']" :catchtouchmove="true">
        <div class="popover-body bottom" :class="[className]">
            <slot></slot>
        </div>
        <div class="mask" @click="close('mask')"></div>
    </div>
</template>

<script>

export default {
  data () {
    return {
      number: 0
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isAnim: {
      type: Boolean,
      default: false
    },
    isUnPass: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    close (val) {
      if (val === 'mask' && this.isUnPass) return
      this.$emit('closeModal')
    }
  }
}
</script>

<style lang="less">
@keyframes showPopover {
  0% {
    transform: translateY(100%);
  }
  45% {
    transform: translateY(55%);
  }
  80% {
    transform: translateY(20%);
  }
  100% {
    transform: translateY(0);
  }
}

.popover-wrapper {
  position: fixed;
  z-index: 98;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  &.anim {
    transition: opacity  0.3s linear ;
    .popover-body {
      transition: .3s linear;
      &.bottom {
        transform: translateY(100%);
      }
    }
    &.show {
      .popover-body {
        &.bottom {
          transform: translateY(0);
        }
      }
    }
  }
  &.show {
    height: 100%;
    opacity: 1;
    .mask {
      height: 100%;
    }
    // &.anim {
    //   .popover-body {
    //     animation: showPopover 0.3s;
    //   }
    // }
  }
  .mask {
    position: fixed;
    z-index: 99;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    height: 0;
  }
  .popover-body {
    position: absolute;
    z-index: 100;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: @color-white;
  }
  
}
</style>
