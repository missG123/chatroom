import VueRouter from 'vue-router'

import ChatHome from '../view/pages/chatHome/index.vue'
import Video from '../view/pages/video.vue'
import Lingting from '../view/pages/lingting.vue'
import Setting from '../view/pages/setting.vue'
import ChatWindow from '../view/pages/chatHome/chatwindow.vue'
import Login from '@/components/Login'
import Home from '../view/home.vue'
import Friends from '@/view/pages/Friends/index.vue'

import store from '@/store/index'

const router = new VueRouter({
    routes: [
        {
            path: "/",
            redirect: "/Login",
        },
        {
            path: "/Login",
            name: "Login",
            component: Login,
            meta: { auth: true }
        },
        {
            path: "/Home",
            name: 'Home',
            redirect: '/Home/ChatHome',
            component: Home,
            meta: { auth: false },
            children: [{
                path: "ChatHome",
                name: "ChatHome",
                component: () => import('@/view/pages/chatHome/index.vue'),
                meta: { auth: false },
            },
            {
                path: "Friends",
                name: "Friends",
                component: Friends,
                meta: { auth: false },
            },
            ]
        },

        {
            path: "/Video",
            name: "Video",
            component: Video,
            meta: { auth: false },
        },
        {
            path: "/Lingting",
            name: "Lingting",
            component: Lingting,
            meta: { auth: false },
        },
        {
            path: "/Setting",
            name: "Setting",
            component: Setting,
            meta: { auth: false },
        },
    ]
})
router.beforeEach(async (to, from, next) => {
    let token = store.state.user.token
    let name = store.state.user.userInfo.name
    if (token) {
        if (name) {
            next()
        } else {
            try {
                await store.dispatch('user/getUserInfo')
                next()
            } catch (error) {
                // token失效
                // await store.dispatch('user/userLogout')
                next('/')
            }
        }
    } else {
        let toPath = to.path
        console.log(toPath)
        if (to.meta.auth === true) {
            next()
        } else {
            next('/')
        }

    }
})
export default router