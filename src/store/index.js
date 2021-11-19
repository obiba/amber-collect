import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import authvuex from './store.auth'
import Crypto from 'crypto-js'
import Cookie from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

const cookieName = 'amberuuid'
const storageKey = 'amberstore'

// Get the encryption token from cookie or generate a new one.
const encryptionToken = Cookie.get(cookieName) || uuidv4()

// Store the encryption token in a secure cookie.
Cookie.set(cookieName, encryptionToken, { secure: true, sameSite: 'strict', expires: 365 })

const vuexLocal = new VuexPersistence({
  storage: {
    getItem: () => {
      // Get the store from local storage.
      const store = window.localStorage.getItem(storageKey)

      if (store) {
        try {
          // Decrypt the store retrieved from local storage
          // using our encryption token stored in cookies.
          const bytes = Crypto.AES.decrypt(store, encryptionToken)

          return JSON.parse(bytes.toString(Crypto.enc.Utf8))
        } catch (e) {
          // The store will be reset if decryption fails.
          window.localStorage.removeItem(storageKey)
        }
      }

      return null
    },
    setItem: (key, value) => {
      // Encrypt the store using our encryption token stored in cookies.
      const store = Crypto.AES.encrypt(value, encryptionToken).toString()

      // Save the encrypted store in local storage.
      return window.localStorage.setItem(storageKey, store)
    },
    removeItem: () => window.localStorage.removeItem(storageKey)
  }
})

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
    plugins: [vuexLocal.plugin, authvuex],
    modules: {},

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
