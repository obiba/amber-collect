import { mapState } from 'pinia'
import { useLockStore } from '../stores/lock'

const LockMixin = {
  computed: {
    ...mapState(useLockStore, {
      lockId: 'id',
      lockPassword: 'password',
      lockStatus: 'status'
    })
  },
  methods: {
    triggerLock(payload) {
      const lockStore = useLockStore()
      lockStore.triggerLock(payload)
    },
    updatePassword(payload) {
      const lockStore = useLockStore()
      lockStore.updatePassword(payload)
    },
    clearPassword(payload) {
      const lockStore = useLockStore()
      lockStore.clearPassword(payload)
    },
    resetLock (userId) {
      this.updatePassword({
        id: userId
      })
      this.triggerLock({
        status: false
      })
    },
    clearLock (userId) {
      this.clearPassword({
        id: userId
      })
      this.triggerLock({
        status: false
      })
    }
  }
}

export default LockMixin
