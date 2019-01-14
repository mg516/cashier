<template>
    <div class="checkPowerComp">
        <el-dialog width="30%" :title="'该设备没有'+checkInfo.msg+'权限'" :visible.sync="ifDevicePower" append-to-body>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ifDevicePower = false;">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog width="30%" :title="'您没有'+checkInfo.msg+'的权限，是否选择他人授权？'" :visible.sync="ifCheckPower" append-to-body>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ifCheckPower = false">取 消</el-button>
                <el-button type="primary" @click="checkPower = true;ifCheckPower=false">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog width="360px" title="权限授权" :visible.sync="checkPower" append-to-body>
            <div>
                <div class="login_item">
                    <el-input ref="powername" placeholder="请输入账号" v-model="power.power_name" clearable @keyup.enter.native="checkPowerFunc"></el-input>
                </div>
                <div class="login_item">
                    <el-input placeholder="请输入密码" v-model="power.power_password" type="password" clearable @keyup.enter.native="checkPowerFunc"></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="checkPower = false">取 消</el-button>
                <el-button type="primary" @click="checkPowerFunc()">确定</el-button>
            </div>
        </el-dialog>
        <input hidden ref='BIOS' v-model="power.BIOS">
        <input hidden ref='CSName' v-model="power.CSName">
        <input hidden ref='MAC' v-model="power.MAC">
    </div>
</template>
<!-- 未使用 -->
<script type="text/javascript">
    import {getLodop} from '../../static/LodopFuncs.js'
    export default {
        name:'checkPowerComp',
        props:["checkInfo"],
        data(){
            return{
                ifDevicePower:false,//设备没有权限
                ifCheckPower:false,
                checkPower:false,
                power:{
                    power_name:'',
                    power_password:'',
                    MAC:'',
                },
            }
        },
        watch:{
            checkPower(val){
                if(val) {
                    setTimeout(()=>{
                        this.$refs.powername.focus();
                    },0)
                }
            }
        },
        methods:{
            initComp(){
                this.checkPower = false;
                this.power = {
                    power_name:'',
                    power_password:''
                }
            },
            // 判断输入的账号是否有权限
            checkPowerFunc(){
                if(!this.power.power_name || !this.power.power_password){
                    this.confirm('请补全登录信息');
                    return '';
                }
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'discountPower',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    power_name:this.power.power_name,
                    power_password:this.power.power_password,
                    rule_id:this.checkInfo.rule_id
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                    if(res.data && res.data.data){
                        if(res.data.data.discountPower == 1){
                            this.$emit("successBack",res,this.power)
                        }else{
                            this.$emit("failBack",res)
                        }
                    }else{
                        this.$emit("failBack",res)
                    }
                    this.initComp()
                }, (res) => {
                    console.log(res)
                    this.initComp()
                });
            },
            ifHasPowerFunc(ifOnce){
                let loginData = this.$store.state.loginData;
                let param = {
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    rule_id:this.checkInfo.rule_id,
                }
                if(this.checkInfo.msg=='会员充值') param.action = 'onlyrechargePower';
                else param.action = 'discountPower';
                if(localStorage.BIOS && localStorage.CSName && localStorage.MAC){
                    param.b_code = localStorage.BIOS + localStorage.MAC;
                    param.d_name = localStorage.CSName;
                    // param.m_code = localStorage.MAC;
                }else{
                    // 已经请求了一次设备参数
                    if(ifOnce=='again'){
                        this.showMsg('未识别到设备信息，请刷新页面或者重启（C-LODOP）客户端')
                    }else{
                        this.ifHasPower();
                    }
                    return '';
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data.data.device_power==0){
                        this.ifDevicePower = true;
                    }else if(res.data && res.data.data && res.data.data.discountPower==1){
                        this.$emit('successBack',res)
                    }else{
                        if(this.checkInfo.ifAsk) this.ifCheckPower = true;
                        else this.checkPower = true;
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 判断登陆账号是否有权限
            ifHasPower(){
                // debugger
                // 获取设备参数
                if(localStorage.BIOS && localStorage.CSName && localStorage.MAC){
                    this.ifHasPowerFunc()
                }else{
                    let systemList = [
                        {strINFOType:'BIOS.SerialNumber',object:this.$refs.BIOS,attr:'BIOS'},
                        {strINFOType:'OperatingSystem.CSName',object:this.$refs.CSName,attr:'CSName'},
                        {strINFOType:'NetworkAdapter.1.PhysicalAddress',object:this.$refs.MAC,attr:'MAC'},
                    ]
                    this.getSystemInfo(systemList,'',this.ifHasPowerFunc);
                }
            },
            getSystemInfo(systemList,_index,callback){
                let index = _index||0;
                if(index>=systemList.length){
                    if(callback)callback('again');
                    return '';
                }
                let LODOP=getLodop(); 
                if (LODOP.CVERSION) CLODOP.On_Return=(TaskID,Value)=>{
                    if (systemList[index].object){
                        // console.log(systemList[index].object,Value,systemList[index].attr)
                        systemList[index].object.value=Value;
                        // this.login[systemList[index].attr] = Value;
                        localStorage[systemList[index].attr] = Value;
                    }
                    this.getSystemInfo(systemList,++index,callback)
                }; 
                var strResult=LODOP.GET_SYSTEM_INFO(systemList[index].strINFOType);
                if (!LODOP.CVERSION) return strResult; else return "";
            },
            confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
            },
        }
    }
</script>