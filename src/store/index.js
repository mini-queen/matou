import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import address from './modules/address'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      ...user
    },
    address
  },
  plugins: [
    // 数据持久化
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => wx.clearStorage()
      }
    })
  ]
})

export default store
