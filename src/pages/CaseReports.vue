<template>
  <q-page class="q-pt-md q-pb-md">
    <div class="text-h6 q-ml-md q-mr-md">{{ $t('main.case_reports') }}</div>
    <q-table
      grid
      :rows="caseReports"
      row-key="id"
      v-model:pagination="pagination"
    >

      <template v-slot:item="props">
        <div class="q-pt-md q-pr-md q-pl-md col-xs-12 col-sm-6 col-md-4">
          <q-card :class="props.row.state !== 'saved' ? 'bg-secondary text-white' : ''">
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <span class="q-mr-sm" :class="props.row.state === 'saved' ? 'text-grey' : 'text-grey-4'">#{{ props.row.id }}</span>
                    <span class="text-bold q-mr-sm">{{ (props.row.data && props.row.data._id) ? props.row.data._id : '' }}</span>
                    <q-badge color="accent">{{ $t('record.state.' + props.row.state) }}</q-badge>
                  </q-item-label>
                  <q-item-label>
                    <p class="q-mt-sm">
                      {{ getFormLabel(props.row.crfId) }} (v{{ getFormRevision(props.row.crfId) }})
                    </p>
                    <div>{{  }}</div>
                  </q-item-label>
                  <q-item-label>
                    <span class="text-caption" :class="props.row.state === 'saved' ? 'text-grey' : 'text-grey-4'">{{ $t('started_at', [startedDate(props.row)]) }}</span>
                  </q-item-label>
                  <q-item-label v-if="props.row.state === 'saved'">
                    <span class="text-caption">{{ $t('updated_ago', [updatedAgo(props.row)]) }}</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side v-if="props.row.state === 'saved'">
                  <q-btn
                    class="text-grey-8"
                    size="12px"
                    color="white"
                    dense
                    round
                    :title="$t('delete')"
                    icon="delete"
                    @click='onConfirmDelete(props.row)'>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-item v-if="props.row.state !== 'saved'">
                <q-item-section side v-if="canResume(props.row)">
                  <q-btn
                    class="text-grey-8"
                    size="12px"
                    color="white"
                    dense
                    round
                    :title="$t('resume')"
                    icon="play_arrow"
                    :to="'/case-report/' + props.row.id">
                  </q-btn>
                </q-item-section>
                <q-item-section side v-if="canSave(props.row)">
                  <q-btn
                    class="text-grey-8"
                    size="12px"
                    color="white"
                    dense
                    round
                    :title="$t('save')"
                    icon="cloud_upload"
                    @click="onSave(props.row)">
                  </q-btn>
                </q-item-section>
                <q-item-section side v-if="canView(props.row)">
                  <q-btn
                    class="text-grey-8"
                    size="12px"
                    color="white"
                    dense
                    round
                    :title="$t('view')"
                    icon="visibility"
                    @click='onViewCaseReport(props.row)'>
                  </q-btn>
                </q-item-section>
                <q-item-section side v-if="props.row.state !== 'saved'">
                  <q-btn
                    class="text-grey-8"
                    size="12px"
                    color="white"
                    dense
                    round
                    :title="$t('delete')"
                    icon="delete"
                    @click='onConfirmDelete(props.row)'>
                  </q-btn>
                </q-item-section>
                <q-item-section side>
                  <span class="text-white text-caption">{{ $t('updated_ago', [updatedAgo(props.row)]) }}</span>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-dialog v-model='showViewCaseReport' persistent full-width>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 300px' : 'min-width: 400px'">
        <q-card-section>
          <q-tabs
            v-model="viewTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="form" :label="$t('form')" />
            <q-tab name="data" :label="$t('data')" />
          </q-tabs>

          <q-separator/>

          <q-tab-panels v-model="viewTab">
            <q-tab-panel name="form" class="q-pl-none q-pr-none">
              <q-scroll-area v-if="viewSchema" style="height: 400px" class="q-pt-md">
                <BlitzForm :key='remountCounter' :schema='viewSchema' v-model='viewData' mode="disabled"/>
              </q-scroll-area>
              <div v-else>
                {{ $t('record.case_report_form_not_found') }}
              </div>
            </q-tab-panel>

            <q-tab-panel name="data" class="q-pl-none q-pr-none">
              <q-scroll-area style="height: 400px">
                <div class="bg-black text-white q-pa-md">
                  <pre>{{ viewDataStr }}</pre>
                </div>
              </q-scroll-area>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('close')" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model='showConfirmDeleteCaseReport' persistent>
      <q-card>
        <q-card-section>
          <div v-if="selectedCaseReport.state === 'saved'">
            {{$t('record.delete_saved_record_confirm')}}
          </div>
          <div v-else>
            {{$t('record.delete_record_confirm')}}
          </div>
          <div class="text-center q-mt-md">
            <span class="text-grey q-mr-sm">#{{ selectedCaseReport.id }}</span>
            <span class="text-bold">{{ selectedCaseReport.data && selectedCaseReport.data._id ? selectedCaseReport.data._id : '' }}</span>
          </div>
        </q-card-section>
        <q-card-actions align='right'>
          <q-btn :label="$t('cancel')" flat v-close-popup />
          <q-btn
            @click='deleteCaseReport'
            :label="$t('delete')"
            type='submit'
            color='positive'
            v-close-popup
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { date } from 'quasar'
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm, makeSchemaFormTr } from '@obiba/quasar-ui-amber'

