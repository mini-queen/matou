import { CITY_SET, ADDR_SET, ADDR_DETAIL_SET } from '@/store/types'
const state = {
  city: '',
  address: {}
}

const getters = {
  getCity: state => state.city,
  getAddr: state => state.address
}

const actions = {
  [CITY_SET] ({ state, commit }) {
    // let result = await getTestData()
    // commit(TEST_GET, result)
  }
}

const mutations = {
  [CITY_SET]: (state, res) => {
    state.city = res
  },
  [ADDR_SET]: (state, res) => {
    state.address = res
  },
  [ADDR_DETAIL_SET]: (state, res) => {
    state.title = res
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
