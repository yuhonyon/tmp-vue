const fs = require('fs-extra')
const path = require('path')
const ejs = require('ejs');
const glob = require("glob")
function copy(from,to){
  return new Promise((resolve,reject)=>{
    fs.copy(from,to,err=>{
      if(err){
        reject(err);
        return
      }
      resolve(true)
    })
  })
}
function remove(file){
  // return new Promise((resolve,reject)=>{
  //   fs.remove(file,err=>{
  //     if(err){
  //       reject(err);
  //       return
  //     }
  //     resolve(true)
  //   })
  // })
  fs.removeSync(file)
}
function resolve(dir){
  return path.resolve(__dirname, dir);
}
function render(config,src,json){
  let str = fs.readFileSync(resolve(src), 'utf8');
  let info=ejs.render(str, {
      config
  });
  if(json){
    info=JSON.stringify(JSON.parse(info),null, 2);
  }else{
    info=info.replace(/[\n\r]{2,10}/g,'\n');
  }
  fs.outputFile(resolve(src),info)
}
function allRender(config){
  glob(resolve("./")+"/**/*.json", function (err, files) {
    if(err){
      return;
    }
    for(let file of files){
      render(config,file,true)
    }
  })
  glob(resolve("./")+"/**/*.@(js|vue|eslintrc|babelrc)", function (err, files) {
    if(err){
      return;
    }
    for(let file of files){
      render(config,file)
    }
  })
  glob(resolve("./")+"/**/.@(js|eslintrc|babelrc)", function (err, files) {
    if(err){
      return;
    }
    for(let file of files){
      render(config,file)
    }
  })
}
function style(config){
  let importStyle='scss';
  if(config.style.length===0){
    remove(resolve('src/styles/main.less'))
    remove(resolve('src/styles/main.scss'))
    importStyle='css';
  }else if(config.style.includes('sass')){
    remove(resolve('src/styles/main.less'))
    remove(resolve('src/styles/main.css'))
    importStyle='scss';
  }else{
    remove(resolve('src/styles/main.css'))
    remove(resolve('src/styles/main.scss'))
    importStyle='less';
  }
}
function router(config){
  if(config.router){
  }else{
    remove(resolve('src/router'))
    remove(resolve('src/views/patientManagement'))
    remove(resolve('src/views/login'))
    remove(resolve('src/components/layout'))
  }
}
function vuex(config){
  if(config.vuex){
    remove(resolve('src/api'))
  }else{
    remove(resolve('src/store'))
  }
}
function main(config){
}
function e2e(config){
  if(config.e2e){
  }else{
    remove(resolve('test/e2e'))
  }
}
function unit(config){
  if(config.unit){
  }else{
    if(!config.e2e){
      remove(resolve('test'))
      return;
    }
    remove(resolve('test/unit'))
  }
}
function packageInfo(config){
}
function esLint(config){
  if(config.lint){
  }else{
    remove(resolve('.eslintrc.js'))
  }
}
function tmp(config){
  config.vuex=config.vuex==='n'?false:true;
  config.router=config.router==='n'?false:true;
  config.e2e=config.e2e==='n'?false:true;
  style(config);
  packageInfo(config);
  router(config);
  vuex(config);
  main(config);
  esLint(config);
  e2e(config);
  unit(config);
  allRender(config)

  copy(resolve("./"),'./'+config.name).then(()=>{
    remove('./'+config.name+'/tmp.js')
    remove('./'+config.name+'/tmpConfig.js')
  })
}
module.exports=tmp
