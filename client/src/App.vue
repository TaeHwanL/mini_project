<template>
<div id="app">
    <loginbar />
    <router-view></router-view>
</div>
</template>

<script>
import Loginbar from './components/layout/Loginbar.vue'
import VueCookies from 'vue-cookies'

export default {
    name: "app",
    components: {
        Loginbar,
    },
    async created() {
        if (VueCookies.isKey('accessToken')) { 
            this.$router.push("/list").catch(() => {})
        } else {
            this.$router.push("/").catch(() => {})
        }
    },  
}
</script>

<style>

</style>