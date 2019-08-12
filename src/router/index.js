import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'

import Frame from '../components/frame/Frame.vue'
import Personal from '../components/personal/Personal.vue'
import Center from '../components/Center.vue'
import OrderList from '../components/OrderList.vue'
import OrderDetail from '../components/OrderDetail.vue'
import BindWechat from '../components/BindWechat.vue'

Vue.use(Router)

const routes = [
    {
        path: '/app',
        component: Frame,
        children: [
            {
                path: 'center',
                name: 'center',
                component: Center,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'orderlist/:type',
                name: 'list',
                component: OrderList,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'orderdetail/:id',
                name: 'detail',
                component: OrderDetail,
                meta: {
                    requireAuth: true
                }
            },
        ]
    },
    {
        path: '/personal',
        component: Personal,
        children: [
            {
                path: 'bindwechat',
                name: 'wechat',
                component: BindWechat,
                meta: {
                    requireAuth: false
                }
            },
        ]
    },
    {
        path: '*',
        redirect: '/app/center'
    }
];

const router = new Router({
    scrollBehavior: () => ({ y: 0 }), // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
    routes
});

router.beforeEach((to, from, next) => {
    store.dispatch('showLoading');
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            next();
        }
        else {
            next({
                path: '/personal/bindwechat',
                query: {redirect: to.fullPath}
            })
        }
    }
    else {
        next();
    }
});

router.afterEach(function (to) {
    store.dispatch('hideLoading')
});

export default router;
