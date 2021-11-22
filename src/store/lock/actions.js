export function triggerLock ({ commit }, payload) {
  commit('changeLockStatus', payload)
}

export function updatePassword ({ commit }, payload) {
  commit('setLockPassword', payload)
}
