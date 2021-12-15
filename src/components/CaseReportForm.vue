<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col">
      </div>
      <div class="col-md-4 col-sm-8 col-xs-12">
        <div>
          <BlitzForm
            :key="remountCounter"
            :schema="schema"
            v-model="formData"
            :columnCount="1"
            gridGap='32px'
            @update:modelValue="onUpdateFormData" />
        </div>
        <div class="bg-black text-white q-mt-lg q-pa-md">
          <pre>{{ JSON.stringify(formData, null, '  ') }}</pre>
        </div>
      </div>
      <div class="col">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { BlitzForm, validateFormPerSchema } from '@blitzar/form'
import { makeBlitzarQuasarSchemaForm } from '@obiba/quasar-ui-amber'

export default {
  components: { BlitzForm },
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data () {
    const formData = {}
    return {
      remountCounter: 0,
      formData: formData
    }
  },

  computed: {
    ...mapState({
      user: state => state.auth.payload ? state.auth.payload.user : undefined
    }),
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
    currentLocale () {
      return this.$root.$i18n.locale
    },
    schema () {
      if (this.value.items) {
        return makeBlitzarQuasarSchemaForm(this.modelValue, { locale: this.currentLocale })
      }
      return makeBlitzarQuasarSchemaForm({ items: [] }, { locale: 'en' })
    }
  },

  methods: {
    ...mapActions({
      setCaseReportFormData: 'form/setCaseReportFormData'
    }),
    onUpdateFormData () {
      console.log(JSON.stringify(this.formData, null, '  '))
      this.setCaseReportFormData({
        user: this.user._id,
        form: this.modelValue._id,
        data: this.formData
      })
    },
    resetFormData () {
      this.formData = {}
      this.remountCounter++
    },
    validateFormData () {
      const result = validateFormPerSchema(this.formData, this.schema)
      console.log('validateFormPerSchema(this.formData, this.schema) → \n', result)
    },
    submitFormData () {

    }
  }
}
</script>
