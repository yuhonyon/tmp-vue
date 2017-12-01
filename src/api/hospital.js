import Fetch from '../http';

export const fetchHospitalList=function(params){
  return Fetch.get('/hospital/partner',{params})
}


export const fetchSelectDepartmentList=function(){
  return Fetch.get('/hospital/department/select')
}
