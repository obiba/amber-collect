import caseReportService from '../../services/record'
import { t } from '../../boot/i18n'
import { Notify } from 'quasar'

export async function initUser ({ commit, state }, payload) {
  commit('setUser', payload)
}

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

export async function mergeCaseReportData ({ commit }, payload) {
  commit('mergeCaseReportData', payload)
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

export async function saveCaseReport ({ commit, state }, payload) {
  if (state.caseReportsInProcess[payload.id]) {
    console.log(`CR #${payload.id} is already being processed`)
    return
  }
  if (state.caseReportsInError[payload.id] && !payload.force) {
    console.log(`CR #${payload.id} is in error`)
    return
  }
  commit('lockCaseReport', {
    id: payload.id,
    lock: true
  })

  const caseReport = state.caseReports.filter(rec => rec.id === payload.id).pop()
  const result = await caseReportService
    .saveCaseReport(caseReport)
    .catch(err => {
      const errorCode = err.code
      if (!payload.silent) {
        if (errorCode) {
          console.error(err)
          if (errorCode === 401) {
            this.$router.push('/login')
          } else {
            Notify.create({
              message: t('error.save_case_report'),
              color: 'negative'
            })
            commit('markCaseReportInError', {
              id: payload.id,
              error: true
            })
          }
        } else if (!err.status) {
          Notify.create({
            message: t('error.save_case_report_error'),
            color: 'warning'
          })
          commit('markCaseReportInError', {
            id: payload.id,
            error: true
          })
        }
      }
      commit('lockCaseReport', {
        id: payload.id,
        lock: false
      })
    })
  if (result) {
    commit('lockCaseReport', {
      id: payload.id,
      lock: false
    })
    // console.log(`CR #${payload.id} processing done`)
    // commit('deleteCaseReport', payload)
    commit('addCaseReportAction', {
      id: payload.id,
      revision: payload.revision,
      action: {
        timestamp: Date.now(),
        user: payload.user,
        type: 'save'
      }
    })
    if (payload.silent !== true) {
      Notify.create({
        message: t('success.save_case_report'),
        color: 'positive',
        icon: 'fas fa-check'
      })
    }
  }
}
