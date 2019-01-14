<!-- 
    小票设置
 -->
<template>
    <div id="receiptSetup">
        <el-container>
            <el-main>
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item title="小票模板" name="1">
                        <el-radio-group v-model="form.mb_name">
                            <el-radio label="58mm纸(32字宽)"></el-radio>
                        </el-radio-group>
                    </el-collapse-item>
                    <el-collapse-item title="小票参数" name="2">
                        <span>票尾需打印的行数：　</span><el-input v-model="form.xp_hnum"></el-input><br><br>
                        <span>小票需打印的份数：　</span><el-input v-model="form.xp_fnum" disabled></el-input>
                    </el-collapse-item>
                    <el-collapse-item title="个性设置" name="3">
                        <span>打印货号：　</span><el-switch v-model="form.bar_code" key='1'></el-switch><br><br>
                        <span>打印大号标题：　</span><el-switch v-model="form.xp_big_title"></el-switch><br><br>
                        <span>收货信息：　</span><el-switch v-model="form.xp_sh_info" :disabled="form.xp_sh_info?true:false"></el-switch><br><br>
                        <span>小票打印会员名称：　</span><el-switch v-model="form.hy_name" :disabled="form.hy_name?true:false"></el-switch><br><br>
                        <span>小票打印会员地址：　</span><el-switch v-model="form.hy_address" :disabled="form.hy_address?true:false"></el-switch><br><br>
                        <span>小票打印营业员信息：　</span><el-switch v-model="form.yy_info" :disabled="form.yy_info?true:false"></el-switch>
                    </el-collapse-item>
                    <el-collapse-item title="票头票尾设置" name="4">
                        <span>小票标题：　</span><el-input v-model="form.xp_title" disabled></el-input><br><br>
                        <span>门店信息：　</span><el-input v-model="form.md_info"></el-input><br><br>
                        <span>票尾信息一：　</span><el-input v-model="form.footer1"></el-input><br><br>
                        <span>票尾信息二：　</span><el-input v-model="form.footer2"></el-input><br><br>
                        <span>票尾信息三：　</span><el-input v-model="form.footer3"></el-input><br><br>
                        <span>票尾信息四：　</span><el-input v-model="form.footer4"></el-input><br><br>
                        <span>票尾信息五：　</span><el-input v-model="form.footer5"></el-input>
                    </el-collapse-item>
                    <el-collapse-item title="小票打印条目设置" name="5">
                        <span>品名：　</span><el-switch v-model="form.name" :disabled="form.name?true:false"></el-switch><br><br>
                        <span>数量：　</span><el-switch v-model="form.num" :disabled="form.num?true:false"></el-switch><br><br>
                        <span>单价：　</span><el-switch v-model="form.price" :disabled="form.price?true:false"></el-switch><br><br>
                        <span>小计：　</span><el-switch v-model="form.total_price" :disabled="form.total_price?true:false"></el-switch><br><br>
                        <span>付款/找零提示：　</span><el-switch v-model="form.fk_tishi" disabled></el-switch><br><br>
                        <span>付款/找零名称：　</span><el-switch v-model="form.fk_name" disabled></el-switch><br><br>
                        <span>付款/找零金额：　</span><el-switch v-model="form.fk_total_price" disabled></el-switch><br><br>
                    </el-collapse-item>
                    <el-collapse-item title="自定义小票商品栏（单位：字符）" name="6">
                        <span>小票总宽：　</span><el-input v-model="form.xpz_width"></el-input><span style="padding-left:10px;">建议尺寸：50</span><br><br>
                        <span>品名字宽：　</span><el-input v-model="form.name_width" disabled></el-input><br><br>
                        <span>数量字宽：　</span><el-input v-model="form.num_width" disabled></el-input><br><br>
                        <span>单价字宽：　</span><el-input v-model="form.price_width" disabled></el-input><br><br>
                        <span>小计字宽：　</span><el-input v-model="form.total_price_width" disabled></el-input>
                    </el-collapse-item>
                    <!-- <el-collapse-item title="自定义小票票尾栏（单位：字符）" name="7">
                        <span>提示字宽：　</span><el-input v-model="form.footerLine"></el-input><br><br>
                        <span>付款方式：　</span><el-input v-model="form.footerLine"></el-input><br><br>
                        <span>金额字宽：　</span><el-input v-model="form.footerLine"></el-input>
                    </el-collapse-item> -->
                </el-collapse>
            </el-main>
            <el-aside style="width:380px;position:relation;">
                <receiptModal ref="receiptModal" :printData="printData"></receiptModal>
                <el-button type="primary" class="receiptSave" @click="save()">保存</el-button>
                <el-button class="receiptPrint" @click="print">打印</el-button>
            </el-aside>
        </el-container>
    </div>
