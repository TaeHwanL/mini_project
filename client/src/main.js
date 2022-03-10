import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:5000'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.prototype.$axios = axios;

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  components: { App },
  render: h => h(App),
}).$mount('#app')
