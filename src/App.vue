<template>
  <router-view />
</template>
<script>
import { useI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'App',
  watch: {
    currentUser (newUser, oldUser) {
      if (newUser === null) {
        this.$router.push('/login')
      } else {
        this.locale = this.$store.state.auth.user.language
      }
    }
  },
  setup () {
    const { locale } = useI18n({ useScope: 'global' })
    return {
      locale,
      intervalId: null
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
  computed: {
    ...mapState({
      caseReports: state => state.record.caseReports
    }),
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    saveCaseReport (caseReport) {
      this.$store.dispatch('record/saveCaseReport', {
        id: caseReport.id,
        user: this.currentUser.email,
        silent: true
      })
    }
  }
})
</script>
