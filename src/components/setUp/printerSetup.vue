<!-- 
    打印设置
 -->
<template>
    <div id="printerSetup">
        <el-container>
            <el-aside>
                <div>当前打印机：{{curPrint}}</div>
                <!-- <span>当前打印机：{{curPrint}}</span> -->
                <el-table :data="printerList" height="430" border style="width: 100%" @current-change="changeCurOrder" highlight-current-row>
                    <el-table-column prop="date" label="行号" width="50" type=index></el-table-column>
                    <el-table-column prop="name" label="打印机名称"></el-table-column>
                </el-table>
                <el-button type="primary" :disabled="!checkPrint" @click='savePrint'>保存</el-button>
            </el-aside>
        </el-container>
    </div>
</template>
<style type="text/css">
#printerSetup{height:100%;overflow: auto;}
#printerSetup>.el-container{padding: 20px 10px;height: 100%;min-height: 560px;}
#printerSetup .el-table{margin: 20px 0;}
#printerSetup .el-aside{min-height: 530px;}
</style>
<!-- <script type="text/javascript" src="/src/static/softkeys/softkeys.js"></script> -->
<script type="text/ecmascript-6">
    import {getLodop} from '../../static/LodopFuncs.js'
    export default{
        name:'printerSetup',
        data(){
            return{
                printerList:null,
                checkPrint:null,
                curPrint:null
            }
        },
        watch:{
            curPrint:function(val,oldval){
                console.log(val)
            }
        },
        methods:{
            reload(){
                this.getPrinterList();
            },
            changeCurOrder(val){
                this.checkPrint = val.name;
            },
            // 获取打印机列表
            getPrinterList(){
                let LODOP=getLodop();
                if(LODOP){
                    let printerList = LODOP.Printers.list;
                    this.printerList = printerList;
                }
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'getPrintName',
                    access_token:loginData.access_token,//loginData.access_token,
                    // access_token:'39454ad13b85965ed40d3632b7de212f',//loginData.access_token,
                    member_id:loginData.id
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.print}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data){
                        if(res.data.data&&res.data.data.print_name){
                            this.curPrint = res.data.data.print_name;
                        }else{
                            this.confirm(res.data.msg)
                        }
                    }else{
                        this.confirm('获取打印机失败')
                    }
                }, (res) => {
                    console.log(res)
                });
                // this.getPrintName();
            },
            savePrint(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'savePrint',
                    // access_token:'39454ad13b85965ed40d3632b7de212f',//loginData.access_token,
                    access_token:loginData.access_token,//loginData.access_token,
                    member_id:loginData.id,
                    print_name:this.checkPrint
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.print}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data){
                        this.confirm(res.data.msg)
                        this.getPrintName()
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 获取当前已选打印机
            getPrintName(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'getPrintName',
                    // access_token:'39454ad13b85965ed40d3632b7de212f',//loginData.access_token,
                    access_token:loginData.access_token,//loginData.access_token,
                    member_id:loginData.id
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.print}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data){
                        if(res.data.data&&res.data.data.print_name){
                            this.curPrint = res.data.data.print_name;
                        }else{
                            this.confirm(res.data.msg)
                        }
                    }else{
                        this.confirm('获取打印机失败')
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 保存选中打印机
            confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
            },
        },
        mounted:function(){
            // this.getPrinterList()
        }
    }
</script>