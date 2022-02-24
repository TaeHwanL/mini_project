import Vue from "vue"
import VueRouter from "vue-router"
import list from "./views/list"
import detail from "./views/detail"
import App from "./App"

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
        },
        {
            path:"/App", 
            component: App
        },
    ]
});

export default router