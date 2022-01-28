import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import lock from './lock'
import form from './form'
import record from './record'
import authvuex from './store.auth'
import SecureLS from 'secure-ls'

const ls = new SecureLS({ isCompression: false })
const debug = false
const lsVuex = debug ? createPersistedState()
  : createPersistedState({
    key: 'astore',
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key)
    }
  })

const logPlugin = (store) => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
    if (debug) {
      console.log(mutation)
    }
  })
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 *
 * The function below can be async too either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    plugins: [lsVuex, logPlugin, authvuex],
    modules: {
      lock,
      form,
      record
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
