<template>
  <div class="container">
   <div class="topMessage">
     <img class="xiaoxi" src="/static/images/xiaoxi.png" alt="">
    因各地区店铺和服务不同，请选择准确的收货地址 
    <img class="X" src="/static/images/X.png" alt=""></div>
   <!-- 广告 -->
   <div class="dingwei">
   <div class="dwTitle">当前定位</div>
   <div class="dw">
     <div class="dwAddress">
       <img src="/static/images/dingweidian.png" alt="">
       <span class="address">定位中</span>
       </div>
     <div class="resetdw">
         <img src="/static/images/dingwei-4.png" alt="">
       <span class="address">重新定位</span>
     </div>
   </div>
   </div>
   <!-- 定位 -->
   <div class="AddressList">
     <div class="title">我的地址</div>
     <div class="AdressCard">
       <div>
         <div class="xm">张小小</div>
         <div class="xb">(女士)</div>
         <div class="phone">15120008946</div>
         <div class="tag"><span>默认</span><span>公司</span></div>
       </div>
       <div class="address">北京市大兴区亦庄经济技术开发区大族广场T2号楼大兴区拐角1803</div>
     </div>
     <div class="AdressCard">
       <div>
         <div class="xm">张小名</div>
         <div class="xb">(先生)</div>
         <div class="phone">15120008946</div>
         <div class="tag"><span class="homeTag">家</span></div>
       </div>
       <div class="address">北京市大兴区亦庄经济技术开发区大族广场T2号楼大兴区拐角1803</div>
     </div>
   </div>
   <!-- 地址列表 -->
   <div class="btnAdd">
     <div class="btnBox">
       新增收货地址
     </div>
   </div>
  </div>
</template>
<script>
  
  export default {
    data () {
      return {
        msg: '选择收货地址'
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
  
    },
    onUnload () {
  
    },
    methods: {
  
    }
  }
</script>

<style lang="less" scope>
img{
  width: 0;
  height: 0;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background:#F7F7F7;
  color: @primary;
  font-size: 12px;
  text-align:left;
  padding: 0;
  height: 100vh;
  a{
    margin-top:10px;
    color:#FE6A00
  }
  .topMessage{
    background-color: #fff;
    height: 30px;
    width: 100%;
    line-height: 30px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 10.5px;
    .xiaoxi{
      padding: 10px 0;
      width: 11px;
      height:11px;
      display: inline-block ;
     
    }
    .X{
      padding: 10px 0;
      width: 10px;
      height:10px;
      display: inline-block ;
    }
  }
  .dingwei{
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction:column;
    justify-content:space-around;
    align-items: flex-start;
    .dwTitle{
      margin: 0 15px;
      font-family:PingFang SC;
      font-weight:700;
      color:rgba(51,51,51,1);
      
    }
    .dw{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
      height: 50px;
      background: #fff;
      .dwAddress{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 50px;
        line-height: 50px;
        margin: 0 auto;
        width: 280px;
        padding: 0px 15px;
        img{
        display: inline-block;
        margin: 17px 0;
        width: 13px;
        height: 15px;
        }
        .address{
        height: 50px;
        display: inline-block;
        padding: 0px 7.5px;
        overflow: hidden;
        }
      }
      .resetdw{
        width: 90px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 50px;
        line-height: 50px;
        margin: 0 auto;
        padding: 0px 15px;
         img{
        display: inline-block;
        margin: 17px 0;
        width: 13px;
        height: 15px;
        }
        .address{
        height: 50px;
        display: inline-block;
        padding: 0px 7.5px;
        overflow: hidden;
        }
      }
    }
  }
  .AddressList{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .title{
      margin: 8px 0 15px 15px;
      font-family:PingFang SC;
      font-weight:700;
      color:rgba(51,51,51,1);
    }
    .AdressCard{
      background-color: #fff;
      padding: 20px 15px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      >div{
        width: 100%;
        font-size: 15px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        .xm{
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(51,51,51,1);
        }
        .xb{
          margin: 0 20px 0 10px;
        }
        .phone{
          margin: 0 10px;
        }
        .tag{
          font-size: 12px;
          >span{
            display: inline-block;
            width: 30px;
            height: 15px;
            margin: 0 4px;
            background-color: #FCDDDD;
            color: #FB2A2A;
            text-align: center;
            &:nth-child(2){
               background-color: #DDEFFC;
               color: #38A4F0;
            }
          }
        }
      }
      .address{
        margin: 9px 0;
        color: #787878;
      }
    }
  }
  .btnAdd{
    width: 100%;
    margin: 63px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .btnBox{
      width: 140px;
      height: 45px;
      line-height: 45px;
      font-size: 15px;
      font-weight: 700;
      text-align: center;
      border: 1px solid #fe6a00;
      border-radius: 5px;
      color: #FE6A00;
    }
  }
}
.homeTag{
  background: #FCEBCC;
  color: #FE6A00;
}
</style>
