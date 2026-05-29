import { defineStore } from 'pinia'
import { secureStorage } from './index'
import crfsService from '../services/form'
import { t } from '../boot/i18n'
import { Notify } from 'quasar'

export const useFormStore = defineStore('form', {
  state: () => ({
    crfs: [],
    data: {}
  }),

  actions: {
    async getCaseReportForms(payload) {
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
        this.crfs = [...result.data]
      }
    },

    clearCaseReportForms() {
      this.crfs = []
    },

    setCaseReportFormData(payload) {
      if (!this.data[payload.user]) {
        this.data[payload.user] = {}
      }
      this.data[payload.user][payload.form] = payload.data
    }
  },

  persist: {
    key: 'form',
    storage: secureStorage
  }
})
