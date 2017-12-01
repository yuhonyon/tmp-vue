export const creatorName = (name,id) => {
    if(id==0){
      return "患者自测"
    }else if(name||name==0){
      return name
    }else{
      return "--"
    }
}
