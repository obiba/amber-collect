<template>
  <q-layout class="bg-blue text-white" v-cloak>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card v-if="!$q.screen.lt.sm" class="bg-transparent no-border no-shadow">
          <q-item>

            <q-item-section class="text-white">
              <q-item-label>{{userName}}</q-item-label>
              <q-item-label caption>
                <q-input dark v-model="password" color="white" :type="isPwd ? 'password' : 'text'"
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
            <q-item-section side center>
              <q-btn to="/" round flat color="white" class="q-mt-lg bg-blue-5" icon="arrow_right_alt"></q-btn>
            </q-item-section>
          </q-item>
        </q-card>
        <q-card v-if="$q.screen.lt.sm" class="bg-transparent no-border no-shadow">
          <q-card-section class="text-center">
            <div class="text-h6 text-white">{{userName}}</div>
            <q-input dark v-model="password" color="white" :type="isPwd ? 'password' : 'text'"
                     :placeholder="$t('lock.code_placeholder')">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />

              </template>
            </q-input>
            <q-btn to="/" round flat color="white" class="q-mt-lg bg-blue-5" icon="arrow_right_alt"></q-btn>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'LockScreen',

  setup () {
    return {
      password: ref(''),
      isPwd: ref('password')
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
