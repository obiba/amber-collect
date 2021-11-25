<template>
  <q-layout class="bg-blue text-white" v-cloak>
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
              v-model="password1"
              color="white"
              :type="isPwd ? 'password' : 'text'"
              :hint="$t('lock.new_code_placeholder')">
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
              v-model="password2"
              color="white"
              :type="isPwd ? 'password' : 'text'"
              :hint="$t('lock.repeat_code_placeholder')">
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
              v-model="password"
              color="white"
              :type="isPwd ? 'password' : 'text'"
              :placeholder="$t('lock.code_placeholder')">
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
      isPwd: ref('password')
    }
  },

  data () {
    return {
      password1: '',
      password2: '',
      password: ''
    }
  },

  created () {
    if (!this.isNewPwd) {
      this.triggerLock({
        status: true
      })
    }
  },

  watch: {
    password2 (newValue, oldValue) {
      if (newValue.length === passwordLength) {
        if (newValue === this.password1) {
          this.updatePassword({
            id: this.user._id,
            password: this.password1
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
      if (newValue.length === passwordLength) {
        if (newValue === this.lockPassword) {
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
      user: state => state.auth.payload ? state.auth.payload.user : undefined
    }),
    userName () {
      if (this.user) {
        const fullname = this.user.firstname + ' ' + this.user.lastname
        return fullname.trim().length === 0 ? this.userEmail : fullname
      } else {
        return '?'
      }
    },
    isNewPwd () {
      return this.lockPassword.length === 0
    },
    isFirstPwd () {
      return this.password1.length < 4
    }
  },

  methods: {
    onCancel () {
      this.$router.push('/')
    },
    onLogout () {
      this.resetLock()
      this.$store.dispatch('auth/logout')
    }
  }

})
</script>

<style>
[v-cloak] {
  display: none !important;
}
</style>
