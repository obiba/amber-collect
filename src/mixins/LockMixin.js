import { mapGetters, mapActions } from 'vuex'

const LockMixin = {
  computed: {
    ...mapGetters({
      lockId: 'lock/getLockId',
      lockPassword: 'lock/getLockPassword',
      lockStatus: 'lock/getLockStatus'
    })
  },
  methods: {
    ...mapActions({
      triggerLock: 'lock/triggerLock',
      updatePassword: 'lock/updatePassword'
    }),
    resetLock () {
      this.updatePassword({
        id: null,
        password: null
      })
      this.triggerLock({
        status: false
      })
    }
  }
}

export default LockMixin
