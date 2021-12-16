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
          <a href="javascript:void(0)" :title="props.row.id" @click="onViewCaseReport(props.row)">{{ props.row.id.substring(0, 6) + '...' }}</a>
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

    <q-dialog v-model='showViewCaseReport' persistent>
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
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
            <q-tab name="form" label="form" />
            <q-tab name="data" label="data" />
          </q-tabs>

          <q-separator/>

          <q-tab-panels v-model="viewTab">
            <q-tab-panel name="form" class="q-pl-none q-pr-none">
              <q-scroll-area style="height: 400px" class="q-pt-md">
                <BlitzForm :key='remountCounter' :schema='viewSchema' v-model='viewData' mode="disabled"/>
              </q-scroll-area>
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

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
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
        label: this.$t('id'),
        align: 'left',
        field: row => row.id,
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
      showViewCaseReport: false
    }
  },

  computed: {
    ...mapState({
      crfs: state => state.form.crfs,
      caseReports: state => state.record.caseReports
    }),
    currentLocale () {
      return this.$root.$i18n.locale
    }
  },

  methods: {
    getForm (crfId) {
      return this.crfs.filter(f => f._id === crfId).pop()
    },
    tr (schema, key) {
      return schema ? makeSchemaFormTr(schema, { locale: this.currentLocale })(key) : '-'
    },
    canResume (caseReport) {
      return caseReport.state === 'in_progress' && this.getForm(caseReport.crfId)
    },
    onConfirmDelete (caseReport) {

    },
    onViewCaseReport (caseReport) {
      this.viewData = caseReport.data
      this.viewDataStr = JSON.stringify(caseReport.data, null, '  ')
      const crf = this.getForm(caseReport.crfId)
      this.viewSchema = makeBlitzarQuasarSchemaForm(crf.schema, { locale: this.currentLocale })
      this.remountCounter++
      this.showViewCaseReport = true
    }
  }
})
</script>
