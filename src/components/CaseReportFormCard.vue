<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <span class="text-h6 text-grey-8">
        {{ tr(form.schema.label) }}
      </span>
      <span class="text-grey-6 text-smaller q-mt-sm float-right">{{ 'v' + form.revision }}</span>
    </q-card-section>
    <q-separator/>
    <q-card-section>
      <div v-html="md(tr(form.schema.description))"/>
    </q-card-section>
    <q-card-actions align="left">
      <q-btn
        :label="$t('start')"
        icon-right="play_arrow"
        class="text-capitalize q-ma-sm"
        color="indigo-7"
        @click="onStart"/>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'
import snarkdown from 'snarkdown'
import { makeSchemaFormTr } from '@obiba/quasar-ui-amber'
import { v4 as uuidv4 } from 'uuid'

export default defineComponent({
  name: 'CaseReportFormCard',
  props: ['form'],
  computed: {
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
      const recordId = uuidv4()
      this.initCaseReport({
        id: recordId,
        crf: this.form
      }).then(() => {
        this.$router.push('/case-report/' + recordId)
      })
    }
  }
})
</script>
