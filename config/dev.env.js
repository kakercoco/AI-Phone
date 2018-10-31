'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://47.96.227.55"'
  BASE_API: '"http://192.168.40.66:8080"'
  // BASE_API: '"http://192.168.40.66:8080"'
})
