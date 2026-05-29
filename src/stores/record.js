import { defineStore } from 'pinia'
import { secureStorage } from './index'
import caseReportService from '../services/record'
import { t } from '../boot/i18n'
import { Notify } from 'quasar'

export const useRecordStore = defineStore('record', {
  state: () => ({
    user: null,
    caseReports: [],
    caseReportsInProcess: {},
    caseReportsInError: {}
  }),

  getters: {
    getCaseReportById: (state) => {
      return (user, id) => state.caseReports.filter(rec => rec.id === id && user && rec.actions[0].user === user.email).pop()
    },
    
    getCaseReportsCount: (state) => {
      return (user) => state.caseReports.filter(rec => user && rec.actions[0].user === user.email).length
    },
    
    getCaseReports: (state) => {
      return (user) => state.caseReports.filter(rec => user && rec.actions[0].user === user.email)
    }
  },

  actions: {
    async initUser(payload) {
      this.user = payload
    },

    async initCaseReport(payload) {
      const recordId = this.caseReports.map(cr => cr.id).reduce((a, b) => Math.max(a, b), 0) + 1 + ''
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
      this.addCaseReport(record)
      return recordId
    },

    addCaseReport(payload) {
      // add case report if not already done
      const record = this.caseReports.filter(rec => rec.id === payload.id).pop()
      if (!record) {
        if (!payload.actions) {
          payload.actions = [{
            timestamp: Date.now(),
            type: 'init'
          }]
        }
        this.caseReports.push(payload)
      }
    },

    async deleteCaseReport(payload) {
      this.caseReports = this.caseReports.filter(rec => rec.id !== payload.id)
      delete this.caseReportsInProcess[payload.id]
      delete this.caseReportsInError[payload.id]
    },

    lockCaseReport(payload) {
      if (payload.lock) {
        this.caseReportsInProcess[payload.id] = true
      } else {
        delete this.caseReportsInProcess[payload.id]
      }
    },

    markCaseReportInError(payload) {
      if (payload.error) {
        this.caseReportsInError[payload.id] = true
      } else {
        delete this.caseReportsInError[payload.id]
      }
    },

    async setCaseReportData(payload) {
      const record = this.caseReports.filter(rec => rec.id === payload.id).pop()
      if (record) {
        record.data = payload.data
      } else {
        console.error('Record could not be found: ' + payload.id)
      }
    },

    async mergeCaseReportData(payload) {
      const record = this.caseReports.filter(rec => rec.id === payload.id).pop()
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
    },

    addCaseReportAction(payload) {
      const record = this.caseReports.filter(rec => rec.id === payload.id).pop()
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
    },

    async pauseCaseReport(payload) {
      this.addCaseReportAction({
        id: payload.id,
        action: {
          timestamp: Date.now(),
          user: payload.user,
          type: 'pause'
        }
      })
    },

    async completeCaseReport(payload) {
      this.addCaseReportAction({
        id: payload.id,
        revision: payload.revision,
        action: {
          timestamp: Date.now(),
          user: payload.user,
          type: 'complete'
        }
      })
    },

    async saveCaseReport(payload) {
      if (this.caseReportsInProcess[payload.id]) {
        console.log(`CR #${payload.id} is already being processed`)
        return
      }
      if (this.caseReportsInError[payload.id] && !payload.force) {
        console.log(`CR #${payload.id} is in error`)
        return
      }
      
      this.lockCaseReport({
        id: payload.id,
        lock: true
      })

      const caseReport = this.caseReports.filter(rec => rec.id === payload.id).pop()
      const result = await caseReportService
        .saveCaseReport(caseReport)
        .catch(err => {
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
                  message: t('error.save_case_report'),
                  color: 'negative'
                })
                this.markCaseReportInError({
                  id: payload.id,
                  error: true
                })
              }
            } else if (!err.status) {
              Notify.create({
                message: t('error.save_case_report_error'),
                color: 'warning'
              })
              this.markCaseReportInError({
                id: payload.id,
                error: true
              })
            }
          }
          this.lockCaseReport({
            id: payload.id,
            lock: false
          })
        })
        
      if (result) {
        this.lockCaseReport({
          id: payload.id,
          lock: false
        })
        
        this.addCaseReportAction({
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
  },

  persist: {
    key: 'record',
    storage: secureStorage
  }
})
