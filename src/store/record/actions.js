export async function initCaseReport ({ commit, state }, payload) {
  const recordId = state.caseReports.map(cr => cr.id).reduce((a, b) => Math.max(a, b), 0) + 1 + ''
  const record = {
    id: recordId,
    crfId: payload.crf._id,
    state: 'in_progress',
    data: payload.data ? payload.data : {},
    actions: [{
      timestamp: Date.now(),
      user: payload.user,
      type: 'init'
    }]
  }
  commit('addCaseReport', record)
  return recordId
}

export async function deleteCaseReport ({ commit }, payload) {
  commit('deleteCaseReport', payload)
}

export async function setCaseReportData ({ commit }, payload) {
  commit('setCaseReportData', payload)
}

export async function pauseCaseReport ({ commit }, payload) {
  commit('addCaseReportAction', {
    id: payload.id,
    action: {
      timestamp: Date.now(),
      user: payload.user,
      type: 'pause'
    }
  })
}

export async function completeCaseReport ({ commit }, payload) {
  commit('addCaseReportAction', {
    id: payload.id,
    revision: payload.revision,
    action: {
      timestamp: Date.now(),
      user: payload.user,
      type: 'complete'
    }
  })
}
