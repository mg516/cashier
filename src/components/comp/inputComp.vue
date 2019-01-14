<!-- 使用方法 -->
<!-- 1.引入组件：
	import inputComp from "./inputComp/inputComp"
 -->
<!-- 2.注册组件
	export default {
    	components: {
            'inputComp': inputComp
        }
    }
	-->
<!-- 3.传入输入框尺寸和变量
	data(){
        return {
        	inputCompSize:{//input模板数据
                width:'300',
                height:'40'
            },
            inputCurMoney:{
        		type:'curMoney',//输入框值类型，用于对应返回值（针对页面引入多次该组件的情况.必填）
        		status:true,//是否可编辑
        		value:null //模态框里的金额
        	},
        	inputCurNum:{
        		type:'curNum',//输入框值类型，用于对应返回值（针对页面引入多次该组件的情况.必填）
        		status:true,//是否可编辑
        		value:null //模态框里的重量
        	},
        }
    }
 -->
<!-- 4.获取输入框回调方法
	methods:{
		inputInfo(msg){
			console.log(msg)
			if(msg.type=='curNum'){
				this.inputCurNum.value = msg.value;
				this.changeCurNum(this.inputCurNum.value)
			}else if(msg.type=='curMoney'){
				this.inputCurMoney.value = msg.value;
			}
		},
 -->
<!-- 5.使用组件，示例
	<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputCurMoney"></inputComp>
	<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputCurNum"></inputComp>
 -->
<template>
	<div ref='softkeyBox' class="softkeyBox">
        <div class="inputBox">
            <!-- <div ref="inputVal" class="input">{{inputCompValue.value}}</div> -->
            <input type="password" name="password" autocomplete="off" hidden>
            <input ref='cInput' class="input" name="password" autocomplete="off" :type="inputCompValue.typeName=='password'?'password':'text'" @blur="inputCompValue.focus = false" v-to-focus="inputCompValue.focus" v-model="inputCompValue.value" @keyup="changeValue" :disabled="!inputCompValue.status" @keyup.enter="enterOk">
            <div v-show="inputCompValue.statusKey" ref="keyIcon" class="keyIcon" @click="showKey"><img src="./../../assets/keyIcon.png"></div>
        </div>
        <!-- <div class="softkeys" ref="keyBlock" v-show="ifShowKey" data-target="input[name='code']">
            <div class="ul" v-for="layoutItem,index in layout" :key="index">
                <li v-for="keyItem,index in layoutItem" class="softkeys__btn" data-type="symbol">
                    <span v-if="typeof keyItem == 'object'" @click="push(keyItem[0])">{{keyItem[0]}}</span>
                    <span v-if="typeof keyItem == 'string'" @click="push(keyItem)">{{keyItem}}</span>
                </li>
            </div>
        </div> -->
        <div class="softkeys" ref="keyBlock" v-show="ifShowKey" data-target="input[name='code']">
            <div class="ul" v-for="layoutItem,index in layout1" :key="index">
                <li v-for="keyItem,index in layoutItem" class="softkeys__btn" data-type="symbol">
                    <span v-if="typeof keyItem == 'object'" @click="push(keyItem[1])">{{keyItem[0]}}</span>
                    <span v-if="typeof keyItem == 'string'" @click="push(keyItem)">{{keyItem}}</span>
                </li>
            </div>
        </div>
        <div class="bg" v-show="ifShowKey" @click='hiddenKey'></div>
    </div>
</template>
<style type="text/css">
	@import "./../../static/softkeys/softkeys.css";
	.bg{position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 1;}
    .softkeyBox{position: relative;display: inline-block;vertical-align: middle;}
    .inputBox{height: 100%;display: flex;flex-wrap: nowrap;}
    .inputBox>.input{width: 100%;line-height: 30px;border-radius: 4px;background-color: #F5F7F9;border: 1px solid #C8D3EC;font-size: 20px;font-weight: bold;padding: 0 10px;box-sizing: border-box;color: #333;text-align: right;}
    .inputBox>.input[disabled="disabled"]{color: #6D6D6D;border:0;}
    .softkeyBox>.softkeys{position: absolute;margin: 0;width: 560px;padding: 10px 10px;border-radius: 10px;background-color: #F0F0F0;color: #333;font-size: 14px;z-index: 2;}
    .keyIcon{margin-left: 6px;}
    .keyIcon>img{width: 100%;height: 100%}
    .softkeys>.ul{padding: 0;margin: 0;height: 40px;}
    .softkeys li{background-color: #fff;}
    .softkeys__btn{line-height: 30px;min-width: 20px;padding: 0;}
    .softkeys__btn>span{padding: 0 12px;}
    /*ps*/
    .softkeyBox>.softkeys{width: 280px;}
    .softkeys>.ul{height: auto;}
    .softkeys__btn>span{padding: 0;line-height: 50px;width: 60px;}
</style>
<!-- <script type="text/javascript" src="/src/static/softkeys/softkeys.js"></script> -->
<script type="text/ecmascript-6">
	export default{
		name:'inputComp',
		props:["inputCompSize","inputCompValue"],
		data(){
			return{
				ifShowKey: false,
				layout : [
	                [
	                    ['`','~'],['1','!'],['2','@'],['3','#'],['4','$'],['5','%'],['6','^'],['7','&amp;'],['8','*'],['9','('],['0',')'],['-', '_'],['=','+'],'delete'
	                ],
	                [
	                    'q','w','e','r','t','y','u','i','o','p',['[','{'],[']','}']
	                ],
	                [
	                    '大写','a','s','d','f','g','h','j','k','l',[';',':'],["'",'&quot;'],['\\','|']
	                ],
	                [
	                    'shift','z','x','c','v','b','n','m',[',','&lt;'],['.','&gt;'],['/','?'],['@']
	                ]
	            ],
	            layout1 : [
					[
	                    ['1','1'],['2','2'],['3','3']
	                ],
					[
	                    ['4','4'],['5','5'],['6','6']
	                ],
					[
	                    ['7','7'],['8','8'],['9','9']
	                ],
					[
	                    ['.','.'],['0','0'],['×','delete']
	                ],
	            ]
			}
		},
		directives: {
			"to-focus" : function (el,binding) {
                if(binding.value){
                	setTimeout(()=>{
	                    el.focus();
	                    console.log(el)
                	},0)
                }
            }
		},
		watch:{
			// inputCompSize(val){
			// 	console.log(val)
			// 	alert(1)
			// }
		},
		methods:{
			hiddenKey(){
				this.ifShowKey = false;
			},
			showKey(){
				this.ifShowKey = !this.ifShowKey;
				this.$refs.keyBlock.style.top = this.inputCompSize.height + 'px';
			},
			push(str){
				if(!isNaN(parseInt(str)) || str=='.'){
					if(this.inputCompValue.value){
						this.inputCompValue.value = this.inputCompValue.value + str
					}else{
						this.inputCompValue.value = str
					}
				}else if(str == 'delete'){
					if(this.inputCompValue.value){
						this.inputCompValue.value = this.inputCompValue.value.substr(0,this.inputCompValue.value.length-1)
					}
				}
				this.$emit('info',this.inputCompValue);
				console.log(this.inputCompValue.value)
			},
			changeValue(){
				// 保留n位小数 n=this.inputCompSize.digitNum
				if(this.inputCompSize.digitNum){
					let msgStr = this.inputCompValue.value;
					let digitNum = parseInt(this.inputCompSize.digitNum);
					// let digitNum = 3;
	        		// 小数位超过3位
	        		if(!isNaN(msgStr) && (msgStr.indexOf('.')>=0 && msgStr.length - msgStr.indexOf('.') > (digitNum + 1))){
	        			msgStr = msgStr.substring(0,msgStr.indexOf('.') + 3)
	        			this.inputCompValue.value = msgStr;
	        		}
				}
				this.$emit('info',this.inputCompValue);
			},
			enterOk:function(){
		    	this.$emit("keyEnter",this.inputCompValue)
		    }
		},
		mounted:function(){
			this.$refs.softkeyBox.style.width = this.inputCompSize.width + 'px';
			this.$refs.softkeyBox.style.height = this.inputCompSize.height + 'px';
			this.$refs.keyIcon.style.width = this.inputCompSize.height + 'px';
			this.$refs.keyIcon.style.height = this.inputCompSize.height + 'px';
			// this.$refs.inputVal.style.lineHeight = this.inputCompSize.height + 'px';
			// this.$refs['cInput'].focus();
		}
	}
</script>