<template>
  <div class="container">
    <div v-if="!data">
    <div class="successIcon">
      <div class="img"></div>
    </div>
    <div class="tips">暂无活动</div>
    <div class="ad" @click="gotoBuy">超值0元购，立即前往 >></div>
    </div>


  <div class="activityList" v-else>
    <div class="card" @click="ruleClick(id)" :id="item.ruleId" v-for="(item,id) in data" :key="item.gnumber">
      <img :src="baseSrc+item.rulePic" :id="item.ruleId" alt="">
    </div> 
  </div>
  </div>
</template>
<script>
  import {getMemberActivityList} from '../../../utils/api'
  export default {
    data () {
      return {
        baseSrc: 'https://test-webchat.bianlimt.com',
        data: '',
        uuid: '-1',
        city: '宿迁市'
      }
    },
    computed: {
  
    },
    components: {

    },
    created () {
  
    },
   mounted () {
     this.getActivity()
    },
    onUnload () {
  
    },
    methods: {
      ruleClick (id) {
        var imgSrc = this.data[id].rulePic
        var price = this.data[id].ruleAmount
        wx.navigateTo({
          url: '/pages/pEncyclopedia/meActivityDetails/main?rulePic=' + imgSrc + '&ruleAmount=' + price
        })
      },
      gotoBuy () {
        wx.reLaunch({
          url: '/pages/order/main'
        })
      },
      getActivity: async function () {
        let parmas = {
          city: this.city,
          uid: this.uuid
         }
      let res = await getMemberActivityList(parmas)
      this.data = res.result.result
      console.log(res)
      // if (res.errCode === 'USER_200') {
      //   let result = res.result.result
      //   if (result) {
      //     let records = result
      //     if (records.length > 0) {
      //       this.encyList = records
      //       this.isShowNodata = false
      //     } else {
      //       this.isShowNodata = true
      //     }
      //   }
      // }
      }
    }
  }
</script>

<style lang="less" scope>
page {
  background-color: #F7F7F7;
}
.container {
  color: @primary;
  .successIcon{
    margin-top: 124px;
    text-align: center;
    width: 100%;
    .img{
      width: 152px;
      height: 137.5px;
      background-image: url(http://sniu.2dian.com/xcx/static/matou/gift.png);
      background-size: 152px 137.5px;
      margin: 0 auto;
    }
  }
  .tips{
    width: 100%;
    margin-top: 15px;
    margin-bottom: 70px ;
    text-align: center;
    font-size:12px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(120,120,120,1);
  }
  .ad{
    width:250px;
    height:45px;
    border-radius:5px;
    color:#fe6a00;
    margin: 0 auto;
    text-align: center;
    line-height: 45px;
    font-size:15px;
     background-image: url(http://sniu.2dian.com/xcx/static/matou/btnbg.png);
    background-size: 250px 45px;
    background-repeat: no-repeat;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(254,106,0,1);
  }
  .activityList{
    width: 100%;
    margin: 10px 0;
    padding: 20px 15px;
    box-sizing: border-box; 
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: #fff;
    img{
      width:345px;
      height:115px;
    }
  }
}
</style>
