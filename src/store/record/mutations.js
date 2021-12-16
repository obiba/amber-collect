// register a case report
export function addCaseReport (state, payload) {
  // add case report if not already done
  const record = state.caseReports.filter(rec => rec.id === payload.id).pop()
  if (!record) {
    if (!payload.actions) {
      payload.actions = [{
        timestamp: Date.now(),
        type: 'init'
      }]
    }
    state.caseReports.push(payload)
  }
}

export function deleteCaseReport (state, payload) {
  state.caseReports = state.caseReports.filter(rec => rec.id !== payload.id)
}

export function setCaseReportData (state, payload) {
  const record = state.caseReports.filter(rec => rec.id === payload.id).pop()
  if (record) {
    record.data = payload.data
  } else {
    console.error('Record could not be found: ' + payload.id)
  }
}

export function addCaseReportAction (state, payload) {
  const record = state.caseReports.filter(rec => rec.id === payload.id).pop()
  if (record) {
    if (!record.actions) {
      record.actions = []
    }
    record.actions.push(payload.action)
  } else {
    console.error('Record could not be found: ' + payload.id)
  }
}
