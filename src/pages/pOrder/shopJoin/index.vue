<template>
  <div class="container">
   <div class="form">
      <picker @change="PickerChange" :value="IndustryId" range-key="name" :range="Industry">
     <div class="ipt">
     <div class="label">主营类目</div>
       <div class="inputing" v-if="firstClick">{{Industry[IndustryId].name}}</div> 
       <div class="input" v-else>请选择</div> 
       <span>
         <img src="../../../../static/images/arrow_down.png" alt="">
       </span> 
     </div>
       </picker>
     <div class="ipt">
       <div class="label">所属区域</div>
       <div class="input">
         <input 
            disabled 
            type="text" 
            placeholder="请选择省市区" 
            v-model="address"
            @click="isShow=true"
          >
       </div>
       <span>
         <img src="../../../../static/images/arrow_down.png" alt="">
       </span>
        
     </div>
     <div class="ipt">
       <div class="label">手机号码</div>
       <div class="input"><input type="number" placeholder-style="color:#999999" placeholder="请输入联系人手机号" v-model="mobile" name="" id=""></div>
       <span>
         
       </span>
        
     </div>
   </div>
   <div class="btn" @click="doapplysShops">提交申请</div>
   <div class="sqbox" v-if="msg">
         <div class="sqbox"  >
        <div class="msg">
         <div class="title"><span>温馨提示</span><span @click="handleClose(false)">x</span></div>
        <div class="contents">开店申请提交成功，请等待专属业务经理与您联系。</div>
        <div class="btn" @click="handleClose(false)">确定</div>
      </div>
      

      </div>

   </div>
  <!--  -->
      <!-- 弹框 -->
    <div class="address-modal bottom-modal" :class="{show: isShow}">
      <div class="address-dialog">
        <div @click="isShow=false" class="address-close">关闭</div>
        <div class="region-select">
          <div class="hd">
            <div class="region-selected">
              <div
                class="item"
                :class="{disabled : item.id == 0 ? true : false}"
                v-for="(item,index) in selectRegionList"
                :key="index"
                @click="switchMode(item)"
              >{{item.name}}</div>
            </div>
            <!-- <div class="done {{selectRegionDone ? '' : 'disabled'}}" bindtap="doneSelectRegion">确定</div> -->
          </div>
          <div class="bd">
            <scroll-view scroll-y="true" style="height: 300px">
              <div class="region-list">
                <div
                  class="item"
                  @click="selectRegion(index)"
                  v-for="(item,index) in regionList"
                  :key="index"
                >{{item.name}}</div>
              </div>
            </scroll-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {applysShops, moreLevelCity} from '../../../utils/api'
  // import { moreLevelCity } from '@/utils/api'
  export default {
    data () {
      return {
              layerShow: false,
        maName: '',
        maPhone: '',
        maLabel: '0',
        deatailAddr: '',
        region: [],
        address: '',
        isShow: false,
        regionType: 1,
        regionList: [],
        currentLevel: 1,
        levelName: 'province',
        selectRegionDone: false,
        selectRegionList: [
          { id: 0, name: '省份', levelName: 'province', level: 1 },
          { id: 1, name: '城市', levelName: 'city', level: 2 },
          { id: 2, name: '地区', levelName: 'area', level: 3 },
          { id: 3, name: '乡镇', levelName: 'country', level: 4 }
        ], // 地址相关结束
        msg: false,
        mobile: '',
        IndustryId: 0,
        IndustryStr: '请选择',
        firstClick: false,
        Industry: [
          {name: '便利店',
            sIndustryId: '01'
          },
          {name: '生鲜',
            sIndustryId: '02'
          },
          {name: '服装',
            sIndustryId: '03'
          },
          {name: '教育',
            sIndustryId: '04'
          },
          {name: '美容',
            sIndustryId: '05'
          }, {
            name: '物流',
            sIndustryId: '06'
          },
         {
            name: '餐饮',
            sIndustryId: '07'
          },
         {
            name: '酒店',
            sIndustryId: '08'
          }
        ]
  
      }
    },
    computed: {

    },
    watch: {
       selectedAddr (val) {
        this.address = val.address
        this.lat = val.lat
        this.lng = val.lng
      }
    },
    components: {

    },
    mounted () {
       this.$store.commit('ADDR_SET', {})
      this.getDefaultCity('province', 0)
    },
    onUnload () {
       this.maName = ''
       this.maPhone = ''
       this.maLabel = '0'
       this.deatailAddr = ''
       this.IndustryStr = '请选择'
       this.mobile = ''
        this.address = ''
        this.firstClick = false
    },
    methods: {
        cancel: function () {
      this.layerShow = false
    },
    // 开始
      /// 四级联动开始 ///
      async getDefaultCity (name, parentId) {
        let params = { type: name, id: parentId }
        let data = (await moreLevelCity(params)).result.result
        // console.log(data)
        this.regionList = data.list
        this.currentLevel = data.level
        this.regionList.map((item, index) => {
          item.level = this.currentLevel
          return item
        })
      },
      selectRegion (event) {
        // console.log(event)
        // console.log('levelName:' + this.levelName)
        // console.log('currentLevel:' + this.currentLevel)

        let that = this
        let regionIndex = event
        let regionItem = this.regionList[regionIndex]
        let regionType = regionItem.level
        this.selectRegionList[regionType - 1] = regionItem
        if (this.currentLevel == 0) {
          this.levelName = 'province'
        } else if (this.currentLevel == 1) {
          this.levelName = 'city'
        } else if (this.currentLevel == 2) {
          this.levelName = 'area'
        } else if (this.currentLevel == 3) {
          this.levelName = 'county'
        } else if (this.currentLevel == 4) {
          this.maCountyId = this.selectRegionList[this.selectRegionList.length - 1].id
          const address = this.selectRegionList
            .map(item => {
              return item.name
            })
            .join('')
          this.address = address
          this.isShow = false
        }
        if (this.currentLevel != 4) {
          this.getRegionList(this.levelName, regionItem.id)
        }

        // 重置下级区域为空
        this.selectRegionList.map((item, index) => {
          if (index > regionType - 1) {
            item.id = 0
            item.name = index == 1 ? '城市' : '乡镇'
            item.parent_id = 0
          }
          return item
        })

        this.regionList.map(item => {
          // 标记已选择的
          if (
            regionType == item.type &&
            this.selectRegionList[this.regionType - 1].id == item.id
          ) {
            item.selected = true
          } else {
            item.selected = false
          }

          return item
        })

        this.setRegionDoneStatus()
      },
      doneSelectRegion () {
        if (this.selectRegionDone === false) {
          return false
        }

        let address = this.address
        let selectRegionList = this.selectRegionList
        address.provinceId = selectRegionList[0].id
        address.cityId = selectRegionList[1].id
        address.districtId = selectRegionList[2].id
        address.province_name = selectRegionList[0].name
        address.city_name = selectRegionList[1].name
        address.district_name = selectRegionList[2].name
        address.fullName = selectRegionList
          .map(item => {
            return item.name
          })
          .join('')

        this.address = address
        this.isShow = false
      },

      setRegionDoneStatus () {
        let that = this
        let doneStatus = that.selectRegionList.every(item => {
          return item.id != 0
        })
        this.selectRegionDone = doneStatus
      },
      getRegionList (name, regionId) {
        let that = this
        let regionType = that.regionType
        this.getDefaultCity(name, regionId)
      },
      switchMode (item) {
        if (!item.code) return

        let arr = ['', 'province', 'city', 'area', 'county']
        let id
        let obj = this.selectRegionList[item.level - 2]
        if (obj) {
          id = obj.id
        } else {
          id = item.id
        }
        // console.log('信息', item, id)
        this.getRegionList(arr[item.level], id)
        if (item.level == 1) {
          this.selectRegionList[0] = { id: 0, name: '省份', levelName: 'province', level: 1 }
          this.selectRegionList[1] = { id: 1, name: '城市', levelName: 'city', level: 2 }
          this.selectRegionList[2] = { id: 2, name: '地区', levelName: 'area', level: 3 }
          this.selectRegionList[3] = { id: 3, name: '乡镇', levelName: 'country', level: 4 }
        } else if (item.level == 2) {
          this.selectRegionList[1] = { id: 1, name: '城市', levelName: 'city', level: 2 }
          this.selectRegionList[2] = { id: 2, name: '地区', levelName: 'area', level: 3 }
          this.selectRegionList[3] = { id: 3, name: '乡镇', levelName: 'country', level: 4 }
        } else if (item.level == 3) {
          this.selectRegionList[2] = { id: 2, name: '地区', levelName: 'area', level: 3 }
          this.selectRegionList[3] = { id: 3, name: '乡镇', levelName: 'country', level: 4 }
        } else if (item.level == 4) {
          this.selectRegionList[3] = { id: 3, name: '乡镇', levelName: 'country', level: 4 }
        }
      },

      /// 四级联动结束 ///
      //  cancel: function () {
      //   this.layerShow = false
      // },
      // 结束
       handleClose: function (e) {
      this.msg = e
    },
  
    PickerChange (e) {
      this.firstClick = true
      this.IndustryId = e.mp.detail.value
      this.IndustryStr = this.Industry[e.mp.detail.value].name
      console.log(e.mp)
    },
 doapplysShops: async function () {
       var parmas = {address: this.address, mobile: this.mobile, sIndustryId: this.IndustryId}
      var result = await applysShops(parmas)
      console.log(result)
      console.log(result.result.errCode)
      if (result.errCode == 'USER_200') {
         this.handleClose(true)
        console.log(parmas)
      }
       this.handleClose(true)
    }
    }
  }
