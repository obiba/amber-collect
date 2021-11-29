<template>
  <q-card>
    <q-card-section>
      <div>
        <BlitzForm :key='remountCounter' :schema='schema' v-model='formData' :columnCount='1' gridGap='32px'/>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="bg-black text-white q-mt-lg q-pa-md">
        <pre>{{ JSON.stringify(formData, null, '  ') }}</pre>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
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
      schema: makeBlitzarQuasarSchemaForm(this.modelValue, { locale: 'en' }),
      formData: formData
    }
  },

  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  },

  methods: {
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
