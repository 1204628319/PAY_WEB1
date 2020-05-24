const state = {
  tempInfo: {},
  originExtract: {},
  mapRules: {}

}

const mutations = {
  ADD_FORM_DATA: (state, data) => {
    state[data.model] = data.value
  },
  DEL_FORM_DATA: (state, model) => {
    state[model] = {}
  }
}
const actions = {
  addFormData({ commit }, data) {
    commit('ADD_FORM_DATA', data)
  },
  delFormData({ commit }, model) {
    commit('DEL_FORM_DATA', model)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
