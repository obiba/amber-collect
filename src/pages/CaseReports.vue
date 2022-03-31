<template>
  <q-page class="q-pt-md q-pb-md">
    <div class="text-h6 q-ml-md q-mr-md">{{ $t('main.case_reports') }}</div>
    <q-table
      flat
      :rows="caseReports"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell-id='props'>
        <q-td :props='props'>
          <a v-if="canView(props.row)" href="javascript:void(0)" @click="onViewCaseReport(props.row)">{{ props.row.id }}</a>
          <span v-else>{{ props.row.id }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-action='props'>
        <q-td :props='props'>
          <q-btn
            v-if="canResume(props.row)"
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('resume')"
            icon="play_arrow"
            :to="'/case-report/' + props.row.id">
          </q-btn>
          <q-btn
            v-if="canSave(props.row)"
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('save')"
            icon="cloud_upload"
            @click="onSave(props.row)">
          </q-btn>
          <q-btn
            v-if="canView(props.row)"
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('view')"
            icon="visibility"
            @click='onViewCaseReport(props.row)'>
          </q-btn>
          <q-btn
            class="text-grey-8"
            size="12px"
            flat
            dense
            round
            :title="$t('delete')"
            icon="delete"
            @click='onConfirmDelete(props.row)'>
          </q-btn>
        </q-td>
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
import { defineComponent } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { date } from 'quasar'
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm, makeSchemaFormTr } from '@obiba/quasar-ui-amber'

export default defineComponent({
  name: 'CaseReports',
  components: { BlitzForm },
  data () {
    const cols = [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: row => row.id,
        sortable: true
      },
      {
        name: '_id',
        required: true,
        label: this.$t('id'),
        align: 'left',
        field: row => (row.data && row.data._id) ? row.data._id : '',
        sortable: true
      },
      {
        name: 'form',
        required: true,
        label: this.$t('form'),
        align: 'left',
        field: row => {
          const form = this.getForm(row.crfId)
          return form ? this.tr(form.schema, form.schema.label) : '?'
        },
        sortable: true
      },
      {
        name: 'started_at',
        required: true,
        label: this.$t('started_at'),
        align: 'left',
        field: row => {
          const action = row.actions.filter(a => a.type === 'init').pop()
          return action ? action.timestamp : '?'
        },
        format: (val) => date.formatDate(val, 'YYYY-MM-DD HH:mm'),
        sortable: true
      },
      {
        name: 'updated_at',
        required: true,
        label: this.$t('updated_at'),
        align: 'left',
        field: row => {
          const action = row.actions[row.actions.length - 1]
          return action ? action.timestamp : '?'
        },
        format: (val) => date.formatDate(val, 'YYYY-MM-DD HH:mm'),
        sortable: true
      },
      {
        name: 'state',
        required: true,
        label: this.$t('state'),
        align: 'left',
        field: row => this.$t('record.state.' + row.state),
        sortable: true
      },
      {
        name: 'action',
        align: 'left',
        label: this.$t('action')
      }
    ]
    return {
      columns: cols,
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
      user: state => state.auth.payload ? state.auth.payload.user : undefined
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
      this.$store.dispatch('record/saveCaseReport', { id: caseReport.id })
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
