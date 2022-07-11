<template>
  <q-layout :class="settings.theme.front.bg" v-cloak>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="bg-transparent no-border no-shadow">
          <q-card-section class="q-pb-none">
            <div class="text-white" :class="$q.screen.lt.sm ? 'text-h6 text-center' : 'text-weight-bold'">{{userName}}</div>
          </q-card-section>

          <q-card-section v-if="isNewPwd && isFirstPwd" class="q-pt-none text-center">
            <q-input
              readonly
              dark
              v-model.number="password1"
              color="white"
              :type="isPwd ? 'password' : 'number'"
              mask="####"
              autocomplete="off"
              :hint="$t('lock.new_code_placeholder')"
              class="no-spinner">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <lock-pad v-model="password1" class="q-mt-lg"/>
          </q-card-section>

          <q-card-section v-if="isNewPwd && !isFirstPwd" class="q-pt-none text-center">
            <q-input
              readonly
              dark
              v-model.number="password2"
              color="white"
              :type="isPwd ? 'password' : 'number'"
              mask="####"
              autocomplete="off"
              :hint="$t('lock.repeat_code_placeholder')"
              class="no-spinner">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <lock-pad v-model="password2" class="q-mt-lg"/>
          </q-card-section>

          <q-card-section v-if="isNewPwd" class="q-pt-none text-center">
            <div
              @click="onCancel"
              class="cursor-pointer text-bold">
              {{$t('cancel')}}
            </div>
          </q-card-section>

          <q-card-section v-if="!isNewPwd" class="q-pt-none text-center">
            <q-input
              readonly
              dark
              v-model.number="password"
              color="white"
              :type="isPwd ? 'password' : 'number'"
              mask="####"
              autocomplete="off"
              :placeholder="$t('lock.code_placeholder')"
              class="no-spinner">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <lock-pad v-model="password" class="q-mt-lg"/>
          </q-card-section>

          <q-card-section v-if="!isNewPwd" class="q-pt-none text-center">
            <div
              @click="onLogout"
              class="cursor-pointer text-bold">
              {{$t('main.logout')}}
            </div>
          </q-card-section>

        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapState } from 'vuex'
import { Notify } from 'quasar'
import { settings } from '../boot/settings'

import LockMixin from '../mixins/LockMixin'
import LockPad from '../components/LockPad.vue'

const passwordLength = 4

export default defineComponent({
  name: 'LockScreen',

  components: {
    LockPad
  },

  mixins: [LockMixin],

  setup () {
    return {
      isPwd: ref('password'),
      settings: settings,
      password1: ref(''),
      password2: ref(''),
      password: ref('')
    }
  },

  created () {
    if (this.user) {
      if (!this.isNewPwd) {
        this.triggerLock({
          status: true
        })
      }
    } else {
      this.$router.push('/')
    }
  },

  watch: {
    password2 (newValue) {
      const newStr = newValue + ''
      if (newStr.length === passwordLength) {
        if (newStr === (this.password1 + '')) {
          this.updatePassword({
            id: this.user._id,
            password: newStr
          })
          this.triggerLock({
            status: true
          })
        } else {
          Notify.create({
            message: this.$t('lock.not_matching_codes'),
            color: 'negative'
          })
        }
      }
    },

    password (newValue, oldValue) {
      // verify code and remove lock wall
      const newStr = newValue + ''
      if (newStr.length === passwordLength) {
        if (newStr === this.lockPassword) {
          this.triggerLock({
            status: false
          })
          this.$router.push('/')
        } else {
          Notify.create({
            message: this.$t('lock.incorrect_unclock'),
            color: 'negative'
          })
        }
      }
    }
  },

  computed: {
    ...mapState({
      user: state => state.record.user
    }),
    userName () {
      if (this.user) {
        const fullname = this.user.firstname + ' ' + this.user.lastname
        return fullname.trim().length === 0 ? this.user.email : fullname
      } else {
        return ''
      }
    },
    isNewPwd () {
      return this.lockPassword.length === 0
    },
    isFirstPwd () {
      console.log('$ ' + this.password1)
      return ('' + this.password1).length < 4
    }
  },

  methods: {
    onCancel () {
      this.$router.push('/')
    },
    onLogout () {
      if (this.user) {
        this.clearLock(this.user._id)
        this.$store.dispatch('auth/logout')
      } else {
        this.triggerLock({ status: false })
        this.$router.push('/login')
      }
    }
  }

})
</script>

<style>
[v-cloak] {
  display: none !important;
}
</style>
