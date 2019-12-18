<template>
  <div class="container">
      <!-- 没有资质 -->
      <div v-if="none" class="none">
          <div class="img">
            <img src="https://sniu.2dian.com/xcx/static/matou/zanwutupian.png" alt="暂无">
          </div>
          <span>暂无图片~</span>
      </div>
      <!--  -->
      <div class="imgList">
          <swiper @change='change'>
              <div class="items" v-for="item in imgSrc" :key="item">
                  <swiper-item>
                      <img :src="baseUrl + item" alt="">
                      <input type="text" v-model="current">
                  </swiper-item>
              </div>
          </swiper>
      </div>
      <div class="count">
          <span>{{current}}</span> / <span>{{imgSrc.length}}</span>
          </div>
  </div>
</template>

<script>
import {getshopzizhi} from '../../../utils/api'
export default {
data () {
    return {
        baseUrl: this.$baseUrl2,
        none: false,
        shopId: '',
        imgSrc: [
            // {
            //     src: 'https://sniu.2dian.com/xcx/static/matou/yingye.png'
            // },
            //  {
            //     src: 'https://sniu.2dian.com/xcx/static/matou/yingye.png'
            // }
        ],
        imgLength: '',
        current: '1'
    }
},
onLoad (option) {
   this.shopId = option.shopId
   this.getshopzizhi()
},
methods: {
    change (e) {
        this.current = e.mp.detail.current + 1
    },
    async getshopzizhi () {
        var parmas = {
                shopId: this.shopId
        }
        var imgSrc = await getshopzizhi(parmas)
        this.imgSrc = imgSrc.result.result
    }

},
created () {
    this.none = !this.imgSrc
}

}
</script>

<style lang='less' scope>
page{ 
    background-color: #f7f7f7;
}
.container{
    
    .none{
        width: 125px;
        height: 180px;
        margin: 0 auto;
        margin-top: 148px;
        text-align: center;
        .img{
            width: 125px;
            height: 105.5px;
            margin-bottom: 33px;
            img{
            width: 125px;
            height: 105.5px;
            }
        }
        span{
            width: 100%;
            font-size:14px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(120,120,120,1);
        }
    }
    .imgList{
        width: 100%;
        height: 554px;
        swiper{
            height: 100%;
        }
        img{
        width: 100%;
        height: 554px;
        }
    }
    .count{
        width:100%;
        height:50px;
        background:rgba(0,0,0,1);
        opacity:0.4;
        text-align: center;
        line-height: 50px;
        color: #CCCCCC;
        span:first-child{
            color: #fff;
        }
    }
}

</style>