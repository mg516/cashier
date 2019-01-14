<template>
    <div class="pageBox">
        <receiptModal ref="receiptModal" :printData="printData"></receiptModal>
        <el-container>
            <el-aside width="360px" style="background-color:#fff;margin-right:10px">
                <el-container>
                    <el-header>
                        <div style="background-color: #fff;padding: 0">
                            <el-input ref="searchInput" style="width: 100%;height: 36px;" @change="page = 1;getOrderList()" v-model="searchGoods" placeholder="销售单号" clearable class="input-with-select">
                                <el-button @click="page = 1;getOrderList()" style="" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </div>
                    </el-header>
                    <el-main style="padding:10px;">
                        <!-- <div class="orderTable">
                            <div class="orderTr">
                                <div class="orderTd">状态</div>
                                <div class="orderTd">销售单号</div>
                            </div>
                            <div class="orderTr" v-for="orderItem,index in orderList" :class="{choosed_color:orderItem.id==isActive}">
                                <div class="orderTd">{{orderItem.is_upload==1?'已上传':'未上传'}}</div>
                                <div class="orderTd" @click="getOrderDetails(orderItem.id)">{{orderItem.sn}}</div>
                            </div>
                        </div> -->
                        <el-table :data="orderList" style="width: 100%;height:100%" ref="orderListTable" @current-change="getOrderDetails" highlight-current-row>
                            <el-table-column prop="id" label="行号" width="60" type="index"></el-table-column>
                            <el-table-column prop="sn" label="订单号">
                                <template slot-scope="scope">
                                    <span>{{scope.row.sn}}</span>
                                    <el-popover trigger="hover" placement="top" class="errorOrder">
                                        <p>如退货，优惠券不会返还</p>
                                        <div slot="reference" class="name-wrapper">
                                            <span v-if="scope.row.use_coupon==1" style="color:#F56C6C;">券</span>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                    <el-footer style="padding:10px;">
                        <div class="handleGoods" style="display: flex;justify-content: space-between;">
                            <div class="pageUp" @click="changePage('-')" style="margin:0;">
                                <img src="./../assets/cut_up.png" width="20px">
                                <span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
                            </div>
                            <span class="pageNum" style="float:right;line-height:40px;">第 {{this.page}} 页</span>
                            <div class="pageDown" @click="changePage('+')" style="margin:0;">
                                <img src="./../assets/cut_down.png" width="20px">
                                <span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
                            </div>
                        </div>
                    </el-footer>
                </el-container>
            </el-aside>
            <el-main style="padding:0;background-color:#fff;">
                <el-container style="background-color:#fff;">
                    <el-header>
                        <!-- <el-checkbox v-model="checked" style='line-height:40px;float:left;margin-right:10px'>联网查询</el-checkbox> -->
                        <div style="float:left;margin-right:10px">
                            <span class="demonstration" style="font-size:14px;color:grey;">日期：</span>
                            <!-- <el-date-picker v-model="searchTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" :picker-options="pickerOptions" @change="getOrderList" placeholder="选择日期"></el-date-picker> -->
                            <el-date-picker v-model="searchTime" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd" :clearable="false" @change="page = 1;getOrderList()"></el-date-picker>
                        </div>
                        <div class="search_button" @click="page = 1;getOrderList()">查询</div>
                        <!-- <div class="search_button" style="background:#ccc;color:white" @click="search">重传</div> -->
                        <!-- <div class="search_button" style="background:#ccc;color:white" @click="search">上传</div> -->
                        <div class="search_button" style="color:white" @click="print">打印</div>
                    </el-header>
                    <el-main style="padding:10px;overflow-y:hidden">
                      <el-table :data="goodsInfo" border :header-cell-style="rowClass" style="width: 100%;height:40vh;overflow-y:scroll">
                        <el-table-column prop="rows" label="行号" width="50" type="index"></el-table-column>
                        <el-table-column prop="code" label="货号"></el-table-column>
                        <el-table-column prop="name" label="商品"></el-table-column>
                        <el-table-column prop="name" label="商品类型">
                            <template slot-scope="scope">
                                <div v-if="scope.row.type==1">普通商品</div>
                                <div v-else-if="scope.row.type==2">赠品</div>
                                <div v-else-if="scope.row.type==3" style="color:#E04C4C;">退货商品</div>
                                <div v-else-if="scope.row.type==4">折扣商品</div>
                                <div v-else-if="scope.row.type==5">促销优惠商品</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" label="数量" width="150"></el-table-column>
                        <el-table-column prop="price" label="售价" width="150"></el-table-column>
                        <el-table-column prop="total" label="小计" width="150"></el-table-column>
                      </el-table>
                      <el-table :data="payInfo" border :header-cell-style="rowClass" style="width: 100%;height:40vh;border-top:10px solid #e6edf5;overflow-y:scroll">
                        <el-table-column prop="rows" label="行号" width="50" type="index"></el-table-column>
                        <el-table-column prop="pay_type" label="付款方式" width="180"></el-table-column>
                        <el-table-column prop="pay" label="付款金额"></el-table-column>
                        <el-table-column prop="pay" label="折算金额"></el-table-column>
                      </el-table>
                    </el-main>
                </el-container>
            </el-main>
        </el-container>
    </div>
