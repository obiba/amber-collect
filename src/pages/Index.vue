<template>
  <q-page>
    <case-report-form/>
  </q-page>
  <!--q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
  </q-page-->
</template>

<script>
import { defineComponent } from 'vue'
import CaseReportForm from 'components/CaseReportForm.vue'

export default defineComponent({
  name: 'PageIndex',

  components: {
    CaseReportForm
  }

})
</script>
