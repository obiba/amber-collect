<template>
  <q-layout class="bg-blue text-white" v-cloak>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card v-if="!$q.screen.lt.sm" class="bg-transparent no-border no-shadow">
          <q-item>
            <q-item-section class="text-white">
              <q-item-label>{{userName}}</q-item-label>
              <q-item-label caption>
                <q-input readonly dark v-model="password" color="white" :type="isPwd ? 'password' : 'text'"
                         :placeholder="$t('lock.code_placeholder')">
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />

                  </template>
                </q-input>
              </q-item-label>
              <q-item-label></q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <lock-pad v-model="password"/>
            </q-item-section>
          </q-item>
        </q-card>
        <q-card v-if="$q.screen.lt.sm" class="bg-transparent no-border no-shadow">
          <q-card-section class="text-center">
            <div class="text-h6 text-white">{{userName}}</div>
            <q-input readonly dark v-model="password" color="white" :type="isPwd ? 'password' : 'text'"
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
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapState } from 'vuex'
import LockPad from '../components/LockPad.vue'

export default defineComponent({
  name: 'LockScreen',

  components: {
    LockPad
  },

  setup () {
    return {
      password: ref(''),
      isPwd: ref('password')
    }
  },

  watch: {
    password (newValue, oldValue) {
      console.log(newValue)
      // TODO verify code and remove lock wall
      if (newValue.length === 4) {
        this.$router.push('/')
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
    }
  }

})
</script>

<style>
[v-cloak] {
  display: none !important;
}
</style>
