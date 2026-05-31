// https://github.com/michael-ciniawsky/postcss-load-config

const rtlcss = require('postcss-rtlcss')

module.exports = {
  plugins: [
    rtlcss()
  ]
}
