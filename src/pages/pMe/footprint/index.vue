<template>
  <div class="container">
   <div class="none" v-if="!footprint">
     <img src="https://sniu.2dian.com/xcx/static/matou/moreshop.png" alt="">
     <span>好店排着队期待您光临</span>
   </div>
   <!-- 没有数据显示 空 -->
   <!-- 有数据 开始渲染 footprint控制显示隐藏-->
   <div v-else-if="footprint==true && editStatus ==false">
   <!--单日浏览记录开始  -->
    <div class="card" v-for="(items,i) in data" :key="i">
       <div class="timeTitle" v-if="items.shopList.length !==0">{{items.lastTimeStr}}</div>
       <div class="content">
         <div class="shopinfos" @click="goShopDetail(item.shopId)" v-for="item in items.shopList" :key="item.sId">
            <img :src="basesrc +item.sPic" alt="">
            <!-- <img src="/static/images/moreshop.png" alt=""> -->
            <div class="shop">
              <div class="Stitle">{{item.sTitle}}</div>
              <div class="Scount"><span>月售</span> {{item.monthSale}}<span>单</span> </div>
              <div class="Sdec">{{item.sLabel}}</div>
              <div class="Smain">
                <!-- <div class="tags">蛋糕蛋卷</div>
                <div class="tags">土产干货</div> -->
              </div>
            </div>
             <div class="distance">{{item.distance}}</div>
             <div class="hr"></div>
         </div>
       </div>       
     </div>
    </div>
   <!-- 单日浏览记录结束 -->
     <!-- 编辑模式 -->
     <div v-if="editStatus">
      <div class="card"  v-for="(items,i) in data" :key="i">
        <checkbox-group @change='checkstatus'>
          <div class="Tradio"   v-if="items.shopList.length !==0">
       <div class="timeTitle" >{{items.lastTimeStr}}</div>
          </div>
         
       <div class="content">
          <checkbox class="radio" 
          :id="item.mtsId" 
          v-model="item.mtsId"   
          v-for="item in items.shopList" 
          :key="item.sId"
          :checked="item.isChecked"
          @click.stop="changeItemCheck(item)"
          >
          <div class="shopinfos">
            <img :src="basesrc + item.sPic" alt="">
            <div class="shop">
              <div class="Stitle">{{item.sTitle}}</div>
              <div class="Scount"><span>月售 </span> {{item.monthSale}} <span>单</span> </div>
              <div class="Sdec">{{item.sLabel}}</div>
              <div class="Smain">
                <!-- <div class="tags"></div>
                <div class="tags"></div> -->
              </div>
            </div>
             <div class="distance">{{item.distance}}</div>
             <div class="hr"></div>
         </div>
         </checkbox>
     </div>
        </checkbox-group>
      </div>
     </div>
     <!-- 编辑模式 -->
  
   <!-- 单日浏览记录结束 -->

   <div class="btn" @click="edit(true)" v-if="!editStatus">编辑</div>
   <div class="delbox" v-if="editStatus">
     
        <div class="allcheck">
          <checkbox :checked="checkedAll" @click="checkedAllHandler(checkedAll)">
          全选
          </checkbox>
          </div>
          <div class="right">
          <div class="btnDel" @click="delMemberTrackShop">删除</div>
          <div class="btnD" @click="edit(false)">取消</div>
          </div>
         
     

     </div>
  </div>
</template>
<script>
  import {getMemberTrackShopList, delMemberTrackShop} from '../../../utils/api'
  export default {
    data () {
      return {
        basesrc: this.$baseUrl2,
        footprint: false, // 有足迹
        editStatus: false, // 切换到编辑
        longitude: '0.0',
        latitude: '0.0',
        pageSize: 10,
        pageNo: 1,
        data: '', // 足迹列表
        mtsIds: '', // 用户ID
        checkedAll: false, // 全选
        allLen: 0 // 足迹长度
      }
    },
    computed: {
  
    },
    components: {

    },
    created () {
  
    },
    mounted () {
      this.getfootPrint()
      this.setFlag()
    },
    onUnload () {
       this.mtsIds = ''
       this.editStatus = ''
       this.data = ''
       this.mtsIds = ''
       this.checkedAll = false
       this.allLen = 0
    },
    methods: {
      // 选择足迹
      changeItemCheck (item) {
        item.isChecked = !item.isChecked
        this.$forceUpdate()
      },
      // 全选足迹
      checkedAllHandler (status) {
        let ids = []
        this.checkedAll = !status
        if (this.checkedAll) {
          this.data.forEach(items => {
            let cells = items.shopList
            cells.forEach(item => {
              ids.push(item.mtsId)
              item.isChecked = this.checkedAll
            })
          })
          this.mtsIds = ids.toString()
        } else {
          this.mtsIds = [].toString()
          this.data.forEach(items => {
            let cells = items.shopList
            cells.forEach(item => {
              item.isChecked = this.checkedAll
            })
          })
        }
      },
      // 删除足迹
      async delMemberTrackShop () {
        var mtsIds = this.mtsIds
        var res = await delMemberTrackShop({mtsIds: mtsIds})
         this.getfootPrint()
        console.log(res)
      },
      // 判断全选按钮状态
      checkstatus (e) {
        var arr = e.mp.detail.value
        this.checkedAll = arr.length === this.allLen
        this.mtsIds = arr.toString()
      },
      edit (e) {
        this.editStatus = e
      },
       // 跳转店铺详情
    goShopDetail (id) {
        wx.navigateTo({
              url: '/pages/pIndex/shopDetail/main?shopId=' + id
          })
      },
      // 获取足迹列表
     async getfootPrint () {
       var parmas = {
        'longitude': this.longitude,
         'latitude': this.latitude,
         'pageSize': this.pageSize,
         'pageNo': this.pageNo
       }
        var List = await getMemberTrackShopList(parmas)
  
        this.data = List.result.result.records
        let len = 0
        // 数据处理
        this.data.forEach(items => {
          let cells = items.shopList
          cells.forEach(item => {
            item.isChecked = false
            len++
          })
        })
        this.allLen = len
      },
      setFlag () {
       var _this = this
        setTimeout(() => {
            if (_this.data.length == 0) {
            _this.footprint = false
          } else {
             _this.footprint = true
          }
        }, 500)
      }
  
    }
  }