export default defineComponent({
  name: 'CaseReports',
  components: { BlitzForm },
  setup () {
    const pagination = ref({
      sortBy: 'id',
      descending: true,
      page: 1,
      rowsPerPage: 10
    })

    return {
      pagination,
      pagesNumber: computed(() => {
        return Math.ceil(this.caseReports.length / pagination.value.rowsPerPage)
      })
    }
  },
  data () {
    return {
      viewTab: 'form',
      viewData: {},
      viewDataStr: '{}',
      viewSchema: {},
      remountCounter: 0,
      showViewCaseReport: false,
      selectedCaseReport: {},
      showConfirmDeleteCaseReport: false
    }
  },

  computed: {
    ...mapState({
      crfs: state => state.form.crfs,
      user: state => state.record.user
    }),
    caseReports () {
      return this.getCaseReports()(this.user)
    },
    currentLocale () {
      return this.$root.$i18n.locale
    }
  },

  methods: {
    ...mapGetters({
      getCaseReports: 'record/getCaseReports'
    }),
    getForm (crfId) {
      return this.crfs.filter(f => f._id === crfId).pop()
    },
    getFormLabel (crfId) {
      const form = this.getForm(crfId)
      return form ? this.tr(form.schema, form.name ? form.name : form.schema.label) : '?'
    },
    getFormRevision (crfId) {
      const form = this.getForm(crfId)
      return form ? form.revision : '?'
    },
    startedDate (cr) {
      const action = cr.actions.filter(a => a.type === 'init').pop()
      return action ? date.formatDate(action.timestamp, 'YYYY-MM-DD HH:mm') : '?'
    },
    updatedDate (cr) {
      const action = cr.actions[cr.actions.length - 1]
      return action ? date.formatDate(action.timestamp, 'YYYY-MM-DD HH:mm') : '?'
    },
    updatedAgo (cr) {
      const action = cr.actions[cr.actions.length - 1]
      return action ? this.timestampAgo(action.timestamp) : '?'
    },
    timestampAgo (timestamp) {
      const rtf = new Intl.RelativeTimeFormat(this.currentLocale, { style: 'long' })
      const minutes = Math.ceil((timestamp - Date.now()) / 60000)
      if (minutes <= -1440) {
        return rtf.format(Math.ceil(minutes / 1440), 'day')
      }
      if (minutes <= -60) {
        return rtf.format(Math.ceil(minutes / 60), 'hour')
      }
      return rtf.format(minutes, 'minute')
    },
    tr (schema, key) {
      return schema ? makeSchemaFormTr(schema, { locale: this.currentLocale })(key) : '-'
    },
    canResume (caseReport) {
      return caseReport.state === 'in_progress' && this.getForm(caseReport.crfId)
    },
    canSave (caseReport) {
      return caseReport.state === 'completed' && this.getForm(caseReport.crfId)
    },
    canView (caseReport) {
      return caseReport.state !== 'saved' && this.getForm(caseReport.crfId)
    },
    onViewCaseReport (caseReport) {
      const crf = this.getForm(caseReport.crfId)
      this.viewData = caseReport.data
      this.viewDataStr = JSON.stringify(caseReport.data, null, '  ')
      if (crf) {
        this.viewSchema = makeBlitzarQuasarSchemaForm(crf.schema, { locale: this.currentLocale })
        this.remountCounter++
      } else {
        this.viewSchema = null
      }
      this.viewTab = 'form'
      this.showViewCaseReport = true
    },
    onSave (caseReport) {
      this.$store.dispatch('record/saveCaseReport', { id: caseReport.id, force: true })
    },
    onConfirmDelete (caseReport) {
      this.selectedCaseReport = caseReport
      this.showConfirmDeleteCaseReport = true
    },
    deleteCaseReport () {
      this.$store.dispatch('record/deleteCaseReport', { id: this.selectedCaseReport.id })
    }
  }
})
</script>