</template>
<!-- <script type="text/javascript" src="/src/static/softkeys/softkeys.js"></script> -->
<script type="text/ecmascript-6">
    import {getLodop} from '../../static/LodopFuncs.js'
    import receiptModal from "./receiptModal"
    export default{
        name:'receiptSetup',
        components: {
            'receiptModal': receiptModal
        },
        data(){
            return{
                activeNames:['1','2','3','4','5','6','7'],
                form:{
                    mb_name:'58mm纸(32字宽)',//模板名称 string
                    xp_hnum:1,//行数 string
                    xp_fnum:1,//份数 string
                    bar_code:false,//货号 bealoon 
                    xp_big_title:true,//大标题 bealoon 
                    xp_sh_info:true,// 收货信息 bealoon 
                    hy_name:true,//会员名 bealoon 
                    hy_address:true,//会员地址 bealoon 
                    yy_info:true,//营业员信息 bealoon 
                    xp_title:'青蛙家',//小票标题 string
                    md_info:null,//门店信息 string
                    footer1:'欢迎您再次光临青蛙家',//票尾信息1 string
                    footer2:null,//票尾信息2 string
                    footer3:null,//票尾信息3 string
                    footer4:null,//票尾信息4 string
                    footer5:null,//票尾信息5 string
                    name:true,//品名 bealoon 
                    num:true,//数量 bealoon 
                    price:true,//价格 bealoon 
                    total_price:true,//小计 bealoon 
                    fk_tishi:true,//付款/找零提示 bealoon 
                    fk_name:true,//付款/名称 bealoon 
                    fk_total_price:true,//付款/金额 bealoon 
                    // sn_code:null,//条码
                    xpz_width:50,//小票总宽度 string
                    name_width:0,//品名宽度 string
                    num_width:0,//数量字宽 string
                    price_width:0,//价格宽度 string
                    total_price_width:0,//小计字宽 string
                },
                printData:{
                    setupData:null,
                    initData:{
                        ifShow:1,
                        ifReprint:false,
                        printType:'pay'
                    },
                    orderData:{//模板数据(假数据)
                        orderId:'876114311313467',
                        order_over_time:'2018-10-23 18:49:25',
                        receivable:'59.20',
                        cash:'20',
                        weip:'40',
                        change:'0.80',
                        totalNum:6,
                        goods:[
                            {name:'土豆',bar_code:'51513443',num:3,total:'35.60',originalprice:'12.80',saleprice:'12.80'},
                            {name:'土豆',bar_code:'51513443',num:1,total:'5.60',originalprice:'2.72',saleprice:'2.72'},
                        ]
                    },
                    userData:{//模板数据(假数据)
                        sh_address:'湖北省 武汉市 武汉县 武汉街道 20号',
                        name:'张三',
                        province_name:'广东省',
                        city_name:'深圳市',
                        mobile:'185****3369'
                    },
                }
            }
        },
        watch:{
            'form':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    this.printData.setupData = newValue;
                },
                deep: true    //深度监听
            },
        },
        methods:{
            reload(){
                this.getConfig()
            },
            handleChange(val){
                console.log(val);
            },
            // 保存小票配置
            save(_type){
                let loginData = this.$store.state.loginData;
                let form = Object.assign({},this.form);
                form.bar_code?form.bar_code=1:form.bar_code=0;
                form.xp_big_title?form.xp_big_title=1:form.xp_big_title=0;
                form.xp_sh_info?form.xp_sh_info=1:form.xp_sh_info=0;
                form.hy_name?form.hy_name=1:form.hy_name=0;
                form.hy_address?form.hy_address=1:form.hy_address=0;
                form.yy_info?form.yy_info=1:form.yy_info=0;
                form.name?form.name=1:form.name=0;
                form.num?form.num=1:form.num=0;
                form.price?form.price=1:form.price=0;
                form.total_price?form.total_price=1:form.total_price=0;
                form.fk_tishi?form.fk_tishi=1:form.fk_tishi=0;
                form.fk_name?form.fk_name=1:form.fk_name=0;
                form.fk_total_price?form.fk_total_price=1:form.fk_total_price=0;
                let param = {
                    action:'saveXiaoPiao',
                    access_token:loginData.access_token,//loginData.access_token,
                    // access_token:'39454ad13b85965ed40d3632b7de212f',//loginData.access_token,
                    member_id:loginData.id,
                    xp_set:form
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.print}`, param).then((res) => {
                    if(res.data.code==1){
                        if(!_type) this.confirm(res.data.msg)
                    }else{
                        this.confirm('保存小票设置失败')
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            getConfig(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'getSetInfo',
                    access_token:loginData.access_token,//loginData.access_token,
                    // access_token:'39454ad13b85965ed40d3632b7de212f',//loginData.access_token,
                    member_id:loginData.id
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.print}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data.code==1){
                        if(res.data.data){
                            let form = res.data.data;
                            form.bar_code==1?form.bar_code=true:form.bar_code=false;
                            form.xp_big_title==1?form.xp_big_title=true:form.xp_big_title=false;
                            form.xp_sh_info==1?form.xp_sh_info=true:form.xp_sh_info=false;
                            form.hy_name==1?form.hy_name=true:form.hy_name=false;
                            form.hy_address==1?form.hy_address=true:form.hy_address=false;
                            form.yy_info==1?form.yy_info=true:form.yy_info=false;
                            form.name==1?form.name=true:form.name=false;
                            form.num==1?form.num=true:form.num=false;
                            form.price==1?form.price=true:form.price=false;
                            form.total_price==1?form.total_price=true:form.total_price=false;
                            form.fk_tishi==1?form.fk_tishi=true:form.fk_tishi=false;
                            form.fk_name==1?form.fk_name=true:form.fk_name=false;
                            form.fk_total_price==1?form.fk_total_price=true:form.fk_total_price=false;
                            this.form = form;
                        }else{
                            this.confirm(res.data.msg)
                        }
                    }else if(res.data.code==1800002){
                        this.save('init');
                    }else{
                        this.confirm('获取小票配置失败')
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 打印小票
            print(){
                this.$refs.receiptModal.print();
            },
            confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
            },
        },
        mounted:function(){
            // this.getConfig()
        }
    }
</script>