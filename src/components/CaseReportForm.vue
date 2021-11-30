<template>
  <div class="q-pa-md">
    <div>
      <BlitzForm :key='remountCounter' :schema='schema' v-model='formData' :columnCount='1' gridGap='32px'/>
    </div>
    <div class="bg-black text-white q-mt-lg q-pa-md">
      <pre>{{ JSON.stringify(formData, null, '  ') }}</pre>
    </div>
  </div>
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
    },
    schema () {
      if (this.value.items) {
        return makeBlitzarQuasarSchemaForm(this.modelValue, { locale: 'en' })
      }
      return makeBlitzarQuasarSchemaForm({ items: [] }, { locale: 'en' })
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
