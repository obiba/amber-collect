<template>
  <router-view />
</template>
<script>
import { useI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRecordStore } from './stores/record'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'App',
  watch: {
    currentUser (newUser, oldUser) {
      if (newUser === null) {
        this.$router.push('/login')
      } else {
        this.locale = this.authStore.user.language
      }
    }
  },
  setup () {
    const { locale } = useI18n({ useScope: 'global' })
    const authStore = useAuthStore()
    const recordStore = useRecordStore()
    
    // Get reactive references to store state
    const { user: currentUser } = storeToRefs(authStore)
    const { caseReports } = storeToRefs(recordStore)
    
    return {
      locale,
      intervalId: null,
      authStore,
      recordStore,
      currentUser,
      caseReports
    }
  },
  mounted () {
    this.intervalId = setInterval(() => {
      if (this.currentUser) {
        const completedCaseReports = this.caseReports.filter(cr => cr.state === 'completed')
        if (completedCaseReports.length > 0) {
          completedCaseReports.forEach(cr => {
            this.saveCaseReport(cr)
          })
        }
      }
    }, 60000) // every minute
  },
  beforeUnmount () {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    saveCaseReport (caseReport) {
      this.recordStore.saveCaseReport({
        id: caseReport.id,
        user: this.currentUser.email,
        silent: true
      })
    }
  }
})
</script>
