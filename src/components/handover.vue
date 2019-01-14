<template>
    <div class="handover">
        <el-container>
            <el-header style="background-color:#fff;">
                <div style="background-color: #fff;padding: 0">
                    <span class="pickerLabel">开始时间：</span>
                    <el-date-picker v-model="start_time" type="datetime" placeholder="选择日期时间" default-time="12:00:00" :clearable="false"></el-date-picker>
                    <span class="pickerLabel" style="margin-left:20px;">结束时间：</span>
                    <el-date-picker disabled v-model="end_time" type="datetime" placeholder="选择日期时间" default-time="12:00:00" :clearable="false"></el-date-picker @change="handoverFunc('reSearch')">
                    <el-button type="primary" style="margin-left:10px;" @click="handoverFunc('reSearch')">对账</el-button>
                    <el-button type="primary" style="margin-left:10px;" @click="print()">打印</el-button>
                </div>
            </el-header>
            <el-main style="padding:10px;background-color:#fff;">
                <receiptModal ref="receiptModal" :printData="printData"></receiptModal>
            </el-main>
            <el-footer style="padding:10px;background-color:#fff;text-align:center;">
                <el-button style="width:160px;" @click="quit" type="danger" round>交班并退出系统</el-button>
            </el-footer>
        </el-container>
    </div>
</template>
<style type="text/css">
    .handover{width: 100%;height:100%;}
    .handover .el-container{width: 100%;height:100%;padding: 10px;}
    .handover .el-header{padding:10px;border-bottom: 1px solid #e6edf5}
    .handover .pickerLabel{font-size: 14px;color: grey;display: inline-block;width: 80px;text-align: center;}
    .handover .el-date-editor{width: 199px;}

    .handover .receiptModel{position: relative;right: 0;left: 0;bottom: 0;display: inline-block;}
</style>
<script type="text/ecmascript-6">
    import receiptModal from "./setUp/receiptModal"
    export default {
        // name:'handover',
        components: {
            'receiptModal': receiptModal
        },
        data(){
            return {
                start_time:this.$store.state.loginData.update_time,
                end_time:'',
                printData:{
                    setupData:null,
                    initData:{
                        ifShow:1,
                        ifReprint:false,
                        printType:'statement'//对账
                    },
                    statementData:null,
                }
            }
        },
        watch:{
            'curVip':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    this.callbackFunc(this.getDataList);
                },
                deep: true    //深度监听
            },
            $route(to,from){
                console.log(to.path);
                if(to.path == '/handover'){
                    this.userAccount = null;
                    this.initComp();
                }
            },
        },
        mounted:function(){
            this.initComp();
        },
        methods:{
            // 打印小票
            print(){
                this.$refs.receiptModal.print();
            },
            // 初始化组件
            initComp(){
                this.end_time = this.formatTime();
                this.handoverFunc();
                this.$refs.receiptModal.getConfig();//获取最新的小票配置
            },
            handoverFunc(_type){
                if(!this.start_time||!this.start_time){
                    this.showModal('请选择对账时间');
                    return '';
                }
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'info',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    start_time:this.start_time,
                    end_time:this.end_time,
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.Changeshifts}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data.code==1){
                        this.printData.statementData = res.data.data;
                        this.printData.statementData.store_name = this.$store.state.loginData.store_name;//门店名称
                        this.printData.statementData.handoverTime = this.end_time;//对账时间
                        this.printData.statementData.realname = this.$store.state.loginData.realname;//收银员姓名
                    }else{
                        if(_type=='reSearch') this.showModal(res.data.msg)
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 退出
            quit(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'add',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    start_time:this.start_time,
                    end_time:this.end_time,
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.Changeshifts}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data.code==1){
                        this.$store.commit('setLoginData','');
                        localStorage.removeItem("loginData");
                        localStorage.removeItem("useVip");
                    }
                    this.showModal(res.data.msg)
                }, (res) => {
                    console.log(res)
                });
            },
            showModal(cont,title,_callback){
                this.$alert(cont, title||'提示', {
                    confirmButtonText: '确定',
                    callback: action => {if(_callback)_callback()}
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
                return `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day} ${hour<10?'0'+hour:hour}:${minute<10?'0'+minute:minute}:${second<10?'0'+second:second}`
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