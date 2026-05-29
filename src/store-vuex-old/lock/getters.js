export function getLockId (state) {
  return state.id === null ? '' : state.id
}

export function getLockPassword (state) {
  return state.password === null ? '' : state.password
}

export function getLockStatus (state) {
  return state.status
}
