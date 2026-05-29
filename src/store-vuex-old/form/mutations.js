export function setCaseReportForms (state, crfs) {
  state.crfs = [...crfs]
}

export function setCaseReportFormData (state, payload) {
  if (!state.data[payload.user]) {
    state.data[payload.user] = {}
  }
  state.data[payload.user][payload.form] = payload.data
}
