import { defineStore } from 'pinia'
import { secureStorage } from './index'
import { feathersClient } from '../boot/feathersClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    isAuthenticatePending: false,
    isLogoutPending: false,
    errorOnAuthenticate: null,
    errorOnLogout: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user
  },

  actions: {
    // Handle authentication response
    responseHandler(response) {
      if (response && response.user) {
        this.user = response.user
      }
      if (response && response.accessToken) {
        this.accessToken = response.accessToken
      }
      return response
    },

    // Authenticate with Feathers
    async authenticate(credentials) {
      this.isAuthenticatePending = true
      this.errorOnAuthenticate = null
      
      try {
        const response = await feathersClient.authenticate(credentials)
        this.responseHandler(response)
        this.isAuthenticatePending = false
        return response
      } catch (error) {
        this.errorOnAuthenticate = error
        this.isAuthenticatePending = false
        throw error
      }
    },

    // Re-authenticate using stored JWT
    async reAuthenticate() {
      this.isAuthenticatePending = true
      this.errorOnAuthenticate = null
      
      try {
        const response = await feathersClient.reAuthenticate()
        this.responseHandler(response)
        this.isAuthenticatePending = false
        return response
      } catch (error) {
        this.errorOnAuthenticate = error
        this.isAuthenticatePending = false
        // Clear auth state on re-auth failure
        this.user = null
        this.accessToken = null
        throw error
      }
    },

    // Logout
    async logout() {
      this.isLogoutPending = true
      this.errorOnLogout = null
      
      try {
        await feathersClient.logout()
        this.user = null
        this.accessToken = null
        this.isLogoutPending = false
      } catch (error) {
        this.errorOnLogout = error
        this.isLogoutPending = false
        throw error
      }
    },

    // Clear error states
    clearAuthErrors() {
      this.errorOnAuthenticate = null
      this.errorOnLogout = null
    }
  },

  persist: {
    key: 'auth',
    storage: secureStorage,
    paths: ['user', 'accessToken']
  }
})
