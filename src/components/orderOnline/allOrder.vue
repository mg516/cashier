<!-- 
    全部订单
 -->
<template>
    <el-container id="allOrder">
        <receiptModal ref="receiptModal" :printData="printData"></receiptModal>
        <el-header style="border-bottom:0;height:auto;">
            <div>
                <el-input style="width: 260px;height: 36px;" ref="searchInput" @clear="form.page = 1;getOrderList()" @keyup.enter.native="form.page = 1;getOrderList()" v-model="search_data" placeholder="销售单号/姓名/手机号" clearable class="input-with-select"></el-input>
                <el-date-picker v-model="form.time" @change="form.page = 1;getOrderList()" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd" :clearable="false"></el-date-picker>
                <!-- <el-date-picker style="width:200px;" v-model="form.pickTime" type="date" placeholder="选择日期"></el-date-picker> -->
                <el-button @click="form.page=1;getOrderList()">查询</el-button>
                <el-button @click="print" style="margin-left:0;">打印</el-button>
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
                    <span class="pageNum" style="margin:0 10px;line-height:40px;float:right;">第 {{form.page}} 页</span>
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
                <el-table-column prop="pay" label="付款状态" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.pay==0">未支付</div>
                        <div v-else-if="scope.row.pay==1">部分付款</div>
                        <div v-else-if="scope.row.pay==2">已付款</div>
                    </template>
                </el-table-column>
                <el-table-column prop="refund_status" label="退款状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.refund_status==0">无</span>
                        <span v-else-if="scope.row.refund_status==1">部分退款</span>
                        <span v-else-if="scope.row.refund_status==2">全额退款</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="订单状态" width="160">
                    <template slot-scope="scope">
                        <span v-if="scope.row.refund_status==2">无</span>
                        <span v-else-if="scope.row.type==1 && scope.row.pick == 0" :style="scope.row.pay==0?'color:#ccc;':'color:#E04C4C'">待提货(提货)</span>
                        <span v-else-if="scope.row.type==1 && scope.row.pick == 1" style="color:#E04C4C;">提货中(提货)</span>
                        <span v-else-if="scope.row.type==1 && scope.row.pick == 2" style="color:#6FBA2C;">提货完成(提货)</span>
                        <span v-else-if="scope.row.type==2 && scope.row.dispatch == 0" :style="scope.row.pay==0?'color:#ccc;':'color:#E04C4C'">待配送(配送)</span>
                        <span v-else-if="scope.row.type==2 && scope.row.dispatch == 1" style="color:#E04C4C;">配送中(配送)</span>
                        <span v-else-if="scope.row.type==2 && scope.row.dispatch == 2" style="color:#6FBA2C;">配送完成(配送)</span>
                        <span v-if="scope.row.refund_status!=2"><i v-if="scope.row.type==1" style="font-size:16px;color:#DFB31F;" class="icon iconfont icon-icontihuo"></i>
                        <i v-else-if="scope.row.type==2" style="font-size:16px;color:#17C295;" class="icon iconfont icon-che-tianchong"></i></span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="160"></el-table-column>
                <el-table-column prop="user_name" label="客户姓名" width="160"></el-table-column>
                <el-table-column prop="user_mobile" label="电话"></el-table-column>
                <el-table-column prop="express_fee" label="运费">
                    <template slot-scope="scope">
                        <span>{{scope.row.express_fee>0?scope.row.express_fee:'无'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="合计">
                    <template slot-scope="scope">
                        <span v-if="scope.row.express_fee && scope.row.express_fee>0">
                            {{(parseFloat(scope.row.total) + parseFloat(scope.row.express_fee)).toFixed(2)}}
                        </span>
                        <span v-else>{{scope.row.total}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="orderDetail_goods" border height="49%" style="width: 100%;margin-top:8px;">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="bar_code" label="货号" width="180"></el-table-column>
                <el-table-column prop="name" label="商品"></el-table-column>
                <el-table-column prop="num" label="数量"></el-table-column>
                <el-table-column prop="price" label="售价">
                    <template slot-scope="scope">
                        <span>{{scope.row.price+' 元'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="小计"></el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>
<style type="text/css">
    #allOrder{height: 100%;}
    /*.setupDataBox .el-form-item>label{width: 160px!important;}*/
    /*.setupDataBox .el-form-item>.el-form-item__content{margin-left: 160px!important;}*/
</style>
<script type="text/ecmascript-6">
    import receiptModal from "../setUp/receiptModal"
    export default {
        name:'allOrder',
        components: {
            'receiptModal': receiptModal
        },
        data(){
            return {
                orderStatusList:[{name:'全部',id:1},{name:'未支付',id:2},{name:'待配送',id:3},{name:'配送中',id:4},{name:'待自提',id:5},{name:'已完成',id:6}],
                form:{
                    order_status:1,//全部1，已完成6，未支付2
                    time:null,//时间范围
                    page:1,
                    limit:5,
                    pickTime:null
                },
                search_data:null,//查询条件
                pickerOptions2: {
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
                orderList:[],
                orderDetail_goods:[],
                searchGoods:'', //搜索订单的值
                printData:{
                    setupData:null,
                    initData:{
                        ifShow:0,
                        ifReprint:true,
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
                        goods:[],
                        yunfei:0,
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
            
        },
        watch:{
            'form.order_status':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    this.form.page=1;
                    this.getOrderList();
                },
                deep: true    //深度监听
            },
        },
        methods:{
            reload(){
                this.$store.commit('loading',{obj:this,type:false});
                const today = new Date();
                let initTime = [new Date(today.getTime() - 3600 * 1000 * 24 * 7),today]
                this.form.time = initTime;
                this.form.page=1;
                this.form.pickTime = today;
                this.form.order_status = 1;
                this.search_data = null;
                this.getOrderList();
                this.$refs.receiptModal.getConfig();//获取最新的小票配置
            },
            // 切换页号
            changePage(changeType){
                let curPage = this.form.page;
                let param = {}
                if(changeType == '+'){
                    if(this.orderList.length<this.form.limit)return '';
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
                    time_type:1,
                    action:'list',
                    sign:this.$store.state.loginData.sign,//this.$store.state.loginData.sign
                    // sign:'4426a055360a7d0f2cc86a30d101bcd9',//this.$store.state.loginData.sign
                    order:2,
                    list_rows:form.limit,
                    page:form.page,
                    order_status:form.order_status
                };
                if(form.time){
                    param.start_time = form.time[0]
                    param.end_time = form.time[1]
                }
                if(this.search_data) param.search_data = this.search_data;
                // 切换列表时清空详情数数据
                this.orderDetail = null;
                this.orderDetail_goods = [];
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.order}`, param).then((res) => {
                    if(res.data.data){
                        this.orderList = res.data.data;
                        setTimeout(()=>{
                            this.setCurrent(this.orderList[0]);//默认选中第一个
                        },10)
                    }else{
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
                    // sign:'4426a055360a7d0f2cc86a30d101bcd9',//this.$store.state.loginData.sign
                    action:"info",
                    id:val.id
                };
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.order}`, param).then((res) => {
                    if(res.data.data){
                        this.orderDetail = res.data.data;
                        if(res.data.data.goods) this.orderDetail_goods = res.data.data.goods;
                        // 小票订单信息
                        this.printData.orderData.orderId = this.orderDetail.sn;
                        this.printData.orderData.order_over_time = this.orderDetail.create_time;
                        this.$set(this.printData.orderData,'create_time',this.orderDetail.create_time);
                        
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
                        for(let i=0;i<this.orderDetail.goods.length;i++){
                            if(this.orderDetail.goods[i].sorting_num == 1){
                                totalNum++;
                            }else{
                                // totalNum += parseFloat(cartList[i].num);
                                totalNum += parseFloat(this.orderDetail.goods[i].num);
                            }
                        }
                        this.printData.orderData.totalNum = totalNum;
                        for(let i = 0;i<this.orderDetail.goods.length;i++){
                            this.$set(this.orderDetail.goods[i],'saleprice',this.orderDetail.goods[i].price)
                            this.$set(this.orderDetail.goods[i],'originalprice',this.orderDetail.goods[i].price)
                        }
                        this.printData.orderData.goods = this.orderDetail.goods;
                        // 小票会员信息
                        this.printData.userData.sh_address = this.orderDetail.sh_address||null;
                        this.printData.userData.sh_name = this.orderDetail.sh_name||null;
                        this.printData.userData.sh_mobile=this.orderDetail.sh_mobile||null;
                        this.printData.userData.name = this.orderDetail.user_name||null;
                        this.printData.userData.mobile=this.orderDetail.user_mobile||null;
                        this.printData.userData.province_name = null;
                        this.printData.userData.city_name = null;
                    }else{
                        this.orderDetail = null;
                        this.orderDetail_goods = [];
                    }
                })
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
            }
        }
    }
</script>