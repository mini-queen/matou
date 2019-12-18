<template>
  <div class="main" v-if="msg">
       <div class="msg">
         <div class="title"><span>{{title}}</span><span @click="handleClose">x</span></div>
        <div class="contents">{{tips}}</div>
        <div class="btn" @click="handle(type)">{{btnStr}}</div>
      </div>
  </div>
</template>

<script>
export default {
props: {
    title: {
        type: String,
        default: '请选择您定位的城市'
    },
    tips: {
        type: String,
        default: '温馨提示'
    },
    btnStr: {
        type: String,
        default: '定位城市'
    },
    type: {
        type: String,
        default: 'dw'
    }
},
data () {
    return {
        msg: true,
        data: '北京'
    }
},
methods: {
    handleClose () {
        console.log(this.msg)
        this.msg = false
    },
    handle () {
        console.log('++')
        return this.data
    }
}
}
</script>

<style lang='less' scope>
.main{
    width: 325px;
    height: 206px;
    border-radius: 5px;
    position: absolute;
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

</style>