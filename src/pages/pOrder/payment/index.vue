<template>
  <div class="payment">
    <button @click="payPassword('请输入支付密码')">请输入支付密码</button>
    <button @click="payPassword('请设置支付密码','setpwd')">请设置支付密码</button>
    <!-- 底部弹出组件 -->
    <popup 
      :isShow="isShow" 
      mode="payment"
      :data="paymentData"
      @closeModal="closeModal" 
      @paySuccess="paySuccess"
      @forgetPwd="forgetPwd"
    ></popup>
  </div>
</template>
<script>
  import popup from '@/components/popup'

  export default {
    data () {
      return {
        msg: '请输入支付密码',
        isShow: false,
        paymentData: {
          title: '请输入支付密码'
        }
      }
    },
    computed: {
  
    },
    components: {
      popup
    },
    mounted () {
  
    },
    onUnload () {
  
    },
    methods: {
      closeModal () {
        this.isShow = false
      },
      payPassword (title, tip) { // 打开支付弹框
        this.isShow = true
        if (tip) {
          this.paymentData.setPwd = true
        } else {
          this.paymentData.setPwd = false
        }
        this.paymentData.title = title
      },
      paySuccess (arr) { // 密码输入完成
        this.isShow = false
        wx.showToast({title: arr.join(''), icon: 'none'})
      },
      forgetPwd () { // 忘记密码
        console.log('忘记密码处理..')
        wx.navigateTo({
                   url: '/pages/pMe/ressetpayPassword/main'
               })
      }
    }
  }
</script>

<style lang="less" scoped>
.payment {
  color: @primary;
  
}
</style>
