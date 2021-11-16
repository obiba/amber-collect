<template>
  <q-card>
    <q-card-section>
      <div class='text-h6 text-grey-8'>
        Case Report
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-section>
    <div>
      <BlitzForm :key='remountCounter' :schema='generatedSchema' v-model='formData' :columnCount='1' gridGap='32px'/>
      <PreviewCode comment='formData'>{{ formData }}</PreviewCode>
    </div>
    </q-card-section>
    <q-card-actions align='left'>
      <q-btn label='Submit' class='text-capitalize q-ma-sm' color='primary' @click='submitFormData'/>
      <q-btn label='Validate' class='text-capitalize q-ma-sm' @click='validateFormData'/>
      <q-btn label='Reset' class='text-capitalize q-ma-sm' @click='resetFormData'/>
    </q-card-actions>
  </q-card>
</template>

<script>
import { BlitzForm, validateFormPerSchema } from '@blitzar/form'
import { date } from 'quasar'
import { makeBlitzarQuasarSchemaForm } from 'amber-form/dist/AmberForm.umd'

const schema = [
  {
    id: 'name',
    span: 1,
    component: 'QInput',
    label: 'Superhero name',
    subLabel: 'Think of something cool.',
    required: true
  },
  {
    id: 'powerOrigin',
    span: 1,
    component: 'QOptionGroup',
    type: 'radio',
    label: 'Power origin',
    subLabel: 'Where does your power come from?',
    // component props:
    options: [
      { label: 'Mutation', value: 'mutation' },
      { label: 'Self taught', value: 'self' },
      { label: 'By item', value: 'item' }
    ]
  },
  {
    id: 'stamina',
    span: 2,
    component: 'QSlider',
    label: 'Stamina',
    defaultValue: 50,
    // component props:
    min: 0,
    max: 100,
    labelAlways: true
  },
  {
    id: 'power',
    span: 1,
    component: 'QInput',
    label: 'Power',
    subLabel: 'Fill in a number. (this will get formatted as a number in the formData)',
    parseInput: Number,
    // component props:
    type: 'number',
    suffix: 'PW'
  },
  {
    id: 'roleModel',
    span: 1,
    component: 'QSelect',
    label: 'Role model',
    subLabel: 'Who do you look up to?',
    // component props:
    options: [
      { label: 'Steve Rogers/Captain America', value: 'captain-america' },
      { label: 'Tony Stark/Iron Man', value: 'iron-man' },
      { label: 'Thor Odinson', value: 'thor-odinson' },
      { label: 'Bruce Banner/The Incredible Hulk', value: 'the-incredible-hulk' },
      { label: 'Natasha Romanoff/Black Widow', value: 'black-widow' },
      { label: 'Clint Barton/Hawkeye', value: 'hawkeye' },
      { label: 'Pietro Maximoff/Quicksilver', value: 'quicksilver' },
      { label: 'Wanda Maximoff/Scarlet Witch', value: 'scarlet-witch' },
      { label: 'The Vision', value: 'the-vision' },
      { label: 'James Rhodes/War Machine (Iron Patriot)', value: 'war-machine' },
      { label: 'Sam Wilson/Falcon', value: 'falcon' },
      { label: 'Bucky Barnes/The Winter Soldier (White Wolf)', value: 'the-winter-soldier' },
      { label: 'T\'Challa/Black Panther', value: 'black-panther' },
      { label: 'Stephen Strange/Doctor Strange', value: 'doctor-strange' },
      { label: 'Peter Parker/Spider-Man', value: 'spider-man' },
      { label: 'Scott Lang/Ant-Man (Giant-Man)', value: 'ant-man' },
      { label: 'Hope van Dyne/Wasp', value: 'wasp' },
      { label: 'Carol Danvers/Captain Marvel', value: 'captain-marvel' },
      { label: 'Peter Quill/Star-Lord', value: 'star-lord' },
      { label: 'Gamora', value: 'gamora' },
      { label: 'Drax the Destroyer', value: 'drax-the-destroyer' },
      { label: 'Rocket (Raccoon)', value: 'rocket-raccoon' },
      { label: '(Baby,Teenage) Groot', value: 'groot' },
      { label: 'Mantis', value: 'mantis' },
      { label: 'Matthew Murdock/Daredevil', value: 'daredevil' },
      { label: 'Jessica Jones (Jewel)', value: 'jessica-jones' },
      { label: 'Carl Lucas/Luke Cage (Power Man)', value: 'luke-cage' },
      { label: 'Danny Rand/Iron Fist', value: 'iron-fist' },
      { label: 'Frank Castle/The Punisher', value: 'the-punisher' }
    ]
  },
  {
    id: 'powerUps',
    span: 1,
    component: 'QOptionGroup',
    label: 'Choose some power-ups',
    defaultValue: () => [], // 'QOptionGroup' might not work without a default array
    // component props:
    type: 'checkbox',
    options: [
      {
        label: 'ISO-8 Chrystal',
        value: 'iso-8'
      },
      {
        label: 'Health potion',
        value: 'hp-potion'
      },
      {
        label: 'Energy drink',
        value: 'energy-potion'
      }
    ]
  },
  { span: 1 },
  {
    id: 'consent',
    component: 'QToggle',
    span: 1,
    label: 'Do you agree with our terms?',
    dynamicProps: ['error'],
    error: (val) => val || 'You must accept our terms',
    defaultValue: false
  },
  {
    id: 'submissionDate',
    span: 1,
    component: 'QInput',
    label: 'Date of submission',
    subLabel: 'Will convert input to a Date when typing eg. `2020/01/01`',
    parseInput: (val) => new Date(val),
    parseValue: (val) => date.formatDate(val, 'YYYY/MM/DD'),
    // component props:
    mask: '####/##/##',
    placeholder: 'YYYY/MM/DD'
  },
  {
    component: 'h3',
    slot: 'Test H3',
    span: 2
  },
  {
    component: 'h6',
    slot: 'Test H6',
    span: 2
  },
  {
    component: 'div',
    span: 2,
    slot: [
      {
        id: 'toggle',
        component: 'QToggle',
        label: 'Do you agree?',
        defaultValue: false
      },
      {
        id: 'toggle2',
        component: 'QToggle',
        label: 'Do you like it?',
        defaultValue: false
      }
    ]
  },
  {
    span: 2,
    label: 'Test',
    component: 'div',
    componentStyle: 'border: solid thin goldenrod; padding: 0.5em',
    componentClasses: 'row',
    slot: [
      {
        component: 'div',
        slot: 'AAA',
        class: 'col bg-red'
      },
      {
        component: 'div',
        slot: 'BBB',
        class: 'col bg-blue'
      },
      {
        component: 'div',
        slot: 'CCC',
        class: 'col bg-orange'
      }
    ]
  },
  {
    span: 2,
    component: 'div',
    slot: [
      {
        component: 'div',
        slot: 'Titre de section',
        class: 'text-h3'
      },
      {
        component: 'div',
        slot: 'Texte de la section bla bla bla.',
        class: 'text-subtitle1 text-grey-8'
      }
    ]
  },
  {
    id: 'size.width',
    label: 'Width',
    component: 'input',
    parseInput: Number,
    // component props:
    type: 'number'
  },
  { span: 1 },
  {
    id: 'size.depth',
    label: 'Depth',
    component: 'input',
    parseInput: Number,
    // component props:
    type: 'number'
  },
  { span: 1 },
  {
    id: 'size.height',
    label: 'Height',
    component: 'input',
    parseInput: Number,
    // component props:
    type: 'number'
  }
]

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
      name: 'HELLO',
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
      name: 'SHORT',
      type: 'text',
      label: 'How much?',
      description: 'In CAN',
      default: '123'
    },
    {
      name: 'DOB',
      type: 'date',
      label: 'Birth date?',
      description: 'The date of your birth'
    },
    {
      name: 'GROUP',
      type: 'group',
      label: 'Group label',
      description: 'This the group description',
      items: [
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
      description: 'One or animals.',
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
      name: 'INT',
      type: 'slider',
      label: 'How much do you like it?',
      description: 'Qdsfsdf sdfdsf.',
      min: 10,
      max: 20,
      format: ''
    },
    {
      name: 'NUTRITION_SECTION',
      type: 'static',
      label: 'Nutrition',
      description: 'Questions about nutritions'
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

const generatedSchema = makeBlitzarQuasarSchemaForm(amberSchema, { locale: 'en' })

export default {
  components: { BlitzForm },
  data () {
    const formData = {}
    return {
      remountCounter: 0,
      schema: schema,
      generatedSchema: generatedSchema,
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
