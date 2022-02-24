import Vue from "vue"
import VueRouter from "vue-router"
import list from "./list"
import login from "./login"

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path:"/", 
            component: login
        },
        {
<<<<<<< HEAD
            path:"/detail", 
            component: detail
        },
        {
            path:"/App", 
            component: App
        },
=======
            path:"/list", 
            component: list
        }
>>>>>>> 8acd3b6194bb7fcac3a604a99aa6540086bffd8b
    ]
});

export default router