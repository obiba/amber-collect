<template>
  <q-page>
    <case-report-form/>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import CaseReportForm from 'components/CaseReportForm.vue'

export default defineComponent({
  name: 'Test',

  components: {
    CaseReportForm
  }

})
</script>