</template>
<style type="text/css">
    @import './../static/orderList.css'
</style>
<script type="text/ecmascript-6">
    import receiptModal from "./setUp/receiptModal"
    export default {
        components: {
            'receiptModal': receiptModal
        },
        data(){
            return {
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
                payInfo: [],
                goodsInfo:[],
                checked: false,
                value: '',
                sign_id:'',
                // isActive:-1, //改变左侧订单列表的样式
                searchGoods:'', //搜索订单的值
                searchTime:'',//查询时间范围
                limit:10,
                page:1,
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
                        weip:0,
                        card:0,
                        bankpay:0,
                        cashReturn:0,
                        weipReturn:0,
                        cardReturn:0,
                        bankpayReturn:0,
                        change:0,
                        totalNum:0,
                        goods:[],
                        wipeZeroMoney:0,
                        giveChangeMoney:0,
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
                },
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
            }
        },
        watch:{
            $route(to,from){
                console.log(to.path);
                if(to.path == '/offlineOrder'){
                    // this.$refs.receiptModal.initSetup();
                    this.initComp()
                }
            },
        },
        mounted:function(){
            this.initComp();
        },
        methods:{
            initComp(){
                this.$store.commit('loading',{obj:this,type:false});
                const today = new Date();
                let initTime = [new Date(today.getTime() - 3600 * 1000 * 24 * 7),today]
                this.searchTime = initTime;
                this.page = 1;
                this.searchGoods = null;
                this.getOrderList();
                this.$refs.receiptModal.getConfig();//获取最新的小票配置
            },
            // 切换页号
            changePage(changeType){
                let curPage = this.page;
                let param = {}
                if(changeType == '+'){
                    if(this.orderList.length<this.limit)return '';
                    this.page = parseInt(curPage)+1
                }else if(changeType == '-'){
                    if(curPage==1)return '';
                    this.page = parseInt(curPage)-1
                }
                this.getOrderList();
            },
            print(){
                this.$refs.receiptModal.print();
            },
            //查询订单详情
            getOrderDetails(val){
                this.printData.orderData = {//打印订单信息
                    orderId:null,
                    order_over_time:null,
                    receivable:null,
                    cash:0,
                    weip:0,
                    card:0,
                    bankpay:0,
                    cashReturn:0,
                    weipReturn:0,
                    cardReturn:0,
                    bankpayReturn:0,
                    change:0,
                    totalNum:0,
                    goods:[]
                };
                this.printData.userData = {//打印会员信息
                    sh_name:null,
                    sh_mobile:null,
                    sh_address:null,
                    name:null,
                    province_name:null,
                    city_name:null,
                    mobile:null
                }
                if(!val)return '';
                this.$refs.searchInput.focus();
                let info_datas = {
                    user_token:this.$store.state.loginData.user_token,
                    access_token: this.$store.state.loginData.access_token,
                    action:'mdordergoodsDetail',
                    id:val.id
                } 
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, info_datas).then((res) => {
                    this.printData.orderData.orderId = val.sn;
                    this.printData.orderData.order_over_time = val.create_time||null;
                    this.printData.orderData.total = val.haspay||null;
                    this.printData.orderData.user_money = res.data.data.customer_info?res.data.data.customer_info.user_money:null;
                    if(res.data.data.goods){
                        this.goodsInfo=res.data.data.goods
                        // 小票订单信息
                        for(let i = 0;i<res.data.data.goods.length;i++){
                            res.data.data.goods[i].saleprice = res.data.data.goods[i].price;//供小票用
                        }
                        this.$set(this.printData.orderData,'goods',res.data.data.goods);
                        let totalNum = 0;
                        for(let i=0;i<res.data.data.goods.length;i++){
                            if(res.data.data.goods[i].sorting_num == 1){
                                totalNum++;
                            }else{
                                // totalNum += parseFloat(cartList[i].num);
                                totalNum = parseFloat(totalNum.toFixed(2)) + parseFloat(res.data.data.goods[i].num);
                            }
                        }
                        this.printData.orderData.totalNum = totalNum;
                    }
                    if(res.data.data.payInfo){
                        this.payInfo=res.data.data.payInfo;
                    }
                    if(res.data.data.payInfo && res.data.data.payInfo.length>0){
                        // 小票订单信息
                        this.printData.orderData.total = res.data.data.payInfo[0].total;
                        this.printData.orderData.receivable = res.data.data.payInfo[0].total;
                        this.printData.orderData.cash = 0;
                        this.printData.orderData.card = 0;
                        this.printData.orderData.zfbao = 0;
                        this.printData.orderData.weip = 0;
                        for(let i=0;i<res.data.data.payInfo.length;i++){
                            if(res.data.data.payInfo[i].pay_type == '现金'){
                                if(parseFloat(res.data.data.payInfo[i].pay)>0){
                                    this.printData.orderData.cash = res.data.data.payInfo[i].pay;
                                }else{
                                    this.printData.orderData.cashReturn = 0-parseFloat(res.data.data.payInfo[i].pay);
                                }
                            }
                            if(res.data.data.payInfo[i].pay_type == '会员卡'){
                                if(parseFloat(res.data.data.payInfo[i].pay)>0){
                                    this.printData.orderData.card = res.data.data.payInfo[i].pay;
                                }else{
                                    this.printData.orderData.cardReturn = 0-parseFloat(res.data.data.payInfo[i].pay);
                                }
                            }
                            if(res.data.data.payInfo[i].pay_type == '家庭卡付款'){
                                if(parseFloat(res.data.data.payInfo[i].pay)>0){
                                    this.printData.orderData.familyCard = res.data.data.payInfo[i].pay;
                                }else{
                                    this.printData.orderData.familyReturn = 0-parseFloat(res.data.data.payInfo[i].pay);
                                }
                            }
                            if(res.data.data.payInfo[i].pay_type == '支付宝'){
                                if(parseFloat(res.data.data.payInfo[i].pay)>0){
                                    this.printData.orderData.zfbao = res.data.data.payInfo[i].pay;
                                }else{
                                    this.printData.orderData.zfbaoReturn = 0-parseFloat(res.data.data.payInfo[i].pay);
                                }
                            }
                            if(res.data.data.payInfo[i].pay_type == '微信'){
                                if(parseFloat(res.data.data.payInfo[i].pay)>0){
                                    this.printData.orderData.weip = res.data.data.payInfo[i].pay;
                                }else{
                                    this.printData.orderData.weipReturn = 0-parseFloat(res.data.data.payInfo[i].pay);
                                }
                            }
                            if(res.data.data.payInfo[i].pay_type == '抹零'){
                                if(parseFloat(res.data.data.payInfo[i].pay)!=0){
                                    this.printData.orderData.wipeZeroMoney = res.data.data.payInfo[i].pay;
                                }
                            }
                            if(res.data.data.payInfo[i].pay_type == '找零'){
                                if(parseFloat(res.data.data.payInfo[i].pay)!=0){
                                    this.printData.orderData.giveChangeMoney = (res.data.data.payInfo[i].pay>0?res.data.data.payInfo[i].pay:(0-res.data.data.payInfo[i].pay).toFixed(2));
                                }
                            }
                            if(res.data.data.payInfo[i].pay_type == '农行聚合码'){
                                if(parseFloat(res.data.data.payInfo[i].pay)>0){
                                    this.printData.orderData.bankpay = res.data.data.payInfo[i].pay;
                                }else{
                                    this.printData.orderData.bankpayReturn = 0-parseFloat(res.data.data.payInfo[i].pay);
                                }
                            }
                        }
                    }
                    // 小票会员信息
                    this.printData.userData.sh_address = null;
                    this.printData.userData.name = res.data.data.customer_info?res.data.data.customer_info.name:null;
                    this.printData.userData.mobile = res.data.data.customer_info?res.data.data.customer_info.mobile:null;
                    this.printData.userData.province_name = null;
                    this.printData.userData.city_name = null;
                })
            },

            // 设置选中的行号
            setCurrent(row) {
                this.$refs.orderListTable.setCurrentRow(row);//row,数组的对应元素
            },
            //查询订单列表
            getOrderList(){
                let param = {
                    user_token:this.$store.state.loginData.user_token,
                    access_token: this.$store.state.loginData.access_token,
                    action:'mdorderList',
                    // create_time:this.searchTime,
                    words:this.searchGoods,
                    order_list_rows:this.limit,
                    order_page:this.page,
                }
                if(this.searchTime){
                    param.startTime = this.searchTime[0]
                    param.endTime = this.searchTime[1]
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                    console.log(res.data)
                    if(res.data.code == 1){
                        this.orderList=res.data.data
                        setTimeout(()=>{
                            this.setCurrent(this.orderList[0]);//默认选中第一个
                        },10)
                    }else{
                        this.orderList=[]
                        this.goodsInfo=[]
                        this.payInfo=[]
                    }
                })
            },
            formatTime(){
                let date = new Date();
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const day = date.getDate()
                const hour = date.getHours()
                const minute = date.getMinutes()
                const second = date.getSeconds()
                return `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`
                // return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
            },
            //修改表头的颜色
            rowClass({ row, rowIndex}) {
                return 'background:#f5f5f5'
            }
        }
    }
</script>