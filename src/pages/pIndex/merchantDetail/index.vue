<template>
<div class="shop-wrap">
      <div class="shop-detail flex">
        <!-- <div class="flex"> -->
            <img class="shop-img" :src="baseSrc+shopInfo.sPic"/>
            <div class="shop-name-wrap">
                <div class="shop-name">{{shopInfo.sTitle}}</div>
                <div class="shop-labels flex">
                    <!-- <span class="label-item" v-for="(item,index) in shopLabels" :key="index"> -->
                        <span class="label-item" v-for="tags in shopLabel" :key='tags'>
                        {{tags}}
                    </span>
                </div>
                 <div class="shop-tip">

                    <span v-if="shopInfo.sDealType==0" >外卖商品￥{{shopInfo.sBasicCharge}}元  |  云店商品一件包邮</span>
                    <span v-else> 外卖商品￥{{shopInfo.sBasicCharge}}元  |  云店商品一件包邮</span>
                    <!-- <span v-for="tags in shopLabel" :key='tags'>{{tags}} </span> -->
                </div>
            </div>
        <!-- </div> -->
      </div>
        <div class="shop-address flex">
            <image class="location-img" src="https://sniu.2dian.com/xcx/static/matou/dingwei.png"></image>
            <div class="address">
               {{shopInfo.sAddressDetail}}
            </div>
            <div class="phone" @click="callPhone">
                <image class="phone-img" src="/static/images/dianhua.png"></image>
            </div>
        </div>
        <div class="shop-imgs">
            <img class="item" :src="baseSrc + pic.spPic" v-for="pic in shopPic" :key="pic.spid" alt="">
        </div>
        <div class="shop-intelligence flex" @click="lookCert">
            <div><image class="zizhi-img" src="https://sniu.2dian.com/xcx/static/matou/zizhi.png"></image>查看商家资质</div>
            <image class="arrow-img" src="/static/images/arrow.png"></image>
        </div>
        <div class="shop-notice">
           <div class="title">店铺公告</div>
           <!-- {{shopInfo.sNotice}} -->
           <wxParse :content="shopInfo.sNotice"/>
        </div>
    <!-- </div> -->
</div>
</template>
<script>
import {getShopDdetailAboutGoods} from '../../../utils/api'
import wxParse from 'mpvue-wxparse'

export default{
    data () {
        return {
            baseSrc: this.$baseUrl,
            shopId: '',
            shopInfo: '',
            shopPic: '',
            shopLabel: ''
            // shopName: '鑫哲的网络小店',
            // shopLabels: ['物美价廉', '土产日用', '欢迎光临'],
            // shopAddress: '江苏省盐城市亭湖区鹏润花园9幢116号、117号 江苏省盐城市亭湖区'
        }
    },
    onLoad (option) {
        this.shopId = option.shopId
    },
    components: {
      wxParse
    },
    methods: {
       async getShopDdetail () {
          var shopId = this.shopId
           var result = await getShopDdetailAboutGoods({shopId})
           this.shopInfo = result.result.result.shop
            this.shopPic = result.result.result.shopPic
            this.shopLabel = result.result.result.shop.sLabel
            // this.shopLabel = '物美价廉,日用百货,欢迎光临'// 填充后台空串 测试
            this.shopLabel = this.shopLabel.split(',')
           console.log(this.shopLabel)
        },
        // 查看商家资质
        lookCert () {
            wx.navigateTo({url: `/pages/pOrder/shopZizhi/main?shopId=${this.shopId}`})
        },
        callPhone () {
            wx.makePhoneCall({
                phoneNumber: this.shopInfo.sPhone
             })
        }
    },
    mounted () {
        this.getShopDdetail()
    }
}
</script>
<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.shop-wrap{
    background: @color-bg;
    height:100vh;
    .location-img{
       width:31rpx;
       height:32rpx; 
    }
    .phone-img{
        width:34rpx;
        height:34rpx;
    }
    .zizhi-img{
       width:40rpx;
       height:40rpx; 
       margin-right:10rpx;
       vertical-align: middle;
    }
    .arrow-img{
        width:10rpx;
        height:20rpx;
    }
    .shop-detail{
        background: linear-gradient(90deg,rgba(188,189,210,1),rgba(219,217,228,1));
        padding:40rpx 30rpx 32rpx 30rpx;
        color:#fff;
        box-sizing: border-box;
        .shop-img{
            width:182rpx;
            height:182rpx;
        }
        .shop-name-wrap{
            flex-grow: 1;
            padding-left:30rpx;
            .shop-name{
                padding-top:20rpx;
                font-size:32rpx;
            } 
            .shop-labels{
                justify-content: flex-start;
                .label-item{
                    margin-top:20rpx;
                    padding:2rpx 4rpx;
                    font-size:22rpx;
                    border:1rpx solid #fff;
                    margin-right:10rpx;
                }
            }
            .shop-tip{
                padding-top:14rpx;
                font-size:24rpx;
            }
        }  
    }
    .shop-address{
        padding:30rpx;
        background: #fff;
        font-size:24rpx;
            .location-img{
                width: 31rpx;
                height: 32rpx;
                margin-right:24rpx;
                vertical-align: middle;
            }
            .phone{
                width:80rpx;
                padding-left: 44rpx;
                height:40rpx;
                line-height: 40rpx;
                border-left:1rpx solid @line;
            }
            .address{
                width: 300px;
                height: 35px;
                overflow: hidden;
                padding-right:60rpx;
            }
            image{
                width: 40rpx;
                height: 38rpx;
            }
    }
    .shop-imgs{
        background: #fff;
        padding:30rpx;
        border-top:1rpx solid @line;
        border-bottom:1rpx solid @line;
        overflow-x: auto;
        .item{
            width:180rpx;
            height:180rpx;
            margin-right:10rpx;
        }
    }
    .shop-intelligence{
        background: #fff;
        padding:24rpx 30rpx;
        font-size:24rpx;
        color:@grey
    }
    .shop-notice{
        background: #fff;
        padding:30rpx;
        margin-top:20rpx;
        font-size:24rpx;
        color:@grey;
        line-height:40rpx; 
        .title{
            padding-top:4rpx;
            // padding-bottom:30rpx;
            font-size:28rpx;
            color:#333;
        }
        /deep/ .wxParse {
            font-size: 24rpx;
            color: @disabled;
        }
    }
}
</style>