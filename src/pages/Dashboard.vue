<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <case-report-form-card/>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import CaseReportFormCard from 'components/CaseReportFormCard.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    CaseReportFormCard
  }
})
</script>
