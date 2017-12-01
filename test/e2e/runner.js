// 1. start the dev server using production config
process.env.NODE_ENV = 'testing'<%if(config.lint==='airbnb'){%>;<%}%>

const webpack = require('webpack')<%if(config.lint==='airbnb'){%>;<%}%>
const DevServer = require('webpack-dev-server')<%if(config.lint==='airbnb'){%>;<%}%>

const webpackConfig = require('../../build/webpack.prod.conf')<%if(config.lint==='airbnb'){%>;<%}%>
const devConfigPromise = require('../../build/webpack.dev.conf')<%if(config.lint==='airbnb'){%>;<%}%>

let server<%if(config.lint==='airbnb'){%>;<%}%>

devConfigPromise.then(devConfig => {
  const devServerOptions = devConfig.devServer<%if(config.lint==='airbnb'){%>;<%}%>
  const compiler = webpack(webpackConfig)<%if(config.lint==='airbnb'){%>;<%}%>
  server = new DevServer(compiler, devServerOptions)<%if(config.lint==='airbnb'){%>;<%}%>
  const port = devServerOptions.port<%if(config.lint==='airbnb'){%>;<%}%>
  const host = devServerOptions.host<%if(config.lint==='airbnb'){%>;<%}%>
  return server.listen(port, host)<%if(config.lint==='airbnb'){%>;<%}%>
})
.then(() => {
  // 2. run the nightwatch test suite against it
  // to run in additional browsers:
  //    1. add an entry in test/e2e/nightwatch.conf.json under "test_settings"
  //    2. add it to the --env flag below
  // or override the environment flag, for example: `npm run e2e -- --env chrome,firefox`
  // For more information on Nightwatch's config file, see
  // http://nightwatchjs.org/guide#settings-file
  let opts = process.argv.slice(2)<%if(config.lint==='airbnb'){%>;<%}%>
  if (opts.indexOf('--config') === -1) {
    opts = opts.concat(['--config', 'test/e2e/nightwatch.conf.js'])<%if(config.lint==='airbnb'){%>;<%}%>
  }
  if (opts.indexOf('--env') === -1) {
    opts = opts.concat(['--env', 'chrome'])<%if(config.lint==='airbnb'){%>;<%}%>
  }

  const spawn = require('cross-spawn')<%if(config.lint==='airbnb'){%>;<%}%>
  const runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' })<%if(config.lint==='airbnb'){%>;<%}%>

  runner.on('exit', function (code) {
    server.close()<%if(config.lint==='airbnb'){%>;<%}%>
    process.exit(code)<%if(config.lint==='airbnb'){%>;<%}%>
  })<%if(config.lint==='airbnb'){%>;<%}%>

  runner.on('error', function (err) {
    server.close()<%if(config.lint==='airbnb'){%>;<%}%>
    throw err<%if(config.lint==='airbnb'){%>;<%}%>
  })<%if(config.lint==='airbnb'){%>;<%}%>
})<%if(config.lint==='airbnb'){%>;<%}%>
