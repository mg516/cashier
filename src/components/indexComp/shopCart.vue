<!-- 
    购物车
 -->
<template>
    <div id="shopCart">
        <el-container style="height: 100%;">
            <el-header style="padding: 0;height: 120px;">
                <div style="height: 26px;font-size: 12px;color: #fff;background-color: #6c8bd3;line-height: 26px;display: flex;">
                    <span style="width: 10%;text-align: center;">上一单</span>
                    <span style="width: 30%;text-align: center;">应收：{{lastOrder?(lastOrder.haspay).toFixed(2):'0.00'}} 元</span>
                    <span style="width: 30%;text-align: center;">实收：{{lastOrder?(lastOrder.haspay-lastOrder.giveChangeMoney||0).toFixed(2):'0.00'}}</span>
                    <span style="width: 30%;text-align: center;">找零：{{lastOrder?(0-lastOrder.giveChangeMoney||0).toFixed(2):'0.00'}}</span>
                </div>
                <div style="height: 45px;display: flex;background-color: #fff;">
                    <!-- <div style="margin:5px 2%;width: 46%;height: 30px;border-radius: 5px;border: 1px solid #6c8bd3;text-align:center;">
                        <img style="display: inline-block;vertical-align: middle;" src="./../../assets/user.png" width="14px">
                        <span style="font-size: 12px;color: #6c8bd3;line-height: 30px;">选择营业员</span>
                    </div> -->
                    <div @click="chooseVip" style="margin:5px 2%;width: 96%;height: 30px;border-radius: 5px;border: 1px solid #6c8bd3;text-align:center;">
                        <img style="display: inline-block;vertical-align: middle;" src="./../../assets/vip.png" width="14px">
                        <span style="font-size: 12px;color: #6c8bd3;line-height: 30px;" v-if="!useVip">选择会员</span>
                        <span style="font-size:12px;" v-else>
                            <span style="color: #6c8bd3;line-height: 30px;">{{useVip.name}}</span>
                            <span> （当前消费会员）</span>
                            <!-- <span v-if="useVip.customer_gift_array&&useVip.customer_gift_array.gift_status==1" style="font-weight:bold;color:#F92472;">(已领取)</span> -->
                            <span v-if="useVip.customer_gift_array&&useVip.customer_gift_array.gift_status==0" style="font-weight:bold;color:#6C8BD3;">(可用蔬菜卡)</span>
                        </span>
                    </div>
                </div>
                <div style="background-color: #fff;padding: 0 2% 10px">
                    <el-input style="width: 100%;height: 36px;" ref="searchGoodsInput" v-model="searchGoods" placeholder="请输入货号 / 商品名称 / 首字母" clearable @clear="searchPageNum=1;getGoodsList('input',searchGoods)" class="input-with-select" @keyup.enter.native="searchPageNum=1;getGoodsList('input',searchGoods)">
                        <el-button @click="searchPageNum=1;getGoodsList('input',searchGoods)" style="" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <ul class="searchGoodsBox" v-if="searchGoodsList&&searchGoodsList.length>0||searchPageNum>1">
                        <el-table :data="searchGoodsList" style="width: 100%" @current-change="clickGoods" height="369">
                            <el-table-column prop="date" label="行号" width="48px" type="index"></el-table-column>
                            <el-table-column prop="code" label="货号" width="80px"></el-table-column>
                            <el-table-column prop="name" label="品名"></el-table-column>
                            <el-table-column prop="saleprice" label="单价" width="70px"></el-table-column>
                        </el-table>
                        <div class="pageTurn">
                            <el-button :disabled="searchPageNum<=1?true:false" @click="searchGoodsFunc('-')" size="mini"><img :style="searchPageNum<=1?'opacity:.5;':''" src="./../../assets/cut_left1.png"></el-button>
                            <div class="pageNum" ref="elememt">第 {{searchPageNum}} 页 （共 {{searchPageNumMax}} 页）</div>
                            <el-button :disabled="searchPageNum>=searchPageNumMax?true:false" size="mini" @click="searchGoodsFunc('+')"><img :style="searchPageNum>=searchPageNumMax?'opacity:.5;':''" src="./../../assets/cut_right1.png"></el-button>
                        </div>
                    </ul>
                </div>
            </el-header>
            <el-main style="padding: 0;background-color: #fff;min-height: 300px">
                <div v-for="cartItem,index in $store.state.cartList" :key="index" :class="{cartItem,check:index==checkIndex}" @click="checkIt(index)">
                    <p class="title">{{index+1}}.{{cartItem.name}}</p>
                    <p class="code">{{cartItem.code||cartItem.bar_code}}</p>
                    <p class="price">单价：￥{{cartItem.saleprice}}　<span v-if="parseFloat(cartItem.saleprice)!=parseFloat(cartItem.originalprice)" style="text-decoration: line-through;">￥{{cartItem.originalprice}}</span></p>
                    <p class="totals">小计：￥{{cartItem.total}}　<span v-if="parseFloat(cartItem.saleprice)!=parseFloat(cartItem.originalprice)" style="text-decoration: line-through;">￥{{(cartItem.originalprice*cartItem.num).toFixed(2)}}</span></p>
                    <div class="numBox" v-if="cartItem.sorting_num != 1">
                        <div class="reduce" @click.stop="reduce(index)" :data-index="index">-</div>
                        <div class="num">{{cartItem.num}}</div>
                        <div class="add" @click.stop="add(index)">+</div>
                    </div>
                    <div class="numBox" v-else>
                        <div class="num">{{cartItem.num}} kg</div>
                    </div>
                    <span v-if="parseFloat(cartItem.saleprice)!=parseFloat(cartItem.originalprice)" class="goodGive">折</span>
                    <span v-if="parseFloat(cartItem.saleprice)==0" class="goodGive">赠</span>
                </div>
            </el-main>
            <el-footer style="padding: 0;height: 160px;max-height: 150px;">
                <div class="handleOrder">
                    <div class="cancel" @click="cancelCart()">
                        <img src="./../../assets/user.png" width="12px">
                        <span style="font-size: 12px;color: #6c8bd3;line-height: 30px;">整单取消</span>
                    </div>
                    <el-badge :value="putUpList.length" v-bind:hidden="putUpList.length<=0" class="item" @click.native="putUpOrder()">
                        <el-button size="small">{{$store.state.cartList.length>0?'挂单':'取单'}}</el-button>
                    </el-badge>
                </div>
                <div class="totalBox">
                    <span class="title">合计：</span>
                    <span class="num">{{$store.state.totalNum}}件</span>
                    <span class="total"><span>￥</span> {{$store.state.totalMoney}}</span>
                </div>
                <div class="bgBlock">
                    <img class="bgBlock" src="./../../assets/bgBlock.png">
                </div>
                <!-- <div class="payBox">
                    <div class="weixin">
                        <span>微信支付</span>
                    </div>
                    <div class="custom">
                        <span>自定义支付</span>
                    </div>
                    <div class="pay" @click="toPay()">
                        <span>结账</span>
                    </div>
                </div> -->
                <div class="payBox" @click="toPay()">
                    <span style="width:100%;display:block;background-color:#3B7BF6;text-align:center;font-size:14px;color:#fff;">结账</span>
                </div>
            </el-footer>
        </el-container>
        
        <!-- 选择会员窗口 putUpOrder触发-->
        <el-dialog title="会员消费" :visible.sync="vip_handle_Status" width="400px">
            <div class="dialogVipPay" style="text-align:center;min-height:80px;margin-bottom:20px;">
                <el-input :placeholder="'请输入会员卡号'+($store.state.funcSwitch.timeVip?'/手机号':'')" type="password" class="input-with-select" ref="searchVipInp" style="width:300px;margin-top:10px;" v-model="userAccount" @keyup.enter.native="searchVip" clearable>
                    <!-- <el-button slot="append" @click="duka">读卡</el-button> -->
                    <el-button slot="append" @click="searchVip">消费</el-button>
                </el-input>
                <div style="text-align:left;text-indent:30px;padding-top:10px;color:#999;" v-if="$store.state.funcSwitch.timeVip">
                    <p style="font-size:12px;">注：正式会员请通过<span style="color:#F56666;"> 实体卡 </span>或<span style="color:#F56666;"> 小程序 </span>登录</p>
                    <p style="font-size:12px;">　　手机号只可保留消费积分</p>
                </div>
            </div>
            <!-- <div slot="footer" class="dialog-footer"></div> -->
        </el-dialog>
        <!-- 挂单窗口 putUpOrder触发-->
        <el-dialog title="挂单" :visible.sync="dialogPutUp">
            <div class="dialogPutUp">
                <el-tabs v-model="putUpTableName" tab-position="left" style="height: 320px;">
                    <!-- 切换tabs的关键字，putUpTableName => name = row+index -->
                    <el-tab-pane :name="'row' + indexP" :label="indexP+1 + '. ' + putUpItem.id" v-for="putUpItem,indexP in putUpList" :key="index" style="height: 320px;">
                        <el-table :data="putUpItem.goodsList" type='indexC' style="width: 100%;" max-height="320">
                            <el-table-column prop="name" label="名称" width="200"></el-table-column>
                            <el-table-column prop="bar_code" label="商品码" width="200"></el-table-column>
                            <el-table-column prop="saleprice" label="价格" width="80"></el-table-column>
                            <el-table-column prop="unit" label="单位" width="60"></el-table-column>
                            <el-table-column label="计量" width="80">
                                <template slot-scope="scope">
                                    {{putUpItem.goodsList[scope.$index].ifWeigh?'称重':'计数'}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="num" label="数量" width="100"></el-table-column>
                            <el-table-column prop="total" label="小计" width="80"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" plain @click="delPutUp">删除</el-button>
                <el-button type="primary" plain @click="cancelPutUp">取 消</el-button>
                <el-button type="primary" @click="pickUp">确 定</el-button>
            </div>
        </el-dialog>
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
        <!-- 修改购物车商品信息的模态框 -->
        <el-dialog class="changeNumGoodsBox" :visible.sync="changeNumGoodsStatus" width="480px">
            <div style="min-height:400px;" v-if="changeNumGoodsStatus && changeNumGoodsData">
                <div class="changeGoodsMsg">
                    <div class="goodsImg"><img style="padding: 5px;width: 110px;" :src="changeNumGoodsData.thumb_url?$store.state.host+changeNumGoodsData.thumb_url:'./../../assets/logo.png'" :onerror="errorGoodsImg"></div>
                    <div class="changeGoodsDetail">
                        <p class="goodsName">{{changeNumGoodsData.name}}</p>
                        <p class="goodsCode">货号：{{changeNumGoodsData.code||changeNumGoodsData.bar_code}}</p>
                        <div class="changeNumHandle">
                            <span>单价：￥{{changeNumGoodsData.originalprice}}</span>
                            <span class="red bold">会员价：￥{{changeNumGoodsData.originalprice}}</span>
                            <el-button size="small" icon="el-icon-close" type="primary" plain @click.stop="deleteCart()">删除</el-button>
                        </div>
                    </div>
                </div>
                <div class="changeNumBox">
                    <div class="changeNumItem">
                        <span class="_inputBefore">现价</span>
                        <input @input="changeValue('saleprice')" @blur="getThisInput('saleprice')" @focus="focusInput(0)" class="_input1" type="" name="" v-model="changeNumGoodsData.saleprice" @keyup.enter="cashStr('submit')">
                        <span class="_inputAfter">￥</span>
                    </div>
                    <div class="changeNumItem">
                        <span class="_inputBefore">折扣</span>
                        <input @input="changeValue('_discount')" @blur="getThisInput('_discount')" @focus="focusInput(1)" class="_input2" type="" name="" v-model="changeNumGoodsData._discount" @keyup.enter="cashStr('submit')">
                        <span class="_inputAfter">%</span>
                    </div>
                    <div class="changeNumItem">
                        <span class="_inputBefore">数量</span>
                        <input @input="changeValue('num')" @blur="getThisInput('num')" @focus="focusInput(2)" class="_input3" type="" name="" v-model="changeNumGoodsData.num" @keyup.enter="cashStr('submit')">
                        <span class="_inputAfter">{{changeNumGoodsData.unit}}</span>
                    </div>
                    <div class="changeNumItem">
                        <span class="_inputBefore">金额</span>
                        <input @input="changeValue('total')" @blur="getThisInput('total')" @focus="focusInput(3)" class="_input4" type="" name=""  v-model="changeNumGoodsData.total" @keyup.enter="cashStr('submit')">
                        <span class="_inputAfter">￥</span>
                    </div>
                </div>
                <div class="changeBar">
                    <div class="numberBox">
                        <div @click="cashStr('7')">7</div>
                        <div @click="cashStr('8')">8</div>
                        <div @click="cashStr('9')">9</div>
                        <div @click="cashStr('4')">4</div>
                        <div @click="cashStr('5')">5</div>
                        <div @click="cashStr('6')">6</div>
                        <div @click="cashStr('1')">1</div>
                        <div @click="cashStr('2')">2</div>
                        <div @click="cashStr('3')">3</div>
                        <div @click="cashStr('00')">00</div>
                        <div @click="cashStr('0')">0</div>
                        <div @click="cashStr('.')">.</div>
                    </div>
                    <div class="handleBox">
                        <div class="bRed" @click="cashStr('give')">赠送</div>
                        <div class="bYellow" style="color:#fff;" @click="cashStr('delete')">清零</div>
                        <div @click="cashStr('submit')">确定</div>
                    </div>
                </div>
            </div>
            <el-button style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;opacity:0;" slot="reference"></el-button>
        </el-dialog>
        <!-- 促销送礼 -->
        <!-- <el-dialog class="freeGoods" :visible.sync="freeGoods" width="600px">
            <div style="min-height:200px;" v-if="freeGoods">
                <el-table :data="freeGoods" type='indexC' max-height="400">
                    <el-table-column prop="name" label="名称" width="200"></el-table-column>
                    <el-table-column prop="bar_code" label="商品码" width="200"></el-table-column>
                    <el-table-column prop="price" label="售价" width="80"></el-table-column>
                    <el-table-column prop="donate_num" label="赠送数量" width="60"></el-table-column>
                    <el-table-column label="计量" width="80">
                        <template slot-scope="scope">
                            <el-radio-group v-model="form.resource">
                                <el-radio :label="scope.goods_id"></el-radio>
                            </el-radio-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="freeGoods=null">取 消</el-button>
                <el-button type="primary" @click="freeGoods=null">确 定</el-button>
            </span>
        </el-dialog> -->
        <checkPowerComp ref="checkPowerComp" :checkInfo="checkInfo" v-on:successBack="successBack" v-on:failBack="failBack"></checkPowerComp>
    </div>
</template>
<style type="text/css">
    #shopCart{width: 100%;height: 100%;}
</style>
<script type="text/ecmascript-6">
    import inputcomp from "../comp/inputComp"
    import checkPowerComp from "../Comp/checkPower"// 权限组件参数checkInfo
    export default{
        name:'shopCart',
        components: {
            'inputComp': inputcomp,
            'checkPowerComp': checkPowerComp,
        },
        data(){
            return{
                errorGoodsImg:'this.src="' + require('./../../assets/logo.png') + '"',
                form:{
                    resource:null
                },
                freeGoods:null,//促销商品
                checkInfo:{
                    rule_id:null,//3整单打折，2单品打折
                    ifAsk:true,//弹出登录出口前是否询问
                    msg:null
                },
                power:{
                    power_name:'',
                    power_password:''
                },
                checkPowering:false,
                props: {
                    label: 'name',
                    value: 'name',
                    children: 'cities'
                },
                input2:1,
                useVip:'',//正在使用的会员
                curVip:'',//当前会员信息
                userPassword:null,//会员密码
                userAccount:null,//会员账号
                searchGoods:'',//输入的商品查询条件
                vip_handle_Status:false,//查询会员的模态框
                modalChangeNumShow:false,//修改商品数量模态框的背景
                inputCompSize:{//input模板数据
                    width:'300',
                    height:'40',
                    digitNum:'2',//两位小数
                },
                putUpTableName:'row0',//定义挂单单号 默认值
                putUpTableIndex:0,
                putUpNum:0,
                putUpList:[],

                code:'',//扫码枪扫到的商品码
                lastTime:'',//最后一次扫码的时间
                nextTime:'',//上一次扫码的时间
                lastCode:'',//上一次keydown
                nextCode:'',//
                totalNum:0,
                totalMoney:'00.00',
                cartList:[],
                changeNumModal:[],//修改购物车单品信息的模态框显示状态
                checkIndex:-1,//选中要修改的商品下标
                changeNumGoodsData:null,//选中要修改的商品数据
                changeNumGoodsStatus:false,
                curInput:-1,//修改购物车单品输入框序号
                goodsList:[],//商品列表
                searchGoodsList:[],//搜索到的商品列表
                searchLimit:5,
                searchPageNum:1,
                searchPageNumMax:0,//最大页号
                curGoods:null, //选择称重商品的当前商品
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
                lastOrder:null,//上一单数据
                payModeVal:{},
                dialogRecharge:false,// 会员充值模态框
                dialogPutUp:false,//挂单模态框
                dialogChooseGoods: false,//称重商品模态框
                woyaoquPay:false,//查到会员直接触发结算
            }
        },
        watch:{
            /*'form.resource':function(val){
                debugger
            },*/
            $route(to,from){
                console.log(to.path);
                if(to.path == '/cashier'){
                    this.initComp()//初始化组件数据
                }
            },
            changeNumGoodsStatus:function(val){
                let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
            },
            checkPowering:function(val){
                let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
            },
            vip_handle_Status:function(val){
                this.userAccount = null;
                let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
            },
            changeNumGoodsData:function(val){
                let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
            },
            dialogPutUp:function(val){
                let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
            },
            dialogChooseGoods:function(val){
                let param = {key:'getSearchFocus',val:!val};
                this.$store.commit('saveState',param);
            },
            // 编辑购物车商品信息
            'changeNumGoodsData.total':function(val,oldval){
                if(isNaN(val) || val<0) this.changeNumGoodsData.total = oldval;
            },
            'changeNumGoodsData.num':function(val,oldval){
                if(isNaN(val) || val<0) this.changeNumGoodsData.num = oldval;
            },
            'changeNumGoodsData.saleprice':function(val,oldval){
                if(isNaN(val) || val<0) this.changeNumGoodsData.saleprice = oldval;
            },
            'changeNumGoodsData._discount':function(val,oldval){
                if(isNaN(val) || val<0) this.changeNumGoodsData._discount = oldval;
                else this.changeNumGoodsData.goods_discount_rate = (val/100).toFixed(4);
            },
            'changeNumModal':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    for(let i = 0;i<newValue.length;i++){
                        if(newValue[i] == true){
                            this.modalChangeNumShow = true;
                            return '';
                            break;
                        }
                        this.modalChangeNumShow = false;
                    }
                },
                deep: true //深度监听
            }
        },
        methods:{
            initComp(){
                this.useVip = '';
                
                if(this.$store.state.getSearchFocus){
                    this.$refs['searchGoodsInput'].focus();
                }
                if(localStorage.lastOrder){
                    this.lastOrder = JSON.parse(localStorage.lastOrder);
                }
                if(localStorage.useVip){
                    localStorage.removeItem('useVip');
                    let param = {
                        key:'useVip',
                        val:null
                    }
                    this.$store.commit('saveState',param);
                    this.useVip = this.$store.state.useVip;
                }
                if(localStorage.putUpList)this.putUpList = JSON.parse(localStorage.putUpList);
                if(localStorage.putUpNum)this.putUpNum = JSON.parse(localStorage.putUpNum);
                if(localStorage.cartList){
                    let param = {
                        key:'cartList',
                        val:JSON.parse(localStorage.cartList)
                    }
                    this.$store.commit('saveState',param);
                    this.$store.commit('getTotal')
                }
            },
            // 权限校验
            checkPowerCallback(_type,callback){
                if(_type=='goods'){
                    this.checkInfo = {
                        rule_id:'2',//整单打折
                        ifAsk:true,//弹出登录出口前是否询问
                        msg:'单品折扣'
                    }
                }
                this.successBack = callback;
                setTimeout(()=>{
                    this.$refs.checkPowerComp.ifHasPower();
                },0)
            },
            // 权限校验成功回调
            successBack(){},
            // 权限校验失败回调
            failBack(res){
                this.confirm(res.data.data.message)
                // this.confirm('权限口令错误')
                this.searchGoods = '';
            },

            // 组件输入框获取焦点
            getCompFocus(){
                this.inputCurNum.focus = true;
            },
            // 选择会员
            chooseVip(){
                if(this.useVip){
                    this.$confirm('当前已使用会员卡，是否取消当前使用?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                        this.useVip = '';
                        localStorage.removeItem('useVip');
                        let param = {key:'goodsPageNum',val:this.useVip};
                        this.$store.commit('useVip',param);
                    }).catch(() => {
                      //已取消         
                    });
                }else{
                    this.vip_handle_Status = true;
                    setTimeout(()=>{
                        this.$refs.searchVipInp.focus();
                    },0)
                }
            },
            changeValue(valType){
                // debugger
                if(valType == 'saleprice'){
                    let saleprice = this.changeNumGoodsData.saleprice||0;
                    // 判断如果超过两位小数，舍去
                    if(saleprice!=0){
                        saleprice = this.checkDigitNum(saleprice,2);
                        this.changeNumGoodsData.saleprice = saleprice;                        
                    }

                    if(isNaN(saleprice)){this.$message.error('请输入正确格式的数字');return '';}
                    let total = parseFloat(this.accMul(saleprice,this.changeNumGoodsData.num).toFixed(2));
                    let _discount = parseFloat((saleprice/this.changeNumGoodsData.originalprice*100).toFixed(2));
                    this.changeNumGoodsData.total = total;
                    this.changeNumGoodsData._discount = _discount;
                }else if(valType == '_discount'){
                    let _discount = this.changeNumGoodsData._discount||0;
                    // 判断如果超过两位小数，舍去
                    if(_discount != 0){
                        _discount = this.checkDigitNum(_discount,2);
                        this.changeNumGoodsData._discount = _discount;
                    }

                    if(isNaN(_discount)){this.$message.error('请输入正确格式的数字');return '';}
                    let saleprice = parseFloat((this.changeNumGoodsData.originalprice*(_discount/100)).toFixed(2))
                    let total = parseFloat(this.accMul(saleprice,this.changeNumGoodsData.num).toFixed(2));
                    this.changeNumGoodsData.saleprice = saleprice;
                    this.changeNumGoodsData.total = total;
                }else if(valType == 'total'){
                    let total = this.changeNumGoodsData.total||0;
                    // 判断如果超过两位小数，舍去
                    if(total != 0){
                        total = this.checkDigitNum(total,2);
                        this.changeNumGoodsData.total = total;
                    }

                    if(isNaN(total)){this.$message.error('请输入正确格式的数字');return '';}
                    let saleprice = 0,_discount = 0;
                    if(this.changeNumGoodsData.num && this.changeNumGoodsData.num>0 && !isNaN(this.changeNumGoodsData.num)){
                        saleprice = parseFloat((total/this.changeNumGoodsData.num).toFixed(2))
                        _discount = parseFloat((saleprice/this.changeNumGoodsData.originalprice*100).toFixed(2));
                    }
                    this.changeNumGoodsData.saleprice = saleprice;
                    this.changeNumGoodsData._discount = _discount;
                }else if(valType == 'num'){
                    let num = this.changeNumGoodsData.num||0;
                    // 判断如果超过两位小数，舍去
                    if(num != 0){
                        num = this.checkDigitNum(num,2);
                        this.changeNumGoodsData.num = num;
                    }

                    if(isNaN(num)){this.$message.error('请输入正确格式的数字');return '';}
                    let total = parseFloat(this.accMul(num,this.changeNumGoodsData.saleprice).toFixed(2))
                    this.changeNumGoodsData.total = total;
                }
            },
            getThisInput(inputType){
                this.curInputType = inputType;
            },
            focusInput(index){
                this.curInput = index;
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
                if(inputCurMoney<0||inputCurNum<0){
                    this.$notify({
                        title: '警告',
                        duration:1500,
                        message: h('h3', { style: 'color: #E04C4C;font-weight:bold;'}, '金额或数量不可以小于零')
                    });
                    // this.$message('金额或数量需大于零');
                    return;
                }
                // 判断称重商品反算是否等于输入的金额
                let realMoney = this.accMul(this.curGoods.saleprice,inputCurNum).toFixed(2);
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
                    this.$refs['searchGoodsInput'].focus();
                }
            },
            // 手动输入金额
            cashStr(str){
                // changeNumGoodsData
                let changeNumGoodsData = this.changeNumGoodsData;
                let curInputType = this.curInputType;
                let curValue = null;
                if(curInputType) curValue = (changeNumGoodsData[curInputType]).toString();


                // if(curValue.length-(curValue.indexOf('.')+1)>2){
                //  return '';
                // }
                if(str == 'delete'){
                    curValue = '';
                    this.changeNumGoodsData[curInputType] = curValue;
                    this.changeValue(curInputType)
                }else if(str == 'give'){
                    if(!this.changeNumGoodsData.num || this.changeNumGoodsData.num<=0){
                        this.showMsg('请输入商品数量','error')
                        return '';
                    }
                    this.changeNumGoodsData._discount = 0;
                    this.changeNumGoodsData.total = 0;
                    this.changeNumGoodsData.saleprice = 0;
                    this.checkPowerCallback('goods',this.saveEdit);
                }else if(str == 'submit'){
                    if(!this.changeNumGoodsData.num || this.changeNumGoodsData.num<=0){
                        this.showMsg('请输入商品数量','error')
                        return '';
                    }
                    if(!this.changeNumGoodsData._discount) this.changeNumGoodsData._discount = 0;
                    if(!this.changeNumGoodsData.total) this.changeNumGoodsData.total = 0;
                    if(!this.changeNumGoodsData.saleprice) this.changeNumGoodsData.saleprice = 0;
                    // 反算小计
                    let total = parseFloat(this.accMul(this.changeNumGoodsData.saleprice,this.changeNumGoodsData.num).toFixed(2));
                    this.changeNumGoodsData.total = total;
                    
                    if(parseFloat(this.changeNumGoodsData._discount) == 100) this.saveEdit()
                    else this.checkPowerCallback('goods',this.saveEdit);
                }else{
                    if(parseFloat(curValue)=='0'&&curValue.indexOf('.')<0&&str!="."){
                        curValue = str;
                    }else if((parseFloat(curValue)=='0'||!curValue)&&str=="."){
                        curValue = '0.';
                    }else{
                        curValue += str;
                    }
                    this.changeNumGoodsData[curInputType] = curValue;
                    this.changeValue(curInputType)
                }
            },
            // 保存修改的购物车单品信息
            saveEdit(){
                let checkIndex = this.checkIndex;
                let cartList = this.$store.state.cartList;
                cartList[checkIndex] = this.changeNumGoodsData;
                let param = {key:'cartList',val:cartList};
                this.$store.commit('saveState',param);
                localStorage.cartList = JSON.stringify(cartList);
                this.$store.commit('getTotal');

                this.changeNumGoodsData = false;
                this.changeNumGoodsStatus = false;
                this.checkPowering = false;
                // this.changeNumModal[checkIndex] = false;
                // this.changeNumGoodsData = null;
                // this.modalChangeNumShow = false;
            },
            // 消费
            vipPar(){
                if(this.curVip){
                    localStorage.useVip = JSON.stringify(this.curVip);
                    this.useVip = this.curVip;
                    let param = {key:'useVip',val:this.curVip};
                    this.$store.commit('saveState',param);

                    this.vip_handle_Status = false;
                    this.curVip = '';
                    if(this.woyaoquPay == true){
                        this.toPay()
                        this.woyaoquPay = false;
                    }
                }
            },
            // 查询会员信息
            searchVip(barType){
                if(barType!='refresh' && !this.userAccount ){ this.$message('请输入会员账号');return ''; }
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'info',
                    // access_token:'5b7f60aca7e7f6f8c680b1b219ad3ec6',//loginData.access_token,
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                    customer_info:this.userAccount,
                    password:this.userPassword,
                    customer_info_pay:'1',
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                // this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data.code==1){
                        // if(res.data.data.c_status){
                        //     this.vip_handle_Status = false;
                        //     this.showModal(res.data.data.msg)
                        // }else{
                        this.userAccount = null;//清空输入的账号
                        this.userPassword = null;//清空输入的密码
                        let curVip = res.data.data;//customer_id
                        this.curVip = curVip;
                        this.vipPar();//消费
                        // }
                    }else{
                        this.vip_handle_Status = false;
                        this.showModal(res.data.msg)
                    }
                }, (res) => {
                    this.userAccount = null;//清空输入的账号
                    this.userPassword = null;//清空输入的密码
                    console.log(res)
                });
            },
            toPay(){
                console.log('cartList:',this.$store.state.cartList,this.$store.state.totalMoney)
                if(this.$store.state.cartList && this.$store.state.cartList.length>0 && this.$store.state.totalMoney>=0){
                    // 判断会员
                    if(this.$store.state.loginData.register_vip_must==1 && !this.useVip){
                        this.chooseVip()
                        this.woyaoquPay = true;
                        // this.showModal('登录会员才可以结账哦！',null,this.chooseVip)//自动点击选择会员按钮
                        return '';
                    }
                    // 促销查询
                    this.salePromotion();
                }
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
            checkDigitNum(_num,digitNum){
                let msgStr = (_num).toString();
                // 小数位超过3位
                if(!isNaN(msgStr) && (msgStr.indexOf('.')>=0 && msgStr.length - msgStr.indexOf('.') > (digitNum + 1))){
                    msgStr = msgStr.substring(0,msgStr.indexOf('.') + 3)
                }
                return msgStr;
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
            // 点击商品，选中商品
            clickGoods(goodsData,ifsearchCode){
                /*if(!goodsData.stock_num||parseFloat(goodsData.stock_num)<=0){
                    this.notify('不可以购买库存为零的商品','提示','orange');
                    this.searchGoodsList = [];
                    this.searchGoods = '';
                    return '';
                }*/
                // if(goodsData.ifWeigh){
                this.searchGoods = null;
                this.searchGoodsList.length = [];
                this.searchPageNum = 1;

                if(goodsData.sorting_num == 1 && !ifsearchCode){
                    this.openChooseModal(goodsData)
                }else{
                    let param = {
                        goods:goodsData,
                        type:'newGoods'
                    }
                    this.changeCart(param)
                }
                // window.event.returnValue == false;//阻止冒泡
                this.searchGoodsList = [];
            },
            //选中购物车商品
            checkIt(index){
                this.checkIndex = index;
                this.changeNumModal[index] = true;
                let changeNumGoodsData = Object.assign({},this.$store.state.cartList[index]);
                // changeNumGoodsData._discount = (changeNumGoodsData.saleprice/changeNumGoodsData.originalprice*100).toFixed(2);
                // this.changeNumGoodsData = changeNumGoodsData;
                this.$set(this,'changeNumGoodsData',changeNumGoodsData)
                this.changeNumGoodsStatus = true;
            },
            cutUp(){
                if(this.checkIndex <= 0){
                    return;
                }else{
                    this.checkIndex--;
                }
            },
            cutDown(){
                let length =  this.$store.state.cartList.length;
                if(this.checkIndex >= length-1){
                    return;
                }else{
                    this.checkIndex++;
                }
            },
            // 删除商品
            deleteCart(){
                let param = {
                    index:this.checkIndex,
                    type:'delete'
                }
                this.changeCart(param);
                this.changeNumModal[this.checkIndex] = false;
                this.changeNumGoodsData = null;
                this.modalChangeNumShow = false;
                this.changeNumGoodsStatus = false;
            },
            // 减少数量
            reduce(index){
                console.log(index);
                let param = {
                    index:index,
                    type:'reduce'
                }
                this.changeCart(param)
            },
            // 增加数量
            add(index){
                console.log(index);
                let param = {
                    index:index,
                    type:'add'
                }
                this.changeCart(param)
            },
            //计算购物车商品数，总金额
            getTotal(){
                let cartList = this.$store.state.cartList;
                let totalNum = 0;
                let totalMoney = 0;
                for(let i = 0;i<cartList.length;i++){
                    totalNum += parseFloat(cartList[i].num);
                    totalMoney += parseFloat(cartList[i].total);
                }
                this.totalNum = parseInt(totalNum);
                this.totalMoney = totalMoney.toFixed(2);
            },
            //修改购物车数据
            changeCart(param){
                this.$store.commit('changeCart',param)
                if(this.$store.state.getSearchFocus){
                    this.$refs['searchGoodsInput'].focus();
                }
            },
            cancelCart(){
                if(this.$store.state.cartList.length<=0){return ''}
                this.$confirm('确定取消整单吗, 是否继续?', '警告', 
                    {confirmButtonText: '确定',   cancelButtonText: '取消',type: 'warning'
                }).then(() => {
                    //清空购物车
                    this.changeCart({type:'empty'});
                    this.$message({ type: 'success', message: '删除成功!'});
                }).catch(() => {
                    this.$message({ type: 'info', message: '已取消删除'}); 
                });
            },
            //挂单
            putUpOrder(){
                let cartList = this.$store.state.cartList;
                let putUpList = this.putUpList;
                if(cartList.length>0){
                    let putUpItem = {};
                    putUpItem.goodsList = cartList;
                    // if(putUpList.length>0){
                    let thisNum = (this.putUpNum + 1).toString();
                    localStorage.putUpNum = this.putUpNum + 1;
                    this.putUpNum++;
                    let length = 4 - thisNum.length;
                    let zeroText = '';
                    for(let i=0;i<length;i++){
                        zeroText+='0';
                    }
                    putUpItem.id = zeroText + thisNum;
                    putUpList.push(putUpItem);
                    this.putUpItem = putUpItem;
                    // this.cartList = [];
                    //清空购物车
                    this.changeCart({type:'empty'});
                    // }
                    localStorage.putUpList = JSON.stringify(putUpList);
                }else if(cartList.length<=0&&putUpList.length>0){
                    this.dialogPutUp = true
                }
            },
            // // 切换挂单项
            // checkDlgTable(tab, event) {
         //     console.log(tab.index, event);
            // },
            // 取单
            pickUp(){
                let index = this.putUpTableName.substr(3);
                // 选中挂单商品，赋值给购物车
                let param = {
                    type:'pickUp',
                    goodsList:this.putUpList[index].goodsList
                }
                this.changeCart(param);
                this.putUpList.splice(index,1);
                localStorage.putUpList = JSON.stringify(this.putUpList);
                this.cancelPutUp();
                this.putUpTableName = 'row0';
            },
            // 隐藏挂单窗口
            cancelPutUp(){
                this.dialogPutUp = false;
            },
            // 删除选中挂单项
            delPutUp(){
                this.$confirm('确定删除本单吗, 是否继续?', '警告', 
                    {confirmButtonText: '确定',   cancelButtonText: '取消',type: 'warning'
                }).then(() => {
                    let index = this.putUpTableName.substr(3);
                    this.putUpList.splice(index,1);
                    if(this.putUpList.length<=0){
                        this.cancelPutUp(); 
                    }
                    localStorage.putUpList = JSON.stringify(this.putUpList);
                    this.putUpTableName = 'row0';
                    this.$message({ type: 'success', message: '删除成功!'});
                }).catch(() => {
                    this.cancelPutUp(); 
                });
            },
            getGoodsListFunc(res,_power){
                if(res.data.data.discountPower==1){
                    this.getGoodsList('input',this.searchGoods,_power)
                }else{
                    this.failBack(res)
                }
                this.checkPowering = false;
            },
            // 获取商品列表
            getGoodsList(_type,_word,_power){
                let loginData = this.$store.state.loginData;
                let _param = {
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    action:'getMdGoods',
                    category:this.category||'',
                    store_id:loginData.store_id
                }
                if(_type == 'input'){
                    _param.list_goods_rows = this.searchLimit,
                    _param.goods_page = this.searchPageNum,
                    _param.words = _word;
                    if(!_param.words){
                        this.searchGoodsList = [];
                        return '';
                    }
                }else{
                    _param.list_goods_rows = this.$store.state.limit,
                    _param.goods_page = this.$store.state.goodsPageNum,
                    _param.words = '';
                }
                if(_power){
                    _param.power_name = _power.power_name;
                    _param.power_password = _power.power_password;
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, _param).then((res) => {
                    if(res.data.code==1){
                        if(res.data.data.discountPower == 0){
                            this.checkPowering = true;
                            this.checkPowerCallback('goods',this.getGoodsListFunc)
                            return '';
                        }
                        if(_type=='input'){
                            // 扫描条码返回json
                            if(res.data.data && res.data.data.bar_code){
                                if(res.data.data.search){//称好的商品
                                    this.clickGoods(res.data.data,'searchCode')
                                }else{
                                    this.clickGoods(res.data.data)
                                }
                                this.searchGoods = null;
                                return '';
                            }
                            // 调价查询返回array
                            let data = res.data.data.data;
                            // debugger
                            this.searchPageNumMax = Math.ceil(res.data.data.recordsTotal/_param.list_goods_rows)
                            if(data.length>1 || (data.length == 1 && _param.goods_page>1)){
                                this.searchGoodsList = data;
                            }else if(data.length == 1 && _param.goods_page==1){
                                this.clickGoods(data[0])
                                this.searchGoods = '';
                            }else if(data.length <= 0 && _param.goods_page>1){
                                this.searchGoodsList = [];
                                return '';
                            }else{//没有查询到商品
                                this.showMsg('没有查询到商品','warning')
                                this.searchGoodsList = [];
                                this.searchGoods = null;
                                return '';
                            }
                        }else{
                            this.searchGoodsList = [];//清空条件查询商品
                            this.goodsList = res.data.data.data;
                        }
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            searchGoodsFunc(_type){
                if(_type=='-'){
                    if(this.searchPageNum>0){
                        this.searchPageNum--;
                        this.getGoodsList('input',this.searchGoods)
                    }
                }else if(_type=='+'){
                    if(this.searchGoodsList.length>=5){
                        this.searchPageNum++;
                        this.getGoodsList('input',this.searchGoods)
                    }
                }
            },
            // 促销
            salePromotion(){
                this.$router.push({
                    path: '/payType',
                    name: 'payType',
                    // query: {
                    //     putUpList: this.putUpList,
                    //     name:'111'
                    // },
                    params:{//一定要设置name，才可以传params
                        // cartList: this.$store.state.cartList,
                        totalMoney:this.$store.state.totalMoney,
                        // .........
                    }
                });
                return '';
                /*let loginData = this.$store.state.loginData;
                let _param = {
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    // action:'queryShopDiscounts',
                    action:'queryMdDiscounts',
                    md_store_id:loginData.store_id,
                    total_sum:this.$store.state.totalMoney,
                    sum:this.$store.state.totalNum,
                }
                if(this.$store.state.cartList.length>0){
                    let cartList = this.$store.state.cartList;
                    let goods = [];
                    for(let i = 0;i<cartList.length;i++){
                        goods.push({
                            category_id:cartList[i].category_id,
                            price:cartList[i].saleprice,
                            num:cartList[i].num,
                            goods_id:cartList[i].goods_id,
                            total:cartList[i].total
                        })
                    }
                    _param.goods = goods;
                }else{
                    return '';
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.salePromotion}`, _param).then((res) => {
                    console.log(res.data.data);
                    if(res.data.code==1){
                        if(res.data.data.free_goods){
                            this.freeGoods = res.data.data.free_goods;

                        }
                    }
                    // if(res.data.code == '1'){
                    //     this.$router.push({
                    //         path: '/payType',
                    //         name: 'payType',
                    //         // query: {
                    //         //     putUpList: this.putUpList,
                    //         //     name:'111'
                    //         // },
                    //         params:{//一定要设置name，才可以传params
                    //             // cartList: this.$store.state.cartList,
                    //             totalMoney:this.$store.state.totalMoney
                    //         }
                    //     });
                    // }
                }, (res) => {
                    console.log(res)
                });*/
            },
            showModal(_cont,title,_callback){
                /*this.$alert(cont, title||'提示', {
                    confirmButtonText: '确定',
                    callback: action => {if(_callback)_callback()}
                });*/
                let cont = _cont;
                cont = cont.replace(/企业贵宾卡/g,"<span style='color:#B76610;font-weight:bold;'> 企业贵宾卡 </span>");
                this.$alert(`<span>${cont}</span>`, title||'提示', {
                    dangerouslyUseHTMLString: true,
                    callback: action => {if(_callback)_callback()}
                })
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
            // 提示框
            notify(text,title,color){
                const h = this.$createElement;
                this.$notify({
                    title: `${title?title:'警告'}`,
                    duration:1500,
                    message: h('h3', { style: `color: ${color?color:'#E04C4C'};font-weight:bold;`}, text)
                });
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
            confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
            },
        },
        mounted:function(){
            this.initComp()
            document.onclick=(event)=>{
                setTimeout(()=>{
                    if(this.$store.state.getSearchFocus){
                        this.$refs['searchGoodsInput'].focus();
                    }
                },100)
            }
            // this.$mount()
            this.$refs['searchGoodsInput'].focus();
        }
    }
</script>