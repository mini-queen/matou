<template>
  <div class="container">
    <div class="info">
      <div class="items">
        <span>收货人</span>
        <input type="text" placeholder="请填写收货人姓名" v-model="maName"></div>
      <div class="hr"></div>
      <div class="items">
        <span>手机号</span>
        <input type="text" placeholder="请填写收货人手机号" @blur="checkPhone" v-model="maPhone"></div>
      <div class="hr"></div>
      <div class="items space-between">
        <div class="space-item">
          <span class="label">收货地址</span>
          <input disabled type="text" placeholder="请选择省市区" v-model="address" @click="isShow=true">
        </div>
        <div class="search-wrapper space-item">
          <!-- <picker mode="region" class="addr-picker" :value="region" :custom-item="''" @change="bindRegionChange">
            <img src="/static/images/arrow.png" alt="" class="more-icon">
          </picker> -->
          <img src="/static/images/arrow.png" alt="" class="more-icon">
          <span @click="search" class="search">搜索</span>
        </div>
      </div>
      <div class="hr"></div>
      <div class="items">
        <span>详细地址</span>
        <textarea style="width:240px;height:38px;" cols="2" placeholder="请输入详细地址" v-model="deatailAddr"></textarea>
      </div>
      <!-- 收货信息 -->
    </div>
    <div class="tag">
      <div class="items">
        <div class="center-left">地址标签</div>
        <div class="tags">
          <div @click="switchLabel('0')" class="label" :class="{active: maLabel == 0}">公司</div>
          <div @click="switchLabel('1')" class="label" :class="{active: maLabel == 1}">家</div>
          <div @click="switchLabel('2')" class="label" :class="{active: maLabel == 2}">学校</div>
          <!-- <div>+</div> -->
        </div>
      </div>
      <div class="items">
        <div class='btn'>设为默认地址</div>
        <switch color='#FE6A00' :checked='maStateLocal' @change="switchState"></switch>
      </div>
    </div>
    <!-- 标签与设置 -->
    <div v-if="addressId > 0">
      <div class="btnDel" @click="DelAddr">删除地址</div>
      <div class="btnOk_d" @click="saveAddr">保存地址</div>

    </div>
    <div v-if="flag=='add'">
      <div class="btnOk" @click="saveAddr">保存地址</div>

    </div>
    <!-- <div v-if="flag=='adds'">
          <div class="btnOk" @click="saveAddrselect">保存地址</div>
      </div> -->

    <div class="messagebgc" v-if="layerShow">

      <div class="message">
        <div class="title">修改的信息还未保存，确认现在返回吗</div>
        <div class="btngroup">
          <button @click="cancel" size='mini' plain='true'>取消</button>
          <button @click="saveAddr" size='mini' plain='true'>确定</button>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <div class="address-modal bottom-modal" :class="{show: isShow}">
      <div class="address-dialog">
        <div @click="isShow=false" class="address-close">关闭</div>
        <div class="region-select">
          <div class="hd">
            <div class="region-selected">
              <div class="item" :class="{disabled : item.id == 0 ? true : false}" v-for="(item,index) in selectRegionList" :key="index" @click="switchMode(item)">{{item.name}}</div>
            </div>
            <!-- <div class="done {{selectRegionDone ? '' : 'disabled'}}" bindtap="doneSelectRegion">确定</div> -->
          </div>
          <div class="bd">
            <scroll-view scroll-y="true" style="height: 430rpx">
              <div class="region-list">
                <div class="item" @click="selectRegion(index)" v-for="(item,index) in regionList" :key="index">{{item.name}}</div>
              </div>
            </scroll-view>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { mapGetters } from 'vuex'
import { saveAddress, deleteMemberAddress, moreLevelCity, getUserAddress } from '@/utils/api'

