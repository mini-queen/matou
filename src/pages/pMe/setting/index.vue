<template>
<div class="container"> 
    <div class="content">
        <div class="set-item flex">
            <div>头像 </div>
            <div class="item-value">
                <image class="avator-img" :src="userInfo.mheadurl"></image>
                <image class="arrow-img"></image>  
                <!-- <image class="avator-img" src="https://sniu.2dian.com/xcx/static/matou/header.png" @click="showCamera"></image> -->
                <!-- <image class="arrow-img" src="/static/images/arrow.png"></image>   -->
            </div>
        </div>
        <div class="set-item flex">
            <div>昵称 </div>
            <div class="item-value">
                {{userInfo.mnickname}}
                <!-- <image class="arrow-img" src="/static/images/arrow.png"></image>   -->
                <image class="arrow-img"></image>  
            </div>
        </div>
        <div class="set-item flex"  @click="goMemberCenter">
            <div>角色 </div>
            <div class="item-value">
                <span v-if="userInfo.mPartnerFlag ==1" class="color-orange">合伙人</span>
                <span v-else-if="userInfo.mVipFlag==1" class="color-orange">VIP会员</span>
                <span @click="goVip" v-else class="colorblack">普通用户</span>
                <image class="arrow-img" src="/static/images/arrow.png"></image>    
            </div>
        </div>
         <div class="set-item flex">
            <div>性别 </div>
            <div class="item-value  item-picker-wrap" @click="showSex(true)">
                {{userInfo.msex==0 ? '男':'女'}}
                <!-- picker -->
                <!-- <picker  class="item-picker" mode="selector"  :range="sexArr"  @change="changeSex">
                    <view class="picker" >
                       {{sex}}
                    </view>  
                </picker> -->
                <image class="arrow-img" src="/static/images/arrow.png"></image>  
            </div>
        </div>
         <div class="set-item flex">
            <div>生日 </div>
            <div class="item-value item-picker-wrap">
                 <picker mode="date" start="1900-01-01" :value="time"  @change="changeTime">
                    <view class="picker">
                       {{userInfo.mbirthday== 0 ?'未设置' : time}}
                    </view>  
                </picker>
                <image class="arrow-img" src="/static/images/arrow.png"></image>  
            </div>
        </div>
         <div v-if="userInfo.mphone!==''" class="set-item flex">
            <div>绑定手机号 </div>
            <div class="item-value">
                {{userInfo.mphone?userInfo.mphone: '未绑定'}}<image class="arrow-img" style="padding-left: 32rpx;" ></image>  
            </div>
        </div>
            <div v-else class="set-item flex" @click="handle('bind')">
            <div>绑定手机号 </div>
            <div class="item-value">
               {{userInfo.mphone?userInfo.mphone: '未绑定'}}<image class="arrow-img"  src="/static/images/arrow.png"></image>  
            </div>
        </div>
         <div class="set-item flex" @click="handle('login')">
            <div>登录密码 </div>
            <div>
                <image class="arrow-img" src="/static/images/arrow.png"></image>  
            </div>
        </div>
         <div v-if="userInfo.mPayPwd==0" class="set-item flex" @click="handle('pay')">
            <div>支付密码 </div>
            <div>
                <image class="arrow-img" src="/static/images/arrow.png"></image>  
            </div>
        </div>
        <!--  -->
        <div v-else class="set-item flex" @click="handle('pays')">
            <div>支付密码 </div>
            <div>
                <image class="arrow-img" src="/static/images/arrow.png"></image>  
            </div>
        </div>
         <div class="set-item flex" @click="callMe">
            <div>关于我们 </div>
            <div>
                <image class="arrow-img" src="/static/images/arrow.png"></image>  
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="out-button" @click="outLogin">退出登录</div>    
    </div>
    <!-- 头像picker -->
    <!-- <my-picker  :isShow="showCamera" ref="camera" :data="cameraData" @changeSelect="changeCamera"></my-picker> -->
    <!-- 性别 -->
    <my-picker v-if="showSexflag"  ref="sex" :data="sexData" @changeSelect="changeSex"></my-picker>
