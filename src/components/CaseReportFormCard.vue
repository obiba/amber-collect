<template>

  <q-item-section>
    <q-item-label>
      <span class="text-bold">{{ tr(form.name) }}</span>
    </q-item-label>
    <q-item-label caption>
      <div v-html="md(tr(form.description))"/>
    </q-item-label>
  </q-item-section>

  <q-item-section side top>
    <q-item-label caption>{{ 'v' + form.revision }}</q-item-label>
    <q-btn
        :label="$t('start')"
        icon-right="play_arrow"
        class="text-capitalize q-mt-sm q-mb-sm"
        color="primary"
        @click="onStart"/>
  </q-item-section>

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
import snarkdown from 'snarkdown'
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
    md (text) {
      return text ? snarkdown(text) : text
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
