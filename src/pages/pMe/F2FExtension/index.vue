<template>
  <div class="container">
    <div class="codebox">
      <div class="nickname"></div>
      <div class="title">邀请您0元购</div>
      <div class="code"><img :src="shareUrl" alt=""></div>
      <!-- <div class="footer">长按保存图片</div> -->
    </div>
    <div class="info">

      <div class="items">
        <div class="circle">1</div><span>好友打开微信</span>
      </div>
      <div class="items">
        <div class="circle">2</div><span>点右上角“+”</span>
      </div>
      <div class="items">
        <div class="circle">3</div><span>扫一扫二维码</span>
      </div>
      <div class="items">
        <div class="circle">4</div><span>好友完成登录</span>
      </div>
    </div>
  </div>
</template>
<script>
import { genSharepic } from '@/utils/api'
export default {
  data () {
    return {
      baseUrl: this.$baseUrl,
      baseUrl3: this.$sharePic,
      shareUrl: ''
    }
  },
  computed: {

  },
  components: {

  },
  mounted () {
    this.doGenSharepic()
  },
  onUnload () {

  },
  methods: {

    async doGenSharepic () {
      let jumpUrl = 'pages/pIndex/main'
      let params = '123'
      let data = await genSharepic({ page: jumpUrl, scene: params })
      this.shareUrl = this.baseUrl3 + data.result.result
      console.log(this.shareUrl, 'erweima')
    }

  }
}
</script>

<style lang="less" scope>
.container {
  position: relative;
  color: @primary;
  font-size: 12px;
  text-align: left;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url(http://sniu.2dian.com/xcx/static/matou/shareMoneybg.png);
  background-size: 375px;
  background-color: #f59301;
  background-repeat: no-repeat;
  .codebox {
    position: absolute;
    top: 141.5px;
    left: 61px;
    width: 253px;
    height: 290px;
    padding: 13px 0px;
    background-image: url(https://sniu.2dian.com/xcx/static/matou/erweimabg.png);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .nickname {
      font-size: 15px;
      font-weight: 600;
      text-shadow: 1px 1px 0 white, 1px -1px 0 white, -1px -1px 0 white,
        -1px 1px 0 white;
      color: #fe6a00;
    }
    .title {
      font-size: 28px;
      text-shadow: 2px 2px 0 white, 2px -2px 0 white, -2px -2px 0 white,
        -2px 2px 0 white;
      font-weight: 700;
      color: #fe6a00;
    }
    .code {
      width: 205px;
      height: 205px;
      background-color: #fff;
      img {
        width: 205px;
        height: 205px;
      }
    }
  }
  .info {
    position: absolute;
    top: 490px;
    left: 71px;
    width: 253px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    .items {
      width: 50%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      margin-bottom: 29rpx;
      .circle {
        width: 20px;
        height: 20px;
        background: linear-gradient(
          153deg,
          rgba(252, 184, 113, 1) 0%,
          rgba(251, 136, 43, 1) 100%
        );
        border-radius: 50%;
        text-align: center;
        margin-right: 9px;
        color: #de6701;
      }
      span {
        color: #fdd4ab;
      }
    }
  }
}
</style>