</script>

<style lang="less" scope>
page{
  background-color: #f7f7f7;  
}
.container {
  color: @primary;
  font-size: @fs44;
  .form{

    width: 100%;
    background-color: #fff;
    display: flex;
    padding: 0 15px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: flex-start;
    .ipt{
      width: 100%;
      height: 54px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px solid rgba(229,229,229,1);
      .label{
        width: 62px;
        height: 54px;
        line-height: 54px;
        font-size:14px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
      }
      .input{
        width: 240px;
        height: 54px;
        font-size:14px;
        line-height: 54px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(153,153,153,1);
        input{
          margin-top: 15px;
        }
        }
        .inputing{
        width: 240px;
        height: 54px;
        font-size:14px;
        line-height: 54px;
        font-family:PingFang SC;
        font-weight:400;
        color:#333333;
        input{
          margin-top: 15px;
        }
        }
      span{
        width: 25px;
        height: 54px;
        line-height: 54px;
        img{
          width:  12px;
          height:  7px;
        }
      }
      &:last-child{
        border: none
      }
    }
  }
  .btn{
    margin-top: 60px;
        width:345px;
        height:45px;
        margin-left: 17.5px;
        line-height: 45px;
        background:rgba(254,106,0,1);
        border-radius:5px;
        text-align:center;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
      }
    .sqbox{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,.3);
    z-index: 1;
    .msg{
      position: absolute;
      top: 180px;
      left: 25px;
      width: 325px;
      height: 223px;
      background:rgba(255,255,255,1);
      border-radius:5px;
      z-index: 99;
    .title{
       height: 54px;
       width: 100%;
       display: flex;
       flex-direction: row;
       justify-content: space-between;
       text-align: center;
       line-height: 54px;
       font-size:15px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      border-bottom: 1px solid rgba(229,229,229,1);
      span:first-child{
        width: 90%;
        padding-left: 10%;
        box-sizing: border-box;
      }
      span:last-child{
        text-align: left;
        width: 10%;
        font-size: 20px;
      }
      }
      .contents{
        padding: 17.5px;
        margin-bottom: 35px;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
      }
      .btn{
        width: 290px;
        height: 45px;
        margin:  0 auto;
        background-color: #FE6A00;
        text-align: center;
        line-height: 45px;
        border-radius: 5px;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
      }
    }
    }
    .address-modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1110;
	opacity: 0;
	outline: 0;
	-ms-transform: scale(1.185);
	transform: scale(1.185);
	backface-visibility: hidden;
	perspective: 2000rpx;
	background: rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease-in-out 0s;
  pointer-events: none;
  .address-close {
    margin: 30rpx 30rpx 0 0;
    font-size: 30rpx;
    text-align: right;

  }
  &::before {
    content: "\200B";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
  &.show {
    opacity: 1;
    transition-duration: 0.3s;
    -ms-transform: scale(1);
    transform: scale(1);
    overflow-x: hidden;
    overflow-y: auto;
    pointer-events: auto;
  }
  &.bottom-modal { 
    margin-bottom: -1000rpx;
    &::before {
      vertical-align: bottom;
    }
    &.show {
      margin-bottom: 0;
    }
    .address-dialog {
      width: 100%;
      border-radius: 0;
    }
  }
  .address-dialog {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-left: auto;
    margin-right: auto;
    width: 680rpx;
    max-width: 100%;
    background-color: #f8f8f8;
    border-radius: 10rpx;
    overflow: hidden;
  }
}
    // 四级联动样式 -开始
