<template>
  <q-layout v-cloak view="hHh lpR fFf">

    <q-header elevated :class="settings.theme.header" v-touch-swipe.mouse.left.right="handleSwipe">
      <q-toolbar>
        <q-toolbar-title>
          {{ $t('case_report') }}
        </q-toolbar-title>
        <q-toolbar-title>
          <span class="text-subtitle2 float-right">{{ tr(crf.schema.label) }}
          <q-btn
            v-if="crf.schema.description || crf.schema.copyright || crf.schema.license"
            size="12px"
            flat
            dense
            round
            icon='info'
            @click='onShowFormDescription'>
          </q-btn></span>
        </q-toolbar-title>
      </q-toolbar>
      <q-toolbar v-if="hasIdLabel()" class="bg-secondary q-pt-sm q-pb-sm" style="min-height: 20px">
        <div>{{ idLabel }}: {{ formData._id }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-grey-2">
        <div v-if="isMulti()">
          <q-linear-progress :value="progress" animation-speed="100" />
        </div>
        <div class="q-pa-md">
          <div class="row">
            <div v-if="!$q.screen.lt.sm" class="col-md-4 col-sm-2" :class="(canPrevious() && isMulti()) ? 'text-grey-5 text-center flex flex-center cursor-pointer' : ''" @click="previousStep">
              <q-icon
                v-if="canPrevious()"
                :name="$q.lang.rtl ? 'arrow_forward' : 'arrow_back'"
                size="xl"
                class=""
                />
            </div>
            <div class="col-md-4 col-sm-8 col-xs-12 q-mt-sm q-mb-sm">
              <div v-if="isFinalStep">
                <div class="text-subtitle1 q-mt-md q-mb-md">
                  {{ $t('final_step_label') }}
                </div>
                <q-btn
                  :label="$t('save')"
                  icon="cloud_upload"
                  color="primary"
                  @click="onComplete"/>
              </div>
              <div v-else>
                <BlitzForm
                  :key="remountCounter"
                  :schema="schema"
                  v-model="formData"
                  :columnCount="1"
                  gridGap='32px'/>
              </div>
              <!--div class="bg-black text-white q-mt-lg q-pa-md">
                <pre>{{ JSON.stringify(formData, null, '  ') }}</pre>
              </div-->
            </div>
            <div v-if="!$q.screen.lt.sm" class="col-md-4 col-sm-2" :class="(canNext() && isMulti()) ? 'text-grey-5 text-center flex flex-center cursor-pointer' : ''" @click="nextStep">
              <q-icon
                v-if="canNext()"
                :name="$q.lang.rtl ? 'arrow_back' : 'arrow_forward'"
                size="xl"
                />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated :class="settings.theme.footer" v-touch-swipe.mouse.left.right="handleSwipe">
      <q-toolbar>
        <q-btn
          v-if="mode === 'single'"
          stretch
          flat
          icon="dynamic_feed"
          @click="toggleMode('multi')"
          :title="$t('multi_steps')"/>
        <q-btn
          v-if="mode === 'multi'"
          stretch
          flat
          icon="grading"
          @click="toggleMode('single')"
          :title="$t('single_page')"/>
        <q-separator dark vertical v-if="mode === 'single'" />
        <q-btn-dropdown
          v-if="mode === 'single' && toc.length > 1"
          stretch
          flat
          icon="toc"
          :label="$q.screen.lt.sm ? '' : $t('go_to')">
          <q-list>
            <q-item-label
              v-for="entry in toc"
              :key="entry.id"
              header
              clickable
              v-close-popup
              @click="onScroll(entry.id)">
              {{ entry.label }}
            </q-item-label>
          </q-list>
        </q-btn-dropdown>
        <q-space />

        <q-separator dark vertical v-if="isMulti()" />
        <q-btn
          v-if="isMulti()"
          stretch
          flat
          :icon="$q.lang.rtl ? 'chevron_right' : 'chevron_left'"
          @click="previousStep"
          :label="$q.screen.lt.sm ? '' : $t('previous')"
          :disabled="!canPrevious()"/>
        <q-separator dark vertical v-if="isMulti()" />
        <q-btn
          v-if="isMulti()"
          stretch
          flat
          :icon="$q.lang.rtl ? 'chevron_left' : 'chevron_right'"
          @click="nextStep"
          :label="$q.screen.lt.sm ? '' : $t('next')"
          :disabled="!canNext()"/>
        <q-separator dark vertical v-if="mode === 'single'" />
        <q-btn
          v-if="mode === 'single'"
          stretch
          flat
          class="bg-primary"
          :title="$t('validate_save')"
          :label="$t('save')"
          icon="cloud_upload"
          @click="onComplete"/>
        <q-separator dark vertical />
        <q-btn
          stretch
          flat
          :label="$q.screen.lt.sm ? '' : $t('pause')"
          icon="pause"
          @click="onPause"/>
      </q-toolbar>
    </q-footer>

    <q-dialog v-model="showFormDescription">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div v-if="crf.schema.description" v-html="md(tr(crf.schema.description))"/>
        </q-card-section>
        <q-card-section>
          <div v-if="crf.schema.copyright" v-html="'&#169; ' + md(tr(crf.schema.copyright))"/>
          <div v-if="caseReportLicense" class="q-mt-sm" v-html="md($t(caseReportLicense))"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import snarkdown from 'snarkdown'
import { makeBlitzarQuasarSchemaForm, makeSchemaFormTr, getBlitzarErrors } from '@obiba/quasar-ui-amber'
import { Notify, scroll } from 'quasar'
import { BlitzForm, validateFormPerSchema } from '@blitzar/form'
import { t } from '../boot/i18n'
import { settings } from '../boot/settings'

const { getScrollTarget, setVerticalScrollPosition } = scroll

export default defineComponent({
  name: 'CaseReport',

  components: {
    BlitzForm
  },

  setup () {
    const ccLicenses = [
      {
        value: 'cc-by-40',
        label: 'license.cc_by_40'
      },
      {
        value: 'cc-by-sa-40',
        label: 'license.cc_by_sa_40'
      },
      {
        value: 'cc-by-nc-40',
        label: 'license.cc_by_nc_40'
      },
      {
        value: 'cc-by-nc-sa-40',
        label: 'license.cc_by_nc_sa_40'
      },
      {
        value: 'cc-by_nd-40',
        label: 'license.cc_by_nd_40'
      },
      {
        value: 'cc-by-nc-nd-40',
        label: 'license.cc_by_nc_nd_40'
      },
      {
        value: 'cc-cc0-10',
        label: 'license.cc_cc0_10'
      }
    ]
    return {
      errorsRemain: ref(false),
      errors: ref([]),
      settings: settings,
      ccLicenses: ccLicenses
    }
  },

  data () {
    return {
      debug: false,
      remountCounter: 0,
      progress: 0,
      formData: {},
      schema: [],
      crf: { schema: { items: [] } },
      showFormDescription: false,
      mode: 'multi'
    }
  },

  mounted () {
    const caseReport = this.getCaseReportById()(this.user, this.caseReportId)
    if (caseReport) {
      this.crf = this.crfs ? this.crfs.filter(f => f._id === caseReport.crfId).pop() : { schema: { items: [] } }
      if (this.crf.schema.layout) {
        this.mode = this.crf.schema.layout
      }
      this.schema = makeBlitzarQuasarSchemaForm(this.crf.schema, { locale: this.currentLocale, stepId: '__step', debug: this.debug })
      if (!caseReport.data || !caseReport.data.__step) {
        this.mergeCaseReportData({
          id: this.caseReportId,
          data: { __step: 0 }
        })
      }
      this.formData = caseReport.data
      this.updateProgress()
      this.remountCounter++
    } else {
      console.error('No such record with id: ' + this.caseReportId)
      this.$router.push('/')
    }
  },

  watch: {
    mode (newValue, oldValue) {
      this.updateFormData()
      if (newValue === 'single') {
        this.schema = makeBlitzarQuasarSchemaForm(this.crf.schema, { locale: this.currentLocale, debug: this.debug })
      } else {
        this.schema = makeBlitzarQuasarSchemaForm(this.crf.schema, { locale: this.currentLocale, stepId: '__step', debug: this.debug })
      }
      this.updateProgress()
      this.remountCounter++
    }
  },

  computed: {
    ...mapState({
      crfs: state => state.form.crfs,
      user: state => state.record.user
    }),
    currentLocale () {
      return this.$root.$i18n.locale
    },
    caseReportId () {
      return this.$route.params.id
    },
    caseReportLicense () {
      const license = this.crf.schema.license
      let found = this.ccLicenses.filter(lic => lic.value === license).pop()
      if (!found && settings.licenses) {
        found = settings.licenses.filter(lic => lic.value === license).pop()
      }
      if (found) {
        return found.label ? found.label : found.value
      }
      return license
    },
    toc () {
      const toc = []
      if (this.crf.schema && this.crf.schema.items) {
        this.crf.schema.items.filter(item => ['group', 'section'].includes(item.type)).forEach(item => toc.push({
          id: item.name.replaceAll('.', '_').toLowerCase(),
          label: this.tr(item.label)
        }))
      }
      return toc.filter(entry => entry.label)
    },
    idLabel () {
      return this.crf.schema.idLabel ? this.tr(this.crf.schema.idLabel) : 'ID'
    },
    isFinalStep () {
      return this.isMulti() && this.formData.__step === this.crf.schema.items.length
    },
    modeOptions () {
      return [
        {
          value: 'single',
          label: t('single_page')
        },
        {
          value: 'multi',
          label: t('multi_steps')
        }
      ]
    }
  },

  methods: {
    ...mapGetters({
      getCaseReportById: 'record/getCaseReportById'
    }),
    ...mapActions({
      pauseCaseReport: 'record/pauseCaseReport',
      completeCaseReport: 'record/completeCaseReport',
      saveCaseReport: 'record/saveCaseReport',
      setCaseReportData: 'record/setCaseReportData',
      mergeCaseReportData: 'record/mergeCaseReportData'
    }),
    hasIdLabel () {
      return this.crf.schema.idLabel
    },
    onShowFormDescription () {
      this.showFormDescription = true
    },
    onScroll (id) {
      const ele = document.getElementById(id)
      if (ele) {
        const target = getScrollTarget(ele)
        const offset = ele.offsetTop
        const duration = 200
        setVerticalScrollPosition(target, offset, duration)
      }
    },
    updateProgress () {
      this.progress = this.formData.__step / this.crf.schema.items.length
    },
    isMulti () {
      return this.mode === 'multi'
    },
    handleSwipe ({ evt, ...newInfo }) {
      if (this.isMulti()) {
        if (newInfo.direction === 'left') {
          this.nextStep()
        } else if (newInfo.direction === 'right') {
          this.previousStep()
        }
      }
    },
    formatErrorMessages () {
      const errorMessages = this.errors.map(err => {
        let errMessage = err.message === 'Field is required' ? t('required_field') : err.message
        errMessage = errMessage.charAt(0).toLowerCase() + errMessage.slice(1)
        return `<li>${err.label}: ${errMessage}</li>`
      }).join('')
      return `<ul>${errorMessages}</ul>`
    },
    canPrevious () {
      return this.isMulti() && this.formData.__step > 0
    },
    toggleMode (value) {
      this.mode = value
    },
    previousStep () {
      if (!this.canPrevious()) return

      this.updateFormData()
      this.mergeCaseReportData({
        id: this.caseReportId,
        data: { __step: this.formData.__step - 1 }
      })
      this.updateProgress()
      this.remountCounter++
      this.errorsRemain = false
      this.errors = undefined
      window.scrollTo(0, 0)
    },
    canNext () {
      return this.isMulti() && this.formData.__step < this.crf.schema.items.length
    },
    nextStep () {
      if (!this.canNext()) return

      this.updateFormData()
      this.onValidate()
      // if no error in the step, continue
      if (this.errorsRemain) {
        Notify.create({
          message: this.$t('validation_errors', { errors: this.formatErrorMessages() }),
          html: true,
          color: 'negative'
        })
      } else {
        this.mergeCaseReportData({
          id: this.caseReportId,
          data: { __step: this.formData.__step + 1 }
        })
        this.updateProgress()
        this.remountCounter++
        window.scrollTo(0, 0)
      }
    },
    updateFormData () {
      this.setCaseReportData({
        id: this.caseReportId,
        data: this.formData
      })
    },
    onValidate () {
      this.errors = getBlitzarErrors(this.schema, validateFormPerSchema(this.formData, this.schema))
      this.errorsRemain = this.errors.length > 0
    },
    onComplete () {
      this.updateFormData()
      this.onValidate()
      if (this.errorsRemain) {
        Notify.create({
          message: this.$t('validation_errors', { errors: this.formatErrorMessages() }),
          html: true,
          color: 'negative'
        })
      } else {
        this.completeCaseReport({
          id: this.caseReportId,
          user: this.user.email,
          revision: this.crf.revision
        }).then(() => {
          this.saveCaseReport({
            id: this.caseReportId,
            user: this.user.email
          })
        }).then(() => {
          this.$router.push('/')
        })
      }
    },
    onPause () {
      this.updateFormData()
      this.pauseCaseReport({
        id: this.caseReportId,
        user: this.user.email
      }).then(() => {
        this.$router.push('/')
      })
    },
    tr (key) {
      return makeSchemaFormTr(this.crf.schema, { locale: this.currentLocale })(key)
    },
    md (text) {
      return text ? snarkdown(text) : text
    }
  }

})
</script>
