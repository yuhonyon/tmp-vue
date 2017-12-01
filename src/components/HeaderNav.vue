<template>
  <div class="header">
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'headerNav',

}
</script>


<style scoped>
.header{
  height: 60px;
  background: #09c;
  line-height: 60px;
  color: #fff;
  padding: 0 20px;
}
a{
  color: #fff;
}
ul{
  float: right;
  padding: 0;
  margin: 0;
  list-style: none;
}
li{
  float: left;
  line-height: 60px;
  margin-left: 20px;
}
</style>
