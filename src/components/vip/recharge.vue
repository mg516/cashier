<template>
	<div>
        <checkPowerComp ref="checkPowerComp" :checkInfo="checkInfo" v-on:successBack="successBack" v-on:failBack="failBack"></checkPowerComp>
        <receiptModal ref="receiptModal" :printData="printData"></receiptModal>
		<el-dialog title="会员充值-付款" :visible.sync="dialogRecharge" width="580px" append-to-body @before-close="dialogRecharge=false">
	        <div v-if="vipData">
	            <div class="vipData">
	                <!-- <div>会员卡号：{{vipData.customer_card.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</div> --><div>姓名：{{vipData.name}}</div>
	                <div>手机：{{vipData.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</div><div>余额：{{vipData.user_money}}</div>
	            </div>
	            <div class="moneyinput" style="margin-bottom: 20px;">
	                <span>充：<inputComp :inputCompSize="rechargeData.compSize" :inputCompValue="rechargeData.rechargeMoney"></inputComp></span>
	                <span style="margin-left:20px;">送：<el-input style="width:200px;" disabled v-model="rechargeData.giveMoney"></el-input></span>
	            </div>
                <div class="payStepLine">
                    <el-button style="margin-bottom:10px;" v-if="rechargeStep" v-for="stepItem in rechargeStep" :type="stepItem.name!='补差额'?'danger':'warning'" @click="clickMoney(stepItem.money,stepItem.difference)">{{stepItem.difference?'补差额：':''}}{{stepItem.money}}元</el-button>
                </div>
                <div class="payTypeLine">
                    <el-button type="primary" plain v-for="payItem in payType" :disabled="ifDiffStatus&&payItem.payCode=='cash'?true:false" @click="chooseRechargeType(payItem.payCode)">{{payItem.name}}</el-button>
                </div>
	        </div>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="primary" plain @click="dialogRecharge=false">取 消</el-button>
	        </span>
	        <!-- 支付窗口 putUpOrder触发-->
	        <el-dialog :title="rechargeData.dialogPayMode.payTypeName" :visible.sync="rechargeData.dialogPayMode.ifShow" width="580px" append-to-body>
	            <div v-if="rechargeData.dialogPayMode.code=='cash'" style="text-align:center;">
	                <div class="demo-input-suffix" style="margin-bottom: 20px;">
	                    应付金额：<inputComp :inputCompSize="inputCompSize" :inputCompValue="inputShouldPay1"></inputComp>
	                </div>
	            </div>
	            <div v-else-if="rechargeData.dialogPayMode.code=='zfb'||rechargeData.dialogPayMode.code=='wx'" style="text-align:center;">
	                <div class="demo-input-suffix" style="margin-bottom: 20px;">
	                    应付金额：<inputComp :inputCompSize="inputCompSize" :inputCompValue="inputShouldPay1"></inputComp>
	                </div>
	                <div class="demo-input-suffix">
	                    支付条码：<inputComp :inputCompSize="inputCompSize" :inputCompValue="inputCode" v-on:keyEnter="rechargeFunc"></inputComp>
	                </div>
	            </div>
	            <span slot="footer" class="dialog-footer">
	                <el-button type="primary" @click="rechargeFunc">确 定</el-button>
	            </span>
	        </el-dialog>
	    </el-dialog>
	</div>
</template>
<script type="text/javascript">
	import inputcomp from "../comp/inputComp"
    import checkPowerComp from "../Comp/checkPower"
    import receiptModal from "../setUp/receiptModal"
	export default{
		name:'rechargeComp',
        props:["vipData","payData"],//是否显示(1显示),订单信息,配置信息,会员信息
        components: {
            'inputComp': inputcomp,
            'checkPowerComp': checkPowerComp,
            'receiptModal': receiptModal
        },
        data(){
            return{
                ifDiffStatus:false,//是否是补差额充值
                checkInfo:{
                    rule_id:12,//3整单打折，2单品打折
                    ifAsk:true,//弹出登录出口前是否询问
                    msg:'会员充值',
                },
                rechargeStep:null,
            	// 支付方式列表
                payType:[
                    {name:'现金',icon:'/src/assets/paytype_chuxuka.png',payCode:'cash'},
                    {name:'支付宝',icon:'/src/assets/paytype_zhifubao.png',payCode:'zfb'},
                    {name:'微信支付',icon:'/src/assets/paytype_weixin.png',payCode:'wx'}
                ],
            	rechargeData:{
                    compSize:{
                        width:'240',
                        height:'40'
                    },
                    rechargeMoney:{// 充值
                        type:'rechargeMoney',//输入框值类型，用于对应返回值（针对页面引入多次该组件的情况.必填）
                        status:false,//是否可编辑
                        value:null, //模态框里的金额
                        focus:false,
                    },
                    giveMoney:null,// 赠送金额
                    //不同支付方式弹窗
                    dialogPayMode:{
                        ifShow:false,
                        code:null,
                        payTypeName:''
                    },
                },
                dialogRecharge:false,//隐藏充值模态框
	            inputCompSize:{//input模板数据
	                width:'300',
	                height:'40'
	            },
	            // 待收金额（不可编辑）
	            inputShouldPay1:{type:'inputShouldPay1',status:false,value:null},
	            // 付款金额（可以编辑）
	            inputCode:{type:'inputCode',status:true,value:null,focus:false},
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
        	dialogRecharge:function(val){
                this.rechargeData.rechargeMoney.value = null;
        		this.rechargeData.rechargeMoney.focus = val;//充值金额获取焦点
        		this.rechargeData.giveMoney = null;
                if(val){
                    let loginData = this.$store.state.loginData;
                    let param = {
                        access_token:loginData.access_token,//loginData.access_token,
                        user_token:loginData.user_token,//loginData.access_token,
                    }
                    this.$http.post(`${this.$store.state.host}${this.$store.state.config.rechargeMoney}`, param).then((res) => {
                        console.log(res.data.data)
                        if(res.data&&res.data.data){
                            let rechargeStep = res.data.data;
                            if(this.payData && parseFloat(this.payData.shouldPay)>parseFloat(this.vipData.user_money)){
                                rechargeStep.push({name:'补差额',money:(this.payData.shouldPay-this.vipData.user_money).toFixed(2),give:'0.00',difference:true})
                            }
                            this.rechargeStep = rechargeStep;
                        }
                    }, (res) => {
                        console.log(res)
                    });
                    /*let rechargeStep = [
                        {name:'100元',value:'100'},
                        {name:'200元',value:'200'},
                        {name:'300元',value:'300'},
                        {name:'500元',value:'500'},
                        {name:'1000元',value:'1000'},
                    ]*/
                    // this.rechargeStep = rechargeStep;
                }
        	},
        	/*'rechargeData.rechargeMoney.value': function(val,oldval){
        		if(!val)return '';
                let curVip = this.curVip;
                let loginData = this.$store.state.loginData;
                let param = {
                    access_token:loginData.access_token,//loginData.access_token,
                    // access_token:'5b7f60aca7e7f6f8c680b1b219ad3ec6',//loginData.access_token,
                    money:val
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vipGive}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data&&res.data.data){
                        this.rechargeData.giveMoney = res.data.data.give;
                    }
                }, (res) => {
                    console.log(res)
                });
            },*/
        },
		methods:{
            // 权限校验成功回调
            successBack(res){
                if(res.data.data.discountPower==1){
                    this.dialogRecharge = true;
                }
            },
            // 权限校验失败回调
            failBack(res){
                this.confirm(res.data.data.message)
                // this.confirm('权限口令错误')
            },
            // 充值
            rechargeVip(_vipData){
                this.vipData = _vipData;
                this.$refs.checkPowerComp.ifHasPower();
            },
            hideRecharge(){
            	this.dialogRecharge = false;	
            },
            clickMoney(money,ifDiff){
                this.rechargeData.rechargeMoney.value = money;
                if(!ifDiff){
                    this.ifDiffStatus = false;
                    let curVip = this.curVip;
                    let loginData = this.$store.state.loginData;
                    let param = {
                        access_token:loginData.access_token,//loginData.access_token,
                        // access_token:'5b7f60aca7e7f6f8c680b1b219ad3ec6',//loginData.access_token,
                        money:money
                    }
                    this.$http.post(`${this.$store.state.host}${this.$store.state.config.vipGive}`, param).then((res) => {
                        console.log(res.data.data)
                        if(res.data&&res.data.data){
                            this.rechargeData.giveMoney = res.data.data.give;
                        }
                    }, (res) => {
                        console.log(res)
                    });
                }else{
                    this.ifDiffStatus = true;
                    this.rechargeData.giveMoney = '0.00'
                }
            },
            // 选择会员充值支付方式
            chooseRechargeType(_type){
            	if(!this.rechargeData.rechargeMoney.value || this.rechargeData.rechargeMoney.value<=0){
            		this.showMsg('请输入充值金额','error')
            		return '';
            	}
                this.rechargeData.dialogPayMode.ifShow = true;
                this.inputCode.focus = true;//扫码输入框获取焦点
                this.rechargeData.dialogPayMode.code = _type;

                if(_type=='zfb')this.rechargeData.dialogPayMode.payTypeName = '支付宝支付';
                else if(_type=='wx')this.rechargeData.dialogPayMode.payTypeName = '微信支付';
                else if(_type=='cash')this.rechargeData.dialogPayMode.payTypeName = '现金';
                this.inputShouldPay1.value = this.rechargeData.rechargeMoney.value;//充值金额写入充值输入框
            },
            // 调用会员充钱的接口
            rechargeFunc(){
                let vipData = this.vipData;
                let loginData = this.$store.state.loginData;
                let param = {
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    id:vipData.id,
                    money:this.rechargeData.rechargeMoney.value,
                    give:this.rechargeData.giveMoney,
                }
                if(this.rechargeData.dialogPayMode.code=='zfb'){param.pay_type = '2';param.authCode = this.inputCode.value;}
                else if(this.rechargeData.dialogPayMode.code=='wx'){param.pay_type = '1';param.authCode = this.inputCode.value;}
                else if(this.rechargeData.dialogPayMode.code=='cash'){param.pay_type = '3';}
                else return '';
                // 是否是补差额充值
                if(!this.ifDiffStatus) param.cz_type = 1;
                else param.cz_type = 3;
                this.inputCode.value = '';
                // loading
                this.$store.commit('loading',{obj:this,type:true});
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vipCharge}`, param).then((res) => {
                    this.$store.commit('loading',{obj:this,type:false});
                    if(res.data.code == '1990005'){
                        this.dialogRecharge = false;
                        this.showModal('充值成功');
                        this.vipData.user_money = res.data.user_money;//后台返回当前金额，更新数据
                        this.vipData.pay_points = res.data.pay_points;
                        this.$emit('rechargeSuccessBack',res.data);
                        this.rechargeData.rechargeMoney.value = null;
                        // 小票数据
                        if(res.data.pay_type==3) this.printData.rechargeData.type = '现金';
                        else if(res.data.pay_type==2) this.printData.rechargeData.type = '现金';
                        else if(res.data.pay_type==1) this.printData.rechargeData.type = '支付宝';
                        this.printData.rechargeData.pay_time = res.data.pay_time;
                        this.printData.rechargeData.money = res.data.money;
                        this.printData.rechargeData.give = res.data.give;
                        this.printData.rechargeData.sn = res.data.sn;
                        this.printData.rechargeData.user_money = res.data.user_money;
                        this.printData.rechargeData.store_phone = this.$store.state.loginData.store_phone;
                        this.printData.rechargeData.store_name = this.$store.state.loginData.store_name;
                        this.printData.rechargeData.username = this.$store.state.loginData.username;
                        this.printData.rechargeData.vipName = this.vipData.name;
                        this.printData.rechargeData.mobile = this.vipData.mobile;
                        this.$refs.receiptModal.print();
                    }else if(res.data.data){
                        this.$message.error(`${res.data.data[1]}`);
                    }else{
                        this.$message.error(`${res.data.msg}`);
                    }
                    /*if(res.data.code == '1990005'){
                        this.dialogRecharge = false;
                        this.showModal('充值成功');
                        this.vipData.user_money = res.data.user_money;//后台返回当前金额，更新数据
                        this.vipData.pay_points = res.data.pay_points;
                        this.rechargeData.rechargeMoney.value = null;
                    }else{
                    	this.showModal(res.data.msg,'警告')
                    }*/
	                this.rechargeData.dialogPayMode.ifShow = false;
                }, (res) => {
                    this.$store.commit('loading',{obj:this,type:false});
	                this.rechargeData.dialogPayMode.ifShow = false;
	                this.showModal('付款失败','警告')
                    console.log(res)
                });
            },
            confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
            },
            // 提示模态框
            showModal(cont,title){
		    	this.$alert(cont, title||'提示', {
		          	confirmButtonText: '确定',
		          	callback: action => {}
		        });
		    },
		    // 提示消息
		    showMsg(cont,type){
		    	this.$message({
              		type: type||'info',
              		message: `${ cont }`
            	});
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
		},
	}
</script>