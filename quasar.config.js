/**
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli-vite/quasar-config-file

import { configure } from 'quasar/wrappers'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import path from 'node:path'

export default configure(function (ctx) {
  const packageJson = readFileSync('./package.json', 'utf8')
  const version = JSON.parse(packageJson).version || 0

  return {
    // https://v2.quasar.dev/quasar-cli-vite/supporting-ts
    supportTS: false,

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'settings',
      'auth',
      'axios',
      'feathersClient',
      'i18n',
      'vuelidate',
      'recaptcha',
      'errors'
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: [
      '~@fontsource-variable/sora/index.css',
      '~@fontsource-variable/instrument-sans/index.css',
      'app.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'fontawesome-v7',
      'material-icons'
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      target: {
        browser: 'baseline-widely-available',
        node: 'node22'
      },

      vueRouterMode: 'history',

      env: {
        VERSION: version
      },

      publicPath: '/',

      // https://v2.quasar.dev/quasar-cli-vite/handling-vite
      extendViteConf (viteConf) {
        const __dirname = fileURLToPath(new URL('.', import.meta.url))

        viteConf.base = './'

        if (!viteConf.resolve) {
          viteConf.resolve = {}
        }
        if (!viteConf.resolve.alias) {
          viteConf.resolve.alias = {}
        }
        viteConf.resolve.alias.vue = path.resolve(__dirname, './node_modules/vue')
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
    devServer: {
      https: false,
      port: 3090,
      open: false
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {},

      plugins: [
        'AppFullscreen',
        'Notify',
        'LocalStorage',
        'LoadingBar'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      prodPort: 3000,

      maxAge: 1000 * 60 * 60 * 24 * 30,

      middlewares: [
        ctx.prod ? 'compression' : '',
        'render'
      ],

      extendViteConf (viteConf) {
        const __dirname = fileURLToPath(new URL('.', import.meta.url))

        if (!viteConf.resolve) {
          viteConf.resolve = {}
        }
        if (!viteConf.resolve.alias) {
          viteConf.resolve.alias = {}
        }
        viteConf.resolve.alias.vue = path.resolve(__dirname, './node_modules/vue')
      }
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW',
      injectPwaMetaTags: false, // icons and theme-color are declared in index.html
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',

      extendGenerateSWOptions (cfg) {
        Object.assign(cfg, {
          maximumFileSizeToCacheInBytes: 5000000,
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true
        })
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      builder: {
        appId: 'amber-collect'
      },

      extendViteConf (viteConf) {
        const __dirname = fileURLToPath(new URL('.', import.meta.url))

        if (!viteConf.resolve) {
          viteConf.resolve = {}
        }
        if (!viteConf.resolve.alias) {
          viteConf.resolve.alias = {}
        }
        viteConf.resolve.alias.vue = path.resolve(__dirname, './node_modules/vue')
      }
    }
  }
})
