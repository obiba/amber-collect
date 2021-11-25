<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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
          {{$t('main.brand')}}
        </q-toolbar-title>

        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()">
          </q-btn>
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
        >
          <q-item-section avatar>
            <q-icon name="lock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.lock')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="onUpgrade"
        >
          <q-item-section avatar>
            <q-icon name="upgrade" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.upgrade')}}</q-item-label>
            <q-item-label caption>
              {{ $t('main.upgrade_available') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('main.dashboard')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label
          header
        >
          {{$t('main.essential_links')}}
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { locales } from '../boot/i18n'
import { defineComponent, ref } from 'vue'
import { mapState } from 'vuex'

import LockMixin from '../mixins/LockMixin'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'main.docs',
    caption: 'amberdoc.obiba.org',
    icon: 'school',
    link: 'https://amberdoc.obiba.org'
  },
  {
    title: 'main.chat',
    caption: 'chat.obiba.org',
    icon: 'chat',
    link: 'https://chat.obiba.org'
  },
  {
    title: 'main.forum',
    caption: 'forum.obiba.org',
    icon: 'record_voice_over',
    link: 'https://forum.obiba.org'
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
      essentialLinks: linksList,
      locale,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },

  created () {
    if (this.lockStatus) {
      this.$router.push('/lock')
    }
    if (this.user._id !== this.lockId) {
      this.resetLock()
    }
  },

  computed: {
    ...mapState({
      user: state => state.auth.payload ? state.auth.payload.user : undefined
    }),
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
      const fullname = this.user === undefined ? '' : this.user.firstname + ' ' + this.user.lastname
      return fullname.trim().length === 0 ? this.userEmail : fullname
    },
    userEmail () {
      if (this.user !== undefined) {
        return this.user.email
      }
      return ''
    }
  },

  methods: {
    onLocaleSelection (opt) {
      this.locale = opt.value
    },
    onLogout () {
      this.$store.dispatch('auth/logout')
    },
    onLock () {
      this.$router.push('/lock')
    },
    onUpgrade () {
      window.location.reload()
    }
  }
})
</script>
