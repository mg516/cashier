<template>
    <div class="login_main" v-if="!$store.state.loginData">
        <loading :loadingConfig="$store.state.loadingConfig"></loading>
        <el-button type="primary" style="display:none;" v-loading.fullscreen.lock="$store.state.fullscreenLoading">指令方式</el-button>
        <el-container style="min-height:580px;height:100vh;">
            <el-main style="display:flex;align-items: center;justify-content:center;">
                <div class="login_box">
                    <div class="login_img"></div>
                    <div class="login_group">
                        <p>Hi，请输入您的登录信息</p>
                        <div class="login_item">
                            <img class="login_icon" src="./../../assets/login/login_icon_user.png">
                            <input type="" name="" placeholder="请输入您的账号" v-model="login.username" @keyup.enter="submitLogin">
                            <img class="delete_text" src="./../../assets/login/delete.png" v-if="login.username" @click="deleteLogin('username')">
                        </div>
                        <div class="login_item">
                            <img class="login_icon" src="./../../assets/login/login_icon_password.png">
                            <input type="" name="password" hidden>
                            <input type="password" name="" placeholder="请输入您的密码" v-model="login.password" @keyup.enter="submitLogin">
                            <img class="delete_text" src="./../../assets/login/delete.png" v-if="login.password" @click="deleteLogin('password')">
                        </div>
                        <input hidden ref='BIOS' v-model="login.BIOS">
                        <input hidden ref='CSName' v-model="login.CSName">
                        <input hidden ref='MAC' v-model="login.MAC">
                        <p style="margin:10px 0;padding:0;font-size:12px;text-indent:8px;color:#999;">友情提示：尝试五次失败会被禁止登陆</p>
                        <div class="login_submit" @click="submitLogin">登 录</div>
                    </div>
                </div>
            </el-main>
            <el-footer style="height:40px;"><div style="text-align:right;line-height:40%;">V {{$store.state.version}}</div></el-footer>
        </el-container>
    </div>
    <div style="background-color: #EBEBEB;height:100vh;" v-else>
        <loading :loadingConfig="$store.state.loadingConfig"></loading>
        <el-button type="primary" style="display:none;" v-loading.fullscreen.lock="$store.state.fullscreenLoading">指令方式</el-button>
        <div class="_headerBox" ref="_headerBox">
            <span class="checkMenu" style="float:left;width:60px;height:50px;background-color: #2A2C2E;" @click="checkMenu(ifShowMenu)">
                <img style="width: 30px;height: 30px;margin: 10px 15px" :src="ifShowMenu?require('./../../assets/menu_open.png'):require('./../../assets/menu_close.png')">
            </span>
            <span class="demonstration" style="float:left;padding-top:10px;color:white;margin-left:1%">
                <img style="width: 140px;height: 30px;" src="./../../assets/logo_store.png">
            </span>
            <span class="demonstration" style="float:left;padding:5px;color:white;margin-left:2%;width:12%">
                <el-popover placement="top" width="240" v-model="storeShow" trigger="click">
                    <div class="storeTip" style="margin: 0">
                        <h3 class="storeName">{{loginData.store_name||''}}</h3>
                        <div>门店编号：{{loginData.store_code||''}}</div>
                        <div>收银员：{{loginData.realname||''}}</div>
                        <div>上线时间：{{loginData.update_time||''}}</div>
                        <el-button type="danger" style="width:240px;margin-top:10px;" size="mini" @click="quit">退出登录</el-button>
                    </div>
                    <el-button slot="reference" type="text" style="color:#4C4C4C;">{{loginData.store_name||''}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                </el-popover>
            </span>
            <span class="_mainBoxNote">
                <el-button v-if="newVersion" class="iconButton" @click="refreshHtml()" size="small" type="danger" plain><i style="color:red;" class="icon iconfont icon-icon32"></i><span style="padding-left:4px;">有新版本 · 点击更新</span></el-button>
                <!-- <span class="noteIcon _inLine" @click="initConnection"><i style="color:red;" class="icon iconfont icon-icon32"></i><span style="color:red;font-weight:bold" class="icon-msg"></span></span> -->
                <span class="noteIcon" @click="initConnection"><i class="icon iconfont icon-lianjiezujian"></i><p>连接网络</p></span>
                <!-- <span class="noteIcon" @click="open_exe" style="color:#22B573;"><i class="icon iconfont icon-exe"></i><p>打开EXE</p></span> -->
                <span class="noteIcon" @click="downLoadTxt"><i class="icon iconfont icon-dianzicheng"></i><p>更新计价秤</p></span>
                <span class="noteIcon" @click="OpenQx"><i class="icon iconfont icon-shouyintai"></i><p>打开钱箱</p></span>
                <span class="noteIcon" @click="lockScreenFunc">
                    <i v-if="!$store.state.lockScreen" class="icon iconfont icon-kaisuo"></i>
                    <i v-else class="icon iconfont icon-bofangqi-suoping_"></i>
                    <p>锁屏</p>
                </span>
                <!-- <span class="noteIcon" @click="synchData" :style="$store.state.internetStatus?'color: #0E72FF;':'color: #D81E06;'"><i class="icon iconfont icon-tongbushezhix"></i><p>数据同步</p></span> -->
                <span class="noteIcon" @click="fullscreen"><i class="icon iconfont" :class="fullscreenStatus?'icon-tuichuquanping':'icon-fullscreen'"></i><p>{{fullscreenStatus?'取消全屏F11':'全屏F11'}}</p></span>
                <span class="noteIcon">
                    <i :style="$store.state.internetStatus?'color: #33C414;':'color: #D81E06;'" class="icon iconfont icon-xinhao1"></i>
                    <p :style="$store.state.internetStatus?'color: #33C414;':'color: #D81E06;'">{{$store.state.internetStatus?'联网状态':'断开连接'}}</p>
                </span>
            </span>
            <!-- <span class="demonstration" style="float:right;padding-top:10px;margin-right:1%">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link" style="color:white">
                    admin<i class="el-icon-caret-bottom el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item>退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </span> -->
        </div>

        <div class="_mainBox" ref="_mainBox">
            <el-container style="width: 100%;height:100%;">
                <el-aside :hidden="!ifShowMenu" style="background-color: #2A2C2E;width: 60px;overflow:hidden;">
                    <div class="menuList" v-for="item,index in menuList" :key="index" :style="item.id==selectKey?'background-color: #E6EDF5;':''" @click="handleSelect(item.id)">
                        <img style="width: 30px;height: 30px;margin: 10px" :src="item.id==selectKey?item.icon_on:item.icon_off">
                        <p :style="item.id==selectKey?'color: #2A2C2E;':'color:#fff;'" style="font-size: 12px;text-align: center;">{{item.name}}</p>
                        <el-badge :value="item.msg?item.msg:''" class="item"></el-badge>
                        <!-- <el-badge value="新" class="item"></el-badge> -->
                    </div>
                </el-aside>
                <el-main style="padding: 0;background-color: #e6edf5;">
                    <div style="width: 100%;height: 100%">
                        <transition>
                            <keep-alive exclude="test-keep-alive">
                                <router-view></router-view>
                            </keep-alive>
                        </transition>
                    </div>
                </el-main>
            </el-container>
        </div>
        <!-- 锁屏 -->
        <el-dialog width="450px" title="已锁屏" :close-on-press-escape="false" :visible.sync="$store.state.lockScreen" append-to-body :close-on-click-modal="false" :show-close="false">
            <div class="lockScreen">
                <div class="demo-input-suffix" style="margin-bottom:20px;">
                    <span>
                        <span style="display:inline-block;width:90px;">请输入密码：</span>
                        <input name="password" autocomplete="off" hidden>
                        <el-input type="password" name="" style="width:160px;" placeholder="请输入您的密码" v-model="unLockPassword" onfocus="this.removeAttribute('readonly');" @keyup.enter.native="unlockFunc"></el-input>
                    </span>
                    <input hidden ref='BIOS' v-model="login.BIOS">
                    <input hidden ref='CSName' v-model="login.CSName">
                    <input hidden ref='MAC' v-model="login.MAC">
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="unlockFunc">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style type="text/css">
    @import './../../static/iconfont/iconfont.css'
</style>
<style type="text/css">
    ._headerBox{position: fixed;top:0;left:0;z-index:1;width:100%;background-color: #fff; overflow: hidden;min-width:400px;
        -webkit-app-region: drag;}
    ._headerBox .el-button,._headerBox .noteIcon,._headerBox .checkMenu{-webkit-app-region: no-drag;}
    ._mainBox{padding-top:50px;height: 100%;box-sizing: border-box;}
    .demonstration input.el-input__inner{border:0;text-align: center;}
    ._mainBoxNote{float: right;padding: 0px;}
    .noteIcon{display: inline-block;padding: 2px 10px;font-size: 10px;text-align: center;vertical-align: top;}
    .noteIcon>.iconfont{font-size: 24px;padding: 2px;}
    .noteIcon._inLine>.iconfont{font-size: 30px;padding: 2px;line-height: 40px;vertical-align: top;}
    .noteIcon._inLine>.icon-msg{font-size: 14px;padding: 2px;line-height: 40px;vertical-align: top;color: #333;}
    /*按钮图标*/
    .iconButton{margin-top: 6px;}
    .iconButton .iconfont{font-size: 12px;}
    .screenModal{position: fixed;top: 0;left: 0;bottom: 0;right: 0;background-color: rgba(0,0,0,.6);z-index: 2;}
    .menuList{width: 54px;height: 74px;margin-bottom:10px;border-radius: 10px 0 0 10px;margin-left: 6px;position:relative;}
    .menuList .el-badge{position: absolute;top: 4px;right: 2px;}
    .menuList .el-badge .el-badge__content{border: none;}
</style>
<script type="text/ecmascript-6">
    import loading from "../comp/loading"
    import {getLodop} from '../../static/LodopFuncs.js'
    // import {Serialport} from './../../../node_modules/serialport'
    export default {
        components: {
            'loading': loading
        },
        data(){
            var vue = this;
            return {
                // codeEnter:null,
                login: {
                    username: '',
                    password: '',
                    BIOS: '',
                    CSName: '',
                    MAC: '',
                },
                loginData:null,
                storeShow:false,
                selectValue: '1',
                searchCriteria: '',
                selectKey:0,
                ifShowMenu:true,
                menuList:vue.$store.state.menuList,
                unLockPassword:'',//锁屏输入的密码
                timer:null,//心跳定时器（检测设备是否可以收到心跳）
                timer_Timeout:null,//临时定时器
                fullscreenStatus:true,//是否全屏
                newVersion:false,//是否有版本更新
            }
        },
        computed:{
            // 监听键盘Enter事件
            /*codeEnter(){
                return this.$store.state.codeEnter
            }*/
        },
        watch: {
            /*codeEnter: function(newVal, oldVal) {
                if(newVal){
                    alert(1)
                }else{
                    alert(0)
                }
            },*/
            $route(to,from){
                this.$store.commit('loading',{obj:this,type:false});
                if(to.path == '/payType'){
                    // 隐藏顶部，左侧导航
                    this.$refs._headerBox.style.display = 'none';
                    this.ifShowMenu = false;
                    this.$refs._mainBox.style.paddingTop = 0;
                }else{
                    this.$refs._headerBox.style.display = 'block';
                    this.ifShowMenu = true;
                    this.$refs._mainBox.style.paddingTop = '50px';

                    let menuList = this.$store.state.menuList;
                    for(let i=0;i<menuList.length;i++){
                        if(to.path == menuList[i].urlStr){
                            this.selectKey = menuList[i].id
                        }
                    }
                }
            },
            '$store.state.lockScreen':function(val){
                let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
            },
        },
        methods:{
            initComp(){
                this.storeShow = false;
            },
            // 数据同步（停用中）
            synchData(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'manualSynchronize',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                    this.$message.error(res.data.msg);
                }, (res) => {
                    // console.log(res)
                });
                
            },
            // 解锁
            unlockFunc(){
                let username = this.loginData.username;
                let password = this.unLockPassword;
                this.unLockPassword = null;
                if(password){
                    this.login.username = username;
                    this.login.password = password;
                    this.submitLogin('unlock');
                }else{
                    this.confirm('请输入密码')
                }
            },
            // 锁屏
            lockScreenFunc(){
                let param = {
                    key:'lockScreen',
                    val:true
                }
                this.$store.commit('saveState',param);
                localStorage.lockScreen = true;
            },
            // 退出登录
            quit(){
                this.loginData = '';
                this.$store.commit('setLoginData','');
                localStorage.removeItem("loginData");
                localStorage.removeItem("useVip");
            },
            getSystemInfo(systemList,_index,callback,_callParam){
                let index = _index||0;
                if(index>=systemList.length){
                    if(callback)callback(_callParam,'again');
                    return '';
                }
                let LODOP=getLodop(); 
                if (LODOP.CVERSION) CLODOP.On_Return=(TaskID,Value)=>{
                    // debugger
                    if (systemList[index].object){
                        // console.log(systemList[index].object,Value,systemList[index].attr)
                        systemList[index].object.value=Value;
                        // this.login[systemList[index].attr] = Value;
                        localStorage[systemList[index].attr] = Value;
                    }
                    this.getSystemInfo(systemList,++index,callback,_callParam)
                }; 
                var strResult=LODOP.GET_SYSTEM_INFO(systemList[index].strINFOType);
                if (!LODOP.CVERSION) return strResult; else return "";
            },
            submitLogin(status){
                if(localStorage.BIOS && localStorage.CSName && localStorage.MAC){
                    this.submitLoginFunc(status)
                }else{
                    let systemList = [
                        {strINFOType:'BIOS.SerialNumber',object:this.$refs.BIOS,attr:'BIOS'},
                        {strINFOType:'OperatingSystem.CSName',object:this.$refs.CSName,attr:'CSName'},
                        {strINFOType:'NetworkAdapter.1.PhysicalAddress',object:this.$refs.MAC,attr:'MAC'},
                    ]
                    this.getSystemInfo(systemList,'',this.submitLoginFunc,status);
                }
            },
            // 登录
            submitLoginFunc(status,ifOnce){
                let _status = arguments[0];
                let login = this.login;
                if(!this.fullscreenStatus) this.fullscreen();//网页全屏
                 // return '';
                if(!(login.username).replace(/\s/g,'')) {
                    this.$message.error('请输入账号');
                    return '';
                }
                if(!(login.password).replace(/\s/g,'')) {
                    this.$message.error('请输入密码');
                    return '';
                }
                let param = {
                    action:'login',
                    username:login.username,
                    password:login.password,
                    login:'firstLogin',
                    verTime:this.$store.state.verTime,
                    version:this.$store.state.version,
                }
                if(localStorage.BIOS && localStorage.CSName && localStorage.MAC){
                    param.b_code = localStorage.BIOS + localStorage.MAC;
                    param.d_name = localStorage.CSName;
                    // param.m_code = localStorage.MAC;
                }else{
                    // 已经请求了一次设备参数
                    if(ifOnce=='again'){
                        this.showMsg('未识别到设备信息，请刷新页面或者重启（C-LODOP）客户端')
                    }else{
                        this.getSystemInfo(systemList,'',this.submitLoginFunc,status);
                    }
                    return '';
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                    if(res.data.data && res.data.data.login_success && res.data.data.login_success==1){
                        if(res.data.data.gengx_status && res.data.data.gengx_status==1){
                            this.newVersion = true;
                        }
                        this.login.username = null;
                        this.login.password = null;
                        this.login.BIOS = null;
                        this.login.CSName = null;
                        if(status&&status=='unlock'){
                            // 解锁屏幕
                            let _param = {
                                key:'lockScreen',
                                val:false
                            }
                            this.$store.commit('saveState',_param);
                            localStorage.lockScreen = false;
                        }else{
                            this.handleSelect(0)//默认收银首页
                        }
                        this.loginData = res.data.data;
                        this.$store.commit('setLoginData',res.data.data);
                        localStorage.loginData = JSON.stringify(res.data.data);
                        //修改扫码状态（添加购物车）
                        let param = {
                            key:'codeStatus',
                            val:'shopping'
                        }
                        this.$store.commit('saveState',param);
                        this.initConnection()//连接网络
                        // this.fullscreen();//网页全屏
                        this.initComp();//初始化页面参数
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }, (res) => {
                    // console.log(res)
                });
            },
            // 删除登录输入框内容
            deleteLogin(loginType){
                if(loginType=='username')this.login.username = ''
                else if(loginType=='password')this.login.password = ''
            },
            checkMenu(status){
                this.ifShowMenu = !status;
            },
            handleIconClick(ev){
                // console.log(ev);
            },
            handleSelect(key){
                this.selectKey = key;
                if(key == '0'){
                    this.$route.params.canJump = true;
                    //收银
                    this.$router.push({
                        path: '/cashier',
                        params: {
                            putUpList: this.putUpList,
                        }
                    });
                }else if(key == '1'){
                    this.$route.params.canJump = true;
                    //交易查询
                    this.$router.push({
                        path: '/orderOnline',
                        // name: '要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找',
                        params: {
                            putUpList: this.putUpList,
                        }
                    })
                }else if(key == '2'){
                    this.$route.params.canJump = true;
                    //交易查询
                    this.$router.push({
                        path: '/offlineOrder',
                        // name: '要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找',
                        params: {
                            putUpList: this.putUpList,
                        }
                    })
                }else if(key == '3'){
                    this.$route.params.canJump = true;
                    this.$router.push({
                        path: '/manageVip',
                        // name: '要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找',
                        params: {
                            putUpList: this.putUpList,
                        }
                    })
                }else if(key == '4'){
                    this.$route.params.canJump = true;
                    this.$router.push({
                        path: '/pickOrder',
                        // name: '要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找',
                        params: {
                            putUpList: this.putUpList,
                        }
                    })
                }else if(key == '5'){
                    this.$route.params.canJump = true;
                    this.$router.push({
                        path: '/setup',
                        // name: '要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找',
                        params: {
                            putUpList: this.putUpList,
                        }
                    })
                }else if(key == '6'){
                    this.$route.params.canJump = true;
                    this.$router.push({
                        path: '/handover',
                        // name: '要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找',
                        params: {
                            putUpList: this.putUpList,
                        }
                    })
                }else if(key == '7'){
                    this.$route.params.canJump = true;
                    this.$router.push({
                        path: '/goods_stock',
                        // name: '要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找',
                        params: {
                            putUpList: this.putUpList,
                        }
                    })
                }
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
            downLoadTxt(){
                window.open(`${this.$store.state.host}${this.$store.state.config.download}?store_id=${this.$store.state.loginData.store_id}`,'_blank');
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
            initConnection(){
                let ws = new WebSocket("wss://msg.qingwajia.cn:8181");
                ws.onopen = () => {
                    // console.log("连接成功");
                    this.showMsg('连接网络成功','success')
                    let param3 = {key:'internetStatus',val:true};
                    this.$store.commit('saveState',param3);
                };
                ws.onmessage = (e)=> {
                     // json数据转换成js对象
                    var data = eval("("+e.data+")");
                    var type = data.msgtype || ''; 
                    // console.log(`type:${type}`)
                    // 规则：心跳10s，每12s更新一次定时器(设置2s等待，防止后台指令延迟)
                    clearTimeout(this.timer_Timeout);
                    this.timer_Timeout = setTimeout(()=>{
                        let param3 = {key:'internetStatus',val:false};
                        this.$store.commit('saveState',param3);
                        // console.log(this.$store.state.internetStatus)
                    },15000)
                    // 规则：30s重新连接一次，重连三次没有连接成功，则不再继续重连(需手动重连)
                    localStorage.heartbeatTime = 1;//心跳次数
                    localStorage.heartbeatDate = Date.parse(new Date());//心跳时间
                    clearInterval(this.timer);
                    this.timer = setInterval(()=>{
                        console.log(localStorage.heartbeatTime)
                        if(localStorage.heartbeatTime<=3){
                            localStorage.heartbeatTime = parseInt(localStorage.heartbeatTime)+1;
                            this.initConnection();
                        }else{
                            clearInterval(this.timer);
                        }
                    },30000)
                    // console.log(type)
                    // console.log(this.$store.state.internetStatus)
                    switch(type){
                        // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
                        case 'ok':
                            let param3 = {key:'internetStatus',val:true};
                            this.$store.commit('saveState',param3);
                            break; 
                        case 'init':
                            let param2 = {
                                action:'bind',
                                id:this.$store.state.loginData.id,
                                store_id:this.$store.state.loginData.store_id,
                                is_admin:this.$store.state.loginData.is_admin,
                                client_id:data.client_id,
                            };
                            // console.log(param2)

                            this.$http.post(`${this.$store.state.host}/msg/push`, param2,{
                                emulateJSON:true
                            }).then((res)=>{
                                // debugger
                              // console.log(res.data);
                            },error => {
                                // debugger
                                // console.log(error)
                            });
                            break;
                        case 'newordermsg':
                            var audio = new Audio(`${this.$store.state.host}/static/module/common/sound/neworder.mp3`);
                                audio.play();
                            // 新订单标识
                            let menuList = this.$store.state.menuList;
                            menuList[1].msg = '新';
                            let param4 = {key:'menuList',val:menuList};
                            this.$store.commit('saveState',param4);
                            //autoPlay();
                            // showNotification('订单提醒','您有新订单','https://wb.qingwajia.cn/upload/picture/20180805/fc00937d1b0ff1977f1f877bfca1394a.png');
                            break;    
                        // 当mvc框架调用GatewayClient发消息时直接alert出来
                        case 'newversionmsg':
                            if(data.version != this.$store.state.verTime){
                                this.newVersion = true;
                            }
                            break;
                        default :
                            let param1 = {key:'internetStatus',val:false};
                            this.$store.commit('saveState',param1);
                           // alert(e.data); 
                           break;
                    }
                };
            },
            // 每天第一次登录，清空缓存
            removeStorage(){
                localStorage.removeItem("loginData");
                localStorage.removeItem("cartList");
                localStorage.removeItem("useVip");
                localStorage.removeItem("lockScreen");
                localStorage.removeItem("lastOrder");
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
            // 强制刷新页面
            refreshHtml(){
                this.loginData.gengx_status = 0;
                localStorage.loginData = JSON.stringify(this.loginData);
                window.location.reload(true);
            },
            open_exe(){
                let strPath = 'file:///C:\\Users\\Lenovo8\\Desktop\\2345Pic.exe';
                try{
                    var objShell = new ActiveXObject("wscript.shell"); 
                    console.log(objShell)    
                    objShell.Run(strPath);     
                    objShell = null;     
                }catch(e){  
                    alert('找不到文件"'+strPath+'"(或它的组件之一)。请确定路径和文件名是否正确.')     
                }
            },
            // 判断全屏状态
            checkFullStatus(){
                let clientHeight = document.body.clientHeight;
                let clientWidth = document.body.clientWidth;
                var screenHeight = window.screen.height;
                var screenWidth = window.screen.width;
                if(screenWidth == clientWidth && screenHeight == clientHeight){
                    this.fullscreenStatus = true;//全屏
                }else{
                    this.fullscreenStatus = false;//非全屏
                }
            },
            // 全屏
            fullscreen(){
                if(!this.fullscreenStatus){
                    var el = document.documentElement;
                    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
                    if (rfs) { //typeof rfs != "undefined" && rfs
                        rfs.call(el);
                    } else if (typeof window.ActiveXObject != "undefined") {
                        //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
                        var wscript = new ActiveXObject("WScript.Shell");
                        if (wscript != null) {
                            wscript.SendKeys("{F11}");
                        }
                    }
                    /*var element = document.documentElement;
                    if (element.requestFullscreen) element.requestFullscreen();//W3C 
                    else if (element.mozRequestFullScreen) element.mozRequestFullScreen(); //FireFox 
                    else if (element.webkitRequestFullScreen) element.webkitRequestFullScreen(); //Chrome等 
                    else if (element.msRequestFullscreen) element.msRequestFullscreen();//IE11*/
                }else{
                    var el = document;
                    var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen;
                    if (cfs) { //typeof cfs != "undefined" && cfs
                        cfs.call(el);
                    } else if (typeof window.ActiveXObject != "undefined") {
                        //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
                        var wscript = new ActiveXObject("WScript.Shell");
                        if (wscript != null) {
                            wscript.SendKeys("{F11}");
                        }
                    }
                    /*if (document.exitFullscreen) document.exitFullscreen();
                    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                    else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
                    else if (document.msExitFullscreen) document.msExitFullscreen();*/
                }
            },
        },
        mounted:function(){
            // alert(self.location.href)
            // debugger
            /*SerialPort.list().then(
                ports => console.log(ports)
            )*/
            // console.log(`loginData:${this.$store.state.loginData}`);
            // 默认打开page1
            /*this.$store.commit('loading',{obj:this,type:false});
            if(this.selectKey == '0'){
                this.$router.push('/cashier');
            }*/
            this.handleSelect(this.selectKey)
            /*let hrefStrArr = location.href.split('/');
            let path = '/' + hrefStrArr[hrefStrArr.length-1]
            let menuList = this.$store.state.menuList;
            for(let i = 0;i<menuList.length;i++){
                // debugger
                if(menuList[i].urlStr == this.$route.path){
                    this.selectKey = menuList[i].id;
                }
            }*/

            if(localStorage.loginData){
                let _json = JSON.parse(localStorage.loginData);
                let update_time = _json.update_time;
                if(update_time.split(' ')[0] == this.formatTime()){
                    this.$store.commit('setLoginData',JSON.parse(localStorage.loginData));
                    this.loginData = this.$store.state.loginData;
                    if(this.loginData.gengx_status && this.loginData.gengx_status==1){
                        this.newVersion = true;
                    }
                    this.initConnection()//连接网络
                }else{
                    this.$store.commit('setLoginData','');
                    this.loginData = this.$store.state.loginData;
                    this.removeStorage()
                }
            }else{
                this.removeStorage()
            }
            if(localStorage.lockScreen && localStorage.lockScreen!='false'){
                let param = {
                    key:'lockScreen',
                    val:true
                }
                this.$store.commit('saveState',param);
            }
            if(!localStorage.setupData){
                localStorage.setupData = JSON.stringify(this.$store.state.setupData)
            }
            //修改扫码状态（添加购物车）
            let param = {
                key:'codeStatus',
                val:'shopping'
            }
            this.$store.commit('saveState',param);
            window.onload = (e) => {
                this.checkFullStatus()
                // this.fullscreen();//网页全屏
                // document.getElementsByClassName('login_main').onclick();
            }
            window.On_CLodop_Opened=()=>{
                let LODOP=getLodop(); 
                if (LODOP.CVERSION){
                    let systemList = [
                        {strINFOType:'BIOS.SerialNumber',object:this.$refs.BIOS,attr:'BIOS'},
                        {strINFOType:'OperatingSystem.CSName',object:this.$refs.CSName,attr:'CSName'},
                        {strINFOType:'NetworkAdapter.1.PhysicalAddress',object:this.$refs.MAC,attr:'MAC'},
                    ]
                    this.getSystemInfo(systemList,'',null,null);
                }
            }
            window.onresize=()=>{ 
                this.checkFullStatus()
            }
            /*$(window).bind('beforeunload',function(){
                return '您输入的内容尚未保存，确定离开此页面吗？';
            });*/
            Number.prototype.toFixed = function (d) {
                var s=this+""; 
                if(!d)d=0; 
                if(s.indexOf(".")==-1)s+="."; 
                s+=new Array(d+1).join("0"); 
                if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
                    var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
                    if(a==d+2){
                        a=s.match(/\d/g); 
                        if(parseInt(a[a.length-1])>4){
                            for(var i=a.length-2;i>=0;i--){
                                a[i]=parseInt(a[i])+1;
                                if(a[i]==10){
                                    a[i]=0;
                                    b=i!=1;
                                }else break;
                            }
                        }
                        s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");
                    }if(b)s=s.substr(1); 
                    return (pm+s).replace(/\.$/,"");
                }return this+"";
            };
        }
    }

  
</script>