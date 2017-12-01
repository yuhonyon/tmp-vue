export function getCommonApi(apiUrl, port, rootUrl = "/") {
    let host = window.location.host;
    let type='';
    if(/\.pre\./.test(host)){
      type='.pre';
    }else if(/(\.qa\.)|localhost:|\d+\.\d+\.\d+\.\d/.test(host)){
      type='.qa';
    }
    return `${location.protocol}//${apiUrl}${type}.91jkys.com${port?(':'+port):''}/${rootUrl}`;
  }