</div>
</template>
<script>
import {logout, changeUserInfo, getMyAccount} from '@/utils/api'
import {formatTime} from '@/utils/util'
import MyPicker from '../../../components/my-picker'
export default{
  components: {MyPicker},
  data () {
    return {
        showSexflag: false,
        isShowFlag: false,
        mPhone: '', // 获取用户手机号为空则=>绑定  否则 更改
        mPayPwd: '0', // 0设置了支付密码  1没有设置支付密码
      sexArr: ['男', '女'],
      sexData: [{id: 0, name: '男'}, {id: 1, name: '女'}],
    //   cameraData: [{id: 1, name: '拍照'}, {id: 2, name: '相册'}],
      sex: 0,
      time: null,
      years: [2000, 2001, 2002, 2003, 2004, 2005],
      months: [1, 2, 3, 4, 5, 6],
      // userInfo: ''
      userInfo: {}
    }
  },
  created () {
      this.showSexflag = false
        this.isShowFlag = false
      console.log(this.showSexflag)
        this.getMyAccount()
      // this.userInfo = wx.getStorageSync('userInfo')
  },
  onShow () {
        this.getMyAccount()
        // this.userInfo = wx.getStorageSync('userInfo')
  },
  unLoad () {
       this.showSexflag = false
        this.isShowFlag = false
  },
  methods: {
      callMe () {
          console.log(1)
           wx.navigateTo({
                   url: '/pages/pMe/aboutUs/main'
               })
      },
      async changeInfo () {
          var params = {
               birthday: this.time,
               sex: this.sex
          }
            console.log(params)
          var res = await changeUserInfo(params)
          console.log(res.result.errCode)
          if (res.result.errCode == 'USER_200') {
              wx.showToast({
                  title: '修改成功'
              })
               this.getMyAccount()
          }
      },
      handle (e) {
          if (e == 'login') {
            //   登录密码
             wx.navigateTo({
                   url: '/pages/pMe/changePassword/main?mpwd=' + this.userInfo.mpwd
               })
          } else if (e == 'pay') {
                wx.navigateTo({
                   url: '/pages/pMe/payPassword/main'
               })
               //   支付密码 未设置时
          } else if (e == 'pays') {
                wx.navigateTo({
                   url: '/pages/pMe/ressetpayPassword/main'
               })
               //   支付密码 修改时
          } else if (e == 'bind') {
               //   绑定手机号` 第一次
               wx.navigateTo({
                   url: '/pages/pMe/bindPhone/main'
               })
          } else if (e == 'binds') {
            //   修改绑定手机
             wx.navigateTo({
                   url: '/pages/pMe/changePhone/main'
               })
          }
      },
      async getMyAccount () {
        var result = await getMyAccount()
        this.userInfo = result.result.result.member
        console.log(this.userInfo, 'userInfo: ')
        this.time = formatTime(new Date(this.userInfo.mbirthday)).substr(0, 10)
        //  this.time = formatTime(this.userInfo.mbirthday)

        this.sex = this.userInfo.msex

        // this.mPartnerFlag = this.member.mPartnerFlag
        // this.mVipFlag = this.member.mVipFlag
       // console.log(this.member, this.mPartnerFlag)
       },
     async outLogin () {
         var res = await logout()
         console.log(res)
          wx.removeStorage({
               key: 'userInfo'
          })
          wx.removeStorage({
  key: 'DIAN_TOKEN',
  success (res) {
      wx.reLaunch({
          url: '/pages/index/main'
      })
    console.log(res)
  }
})
      },
    // changeSex (e) {
    //   this.sex = this.sexArr[e.target.value]
    // },
    changeTime (e) {
      this.time = e.target.value
      this.changeInfo()
    },
    showCamera () {
      this.$refs.camera.isShow = true
    //   this.showCamera = true
    },
    show () {
        this.isShowFlag = false
    },
    showSex (e) {
    //   this.$refs.sex.isShow = e
      this.showSexflag = true
    },
    changeCamera (item) {
      console.log(item, 'camera')
    },
    changeSex (item) {
    // this.$refs.sex.isShow = false
      this.sex = item.id
      this.showSexflag = false
      var _this = this
      setTimeout(() => { _this.changeInfo() }, 500)

      console.log(item, 'sex')
    },
    goMemberCenter () {
        console.log(1)
         wx.switchTab({
                   url: '/pages/member/detail/main'
               })
    //   wx.navigateTo({url: '/pages/member/detail/main?userType="1'})
    }
    // goVip(){
    //     wx.navigateTo({url: '/pages/member/detail/main?userType="1'})
    // }
  }
}
</script>
<style lang="less" scoped>
    .container{
        background: @color-bg;
        width:100%;
        height:100%;
        font-size:28rpx;
        padding:20rpx 0 276rpx 0;
        .color-orange{
            color:@color-orange
        }
        .colorblack{
            color:black
        }
        .avator-img{
            width:60rpx;
            height:60rpx;
            border-radius: 50%;
            vertical-align: middle
        }
        .arrow-img{
            width:10rpx;
            height:20rpx;
            vertical-align: middle;
            padding-left:40rpx;
        }
        .content{
            width:100%;
            padding:0 30rpx 0 30rpx;
            box-sizing: border-box;
            background: #fff;
            .set-item{
                height:100rpx;
                border-bottom:1rpx solid @line;
                .item-value{
                    // flex-grow: 1;
                    text-align:right
                }
                .item-picker-wrap{
                    width:40%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    .item-picker{
                        flex-grow: 1;
                        text-align:right;
                        padding-right:10rpx;
                    }
                }
                &:last-of-type{
                     border-bottom:none
                }
            }
        }
        .footer{
            position: fixed;
            bottom:30rpx;
            width:100%;
            padding:0 30rpx;
            box-sizing: border-box;
             .out-button{
                line-height: 90rpx;
                height:90rpx;
                text-align:center;
                background: @color-orange;
                color:#fff; 
                border-radius:10rpx;
            }  
        } 
    }
</style>