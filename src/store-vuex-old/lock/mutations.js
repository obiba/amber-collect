export function changeLockStatus (state, payload) {
  state.status = payload.status
}

export function clearLockPassword (state, payload) {
  if (payload.id) {
    state.locks[payload.id] = undefined
    state.id = ''
    state.password = ''
  }
}

export function setLockPassword (state, payload) {
  state.id = payload.id
  if (payload.password) {
    // set current lock
    state.password = payload.password
  } else if (payload.id) {
    if (state.locks[payload.id]) {
      // reinstate user lock
      state.password = state.locks[payload.id]
    } else {
      // no lock to reinstate, will create a new one
      state.password = null
    }
  } else {
    // reset current lock
    state.password = null
  }
  // update user lock
  if (payload.id && payload.password) {
    state.locks[payload.id] = payload.password
  }
}