.region-select {
  width: 100%;
  height: 600rpx;
  background: #fff;
}

.region-select .hd {
  height: 108rpx;
  width: 100%;
  border-bottom: 1px solid #f4f4f4;
  padding: 46rpx 30rpx 0 30rpx;
}

.region-select .region-selected {
  float: left;
  height: 60rpx;
  display: flex;
}

.region-select .region-selected .item {
  max-width: 140rpx;
  margin-right: 30rpx;
  text-align: left;
  line-height: 60rpx;
  height: 100%;
  color: #333;
  font-size: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.region-select .region-selected .item.disabled {
  color: #999;
}

.region-select .region-selected .item.selected {
  color: #b4282d;
}

.region-select .done {
  float: right;
  height: 60rpx;
  width: 60rpx;
  border: none;
  background: #fff;
  line-height: 60rpx;
  text-align: center;
  color: #333;
  font-size: 28rpx;
}

.region-select .done.disabled {
  color: #999;
}

.region-select .bd {
  height: 492rpx;
  width: 100%;
  padding: 0 30rpx;
}

.region-select .region-list {
  height: auto;
  overflow: scroll;
}

.region-select .region-list .item {
  width: 100%;
  height: 104rpx;
  line-height: 104rpx;
  text-align: left;
  color: #333;
  font-size: 28rpx;
}

.region-select .region-list .item.selected {
  color: #b4282d;
}
// 四级联动样式 -结束
}
</style>
