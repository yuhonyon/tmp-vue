
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
      <hospital-management></hospital-management>
    </div>
  </template>

  <script>
  import HospitalManagement from "@/views/hospitalManagement/index.vue"
  export default {
    name: 'app',
    components:{
      HospitalManagement
    }
  }
  </script>

  <style>

  </style>
<%}%>
