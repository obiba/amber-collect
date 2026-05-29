import { defineStore } from 'pinia'
import { secureStorage } from './index'

export const useLockStore = defineStore('lock', {
  state: () => ({
    id: '',
    password: '',
    status: false,
    locks: {}
  }),

  getters: {
    getLockId: (state) => state.id === null ? '' : state.id,
    getLockPassword: (state) => state.password === null ? '' : state.password,
    getLockStatus: (state) => state.status
  },

  actions: {
    triggerLock(payload) {
      this.status = payload.status
    },

    clearPassword(payload) {
      if (payload.id) {
        this.locks[payload.id] = undefined
        this.id = ''
        this.password = ''
      }
    },

    updatePassword(payload) {
      this.id = payload.id
      if (payload.password) {
        // set current lock
        this.password = payload.password
      } else if (payload.id) {
        if (this.locks[payload.id]) {
          // reinstate user lock
          this.password = this.locks[payload.id]
        } else {
          // no lock to reinstate, will create a new one
          this.password = null
        }
      } else {
        // reset current lock
        this.password = null
      }
      // update user lock
      if (payload.id && payload.password) {
        this.locks[payload.id] = payload.password
      }
    }
  },

  persist: {
    key: 'lock',
    storage: secureStorage
  }
})
