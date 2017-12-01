const fs = require('fs-extra');
const tmp=[
  {
    message:'请输入项目名',
    default:'my-vue-roject',
    type:'input',
    name:'name',
    validate: function(value) {
      if (!/^[a-zA-Z-_0-9]+$/.test(value)) {
        return '项目名不规范,请重新输入';
      }
      if(fs.existsSync(value)){
        return '已经存在同名项目';
      }
      return true;
    }
  },
  {
    type: 'input',
    name: 'dependencies',
    message: '项目描述',
    default: '一个vue项目'
  },
  {
    type: 'input',
    name: 'author',
    message: 'author',
    default: ''
  },
  {
    message:'是否使用样式预编译(空格选择)',
    type:'checkbox',
    name:'style',
    choices:[
      {name:'sass',checked: true},
      {name:'less'},
    ]
  },
  {
    type: 'input',
    name: 'router',
    message: '使用vue-router?[y/n]',
    default: 'y',
    validate: function(value) {
      if (/^[yn]$/.test(value)) {
        return true;
      }
      return '请输出y或者n';
    }
  },
  {
    type: 'input',
    name: 'vuex',
    message: '使用vuex?[y/n]',
    default: 'y',
    validate: function(value) {
      if (/^[yn]$/.test(value)) {
        return true;
      }
      return '请输出y或者n';
    }
  },
  {
    type: 'list',
    name: 'esLint',
    message: '使用esLint检验代码?',
    default: false,
    choices: [
      {
        name:'模式一',
        value:'starsdffa'
      },
      {
        name:'模式二',
        value:'stadrsdffa'
      },
      {
        name:'不使用',
        value:false
      }
    ]
  },
  {
    type: 'input',
    name: 'e2e',
    message: '使用e2e测试[y/n]',
    default: 'y',
    validate: function(value) {
      if (/^[yn]$/.test(value)) {
        return true;
      }
      return '请输出y或者n';
    }
  },
  {
    type: 'list',
    name: 'unit',
    message: '使用unit测试[y/n]',
    default: false,
    choices: [
      {
        name:'模式一',
        value:'starsdffa'
      },
      {
        name:'模式二',
        value:'stadrsdffa'
      },
      {
        name:'不使用',
        value:false
      }
    ]
  }
]

module.exports=tmp;
