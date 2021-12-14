<template>
  <q-layout v-cloak view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Case report
        </q-toolbar-title>
        <q-toolbar-title>
          <span class="text-subtitle2 float-right">{{ schema.label }}
          <q-btn
            size="12px"
            flat
            dense
            round
            icon='info'
            @click='onShowFormDescription'>
          </q-btn></span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <case-report-form v-model="schema"/>
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
      <q-btn-dropdown stretch flat title="Go to">
        <q-list>
          <q-item-label header>Group label</q-item-label>
          <q-item-label header>Nutrition</q-item-label>
        </q-list>
      </q-btn-dropdown>

      <q-space />

      <q-separator dark vertical />
      <q-btn stretch flat title="Pause" icon="pause" to="/"/>
      <q-separator dark vertical />
      <q-btn stretch flat title="Previous" icon="arrow_back_ios" />
      <q-separator dark vertical />
      <q-btn stretch flat title="Next"  icon="arrow_forward_ios" />
      </q-toolbar>
    </q-footer>

    <q-dialog v-model="showFormDescription">
      <q-card>

        <q-card-section>
          {{ schema.description }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import CaseReportForm from 'components/CaseReportForm.vue'

const amberSchema = {
  label: 'Form label',
  description: 'Form description',
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

export default defineComponent({
  name: 'Test',

  components: {
    CaseReportForm
  },

  setup () {
    return {
      schema: amberSchema
    }
  },

  data () {
    return {
      showFormDescription: false
    }
  },

  methods: {
    onShowFormDescription () {
      this.showFormDescription = true
    }
  }

})
</script>
