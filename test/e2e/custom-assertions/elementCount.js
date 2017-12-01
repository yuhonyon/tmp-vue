// A custom Nightwatch assertion.
// the name of the method is the filename.
// can be used in tests like this:
//
//   browser.assert.elementCount(selector, count)
//
// for how to write custom assertions see
// http://nightwatchjs.org/guide#writing-custom-assertions
exports.assertion = function (selector, count) {
  this.message = 'Testing if element <' + selector + '> has count: ' + count<%if(config.lint==='airbnb'){%>;<%}%>
  this.expected = count<%if(config.lint==='airbnb'){%>;<%}%>
  this.pass = function (val) {
    return val === this.expected<%if(config.lint==='airbnb'){%>;<%}%>
  }
  this.value = function (res) {
    return res.value<%if(config.lint==='airbnb'){%>;<%}%>
  }
  this.command = function (cb) {
    var self = this<%if(config.lint==='airbnb'){%>;<%}%>
    return this.api.execute(function (selector) {
      return document.querySelectorAll(selector).length<%if(config.lint==='airbnb'){%>;<%}%>
    }, [selector], function (res) {
      cb.call(self, res)<%if(config.lint==='airbnb'){%>;<%}%>
    })<%if(config.lint==='airbnb'){%>;<%}%>
  }
}
