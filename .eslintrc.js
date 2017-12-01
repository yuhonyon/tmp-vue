module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  <%if(config.lint==='standard'){%>
  extends: 'standard',
  <%}%>
  <%if(config.lint==='airbnb'){%>
  extends: 'airbnb-base',
  <%}%>

  plugins: [
    'html'
  ],
  <%if(config.lint==='airbnb'){%>
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  <%}%>
  // add your custom rules here
  'rules': {
    <%if(config.lint==='standard'){%>
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    <%}%>
    <%if(config.lint==='airbnb'){%>
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    <%}%>
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
