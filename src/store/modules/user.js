// import { Token_GET } from '@/store/types'
// import { UUID_GET } from '@/store/types'
import { phoneLogin } from '@/utils/api'
const user = {

  state: {
    uuid: '',
    token: '',
    userInfo: {}
  },

  getters: {
    getTest: state => state.user
  },

  actions: {
    async Login ({state, commit}, userInfo) {
      let result = await phoneLogin(...userInfo)
      console.log(userInfo)
      commit('UUID_GET', result.uuid)
      commit('Token_GET', result.token)
      wx.switchTab({
        url: '/pages/index/main'
      })
    }

  },

  mutations: {

    Token_GET: (state, res) => {
      state.token = res
      wx.setStorageSync('X-SZK-Token', state.token)
    },
    UUID_GET: (state, res) => {
      state.uuid = res
      wx.setStorageSync('X-SZK-UUID', state.uuid)
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  }
}
export default user
