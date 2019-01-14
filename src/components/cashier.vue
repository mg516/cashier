<template>
	<el-container class="mainBox1" style="width: 100%;height:100%;padding: 10px;">
		<receiptModal ref="receiptModal" :printData="printData"></receiptModal>
		<div style="width: 100%;display: flex;flex-wrap: nowrap;">
			<div style="min-width: 340px;max-width: 420px;width:25%;height: 100%">
				<shopCart></shopCart>
			</div>
			<div style="width:75%;min-width:469px;height: 100%;">
				<el-container style="width: 100%;height: 100%">
					<el-header style="padding: 0 10px 0 20px;">
						<div class="classifyBox">
							<el-tabs tab-position="top" style="height: 52px;width:100%;" @tab-click="checkClassify">
							    <el-tab-pane :label="classifyItem.name" v-for="classifyItem,index in classifyList" :key="index" @tab-click="getGoodsList">{{classifyItem.name}}</el-tab-pane>
							</el-tabs>
							<!-- <div class="left"><img style="width: 100%;height: 100%" src="./../assets/cut_left.png"></div>
							<div class="contentBox" ref="elememt">
								<div v-for="classifyItem,index in showClassifyList" :key="index" @click="checkClassify(index)" 
								:class="{classifyItem,check:index==checkClassifyIndex}">{{classifyItem.name}}</div>
							</div>
							<div class="right"><img style="width: 100%;height: 100%" src="./../assets/cut_right.png"></div> -->
						</div>
					</el-header>
					<el-main style="padding: 10px 10px 10px 20px;margin-bottom:10px;min-height:468px;">
						<div class="goodsBox">
							<div @click="clickGoods(goodsItem)" v-if="goodsList && goodsList.length>0" v-for="goodsItem,index in goodsList" :key="index" :class="{goodsItem,check:index==checkGoodsIndex}">
								<div class="goodsImg">
									<img class="goodsImg" :src="goodsItem.thumb_url?$store.state.host+goodsItem.thumb_url:'./../assets/logo.png'" :onerror="errorGoodsImg">
								</div>
								<div class="goodsName">{{goodsItem.name}}</div>
								<div class="barcode">{{goodsItem.code||goodsItem.bar_code}}</div>
								<div class="goodsPrice" :class="{goodsNoNum:(!parseFloat(goodsItem.stock_num)||parseFloat(goodsItem.stock_num)<=0)}" style="text-align:left;height:10px;">
									<!-- <span v-if="$store.state.internetStatus">库存：{{goodsItem.stock_num||0}} {{goodsItem.unit}}</span> -->
								</div>
								<div class="goodsPrice"><span style="font-size: 8px!important;">￥</span>{{goodsItem.saleprice}}</div>
							</div>
							<div v-if="!goodsList || goodsList.length<=0" style="text-align:center;line-height:100px;color:#606266;font-size:18px;">暂无商品</div>
						</div>
					</el-main>
					<el-footer style="height: 42px">
						<div class="handleGoods">
							<div class="returnGoods" @click="returnGoods(1)">
								<img src="./../assets/return.png" width="20px">
								<span style="font-size: 12px;color: #6c8bd3;line-height: 38px;">退货</span>
							</div>
							<span class="pageNum">第 {{this.$store.state.goodsPageNum}} 页</span>
							<div class="pageDown" @click="changePage('+')">
								<img src="./../assets/cut_down.png" width="20px">
								<span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
							</div>
							<div class="pageUp" @click="changePage('-')">
								<img src="./../assets/cut_up.png" width="20px">
								<span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
							</div>
						</div>
					</el-footer>
				</el-container>
			</div>
		</div>
		<!-- 选择称重商品窗口 -->
		<el-dialog :title="curGoods?curGoods.name+'　'+curGoods.saleprice+'元 / '+curGoods.unit:null" :visible.sync="dialogChooseGoods" width="460px" :before-close="closeChooseModal">
			<div style="text-align: center;">
				<div class="demo-input-suffix" style="margin-bottom: 20px;">
					金额：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputCurMoney" v-on:keyEnter="chooseItModal"></inputComp>
					<!-- <el-input style="width: 300px" placeholder="请输入金额" v-model="inputCurMoney" clearable></el-input> -->
				</div>
				<div class="demo-input-suffix">
					重量：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputCurNum" v-on:keyEnter="chooseItModal"></inputComp>
					<!-- <el-input style="width: 300px" placeholder="请输入重量" v-on:keyup.native="changeCurNum(inputCurNum)" v-model="inputCurNum" clearable></el-input> -->
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeChooseModal">取 消</el-button>
				<el-button type="primary" @click="chooseItModal">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 自定义模态框背景 -->
		<div class="modalBg" v-if="modalShow || modalChangeNumShow"></div>
		<div id='dialogReturnGoods' v-if="dialogReturnGoods">
			<el-dialog title="按单退货" :visible.sync="dialogReturnGoods">
				<div class="dialogReturnGoods">
					<el-container>
						<el-header>
							<el-input placeholder="请输入内容" v-model="returnOrderId" class="input-with-select" @clear="getOrderList" clearable @keyup.enter.native="getOrderList">
							    <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
							</el-input>
							<span class="el-date-picker">
								<el-date-picker :disabled='false' v-model="returnTime" align="right" type="date" @clear="getOrderList" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="lastPickerDate" @change="searchOrderTime"></el-date-picker>
							</span>
							<el-button type="warning" :disabled="this.curReturnGoods&&this.curReturnGoods.abnormal==1?true:false" @click="goodsReturn('goods')">商品退货</el-button>
							<el-button type="warning" @click="goodsReturn('order')">整单退货</el-button>
						</el-header>
						<el-main>
							<el-container>
							  	<el-aside>
							  		<el-table :data="orderList" height="250" ref="orderListTable" @current-change="changeCurOrder" highlight-current-row>
							  			<el-table-column prop="id" label="订单号">
							  				<template slot-scope="scope">
							  					<span>{{scope.row.sn}}</span>
							  					<el-popover trigger="hover" placement="top" class="errorOrder">
											        <p>异常订单</p>
											        <div slot="reference" class="name-wrapper">
											         	<i class="el-icon-warning" v-if="scope.row.abnormal==1" style="color:#F56C6C;"></i>
											        </div>
										        </el-popover>
							  					<el-popover trigger="hover" placement="top" class="errorOrder">
											        <p>如退货，优惠券不会返还</p>
											        <div slot="reference" class="name-wrapper">
											         	<span v-if="scope.row.use_coupon==1" style="color:#F56C6C;">券</span>
											        </div>
										        </el-popover>
										    </template>
							  			</el-table-column>
								  	</el-table>
							  	</el-aside>
							  	<el-main style="margin-left:10px;">
							  		<span id="table">
								  		<el-table :data="orderGoods" height="250" style="width: 100%">
								  			<el-table-column prop="id" label="行号" width="50" type="index"></el-table-column>
								  			<el-table-column prop="code" label="货号" width="120"></el-table-column>
								  			<el-table-column prop="name" label="品名" width="120"></el-table-column>
								  			<el-table-column prop="original_num" label="购买数量" width="80"></el-table-column>
								  			<el-table-column prop="price" label="单价" width="80"></el-table-column>
								  			<el-table-column prop="enough_total" label="可退金额" width="80">
								  				<template slot-scope="scope">{{(scope.row.enough_total).toFixed(2)}}</template>
								  			</el-table-column>
								  			<el-table-column prop="num" label="可退数量" width="80"></el-table-column>
								  			<el-table-column prop="return" label="退货数量" width="80">
								  				<template slot-scope="scope">
													<el-input placeholder="退货数量" v-model="scope.row.return" class="input-with-select"></el-input>
												</template>
								  			</el-table-column>
								  		</el-table>
							  		</span>
							  	</el-main>
							</el-container>
						</el-main>
					</el-container>
				</div>
				<div slot="footer" class="dialog-footer">
					<div v-if="curReturnGoods" style="position:absolute;line-height:50px;font-size:18px;" class="">
						<span style="color:red;margin-right:100px;"><strong>销售单号：</strong>{{curReturnGoods.sn}}</span>
						<span style="color:#FF4600;"><strong>应退金额：</strong>{{curReturnGoods.shouldReturn}} 元</span>
					</div>
					<el-button @click="dialogReturnGoods = false">取 消</el-button>
				</div>
				<!-- 内层，退款窗口 -->
				<el-dialog width="500px" title="选择退款方式" :visible.sync="dialogReturnMoney" append-to-body>
					<div class="dialogReturnMoney">
						<div class="demo-input-suffix" style="margin-bottom:20px;" v-for="returnItem,index in returnMoneyType">
							<span v-if="returnItem.pay_type==0">
								<span style="display:inline-block;width:120px;">现金退款：</span>
								<el-input style="width:160px;" placeholder="请输入退款金额" :disabled="returnHandleType=='order'?true:false" @input="checkReturnNum(index)" v-model="returnItem.money"></el-input>
								<span style="padding-left:20px;color:red">* 最大可退 {{returnItem.pay}} 元</span>
							</span>
							<span v-else-if="returnItem.pay_type==1">
								<span style="display:inline-block;width:120px;">微信退款：</span>
								<el-input style="width:160px;" placeholder="请输入退款金额" :disabled="returnHandleType=='order'?true:false" @input="checkReturnNum(index)" v-model="returnItem.money"></el-input>
								<span style="padding-left:20px;color:red">* 最大可退 {{returnItem.pay}} 元</span>
							</span>
							<span v-else-if="returnItem.pay_type==2">
								<span style="display:inline-block;width:120px;">支付宝退款：</span>
								<el-input style="width:160px;" placeholder="请输入退款金额" :disabled="returnHandleType=='order'?true:false" @input="checkReturnNum(index)" v-model="returnItem.money"></el-input>
								<span style="padding-left:20px;color:red">* 最大可退 {{returnItem.pay}} 元</span>
							</span>
							<span v-else-if="returnItem.pay_type==3">
								<span style="display:inline-block;width:120px;">储值卡退款：</span>
								<el-input style="width:160px;" placeholder="请输入退款金额" :disabled="returnHandleType=='order'?true:false" @input="checkReturnNum(index)" v-model="returnItem.money"></el-input>
								<span style="padding-left:20px;color:red">* 最大可退 {{returnItem.pay}} 元</span>
							</span>
							<span v-else-if="returnItem.pay_type==8">
								<span style="display:inline-block;width:120px;">农行聚合码退款：</span>
								<el-input style="width:160px;" placeholder="请输入退款金额" :disabled="returnHandleType=='order'?true:false" @input="checkReturnNum(index)" v-model="returnItem.money"></el-input>
								<span style="padding-left:20px;color:red">* 最大可退 {{returnItem.pay}} 元</span>
							</span>
							<span v-else-if="returnItem.pay_type==9">
								<span style="display:inline-block;width:120px;">家庭卡退款：</span>
								<el-input style="width:160px;" placeholder="请输入退款金额" :disabled="returnHandleType=='order'?true:false" @input="checkReturnNum(index)" v-model="returnItem.money"></el-input>
								<span style="padding-left:20px;color:red">* 最大可退 {{returnItem.pay}} 元</span>
							</span>
						</div>
					</div>
					<div slot="footer" class="dialog-footer">
						<div v-if="curReturnGoods" style="position:absolute;line-height:50px;font-size:14px;" class="">
							<span style="color:red;margin-right:4px;"><strong>应退：</strong>{{curReturnGoods.shouldReturn}} 元</span>
							<span style="color:#FF4600;"><strong>当前：</strong>{{curReturnGoods.curMoney||0}} 元</span>
						</div>
						<el-button @click="dialogReturnMoney = false">取 消</el-button>
						<el-button type="primary" @click="submitReturnMoney">确 定</el-button>
					</div>
				</el-dialog>
			</el-dialog>
		</div>
	</el-container>
