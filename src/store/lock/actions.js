export function triggerLock ({ commit }, payload) {
  commit('changeLockStatus', payload)
}

export function clearPassword ({ commit }, payload) {
  commit('clearLockPassword', payload)
}

export function updatePassword ({ commit }, payload) {
  commit('setLockPassword', payload)
}
