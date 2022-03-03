<template>
  <q-layout v-cloak view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" v-touch-swipe.mouse.left.right="handleSwipe">
      <q-toolbar>
        <q-toolbar-title>
          {{ $t('case_report') }}
        </q-toolbar-title>
        <q-toolbar-title>
          <span class="text-subtitle2 float-right">{{ tr(crf.schema.label) }}
          <q-btn
            v-if="crf.schema.description"
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
      <q-page>
        <div v-if="isMulti()">
          <q-linear-progress :value="progress" animation-speed="100" />
        </div>
        <div class="q-pa-md">
          <div class="row">
            <div v-if="!$q.screen.lt.sm" class="col-md-4 col-sm-2" :class="(canPrevious() && isMulti()) ? 'text-grey-3 text-center flex flex-center cursor-pointer' : ''" @click="previousStep">
              <q-icon
                v-if="canPrevious()"
                name="arrow_back"
                size="xl"
                class=""
                />
            </div>
            <div class="col-md-4 col-sm-8 col-xs-12 q-mt-sm q-mb-sm">
              <div v-if="isFinalStep">
                <div class="text-subtitle1 q-mt-md q-mb-md">
                  {{ $t('final_step_label') }}
                </div>
                <q-btn :label="$t('save')" icon="check" color="primary" @click="onComplete"/>
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
            <div v-if="!$q.screen.lt.sm" class="col-md-4 col-sm-2" :class="(canNext() && isMulti()) ? 'text-grey-3 text-center flex flex-center cursor-pointer' : ''" @click="nextStep">
              <q-icon
                v-if="canNext()"
                name="arrow_forward"
                size="xl"
                />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white" v-touch-swipe.mouse.left.right="handleSwipe">
      <q-toolbar>
        <q-select
          dark
          emit-value
          v-model="mode"
          :options="modeOptions">
          <template v-slot:selected>
            <q-icon
              :name="mode === 'single' ? 'grading' : 'dynamic_feed'"
              size="sm"
              />
          </template>
        </q-select>
        <q-space />

        <q-separator dark vertical v-if="isMulti()" />
        <q-btn
          v-if="isMulti()"
          stretch
          flat
          icon="chevron_left"
          @click="previousStep"
          :label="$q.screen.lt.sm ? '' : $t('previous')"
          :disabled="!canPrevious()"/>
        <q-separator dark vertical v-if="isMulti()" />
        <q-btn
          v-if="isMulti()"
          stretch
          flat
          icon="chevron_right"
          @click="nextStep"
          :label="$q.screen.lt.sm ? '' : $t('next')"
          :disabled="!canNext()"/>
        <q-separator dark vertical v-if="mode === 'single'" />
        <q-btn-dropdown
          v-if="mode === 'single' && toc.length > 0"
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
        <q-separator dark vertical v-if="mode === 'single'" />
        <q-btn
          v-if="mode === 'single'"
          flat
          :title="$t('validate_save')"
          :label="$q.screen.lt.sm ? '' : $t('save')"
          icon="check"
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
      <q-card>
        <q-card-section>
          <div v-html="md(tr(crf.schema.description))"/>
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

const { getScrollTarget, setVerticalScrollPosition } = scroll

export default defineComponent({
  name: 'CaseReport',

  components: {
    BlitzForm
  },

  setup () {
    return {
      errorsRemain: ref(false),
      errors: ref([])
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
      user: state => state.auth.payload ? state.auth.payload.user : undefined
    }),
    currentLocale () {
      return this.$root.$i18n.locale
    },
    caseReportId () {
      return this.$route.params.id
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
