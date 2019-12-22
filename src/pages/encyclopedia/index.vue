<template>
  <div class="container">
    <div class="bkList">
      <div class="card" @click="goDetail(item)" v-for="(item,index) in encyList" :key="index">
        <img :src="baseUrl+item.picSmall" alt="" >
        <div class="TitleContent">
          <div class="title">{{item.title}}</div>
          <div class="time">
            <!-- <span>{{item.pubDateStr}}</span> -->
            <!-- <span>{{item.readTimes || 0}}<span>阅读</span></span> -->
            <div><span class="tags" v-if="item.isOriginal == '1'">原创</span></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 触底加载 -->
    <div class="more-wrapper" v-show="hasMore">
      <span class="more-text">努力加载中···</span>
    </div>
    <div class="more-wrapper" v-show="pageCount == currentPage">
      <span class="more-text">我是有底线的</span>
    </div>
  </div>
</template>
<script>
  import { getEncyList } from '@/utils/api'
  export default {
    data () {
      return {
        baseUrl: this.$baseUrl,
        pageSize: 10,
        pageNo: 1,
        pageCount: 0,
        currentPage: -1,
        encyList: [], // 文章列表
        hasMore: false // 是否有更多数据
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
      this.getList()
    },
    onPullDownRefresh () {
      this.pageNo = 1
      this.getList(true)
    },
    onReachBottom () {
      this.hasMore = this.pageCount > this.currentPage
      if (this.hasMore) {
        // 模拟请求接口、获取数据、添加数据
        setTimeout(async () => {
          this.pageNo++
          await this.getList()
          this.hasMore = false
        }, 1000)
      }
    },
    onUnload () {
  
    },
    methods: {
      // 获取文章列表
      async getList (init = false) {
        let param = {
          page: this.pageNo,
          pageSize: this.pageSize
        }
        let res = await getEncyList(param)
        if (res.errMsg === '接口调用成功') {
          let result = res.result.result
          this.currentPage = result.currentPage
          this.pageCount = result.pageCount
          if (result) {
            let records = result.records
            if (init) {
              this.encyList = records
              setTimeout(() => {
                wx.stopPullDownRefresh()
              }, 500)
            } else {
              this.encyList = this.encyList.concat(records)
            }
          }
        }
      },
      // 跳转文章详情
      goDetail (item) {
        wx.navigateTo({
          url: '/pages/pEncyclopedia/detail/main?riId=' + item.riId + '&rcId=' + item.rcId
        })
      }
    }
  }
</script>

<style lang="less" scope>
page{
  background-color: #F7F7F7;
}
.container {
  color: @primary;
  font-size: @fs44;
  .more-wrapper {
    margin: 20rpx 0;
    text-align: center;
    .more-text {
      font-size: 24rpx;
      color: @border_gray;
    }
  }
  .bkList{
    padding: 0px 15px 0 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    background-color: #fff;
    .card{
      height: 111px;
      width: 345px;
      padding: 20px 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px solid rgba(229,229,229,1);

       img{
         width: 97px;
         height: 70px;
       }
       .TitleContent{
         width: 235px;
         height: 100%;
         display: flex;
         flex-direction: column;
         justify-content: space-between;
          .title{
            width: 235px;
            height: 40px;
            font-size:14px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
          }
          .time{
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            text-align: center;
            font-size:12px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(120,120,120,1);
            line-height: 40px;
              .tags{
                width:36px;
                height:17px;
                line-height: 17px;
                display: inline-block;
                background:rgba(252,235,204,1);
                border-radius:16px 18px 0px 16px;
                font-size:12px;
                font-family:PingFang SC;
                font-weight:400;
                color:rgba(254,106,0,1);
                text-align: center;
              }
          }

       }

    &:last-child{
      border: none;//最后一个不要显示边框
    }
    }
  }
}
</style>
