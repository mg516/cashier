<template>
    <div class="pageBox">
        <el-container>
            <el-header style="height:auto;padding:0;border-bottom:0;">
                <div class="orderMenu">
                    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" text-color="#606266" active-text-color="#409EFF">
                        <!-- <el-menu-item index="1">全部<el-badge :value="3?1:''" class="item"></el-badge></el-menu-item>
                        <el-menu-item index="2">提货订单<el-badge :value="0?1:''" class="item"></el-badge></el-menu-item>
                        <el-menu-item index="3">配送订单<el-badge :value="1?1:''" class="item"></el-badge></el-menu-item> -->
                        <el-menu-item v-if="item.ifShow" v-for="item,index in menuList" :index="index+1">{{item.name}}<el-badge v-if="item.msgValue>0" :value="item.msgValue" class="item"></el-badge></el-menu-item>
                    </el-menu>
                </div>
            </el-header>
            <el-main style="background-color:#fff;padding:0;height:100%;">
                <pickOrder key="pickOrder" ref="pickOrder" v-show="activeIndex==1" @getOrderNum="getOrderNum"></pickOrder>
                <sendOrder key="sendOrder" ref="sendOrder" v-show="activeIndex==2" @getOrderNum="getOrderNum"></sendOrder>
                <allOrder key="allOrder" ref="allOrder" v-show="activeIndex==3"></allOrder>
            </el-main>
        </el-container>
        <!-- <el-container>
            <el-main style="background-color:#fff;padding:0;height:100%;">
                <allOrder key="allOrder" ref="allOrder" v-show="activeIndex==1"></allOrder>
            </el-main>
        </el-container> -->
    </div>
</template>
<style type="text/css">
    @import './../static/orderList.css'
</style>
<style type="text/css">
    .el-radio-group{margin-top: 16px;}
    .orderMenu .el-badge{position: absolute;top: -14px;z-index: 1;}
</style>
<script type="text/ecmascript-6">
    import allOrder from "./orderOnline/allOrder"
    import pickOrder from "./orderOnline/pickOrder"
    import sendOrder from "./orderOnline/sendOrder"
    export default {
        components: {
            'allOrder': allOrder,
            'pickOrder': pickOrder,
            'sendOrder': sendOrder,
        },
        data(){
            return {
                menuList:[{name:'提货订单',msgValue:0,ifShow:true},{name:'配送订单',msgValue:0,ifShow:true},{name:'全部',msgValue:0,ifShow:true}],
                activeIndex:'1'
            }
        },
        mounted:function(){
            this.initUnitData(1)
        },
        watch:{
            $route(to,from){
                // debugger
                console.log(to.path);
                if(to.path == '/orderOnline'){
                    this.initUnitData(1)
                }
            },
        },
        methods:{
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                this.initUnitData(key)
                // this.activeIndex = key
            },
            initUnitData(_index){
                let index = _index;
                if(!index) index = this.activeIndex;
                else this.activeIndex = index;
                if(index=='1') this.$refs.pickOrder.reload();
                if(index=='2') this.$refs.sendOrder.reload();
                if(index=='3') this.$refs.allOrder.reload();
                
                // 新订单标识
                let menuList = this.$store.state.menuList;
                menuList[1].msg = 0;
                let param4 = {key:'menuList',val:menuList};
                this.$store.commit('saveState',param4);
                this.getOrderNum();
            },
            getOrderNum(){
                let loginData = this.$store.state.loginData;
                let param = {
                    user_token: loginData.user_token,
                    access_token: loginData.access_token,
                    action: 'statisticsordernum',
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    if(res.data.code==1){
                        this.menuList[0].msgValue = res.data.data.th_num;
                        this.menuList[1].msgValue = res.data.data.ps_num;
                    }else{
                        this.showMsg(res.data.msg)
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 提示模态框
            showMsg(cont,type){
                this.$message({
                    type: type||'info',
                    message: `${ cont }`
                });
            },
        }
    }
</script>