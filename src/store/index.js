import { createStore } from 'vuex'

export default createStore({
  state: {
    loginData: null,
  },
  mutations: {
    updateData(state, newData) {
      state.loginData = newData
    },
  },
  actions: {
    updateDataAsync(context, newData) {
      setTimeout(() => {
        context.commit('updateData', newData)
      }, 100)
    },
  },
  getters: {
    getLoginData(state) {
      return state.loginData
    }
  }
})
