<template>
  <q-page v-cloak class="bg-grey-2">

    <q-tabs
      v-model="tab"
      dense
      class="text-grey bg-white"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
      no-caps
    >
      <q-tab name="forms" :label="$t('main.forms')" />
      <q-tab name="in_progress">
        <span class="q-mr-md">{{$t('main.in_progress')}}</span>
        <q-badge floating>{{ notSavedCaseReports.length }}</q-badge>
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="forms" class="bg-grey-2">
        <q-pull-to-refresh @refresh="onRefresh">
          <div class="text-bold text-center text-uppercase">{{ $t('main.case_report_forms') }}</div>
          <div class="row">
            <div class="col">
            </div>
            <div class="col-md-6 col-sm-8 col-xs-12">
              <div v-if="crfs.length>0">
                <q-card v-for="form in crfs" :key="form._id" flat bordered class="q-ma-md">
                  <q-card-section>
                    <q-item  class="col-xs-12 col-sm-6 col-md-4">
                      <case-report-form-card :form="form"/>
                    </q-item>
                  </q-card-section>
                </q-card>
              </div>
              <div v-else class="text-grey">
                {{ $t('main.no_case_report_forms') }}
              </div>
            </div>
            <div class="col">
            </div>
          </div>
        </q-pull-to-refresh>
      </q-tab-panel>

      <q-tab-panel name="in_progress" class="bg-grey-2">
        <div v-if="notSavedCaseReports.length" class="row">
          <div class="col">
          </div>
          <div class="col-md-6 col-sm-8 col-xs-12">
            <div class="text-bold text-center text-uppercase">{{ $t('main.case_reports_in_progress') }}</div>

            <q-card flat bordered class="q-ma-md">
              <q-card-section>
                <q-list separator>

                  <q-item v-for="cr in notSavedCaseReports" :key="cr.id">

                    <q-item-section>
                      <q-item-label>
                        <span class="text-grey q-mr-sm">#{{ cr.id }}</span>
                        <span class="text-bold">{{ getCaseReportId(cr) }}</span>
                      </q-item-label>
                      <q-item-label caption>{{ getFormLabel(cr.crfId) }}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                      <q-item-label :title="getCaseReportLastUpdate(cr)">{{ getCaseReportLastUpdateAgo(cr) }}</q-item-label>
                      <q-btn
                        v-if="cr.state === 'in_progress'"
                        :label="$t('resume')"
                        :icon-right="$q.lang.rtl ? 'chevron_left' : 'chevron_right'"
                        class="text-capitalize q-mt-sm q-mb-sm"
                        color="secondary"
                        :to="'/case-report/' + cr.id"/>
                      <q-btn
                        v-if="cr.state === 'completed'"
                        :label="$t('save')"
                        icon-right="cloud_upload"
                        class="text-capitalize q-mt-sm q-mb-sm"
                        color="primary"
                        @click="onSave(cr)"/>
                    </q-item-section>

                  </q-item>

                </q-list>
              </q-card-section>
              <q-card-section class="text-center">
                <router-link to="/case-reports">{{$t('main.show_all_case_reports')}}</router-link>
              </q-card-section>
            </q-card>
          </div>
          <div class="col">
          </div>
        </div>
        <div v-else class="text-grey">
          {{ $t('main.no_case_reports_in_progress') }}
        </div>
      </q-tab-panel>

    </q-tab-panels>

  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { makeSchemaFormTr } from '@obiba/quasar-ui-amber'
import CaseReportFormCard from 'components/CaseReportFormCard.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    CaseReportFormCard
  },

  setup () {
    return {
      tab: ref('forms')
    }
  },

  mounted () {
    this.getCaseReportForms({ silent: true })
  },

  computed: {
    ...mapState({
      crfs: state => state.form.crfs,
      user: state => state.record.user
    }),
    caseReports () {
      return this.getCaseReports()(this.user)
    },
    notSavedCaseReports () {
      return this.caseReports
        .filter(cr => ['in_progress', 'completed'].includes(cr.state) && this.getForm(cr.crfId))
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
    ...mapGetters({
      getCaseReports: 'record/getCaseReports'
    }),
    tr (schema, key) {
      return schema ? makeSchemaFormTr(schema, { locale: this.currentLocale })(key) : '-'
    },
    getForm (crfId) {
      return this.crfs.filter(f => f._id === crfId).pop()
    },
    getFormLabel (crfId) {
      const form = this.getForm(crfId)
      return form ? this.tr(form.schema, form.name ? form.name : form.schema.label) : '?'
    },
    getCaseReportId (cr) {
      return (cr.data && cr.data._id) ? cr.data._id : ''
    },
    getCaseReportLastUpdate (cr) {
      const action = cr.actions[cr.actions.length - 1]
      return new Intl.DateTimeFormat(this.currentLocale, { dateStyle: 'full', timeStyle: 'short' }).format(action.timestamp)
    },
    getCaseReportLastUpdateAgo (cr) {
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
    },
    onRefresh (done) {
      this.getCaseReportForms({}).then(() => done())
    },
    onSave (caseReport) {
      this.$store.dispatch('record/saveCaseReport', { id: caseReport.id, force: true })
    }
  }
})
</script>
