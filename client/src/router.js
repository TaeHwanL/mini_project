import Vue from "vue"
import VueRouter from "vue-router"
import list from "./views/list"
import detail from "./views/detail"

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path:"/", 
            component: list
        },
        {
            path:"/detail", 
            component: detail
        }
    ]
});