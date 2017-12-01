<template>
    <input type="text" v-modal='fromLogin.username'>
    <input type="text" v-modal='fromLogin.password'>
    <button>登录</button>
</template>
<script>
    export default {
        data () {
            return {
                formLogin: {
                    username: '',
                    password: '',
                    clientType: 'PC'
                }
            }
        },
        methods: {
          ...mapActions(['loginUser']),
            handleSubmit () {
              // this.loginUser(this.formLogin).then(data=>{
              //   this.$router.push({
              //     path:"/patientManage"
              //   })
              // })
            }
        }
    }
</script>
