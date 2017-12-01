<template>
    <div>
      <input type="text" v-model='formLogin.username'/>
      <input type="text" v-model='formLogin.password'/>
      <button @click="handleSubmit">登录</button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                formLogin: {
                    username: 'name',
                    password: '12345',
                    clientType: 'PC'
                }
            }
        },
        methods: {

            handleSubmit () {
              // fetchApi.login(this.formLogin).then(data=>{
                this.$router.push({
                   path:"/patientManage"
                 })
              // })

            }
        }
    }
</script>
