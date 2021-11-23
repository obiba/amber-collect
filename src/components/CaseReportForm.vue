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
      name: 'GENDER',
      type: 'radiogroup',
      options: [
        {
          value: '1',
          label: 'male'
        },
        {
          value: '2',
          label: 'female'
        },
        {
          value: '3',
          label: 'other'
        },
        {
          value: '4',
          label: '????'
        }
      ],
      label: 'What is your gender?',
      description: 'If you have one....'
    },
    {
      name: 'SHORT',
      type: 'text',
      placeholder: 'pwel',
      label: 'Hello',
      description: 'qds qsdqs qsdqs dqsddqs. sdqsd'
    },
    {
      name: 'LONG',
      type: 'textarea',
      label: 'Long answer',
      description: 'Lorem ipsum',
      placeholder: 'pouet'
    },
    {
      name: 'NUMBER',
      type: 'number',
      label: 'How much?',
      description: 'In CAN',
      default: '123'
    },
    {
      name: 'GROUP',
      type: 'group',
      label: 'Date and time',
      description: 'This the date and time group description',
      items: [
        {
          name: 'DOB',
          type: 'date',
          label: 'Birth date?',
          description: 'The date of your birth'
        },
        {
          name: 'TRAUMA_DT',
          type: 'datetime',
          label: 'Date and time of trauma',
          description: 'Bla bla bla'
        },
        {
          name: 'TRAUMA_T',
          type: 'time',
          label: 'Time of the trauma?',
          description: 'At what time did it happened?'
        }
      ]
    },
    {
      name: 'TRANSPORT',
      type: 'checkboxgroup',
      label: 'Which ones?',
      description: 'Your preferred types.',
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
      name: 'CITY',
      type: 'select',
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
      ],
      label: 'Which city?',
      description: 'Blabla'
    },
    {
      name: 'PETS',
      type: 'multiselect',
      label: 'Favorite pets?',
      description: 'One or more animals.',
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
      name: 'BOOL',
      type: 'toggle',
      label: 'True or false?',
      description: 'Is it true or false,that all depends.'
    },
    {
      name: 'NUTRITION_SECTION',
      type: 'static',
      label: 'Nutrition',
      description: 'Questions about nutritions'
    },
    {
      name: 'INT',
      type: 'slider',
      label: 'How much do you like it?',
      description: 'Qdsfsdf sdfdsf.',
      min: 10,
      max: 20,
      format: ''
    }
  ],
  i18n: {
    en: {
      male: 'Male',
      female: 'Female'
    },
    fr: {
      'What is your gender?': 'Quel est votre sexe?',
      male: 'Homme',
      female: 'Femme'
    }
  }
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
