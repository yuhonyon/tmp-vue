import * as types from '../mutation-types'
import * as fetchApi from "./api.js"
export const getHospitalList = ({commit},params) => {
  return fetchApi.fetchHospitalList(params).then(data=>{
    commit(types.GET_HOSPITAL_LIST,data.hospitalList);
    commit(types.CHANGE_CUR_HOSPITAL,data.hospitalList[0]);
    return data;
  })
};


export const changeCurHospital = ({commit,state},data) => {
  if(data&&typeof data!=='object'){
    if(data===state.curHospital.hospitalId){
      return;
    }
    data=state.hospitalList.find(val=>(val.hospitalId===data))
  }
  commit(types.CHANGE_CUR_HOSPITAL,data);
};


export const getSelectDepartmentList = ({commit,state}) => {
  return fetchApi.fetchSelectDepartmentList().then(data=>{
      commit(types.GET_SELECT_DEPARTMENT_LIST,data.departmentList);
      return data;
  })
};

export const changeCurDepartment = ({commit,state},department) => {
  if(department==='all'){
    department={}
  }else if(department&&typeof department!=='object'){
    if(department===state.curDepartment.id){
      return;
    }
    department=state.selectDepartmentList.find(val=>(val.id===department))
  }
  commit(types.CHANGE_CUR_DEPARTMENT,department);
};
