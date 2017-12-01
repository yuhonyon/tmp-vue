
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
      <patient-management></patient-management>
    </div>
  </template>

  <script>
  import PatientManagement from "@/views/patientManagement/index.vue"
  export default {
    name: 'app',
    components:{
      PatientManagement
    }
  }
  </script>

  <style>

  </style>
<%}%>