</script>

<style lang="less" scope>
page{
  background-color: #F7F7F7F7;
}
.container {
  color: @primary;
  font-size: @fs44;
  .none{
    width: 100%;
    height: 160px;
    margin-top: 125px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    img{
      width: 125px;
      height: 125px;
      margin-bottom: 15px;
    }
    span{
      font-size:14px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(120,120,120,1);
    }
  }
  .Tradio{
    width: 100%;
    padding-left: 5px;
    box-sizing: border-box;
    background-color: #F7F7F7;
  }
  .radio{
    width: 100%;

  }
  .card{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #fff;
    box-sizing: border-box;
    
    .timeTitle{
      height: 40px;
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      font-size:15px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height: 40px;
      background-color: #f7f7f7;
      
      
    }
    .content{
      width: 100%;
      // height: 274px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 0 15px;
     box-sizing: border-box;
      
      .shopinfos{
        // height: 290px;
        margin:  20px 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: relative;
        .hr{
          position: absolute;
          left: 15px;
          top: 120px;
        width: 315px;
        height: .5px;
        background-color:#F7F7F7;
      }
       .hr_Edit{
          position: absolute;
          left: -15px;
          top: 120px;
        width: 315px;
        height: .5px;
        background-color:#F7F7F7;
      }
        img{
          width: 97px;
          height: 97px;
        }
        .shop{
          width: 165px;
          height: 97px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(120,120,120,1);
          margin-left: 5px;
          .Stitle{
            width: 400rpx;;
            font-size:15px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(51,51,51,1);
            // line-height:84px;
          }
          .Scount{
            width: 60px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .Smain{
            height: 16px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            .tags{
              width:50px;
              height:16px;
              border:.5px solid rgba(229,229,229,1);
              margin-right: 2.5px;
            }
          }
        }
        .distance{
          width: 50px;
          height: 97px;
          margin-right:14px; 
          text-align: center;
          // line-height: 97px;
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:80px;
        }
      }
    }
    &:last-child{
      margin-bottom: 90px; 
    }
  }
  .btn{
    width: 100%;
    height: 45px;
    background-color: #FE6A00;
    color: #FFFFFF;
    line-height: 45px;
    text-align: center;
    font-size:15px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
    position: fixed;
    bottom: 0;
  }
  .delbox{
    width: 100%;
    height: 45px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    font-size:15px;
    font-family:PingFang SC;
    font-weight:400;
    .allcheck{
      width: 270.5px;
      height: 45px;
      line-height: 45px;
      padding-left: 15px;
      background-color: #fff;
    }
    .right{
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
       .btnDel{
      width:105px;
      height: 45px;
      text-align: center;
      line-height: 45px;
      background-color: #FE6A00;
      color: #fff;
    }
    .btnD{
      width:105px;
      height: 45px;
      text-align: center;
      line-height: 45px;
      background-color: #fff;
      color: #999999;
    }
    }
   
  }

   
  
}
/* 重写 checkbox 样式 */
/* 未选中的 背景样式 */
checkbox .wx-checkbox-input{
  border-radius: 50%;/* 圆角 */
  width: 46rpx; /* 背景的宽 */
  height: 46rpx; /* 背景的高 */
}
/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
checkbox .wx-checkbox-input.wx-checkbox-input-checked{
  border: 1rpx solid #FF783B;
  background: #FF783B;
}
/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
checkbox .wx-checkbox-input.wx-checkbox-input-checked::before{
  border-radius: 50%;/* 圆角 */
  width: 40rpx;/* 选中后对勾大小，不要超过背景的尺寸 */
  height: 40rpx;/* 选中后对勾大小，不要超过背景的尺寸 */
  line-height: 40rpx;
  text-align: center;
  font-size:30rpx; /* 对勾大小 30rpx */
  color:#fff; /* 对勾颜色 白色 */
  background: transparent;
  transform:translate(-50%, -50%) scale(1);
  -webkit-transform:translate(-50%, -50%) scale(1);
}
</style>
