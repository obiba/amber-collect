// import { t } from '../../boot/i18n'
// import { Notify } from 'quasar'

export async function initCaseReport ({ commit }, payload) {
  const record = {
    id: payload.id,
    crfId: payload.crf._id,
    state: 'in_progress',
    data: {},
    actions: [{
      timestamp: Date.now(),
      type: 'init'
    }]
  }
  commit('addCaseReport', record)
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
    action: { timestamp: Date.now(), type: 'pause' }
  })
}

export async function completeCaseReport ({ commit }, payload) {
  commit('addCaseReportAction', {
    id: payload.id,
    action: { timestamp: Date.now(), type: 'complete' }
  })
}
