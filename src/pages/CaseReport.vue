<template>
  <q-layout v-cloak view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          {{ $t('case_report') }}
        </q-toolbar-title>
        <q-toolbar-title>
          <span class="text-subtitle2 float-right">{{ tr(schema.label) }}
          <q-btn
            v-if="schema.description"
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
        <case-report-recorder v-model="schema" :caseReportId="caseReportId"/>
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
      <q-btn-dropdown
        v-if="toc.length > 0"
        stretch
        flat
        icon="toc"
        title="Go to">
        <q-list>
          <q-item-label
            v-for="entry in toc"
            :key="entry.id"
            header
            clickable
            v-close-popup
            @click="onScroll(entry.id)">
            {{ entry.label }}
          </q-item-label>
        </q-list>
      </q-btn-dropdown>

      <q-space />

      <q-separator dark vertical />
      <q-btn stretch flat title="Pause" icon="pause" @click="onPause"/>
      </q-toolbar>
    </q-footer>

    <q-dialog v-model="showFormDescription">
      <q-card>
        <q-card-section>
          <div v-html="md(tr(schema.description))"/>
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
import { mapState, mapActions, mapGetters } from 'vuex'
import snarkdown from 'snarkdown'
import { makeSchemaFormTr } from '@obiba/quasar-ui-amber'
import CaseReportRecorder from 'src/components/CaseReportRecorder.vue'
import { scroll } from 'quasar'
const { getScrollTarget, setVerticalScrollPosition } = scroll

export default defineComponent({
  name: 'CaseReport',

  components: {
    CaseReportRecorder
  },

  data () {
    return {
      schema: {},
      showFormDescription: false
    }
  },

  mounted () {
    const caseReport = this.getCaseReportById()(this.caseReportId)
    if (caseReport) {
      this.schema = this.crfs ? this.crfs.filter(f => f._id === caseReport.crfId).pop().schema : {}
    } else {
      console.error('No such record with id: ' + this.caseReportId)
      this.$router.push('/')
    }
  },

  computed: {
    ...mapState({
      crfs: state => state.form.crfs
    }),
    currentLocale () {
      return this.$root.$i18n.locale
    },
    caseReportId () {
      return this.$route.params.id
    },
    toc () {
      const toc = []
      if (this.schema && this.schema.items) {
        this.schema.items.filter(item => ['group', 'section'].includes(item.type)).forEach(item => toc.push({
          id: item.name.replaceAll('.', '_').toLowerCase(),
          label: this.tr(item.label)
        }))
      }
      return toc
    }
  },

  methods: {
    ...mapGetters({
      getCaseReportById: 'record/getCaseReportById'
    }),
    ...mapActions({
      pauseCaseReport: 'record/pauseCaseReport'
    }),
    onShowFormDescription () {
      this.showFormDescription = true
    },
    onScroll (id) {
      const ele = document.getElementById(id)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop
      const duration = 200
      setVerticalScrollPosition(target, offset, duration)
    },
    onPause () {
      this.pauseCaseReport({ id: this.caseReportId }).then(() => {
        this.$router.push('/')
      })
    },
    tr (key) {
      return makeSchemaFormTr(this.schema, { locale: this.currentLocale })(key)
    },
    md (text) {
      return text ? snarkdown(text) : text
    }
  }

})
</script>
