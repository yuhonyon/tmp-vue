
<%if(config.router){%>
  <template>
    <div id="app">
      <router-view/>
    </div>
  </template>

  <script>
  export default {
    name: 'app'
  }
  </script>

  <style>

  </style>
<%}else{%>
  <template>
    <div id="app">
      <patient-manage></patient-manage>
    </div>
  </template>

  <script>
  import PatientManage from "@/views/patientManage/index.vue"
  export default {
    name: 'app',
    components:{
      PatientManage
    }
  }
  </script>

  <style>

  </style>
<%}%>
