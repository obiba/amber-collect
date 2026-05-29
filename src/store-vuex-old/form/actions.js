import crfsService from '../../services/form'
import { t } from '../../boot/i18n'
import { Notify } from 'quasar'

export async function getCaseReportForms ({ commit }, payload) {
  const result = await crfsService.getCaseReportForms(payload.filter).catch(err => {
    const errorCode = err.code
    if (!payload.silent) {
      if (errorCode) {
        console.error(err)
        if (errorCode === 401) {
          Notify.create({
            message: t('error.reauthenticate'),
            color: 'negative'
          })
        } else {
          Notify.create({
            message: t('error.get_case_report_forms'),
            color: 'negative'
          })
        }
      } else if (!err.status) {
        window.location.reload()
      }
    }
  })
  if (result) {
    commit('setCaseReportForms', result.data)
  }/* else {
    commit('setCaseReportForms', [])
  } */
}

export async function clearCaseReportForms ({ commit }, payload) {
  commit('setCaseReportForms', [])
}
