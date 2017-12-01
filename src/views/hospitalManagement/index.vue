<template>
  <div id="patientManage">
      <header-nav></header-nav>
      <hospitalization-list></hospitalization-list>
  </div>
</template>
<script>
import {HospitalizationList} from './components'
import HeaderNav from '@/components/HeaderNav'
export default {
  name: "patientManage",
  data: () => ({

  }),
  components:{
    HospitalizationList,
    HeaderNav
  }
}
</script>
<style scoped>
</style>
