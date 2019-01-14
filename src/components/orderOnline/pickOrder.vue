<!-- 
    全部订单
 -->
<template>
    <el-container id="pickOrder">
        <receiptModal ref="receiptModal" :printData="printData"></receiptModal>
        <el-header style="border-bottom:0;height:auto;">
            <div>
                <!-- <el-input style="width: 260px;height: 36px;" ref="searchInputVip" @clear="form.page = 1;getOrderList()" @keyup.enter.native="form.page = 1;getOrderList()" v-model="search_vip" placeholder="会员卡号" clearable class="input-with-select" type="password"></el-input> -->
                <el-input style="width: 260px;height: 36px;" ref="searchInput" @clear="form.page = 1;getOrderList()" @keyup.enter.native="form.page = 1;getOrderList()" v-model="search_data" placeholder="销售单号/姓名/手机号/会员码..." clearable class="input-with-select"></el-input>
                <el-date-picker v-model="form.time" @change="form.page = 1;getOrderList()" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd" :clearable="false"></el-date-picker>
                <!-- <el-date-picker style="width:200px;" v-model="form.pickTime" type="date" placeholder="选择日期"></el-date-picker> -->
                <el-button @click="form.page=1;getOrderList()">查询</el-button>
                <el-button @click="print" style="margin-left:0;">打印</el-button>
                <!-- <el-button @click="print" style="margin-left:0;">打印提货单</el-button> -->
            </div>
            <div style="height:40px;">
                <el-radio-group v-model="form.order_status">
                    <el-radio :label="status.id" v-for="status,index in orderStatusList">{{status.name}}</el-radio>
                </el-radio-group>
                <div class="handleGoods" style="display:inline-block;float:right;">
                    <div class="pageDown" @click="changePage('+')" style="width:90px;margin-left:0;">
                        <img src="./../../assets/cut_down.png" width="20px">
                        <span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
                    </div>
                    <span class="pageNum" style="margin:0 10px;line-height:40px;float:right;">第 {{form.page}} 页
                        <span v-if="orderNum>0" style="font-weight:lighter;font-size:14px;color:#666;"> ( 总 {{orderNum}} 条 ) </span></span>
                    <div class="pageUp" @click="changePage('-')" style="width:90px;margin-left:0;">
                        <img src="./../../assets/cut_up.png" width="20px">
                        <span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
                    </div>
                </div>
            </div>
        </el-header>
        <el-main style="padding:10px;overflow-y:hidden;height:100%;">
            <el-table :data="orderList" style="width: 100%;" height="49%" ref="orderListTable" @current-change="getOrderDetail" highlight-current-row>
                <el-table-column prop="id" label="行号" width="60" type="index"></el-table-column>
                <el-table-column prop="sn" label="订单号" width="220"></el-table-column>
                <!-- <el-table-column prop="pay" label="付款状态" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.pay==0">未支付</div>
                        <div v-else-if="scope.row.pay==1">部分付款</div>
                        <div v-else-if="scope.row.pay==2">已付款</div>
                    </template>
                </el-table-column> -->
                <el-table-column prop="refund_status" label="退款状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.refund_status==0">无</span>
                        <span v-else-if="scope.row.refund_status==1">部分退款</span>
                        <span v-else-if="scope.row.refund_status==2">全额退款</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="160"></el-table-column>
                <el-table-column prop="user_name" label="客户姓名" width="160"></el-table-column>
                <el-table-column prop="user_mobile" label="电话"></el-table-column>
                <el-table-column prop="create_time" label="订单状态" :width="form.order_status=='-1'?240:160">
                    <template slot-scope="scope">
                        <span v-if="scope.row.refund_status==2">无</span>
                        <span v-else-if="scope.row.type==1 && scope.row.pick == 0" :style="scope.row.pay==0?'color:#ccc;':'color:#E04C4C'">待提货(提货)</span>
                        <span v-else-if="scope.row.type==1 && scope.row.pick == 1" style="color:#E04C4C;">提货中(提货)</span>
                        <span v-else-if="scope.row.type==1 && scope.row.pick == 2" style="color:#6FBA2C;">提货完成(提货)</span>
                        <span v-else-if="scope.row.type==2 && scope.row.dispatch == 0" :style="scope.row.pay==0?'color:#ccc;':'color:#E04C4C'">待配送(配送)</span>
                        <span v-else-if="scope.row.type==2 && scope.row.dispatch == 1" style="color:#E04C4C;">配送中(配送)</span>
                        <span v-else-if="scope.row.type==2 && scope.row.dispatch == 2" style="color:#6FBA2C;">配送完成(配送)</span>
                        <span v-if="scope.row.refund_status!=2">
                            <i v-if="scope.row.type==1" style="font-size:16px;color:#DFB31F;" class="icon iconfont icon-icontihuo"></i>
                            <i v-else-if="scope.row.type==2" style="font-size:16px;color:#17C295;" class="icon iconfont icon-che-tianchong"></i>
                        </span>
                        <!-- <span v-if="form.order_status=='-1'&&scope.row.refund_status!=2">　<el-button @click="pickUpOrder(scope.row)" type="primary" size="mini">整单提货</el-button></span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="合计" width="100"></el-table-column>
            </el-table>
            <el-table :data="orderDetail" border height="49%" style="width: 100%;margin-top:8px;">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="bar_code" label="货号" width="180"></el-table-column>
                <el-table-column prop="name" label="商品"></el-table-column>
                <el-table-column prop="num" label="数量" width="120"></el-table-column>
                <el-table-column prop="num_g_total" label="实际数量" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.is_weigh=='-1'?'无':scope.row.num_g_total}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="售价" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.price+' 元'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="kg_price" label="实际单价" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.is_weigh=='-1'?'无':scope.row.kg_price+' 元'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="th_time" label="预计提货时间" width="160"></el-table-column>
                <el-table-column prop="th_accomplish_time" label="提货完成时间" width="160"></el-table-column>
                <el-table-column prop="is_th" label="提货状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_th=='-1'">未提货
                            <!-- 　<el-button @click="pickUpGoods(scope.row)" type="primary" size="mini">提货</el-button> -->
                        </span>
                        <span v-else-if="scope.row.is_th=='1'">已提货</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="小计" width="120"></el-table-column>
                <el-table-column prop="weigh_pay_total" label="实际小计" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.is_weigh=='-1'?'无':scope.row.weigh_pay_total}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>