export default {
  data () {
    return {
      // 添加地址来源  fromIndex: 首页定位添加 fromMy: 我的地址列表 fromShopOrder: 店铺商品提交
      // fromGoodOrder: 自营商品订单提交
      flag: '', // edit add
      backurlFromIndex: '/pages/pMe/addressListForSelect/main', //  返回首页添加地址
      backurlFromShopOrder: '/pages/pOrder/shopOrder/main', // 返回店铺商品提交页面
      backurlFromMy: '/pages/pMe/addressList/main', // 返回我的地址
      backGoodOrder: 'pages/pIndex/goodOrder/main', // 返回自营商品订单提交
      layerShow: false, // 确认提示
      maName: '', //  收货人姓名
      maPhone: '', // 收货人手机号
      maLabel: 99, // 地址标签
      maDetail: '', // 自填详细地址
      maStateLocal: false, // 是否默认地址
      deatailAddr: '', // 详细地址
      region: [], // 临时缓存四级选择地址
      address: '', // 四级地址 详细
      isShow: false, // 四级选择弹出
      addressId: 0, // 地址ID
      addressInfo: {}, // 地址信息
      regionType: 1, // 四级地址第一级 省
      regionList: [], // 四级地址 对象列表
      currentLevel: 1, // 当前等级
      levelName: 'province', // 等级 名
      selectRegionDone: false, // 关闭四级弹出
      maCountyId: '',
      selectRegionList: [
        { id: 0, name: '省份', levelName: 'province', level: 1 },
        { id: 1, name: '城市', levelName: 'city', level: 2 },
        { id: 2, name: '地区', levelName: 'area', level: 3 },
        { id: 3, name: '乡镇', levelName: 'country', level: 4 }
      ]
    }
  },
  computed: {
    ...mapGetters({
      selectedAddr: 'getAddr'
    })
  },
  components: {

  },

  onLoad (option) {
    //  this.state =

    this.flag = option.flag
    this.addressId = option.maId
    console.log(this.addressId, this.flag)
    this.doGetUserList()
  },

  watch: {
    selectedAddr (val) {
      console.log('selectedAddr invoked...')
      console.log('val.address: ', val.address)
      if (val.address) {
        this.address = val.address
        this.deatailAddr = val.title
        this.lat = val.lat
        this.lng = val.lng
        this.maCountyId = ''
      }
    }
  },
  mounted () {
    this.$store.commit('ADDR_SET', {})
    this.$store.commit('ADDR_DETAIL_SET', {})
    this.getDefaultCity('province', 0)
    // this.maDetail = ''
    // this.deatailAddr = ''
    if (this.flag == 'add') {
      wx.setNavigationBarTitle({
        title: '新增收货地址'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '修改收货地址'
      })
    }
  },
  onUnload () {
    this.addressList = ''
    this.maCountyId = ''
    this.maPhone = ''
    this.maName = ''
    this.address = ''
    this.deatailAddr = ''
    this.maStateLocal = false
    this.maLabel = 99
  },
  methods: {
    checkPhone () {
      var telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      var inputStr = this.maPhone
      if (!(telStr.test(inputStr))) {
        wx.showToast({
          title: '手机号码输入不规范',
          icon: 'none'
        })
        return false
      }
    },
      DelAddr () {
        var _this = this
      wx.showModal({
  title: '删除收货地址',
  content: '您确认删除吗?',
  async success (res) {
    if (res.confirm) {
     var data = await deleteMemberAddress({ maId: _this.addressId })
      if (data.result.errCode == 'USER_200') {
        wx.showToast({
          title: '删除成功'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 500)
      }
      console.log()
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
})
    },
    // 获取单条地址
    async doGetUserList () {
      if (this.addressList) {
        this.addressList.maDetail = ''
      }

      let params = {
        maId: this.addressId
      }
      let data = await getUserAddress(params)
      if (data) {
        // this.data = data.result.result
        this.addressList = data.result.result.list[0]
        console.log('this.addressList: ', this.addressList)
        console.log('this.addressList.maState: ', this.addressList.maState)
        this.maName = this.addressList.maName
        this.maPhone = this.addressList.maPhone
        this.maDetail = this.addressList.ccName
        this.deatailAddr = this.addressList.maDetail
        this.maLabel = this.addressList.maLabel
        this.maStateLocal = this.addressList.maState
        this.lng = this.addressList.maLon
        this.lat = this.addressList.maLat
        console.log('this.lng: ', this.lng)
        console.log('this.lat: ', this.lat)
        this.maCountyId = this.addressList.maCountyId
        this.address = this.addressList.pName + this.addressList.cName + this.addressList.aName + this.addressList.ccName
        console.log('this.maDetail: ', this.maDetail)
        console.log('this.address: ', this.address)
      }
      console.log(data, 'data')
    },
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

    bindRegionChange: function (e) {
      this.region = e.target.value
      this.address = this.region[0] + this.region[1] + this.region[2]
    },
    cancel: function () {
      this.layerShow = false
    },
    search () {
      wx.navigateTo({
        url: '/pages/pMe/addressMap/main'
      })
    },
    async saveAddr () {
      if (!this.maName) {
        wx.showToast({
          title: '请输入收货人',
          icon: 'none'
        })
      } else if (!this.maPhone) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
      } else {
        let stateValue = 0
        if (this.maStateLocal) {
          stateValue = 1
        }
        console.log('maStateLocal: ', this.maStateLocal)
        console.log('stateValue: ', stateValue)
        console.log('this.address: ', this.address)
        console.log('this.deatailAddr: ', this.deatailAddr)

        let params = {
          maName: this.maName,
          maPhone: this.maPhone,
          maDetail: this.deatailAddr,
          maLabel: this.maLabel,
          maState: stateValue,
          lng: this.lng,
          lat: this.lat,
          maCountyId: this.maCountyId,
          maId: '' // 地址id，编辑时用
        }

        if (this.addressId > 0) {
          params = {
            maName: this.maName,
            maPhone: this.maPhone,
            maDetail: this.deatailAddr,
            maLabel: this.maLabel,
            maState: stateValue,
            lng: this.lng,
            lat: this.lat,
            maCountyId: this.maCountyId,
            maId: this.addressId // 地址id，编辑时用
          }
        }
        if (!this.address) {
          wx.showToast({
            title: '收货地址不能为空', // 提示的内容,
            icon: 'none', // 图标,
            duration: 1000, // 延迟时间,
            mask: true // 显示透明蒙层，防止触摸穿透,
          })
          return
        }
        if (!this.deatailAddr) {
          wx.showToast({
            title: '详细地址不能为空', // 提示的内容,
            icon: 'none', // 图标,
            duration: 1000, // 延迟时间,
            mask: true // 显示透明蒙层，防止触摸穿透,
          })
          return
        }
        console.log('params:')
        console.log(params)
        let res = await saveAddress(params)
        if (res.errCode === 'USER_200') {
          console.log('结果', res)
          this.maCountyId = ''
          this.maPhone = ''
          this.maName = ''
          this.address = ''
          this.deatailAddr = ''
          wx.showToast({
            title: '保存成功', // 提示的内容,
            icon: 'none', // 图标,
            duration: 2000, // 延迟时间,
            mask: true, // 显示透明蒙层，防止触摸穿透,
            success: res => {
              // wx.redirectTo({
              //     url: '/pages/pMe/addressList/main'
              //   })
              wx.navigateBack({
                delta: 1
              })// 返回上一页面
            }
          })
          // setTimeout(() => {

          //   }, 2000)
        }
      }
    },
    switchLabel (label) {
      this.maLabel = label
    },
    switchState (e) {
      console.log('e.target.value', e.target.value)
      this.maStateLocal = e.target.value
    }
  }
}
</script>

<style lang="less" scope>
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
    content: '\200B';
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

.container {
  height: 100vh;
  color: @primary;
  font-size: 12px;
  text-align: left;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: #f7f7f7;
  position: relative;
  input {
    height: 14px;
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 15px;
    margin: 10px 0;
    background-color: #fff;
    .items {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding: 20px 0;
      font-size: 14px;
      &.space-between {
        justify-content: space-between;
        .space-item {
          display: flex;
          align-items: center;
          .label {
            min-width: 150rpx;
          }
        }
        .search-wrapper {
          justify-content: flex-end;
        }
        .more-icon {
          padding-right: 35rpx;
          width: 11rpx;
          height: 20rpx;
        }
        .search {
          font-size: 28rpx;
          color: @color-orange;
          width: 120rpx;
          border-left: 1px solid @line;
          text-align: center;
        }
      }
      span {
        width: 65px;
      }
    }
    .hr {
      width: 345px;
      height: 1px;
      background: rgba(229, 229, 229, 1);
    }
  }
  .tag {
    width: 100%;
    height: 211px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .items {
      width: 90%;
      .label {
        &.active {
          background: @label_orange;
          color: @color-orange;
        }
      }
      &:first-child {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 120px;
        line-height: 65px;
        & > div:nth-child(2) {
          margin-left: 43px;
          display: flex;
          width: 185px;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          > div {
            width: 55px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            border: 1px solid #ccc;
          }
        }
      }
      &:last-child {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    }
  }
  .btnOk {
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    background-color: #fe6a00;
    color: #fff;
    font-size: 15px;
    position: fixed;
    bottom: 0px;
  }
  .btnOk_d {
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    background-color: #fe6a00;
    color: #fff;
    font-size: 15px;
    position: fixed;
    bottom: 45px;
  }
  .btnDel {
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    box-sizing: border-box;
    background-color: #f7f7f7;
    color: #fe6a00;
    font-size: 15px;
    position: fixed;
    border: 0.5px solid #fe6a00;
    bottom: 0px;
  }
  .messagebgc {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(99, 99, 99, 0.8);
    z-index: 99;
    .message {
      width: 325px;
      height: 165px;
      position: absolute;
      top: 260px;
      left: 25px;
      border-radius: 5px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      z-index: 100;
      .title {
        width: 100%;
        text-align: center;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
      .btngroup {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        button {
          width: 120px;
          height: 35px;
          text-align: center;
          line-height: 35px;
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(254, 106, 0, 1);
        }
        button:first-child {
          color: #fe6a00;
          border: 1px solid #fe6a00;
        }
        button:last-child {
          color: #fff;
          background-color: #fe6a00;
          border: 1px solid #fe6a00;
        }
      }
    }
  }
}
</style>
