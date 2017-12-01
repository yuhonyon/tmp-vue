import Vue from 'vue'<%if(config.lint==='airbnb'){%>;<%}%>
import HeaderNav from '@/components/HeaderNav'<%if(config.lint==='airbnb'){%>;<%}%>

describe('HeaderNav.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(HeaderNav)<%if(config.lint==='airbnb'){%>;<%}%>
    const vm = new Constructor().$mount()<%if(config.lint==='airbnb'){%>;<%}%>
    expect(vm.$el.querySelector('.hello h1').textContent)
    {{#if_eq runner "karma"}}.to.equal('Welcome to Your Vue.js App')<%if(config.lint==='airbnb'){%>;<%}%><%}%>{{#if_eq runner "jest"}}.toEqual('Welcome to Your Vue.js App')<%if(config.lint==='airbnb'){%>;<%}%><%}%>
  })<%if(config.lint==='airbnb'){%>;<%}%>
})<%if(config.lint==='airbnb'){%>;<%}%>
