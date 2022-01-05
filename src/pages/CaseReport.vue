<template>
  <q-layout v-cloak view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
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
        <div class="q-pa-md">
          <div v-if="mode === 'multi'">
            <q-linear-progress :value="progress" animation-speed="100" />
          </div>
          <div class="row">
            <div class="col">
            </div>
            <div class="col-md-4 col-sm-8 col-xs-12 q-mt-sm q-mb-sm">
              <div v-if="isFinalStep">
                <div class="text-h6 q-mt-md q-mb-md">
                  This is the end of the form, congratulations!
                </div>
                <q-btn :label="$t('save')" icon="check" @click="onComplete"/>
              </div>
              <div v-else>
                <BlitzForm
                  :key="remountCounter"
                  :schema="schema"
                  v-model="formData"
                  :columnCount="1"
                  gridGap='32px'
                  @update:modelValue="onUpdateFormData" />
              </div>
              <!--div class="bg-black text-white q-mt-lg q-pa-md">
                <pre>{{ JSON.stringify(formData, null, '  ') }}</pre>
              </div-->
            </div>
            <div class="col">
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
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

        <q-separator dark vertical v-if="mode === 'multi'" />
        <q-btn v-if="mode === 'multi'" stretch flat icon="chevron_left" @click="previousStep" :disabled="formData.__step === 0"/>
        <q-separator dark vertical v-if="mode === 'multi'" />
        <q-btn v-if="mode === 'multi'" stretch flat icon="chevron_right" @click="nextStep" :disabled="formData.__step === crf.schema.items.length"/>
        <q-separator dark vertical v-if="mode === 'single'" />
        <q-btn-dropdown
          v-if="mode === 'single' && toc.length > 0"
          stretch
          flat
          icon="toc"
          :title="$t('go_to')">
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
        <q-btn v-if="mode === 'single'" flat :title="$t('validate_save')" icon="check" @click="onComplete"/>
        <q-separator dark vertical />
        <q-btn stretch flat :title="$t('pause')" icon="pause" @click="onPause"/>
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
import { makeBlitzarQuasarSchemaForm, makeSchemaFormTr } from '@obiba/quasar-ui-amber'
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
      errors: ref({})
    }
  },

  data () {
    return {
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
    const caseReport = this.getCaseReportById()(this.caseReportId)
    if (caseReport) {
      this.crf = this.crfs ? this.crfs.filter(f => f._id === caseReport.crfId).pop() : { schema: { items: [] } }
      this.schema = makeBlitzarQuasarSchemaForm(this.crf.schema, { locale: this.currentLocale, stepId: '__step' })
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
      if (newValue === 'single') {
        this.schema = makeBlitzarQuasarSchemaForm(this.crf.schema, { locale: this.currentLocale })
      } else {
        this.schema = makeBlitzarQuasarSchemaForm(this.crf.schema, { locale: this.currentLocale, stepId: '__step' })
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
      return this.mode === 'multi' && this.formData.__step === this.crf.schema.items.length
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
    previousStep () {
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
    nextStep () {
      this.onValidate()
      // if no error in the step, continue
      if (this.errorsRemain) {
        console.log(this.errors)
        Notify.create({
          message: this.$t('validation_errors'),
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
    onUpdateFormData () {
      this.setCaseReportData({
        id: this.caseReportId,
        data: this.formData
      })
    },
    onValidate () {
      this.errorsRemain = false
      this.errors = {}
      const result = validateFormPerSchema(this.formData, this.schema)
      this.errors = Object.keys(result)
        .filter(key => result[key] !== null)
        .reduce((obj, key) => {
          obj[key] = result[key]
          return obj
        }, {})
      this.errorsRemain = this.errors && Object.keys(this.errors).length > 0
    },
    onComplete () {
      this.onValidate()
      if (this.errorsRemain) {
        console.log(this.errors)
        Notify.create({
          message: this.$t('validation_errors'),
          color: 'negative'
        })
      } else {
        console.log('completing')
        this.completeCaseReport({
          id: this.caseReportId,
          user: this.user.email,
          revision: this.crf.revision
        }).then(() => {
          console.log('completed')
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
