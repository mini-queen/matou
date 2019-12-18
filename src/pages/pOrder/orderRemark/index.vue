<template>
  <div class="container">
   <div class="phoneform">
     <div class="phone">
       
       <textarea name="" id="" rows="40" cols="40" placeholder="请输入备注" v-model="remark"   ref="focusTextarea"></textarea>
     </div>
    
   </div>
   <div class="btn" @click="goBack">确定</div>
   
  </div>
</template>
<script>
  
  export default {
    data () {
      return {
        remark: ''
      }
    },
    computed: {
  
    },
    components: {

    },
    mounted () {
  
    },
    onUnload () {
      this.remark = ''
    },
    methods: {

      doRemark (e) {
        this.remark = e.mp.detail.value
      },

      doInputRemark (e) {
         console.log(e)
         this.remark = e.mp.detail.value
      },

      goBack () {
         console.log('remark:' + this.remark)
         wx.setStorage({
          key: 'remark',
          data: this.remark
        })
     wx.navigateBack({
           delta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页,
         })
    }
  
    }
  }
</script>

<style lang="less" scoped>
.container {
  color: @primary;
 
  .phoneform{
    width: 100%;
    height: 111px;
    padding: 20px 32.5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .phone{
      width: 100%;
      height: 130px;
      border: 1px solid rgba(229,229,229,1);
      box-sizing:  border-box;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: 200px;
      line-height: 30px;
      background:rgba(247,247,247,1);
      img{
        width: 17px;
        height: 17px;
      }
      input{
        margin-left: 14px;
        width: 215px;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(204,204,204,1);
      }
    }
  }
  .btn{
    margin:  0 auto;
    background-color: #FE6A00;
    color: #FFFFFF;
    width: 310px;
    height: 45px;
    border-radius: 22.5px;
    text-align: center;
    line-height: 45px;
    margin-top: 80px;
  }
  .hr{
    width: 100%;
    height: 10px;
    background-color: #F7F7F7;
    margin-top: 30px;
  }
  
}
</style>
