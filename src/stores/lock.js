import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { secureStorage } from './index'

export const useLockStore = defineStore('lock', () => {
  // State
  const id = ref('')
  const password = ref('')
  const status = ref(false)
  const locks = ref({})

  // Getters
  const getLockId = computed(() => id.value || '')
  const getLockPassword = computed(() => password.value || '')
  const getLockStatus = computed(() => status.value)

  // Actions
  function triggerLock(payload) {
    status.value = payload.status
  }

  function clearPassword(payload) {
    if (payload.id) {
      locks.value[payload.id] = undefined
      id.value = ''
      password.value = ''
    }
  }

  function updatePassword(payload) {
    id.value = payload.id
    if (payload.password) {
      // set current lock
      password.value = payload.password
    } else if (payload.id) {
      if (locks.value[payload.id]) {
        // reinstate user lock
        password.value = locks.value[payload.id]
      } else {
        // no lock to reinstate, will create a new one
        password.value = null
      }
    } else {
      // reset current lock
      password.value = null
    }
    // update user lock
    if (payload.id && payload.password) {
      locks.value[payload.id] = payload.password
    }
  }

  return {
    // State
    id,
    password,
    status,
    locks,
    // Getters
    getLockId,
    getLockPassword,
    getLockStatus,
    // Actions
    triggerLock,
    clearPassword,
    updatePassword
  }
}, {
  persist: {
    key: 'lock',
    storage: secureStorage
  }
})
