import Vue from "vue";
import VueRouter from "vue-router";
import list from "../list"
import login from "../login"

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path:"/", 
            component: login
        },
        {
            path:"/list", 
            component: list
        }
    ]
});

export default router