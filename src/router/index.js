import Vue from 'vue'
import VueRouter from 'vue-router'
// 1. 定义 (路由) 组件。
import cashier from './../components/cashier.vue'
import orderOnline from './../components/orderOnline.vue'
import offlineOrder from './../components/offlineOrder.vue'
import manageVip from './../components/manageVip.vue'
import goods_stock from './../components/goods_stock.vue'
import setup from './../components/setup.vue'
import payType from './../components/pay/payType.vue'
import pickOrder from './../components/pickOrder.vue'
import handover from './../components/handover.vue'
Vue.use(VueRouter)

// 3. 创建 router 实例，然后传 `routes` 配
const router = new VueRouter({
	// 2. 定义路由
    routes:[{
        path: '/cashier',
        component: cashier,
        meta: {
            keepAlive: true // 需要被缓存
        },
        beforeEnter: (to, from, next) => {
            // debugger
            if(from.fullPath == "/payType" && JSON.stringify(from.params)!='{}' && from.params.canReturn){
                next()
            }else if(from.fullPath == "/"){
                next()
            }else if(from.params.canJump){
                from.params.canJump = false;
                next()
            }else{
                next(false)
            }
        },
    },{
        path: '/orderOnline', component: orderOnline, meta: {
            keepAlive: true // 需要被缓存
        },
        beforeEnter: (to, from, next) => {
            if(from.params.canJump){
                from.params.canJump = false;
                next()
            }else{
                next(false)
            }
        },
    },{
        path: '/offlineOrder', component: offlineOrder, meta: {
	    	keepAlive: true // 需要被缓存
	    },
        beforeEnter: (to, from, next) => {
            if(from.params.canJump){
                from.params.canJump = false;
                next()
            }else{
                next(false)
            }
        },
    },{
        path:'/setup', component: setup, meta: {
	    	keepAlive: true // 需要被缓存
	    },
        beforeEnter: (to, from, next) => {
            if(from.params.canJump){
                from.params.canJump = false;
                next()
            }else{
                next(false)
            }
        },
    },{
        path:'/manageVip', component: manageVip, meta: {
            keepAlive: true // 需要被缓存
        },
        beforeEnter: (to, from, next) => {
            if(from.params.canJump){
                from.params.canJump = false;
                next()
            }else{
                next(false)
            }
        },
    },{
        path:'/goods_stock', component: goods_stock, meta: {
            keepAlive: true // 需要被缓存
        },
        beforeEnter: (to, from, next) => {
            if(from.params.canJump){
                from.params.canJump = false;
                next()
            }else{
                next(false)
            }
        },
    },{
        path:'/pickOrder', component: pickOrder, meta: {
            keepAlive: true // 需要被缓存
        },
        beforeEnter: (to, from, next) => {
            if(from.params.canJump){
                from.params.canJump = false;
                next()
            }else{
                next(false)
            }
        },
    },{
        path:'/handover', component: handover, meta: {
            keepAlive: true // 需要被缓存
        },
        beforeEnter: (to, from, next) => {
            if(from.params.canJump){
                from.params.canJump = false;
                next()
            }else{
                next(false)
            }
        },
    },{
        name:'payType',
        path:'/payType',
        component: payType,
        beforeEnter: (to, from, next) => {
            console.log(to, from)
            if(from.fullPath == "/cashier" && to.params && to.params.totalMoney){
                next()
            }else{
                next(false)
            }
        }
    }]
})

export default router;

// 4. 创建和挂载根实例。 （已在main.js挂载实例）
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能

// const app = new Vue({
//   router
// }).$mount('#app')