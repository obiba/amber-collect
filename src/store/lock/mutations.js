export function changeLockStatus (state, payload) {
  state.status = payload.status
}

export function setLockPassword (state, payload) {
  state.id = payload.id
  state.password = payload.password
}
