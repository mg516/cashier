<!-- 
    小票设置
 -->
<template>
    <div id="handleSetup">
        <el-container>
            <div class="setupDataBox">
                <el-form ref="setupData" v-model="setupData" label-width="80px">
                    <el-form-item label="结算之后自动关闭窗口">
                        <el-switch v-model="setupData.ifReturnPage"></el-switch>
                    </el-form-item>
                    <el-form-item label="结算之后关闭窗口延迟">
                        <el-input style="width:90px;" :disabled="setupData.ifReturnPage?false:true" v-model="setupData.returnCD" placeholder="停留时间"></el-input>
                        <span style="font-size:14px;color:#606266;">s（0-10秒）</span>
                    </el-form-item>
                    <!-- <el-form-item label="结算之后关闭窗口延迟">
                        <el-input ref="COM2" style="width:90px;" v-model="setupData.portData" placeholder="停留时间"></el-input>
                        <el-button @click='getPortData'>获取串口数据</el-button>
                        <el-input @focus="write()"></el-input>
                        <el-input @focus="read()"></el-input>
                        <el-input @focus="write200()"></el-input>
                    </el-form-item> -->
                </el-form>
            </div>
        </el-container>
    </div>
</template>
<style type="text/css">
    #handleSetup>.el-container{padding: 10px 10px;height: 100%;}
    .setupDataBox .el-form-item>label{width: 160px!important;}
    .setupDataBox .el-form-item>.el-form-item__content{margin-left: 160px!important;}
</style>
<script type="text/ecmascript-6">
    import {getLodop} from '../../static/LodopFuncs.js'
    export default{
        name:'handleSetup',
        data(){
            return{
                setupData:{
                    ifReturnPage:false,//结算之后自动关闭窗口
                    returnCD:'2',//结算后关闭延迟，单位s
                    portData:null
                }
            }
        },
        watch:{
            'setupData': {
                handler(val,oldVal){
                    localStorage.setupData = JSON.stringify(val)
                },
                deep: true
            },
            'setupData.returnCD':function(val,oldval){
                if(this.setupData.ifReturnPage && (isNaN(val) || val>10 || val<0)){
                    setTimeout(()=>{
                        this.$set(this.setupData,'returnCD',oldval);
                    },1)
                }
            }
        },
        methods:{
            reload(){
                this.getSetupData()
            },
            // 从缓存获取配置数据
            getSetupData(){
                if(localStorage.setupData)
                    this.setupData = JSON.parse(localStorage.setupData)
            },
            confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
            },
            getPortData(){
                var LODOP = getLodop();
                LODOP.On_Return_Remain = true;
                LODOP.On_Return=(TaskID,Value)=>{
                    debugger
                    this.$refs.COM2.value=Value;
                }; 
                // let a = LODOP.READ_PORT_DATA("LPT1");
                LODOP.READ_PORT_DATA("COM2");
            },
            write(){
                var LODOP = getLodop();
                LODOP.On_Return=(TaskID,Value)=>{
                    debugger
                    console.log(TaskID,Value)
                };
                LODOP.WRITE_PORT_DATA("COM1","mode com1:2400,n,8,1,2000,1000")
                var i = 1;
                while(i<30){
                    LODOP.WRITE_PORT_DATA("COM1","Hello")
                    i++
                }
            },
            read(){
                var LODOP = getLodop();
                LODOP.On_Return_Remain = true;
                LODOP.On_Return=(TaskID,Value)=>{
                    debugger
                    if(Value==""){
                        LODOP.READ_PORT_DATA("COM1");
                    }else{
                        console.log("ok",TaskID,Value)
                    }
                };
                LODOP.READ_PORT_DATA("COM1");
            },
            write200(){
                var LODOP = getLodop();
                LODOP.On_Return=(TaskID,Value)=>{
                    debugger
                    console.log("ok",TaskID,Value)
                };
                LODOP.READ_PORT_DATA("COM1" + String.fromCharCode(10) + "mode com1:2400,n,8,1,2000,1000\nSleep:200\nIamGoodMan");
            },
        },
        mounted:function(){
            // this.getConfig()
        }
    }
</script>