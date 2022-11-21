import { boot } from 'quasar/wrappers'
import { LocalStorage, Notify } from 'quasar'
import { feathersClient } from './feathersClient'
import { t } from './i18n'

export default boot(async ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      // if requires admin
      const user = store.state.auth.user // ? store.state.auth.user : store.state.record.user
      if (user) {
        if (to.meta.requiresAdmin) {
          if (user.role && user.role === 'administrator') {
            next()
          } else {
            Notify.create({
              message: 'Your account is not authorized to see this view. If this is in error, please contact support.',
              color: 'negative'
            })
            next(from.path)
          }
        } else if (!LocalStorage.getItem('feathers-jwt')) {
          next('/login')
        } else {
          next()
        }
      } else if (LocalStorage.getItem('feathers-jwt')) {
        if (store.state.record.user) {
          next()
        } else {
          next('/loading')
        }
        // could be not expired but also still not valid, then reauth
        feathersClient.reAuthenticate().then((response) => {
          // show application page
          store.dispatch('auth/responseHandler', response)
          // update user identity associated to records
          store.dispatch('record/initUser', response.user)
          router.push(to.path)
        }).catch((err) => {
          console.log(err)
          if (err.response) {
            // remove expired/unusable token
            LocalStorage.remove('feathers-jwt')
            router.push('/login')
          } else {
            // network cannot be reached, go to login screen
            if (!store.state.record.user) {
              router.push('/login')
            } else {
              Notify.create({
                message: t('error.network_error'),
                color: 'negative'
              })
              // router.push('/')
            }
          }
        })
      } else if (to.path !== '/login') {
        next('/login')
      } else {
        next()
      }
    } else {
      next()
    }
  })
})
