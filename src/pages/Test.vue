<template>
  <q-layout v-cloak view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Case report
        </q-toolbar-title>
        <q-toolbar-title>
          <span class="text-subtitle2 float-right">Questionnaire blabla</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <case-report-form/>
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

  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import CaseReportForm from 'components/CaseReportForm.vue'

export default defineComponent({
  name: 'Test',

  components: {
    CaseReportForm
  }

})
</script>
