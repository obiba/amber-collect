<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div v-for="form in crfs" :key="form._id" class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card :form="form"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'vuex'
import CaseReportFormCard from 'components/CaseReportFormCard.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    CaseReportFormCard
  },

  mounted () {
    this.getCaseReportForms({ silent: true })
  },

  computed: {
    ...mapState({
      crfs: state => state.form.crfs
    })
  },

  methods: {
    ...mapActions({
      getCaseReportForms: 'form/getCaseReportForms'
    })
  }
})
</script>
