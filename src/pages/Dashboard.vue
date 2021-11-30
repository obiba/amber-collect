<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div v-for="form in forms" :key="form._id" class="col-xs-12 col-sm-6 col-md-3">
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

  created () {
    if (this.forms === undefined || this.forms.length === 0) {
      this.getForms({})
    }
  },

  computed: {
    ...mapState({
      forms: state => state.form.forms
    })
  },

  methods: {
    ...mapActions({
      getForms: 'form/getForms'
    })
  }
})
</script>
