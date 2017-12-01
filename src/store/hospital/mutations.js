import * as types from '../mutation-types';


const mutations={
  [types.GET_HOSPITAL_LIST]:(state, data) => {
    state.hospitalList = data;
  },
  [types.CHANGE_CUR_HOSPITAL]:(state,data)=>{
    state.curHospital=data
  },
  [types.GET_SELECT_DEPARTMENT_LIST]:(state,data)=>{
    state.selectDepartmentList=data
  },
  [types.CHANGE_CUR_DEPARTMENT]:(state,data)=>{
    state.curDepartment=data
  },
}






export default mutations;
