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

const amberSchema = {
  items: [
    {
      name: 'TEXT',
      type: 'text',
      label: 'Text label',
      description: 'Text description',
      placeholder: 'Text placeholder',
      hint: 'Text hint'
    },
    {
      name: 'TEXTAREA',
      type: 'textarea',
      label: 'Text area label',
      description: 'Text area description',
      placeholder: 'Text area placeholder',
      hint: 'Text area hint'
    },
    {
      name: 'NUMBER',
      type: 'number',
      label: 'Number label',
      description: 'Number description',
      hint: 'Number hint',
      default: '123'
    },
    {
      name: 'DATE',
      type: 'date',
      label: 'Date label',
      description: 'Date description',
      placeholder: 'Date placeholder',
      hint: 'Date hint'
    },
    {
      name: 'GROUP',
      type: 'group',
      label: 'Group label',
      description: 'Group description',
      items: [
        {
          name: 'DATETIME',
          type: 'datetime',
          label: 'Datetime label',
          description: 'Datetime description',
          placeholder: 'Datetime placeholder',
          hint: 'Datetime hint'
        },
        {
          name: 'TIME',
          type: 'time',
          label: 'Time label',
          description: 'Time description',
          placeholder: 'Time placeholder',
          hint: 'Time hint'
        }
      ]
    },
    {
      name: 'RADIOGROUP',
      type: 'radiogroup',
      label: 'Radio group label',
      description: 'Radio group description',
      options: [
        {
          value: '1',
          label: 'male'
        },
        {
          value: '2',
          label: 'female'
        }
      ]
    },
    {
      name: 'CHECKBOXGROUP',
      type: 'checkboxgroup',
      label: 'Checkbox group label',
      description: 'Checkbox group description',
      options: [
        {
          value: '1',
          label: 'bike'
        },
        {
          value: '2',
          label: 'car'
        },
        {
          value: '3',
          label: 'plane'
        }
      ]
    },
    {
      name: 'SELECT',
      type: 'select',
      label: 'Select label',
      description: 'Select description',
      hint: 'Select hint',
      options: [
        {
          value: '1',
          label: 'NYC'
        },
        {
          value: '2',
          label: 'MTL'
        },
        {
          value: '3',
          label: 'LYS'
        }
      ]
    },
    {
      name: 'MULTISELECT',
      type: 'multiselect',
      label: 'Multiselect label',
      description: 'Multiselect description',
      hint: 'Multiselect hint',
      options: [
        {
          value: '1',
          label: 'cat'
        },
        {
          value: '2',
          label: 'dog'
        },
        {
          value: '3',
          label: 'alligator'
        }
      ]
    },
    {
      name: 'TOGGLE',
      type: 'toggle',
      label: 'Toggle label',
      description: 'Toggle description'
    },
    {
      name: 'SECTION',
      type: 'section',
      label: 'Section label',
      description: 'Section description',
      labelClass: 'text-h4',
      descriptionClass: 'text-caption text-grey-8'
    },
    {
      name: 'SLIDER',
      type: 'slider',
      label: 'Slider label',
      description: 'Slider description',
      min: 10,
      max: 20,
      format: ''
    },
    {
      name: 'RATING',
      type: 'rating',
      label: 'Rating label',
      description: 'Rating description',
      max: 10,
      icon: 'stars'
    },
    {
      name: 'TEXT_COND',
      type: 'text',
      label: 'Text with condition label',
      description: 'Text description',
      placeholder: 'Text placeholder',
      hint: 'Text hint',
      condition: 'formData.RADIOGROUP === "1"'
    },
    {
      name: 'GROUP_COND',
      type: 'group',
      label: 'Group with condition label',
      description: 'Group description',
      condition: 'formData.RADIOGROUP === "2"',
      items: [
        {
          name: 'DATETIME_COND',
          type: 'datetime',
          label: 'Datetime with condition label',
          description: 'Datetime description',
          placeholder: 'Datetime placeholder',
          hint: 'Datetime hint'
        },
        {
          name: 'TIME_COND',
          type: 'time',
          label: 'Time with condition label',
          description: 'Time description',
          placeholder: 'Time placeholder',
          hint: 'Time hint',
          condition: 'formData.RADIOGROUP === "2"'
        }
      ]
    }
  ],
  i18n: {}
}

export default {
  components: { BlitzForm },
  data () {
    const formData = {}
    return {
      remountCounter: 0,
      schema: makeBlitzarQuasarSchemaForm(amberSchema, { locale: 'en' }),
      formData: formData
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
