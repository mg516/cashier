import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		useVip:null,//当前使用的会员
		// codeEnter:false,//键入了Enter按钮
		codeStatus:null,//添加购物车:shopping,
		codeValue:null,//键盘键入的值（Enter之后）
		// host:'http://192.168.3.187',
		// host:'http://gy.t.geekzj.cn',
		host:'https://wb.qingwajia.cn',
		// host:'https://t.qingwajia.cn',
		loading:false,//加载框
		loadingConfig:{//加载模态框参数
			status:false,//显示开关
			icon:require('./../assets/loading-icon3.gif'),//图标
			width:'140',
			height:'140',
			color:'#666',
			text:'加载中...'
		},
		menuList:[
            {name:'收银',id:0,icon_on:require('./../assets/menu/pay_on.png'),icon_off:require('./../assets/menu/pay_off.png'),msg:0,urlStr:'/cashier'},
            {name:'线上订单',id:1,icon_on:require('./../assets/menu/orderOnline_on.png'),icon_off:require('./../assets/menu/orderOnline_off.png'),msg:0,urlStr:'/orderOnline'},
            {name:'查交易',id:2,icon_on:require('./../assets/menu/look_on.png'),icon_off:require('./../assets/menu/look_off.png'),msg:0,urlStr:'/offlineOrder'},
            {name:'商品库存',id:7,icon_on:require('./../assets/menu/stock_on.png'),icon_off:require('./../assets/menu/stock_off.png'),msg:0,urlStr:'/goods_stock'},
            {name:'会员管理',id:3,icon_on:require('./../assets/menu/vip_on.png'),icon_off:require('./../assets/menu/vip_off.png'),msg:0,urlStr:'/manageVip'},
            // {name:'提货',id:4,icon_on:require('./../assets/menu/pickOrder_on.png'),icon_off:require('./../assets/menu/pickOrder_off.png'),msg:0,urlStr:'/'},
            {name:'交接班',id:6,icon_on:require('./../assets/menu/handover_on.png'),icon_off:require('./../assets/menu/handover_off.png'),msg:0,urlStr:'/handover'},
            {name:'设置',id:5,icon_on:require('./../assets/menu/set_on.png'),icon_off:require('./../assets/menu/set_off.png'),msg:0,urlStr:'/setup'}
        ],
        // 功能开关
        funcSwitch:{
        	timeVip:false,//有没有临时会员
        },
		version:'1.1.8',
		verTime:27,
		versionTime:Date.parse(new Date('2018-11-26 15:28:00'))/1000,//没用
		limit:18,//商品列表limit
		goodsPageNum:1,//商品页号
		config:{
			download:'/apimd/mdcashregister/createSySxCodePriceName',
			print:'/apimd/apiprint/index',
			// login:'/apimd/mdcashregister1/index',
			login:'/apimd/mdcashregister/index',
			coupon:'/apimd/Mdcouponwriteoff/index',
			stock:'/apimd/Mdcrinventory/index',
			vip:'/apimd/Mdcustomer/index',
			rechargeMoney:'/apimd/md_pay/rechargeMoney',
			vipCharge:'/apimd/md_pay/customerRecharge',
			vipGive:'/apimd/md_pay/customerMoney',
			get_access_token:'/apimd/mdcashregister/get_access_token',
			// goods:'/apimd/mdcashregister/index',
			order:'/apimd/apiorder/index',
			salePromotion:'/apimd/promotion/index',//促销
			Changeshifts:'/apimd/Changeshifts/index',//对账
		},
		loginData:null,//登录信息(缓存)
		type: '',
		keyScene:null,
		cartList:[],//购物车列表
		totalNum:0,//购物车商品数量
		totalMoney:0,//购物车总金额
		receiptModal:null,//小票模板
		printName:null,//配置的打印机名称
		getSearchFocus:true,//首页搜索是否获取焦点
		lockScreen:false,//锁屏状态
		internetStatus:false,//系统联网状态
		//缓存的配置数据模板
		setupData:{
            ifReturnPage:false,//结算之后自动关闭窗口
            returnCD:'2',//结算后关闭延迟，单位s
        }
	},
	getters:{
		getType:function (state) {
			if(!state.type){
				state.type = localStorage.getItem('type')
			}
			return state.type;
		}
	},
	mutations:{
	    //格式：类型(名字)+处理函数
	    // 保存state参数
	    saveState(state,param){
	    	state[param.key] = param.val;
	    },
	    setLoginData(state,param){
	    	state.loginData = param;
	    },
	    //page1.vue监听
		changeKeyScene(state,param){
			state.keyScene = param.scene;
		},
	    //加1
	    getTotal(state) {
	      	let cartList = state.cartList;
			let totalNum = 0;
			let totalMoney = 0;
			for(let i = 0;i<cartList.length;i++){
				if(cartList[i].sorting_num == 1){
					totalNum++;
				}else{
					totalNum += parseFloat(cartList[i].num);
				}
				totalMoney += parseFloat(cartList[i].total);
			}
			state.totalNum = parseInt(totalNum);
			state.totalMoney = totalMoney.toFixed(2);
	    },
	    // 修改购物车
	    changeCart(state,param){
	    	if(param.type == 'newGoods'){
		    	// 展开goods的内容到新的堆内存，curGoods存储新内存的引用（直接赋值会出现修改联动问题）
		    	let curGoods = Object.assign({},param.goods);
				// let curGoods = JSON.parse(JSON.stringify(goods));
				if(param.total){
					curGoods.total = param.total;
				}else if(!curGoods.total){
					var m=0,s1=curGoods.saleprice.toString(),s2=curGoods.num.toString();
		            try{m+=s1.split(".")[1].length}catch(e){}
		            try{m+=s2.split(".")[1].length}catch(e){}
		            curGoods.total = (Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)).toFixed(2)
				}
				/*if(param.num){
					curGoods.num = param.num;
				}else{
					curGoods.num = 1;
				}*/
				if(parseFloat(curGoods.originalprice)>0){
					curGoods._discount = (curGoods.saleprice/curGoods.originalprice*100).toFixed(2);
				}else{
					curGoods._discount = '100.00';
				}
				curGoods.goods_discount_rate = (curGoods._discount/100).toFixed(4);
				state.cartList.splice(0,0,curGoods)
	    	}else if(param.type == 'add'){
	    		let index = param.index;
				let curGoods = state.cartList[index];
	    		curGoods.num++;
				curGoods.total = (curGoods.num * curGoods.saleprice).toFixed(2);
				state.cartList[index] = curGoods;
	    	}else if(param.type == 'reduce'){
	    		let index = param.index;
				let curGoods = state.cartList[index];
	    		curGoods.num--;
	    		curGoods.total = (curGoods.num * curGoods.saleprice).toFixed(2);
	    		if(curGoods.num<=0){
		    		state.cartList.splice(index,1)
		    	}else{
			    	state.cartList[index] = curGoods;
			    }
	    	}else if(param.type == 'delete'){
	    		let index = param.index;
	    		state.cartList.splice(index,1)
	    	}else if(param.type == 'empty'){
	    		state.cartList = [];
	    		// this.$message({ type: 'success', message: '删除成功!'});
	    	}else if(param.type = 'pickUp'){
	    		state.cartList = param.goodsList;
	    	}
	    	localStorage.cartList = JSON.stringify(state.cartList);
	    	this.commit('getTotal')
	    },
	    loading(state,status){
			if(status.type){
				state.loadingConfig.status = true;
				setTimeout(() => {
					state.loadingConfig.status = false;
		        }, 10000);
	    	}else{
	    		state.loadingConfig.status = false;
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
	},
	actions:{
		/* increment({commit}){
	      commit("INCREMENT")
	    }*/
	}
})

export default store