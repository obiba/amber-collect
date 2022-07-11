<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="settings.theme.header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <span :style="$q.screen.lt.sm?{'font-size': 'smaller'}:{}">
            {{$t('main.brand')}}
          </span>
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn v-if="settings.lock.enabled" round dense flat icon="lock"
                 @click="onLock">
          </q-btn>
          <!--q-btn round dense flat :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()">
          </q-btn-->
          <q-btn-dropdown
            v-show="hasLocales"
            flat
            :label="locale">
            <q-list>
              <q-item clickable v-close-popup @click="onLocaleSelection(localeOpt)" v-for="localeOpt in localeOptions" :key="localeOpt.value">
                <q-item-section>
                  <q-item-label class="text-uppercase">{{localeOpt.value}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          {{userName}}
        </q-item-label>

        <q-item
          clickable
          @click="onLogout"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.logout')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="onLock"
           v-if="settings.lock.enabled"
        >
          <q-item-section avatar>
            <q-icon name="lock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.lock')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator/>

        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.dashboard')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/case-reports" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="summarize"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.case_reports')}} <q-badge>{{ caseReportsCount }}</q-badge></q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="onUpdate"
        >
          <q-item-section avatar>
            <q-icon name="refresh" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.refresh')}}</q-item-label>
            <q-item-label caption>
              {{ $t('main.refresh_hint') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="onShowAppInfo"
        >
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.info')}}</q-item-label>
            <q-item-label caption>
              {{ $t('main.info_hint') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label
          header
        >
          {{$t('main.essential_links')}}
        </q-item-label>

        <EssentialLink
          v-for="link in settings.links"
          :key="link.title"
          v-bind="link"
        />

        <q-item class="fixed-bottom text-caption">
          <div>
            {{$t('main.powered_by')}} <a class="text-weight-bold" href="https://www.obiba.org" target="_blank">OBiBa Amber</a>
          </div>
        </q-item>
      </q-list>
    </q-drawer>

    <q-dialog v-model="showAppInfo">
      <q-card :style="$q.screen.lt.sm ? 'min-width: 200px' : 'min-width: 400px'">
        <q-card-section>
          <q-list>
            <q-item-label header class="text-uppercase">
              {{ $t("main.source_code") }}
            </q-item-label>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <a href="https://github.com/obiba/amber-collect" target="_blank">OBiBa Amber Collect</a>
                </q-item-label>
                <q-item-label caption>
                  v{{ settings.version }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item-label header class="text-uppercase">
              {{ $t("main.contributors") }}
            </q-item-label>
            <q-item v-for="contrib in contributors" :key="contrib.name">
              <q-item-section>
                <q-item-label v-if="contrib.link">
                  <a :href="contrib.link" target="_blank">{{ contrib.name }}</a>
                </q-item-label>
                <q-item-label v-else>
                  {{ contrib.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { locales } from '../boot/i18n'
import { settings } from '../boot/settings'
import { defineComponent, ref } from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'

import LockMixin from '../mixins/LockMixin'
import EssentialLink from 'components/EssentialLink.vue'

const contributors = [
  {
    name: 'MUHC Centre for Global Surgery',
    link: 'https://www.cglobalsurgery.com/'
  },
  {
    name: 'Epigeny',
    link: 'https://www.epigeny.io/'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  mixins: [LockMixin],

  setup () {
    const { locale } = useI18n({ useScope: 'global' })
    const leftDrawerOpen = ref(false)

    return {
      contributors: contributors,
      settings: settings,
      locale,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      showAppInfo: ref(false)
    }
  },

  created () {
    if (settings.lock.enabled) {
      if (this.lockStatus) {
        this.$router.push('/lock')
      }
      if (this.user._id !== this.lockId) {
        this.resetLock(this.user._id)
      }
    }
  },

  computed: {
    ...mapState({
      user: state => state.record.user
    }),
    caseReportsCount () {
      return this.getCaseReportsCount()(this.user)
    },
    localeOptions () {
      return locales.map(loc => {
        return {
          value: loc,
          label: this.$t('locales.' + loc)
        }
      })
    },
    hasLocales () {
      return locales.length > 1
    },
    userName () {
      const fullname = this.user ? this.user.firstname + ' ' + this.user.lastname : ''
      return fullname.trim().length === 0 ? this.userEmail : fullname
    },
    userEmail () {
      if (this.user) {
        return this.user.email
      }
      return ''
    }
  },

  methods: {
    ...mapActions({
      getCaseReportForms: 'form/getCaseReportForms'
    }),
    ...mapGetters({
      getCaseReportsCount: 'record/getCaseReportsCount'
    }),
    onShowAppInfo () {
      this.showAppInfo = true
    },
    onLocaleSelection (opt) {
      this.locale = opt.value
    },
    onLogout () {
      this.$store.dispatch('form/clearCaseReportForms')
      this.$store.dispatch('auth/logout')
        .then(() => {
          this.$router.push('/login')
        })
      this.resetLock()
    },
    onLock () {
      this.$router.push('/lock')
    },
    onUpdate () {
      this.getCaseReportForms({})
    },
    onUpgrade () {
      window.location.reload()
    }
  }
})
</script>
