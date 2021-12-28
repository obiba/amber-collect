<template>
  <q-page class="q-pb-md">
    <div class="row">
      <div class="col">
      </div>
      <div class="col-md-8 col-sm-8 col-xs-12">
        <div class="text-h6 q-ma-md">{{ $t('main.case_report_forms') }}</div>
        <div class="row">
          <div v-for="form in crfs" :key="form._id" class="col-xs-12 col-sm-6 col-md-4">
            <case-report-form-card :form="form"/>
          </div>
        </div>

        <div v-if="inProgressCaseReports.length" class="text-h6 q-ma-md">{{ $t('main.recent_case_reports') }}</div>

        <q-list separator class="q-mt-md">

          <q-item v-for="cr in inProgressCaseReports" :key="cr.id">

            <q-item-section>
              <q-item-label>{{ cr.id }}</q-item-label>
              <q-item-label caption>{{ getFormLabel(cr.crfId) }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label :title="getLastUpdate(cr)">{{ getLastUpdateAgo(cr) }}</q-item-label>
              <q-btn
                :label="$t('resume')"
                icon-right="play_arrow"
                class="text-capitalize q-ma-sm"
                :to="'/case-report/' + cr.id"/>
            </q-item-section>

          </q-item>

        </q-list>
      </div>
      <div class="col">
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'vuex'
import { makeSchemaFormTr } from '@obiba/quasar-ui-amber'
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
      crfs: state => state.form.crfs,
      caseReports: state => state.record.caseReports
    }),
    inProgressCaseReports () {
      return this.caseReports
        .filter(cr => cr.state === 'in_progress' && this.getForm(cr.crfId))
        .sort((cr1, cr2) => {
          const action1 = cr1.actions[cr1.actions.length - 1]
          const action2 = cr2.actions[cr2.actions.length - 1]
          return action2.timestamp - action1.timestamp
        })
    },
    currentLocale () {
      return this.$root.$i18n.locale
    }
  },

  methods: {
    ...mapActions({
      getCaseReportForms: 'form/getCaseReportForms'
    }),
    tr (schema, key) {
      return schema ? makeSchemaFormTr(schema, { locale: this.currentLocale })(key) : '-'
    },
    getForm (crfId) {
      return this.crfs.filter(f => f._id === crfId).pop()
    },
    getFormLabel (crfId) {
      const form = this.getForm(crfId)
      return form ? this.tr(form.schema, form.schema.label) : '?'
    },
    getLastUpdate (cr) {
      const action = cr.actions[cr.actions.length - 1]
      return new Intl.DateTimeFormat(this.currentLocale, { dateStyle: 'full', timeStyle: 'short' }).format(action.timestamp)
    },
    getLastUpdateAgo (cr) {
      const action = cr.actions[cr.actions.length - 1]
      const rtf = new Intl.RelativeTimeFormat(this.currentLocale, { style: 'long' })
      const minutes = Math.ceil((action.timestamp - Date.now()) / 60000)
      if (minutes <= -1440) {
        return rtf.format(Math.ceil(minutes / 1440), 'day')
      }
      if (minutes <= -60) {
        return rtf.format(Math.ceil(minutes / 60), 'hour')
      }
      return rtf.format(minutes, 'minute')
    }
  }
})
</script>
