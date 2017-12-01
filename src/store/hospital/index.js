import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'

const state={
  hospitalList:[],
  curHospital:{},
  selectDepartmentList:[],
  departmentList:[],
  curDepartment:{},
  coopDepartmentList:[],
  doctorList:[],
  nurseList:[]
}

export default{
  state,
  mutations,
  actions,
  getters
}
