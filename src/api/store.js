import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    // 初始化A和B组件的数据，等待获取
    AMsg: '',
    BMsg: '',
    CMsg: '',
    DMsg: '',
    EMsg: ''
}

const mutations = {
    receiveAMsg(state, payload) {
        // 将A组件的数据存放于state
        state.AMsg = payload.AMsg
    },
    receiveBMsg(state, payload) {
        // 将B组件的数据存放于state
        state.BMsg = payload.BMsg
    },
    receiveCMsg(state, payload) {
        // 将B组件的数据存放于state
        state.CMsg = payload.CMsg
    },
    receiveDMsg(state, payload) {
        // 将B组件的数据存放于state
        state.DMsg = payload.DMsg
    },
    receiveEMsg(state, payload) {
        // 将B组件的数据存放于state
        state.EMsg = payload.EMsg
    }
}

const getters={
    getWiFiList: state => {
      return state.AMsg;
    }
  };

export default new Vuex.Store({
    state,
    getters,
    mutations
})