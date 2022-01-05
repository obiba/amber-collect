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
  delete state.caseReportsInProcess[payload.id]
}

export function lockCaseReport (state, payload) {
  if (payload.lock) {
    state.caseReportsInProcess[payload.id] = true
  } else {
    delete state.caseReportsInProcess[payload.id]
  }
}

export function setCaseReportData (state, payload) {
  const record = state.caseReports.filter(rec => rec.id === payload.id).pop()
  if (record) {
    record.data = payload.data
  } else {
    console.error('Record could not be found: ' + payload.id)
  }
}

export function mergeCaseReportData (state, payload) {
  const record = state.caseReports.filter(rec => rec.id === payload.id).pop()
  if (record) {
    if (record.data) {
      for (const key in payload.data) {
        record.data[key] = payload.data[key]
      }
    } else {
      record.data = payload.data
    }
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
    if (payload.action.type === 'complete') {
      record.state = 'completed'
    } else if (payload.action.type === 'save') {
      record.state = 'saved'
      record.data = { _id: record.data._id }
    }
    if (payload.revision) {
      record.revision = payload.revision
    }
  } else {
    console.error('Record could not be found: ' + payload.id)
  }
}
