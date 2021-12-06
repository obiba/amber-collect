import formService from '../../services/form'
import { t } from '../../boot/i18n'
import { Notify } from 'quasar'

export async function getForms ({ commit }, payload) {
  const result = await formService.getForms(payload.filter).catch(err => {
    console.error(err)
    const errorCode = err.code
    if (errorCode) {
      Notify.create({
        message: t('error.get_forms'),
        color: 'negative'
      })
    }
  })
  if (result) {
    commit('setForms', result.data)
  } else {
    commit('setForms', [])
  }
}

export async function clearForms ({ commit }, payload) {
  commit('setForms', [])
}
