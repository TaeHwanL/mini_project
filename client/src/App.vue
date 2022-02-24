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
<<<<<<< HEAD
    data() {
        return {
            posts: [],
            totals: [],
            cnts: [],
            state: 'all',
            currentPageIndex: 1,
            searchtxt: '',
            complete: false,
            error: '',
            text: '',
            isActive: true
        }
    },
    methods: {
        movepage: async function(param) {
            this.currentPageIndex = param;

            try {
                this.posts = await PostService.getPosts(this.state, this.currentPageIndex, this.complete, this.searchtxt);
                this.totals = await PostService.gettotal(this.state, this.complete, this.searchtxt);
            } catch (err) {
                this.error = err.message;
            }
        },

        fillter: function(state) {
            this.state = state;

            this.movepage(1);
        },

        completechk: function() {
            this.complete = !this.complete;
            this.movepage(1);
        }
    },
    async created() {
        this.movepage(this.currentPageIndex);
        this.cnts = await PostService.getPostCnt();
    },    
};

=======
    async created() {
        if (VueCookies.isKey('accessToken')) { 
            this.$router.push("/list").catch(() => {})
        } else {
            this.$router.push("/").catch(() => {})
        }
    },  
}
>>>>>>> 8acd3b6194bb7fcac3a604a99aa6540086bffd8b
</script>

<style>

</style>