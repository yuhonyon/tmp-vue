export const hospitalList = state => state.hospitalList


export const curHospital=state=> state.curHospital

export const curDepartment=(state,getters)=>(
  state.curDepartment.id===undefined?getters.selectDepartmentList[0]:state.curDepartment)

export const selectDepartmentList=(state,getters,rootState)=>(
  rootState.user.userInfo.type==='ADMIN'?[{id:"all",name:"全部科室"},...state.selectDepartmentList]:state.selectDepartmentList)