</template>
<style type="text/css">
    @import './../static/payType.css'
</style>
<style type="text/css">
	.errorOrder{display: inline-block;}
	.el-popover{min-width: 0!important;}
</style>
<script type="text/ecmascript-6">
	import receiptModal from "./setUp/receiptModal"
	import inputcomp from "./comp/inputComp"
	import shopCart from "./indexComp/shopCart"
	import {getLodop} from '../static/LodopFuncs.js'
	export default {
    	components: {
            'inputComp': inputcomp,
            'shopCart': shopCart,
            'receiptModal': receiptModal
        },
        data(){
            return {
            	errorGoodsImg:'this.src="' + require('./../assets/logo.png') + '"',
            	modalShow:false,//自定义模态框(会员)
            	modalChangeNumShow:false,//修改商品数量模态框的背景
            	inputCompSize:{//input模板数据
                    width:'300',
                    height:'40',
                    digitNum:'2',//两位小数
                },

            	classifyList:[],
            	goodsList:[],//商品列表
            	checkGoodsIndex:1,
            	curGoods:null,		//选择称重商品的当前商品
            	inputCurMoney:{
            		type:'curMoney',
            		status:true,//是否可编辑
            		value:null //模态框里的金额
            	},
            	inputCurNum:{
            		type:'curNum',
            		status:true,//是否可编辑
            		value:null, //模态框里的重量
            		focus:false
            	},

            	dialogChooseGoods: false,//称重商品模态框
            	dialogReturnGoods:false,//退货模态框
            	dialogReturnMoney:false,//退款模态框
            	returnTime:'',//退货模态框的筛选时间
            	returnHandleType:'',//退货状态（按商品/整单）
            	returnOrderId:'',//订单号查询
            	// returnTime:Date.now(),//退货模态框的筛选时间
            	returnMoneyType:'',//退款类型
            	returnMoney:'',//退款金额
            	lastPickerDate: {
					disabledDate(time) {
                        let secondNum = 60*60*24*7*1000;
						return time.getTime() > Date.now() || time.getTime() < (Date.now() - secondNum);
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
					text: '前天',
					onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
							picker.$emit('pick', date);
						}
					}]
            	},
            	orderList: [],
            	orderGoods:[],
            	printData:{
                    setupData:null,
                    initData:{
                        ifShow:0,
                        ifReprint:false,
                        printType:'returnGoods'
                    },
                    orderData:{//打印订单信息
                        orderId:null,
                        order_over_time:null,
                        receivable:null,
                        cash:0,
                        weip:0,
                        change:0,
                        card:0,
                        totalNum:0,
                        goods:[],
                        wipeZeroMoney:0,
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
        beforeRouteUpdate (to, from, next) {
            console.log('beforeRouteUpdate')
            // 在当前路由改变，但是该组件被复用时调用
            // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
            // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
            // 可以访问组件实例 `this`
        },
        beforeDestory(){
            console.log(this.$el)
        },
        computed:{
            // 监听键盘Enter事件
            /*codeEnter(){
                return this.$store.state.codeEnter
            },*/
            
        },
        watch: {
        	$route(to,from){
                console.log(to.path);
                if(to.path == '/cashier'){
                    if(localStorage.loginData){
		                this.$store.commit('setLoginData',JSON.parse(localStorage.loginData));
		                this.loginData = this.$store.state.loginData;
		            }
		    		this.getGoodsCate();
		    		this.$refs.receiptModal.getConfig();//获取最新的小票配置
                }
            },
        	modalShow:function(val){
        		let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
        	},
        	dialogReturnGoods:function(val){
				let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
        	},
        	dialogChooseGoods:function(val){
        		let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
        	},
		    /*codeEnter: function(newVal, oldVal) {
		    	let param = {
                    key:'codeEnter',
                    val:false
                }
                this.$store.commit('saveState',param);
		        if(newVal){
		        	if(this.$store.state.codeStatus == 'shopping'){
		        		let codeValue = this.$store.state.codeValue;
		        		if(codeValue && codeValue!=""){
		        			this.$message('条码：' + codeValue);
		        		}else{
		        			this.$message('请输入条码');
		        		}
		        	}
		        }
		    }*/
		},
        methods:{
        	// 组件输入框获取焦点
            getCompFocus(){
                this.inputCurNum.focus = true;
            },
        	// 退货
       		returnGoods(){
       			let cartList = this.$store.state.cartList;
       			if(cartList && cartList.length>0){
       				this.$alert('当前已有交易商品，不能更改交易状态', '青蛙家收银', {
						confirmButtonText: '确定',
						callback: action => {}
			        });
       			}else{
       				this.dialogReturnGoods = true;
       				this.returnTime = this.formatTime();
       				this.getOrderList();
       			}
        	},
        	// 设置选中的行号
        	setCurrent(row) {
		        this.$refs.orderListTable.setCurrentRow(row);//row,数组的对应元素
		    },
		    // 选中的订单
		    changeCurOrder(val) {
		    	let orderList = this.orderList;
		    	for(let i=0;i<orderList.length;i++){
		    		if(orderList[i].sn == val.sn){
		    			this.curReturnGoods = orderList[i];
		    			this.curReturnGoods.shouldReturn = 0;//充值应退金额
		    			this.getOrderDetail(val.id)
		    			break;
		    		}
		    	}
		        
		    },
        	// 获取订单列表
        	getOrderList(){
        		let loginData = this.$store.state.loginData;
        		let param = {
                    // action:'mdorderList',
                    action:'getreturnorderlist',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    create_time:this.returnTime,
                    words:this.returnOrderId
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                	if(res.data&&res.data.data){
                		this.orderGoods = '';
            			this.curReturnGoods = null;
                		let data = res.data.data;
                		for(let i=0;i<data.length;i++){
                			data[i].shouldReturn = 0;
                		}
                		this.orderList = data;
                		setTimeout(()=>{
	                		this.setCurrent(this.orderList[0]);//默认选中第一个
	       				},10)
                	}
                }, (res) => {
                    console.log(res)
                });
        	},
        	// 查询订单详情
        	getOrderDetail(orderId){
        		let loginData = this.$store.state.loginData;
        		let param = {
                    action:'getreturnorder',//'getreturnorder',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    id:orderId
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                	if(res.data){
                		let goodsList = res.data.data
                		for(let i = 0;i<goodsList.length;i++){
                			// goodsList[i].canReturn = parseFloat(goodsList[i].num)
                			goodsList[i].return = 0
                		}
                		this.orderGoods = goodsList;
                		// this.orderMoney = res.data.data.goods;
                		// this.orderDetail = res.data.data;
                	}
                }, (res) => {
                    console.log(res)
                });
        	},
        	// 切换订单查询时间
        	searchOrderTime(val){
        		this.returnTime = val;
        		this.getOrderList();
        	},
        	// 输入退货数量
        	changeReturnNum(index){
        		// alert(this.orderGoods(index).id)
        	},
        	// 退货
        	goodsReturn(handleType){
        		this.returnMoneyType = '';//清空之前的退货方式记录
        		this.curReturnGoods.shouldReturn = 0;
        		this.curReturnGoods.curMoney = 0;


    			let orderGoods = this.orderGoods;
    			let totalMoney = 0;
    			this.returnHandleType = handleType;//如果是整单退，禁用输入框
    			let returnTotalNum = 0;//退货总数量(多少种商品)--判断是否全部退货
    			let returnNum = 0;//退货总数量(多少个商品)--判断是否有退货商品
        		if(handleType=='goods'){
        			// debugger
        			this.curReturnGoods.curMoney = 0;
        			let __num = 0;//退货数和可退数相等的商品数（判断是否全部退货）
        			for(let i = 0;i<orderGoods.length;i++){
    					if(isNaN(orderGoods[i].return)){
    						this.showModal('退货数量不合法','警告')
    						return '';
    						break;
    					}
        				if(parseFloat(orderGoods[i].return) == parseFloat(orderGoods[i].num)){
        					__num++
        				}
        			}
        			if(__num==orderGoods.length){//全部单品退货，调用整单退货的方法
        				this.goodsReturn('order');
        				return '';
        			}
        			returnTotalNum = __num;
        			for(let i = 0;i<orderGoods.length;i++){
        				if(orderGoods[i].return && parseFloat(orderGoods[i].return)>parseFloat(orderGoods[i].num)){
        					this.showModal('退货数量不可以大于可退数量','警告')
        					return '';
        					break;
        				}else{
        					returnNum += parseFloat(orderGoods[i].return||0)
        					orderGoods[i].total = (this.accMul(orderGoods[i].return||0,orderGoods[i].price)).toFixed(2)
        				}
        				totalMoney += parseFloat(orderGoods[i].total);
        			}
        			console.log(orderGoods)
        		}else if(handleType=='order'){
        			// 整单退货，填充全部数量
        			let orderGoods = this.orderGoods;
        			for(let i = 0;i<orderGoods.length;i++){
        				orderGoods[i].return = orderGoods[i].num;
        				returnTotalNum+=orderGoods[i].num;
        				returnNum+=orderGoods[i].num;
        			}
        			this.orderGoods = orderGoods;

					for(let i = 0;i<orderGoods.length;i++){
        				orderGoods[i].total = (this.accMul(orderGoods[i].return||0,orderGoods[i].price)).toFixed(2)
        				totalMoney += parseFloat(orderGoods[i].total);
        			}
        		}
        		// if(totalMoney<=0&&returnNum<=0){
        		if(returnNum<=0){
        			this.showModal('退货商品数为0，不可以退款，请选择退货数量','警告');
        			return;
        		}
        		let loginData = this.$store.state.loginData;
                let param = {
                    action:'getPayTypes',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    order_id:this.curReturnGoods.id
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                	if(res.data&&res.data.data){
                		let data = res.data.data;
                		let total = 0;//整单退货的应退金额
                		// debugger
                		for(let i=0;i<data.length;i++){
	        				if(handleType=='order'){//整单退货
	        					data[i].money = data[i].pay;
	        					total += parseFloat(data[i].pay);
	        				}else{
	        					data[i].money = 0;
	        				}
                		}
                		this.dialogReturnMoney = true;
                		if(handleType=='order'){
                			this.curReturnGoods.shouldReturn = (data.length==1&&data[0].pay_type==0)?((total).toFixed(1) + '0'):((total).toFixed(2))
                			// this.curReturnGoods.shouldReturn = (total).toFixed(2)// + '0';//充值应退金额
                			this.curReturnGoods.curMoney = this.curReturnGoods.shouldReturn;
                		}else{
	        				this.curReturnGoods.shouldReturn = (data.length==1&&data[0].pay_type==0)?((totalMoney).toFixed(1) + '0'):((totalMoney).toFixed(2));
	        				// this.curReturnGoods.shouldReturn = (totalMoney).toFixed(2)// + '0';
                		}
                		if(data.length==1&&data[0].pay_type==0){
	                		if(parseFloat(totalMoney).toFixed(2) != parseFloat(this.curReturnGoods.shouldReturn).toFixed(2)){
	                			let discounts = (parseFloat(this.curReturnGoods.shouldReturn).toFixed(2)-parseFloat(totalMoney).toFixed(2)).toFixed(2)
	                			this.$set(this.curReturnGoods,'refund_wipe_zreo',discounts)
	                		}
                		}
                		// 只有一种退款方式时，自动补全
                		if(data.length==1) {
                			data[0].money = this.curReturnGoods.shouldReturn;
	                		this.curReturnGoods.curMoney = data[0].money;
                		}
                		if(data.length>0){
	            			this.returnMoneyType = data;
                		}
                	}
                }, (res) => {
                    console.log(res)
                });
        	},
			// 退款
			submitReturnMoney(){
    			this.printData.orderData = {//打印订单信息
                    orderId:null,
                    order_over_time:null,
                    receivable:null,
                    cash:0,
                    weip:0,
                    change:0,
                    card:0,
                    totalNum:0,
                    goods:[]
                }
				if(this.curReturnGoods.curMoney == this.curReturnGoods.shouldReturn){
					let return_money_types = [];
					let returnMoneyType = this.returnMoneyType;
					for(let i=0;i<returnMoneyType.length;i++){
						if(parseFloat(returnMoneyType[i].money)>parseFloat(returnMoneyType[i].pay)){
							this.showModal('退款金额不可超过最大可退金额','提示');
							return '';
							break;
						}
						let arr = {
							pay_type:returnMoneyType[i].pay_type,
							pay_money:returnMoneyType[i].money
						}
						if(parseFloat(returnMoneyType[i].money) && parseFloat(returnMoneyType[i].money)>0){
							return_money_types.push(arr)
						}
					}
					// 当前退货订单的商品
					let goods = [];
					let orderGoods = this.orderGoods;
					for(let i=0;i<orderGoods.length;i++){
						if(orderGoods[i].return && orderGoods[i].return>0){
							let arr = orderGoods[i];
							arr.return_num = orderGoods[i].return;
							arr.saleprice = orderGoods[i].price;
							arr = Object.assign({},arr);
							/*let arr = {
								return_num:orderGoods[i].return,
								saleprice:orderGoods[i].price,
								unit:orderGoods[i].unit,
								total:orderGoods[i].total,
								num:orderGoods[i].num,
								goods_id:orderGoods[i].goods_id,
								id:orderGoods[i].id,
								md_goods_id:orderGoods[i].md_goods_id,
								name:orderGoods[i].name,
								original_num:orderGoods[i].original_num,
								purcprice:orderGoods[i].purcprice,
								bar_code:orderGoods[i].bar_code,
								unit_group:orderGoods[i].unit_group,
								sorting_num:orderGoods[i].sorting_num,
								thumb_url:orderGoods[i].thumb_url,
								gift_goods_sign:orderGoods[i].gift_goods_sign
							}*/
							goods.push(arr)
						}
					}
					let loginData = this.$store.state.loginData;
	                let param = {
	                    action:'mdorderReturn',
	                    access_token:loginData.access_token,
	                    user_token:loginData.user_token,
	                    order_id:this.curReturnGoods.id,
	                    goods:goods,
						return_money_types:return_money_types
	                }
	                if(this.curReturnGoods.abnormal == 1){
	                	param.abnormal = this.curReturnGoods.abnormal
	                }else{
		                // 抹零
		                if(this.curReturnGoods.refund_wipe_zreo){
		                	let arr = {
		                		pay_type:'6',
		                		pay_money:this.curReturnGoods.refund_wipe_zreo
		                	}
		                	param.return_money_types.push(arr);
		                	param.refund_wipe_zreo = this.curReturnGoods.refund_wipe_zreo;
		                }
	                }
	                param.total = this.curReturnGoods.shouldReturn;
	                param.register_vip_must = this.$store.state.loginData.register_vip_must||0;
	                this.$store.commit('loading',{obj:this,type:true});
	                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
	                	this.$store.commit('loading',{obj:this,type:false});
	                	if(res.data.code==1){
	                		this.dialogReturnMoney = false;
	                		this.changeCurOrder(this.curReturnGoods)
	                		// alert('退款成功')
	                		this.$message({ type: 'success', message: '退货成功'});
	                		// 编辑小票打印数据
	                		this.printData.orderData.orderId = this.curReturnGoods.sn;
	                		for(let i=0;i<param.return_money_types.length;i++){
	                			if(param.return_money_types[i].pay_type=='1'){
	                				this.printData.orderData.weipReturn = parseFloat(param.return_money_types[i].pay_money);
	                			}else if(param.return_money_types[i].pay_type=='2'){
	                				this.printData.orderData.zfbaoReturn = parseFloat(param.return_money_types[i].pay_money);
	                			}else if(param.return_money_types[i].pay_type=='3'){
	                				this.printData.orderData.cardReturn = parseFloat(param.return_money_types[i].pay_money);
	                			}else if(param.return_money_types[i].pay_type=='0'){
	                				this.printData.orderData.cashReturn = parseFloat(param.return_money_types[i].pay_money);
	                				this.OpenQx();//打开钱箱
	                			}else if(param.return_money_types[i].pay_type=='6'){
	                				this.printData.orderData.wipeZeroMoney = parseFloat(param.return_money_types[i].pay_money);
	                			}else if(param.return_money_types[i].pay_type=='8'){
	                				this.printData.orderData.bankpayReturn = parseFloat(param.return_money_types[i].pay_money);
	                			}else if(param.return_money_types[i].pay_type=='9'){
	                				this.printData.orderData.familyReturn = parseFloat(param.return_money_types[i].pay_money);
	                			}
	                		}// 退款金额
	                		let totalNum = 0;
	                		let goodsList = param.goods;
	                		this.printData.orderData.goods = [];
	                		for(let i=0;i<goodsList.length;i++){
	                			let goodsItem = goodsList[i];
	                			goodsItem.num = 0-goodsList[i].return_num;
	                			this.printData.orderData.goods.push(goodsItem)
	                			if(goodsList[i].sorting_num == 1){
		                			totalNum ++;
	                			}else{
		                			totalNum += parseFloat(goodsList[i].return_num)
	                			}
	                		}
	                		this.printData.orderData.totalNum = totalNum;
	                		this.printData.orderData.totalMoney = param.total;
	                		if(param.refund_wipe_zreo) this.printData.orderData.wipeZeroMoney = param.refund_wipe_zreo;
	                		if(res.data.customerInfo){
		                		this.printData.orderData.user_money = res.data.customerInfo.user_money;//储值卡余额
		                		this.printData.orderData.family_money = res.data.customerInfo.family_money;//储值卡余额
		                		this.printData.userData.name = res.data.customerInfo.name;
		                		this.printData.userData.mobile = res.data.customerInfo.mobile;
	                		}
	                		setTimeout(()=>{
	                			this.$refs.receiptModal.print();
	                		},10)
	                	}else{
		                	this.showModal(res.data.msg,'警告');
	                	}
	                }, (res) => {
	                	this.$store.commit('loading',{obj:this,type:false});
	                    console.log(res)
	                });
				}else{
					this.showModal('当前金额要和应退金额相同','提示');
				}
			},
			// 校验输入退款金额（不可以大于可退金额）
			checkReturnNum(index){
				let returnMoneyType = this.returnMoneyType;
				if(returnMoneyType[index].money>=returnMoneyType[index].pay){
            		returnMoneyType[index].money = returnMoneyType[index].pay;
            		this.returnMoneyType = JSON.parse(JSON.stringify(returnMoneyType));
					// this.$forceUpdate();
				}
				let total = 0;
				for(let i=0;i<this.returnMoneyType.length;i++){
					total += parseFloat(this.returnMoneyType[i].money||0);
				}
				this.curReturnGoods.curMoney = total.toFixed(2)// + '0';
			},
        	inputInfo(msg){
                console.log(msg)
                if(msg.type=='curNum'){
                    this.inputCurNum.value = msg.value;
                    let curValue = parseFloat(this.inputCurNum.value||0)
                    if(curValue&&curValue>0){
                        this.inputCurMoney.value = (this.accMul(curValue,this.curGoods.saleprice)).toFixed(2)
                    }else{
                        this.inputCurMoney.value = '';
                    }
                }else if(msg.type=='curMoney'){
                    this.inputCurMoney.value = msg.value;
                    let curValue = parseFloat(this.inputCurMoney.value||0)
                    if(curValue&&curValue>0){
                        this.inputCurNum.value = (this.accDiv(curValue,this.curGoods.saleprice)).toFixed(2)
                    }else{
                        this.inputCurNum.value = '';
                    }
                }
            },
            // 精确乘法
            accMul(arg1,arg2){
                var m=0,s1=arg1.toString(),s2=arg2.toString();
                try{m+=s1.split(".")[1].length}catch(e){}
                try{m+=s2.split(".")[1].length}catch(e){}
                return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
            },
            // 精确除法
            accDiv(arg1,arg2){
                var t1=0,t2=0,r1,r2;
                try{t1=arg1.toString().split(".")[1].length}catch(e){}
                try{t2=arg2.toString().split(".")[1].length}catch(e){}
                r1=Number(arg1.toString().replace(".",""))
                r2=Number(arg2.toString().replace(".",""))
                console.log((r1/r2)*Math.pow(10,t2-t1))
                return (r1/r2)*Math.pow(10,t2-t1);
            },
			// 点击商品，选中商品
			clickGoods(goodsData){
				// if(goodsData.ifWeigh){
				if(goodsData.sorting_num == 1){
					this.openChooseModal(goodsData)
				}else{
					let param = {
						goods:goodsData,
						type:'newGoods'
					}
					this.changeCart(param)
				}
			},
			//显示选择商品的模态框
			openChooseModal(goodsData){
				this.curGoods = goodsData;
				this.dialogChooseGoods = true;
				this.getCompFocus();
			},
			closeChooseModal(){
				this.curGoods = null;
				this.inputCurMoney.value = null;
				this.inputCurNum.value = null;
				this.dialogChooseGoods = false;
			},
			// 确定加入称重商品
			chooseItModal(){
				if(isNaN(this.inputCurMoney.value) || isNaN(this.inputCurNum.value)){
					// this.$message('请输入合法的金额或数量');
					const h = this.$createElement;
					this.$notify({
						title: '警告',
						duration:1500,
						message: h('h3', { style: 'color: #E04C4C;font-weight:bold;'}, '请输入合法的金额或数量')
			        });
					return;
				}
				let inputCurMoney = parseFloat(this.inputCurMoney.value);
				let inputCurNum = parseFloat(this.inputCurNum.value);
				if(!inputCurMoney||!inputCurNum){
					const h = this.$createElement;
			        this.$notify({
						title: '警告',
						duration:1500,
						message: h('h3', { style: 'color: #E04C4C;font-weight:bold;'}, '请输入金额或数量')
			        });
					return;
				}
				if(inputCurMoney<=0||inputCurNum<=0){
					this.$notify({
						title: '警告',
						duration:1500,
						message: h('h3', { style: 'color: #E04C4C;font-weight:bold;'}, '金额或数量需大于零')
			        });
					// this.$message('金额或数量需大于零');
					return;
				}
				// 判断称重商品反算是否等于输入的金额
				let realMoney = (this.accMul(this.curGoods.saleprice,inputCurNum)).toFixed(2);
				if(realMoney != this.inputCurMoney.value){
					this.inputCurMoney.value = realMoney;
					this.chooseItModal();
				}else{
					let curGoods = this.curGoods;
					curGoods.num = inputCurNum;
					let param = {
						goods:this.curGoods,
						total:inputCurMoney,
						// num:inputCurNum,
						type:'newGoods'
					}
					this.changeCart(param)
					this.closeChooseModal();
				}

			},
			//修改购物车数据
			changeCart(param){
				this.$store.commit('changeCart',param)
			},
			// 获取分类列表
            getGoodsCate(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'getStoreCategory',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    store_id:loginData.store_id
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                	if(res.data){
                		let classifyList = res.data.data;
                		classifyList.unshift({id:'',name:"全部商品"});
                		this.classifyList = classifyList;
                		this.getGoodsList();
                	}
                }, (res) => {
                    console.log(res)
                });
            },
            // 获取商品列表
            getGoodsList(){
            	let loginData = this.$store.state.loginData;
            	let _param = {
                	access_token:loginData.access_token,
                	user_token:loginData.user_token,//loginData.access_token,
                    action:'getMdGoods',
                    category:this.category||'',
                    store_id:loginData.store_id
                }
                _param.list_goods_rows = this.$store.state.limit,
                _param.goods_page = this.$store.state.goodsPageNum,
            	_param.words = '';
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, _param).then((res) => {
                    if(res.data&&res.data.data){
                    	this.goodsList = res.data.data.data;
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 切换页号
            changePage(changeType){
            	let curPage = this.$store.state.goodsPageNum;
            	let param = {}
            	if(changeType == '+'){
            		if(this.goodsList.length<this.$store.state.limit)return '';
            		param = {key:'goodsPageNum',val:curPage+1}
            	}else if(changeType == '-'){
            		if(curPage==1)return '';
            		param = {key:'goodsPageNum',val:curPage-1}
            	}
        		this.$store.commit('saveState',param);
        		this.getGoodsList();
            },
			//切换商品分类
			checkClassify(tab, event){
				let classifyList = this.classifyList;
				// 点击分类不同时，页号重置为1
				if(this.category != classifyList[tab.index].goods_category_id){
					let param = {key:'goodsPageNum',val:1};
					this.$store.commit('saveState',param);
				}
				this.category = classifyList[tab.index].goods_category_id;
				this.getGoodsList()
			},
		    showModal(cont,title){
		    	this.$alert(cont, title||'提示', {
		          	confirmButtonText: '确定',
		          	callback: action => {}
		        });
		    },
		    // 提示模态框
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
		    formatTime(){
		    	let date = new Date();
			  	const year = date.getFullYear()
			  	const month = date.getMonth() + 1
			  	const day = date.getDate()
			  	const hour = date.getHours()
			  	const minute = date.getMinutes()
			  	const second = date.getSeconds()

			  	return `${year}-${month}-${day}`
			  	// return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
			},
			formatNumber(){
			  n = n.toString()
			  return n[1] ? n : '0' + n
			},
			confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
            },
            startRequest() {
	            var oShell = new ActiveXObject("WScript.Shell");
	            var sRegVal = 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Windows\\Device';
	            var sDefault = oShell.RegRead(sRegVal);
	            return sDefault;
	        },	 
	        Start (){
	            var cpname = this.startRequest();
	            alert(cpname);
	        },
	        // 弹出收银箱
            OpenQx(){
                let LODOP=getLodop();
                if(LODOP){
                    // LODOP.WRITE_PORT_DATA("COM4",String.fromCharCode(27)+','+String.fromCharCode(112)+','+String.fromCharCode(0)+','+String.fromCharCode(128)+','+String.fromCharCode(128));
                    let strData=String.fromCharCode(27,112,1,128,128);
                    LODOP.SET_PRINT_MODE("SEND_RAW_DATA_ENCODE","UTF-8");//UTF-8 UTF-7 UNICODE ANSI UTF-16 UTF-16BE GBK BIG5 EUC-JP
                    if (LODOP.CVERSION) {
                        if (LODOP.SEND_PRINT_RAWDATA(strData)){
                            // console.log("发送命令成功！");
                        } else {
                            // console.log("发送命令失败！");
                        }
                    }
                }
            },
    	},
    	mounted:function(){
    		if(localStorage.loginData){
                this.$store.commit('setLoginData',JSON.parse(localStorage.loginData));
                this.loginData = this.$store.state.loginData;
            }
    		this.getGoodsCate();
		}
    }
</script>