<style type="text/css">
    #pickOrder{height: 100%;}
    /*.setupDataBox .el-form-item>label{width: 160px!important;}*/
    /*.setupDataBox .el-form-item>.el-form-item__content{margin-left: 160px!important;}*/
</style>
<script type="text/ecmascript-6">
    import receiptModal from "../setUp/receiptModal"
    export default {
        name:'pickOrder',
        components: {
            'receiptModal': receiptModal
        },
        data(){
            var vue = this;
            return {
                orderStatusList:[{name:'待提货',id:'5'},{name:'已提货',id:'12'},{name:'全部',id:'-1'}],
                form:{
                    order_status:0,//全部1，已完成6，未支付2
                    time:null,//时间范围
                    page:1,
                    limit:5,
                    pickTime:null
                },
                search_data:null,//查询条件
                search_vip:null,//查询会员
                timeOptionRange:null,//日期输入框的禁用参数（该时间前后一周可选）
                pickerOptions2: {
                    /*disabledDate(time) {
                        let timeOptionRange = vue.timeOptionRange;
                        let secondNum = 60*60*24*7*1000;
                        if(timeOptionRange){
                            return time.getTime() > timeOptionRange.getTime() + secondNum || time.getTime() < timeOptionRange.getTime() - secondNum ;
                        }
                    },
                    onPick(time){
                        if(time.minDate && !time.maxDate){
                            vue.timeOptionRange = time.minDate;
                        }
                        if(time.maxDate){
                            vue.timeOptionRange = null;
                        }
                    },*/
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
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                          picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 24);
                          picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                orderData:null,//选中订单
                orderNum:0,//订单总条数
                orderList:[],
                orderDetail:[],
                searchGoods:'', //搜索订单的值
                printData:{
                    setupData:null,
                    initData:{
                        ifShow:0,
                        ifReprint:false,
                        printType:'pay'
                    },
                    orderData:{//打印订单信息
                        orderId:null,
                        order_over_time:null,
                        receivable:null,
                        cash:0,
                        familyCard:0,
                        weip:0,
                        change:0,
                        card:0,
                        totalNum:0,
                        goods:[]
                    },
                    userData:{//打印会员信息
                        sh_name:null,
                        sh_mobile:null,
                        sh_address:null,
                        name:null,
                        province_name:null,
                        city_name:null,
                        mobile:null
                    },
                }
            }
        },
        mounted:function(){
            // this.$emit('getOrderNum')
        },
        watch:{
            'form.order_status':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    this.form.page=1;
                    this.getOrderList();
                },
                deep: true    //深度监听
            },
            /*'form.time':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    if(newValue){
                        let time1 = newValue[0];
                        let time2 = newValue[1];
                        if((new Date(time2) - new Date(time1))>604800000){
                            this.form.time = oldValue;
                            this.showMsg('时间范围不可超过7天','error')
                        }
                    }
                },
                deep: true    //深度监听
            },*/
        },
        methods:{
            reload(){
                this.$store.commit('loading',{obj:this,type:false});
                const today = new Date();
                let initTime = [this.formatTime(new Date(today.getTime())),this.formatTime(new Date(today.getTime()))]
                this.form.time = initTime;
                this.form.page=1;
                this.form.pickTime = today;
                this.search_data = null;
                this.search_vip = null;
                this.timeOptionRange = null;//日期输入框的禁用参数（该时间前后一周可选）
                this.form.order_status = '5';
                this.getOrderList();
                this.$refs.receiptModal.getConfig();//获取最新的小票配置
            },
            // 切换页号
            changePage(changeType){
                let curPage = this.form.page;
                let param = {}
                if(changeType == '+'){
                    if(this.form.limit*parseInt(curPage)>=this.orderNum) return '';
                    // if(this.orderList.length<this.form.limit) return '';
                    this.form.page = parseInt(curPage)+1
                }else if(changeType == '-'){
                    if(curPage==1)return '';
                    this.form.page = parseInt(curPage)-1
                }
                this.getOrderList();
            },
            //查询订单列表
            getOrderList(){
                let form = this.form;
                let param = {
                    user_token:this.$store.state.loginData.user_token,
                    access_token: this.$store.state.loginData.access_token,
                    time_type:2,
                    action:'getApiorderList',
                    sign:this.$store.state.loginData.sign,
                    order:2,
                    list_rows:form.limit,
                    page:form.page,
                };
                if(form.order_status!='-1'){//待自提
                    param.order_status = form.order_status
                }
                /*if(form.order_status!=0){
                    param.is_th = form.order_status;
                }*/
                if(form.time){
                    param.start_time = form.time[0]
                    param.end_time = form.time[1]
                }
                if(this.search_data) param.search_data = this.search_data;
                if(this.search_vip) param.card = this.search_vip;
                // this.orderDetail = [];
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    // 切换列表时清空详情数数据
                    this.orderDetail = null;
                    this.orderNum = 0;
                    if(res.data.code == 1){
                        this.orderNum = res.data.data.num;
                        this.orderList = res.data.data.data;
                        setTimeout(()=>{
                            this.setCurrent(this.orderList[0]);//默认选中第一个
                        },10)
                    }else{
                        this.orderNum = 0;
                        this.orderList = [];
                    }
                })
            },
            // 设置选中的行号
            setCurrent(row) {
                this.$refs.orderListTable.setCurrentRow(row);//row,数组的对应元素
            },
            //订单详情
            getOrderDetail(val){
                this.printData.userData = {//打印会员信息
                    sh_name:null,
                    sh_mobile:null,
                    sh_address:null,
                    name:null,
                    province_name:null,
                    city_name:null,
                    mobile:null
                }
                this.printData.orderData = {//打印订单信息
                    orderId:null,
                    order_over_time:null,
                    receivable:null,
                    cash:0,
                    familyCard:0,
                    weip:0,
                    change:0,
                    card:0,
                    totalNum:0,
                    goods:[]
                }
                this.$refs.searchInput.focus();
                if(!val || !val.id) return;
                let param = {
                    user_token:this.$store.state.loginData.user_token,
                    access_token: this.$store.state.loginData.access_token,
                    sign:this.$store.state.loginData.sign,//this.$store.state.loginData.sign
                    action:"getonlinegoods",
                    id:val.id
                };
                if(this.form.order_status==12) param.is_th = '1';
                else if(this.form.order_status==5) param.is_th = '-1'
                // debugger
                if(this.form.time){
                    param.start_time = this.form.time[0]
                    param.end_time = this.form.time[1]
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    if(res.data.code == 1){
                        this.orderData = val;
                        this.orderDetail = res.data.data;
                        // 小票订单信息
                        this.printData.orderData.orderId = val.sn;
                        this.printData.orderData.order_over_time = val.create_time;
                        this.$set(this.printData.orderData,'create_time',val.create_time);
                        let totalMoney = val.total;
                        if(val.express_fee && parseFloat(val.express_fee)>0){
                            totalMoney = (parseFloat(totalMoney) + parseFloat(val.express_fee)).toFixed(2)
                            this.printData.orderData.yunfei = val.express_fee;
                        }
                        this.printData.orderData.receivable = totalMoney;
                        if(val.pay_type==1){
                            this.printData.orderData.card = totalMoney;
                        }else if(val.pay_type==2){
                            this.printData.orderData.weip = totalMoney;
                        }else if(val.pay_type==7){
                            this.printData.orderData.familyCard = totalMoney;
                        }
                        let totalNum = 0;
                        for(let i=0;i<this.orderDetail.length;i++){
                            if(this.orderDetail[i].sorting_num == 1){
                                totalNum++;
                            }else{
                                // totalNum += parseFloat(cartList[i].num);
                                totalNum += parseFloat(this.orderDetail[i].num);
                            }
                        }
                        this.printData.orderData.totalNum = totalNum;
                        for(let i = 0;i<this.orderDetail.length;i++){
                            this.$set(this.orderDetail[i],'saleprice',this.orderDetail[i].price)
                            this.$set(this.orderDetail[i],'originalprice',this.orderDetail[i].price)
                        }
                        this.printData.orderData.goods = this.orderDetail;
                        // 小票会员信息
                        this.printData.userData.sh_address = null;//val.address
                        this.printData.userData.sh_name = null;//val.sh_name
                        this.printData.userData.sh_mobile=null;//val.sh_mobile
                        this.printData.userData.name = val.user_name||null;
                        this.printData.userData.mobile=val.user_mobile||null;
                        this.printData.userData.province_name = null;
                        this.printData.userData.city_name = null;
                    }else{
                        this.orderDetail = null;
                        this.orderDetail = [];
                    }
                })
            },
            // 单品提货
            pickUpGoods(goods){
                this.$confirm(`提货 ${goods.name}，确认吗？`, '警告', 
                    {confirmButtonText: '是',   cancelButtonText: '否',type: 'warning'
                }).then(() => {
                    let param = {
                        user_token:this.$store.state.loginData.user_token,
                        access_token: this.$store.state.loginData.access_token,
                        action:"onlinegoodspick",
                        order_id:this.orderData.id,
                        goods_id:goods.goods_id,
                        key_id:goods.id
                    };
                    this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                        if(res.data.code == 1){
                            this.getOrderDetail(this.orderData)
                            this.confirm('提货成功！')
                        }else{
                            this.confirm(res.data.msg)
                        }
                    })
                }).catch(() => {
                    console.log('取消了')
                });
            },
            // 整单提货
            pickUpOrder(order){
                this.$confirm(`是否确认提货？`, '提示', 
                    {confirmButtonText: '是',   cancelButtonText: '否',type: 'warning'
                }).then(() => {
                    let param = {
                        user_token:this.$store.state.loginData.user_token,
                        access_token: this.$store.state.loginData.access_token,
                        action:"onlinegoodspickAll",
                    };
                    let goods = [];
                    if(this.orderDetail.length>0){
                        for(let i = 0;i<this.orderDetail.length;i++){
                            let item = {
                                order_id:this.orderDetail[i].order_id,
                                goods_id:this.orderDetail[i].goods_id,
                                key_id:this.orderDetail[i].id,
                            }
                            goods.push(item)
                        }
                    }
                    param.goods = goods;
                    this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                        if(res.data.code == 1){
                            // this.getOrderDetail(this.orderData)
                            this.form.order_status = 12;
                            this.confirm('提货成功！')
                        }else{
                            this.confirm(res.data.msg)
                        }
                    })
                }).catch(() => {
                    console.log('取消了')
                });
            },
            formatTime(_date){
                let date = _date||new Date();
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const day = date.getDate()
                const hour = date.getHours()
                const minute = date.getMinutes()
                const second = date.getSeconds()
                return `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`
                // return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
            },
            // 打印小票
            print(){
                if(this.orderDetail){
                    this.$refs.receiptModal.print();
                }
            },
            //修改表头的颜色
            rowClass({ row, rowIndex}) {
                return 'background:#f5f5f5'
            },
            // 顶部模态框
            showMsg(cont,type){
                this.$message({
                    type: type||'info',
                    message: `${ cont }`
                });
            },
            // 侧边提示框
            notify(text,title,color){
                const h = this.$createElement;
                this.$notify({
                    title: `${title?title:'警告'}`,
                    duration:1500,
                    message: h('h3', { style: `color: ${color?color:'#E04C4C'};font-weight:bold;`}, text)
                });
            },
            // 弹出模态框
            confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
            },
        }
    }
</script>