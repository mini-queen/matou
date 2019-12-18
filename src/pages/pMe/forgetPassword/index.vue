<template>
  <div class="container">
   <div class="ipt"><div class="label">手机号</div><div><input @change="iptChange" v-model="phone" type="number" placeholder="请输入手机号"></div></div>
   <div class="btn"><button @click="handle" :disabled='btnStatus' size="default">下一步</button></div>
  </div>
</template>
<script>
  
  export default {
    data () {
      return {
        btnStatus: true,
        phone: ''
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
      iptChange () {
        if (this.phone !== '') {
          this.btnStatus = false
        }
      },
      handle () {
        wx.navigateTo({
          url: '/pages/pMe/forgetPassword_Code/main?phone=' + this.phone
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
  .ipt{
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin: 10px 0px;
    font-size: 14px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;
.label{
  margin: 0 15px;
}
div>input{
  height: 20px;
  width: 100%;
  font-size: 14px;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
}
  }
  .btn{
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    color:#FFFFFF;
    button{
      background-color: #FE6A00;
      color: #FDC399
    
    }
  }
}
</style>
