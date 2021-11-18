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
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn>
          <q-btn round dense flat icon="fab fa-github" type="a" href="https://github.com/obiba/amber-studio" target="_blank">
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
          <q-btn-dropdown flat icon="person" no-caps>
            <template v-slot:label>
              <div class="text-center q-pl-sm">
                {{userName}}
              </div>
            </template>
            <q-list>
              <q-item clickable v-close-popup @click="onLogout">
                <q-item-section>
                  <q-item-label>{{$t('main.logout')}}</q-item-label>
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
          Essential Links
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
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'amberdoc.obiba.org',
    icon: 'school',
    link: 'https://amberdoc.obiba.org'
  },
  {
    title: 'Github',
    caption: 'github.com/obiba/amber-collect',
    icon: 'code',
    link: 'https://github.com/obiba/amber-collect'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

import { useI18n } from 'vue-i18n'
import { locales } from '../boot/i18n'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

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

  computed: {
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
    user () {
      return this.$store.state.auth.payload ? this.$store.state.auth.payload.user : undefined
    },
    userName () {
      return this.userEmail.split('@')[0]
    },
    userEmail () {
      if (this.user) {
        return this.user.email
      }
      return '?'
    }
  },
  methods: {
    onLocaleSelection (opt) {
      this.locale = opt.value
    },
    onLogout () {
      this.$store.dispatch('auth/logout')
    }
  }
})
</script>
