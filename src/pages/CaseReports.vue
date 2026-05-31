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

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { date, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { BlitzForm } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm, makeSchemaFormTr } from '@obiba/quasar-ui-amber'
import { useFormStore } from '../stores/form'
import { useRecordStore } from '../stores/record'

// Stores
const formStore = useFormStore()
const recordStore = useRecordStore()

const { crfs } = storeToRefs(formStore)
const { user } = storeToRefs(recordStore)

// Quasar and i18n
const $q = useQuasar()
const { locale } = useI18n()

// Pagination
const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

// View dialog state
const viewTab = ref('form')
const viewData = ref({})
const viewDataStr = ref('{}')
const viewSchema = ref({})
const remountCounter = ref(0)
const showViewCaseReport = ref(false)
const selectedCaseReport = ref({})
const showConfirmDeleteCaseReport = ref(false)

// Computed properties
const caseReports = computed(() => {
  return recordStore.getCaseReports(user.value)
})

const pagesNumber = computed(() => {
  return Math.ceil(caseReports.value.length / pagination.value.rowsPerPage)
})

const currentLocale = computed(() => {
  return locale.value
})

// Methods
const getForm = (crfId) => {
  return crfs.value.filter(f => f._id === crfId).pop()
}

const getFormLabel = (crfId) => {
  const form = getForm(crfId)
  return form ? tr(form.schema, form.name ? form.name : form.schema.label) : '?'
}

const getFormRevision = (crfId) => {
  const form = getForm(crfId)
  return form ? form.revision : '?'
}

const startedDate = (cr) => {
  const action = cr.actions.filter(a => a.type === 'init').pop()
  return action ? date.formatDate(action.timestamp, 'YYYY-MM-DD HH:mm') : '?'
}

const updatedDate = (cr) => {
  const action = cr.actions[cr.actions.length - 1]
  return action ? date.formatDate(action.timestamp, 'YYYY-MM-DD HH:mm') : '?'
}

const updatedAgo = (cr) => {
  const action = cr.actions[cr.actions.length - 1]
  return action ? timestampAgo(action.timestamp) : '?'
}

const timestampAgo = (timestamp) => {
  const rtf = new Intl.RelativeTimeFormat(currentLocale.value, { style: 'long' })
  const minutes = Math.ceil((timestamp - Date.now()) / 60000)
  if (minutes <= -1440) {
    return rtf.format(Math.ceil(minutes / 1440), 'day')
  }
  if (minutes <= -60) {
    return rtf.format(Math.ceil(minutes / 60), 'hour')
  }
  return rtf.format(minutes, 'minute')
}

const tr = (schema, key) => {
  return schema ? makeSchemaFormTr(schema, { locale: currentLocale.value })(key) : '-'
}

const canResume = (caseReport) => {
  return caseReport.state === 'in_progress' && getForm(caseReport.crfId)
}

const canSave = (caseReport) => {
  return caseReport.state === 'completed' && getForm(caseReport.crfId)
}

const canView = (caseReport) => {
  return caseReport.state !== 'saved' && getForm(caseReport.crfId)
}

const onViewCaseReport = (caseReport) => {
  const crf = getForm(caseReport.crfId)
  viewData.value = caseReport.data
  viewDataStr.value = JSON.stringify(caseReport.data, null, '  ')
  if (crf) {
    viewSchema.value = makeBlitzarQuasarSchemaForm(crf.schema, { locale: currentLocale.value })
    remountCounter.value++
  } else {
    viewSchema.value = null
  }
  viewTab.value = 'form'
  showViewCaseReport.value = true
}

const onSave = (caseReport) => {
  recordStore.saveCaseReport({ id: caseReport.id, force: true })
}

const onConfirmDelete = (caseReport) => {
  selectedCaseReport.value = caseReport
  showConfirmDeleteCaseReport.value = true
}

const deleteCaseReport = () => {
  recordStore.deleteCaseReport({ id: selectedCaseReport.value.id })
}
</script>
