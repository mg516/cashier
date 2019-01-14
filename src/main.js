import Vue from 'vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
// import SerialPort from 'serialport'
import 'element-ui/lib/theme-chalk/index.css'
import './static/reset.css'
import './static/index.css'
import './static/public.css'
import './static/jquery3.1.1-slim.js'
import './static/LodopFuncs.js'
// import {getLodop} from './static/LodopFuncs.js'
import main from './components/main/main.vue'
import router from './router/index'
import store from  './store/index'
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'

Vue.use(ElementUI)
Vue.use(VueResource)
// Vue.use(SerialPort)

// Vue.config.productionTip = false;
//开启debug模式
// Vue.config.debug = true

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(main)
})
