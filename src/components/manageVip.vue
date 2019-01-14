<template>
    <div class="pageBox">
        <rechargeComp ref="rechargeComp" :vipData='curVip' :payData='null' :refresh='searchVip' @rechargeSuccessBack='rechargeSuccessBack'></rechargeComp>
        <receiptModal ref="receiptModal" :printData="printData"></receiptModal>
        <el-container>
            <el-aside width="460px" style="background-color:#fff;margin-right:10px">
                <el-container>
                    <el-header>
                        <div style="background-color: #fff;padding: 0">
                            <el-input ref="searchInput" style="width: 290px;height: 36px;" type="password" v-model="userAccount" placeholder="会员卡号/小程序码/手机号" clearable class="input-with-select" @keyup.enter.native="searchVip">
                                <el-button @click="searchVip" style="" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                            <el-button style="margin:0;" type="primary" @click="editVip('add')">新增</el-button>
                            <el-button style="margin:0;" type="warning" @click="initComp">重置</el-button>
                        </div>
                    </el-header>
                    <el-main style="padding:10px;">
                        <div class="vipMsg" v-if="curVip">
                            <div class="vipCard">
                                <div class="card_title">
                                    <img class="vipIcon" src="./../assets/V.png">
                                    <div class="card_title_cont">
                                        <div style="margin-top:0px;">
                                            <p v-if="curVip.card_array" v-for="cardItem,index in curVip.card_array">
                                                卡 {{index+1}}：{{cardItem.card?cardItem.card.replace(/^(\d{2})\d{5}(\d+)/,"$1****$2"):'空'}}
                                                <span v-if="index==0" style="padding-left:20px;">类别：{{curVip.customer_type_name}}</span>
                                            </p>
                                            <p v-else><span v-if="index==0" style="padding-left:20px;">类别：{{curVip.customer_type_name}}</span></p>
                                        </div>
                                        <!-- <div>会员卡：{{curVip._customer_id}}</div> -->
                                    </div>
                                    <div style="padding: 10px 10px 10px 0;box-sizing: border-box;color: #fff;font-size: 14px;font-weight: bold;width: 100px;" v-if="curVip.is_family_card==1"><span style="display:inline-block;width:50px;background:#fff;color:#3B404C;text-align:center;border-radius:20px;margin-left:30px;">{{curVip.identity_type==1?'子卡':'父卡'}}</span></div>
                                </div>
                                <div class="card_msg">
                                    <div class="ellipsis" style="line-height:24px;">姓名：{{curVip.name}}</div>
                                    <div class="ellipsis" style="line-height:24px;">生日：{{!curVip.birthday?'--':curVip._birthday}}</div>
                                    <div class="ellipsis" style="line-height:24px;">手机号：{{curVip.mobile?curVip.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2"):'无'}}</div>
                                    <div class="ellipsis" style="line-height:24px;" v-if="curVip.sex">姓别：{{curVip.sex==1?'男':'女'}}</div>
                                </div>
                                <div class="card_point">
                                    <div class="card_point_left">
                                        <div class="point_val">{{curVip.user_money}}</div>
                                        <div class="point_label">储值金额</div>
                                    </div>
                                    <div class="card_point_right">
                                        <div class="point_val">{{curVip.pay_points}}</div>
                                        <div class="point_label">积分</div>
                                    </div>
                                </div>
                                <div class="card_nomore"><!-- 暂无更多 --></div>
                            </div>
                            <div class="vip_handleBox" v-if="!curVip.temporary_vip">
                                <el-button style="width:110px;" type="primary" @click="editVip('edit')" plain>编辑资料</el-button>
                                <el-button v-if="!curVip.openid" style="width:110px;" type="warning" @click="bangHandle('XCHX')" plain>绑小程序</el-button>
                                <el-button :disabled="curVip.card_array&&curVip.card_array.length>=3?true:false" style="width:110px;" type="danger" @click="bangHandle('KA')" plain>绑卡</el-button>
                                <el-button style="width:110px;" type="success" @click="rechargeVip" plain>充值</el-button>
                            </div>
                            <div class="vip_handleBox" v-else-if="curVip.customer_type==10">
                                <el-button style="width:160px;" type="primary" @click="editVip('regular')" plain>转为正式会员</el-button>
                            </div>
                        </div>
                    </el-main>
                    <el-footer style="padding:10px;">
                        
                    </el-footer>
                </el-container>
            </el-aside>
            <el-main style="padding:0;background-color:#fff;">
                <el-container style="background-color:#fff;">
                    <el-header>
                        <!-- <el-checkbox v-model="checked" style='line-height:40px;float:left;margin-right:10px'>联网查询</el-checkbox> -->
                        <div style="float:left;margin-right:10px">
                            <span class="demonstration" style="font-size:14px;color:grey;">日期：</span>
                            <!-- <el-date-picker v-model="searchTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" :picker-options="pickerOptions" @change="getDataList" placeholder="选择日期"></el-date-picker> -->
                            <el-date-picker style="width:240px;" v-model="form.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd" :disabled="curVip?false:true"></el-date-picker>
                        </div>
                        <el-input style="width:165px;" v-model="form.search" placeholder='请输入订单号/商品' clearable :disabled="curVip?false:true" @clear="callbackFunc(getDataList)" @keyup.enter.native="callbackFunc(getDataList)"></el-input>
                        <el-select v-model="checkValue" placeholder="请选择" :disabled="curVip?false:true" @change="callbackFunc(getDataList)">
                            <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-button @click="callbackFunc(getDataList)" type="primary" :disabled="curVip?false:true">查询</el-button>
                    </el-header>
                    <el-main style="padding:10px;overflow-y:hidden">
                        <el-table v-if="checkValue=='getcustomergoods'" key="getcustomergoods" :data="dataList" border :header-cell-style="rowClass" height="530" style="width: 100%;height:40vh;" :row-class-name="tableRowClassName">
                            <el-table-column prop="rows" label="行号" width="50" type="index"></el-table-column>
                            <el-table-column prop="sn" label="订单号" width="200"></el-table-column>
                            <el-table-column prop="bar_code" label="货号" width="120"></el-table-column>
                            <el-table-column prop="name" label="商品" width="180"></el-table-column>
                            <el-table-column prop="name" label="商品类型">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.type==1">普通商品</div>
                                    <div v-else-if="scope.row.type==2">赠品</div>
                                    <div v-else-if="scope.row.type==3" style="color:#E04C4C;font-weight:bold;">退货商品</div>
                                    <div v-else-if="scope.row.type==4">折扣商品</div>
                                    <div v-else-if="scope.row.type==5">促销优惠商品</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="num" label="数量" width="80"></el-table-column>
                            <el-table-column prop="price" label="售价" width="80"></el-table-column>
                            <el-table-column prop="total" label="小计" width="80"></el-table-column>
                        </el-table>
                        <el-table v-if="checkValue=='getcustomerpay'" key="getcustomerpay" :data="dataList" border :header-cell-style="rowClass" height="530" style="width: 100%;height:40vh;" :row-class-name="tableRowClassName">
                            <el-table-column prop="rows" label="行号" width="50" type="index"></el-table-column>
                            <el-table-column prop="sn" label="订单号"></el-table-column>
                            <el-table-column prop="num" label="流水类型" width="150">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.pay_refund==1">付款</div>
                                    <div v-else-if="scope.row.pay_refund==2">退款</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="total" label="金额" width="150">
                                <template slot-scope="scope">
                                    <div :style="scope.row.pay_refund==2?'color:#E04C4C;':''" style="font-weight:bold;">{{scope.row.pay_refund==2?'-':''}}{{scope.row.total}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_time" label="时间"></el-table-column>
                        </el-table>
                        <el-table v-if="checkValue=='getcustomerup'" key="getcustomerup" :data="dataList" border :header-cell-style="rowClass" height="530" style="width: 100%;height:40vh;" :row-class-name="tableRowClassName">
                            <el-table-column prop="rows" label="行号" width="50" type="index"></el-table-column>
                            <el-table-column prop="sn" label="订单号"></el-table-column>
                            <el-table-column prop="num" label="类型" width="150">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.type==1">账户充值</div>
                                    <div v-else-if="scope.row.type==2">充值赠送</div>
                                    <div v-else-if="scope.row.type==3">订单消费</div>
                                    <div v-else-if="scope.row.type==4">消费积分</div>
                                    <div v-else-if="scope.row.type==5">活动积分</div>
                                    <div v-else-if="scope.row.type==6">积分兑换</div>
                                    <div v-else-if="scope.row.type==7">金额退款</div>
                                    <div v-else-if="scope.row.type==8">预售订单</div>
                                    <div v-else-if="scope.row.type==9">买单充值</div>
                                    <div v-else-if="scope.row.type==10">买单充值退款</div>
                                    <div v-else-if="scope.row.type==11">会员卡绑定</div>
                                    <div v-else-if="scope.row.type==12">补差额充值</div>
                                    <div v-else-if="scope.row.type==13">充值</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="user_change" label="金额" width="150">
                                <template slot-scope="scope">
                                    <div :style="scope.row.type==3 || scope.row.type==8?'color:#E04C4C;':''" style="font-weight:bold;">{{scope.row.type==3 || scope.row.type==8?'-':''}}{{scope.row.user_change}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="user_money" label="会员余额" width="150"></el-table-column>
                            <el-table-column prop="change_time" label="时间"></el-table-column>
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
        <el-dialog :title="editVipText" :visible.sync="editVipStatus" width="600px" :close-on-click-modal="false">
            <div class="vipAdd" v-if="editVipData">
                <el-form status-icon :model="editVipData" :rules="rules" ref="editVipData">
                    <div class="vipForm">
                        <div class="vip_input_item non_empty" v-if="editVipStatus=='add'||editVipStatus=='sync'||editVipStatus=='regular'||editVipStatus=='activation'">
                            <el-form-item label="卡号" prop="customer_card">
                                <el-input ref='cardInput' :disabled="curVip&&curVip.customer_card||editVipStatus=='sync'||editVipStatus=='activation'?true:false" placeholder="请输入任意数字" v-model="editVipData.customer_card"></el-input>
                            </el-form-item>
                        </div>
                        <div class="vip_input_item non_empty">
                            <el-form-item label="会员类型" prop="customer_type">
                                <el-select v-model="editVipData.customer_type" placeholder="请选择" value-key="id">
                                    <el-option v-for="item in vipType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="vip_input_item non_empty">
                            <el-form-item label="姓名" prop="name">
                                <el-input placeholder="请输入任意数字" v-model="editVipData.name"></el-input>
                            </el-form-item>
                        </div>
                        <div class="vip_input_item non_empty">
                            <el-form-item label="手机号" prop="mobile">
                                <el-input :disabled="((editVipStatus=='edit'||editVipStatus=='regular')&&curVip.mobile||editVipStatus=='sync'&&syncSXVip.mobile)?true:false" placeholder="请输入任意数字" v-model="editVipData.mobile"></el-input>
                            </el-form-item>
                        </div>
                        <div class="vip_input_item non_empty">
                            <el-form-item label="性别" prop="sex">
                                <el-radio v-model="editVipData.sex" :label="1">男</el-radio>
                                <el-radio v-model="editVipData.sex" :label="2">女</el-radio>
                            </el-form-item>
                        </div>
                        <!-- <div class="vip_input_item">
                            <el-form-item label="生日">
                                <el-date-picker v-model="editVipData.birthday" type="date" placeholder="选择日期" value-format="timestamp" format="yyyy 年 MM 月 dd 日"></el-date-picker>
                            </el-form-item>
                        </div> -->
                        <div class="vip_input_item" v-if="editVipStatus!='sync'">
                            <el-form-item label="年龄段" prop="ageStep">
                                <el-select v-model="editVipData.family_age_group" placeholder="请选择">
                                    <el-option value-key="id" v-for="item in ageStepOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="vip_input_item" v-if="editVipStatus!='sync'">
                            <el-form-item label="社区住址" prop="community">
                                <!-- <el-date-picker v-model="editVipData.birthday" type="date" placeholder="选择日期" value-format="timestamp" format="yyyy 年 MM 月 dd 日"></el-date-picker> -->
                                <!-- <communityComp ref="communityComp" @getcomData="getcomData" :communityData="communityData" :communityOption="communityOption"></communityComp> -->
                                <el-cascader @change="getcomData" v-model="editVipData.user_house_array" value="id" :options="communityOption" @active-item-change="initHouseList" :props="communityProps"></el-cascader>
                                <!-- <el-button>重试</el-button> -->
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="editVipStatus = false">取 消</el-button>
                <el-button type="primary" @click="saveVip('editVipData')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="syncSXVipStatus" width="30%">
            <span v-if="syncSXVip">{{syncSXVip.msg}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="syncSXVipStatus=false;">取 消</el-button>
                <el-button type="primary" @click="syncSXVipStatus=false;editVip('sync')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="绑卡" :visible.sync="bangKA" width="360px">
            <div class="vip_input_item">
                <el-input ref="bangInput" placeholder="请输入卡号" v-model="bang_card" @keyup.enter.native="bangbangbang('KA')"></el-input>
                <p style="font-size:12px;color:#999;line-height:30px;">*每个会员最多可以绑定三张卡，绑定后不可修改</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bangKA=false;">取 消</el-button>
                <el-button type="primary" @click="bangKA=false;bangbangbang('KA')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="绑定小程序" :visible.sync="bangXCHX" width="360px">
            <div class="vip_input_item">
                <el-input ref="bangInput" placeholder="请输入小程序码" v-model="bang_card" @keyup.enter.native="bangbangbang('XCHX')"></el-input>
                <p style="font-size:12px;color:#999;line-height:30px;">*小程序只可以绑定一次，绑定后不可修改</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bangXCHX=false;">取 消</el-button>
                <el-button type="primary" @click="bangXCHX=false;bangbangbang('XCHX')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style type="text/css">
    @import './../static/manageVip.css'
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
    import communityComp from "./comp/communityComp"
    import rechargeComp from "./vip/recharge"
    export default {
        name:'shopCart',
        components: {
            'rechargeComp': rechargeComp,
            'communityComp': communityComp,
            'receiptModal': receiptModal
        },
        data(){
            var val_name = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入姓名'));
                } else {
                    var r = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
                    if(!r.test(value)){
                        callback(new Error("姓名只可输入中英文和'_'"));
                    }else{
                        callback();
                    }
                }
            };
            var val_mobile = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入手机号'));
                } else if (isNaN(value)) {
                    callback(new Error('手机号必须为数字'));
                } else if ((value).toString().length!=11) {
                    callback(new Error('手机号必须为11位'));
                } else {
                    callback();
                }
            };
            var val_customer_card = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入卡号'));
                } else if (isNaN(value)) {
                    callback(new Error('卡号必须为数字'));
                // } else if ((value).toString().length!=12) {
                //     callback(new Error('请输入12位卡号'));
                } else {
                    callback();
                }
            };
            return {

                bang_card:null,
                bangXCHX:false,
                bangKA:false,
                syncSXVip:null,
                searchOptions:[
                    {value: 'getcustomergoods',label: '购买商品'},
                    {value: 'getcustomerpay',label: '会员流水'},
                    {value: 'getcustomerup',label: '账单'},
                ],
                syncSXVipStatus:false,//是否要同步思迅数据的模态框
                checkValue:'getcustomerup',
                editVipStatus:false,//修改会员状态
                editVipText:null,
                vipType:null,//会员类型，编辑用
                userAccount:'',
                curVip:'',//当前会员信息
                editVipData:{//编辑会员信息（备用数据）
                    name: '',
                    customer_id: '',
                    customer_card: '',
                    customer_type: '',
                    mobile: '',
                    sex: '',
                    birthday: '',
                    house_household_id:'',
                    ageStep:''
                },
                // 会员编辑，社区数据
                communityData:null,
                communityOption:[],
                communityProps: {
                  value: 'id',
                  label:'name',
                  children: 'child'
                },
                ageStepOptions:[],
                rules: {//required必填
                    name: [
                        { required: true,validator: val_name, trigger: 'blur'}
                    ],
                    customer_card: [
                        { required: true,validator: val_customer_card, trigger: 'blur'}
                    ],
                    customer_type: [
                        { required: true, message: '请选择会员类型', trigger: 'change' }
                    ],
                    mobile: [
                        { required: true,validator: val_mobile, trigger: 'blur'}
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    birthday: [
                        { required: false, message: '请填写活动形式', trigger: 'blur' }
                    ],
                    community: [
                        { required: false, message: '请选择社区地址', trigger: 'blur' }
                    ],
                    ageStep: [
                        { required: false, message: '请选择年龄段', trigger: 'blur' }
                    ]
                },
                dataList:[],//购买商品
                statementsList:[],//消费流水
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
            'communityData':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    // debugger
                },
                deep: true    //深度监听
            },
            'communityOption':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    // debugger
                    console.log(newValue)
                },
                deep: true    //深度监听
            },
            'curVip':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    this.callbackFunc(this.getDataList);
                },
                deep: true    //深度监听
            },
            'form.time':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    this.form.page = 1;
                    this.getDataList();
                },
                deep: true    //深度监听
            },
            $route(to,from){
                console.log(to.path);
                if(to.path == '/manageVip'){
                    this.userAccount = null;
                    this.initComp();
                }
            },
            editVipStatus(val){
                if(!val){
                    setTimeout(()=>{
                        this.$refs.searchInput.focus();
                    },100)
                }else if(val=='add'){
                    setTimeout(()=>{
                        this.$refs.cardInput.focus()
                    },100)
                }
            }
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
                if(this.checkValue == 'getcustomerup'){
                    if (row.type == 3 || row.type == 8) {
                        return 'warning-row';
                    } else {
                        return 'success-row';
                    }
                }else if(this.checkValue == 'getcustomerpay'){
                    if(row.pay_refund==2) {
                        return 'warning-row';
                    } else {
                        return 'success-row';
                    }
                }else if(this.checkValue == 'getcustomergoods'){
                    if(row.type==3) {
                        return 'warning-row';
                    } else {
                        return 'success-row';
                    }
                }
                return '';
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
                this.getDataList();
            },
            // 初始化组件
            initComp(){
                this.curVip = null;
                this.editVipData = {
                    name: '',
                    customer_id: '',
                    customer_card: '',
                    customer_type: '',
                    mobile: '',
                    sex: '',
                    birthday: '',
                    house_household_id:''
                };
                this.communityData = null;
                this.getVipType()
                // 重置默认筛选时间
                const today = new Date();
                let initTime = [this.formatTime(new Date(today.getTime() - 3600 * 1000 * 24 * 7)),this.formatTime(today)]
                this.form.time = initTime;
                this.form.page = 1;
                this.dataList = null;
                this.statementsList = null;
                setTimeout(()=>{this.$refs.searchInput.focus();},50)
                this.$store.commit('loading',{obj:this,type:false});
                this.$refs.receiptModal.getConfig();//获取最新的小票配置
            },
            getDataList(){
                if(!this.curVip)return '';
                let loginData = this.$store.state.loginData;
                let param = {
                    action:this.checkValue,
                    access_token:loginData.access_token,//loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                    customer_id:this.curVip.id
                }
                if(this.form.time){
                    param.start_time = this.form.time[0]
                    param.end_time = this.form.time[1]
                    param.customer_list_rows = this.form.limit;
                    param.customer_page = this.form.page;
                    param.search = this.form.search
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data.code==1){
                        this.dataList = res.data.data;
                    }else{
                        this.showMsg('查询信息失败')
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            editVip(_type,_param){
                this.editVipStatus = _type;
                if(_type=='add'){
                    this.initComp()
                    this.syncSXVip = null;
                    this.editVipText = '新增会员';
                }else if(_type=='edit'){
                    this.syncSXVip = null;
                    this.editVipData = JSON.parse(JSON.stringify(this.curVip));
                    this.editVipText = '编辑会员';
                }else if(_type=='sync'){
                    this.editVipText = '同步会员';
                    this.editVipData.customer_card = this.syncSXVip.card;
                    this.editVipData.customer_type = this.syncSXVip.customer_type;
                    this.editVipData.name = this.syncSXVip.name;
                    this.editVipData.mobile = this.syncSXVip.phone;
                    this.editVipData.sex = this.syncSXVip.sex;
                    this.editVipData.birthday = this.syncSXVip.birthday*1000;
                    // if(this.syncSXVip.house_household_id){
                    //     this.editVipData.house_household_id = this.syncSXVip.house_household_id;
                    // }
                    // if(this.syncSXVip.family_age_group){
                    //     this.editVipData.family_age_group = this.syncSXVip.family_age_group;
                    // }
                }else if(_type=='regular'){
                    this.editVipText = '转为正式会员';
                    this.editVipData = JSON.parse(JSON.stringify(this.curVip));
                }else if(_type=='activation'){
                    this.initComp();
                    this.syncSXVip = null;
                    this.editVipData.customer_card = _param
                    this.editVipText = '会员激活';
                }
                if(!this.communityOption || this.communityOption.length<=0){
                    this.initHouseList()
                }
                this.getAgeStep();
            },
            editCommunity(idArr,_indexArr,data){
                let indexArr = _indexArr||[];
                for(let i = 0;i<this.communityOption.length;i++){
                    if(this.communityOption[i].id == idArr[0]){
                        if(idArr.length==1){ console.log(i); this.$set(this.communityOption[i],'child',data); }
                        else{
                            for(let j = 0;j<this.communityOption[i].child.length;j++){
                                if(this.communityOption[i].child[j].id == idArr[1]){
                                    if(idArr.length==2){ console.log(j); this.$set(this.communityOption[i].child[j],'child',data); }
                                    else{
                                        for(let k = 0;k<this.communityOption[i].child[j].child.length;k++){
                                            if(this.communityOption[i].child[j].child[k].id == idArr[2]){
                                                if(idArr.length==3){ console.log(k); this.$set(this.communityOption[i].child[j].child[k],'child',data); }
                                                else{
                                                    for(let m = 0;m<this.communityOption[i].child[j].child[k].child.length;m++){
                                                        if(this.communityOption[i].child[j].child[k].child[m].id == idArr[3]){
                                                            if(idArr.length==4){ console.log(m); this.$set(this.communityOption[i].child[j].child[k].child[m],'child',data); }
                                                            else{
                                                                
                                                            }
                                                        break;
                                                        }
                                                    }
                                                }
                                            break;
                                            }
                                        }
                                    }
                                break;
                                }
                            }
                        }
                        break;
                    }
                }
            },
            // 获取社区列表
            initHouseList(idArr){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'gethouseList',
                    access_token:loginData.access_token,//loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                    type:idArr?idArr.length:0,
                    code:idArr?idArr[idArr.length-1]:loginData.store_id
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                // debugger
                    console.log(res.data.data)
                    if(res.data.code==1){
                        let data = res.data.data;
                        if(!idArr || idArr.length<4){
                            for(let i=0;i<data.length;i++){
                                data[i]['child'] = [];
                            }
                        }
                        console.log(idArr)
                        if(idArr){
                            this.editCommunity(idArr,null,data);//已存在的id，已选中的索引，后台获取的数据
                        }else{
                            this.communityOption = data;
                        }
                    }else{
                        this.showMsg('查询信息失败')
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            getAgeStep(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'getagedistance',
                    access_token:loginData.access_token,//loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data.code==1){
                        this.ageStepOptions = res.data.data;

                    }else{
                        this.showMsg('查询信息失败')
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 获取选择的社区信息
            getcomData(val){
                this.editVipData.house_household_id = val[4];
            },
            // 保存会员信息/保存新增会员
            saveVip(formName){
                let i = 0;
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        this.$message.error(`信息输入不全或格式有误`)
                        i=1;
                        return '';
                    }
                });
                if(i)return '';
                let editVipData = this.editVipData;
                let loginData = this.$store.state.loginData;
                let param = {
                    access_token:loginData.access_token,//loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                    id: editVipData.id,
                    customer_type: editVipData.customer_type,
                    mobile: editVipData.mobile,
                    sex: editVipData.sex,
                    name: editVipData.name,
                }
                if(editVipData.password)param.password = editVipData.password;
                if(editVipData.birthday)param.birthday = this.timestampToTime(editVipData.birthday);
                if(this.editVipStatus=='edit'){
                    param.action = 'edit';
                }else if(this.editVipStatus=='add'){
                    param.action = 'add';
                    param.customer_card = editVipData.customer_card;
                }else if(this.editVipStatus=='sync'){
                    param.action = 'updateoldvipInfo';
                    param.customer_card = editVipData.customer_card;
                }else if(this.editVipStatus=='regular'){
                    param.action = 'edit';
                    param.customer_card = editVipData.customer_card;
                }else if(this.editVipStatus=='activation'){
                    param.action = 'activationCard';
                    param.customer_card = editVipData.customer_card;
                }
                if(this.editVipStatus=='edit' || this.editVipStatus=='add' || this.editVipStatus=='regular' || this.editVipStatus=='activation'){
                    if(editVipData.family_age_group)param.family_age_group = editVipData.family_age_group;
                    if(editVipData.house_household_id){
                        param.house_household_id = editVipData.house_household_id;
                    }
                }
                // debugger
                // console.log(this.communityData,this.communityOption)
                // if(!this.curVip || !this.curVip.customer_card) param.customer_card = editVipData.customer_card;
                this.$store.commit('loading',{obj:this,type:true});
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    this.$store.commit('loading',{obj:this,type:false});
                    console.log(res.data.data)
                    if(res.data.code == '1'){
                        this.editVipStatus = false;

                        let curVip = res.data.data;
                        if(curVip.frozen_money){
                            curVip.birthday = curVip.birthday*1000;
                            curVip._birthday = this.timestampToTime(curVip.birthday);
                            this.curVip = curVip;
                            this.editVipData = JSON.parse(JSON.stringify(curVip));
                            this.getDataList();
                        }
                    }else if(res.data.code == '1990005'){
                        this.userAccount = res.data.customer_card;
                        this.editVipStatus = false;
                        this.searchVip();
                    }else if(res.data.data){
                        this.$message.error(`${res.data.data[1]}`);
                    }else{
                        this.$message.error(`${res.data.msg}`);
                    }
                }, (res) => {
                    this.$store.commit('loading',{obj:this,type:false});
                    console.log(res)
                });
            },
            // 查询会员信息
            searchVip(){
                this.initComp();
                if(!this.userAccount ){ this.$message('请输入会员账号');this.initComp();return ''; }
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'info',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                    customer_info:this.userAccount,
                    tb:1
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    this.userAccount = null;
                    console.log(res.data.data)
                    if(res.data.code==1){
                        if(res.data.data.c_status){
                            this.syncSXVip = res.data.data;
                            this.syncSXVipStatus = true;
                        }else{
                            let curVip = res.data.data;//customer_id
                            // curVip._customer_id = curVip.customer_id.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
                            curVip.birthday = curVip.birthday*1000;
                            curVip._birthday = this.timestampToTime(curVip.birthday);
                            this.curVip = curVip;
                            this.editVipData = JSON.parse(JSON.stringify(curVip));
                            this.getDataList();
                        }
                        if(res.data.data.xq_qrray && res.data.data.build_array && res.data.data.unit_array && res.data.data.floor_array && res.data.data.house_code_array && res.data.data.user_house_array){
                            let user_house_array = res.data.data.user_house_array;
                            let xq_qrray = res.data.data.xq_qrray;
                            let build_array = res.data.data.build_array;
                            let unit_array = res.data.data.unit_array;
                            let floor_array = res.data.data.floor_array;
                            let house_code_array = res.data.data.house_code_array;
                            for(let i = 0;i<floor_array.length;i++){
                                floor_array[i].child = [];
                                if(user_house_array[3] == floor_array[i].id)floor_array[i].child = house_code_array;
                            }
                            for(let i = 0;i<unit_array.length;i++){
                                unit_array[i].child = [];
                                if(user_house_array[2] == unit_array[i].id)unit_array[i].child = floor_array;
                            }
                            for(let i = 0;i<build_array.length;i++){
                                build_array[i].child = [];
                                if(user_house_array[1] == build_array[i].id)build_array[i].child = unit_array;
                            }
                            for(let i = 0;i<xq_qrray.length;i++){
                                xq_qrray[i].child = [];
                                if(user_house_array[0] == xq_qrray[i].id)xq_qrray[i].child = build_array;
                            }
                            this.communityOption = JSON.parse(JSON.stringify(xq_qrray));
                        }
                    }else{
                        let handle = [],callback = null;
                        if(res.data.code == '1990042'){
                            callback = this.editVip.bind(this,'activation',param.customer_info);
                            handle = ['激活','暂不激活'];
                        }
                        this.showModal(res.data.msg,null,handle,callback)
                    }
                }, (res) => {
                    this.userAccount = null;
                    console.log(res)
                });
            },
            bangHandle(_type){
                if(_type=='KA'){
                    this.bangXCHX=false;
                    this.bangKA=true;
                }else if(_type=='XCHX'){
                    this.bangKA=false;
                    this.bangXCHX=true;
                }
                this.bang_card=null;
                setTimeout(()=>{
                    this.$refs.bangInput.focus()
                },100)
            },
            // 绑卡 绑小程序
            bangbangbang(_type){
                if(!this.bang_card){
                    this.showMsg('请输入绑定信息')
                }
                let loginData = this.$store.state.loginData;
                let param = {
                    access_token:loginData.access_token,//loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                }
                if(_type=='KA'){
                    param.action = 'bangcard';
                    param.customer_card = this.bang_card;
                    param.id = this.curVip.id;
                }else if(_type=='XCHX'){
                    param.old_id = this.curVip.id;
                    param.pay_code = this.bang_card;
                    param.action = 'bangApplets';
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    if(res.data.code==1){
                        let curVip = res.data.data;//customer_id
                        // curVip._customer_id = curVip.customer_id.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
                        curVip.birthday = curVip.birthday*1000;
                        curVip._birthday = this.timestampToTime(curVip.birthday);
                        this.curVip = curVip;
                        this.editVipData = JSON.parse(JSON.stringify(curVip));
                        this.getDataList();
                        this.bangKA = false
                        this.bangXCHX = false;
                        if(_type='KA') this.confirm('绑卡成功！')
                        else if(_type='XCHX') this.confirm('小程序绑定成功！')
                    }else{
                        this.showMsg(res.data.msg,'error')
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 获取会员分类列表
            getVipType(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'customertype',
                    access_token:loginData.access_token,//loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data){
                        this.vipType = res.data.data.data;
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 充值
            rechargeVip(){
                if(this.curVip){
                    let curVip = this.curVip;
                    this.$refs.rechargeComp.rechargeVip(curVip);
                }else{
                    this.showMsg('请先登录会员')
                }
            },
            // 充值成功回调
            rechargeSuccessBack(res){
                /*if(res.pay_type==3) this.printData.rechargeData.type = '现金';
                else if(res.pay_type==2) this.printData.rechargeData.type = '现金';
                else if(res.pay_type==1) this.printData.rechargeData.type = '支付宝';
                this.printData.rechargeData.pay_time = res.pay_time;
                this.printData.rechargeData.money = res.money;
                this.printData.rechargeData.give = res.give;
                this.printData.rechargeData.sn = res.sn;
                this.printData.rechargeData.user_money = res.user_money;
                this.printData.rechargeData.store_phone = this.$store.state.loginData.store_phone;
                this.printData.rechargeData.store_name = this.$store.state.loginData.store_name;
                this.printData.rechargeData.realname = this.$store.state.loginData.realname;
                this.printData.rechargeData.vipName = this.curVip.name;
                this.$refs.receiptModal.print();*/
            },
            showModal(_cont,title,handle,_callback){
                let cont = _cont;
                cont = cont.replace(/企业贵宾卡/g,"<span style='color:#B76610;font-weight:bold;'> 企业贵宾卡 </span>");
                let param = {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定'
                }
                if(handle[0]) param.confirmButtonText = handle[0];
                if(handle[1]) param.cancelButtonText = handle[1];
                this.$confirm(cont, title||'提示', param).then(() => {
                    if(_callback)_callback()
                }).catch(() => {
                    return '';
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
            // 弹出模态框
            confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
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