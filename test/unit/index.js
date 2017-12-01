import Vue from 'vue'<%if(config.lint==='airbnb'){%>;<%}%>

Vue.config.productionTip = false<%if(config.lint==='airbnb'){%>;<%}%>

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)<%if(config.lint==='airbnb'){%>;<%}%>
testsContext.keys().forEach(testsContext)<%if(config.lint==='airbnb'){%>;<%}%>

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/)<%if(config.lint==='airbnb'){%>;<%}%>
srcContext.keys().forEach(srcContext)<%if(config.lint==='airbnb'){%>;<%}%>
