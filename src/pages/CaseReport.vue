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
          <div class="row">
            <div class="col">
            </div>
            <div class="col-md-4 col-sm-8 col-xs-12 q-mt-sm q-mb-sm">
              <div>
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
      <q-btn-dropdown
        v-if="toc.length > 0"
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

      <q-space />

      <q-separator dark vertical />
      <q-btn stretch flat :title="$t('validate_save')" icon="check" @click="onComplete"/>
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
      formData: {},
      schema: [],
      crf: { schema: { items: [] } },
      showFormDescription: false
    }
  },

  mounted () {
    const caseReport = this.getCaseReportById()(this.caseReportId)
    if (caseReport) {
      this.crf = this.crfs ? this.crfs.filter(f => f._id === caseReport.crfId).pop() : { schema: { items: [] } }
      this.schema = makeBlitzarQuasarSchemaForm(this.crf.schema, { locale: this.currentLocale })
      this.formData = caseReport.data
      this.remountCounter++
    } else {
      console.error('No such record with id: ' + this.caseReportId)
      this.$router.push('/')
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
    }
  },

  methods: {
    ...mapGetters({
      getCaseReportById: 'record/getCaseReportById'
    }),
    ...mapActions({
      pauseCaseReport: 'record/pauseCaseReport',
      completeCaseReport: 'record/completeCaseReport',
      setCaseReportData: 'record/setCaseReportData'
    }),
    hasIdLabel () {
      return this.crf.schema.idLabel
    },
    onShowFormDescription () {
      this.showFormDescription = true
    },
    onScroll (id) {
      const ele = document.getElementById(id)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop
      const duration = 200
      setVerticalScrollPosition(target, offset, duration)
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
        this.completeCaseReport({
          id: this.caseReportId,
          user: this.user.email,
          revision: this.crf.revision
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
