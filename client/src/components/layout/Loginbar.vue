<template>
  <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                </ul>
                <form class="d-flex">
                    <div class="navbar-brand" >{{name}}</div>
                    <button class="btn btn-outline-success" type="submit" @click="logout">Logout</button>
                </form>
            </div>
        </div>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies'

export default {
    name: "Loginbar",
    data() {
        return {
            id: '',
            name: ''
        }
    },
    methods: {
      logout() {
          VueCookies.remove('accessToken')
      }
    },
    async created() {
        axios.get("http://localhost:5000/getUser", {
            headers: {
                Authorization: "Bearer " + VueCookies.get('accessToken')
            }
        }).then(res => {
            this.id = res.data.id
            this.name = res.data.name
          })
          .catch(err => {
            console.log(err)
          })
    }
}
</script>

<style>

</style>