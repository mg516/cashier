<template>
    <div class="pageBox">
        <el-container>
            <el-aside width="360px">
                <el-container style="background-color:#fff;">
                    <el-header>
                        <div style="background-color: #fff;padding: 0">
                            <el-input style="width: 100%;height: 36px;" v-model="searchGoods" placeholder="销售单号" clearable class="input-with-select">
                                <el-button style="" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </div>
                    </el-header>
                    <el-main style="padding:10px;">
                        <div class="orderTable">
                            <div class="orderTr">
                                <div class="orderTd">状态</div>
                                <div class="orderTd">销售单号</div>
                            </div>
                            <div class="orderTr" v-for="orderItem,index in orderList">
                                <div class="orderTd">已上传</div>
                                <div class="orderTd">{{orderItem.id}}</div>
                            </div>
                        </div>
                    </el-main>
                    <el-footer style="padding:10px;">Footer</el-footer>
                </el-container>
            </el-aside>
            <el-main style="padding:0;">
                <el-container style="background-color:#fff;">
                    <el-header>Header</el-header>
                    <el-main style="padding:10px;">Main</el-main>
                </el-container>
            </el-main>
        </el-container>
    </div>
</template>
<style type="text/css">
    @import './../static/orderList.css'
</style>
<script type="text/ecmascript-6">
    export default {
        data(){
            return {
                orderList:[
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                    {id:'111',goods:[{name:'茄子',id:1,price:12,num:1},{name:'茄子汁',id:1,price:12,num:1}],price:25,time:'2018-05-23'},
                ]
            }
        },
        mounted:function(){
            console.log(this.$route.params)
        }
    }
</script>