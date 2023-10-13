<template>

  <q-item-section>
    <q-item-label>
      <span class="text-bold">{{ tr(form.name ? form.name : form.schema.label) }}</span>
    </q-item-label>
    <q-item-label caption>
      <div v-html="md(truncate(tr(form.description ? form.description : form.schema.description)))"/>
    </q-item-label>
  </q-item-section>

  <q-item-section side top>
    <q-btn
        icon-right="more_horiz"
        rounded
        flat
        class="text-capitalize q-mt-sm q-mb-sm"
        @click="onShowDetails"/>
  </q-item-section>

  <q-dialog v-model='showCaseReportFormDetails' full-width position="bottom">
    <q-card>
      <q-card-section>
        <q-item-label>
          <span class="text-bold">{{ tr(form.name ? form.name : form.schema.label) }}</span>
        </q-item-label>
        <q-item-label caption>{{ 'v' + form.revision }}</q-item-label>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <q-item-label caption>
          <div v-html="md(tr(form.description ? form.description : form.schema.description))"/>
        </q-item-label>
      </q-card-section>
      <q-card-section>
        <q-btn
        :label="$t('main.new_case_report')"
        :icon-right="$q.lang.rtl ? 'chevron_left' : 'chevron_right'"
        color="primary"
        no-caps
        class="q-mt-sm q-mb-sm"
        @click="onStart"/>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model='showCreateCaseReportRecord' persistent>
    <q-card>
      <q-card-section>
        <div>
          <BlitzForm
            :key="remountCounter"
            :schema="schema"
            v-model="formData"
            :columnCount="1"
            gridGap='32px' />
        </div>
      </q-card-section>
      <q-card-actions align='right'>
        <q-btn :label="$t('cancel')" flat v-close-popup />
        <q-btn
          @click='startRecord'
          :label="$t('start')"
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

</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { marked } from 'marked'
import { makeBlitzarQuasarSchemaForm, makeSchemaFormTr } from '@obiba/quasar-ui-amber'
import { BlitzForm, validateFormPerSchema } from '@blitzar/form'

export default defineComponent({
  name: 'CaseReportFormCard',
  props: ['form'],
  components: {
    BlitzForm
  },

  data () {
    return {
      showCaseReportFormDetails: false,
      showCreateCaseReportRecord: false,
      remountCounter: 0,
      formData: {},
      schema: []
    }
  },

  computed: {
    ...mapState({
      user: state => state.record.user
    }),
    currentLocale () {
      return this.$root.$i18n.locale
    }
  },

  methods: {
    ...mapActions({
      initCaseReport: 'record/initCaseReport'
    }),
    tr (key) {
      return makeSchemaFormTr(this.form.schema, { locale: this.currentLocale })(key)
    },
    truncate (text) {
      if (!text) return text
      const sentences = text.split('.')
      return sentences[0] + (sentences.length > 1 && sentences[1] !== '' ? '...' : '.')
    },
    md (text) {
      return text ? marked.parse(this.tr(text), { headerIds: false, mangle: false }) : text
    },
    onShowDetails () {
      this.showCaseReportFormDetails = true
    },
    onStart () {
      const idSchema = {
        items: [{
          name: '_id',
          type: 'text',
          label: this.form.schema.idLabel ? this.form.schema.idLabel : 'ID',
          description: this.form.schema.idDescription,
          mask: this.form.schema.idMask,
          validation: this.form.schema.idValidation,
          validationMessage: this.form.schema.idValidationMessage,
          required: true
        }],
        i18n: this.form.schema.i18n
      }
      this.schema = makeBlitzarQuasarSchemaForm(idSchema, { locale: this.currentLocale })
      this.formData = {}
      this.remountCounter++
      this.showCreateCaseReportRecord = true
    },
    startRecord () {
      const result = validateFormPerSchema(this.formData, this.schema)
      const errors = Object.keys(result)
        .filter(key => result[key] !== null && result[key] !== false)
        .reduce((obj, key) => {
          obj[key] = result[key]
          return obj
        }, {})
      if (Object.keys(errors).length === 0) {
        this.initCaseReport({
          crf: this.form,
          data: this.formData,
          user: this.user.email
        }).then((recordId) => {
          this.$router.push('/case-report/' + recordId)
        })
      }
    }
  }
})
</script>
