<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="text-h6 text-grey-8">
        {{ tr(form.schema.label) }}
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-section>
      <div v-html="md(tr(form.schema.description))"/>
    </q-card-section>
    <q-card-actions align="left">
      <q-btn label="Start" icon-right="play_arrow" class="text-capitalize q-ma-sm" color="indigo-7" :to="'/form/' + form._id"/>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import snarkdown from 'snarkdown'
import { makeSchemaFormTr } from '@obiba/quasar-ui-amber'

export default defineComponent({
  name: 'CaseReportFormCard',
  props: ['form'],
  computed: {
    currentLocale () {
      return this.$root.$i18n.locale
    }
  },
  methods: {
    tr (key) {
      return makeSchemaFormTr(this.form.schema, { locale: this.currentLocale })(key)
    },
    md (text) {
      return text ? snarkdown(text) : text
    }
  }
})
</script>
