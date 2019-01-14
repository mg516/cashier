<template>
    <div class="pageBox">
        <receiptModal ref="receiptModal" :printData="printData"></receiptModal>
        <el-container>
            <el-aside width="398px" style="background-color:#fff;margin-right:10px">
                <el-container>
                    <el-header>
                        <div style="background-color: #fff;padding: 0">
                            <el-input ref="searchInput" style="width: 300px;height: 36px;" type="password" v-model="pick_code" placeholder="订单提货码/会员提货码" clearable class="input-with-select" @keyup.enter.native="searchPickData">
                                <el-button @click="searchPickData" style="" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                            <el-button style="margin:0;" type="warning" @click="initComp">重置</el-button>
                        </div>
                    </el-header>
                    <el-main style="padding:10px;">
                        <div class="orderMsgBox" v-if="pickDetail&&pickType=='order'">
                            <p class="pickItem"><span class="label">订单号：</span>{{pickDetail.sn}}</p>
                            <p class="pickItem"><span class="label">下单时间：</span>{{pickDetail.create_time}}</p>
                            <p class="pickItem"><span class="label">会员：</span>{{pickDetail.user_name}}</p>
                            <p class="pickItem"><span class="label">提货门店：</span>{{pickDetail.store_name}}</p>
                            <p class="pickItem"><span class="label">会员电话：</span>{{pickDetail.user_mobile}}</p>
                            <p class="pickItem"><span class="label">提货时间：</span>{{pickDetail.ps_date}} {{pickDetail.ps_time}}</p>
                            <p class="pickItem" v-if="pickDetail.trade_time">
                                <span class="label">提货完成时间：</span>{{pickDetail.trade_time}}
                            </p>
                            <p class="pickItem">
                                <span class="label">订单类型：</span>
                                <span v-if="pickDetail.type==1">自提</span>
                                <span v-else-if="pickDetail.type==2">送货上门</span>
                            </p>
                            <p class="pickItem" v-if='pickDetail.pay'>
                                <span class="label">付款状态：</span>
                                <span v-if="pickDetail.pay==0">未付款</span>
                                <span v-else-if="pickDetail.pay==1">部分付款</span>
                                <span v-else-if="pickDetail.pay==2">已付款</span>
                            </p>
                            <p class="pickItem">
                                <span class="label">订单状态：</span>
                                <span v-if="pickDetail.confirm==-1">已取消</span>
                                <span v-else-if="pickDetail.type==1 && pickDetail.pick==0">待提货</span>
                                <span v-else-if="pickDetail.type==1 && pickDetail.pick==1">提货中</span>
                                <span v-else-if="pickDetail.type==1 && pickDetail.pick==2">提货完成</span>
                                <span v-else-if="pickDetail.type==2 && pickDetail.dispatch==0">待配送</span>
                                <span v-else-if="pickDetail.type==2 && pickDetail.dispatch==1">配送中</span>
                                <span v-else-if="pickDetail.type==2 && pickDetail.dispatch==2">配送完成</span>
                            </p>
                            <p class="pickItem"><span class="label">合计：</span>{{pickDetail.total}} 元</p>
                        </div>
                        <div class="orderMsgBox" v-else-if="pickDetail&&pickType=='goods'">
                            <p class="pickItem"><span class="label">会员：</span>{{pickDetail.name||pickDetail.nickname}}</p>
                            <p class="pickItem"><span class="label">会员电话：</span>{{pickDetail.mobile}}</p>
                        </div>
                    </el-main>
                    <el-footer style="padding:10px;">
                        
                    </el-footer>
                </el-container>
            </el-aside>
            <el-main style="padding:0;background-color:#fff;">
                <el-container style="background-color:#fff;">
                    <el-header>
                        <div style="float:left;margin-right:10px">
                            <span class="demonstration" style="font-size:14px;color:grey;">日期：</span>
                            <el-date-picker style="width:240px;" v-model="form.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd" :disabled="pickDetail?false:true"></el-date-picker>
                        </div>
                        <el-input style="width:165px;" v-model="form.search" placeholder='请输入订单号/商品' clearable :disabled="pickDetail?false:true" @clear="callbackFunc(reSearchPick)" @keyup.enter.native="callbackFunc(reSearchPick)"></el-input>
                        <el-select v-model="pickType" placeholder="请选择" :disabled="pickDetail?true:true" @change="callbackFunc(reSearchPick)">
                            <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-button @click="callbackFunc(reSearchPick)" type="primary" :disabled="pickDetail?false:true">查询</el-button>
                        <el-button @click="callbackFunc(reSearchPick)" type="primary" v-if="pickType=='order'" style="margin-left:0;">提货</el-button>
                    </el-header>
                    <el-main style="padding:10px;overflow-y:hidden">
                        <!-- 订单列表 -->
                        <el-table v-if="pickType=='order'" key="order" :data="pickDetail.goods" border :header-cell-style="rowClass" height="530" style="width: 100%;height:40vh;" :row-class-name="tableRowClassName">
                            <el-table-column prop="rows" label="行号" width="50" type="index"></el-table-column>
                            <el-table-column prop="bar_code" label="货号" width="140"></el-table-column>
                            <el-table-column prop="name" label="商品" width="180"></el-table-column>
                            <el-table-column prop="num" label="数量">
                                <template slot-scope="scope">
                                    <div>{{scope.row.num}} {{scope.row.unit}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="price" label="单价"></el-table-column>
                            <el-table-column prop="total" label="小计"></el-table-column>
                        </el-table>
                        <!-- 商品列表 -->
                        <el-table v-if="pickType=='goods'" key="goods" :data="pickDetail.goodsdata" border :header-cell-style="rowClass" height="530" style="width: 100%;height:40vh;" :row-class-name="tableRowClassName" @selection-change="getCheckPickGoods">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column label="行号" width="50" type="index"></el-table-column>
                            <el-table-column prop="sn" label="订单号"></el-table-column>
                            <el-table-column prop="name" label="商品"></el-table-column>
                            <el-table-column prop="num" label="数量">
                                <template slot-scope="scope">
                                    <div>{{scope.row.num}} {{scope.row.unit}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="price" label="单价"></el-table-column>
                            <el-table-column prop="total" label="小计"></el-table-column>
                            <el-table-column prop="total" label="小计"></el-table-column>
                        </el-table>
                    </el-main>
                    <el-footer style="height:50px;">
                        <div class="handleGoods" style="display:inline-block;float:right;padding-top: 6px;height:auto;">
                            <div class="pageDown" @click="changePage('+','goods')" style="width:80px;margin-left:0;">
                                <img src="./../assets/cut_down.png" width="20px">
                                <span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
                            </div>
                            <span class="pageNum" style="margin:0 10px;line-height:40px;float:right;">第 {{form.page}} 页</span>
                            <div class="pageUp" @click="changePage('-','goods')" style="width:80px;margin-left:0;">
                                <img src="./../assets/cut_up.png" width="20px">
                                <span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
                            </div>
                        </div>
                    </el-footer>
                </el-container>
            </el-main>
        </el-container>
    </div>
</template>
<style type="text/css">
    @import './../static/manageVip.css'
</style>
<style type="text/css">
    @import './../static/pickOrder.css'
</style>
<style type="text/css">
    .el-table .warning-row {
        background: #F2F6FC;
        /*color:#fff;*/
    }
    .el-table .success-row {
        /*background: #f0f9eb;*/
    }
</style>
<script type="text/ecmascript-6">
    import receiptModal from "./setUp/receiptModal"
    export default {
        name:'pickOrder',
        components: {
            'receiptModal': receiptModal
        },
        data(){
            return {
                pickGoodsList:null,//选中的要提货商品
                pick_code:null,//提货码
                pickType:null,//提货状态
                searchOptions:[
                    {value: '-1',label: '无'},
                    {value: 'order',label: '提货订单'},
                    {value: 'goods',label: '提货商品'}
                ],
                pickDetail:'',//提货信息
                form:{
                    search:null,
                    order_status:1,//全部1，已完成6，未支付2
                    time:null,//时间范围
                    page:1,
                    limit:10,
                },
                pickerOptions: {
                  shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近一个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近三个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                    }
                  }]
                },
                printData:{
                    setupData:null,
                    initData:{
                        ifShow:0,
                        ifReprint:false,
                        printType:'recharge'
                    },
                    rechargeData:{},
                }
            }
        },
        watch:{
            'form.time':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    this.form.page = 1;
                    if(this.pickDetail){
                        this.reSearchPick();
                    }
                },
                deep: true    //深度监听
            },
            $route(to,from){
                // debugger
                console.log(to.path);
                if(to.path == '/pickOrder'){
                    this.pick_code = null;
                    this.initComp();
                }
            },
        },
        mounted:function(){
            this.initComp();
        },
        methods:{
            // 打印小票
            print(){
                if(this.orderDetail){
                    this.$refs.receiptModal.print();
                }
            },
            tableRowClassName({row, rowIndex}) {
                if(this.pickType == 'order'){
                    if (row.type == 3 || row.type == 8) {
                        return 'warning-row';
                    } else {
                        return 'success-row';
                    }
                }else if(this.pickType == 'goods'){
                    if(row.pay_refund==2) {
                        return 'warning-row';
                    } else {
                        return 'success-row';
                    }
                }
                return '';
            },
            getCheckPickGoods(val){
                this.pickGoodsList=val;
            },
            // 重置页号 回调方法
            callbackFunc(_callback){
                this.form.page = 1;
                // this.dataList = null;
                setTimeout(()=>{
                    _callback();
                },0)
            },
            // 切换页号
            changePage(changeType,_type){
                if(!this.dataList){return '';}
                let curPage = this.form.page;
                let param = {}
                if(changeType == '+'){
                    if(this.dataList.length<this.form.limit)return '';
                    this.form.page = parseInt(curPage)+1
                }else if(changeType == '-'){
                    if(curPage==1)return '';
                    this.form.page = parseInt(curPage)-1
                }
                this.reSearchPick();
            },
            // 初始化组件
            initComp(){
                this.$store.commit('loading',{obj:this,type:false});
                this.pickDetail = null;
                this.pickType = '-1';
                // 重置默认筛选时间
                const today = new Date();
                let initTime = [this.formatTime(new Date(today.getTime() - 3600 * 1000 * 24 * 7)),this.formatTime(today)]
                this.form.time = initTime;
                this.form.page = 1;
                this.dataList = null;
                this.statementsList = null;
                setTimeout(()=>{this.$refs.searchInput.focus();},100)
            },
            searchPickData(){
                let loginData = this.$store.state.loginData;
                let param = {
                    user_token: loginData.user_token,
                    action: 'pick_code',
                    pick_code: this.pick_code
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.order}`, param).then((res) => {
                    if(res.data.code==1){
                        if(res.data.sign=='goods'){
                            this.pickType = 'goods';
                            this.reSearchPick(this.pick_code);
                        }else if(res.data.data && res.data.data.id){
                            this.pickType = 'order';
                            this.pickDetail = res.data.data;
                        }else{
                            this.showMsg(res.data.msg);
                            return '';
                        }
                    }else{
                        this.showMsg(res.data.msg)
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            reSearchPick(){
                let loginData = this.$store.state.loginData;
                let param = {
                    user_token: loginData.user_token,
                    access_token: loginData.access_token,
                }
                if(this.pickType=='goods'){
                    param.action = 'ordergoods';
                    param.pick_code = this.pick_code;
                }else if(this.pickType=='order'){
                    param.action = 'info';
                    param.id = this.pickDetail.id;//订单号
                    param.sign = loginData.sign;
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.order}`, param).then((res) => {
                    if(res.data.code==1){
                        this.pickDetail = res.data.data;
                    }else{
                        this.showMsg(res.data.msg)
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            showModal(cont,title,_callback){
                this.$alert(cont, title||'提示', {
                    confirmButtonText: '确定',
                    callback: action => {if(_callback)_callback()}
                });
            },
            // 提示模态框
            showMsg(cont,type){
                this.$message({
                    type: type||'info',
                    message: `${ cont }`
                });
                if(type == 'warning' || type == 'success' || !type){
                    this.$message({
                        type: type||'info',
                        message: `${ cont }`
                    });
                }else if(type == 'error'){
                    this.$message.error(`${ cont }`);
                }
            },
            // 提示框
            notify(text,title,color){
                const h = this.$createElement;
                this.$notify({
                    title: `${title?title:'警告'}`,
                    duration:1500,
                    message: h('h3', { style: `color: ${color?color:'#E04C4C'};font-weight:bold;`}, text)
                });
            },
            formatTime(time){
                let date = time||new Date();
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const day = date.getDate()
                const hour = date.getHours()
                const minute = date.getMinutes()
                const second = date.getSeconds()
                return `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`
            },
            timestampToTime(timestamp) {
                var date = new Date(timestamp /** 1000*/);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate();
                // var D = date.getDate() + ' ';
                // var h = date.getHours() + ':';
                // var m = date.getMinutes() + ':';
                // var s = date.getSeconds();
                return Y+M+D;
            },
            //修改表头的颜色
            rowClass({ row, rowIndex}) {
                return 'background:#f5f5f5'
            }
        }
    }
</script>