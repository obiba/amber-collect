<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-blue text-white flex flex-center">
        <div class="column" v-bind:style="$q.screen.lt.sm?{'width': '80%'}:$q.screen.lt.md?{'width':'50%'}:{'width':'30%'}">
          <div class="col">
            <div class="text-center text-h4 q-pb-lg">
              {{$t('main.brand')}}
            </div>
            <div v-if="$t('main.brand_caption')" class="text-center q-pb-lg">
              {{$t('main.brand_caption')}}
            </div>
          </div>
          <div class="col">
            <q-card flat color="white" class="bg-blue-7">
              <q-card-section>
                <div class="text-center q-pt-sm">
                  <div class="col text-subtitle">
                    {{$t('forgot_password.title')}}
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-form @submit="forgotPassword">
                  <q-input
                    dark
                    color="white"
                    v-model="resetEmail"
                    :label="$t('email')"
                    type="email"
                    :hint="$t('forgot_password.hint')"
                    @blur="v$.resetEmail.$touch"
                    :error="v$.resetEmail.$error"
                    lazy-rules>
                    <template v-slot:prepend>
                      <q-icon name="fas fa-envelope" size="xs" />
                    </template>
                    <template v-slot:error>
                      <div v-for="error in v$.resetEmail.$errors" :key="error">
                        {{error.$message}}
                      </div>
                    </template>
                  </q-input>
                  <div class="q-mt-lg">
                    <q-btn
                      :label="$t('forgot_password.submit')"
                      type="submit"
                      color="primary"/>
                    <q-btn
                      :label="$t('forgot_password.login')"
                      flat
                      to="/login"
                      stretch
                      class="text-bold q-ml-md"/>
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import { required, email } from '../boot/vuelidate'
import useVuelidate from '@vuelidate/core'

export default {
  data () {
    return {
      v$: useVuelidate(),
      resetEmail: ''
    }
  },
  validations: {
    resetEmail: {
      required,
      email
    }
  },
  computed: {
    ...mapState({
      submitting: state => state.auth.showLoading
    }),
    disableSubmit () {
      return this.v$.formData.$invalid
    }
  },
  methods: {
    forgotPassword () {
      this.$store
        .dispatch('account/forgotPassword', {
          emailAddress: this.resetEmail
        })
        .then(() => {
          this.$router.push('/login')
        })
    }
  }
}
</script>
