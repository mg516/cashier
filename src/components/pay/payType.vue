<template>
    <div class="payTypeBox" @mousedown="handleTrigger">
        <receiptModal ref="receiptModal" :printData="printData"></receiptModal>
        <checkPowerComp ref="checkPowerComp" :checkInfo="checkInfo" v-on:successBack="successBack" v-on:failBack="failBack"></checkPowerComp>
        <el-container style="height:100%;">
            <el-header style="height:55px;background-color:#000000;position:relative;line-height: 55px;">
                <div style="position:absolute;top:0;left:0;font-size:12px;color:#fff;padding: 0 20px;" @click="pageBack(-1)">返回</div>
                <div style="line-height:55px;font-weight:bold;text-align:center;font-size:16px;color:#fff;">结账</div>
            </el-header>
            <el-main style="position:relative;background-color:#E6EDF5;display:flex;justify-content:center;align-items:center;">
                <div class="payMainBox">
                    <el-container style="height:100%;">
                        <el-main style="width:472px;max-width:472px;">
                            <div class="otherType" v-if="vipPay">
                                <p class="title">当前付款会员信息</p>
                                <div class="other">
                                    <div class="userPayBox">
                                        <div class="usermsgBox" v-if="useVip">
                                            <div class="ellipsis" v-if="!useVip.temporary_vip"><span class="userLabel">姓　　名：</span><span class="cardVal" v-if="useVip">{{useVip.name}}</span></div>
                                            <div class="ellipsis">
                                                <span class="userLabel">手　　机：</span>
                                                <span class="cardVal" v-if="useVip">{{useVip.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</span>
                                                <span v-if="useVip.temporary_vip" style="color:#201e25;background-color:#ebeced;border-radius:6px;width:80px;line-height:18px;display:inline-block;text-align:center">临时会员</span>
                                                <span v-else style="color:#6a4814;background: -webkit-linear-gradient(left,#ffc95c,#ffc058);border-radius:6px;width:80px;line-height:18px;display:inline-block;text-align:center">正式会员</span>
                                            </div>
                                            <div class="ellipsis"><span class="userLabel">等级积分：</span><span class="cardVal" v-if="useVip">{{useVip.rank_points}}</span></div>
                                            <div class="ellipsis"><span class="userLabel">消费积分：</span><span class="cardVal" v-if="useVip">{{useVip.pay_points}}</span></div>
                                            <div class="ellipsis" v-if="useVip&&useVip.customer_gift_array">
                                                <span class="userLabel">领菜状态：</span>
                                                <span class="cardVal" v-if="useVip.customer_gift_array.gift_status==1" style="color:#F92472;">已领取</span>
                                                <span class="cardVal" v-else-if="useVip.customer_gift_array.gift_status==0" style="color:#6C8BD3;">今天可领</span>
                                            </div>
                                            <div class="ellipsis" v-if="useVip&&useVip.customer_gift_array">
                                                <span class="userLabel">可领菜次数：</span>
                                                <span class="cardVal" v-if="useVip">{{useVip.customer_gift_array.residue_num}} 次</span>
                                            </div>
                                            <div class="ellipsis" style="color: rgb(255, 192, 88);font-weight: bold;font-size: 15px;"><span class="userLabel">应付金额：</span><span class="cardVal">{{orderData.shouldPay}}</span></div>
                                            <div class="ellipsis"></div>
                                            <div class="ellipsis" v-if="!useVip.temporary_vip">
                                                <span class="userLabel">{{useVip.now_code==1&&useVip.payCardType=='family'?'家庭卡余额：':'可用余额：'}}</span>
                                                <span class="cardVal">{{useVip.now_code==1&&useVip.payCardType=='family'?useVip.family_money:useVip.user_money}}</span>
                                            </div>
                                            <div class="ellipsis">
                                                <el-button type="success" size="mini" v-if="!useVip.temporary_vip&&useVip.now_code==1&&useVip.payCardType=='family'" :disabled="useVip?false:true" @click="userHandle('pay','family')">家庭卡支付</el-button>
                                                <el-button type="primary" size="mini" v-if="!useVip.temporary_vip&&(useVip.now_code!=1||useVip.payCardType!='family')" :disabled="useVip?false:true" @click="userHandle('pay')">会员支付</el-button>
                                                <el-button type="danger" size="mini" v-if="!useVip.temporary_vip" :disabled="useVip?false:true" @click="userHandle('recharge')">充值</el-button>
                                                <el-button type="warning" size="mini" @click="userHandle('reload')">重选会员</el-button>
                                            </div>
                                            <div class="ellipsis" v-if="(useVip.now_code==2||useVip.now_code==3) && useVip.payCardType=='family'"><span class="userLabel">家庭卡余额：</span><span class="cardVal" v-if="useVip">{{useVip.family_money}}</span></div>
                                            <div class="ellipsis" v-if="(useVip.now_code==2||useVip.now_code==3) && useVip.payCardType=='family'">
                                                <el-button style="width:150px;" type="success" size="mini" :disabled="useVip?false:true" @click="userHandle('pay','family')">家庭卡支付</el-button>
                                            </div>
                                            <!-- {{useVip.now_code}} {{useVip.payCardType}} -->
                                        </div>
                                        <div class="usermsgBox" style="text-align:center;padding:40px 0;" v-else>
                                            <el-button type="warning" size="small" @click="userHandle('reload')">选择会员支付</el-button>
                                        </div>
                                        <rechargeComp ref="rechargeComp" :payData="payData" :vipData='curVip||null' :refresh='searchVip'></rechargeComp>
                                    </div>
                                </div>
                            </div>
                            <div class="otherType" v-if="couponList.length>0">
                                <p class="title">可用优惠券<span class="couponTotal">优惠券可抵扣 {{couponTotal}} 元</span></p>
                                <div class="other couponBox">
                                    <div class="otherItem couponItem" v-for="typeItem,index in couponList" v-if="index<4">
                                        <div class="couponMoney">
                                            <span class="num">{{parseFloat(typeItem.single_relief)}}</span>
                                            <span class="unit">元</span>
                                        </div>
                                        <div class="couponName">
                                            <span class="name">{{typeItem.coupon_name}}</span>
                                        </div>
                                        <div class="couponNum">
                                            <span class="icontext">x</span><span class="num">{{typeItem.time}}</span>
                                        </div>
                                    </div>
                                    <div class="couponMore" v-if="couponList.length>4" @click="couponMore =!couponMore">查看更多</div>
                                </div>
                            </div>
                            <div class="otherType" v-if="payType && payType.length">
                                <p class="title">选择其他支付方式</p>
                                <div class="other">
                                    <div class="otherItem" :class="(!useVip&&$store.state.loginData.register_vip_must==1)?'_disabled':''" v-if="typeItem.code!='cash'&&typeItem.code!='vippay'" v-for="typeItem in payType" @click="checkPayMode(typeItem.code,typeItem.name)">
                                        <!-- <img v-if="typeItem.icon&&typeItem.icon!=''" :src="typeItem.icon"> -->
                                        <img v-if="typeItem.img_ids&&typeItem.img_ids!=''" :src="$store.state.host+typeItem.img_ids">
                                        <span>{{typeItem.name}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="otherType">
                                <p class="title">其他操作</p>
                                <div class="other">
                                    <div class="otherItem bgBlue" v-for="typeItem in otherHandle" @click="checkType(typeItem.clickType)">
                                        <img v-if="typeItem.icon&&typeItem.icon!=''" :src="typeItem.icon">
                                        <span>{{typeItem.name}}</span>
                                    </div>
                                </div>
                            </div>
                        </el-main>
                        <el-aside width="28px" style="position:relative;overflow:hidden;">
                            <div class="topBall"></div>
                            <div class="bottomBall"></div>
                            <div class="bgLine"></div>
                        </el-aside>
                        <el-main width="510px">
                            <div class="moneyCount">
                                <div class="countItem">
                                    <p class="countTitle">应收金额</p>
                                    <p class="countValue" v-if="!discountDlg.ifDiscountMoney&&!discountDlg.ifDiscountScale&&couponOrderTotal==0">
                                        <span class="rmb">¥</span>{{orderData.totalMoney}}
                                        <!-- <span class="rmb">¥</span>{{orderData.receivable}} -->
                                    </p>
                                    <p class="countValue" style="position:relative;" v-else>
                                        <span class="rmb">¥</span>{{discountDlg.value?discountDlg.value:couponOrderTotal}}
                                        <span style="width:160px;height:20px;line-height:20px;position:absolute;left:0;bottom:-8px;font-size:14px;font-weight:lighter;text-decoration:line-through;">{{orderData.totalMoney}}</span>
                                        <!-- <span style="width:160px;height:20px;line-height:20px;position:absolute;left:0;bottom:-8px;font-size:14px;font-weight:lighter;text-decoration:line-through;">{{orderData.receivable}}</span> -->
                                    </p>
                                </div>
                                <div class="countItem">
                                    <p class="countTitle">待收金额</p>
                                    <p class="countValue"><span class="rmb">¥</span>{{orderData.shouldPay}}</p>
                                </div>
                                <div class="countItem">
                                    <p class="countTitle">折让</p>
                                    <p class="countValue"><span class="rmb">¥</span>{{orderData.discounts}}</p>
                                </div>
                            </div>
                            <div class="cashBox">
                                <div class="cashlabel">现金</div>
                                <div class="changelabel">找零</div>
                                <input class="cashInp" :class="{noShouldPay:orderData.shouldPay<=0}" type="text" v-model="inpCash" disabled>
                                <input class="changeInp" type="number" v-model="orderData.change" disabled>
                                <div class="afterwards" v-if="payBack || couponTotal>0">
                                    <div v-if="couponTotal>0" style="background-color: #6C8BDB;border: 1px solid #6C8BDB;color: #fff;">优惠券可抵扣：{{couponTotal}}元</div>
                                    <div v-if="orderData.cash>0">已收现金：{{orderData.cash}}元</div>
                                    <div v-if="orderData.card>0">会员卡：{{orderData.card}}元</div>
                                    <div v-if="orderData.weip>0">微信收款：{{orderData.weip}}元</div>
                                    <div v-if="orderData.zfbao>0">支付宝收款：{{orderData.zfbao}}元</div>
                                    <div v-if="orderData.bankpay>0">聚合码收款：{{orderData.bankpay}}元</div>

                                </div>
                            </div>
                            <div v-if="paidUp>0">现金：{{paidUp}}</div>
                            <div class="computerBox" v-if="cashPay" :class="(!useVip&&$store.state.loginData.register_vip_must==1)?'_disabled':''">
                                <div class="numberBox">
                                    <div @click="ifLoginVip(cashStr,'7')">7</div>
                                    <div @click="ifLoginVip(cashStr,'8')">8</div>
                                    <div @click="ifLoginVip(cashStr,'9')">9</div>
                                    <div @click="ifLoginVip(cashStr,'4')">4</div>
                                    <div @click="ifLoginVip(cashStr,'5')">5</div>
                                    <div @click="ifLoginVip(cashStr,'6')">6</div>
                                    <div @click="ifLoginVip(cashStr,'1')">1</div>
                                    <div @click="ifLoginVip(cashStr,'2')">2</div>
                                    <div @click="ifLoginVip(cashStr,'3')">3</div>
                                    <div @click="ifLoginVip(cashStr,'00')">00</div>
                                    <div @click="ifLoginVip(cashStr,'0')">0</div>
                                    <div @click="ifLoginVip(cashStr,'.')">.</div>
                                </div>
                                <div class="moneyBox">
                                    <div @click="ifLoginVip(cashNum,100)">¥100</div>
                                    <div @click="ifLoginVip(cashNum,50)">¥50</div>
                                    <div @click="ifLoginVip(cashNum,20)">¥20</div>
                                    <div @click="ifLoginVip(cashNum,10)">¥10</div>
                                </div>
                                <div class="handleBox">
                                    <div @click="ifLoginVip(delStr)">×</div>
                                    <div @click="ifLoginVip(cancel)">取消</div>
                                    <div @click="ifLoginVip(payment)">现金<br>付款</div>
                                </div>
                            </div>
                        </el-main>
                    </el-container>
                </div>
            </el-main>
        </el-container>
        <!-- 各种支付方式弹窗-->
        <el-dialog :title="payModeVal.name" :visible.sync="dialogPayMode.ifShow" width="460px">
            <div v-if="dialogPayMode.code=='zfb'||dialogPayMode.code=='weipay'" style="text-align:center;">
                <div class="demo-input-suffix" style="margin-bottom: 20px;">
                    应付金额：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputShouldPay1"></inputComp>
                </div>
                <div class="demo-input-suffix" style="margin-bottom: 20px;">
                    付款金额：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputShouldPay2"></inputComp>
                </div>
                <div class="demo-input-suffix">
                    支付条码：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputCode" v-on:keyEnter="surePayMode"></inputComp>
                </div>
            </div>
            <div v-else-if="dialogPayMode.code=='bank'" style="text-align:center;">
                <div class="demo-input-suffix" style="margin-bottom: 20px;">
                    应付金额：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputShouldPay1"></inputComp>
                </div>
                <div class="demo-input-suffix" style="margin-bottom: 20px;">
                    付款金额：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputShouldPay2"></inputComp>
                </div>
                <div class="demo-input-suffix">
                    付款卡号：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputCode"></inputComp>
                </div>
            </div>
            <div v-else-if="dialogPayMode.code=='bankpay'" style="text-align:center;">
                <div class="demo-input-suffix" style="margin-bottom: 20px;">
                    付款金额：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputShouldPay2"></inputComp>
                </div>
                <!-- <div class="demo-input-suffix">
                    备　　注：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputCode"></inputComp>
                </div> -->
            </div>
            <div v-else-if="dialogPayMode.code=='vippay'">
                <div class="cardPayBox">
                    <div class="cardPayMsg">
                        <span style="fontSize:15px;font-weight: bold;display:inline-block;">会员卡{{$store.state.funcSwitch.timeVip?'/手机号':''}}：</span>
                        <inputComp v-model="userAccount" @keyEnter='searchVip' @info='inputVip' :disabled="!useVip?false:true" :inputCompSize="inputCompSize1" :inputCompValue="inputVipId"></inputComp>
                        <el-button type="danger" @click="searchVip" size="mini">确定</el-button>
                    </div>
                    <div style="text-align:left;text-indent:4px;padding-top:10px;color:#999;" v-if="$store.state.funcSwitch.timeVip">
                        <p style="font-size:12px;">注：正式会员请通过<span style="color:#F56666;"> 实体卡 </span>或<span style="color:#F56666;"> 小程序 </span>登录，手机号只可保留消费积分</p>
                    </div>
                </div>
                <div style="width:100%;border-bottom:2px dotted #ccc;margin:14px 0;"></div>
                <div>
                    <div class="cardMsg" style="display:inline-block;width:48%;"><div class="cardLabel">等级积分：</div><div class="cardVal" v-if="useVip">{{useVip.rank_points}}</div></div>
                    <div class="cardMsg" style="display:inline-block;width:48%;"><div class="cardLabel">消费积分：</div><div class="cardVal" v-if="useVip">{{useVip.pay_points}}</div></div>
                    <div v-if="useVip&&!useVip.temporary_vip" class="cardMsg" style="display:inline-block;width:48%;"><div class="cardLabel">姓　　名：</div><div class="cardVal" v-if="useVip">{{useVip.name}}</div></div>
                    <div class="cardMsg" style="display:inline-block;width:48%;"><div class="cardLabel">手　　机：</div><div class="cardVal" v-if="useVip">{{useVip.mobile.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2")}}</div></div>
                    <div v-if="useVip&&!useVip.temporary_vip" class="cardMsg" style="display:inline-block;width:48%;"><div class="cardLabel">可用余额：</div><div class="cardVal" v-if="useVip">{{useVip.user_money}}</div></div>
                </div>
            </div>
            <div v-else-if="dialogPayMode.code=='jf'">
                <el-row width='' style="border:1px solid #000;">
                    <el-col :span="8">
                        <div class="cardBox">
                            <div class="cardTitle">当前付款卡信息</div>
                            <div class="cardMsg"><div class="cardLabel">会 员 号：</div><div class="cardVal">{{useVip.customer_id}}</div></div>
                            <div class="cardMsg"><div class="cardLabel">姓　　名：</div><div class="cardVal">{{useVip.name}}</div></div>
                            <div class="cardMsg"><div class="cardLabel">可用积分：</div><div class="cardVal">{{useVip.user_money}}</div></div>
                            <div class="cardMsg"><div class="cardLabel">手　　机：</div><div class="cardVal">{{useVip.mobile}}</div></div>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="cardPayBox">
                            <div class="cardPayMsg">
                                <span class="cardPayLabel">会　　员：</span>
                                <inputComp v-model="userAccount" @info='inputVip' :disabled="useVip" :inputCompSize="inputCompSize1" :inputCompValue="inputVipId"></inputComp>
                                <div class="cardPayHandle">查询Ent</div>
                                <div class="cardPayHandle">读卡F1</div>
                            </div>
                            <div class="cardPayMsg">
                                <span class="cardPayLabel">待　　收：</span>
                                <div class="cardPayVal">{{orderData.shouldPay}}</div>
                            </div>
                            <div class="cardPayMsg">
                                <span class="cardPayLabel">付款金额：</span>
                                <inputComp @info='inputInfo' :inputCompSize="inputCompSize1" :inputCompValue="inputShouldPay2"></inputComp>
                            </div>
                            <div class="cardPayMsg">
                                <span class="cardPayLabel">密　　码：</span>
                                <inputComp v-model="userPassword" @info='inputPasswordFunc' :inputCompSize="inputCompSize1" :inputCompValue="inputPassword"></inputComp>
                                <div class="cardPayHandle">修改密码F3</div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <div v-if="dialogPayMode.code!='vippay'">
                    <el-button type="primary" plain @click="cancelPayMode">取 消</el-button>
                    <el-button type="primary" @click="surePayMode">确 定</el-button>
                </div>
            </span>
        </el-dialog>
        <!-- 选择称重商品窗口 -->
        <el-dialog title="整单折扣" :visible.sync="discountDlg.ifShow" width="440px">
            <div style="text-align: center;">
                <el-tabs v-model="discountDlg.activeTabName" type="border-card" @tab-click="getDisInputFocus">
                    <el-tab-pane label="比例折" name="scale"><div class="tablabel">请输入折扣比例(1~99)</div></el-tab-pane>
                    <el-tab-pane label="金额折" name="money"><div class="tablabel">请输入折后金额</div></el-tab-pane>
                    <el-input class="tabInput" ref="disInput" v-model="discountDlg.value" placeholder="请输入内容"></el-input>
                    <div class="computerBox" style="width:340px;margin:20px auto 0;">
                        <div class="numberBox">
                            <div @click="cashStr_D('7')">7</div>
                            <div @click="cashStr_D('8')">8</div>
                            <div @click="cashStr_D('9')">9</div>
                            <div @click="cashStr_D('4')">4</div>
                            <div @click="cashStr_D('5')">5</div>
                            <div @click="cashStr_D('6')">6</div>
                            <div @click="cashStr_D('1')">1</div>
                            <div @click="cashStr_D('2')">2</div>
                            <div @click="cashStr_D('3')">3</div>
                            <div @click="cashStr_D('00')">00</div>
                            <div @click="cashStr_D('0')">0</div>
                            <div @click="cashStr_D('.')">.</div>
                        </div>
                        <div class="handleBox">
                            <div @click="cashStr_D('delete')">×</div>
                            <div @click="discountCancel">取消</div>
                            <div @click="checkPowerCallback('discount',discountSure)">确定</div>
                        </div>
                    </div>
                </el-tabs>
            </div>
        </el-dialog>
        <!-- 优惠券展示 -->
        <el-dialog title="可用优惠券" :visible.sync="couponMore" width="440px">
            <div style="text-align: center;">
                <div class="couponBox">
                    <div class="couponItem" v-for="typeItem,index in couponList">
                        <div class="couponMoney">
                            <span class="num">{{parseFloat(typeItem.single_relief)}}</span>
                            <span class="unit">元</span>
                        </div>
                        <div class="couponName">
                            <span class="name">{{typeItem.coupon_name}}</span>
                        </div>
                        <div class="couponNum">
                            <span class="icontext">x</span><span class="num">{{typeItem.time}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" @click="couponMore=false">知道了</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>
<style type="text/css">
    @import './../../static/payType.css'
</style>
<style type="text/css">
    .handleBox{line-height: 50px;}
    .cashBox{position: relative;}
    .afterwards{position: absolute;top: 70px;left: 10px;width: 400px;}
    .afterwards>div{display: inline-block;line-height: 20px;border:1px solid #C8D3EC;border-radius: 2px;padding: 0 3px;text-align: center;background-color: #F5F7F9;color: #7297F4;margin-bottom: 6px;margin-left: 8px;font-size: 12px;}
    .cardBox{width: 100%;height:100%;border-right: 1px solid #404040;}
    .cardTitle{border-bottom: 1px solid #404040;line-height: 20px;line-height: 30px;font-size: 14px;text-align: center;}
    .cardMsg{padding: 0 4px;box-sizing: border-box;}
    .cardMsg>div,.cardPayMsg>div{display: inline-block;white-space: nowrap;line-height: 26px;font-size: 13px;}
    .cardMsg>.cardLabel{width: 40%;text-align: left;font-weight: bold;}
    .cardMsg>.cardVal{width: 60%;text-align: left;}
    .cardPayMsg{width: 100%;height:100%;border-left: 0;padding: 4px;box-sizing: border-box;margin:2px 0 6px 0;}
    .cardPayMsg>.cardPayLabel{font-size: 13px;color: #000;}
    .cardPayHandle{display: inline-block;line-height: 28px;font-size: 12px;border:1px solid #000;color: #555555;padding: 0 2px;border-radius: 2px;}
    /*整单取消*/
    .tablabel{width: 100%;font-size: 18px;text-align: left;line-height: 30px;}
    .tabInput{width: 100%;font-size: 16px;}
</style>
<script type="text/ecmascript-6">
    import inputcomp from "../Comp/inputComp"
    import checkPowerComp from "../Comp/checkPower"// 权限组件参数checkInfo
    import {getLodop} from '../../static/LodopFuncs.js'
    import receiptModal from "./../setUp/receiptModal"
    import rechargeComp from "../vip/recharge"
    export default {
        components: {
            'inputComp': inputcomp,//输入框组件
            'receiptModal': receiptModal,//打印组件
            'rechargeComp': rechargeComp,
            'checkPowerComp': checkPowerComp,
        },
        data(){
            return {
                checkInfo:{
                    rule_id:null,//3整单打折，2单品打折
                    ifAsk:true,//弹出登录出口前是否询问
                    msg:null
                },
                timer:null,//清空会员信息的定时器
                payData:{
                    shouldPay:0
                },
                disInputFocus:false,//整单折扣的焦点状态
                power:{
                    power_name:'',
                    power_password:''
                },
                checkPower:false,
                ifCheckPower:false,
                payBack:null,//支付的回调数据
                useVip:'',
                userAccount:'',
                userPassword:'',
                payModeVal:{},
                dialogPayMode:{//其他支付方式弹窗
                    ifShow:false,
                    code:null
                },
                data:50,
                cashPay:false,//是否支持现金支付方式
                vipPay:false,//是否支持会员卡支付方式
                afterGoods:null,//券后临时商品列表
                couponTotal:0,//优惠合计
                couponOrderTotal:0,//优惠后订单金额
                coupon_abnormal:0,//优惠异常金额
                couponList:[],
                couponMore:false,//是否显示更多优惠券窗口
                payType:[
                    // {name:'支付宝',icon:'./../../assets/paytype_zhifubao.png',code:'zfb'},
                    // {name:'微信支付',icon:'./../../assets/paytype_weixin.png',code:'weipay'},
                    // {name:'银行卡',icon:'./../../assets/paytype_yinlian.png',code:'bank'},
                    // {name:'会员卡',icon:'./../../assets/paytype_chuxuka.png',code:'vippay'},
                    // {name:'积分付款',icon:'./../../assets/paytype_jifen.png',code:'jf'},
                    // {name:'微信扫码付',icon:'',code:'wxsm'}
                ],
                otherHandle:[
                    // {name:'会员',icon:'./../../assets/vip.png',clickType:'vip'},
                    {name:'整单折扣',icon:require('./../../assets/paytype_weixin.png'),clickType:'discount'},
                    {name:'整单取消',icon:require('./../../assets/return.png'),clickType:'cancelCart'},
                    // {name:'备注',icon:'./../../assets/paytype_chuxuka.png',clickType:'remark'},
                ],
                ifNewPay:true,//检测是否为重新支付
                paidUp:0,//当前输入现金值
                /*getMoney:0,//已收
                totalMoney:0,//合计应收(购物车传来未计算折让)
                receivable:0,//应收
                shouldPay:0,//待收
                discounts:0,//折让
                cash:0,//现金
                change:0,//找零*/
                inpCash:0,
                orderData:{
                    getMoney:0,//已收
                    totalMoney:0,//合计应收(购物车传来未计算折让)
                    receivable:0,//应收
                    shouldPay:0,//待收
                    discounts:0,//折让
                    cash:0,//现金
                    card:0,//会员卡支付
                    familyCard:0,//家庭卡支付
                    weip:0,//微信支付
                    zfbao:0,//支付宝支付
                    change:0,//找零 
                    bankpay:0,//聚合码支付
                },
                // 收款条码号
                inputCode:{type:'code',status:true,statusKey:false,value:null,focus:false,typeName:'password'},
                // 待收金额（不可编辑）
                inputShouldPay1:{type:'shouldPay1',status:false,statusKey:false,value:null},
                // 付款金额（可以编辑）
                inputShouldPay2:{type:'shouldPay2',status:false,value:null},
                //input模板数据
                inputCompSize:{width:'300',height:'40',ifFocus:false},
                inputCompSize1:{width:'210',height:'28',fontSize:'12'},
                // 会员号
                inputVipId:{type:'vipId',status:true,statusKey:false,value:null,focus:false,typeName:'password'},
                // 密码
                inputPassword:{type:'password',status:true,value:null},
                // 整单折扣
                discountDlg:{
                    ifShow:false,
                    ifDiscountScale:false,
                    ifDiscountMoney:false,
                    value:'',
                    activeTabName:'scale'
                },
                cartList:null,//获取购物车信息（打印用）
                totalNum:null,//商品数量
                // 小票配置
                form:{
                    mb_name:'58mm纸(32字宽)',//模板名称 string
                    xp_hnum:2,//行数 string
                    xp_fnum:2,//份数 string
                    bar_code:false,//货号 bealoon 
                    xp_big_title:false,//大标题 bealoon 
                    xp_sh_info:false,// 收货信息 bealoon 
                    hy_name:false,//会员名 bealoon 
                    hy_address:false,//会员地址 bealoon 
                    yy_info:false,//营业员信息 bealoon 
                    xp_title:null,//小票标题 string
                    md_info:null,//门店信息 string
                    footer1:null,//票尾信息1 string
                    footer2:null,//票尾信息2 string
                    footer3:null,//票尾信息3 string
                    footer4:null,//票尾信息4 string
                    footer5:null,//票尾信息5 string
                    name:false,//品名 bealoon 
                    num:false,//数量 bealoon 
                    price:false,//价格 bealoon 
                    total_price:false,//小计 bealoon 
                    fk_tishi:false,//付款/找零提示 bealoon 
                    fk_name:false,//付款/名称 bealoon 
                    fk_total_price:false,//付款/金额 bealoon 
                    // sn_code:null,//条码
                    xpz_width:20,//小票总宽度 string
                    name_width:20,//品名宽度 string
                    num_width:10,//数量字宽 string
                    price_width:30,//价格宽度 string
                    total_price_width:10,//小计字宽 string
                },
                noTouch:false,//true不能支付
                printData:{
                    setupData:null,
                    initData:{
                        ifShow:0,
                        ifReprint:false,
                        printType:'pay'
                    },
                    orderData:{//打印订单信息
                        orderId:null,
                        order_over_time:null,
                        receivable:null,
                        cash:0,
                        weip:0,
                        change:0,
                        card:0,
                        conpon:0,
                        familyCard:0,
                        bankpay:0,
                        totalNum:0,
                        goods:[],
                        wipeZeroMoney:0,
                        giveChangeMoney:0,
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
                //用于打印的订单信息
            }
        },
        beforeDestory(){
            console.log(this.$el)
        },
        methods:{
            // 判断有无会员登录
            ifLoginVip(callback,param){
                if(!this.useVip&&this.$store.state.loginData.register_vip_must==1){
                    this.$message.error('请登录会员后在尝试');
                    return '';
                }else{
                    this.dialogPayMode.code = null;
                    callback(param);
                }
            },
            // 有操作即触发--->清空会员登录信息
            handleTrigger(){
                clearTimeout(this.timer)
                console.log(this.timer)
                this.timer = setTimeout(()=>{
                    if(this.useVip){
                        this.useVip = "";
                        localStorage.removeItem("useVip");
                        this.couponList = [];
                        this.couponOrderTotal = 0;
                        this.couponTotal = 0;
                        this.afterGoods = null;
                        this.coupon_abnormal = 0;
                        this.countChange(this.orderData.totalMoney);
                    }
                },120000)
            },
            // 会员充值
            rechargeVip(){
                if(this.useVip){
                    let useVip = this.useVip;
                    this.$refs.rechargeComp.rechargeVip(useVip);
                }else{
                    this.showMsg('请先登录会员')
                }
            },
            // 输入收款条码，Enter的回调
            codePay:function(res){
                console.log(this.inputCode.value)
                console.log(this.dialogPayMode.code)
            },
            // 获取密码回调
            inputPasswordFunc(msg){
                this.inputPassword.value = msg.value;
            },
            // 获取会员号回调
            inputVip(msg){
                this.inputVipId.value = msg.value;
            },
            // 输入框输入回调
            inputInfo(msg){
                console.log(msg)
                if(msg.type=='shouldPay1'){//以设为禁用
                    this.inputShouldPay1.value = msg.value;
                }else if(msg.type=='shouldPay2'){
                    this.inputShouldPay2.value = msg.value;
                }else if(msg.type=='code'){
                    this.inputCode.value = msg.value;
                }
            },
            // 查询会员信息
            searchVip(){
                if(!this.inputVipId.value) {this.$message('请输入会员账号');return '';}
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'info',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                    // access_token:'5b7f60aca7e7f6f8c680b1b219ad3ec6',//loginData.access_token,
                    customer_info:this.inputVipId.value,
                    password:this.userPassword,
                    customer_info_pay:'1'
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
                    this.inputVipId.value = null;
                    console.log(res.data.data)
                    if(res.data && res.data.data){
                        this.userAccount = null;//清空输入的账号
                        this.userPassword = null;//清空输入的密码
                        let curVip = res.data.data;//customer_id
                        curVip._customer_id = res.data.data.id//.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
                        curVip._birthday = this.timestampToTime(curVip.birthday);
                        this.curVip = curVip;
                        // 重新处理会员信息（家庭卡）
                        this.reUseVip(this.curVip);

                        let param = {key:'useVip',val:this.curVip};
                        this.$store.commit('saveState',param);
                        // 查询到会员信息，自动调用支付
                        // this.surePayMode();
                        this.dialogPayMode.code = null;
                        this.dialogPayMode.ifShow = false;
                        this.handleTrigger()
                    }else{
                        this.notify(res.data.msg)
                        // this.notify('没有查询到会员信息')
                        this.inputVipId.value = null;
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 确定支付
            surePayMode(){
                console.log('支付方式:' + this.payModeVal.name);
                let ShouldPay2 = parseFloat(this.inputShouldPay2.value);
                let shouldPay = parseFloat(this.orderData.shouldPay);
                if(isNaN(ShouldPay2)){
                    this.notify('请输入合法的支付金额')
                    return '';
                }
                if(this.dialogPayMode.code == 'zfb' || this.dialogPayMode.code == 'weipay'){
                    if(!this.inputCode.value){
                        this.notify('请输入支付码')
                        return '';
                    }
                }else if(this.dialogPayMode.code == 'vippay'){
                    if(!this.useVip){
                        this.confirm('请输入会员账号')
                        return '';
                    }
                }
                if(ShouldPay2>shouldPay){
                    this.notify('付款金额不应大于应付金额')
                    return '';
                }
                if(ShouldPay2<=0){
                    this.notify('付款金额需大于0')
                    return '';
                }
                // rechargePay:充值后支付
                this.payment(ShouldPay2,'rechargePay');
            },
            // 取消
            cancelPayMode(){
                this.dialogPayMode.ifShow = false;
            },
            // 返回
            pageBack(num,ifReturn){
                console.log(this.orderData.shouldPay)
                if(!ifReturn && this.orderData.getMoney && this.orderData.getMoney>0 && this.payBack && this.payBack.orderId && !this.payBack.order_over){
                    //已付款，且，未付款完成
                    this.$confirm('当前已有部分付款，是否取消付款，返回到销售状态?', '警告', 
                        {confirmButtonText: '是',   cancelButtonText: '否',type: 'warning'
                    }).then(() => {
                        // 中途退货，原路退款
                        let loginData = this.$store.state.loginData;
                        let param = {
                            action:'halfwayReturn',
                            access_token:loginData.access_token,
                            user_token:loginData.user_token,
                            orderId:this.payBack.orderId,
                            register_vip_must:this.$store.state.loginData.register_vip_must||0
                        }
                        this.$store.commit('loading',{obj:this,type:true});
                        this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                            this.$store.commit('loading',{obj:this,type:false});
                            if(res.data.code==1){
                                this.$route.params.canReturn = true;
                                // this.$router.go(num);
                                this.$router.push('/cashier');
                                this.$destroy();
                            }else{
                                this.$confirm(`${res.data.msg}`, '警告', 
                                    {confirmButtonText: '是',type: 'warning'
                                }).then(() => {
                                    this.$route.params.canReturn = true;
                                    // this.$router.go(num);
                                    this.$router.push('/cashier');
                                    this.$destroy();
                                }).catch(() => {
                                    this.$route.params.canReturn = true;
                                    // this.$router.go(num);
                                    this.$router.push('/cashier');
                                    this.$destroy();
                                });
                            }
                        }, (res) => {
                            this.$store.commit('loading',{obj:this,type:false});
                            console.log(res)
                        });
                    }).catch(() => {
                        console.log('取消了')
                    });
                }else{
                    this.$route.params.canReturn = true;
                    // this.$router.go(num);
                    this.$router.push('/cashier');
                    this.$destroy();
                }
            },
            // 后台判断是否有优惠券
            couponFunc(){
                if(this.payBack){//已有部分支付
                    return '';
                }else if(!this.useVip){//没有登录会员
                    return '';
                }else if(this.discountDlg.ifDiscountScale || this.discountDlg.ifDiscountMoney){//整单折扣
                    return '';
                }
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'goodsanalysis',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    register_vip_must:this.$store.state.loginData.register_vip_must||0,
                    original_discount:this.orderData.totalMoney,//this.orderData.receivable,
                    customer_id:this.useVip.id,
                    customer_name:this.useVip.name,
                    total:this.orderData.totalMoney,// this.orderData.receivable,
                    goods:this.$store.state.cartList
                }
                /*param.wipeZero = this.orderData.discounts;
                // 重算抹零(多付的为负)
                let _money = parseFloat(this.inpCash);//现金支付
                debugger
                if(_money>=parseFloat(parseFloat(this.orderData.shouldPay).toFixed(1)) && param.pay_type == '0'){
                    param.wipeZero = (this.orderData.shouldPay - (parseFloat(parseFloat(this.orderData.shouldPay).toFixed(1))).toFixed(2)).toFixed(2);
                }*/
                this.$store.commit('loading',{obj:this,type:true});
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.coupon}`, param).then((res) => {
                    this.$store.commit('loading',{obj:this,type:false});
                    if(res.data.code==1){
                        let goods = res.data.data.goods;
                        for(let i = 0;i<goods.length;i++){
                            if(goods[i].use_coupon_goods_discount_rate){
                                // goods[i].goods_discount_rate = parseFloat(goods[i].use_coupon_goods_discount_rate).toFixed(4)
                                goods[i].before_coupon_saleprice = goods[i].saleprice;
                                goods[i].before_coupon_total = goods[i].total;
                                goods[i].saleprice = goods[i].use_coupon_saleprice;
                                goods[i].total = goods[i].use_coupon_total;
                            }
                        }
                        this.afterGoods = goods;
                        this.couponList = res.data.data.preparation_use;
                        this.couponTotal = res.data.data.all_relief_money;
                        this.coupon_abnormal = res.data.data.coupon_abnormal||0;//异常金额
                        this.couponOrderTotal = 0;
                        if(this.orderData.getMoney && this.orderData.getMoney>0 || this.payBack && this.payBack.orderId){
                            // 已有部分支付
                        }else{
                            this.countChange(res.data.data.use_coupon_total);
                        }
                    }
                }, (res) => {
                    this.$store.commit('loading',{obj:this,type:false});
                    this.inputCode.value = null;//清空（微信支付宝）条码
                    console.log(res)
                });
            },
            // 付款
            payment(payModeMoney,payCardType){
                if(this.noTouch) return '';
                this.noTouch = true;// 不能点
                setTimeout(()=>{
                    this.noTouch = false;
                },2000)
                let shouldPay = parseFloat(this.orderData.shouldPay);
                let getMoney = parseFloat(this.orderData.getMoney);
                if(shouldPay<=0&&this.payBack){
                    this.pageBack(-1);
                    return '';
                }
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'mdorderPayAdd',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                    register_vip_must:this.$store.state.loginData.register_vip_must||0
                }
                param.original_discount = this.orderData.totalMoney;//this.orderData.receivable;
                let _money = parseFloat(this.inpCash);//现金支付
                // al_pay_code
                if(this.dialogPayMode.code == 'weipay' && this.dialogPayMode.ifShow){//其他方式支付
                    _money = payModeMoney;
                    param.wei_pay_code = this.inputCode.value;
                    param.pay_type = 1;
                }else if(this.dialogPayMode.code == 'zfb' && this.dialogPayMode.ifShow){//其他方式支付
                    _money = payModeMoney;
                    param.al_pay_code = this.inputCode.value;
                    param.pay_type = 2;
                }else if(this.dialogPayMode.code == 'vippay' && this.dialogPayMode.ifShow){
                    _money = payModeMoney;
                    param.pay_type = 3;
                }else if(this.dialogPayMode.code == 'vippayP'){
                    _money = payModeMoney;
                    param.pay_type = 3;
                }else if(this.dialogPayMode.code == 'bankpay'){
                    _money = payModeMoney;
                    param.pay_type = 8;
                }else{
                    if(this.orderData.change>99.99){
                        this.notify('付款有误，找零金额不能大于100');
                        return '';
                    }
                    param.pay_type = '0';
                    if(_money!=parseFloat(_money.toFixed(1))){
                        this.notify('请输入至少整角的现金金额');return '';
                        return '';
                    }
                    if(this.orderData.change>0){
                        param.giveChange = 0-this.orderData.change;
                    }
                }
                if(payCardType&&payCardType=='family'){//家庭卡
                    param.pay_type = 9;
                    if(parseFloat(this.useVip.family_money)<parseFloat(this.orderData.shouldPay)){
                        this.notify('家庭卡金额不足');
                        return '';
                    }
                }
                //现金方式
                if((!_money || _money<=0)&&this.payBack){this.notify('请输入大于0的金额');return '';}
                param.money = _money;//付款金额
                if(getMoney && getMoney>0 && this.payBack){//已有部分支付
                    param.orderId = this.payBack.orderId;
                }else{
                    param.total = this.couponOrderTotal||this.orderData.receivable;
                    param.goods = this.afterGoods||this.$store.state.cartList;
                }
                if(this.useVip){
                    param.customer_id = this.useVip.id;
                    param.customer_name = this.useVip.name;
                }
                if(this.payBack && this.payBack.remotelyOrderId){
                    param.remotelyOrderId = this.payBack.remotelyOrderId;
                }
                if(this.discountDlg.ifDiscountScale){
                    param.discount_type = 2;
                    param.discount_rate = this.discount_rate;
                    param.total = this.discountDlg.value;
                    param.wipeZero = 0;
                }
                if(this.discountDlg.ifDiscountMoney){
                    param.discount_type = 1;
                    param.total = this.discountDlg.value;
                    param.wipeZero = 0;
                }
                // 优惠券列表，优惠后金额
                if(this.couponList.length>0){
                    param.preparation_use = this.couponList;
                    param.all_relief_money = this.couponTotal;
                    param.coupon_abnormal = this.coupon_abnormal;
                }
                param.wipeZero = this.orderData.discounts;
                // 重算抹零(多付的为负)
                if(param.pay_type == '0'){
                    if(_money>=parseFloat(parseFloat(this.orderData.shouldPay).toFixed(1))){
                        param.wipeZero = (this.orderData.shouldPay - (parseFloat(parseFloat(this.orderData.shouldPay).toFixed(1))).toFixed(2)).toFixed(2);
                    }else{
                        param.wipeZero = 0;
                    }
                }else{
                    param.wipeZero = 0;
                }
                
                /*if(recharge){
                    let useVip = this.useVip;
                    let loginData = this.$store.state.loginData;
                    let _param = {
                        // access_token:loginData.access_token,
                        // user_token:loginData.user_token,
                        id:useVip.id,
                        money:_money,
                        give:0,
                    }
                    if(this.dialogPayMode.code=='zfb'){_param.pay_type = '2';_param.authCode = this.inputCode.value;}
                    else if(this.dialogPayMode.code=='weipay'){_param.pay_type = '1';_param.authCode = this.inputCode.value;}
                    param.recharge = _param;
                }*/
                this.$store.commit('loading',{obj:this,type:true});
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                    this.$store.commit('loading',{obj:this,type:false});
                    this.inputCode.value = null;//清空（微信支付宝）条码
                    // if(res.data&&res.data.data&&res.data.data.orderId){
                    if(res.data.code==1){
                        let payBack = res.data.data;
                        let error = false;
                        //判断本次支付金额是否前后台一致
                        if(param.pay_type == '0'){//现金
                            let m = parseFloat((parseFloat(this.orderData.cash) + parseFloat(param.money)).toFixed(2));
                            if(m == payBack.cash){
                                this.orderData.cash = m
                            }else error = true;
                        }else if(param.pay_type == '1'){//微信
                            let m = parseFloat((parseFloat(this.orderData.weip) + parseFloat(param.money)).toFixed(2));
                            if(m == payBack.weip){
                                this.orderData.weip = m
                            }else error = true;
                        }else if(param.pay_type == '2'){//支付宝
                            let m = parseFloat((parseFloat(this.orderData.zfbao) + parseFloat(param.money)).toFixed(2));
                            if(m == payBack.zfbao){
                                this.orderData.zfbao = m
                            }else error = true;
                        }else if(param.pay_type == '3'){//会员卡
                            let m = parseFloat((parseFloat(this.orderData.card) + parseFloat(param.money)).toFixed(2));
                            if(m == payBack.card){
                                this.orderData.card = m
                            }else error = true;
                        }else if(param.pay_type == '8'){//农行聚合码
                            let m = parseFloat((parseFloat(this.orderData.bankpay) + parseFloat(param.money)).toFixed(2));
                            if(m == payBack.agriculturalBank){
                                this.orderData.bankpay = m
                            }else error = true;
                        }else if(param.pay_type == '9'){//家庭卡
                            let m = parseFloat((parseFloat(this.orderData.familyCard) + parseFloat(param.money)).toFixed(2));
                            if(m == payBack.family_pay){
                                this.orderData.familyCard = m
                            }else error = true;
                        }
                        //判断本单各支付方式金额是否前后一致
                        if(this.orderData.cash&&payBack.cash&&this.orderData.cash!=payBack.cash) error = true;
                        if(this.orderData.card&&payBack.card&&this.orderData.card!=payBack.card) error = true;
                        // error==true，校验前后金额不匹配，认为订单有问题
                        if(error){
                            this.notify('支付出错，请重新下单');
                            this.orderData.shouldPay = 0;
                            return '';
                        }
                        this.payBack = payBack;//保存支付回调数据
                        this.ifNewPay = true;//重新输入金额，不累加
                        //判断是否已支付完成
                        if((param.pay_type==0&&_money>=shouldPay.toFixed(1)||_money>=shouldPay) && payBack.order_over){
                            if(param.pay_type!=0)this.orderData.change = '0.00'
                            this.orderData.getMoney = (getMoney + shouldPay).toFixed(2);
                            this.orderData.shouldPay = '0.00';
                            this.cartList = this.afterGoods||this.$store.state.cartList;
                            this.totalNum = this.$store.state.totalNum;
                            this.printData.userData = this.useVip;//用于打印小票的会员信息
                            this._print();//打印小票（务必在清空购物车之前打印小票）
                            // 向父组件传递事件，清空购物车
                            this.$store.commit('changeCart',{type:'empty'})
                            this.notify('支付完成','提示','green')
                            // 缓存最后一单数据
                            localStorage.lastOrder = JSON.stringify(res.data.data);
                            // 支付完成，清空会员信息
                            if(res.data.data.user_money) this.useVip.user_money = res.data.data.user_money;
                            if(res.data.data.family_user_money) this.useVip.family_money = res.data.data.family_user_money;
                            // this.useVip = null;
                            localStorage.removeItem("useVip");
                            if(this.orderData.cash && this.orderData.cash>0){
                                this.OpenQx();//弹出收银箱
                            }
                            if(JSON.parse(localStorage.setupData).ifReturnPage){
                                let time = parseFloat(JSON.parse(localStorage.setupData).returnCD||0);
                                setTimeout(()=>{
                                    this.pageBack(-1);
                                },time*1000)
                            }
                        }else{
                            this.orderData.getMoney = (getMoney + _money).toFixed(2);
                            this.orderData.shouldPay = (shouldPay - _money).toFixed(2);
                        }
                        this.dialogPayMode.code = null;
                        this.dialogPayMode.ifShow = false;//隐藏支付模态框
                        this.inpCash = this.mathCeilFunc(this.orderData.shouldPay);//将待支付金额，填入现金输入框
                    }else if(res.data.code=='1990077'){
                        let callback = this.pageBack.bind(this,-1,true);
                        this.confirm(res.data.msg,callback);
                    }else{
                        this.notify(res.data.msg);
                    }
                }, (res) => {
                    this.$store.commit('loading',{obj:this,type:false});
                    this.inputCode.value = null;//清空（微信支付宝）条码
                    console.log(res)
                });

            },
            // 计算找零(传参，重新计算金额)
            countChange(_money){
                if(_money){
                    // let receivable = this.myFunction(_money,1).toString();
                    let receivable = _money;
                    if(this.couponList.length>0 && this.couponOrderTotal==0){
                        this.orderData.receivable = this.orderData.totalMoney;//有折扣时原价为应收
                        this.couponOrderTotal = receivable;
                        this.orderData.discounts = (this.orderData.totalMoney - this.couponOrderTotal).toFixed(2);;
                        this.orderData.shouldPay = this.couponOrderTotal;
                    }else if(!this.discountDlg.ifDiscountScale&&!this.discountDlg.ifDiscountMoney){
                        this.orderData.receivable = receivable;//(receivable.indexOf('.')>=0?receivable + '0':receivable + '.00');//无折扣时正常抹零为应收
                        this.orderData.discounts = (this.orderData.totalMoney - this.orderData.receivable).toFixed(2);
                        this.orderData.shouldPay = this.orderData.receivable;//初次加载，待收金额==应收金额
                    }else if(this.discountDlg.ifDiscountMoney){
                        this.orderData.receivable = this.orderData.totalMoney;//有折扣时原价为应收
                        this.discountDlg.value = receivable;//(receivable.indexOf('.')>=0?receivable + '0':receivable + '.00')
                        this.orderData.discounts = (this.discountDlg.value - this.orderData.receivable).toFixed(2);
                        this.orderData.shouldPay = this.discountDlg.value;//整单折价，待收金额==应收金额
                    }else if(this.discountDlg.ifDiscountScale){
                        this.orderData.receivable = this.orderData.totalMoney;//有折扣时原价为应收
                        this.discount_rate = (this.discountDlg.value/100).toFixed(2);
                        this.discountDlg.value = (this.accMul(this.orderData.receivable,this.discount_rate)).toFixed(2);
                        // this.discountDlg.value = (this.orderData.receivable*this.discount_rate).toFixed(1)+'0';
                        this.orderData.discounts = (this.discountDlg.value - this.orderData.receivable).toFixed(2);
                        this.orderData.shouldPay = this.discountDlg.value;
                    }
                    this.inpCash = this.mathCeilFunc(this.orderData.shouldPay);//默认填写等额现金
                }
                if(parseFloat(this.inpCash)>parseFloat(this.orderData.shouldPay)){
                    this.orderData.change = (this.inpCash - parseFloat(this.orderData.shouldPay).toFixed(1)).toFixed(2)
                    // this.orderData.change = (this.inpCash - this.orderData.shouldPay).toFixed(2)
                }else{
                    this.orderData.change = '0.00'
                }
            },
            // 取消
            cancel(){
                this.inpCash = '';
                this.countChange();
            },
            // 删除一位
            delStr(){
                if(this.inpCash){
                    this.inpCash = this.inpCash.substr(0,this.inpCash.length-1)
                    this.countChange();
                }
            },
            // 手动输入金额
            cashStr(str){
                let cash = this.inpCash;
                if(this.ifNewPay){
                    cash = str;
                }else{
                    cash += str;
                }
                // 输入不合法，则不保存
                if(!isNaN(cash)){
                    // 输入超过两位小数，则不保存
                    if(cash.indexOf('.')<0 || cash.length-cash.indexOf('.')<=3){
                        this.inpCash = cash;
                        this.ifNewPay = false;
                        this.countChange();
                    }else{
                        if(str == '00')
                        this.cashStr('0')
                    }
                }
            },
            // 手动选择人民币
            cashNum(num){
                if(this.ifNewPay){
                    this.inpCash = num;
                }else{
                    this.inpCash = parseFloat(this.inpCash||0) + parseFloat(num);
                }
                this.inpCash = (this.inpCash).toString()
                this.ifNewPay = false;
                this.countChange();
            },
            // 其他方式操作
            checkType(clickType){
                if(clickType=='cancelCart'){
                    this.cancelCart()
                }else if(clickType=='discount'){
                    this.discountCart()
                }else if(clickType == 'vip'){
                    if(this.orderData.getMoney && this.orderData.getMoney>0 && this.payBack && this.payBack.orderId){
                        this.notify('已有部分支付，不允许再使用会员！！')
                        return '';
                    }
                }else if(clickType == 'remark'){

                }
            },
            //整单取消
            cancelCart(){
                if(this.$store.state.cartList.length<=0){
                    this.notify('已结算，此功能键无效！')
                    return ''
                }
                this.$confirm('确定取消整单吗, 是否继续?', '警告', 
                    {confirmButtonText: '确定',   cancelButtonText: '取消',type: 'warning'
                }).then(() => {
                    this.$store.commit('changeCart',{type:'empty'})
                    this.$message({ type: 'success', message: '删除成功!'});
                    this.pageBack(-1);
                }).catch(() => {
                    // this.$message({ type: 'info', message: '已取消删除'}); 
                });
            },
            // 整单折价
            discountCart(){
                if(this.orderData.getMoney && this.orderData.getMoney>0){
                    this.notify('已有部分支付，不允许再整单折扣！！')
                    return '';
                }
                if(this.couponList.length){
                    this.$confirm('整单折扣将不可以使用优惠券？确定要整单折扣吗', '警告', 
                        {confirmButtonText: '确定',   cancelButtonText: '取消',type: 'warning'
                    }).then(() => {
                        this.couponList = [];
                        this.couponOrderTotal = 0;
                        this.couponTotal = 0;
                        this.afterGoods = null;
                        this.countChange(this.orderData.totalMoney);
                        this.discountCart()
                    }).catch(() => {
                        // this.$message({ type: 'info', message: '已取消删除'}); 
                    });
                    return '';
                }
                if(this.discountDlg.ifDiscountMoney || this.discountDlg.ifDiscountScale){
                    this.$confirm('当前已整单折扣, 是否要取消整单折扣？请确定', '警告', 
                        {confirmButtonText: '确定',   cancelButtonText: '取消',type: 'warning'
                    }).then(() => {
                        this.discountDlg.ifDiscountMoney = false
                        this.discountDlg.ifDiscountScale = false
                        this.discountDlg.value = ''
                        this.countChange(this.orderData.totalMoney);
                    }).catch(() => {
                        // this.$message({ type: 'info', message: '已取消删除'}); 
                    });
                }else if(this.discountDlg.ifDiscountScale){

                }else{
                    this.discountDlg.ifShow = true;
                    this.discountDlg.value = '';
                    setTimeout(()=>{
                        this.getDisInputFocus();
                    },0)
                }
            },
            // 整单折扣的焦点
            getDisInputFocus(){
                this.$refs.disInput.focus();
            },
            // 组件输入框获取焦点
            getCompFocus(){
                this.inputCode.focus = true;
                this.inputVipId.focus = true;
            },
            // 会员操作
            userHandle(bartype,payCardType){
                if(bartype=='reload'){
                    this.checkPayMode('vippay','重选会员卡');
                }else if(bartype=='recharge'){
                    this.payData.shouldPay = this.orderData.shouldPay
                    this.rechargeVip();
                }else if(bartype=='pay') {
                    this.dialogPayMode.code = 'vippayP';
                    this.payment(this.orderData.shouldPay,payCardType)
                }
            },
            // 选择其他支付方式
            checkPayMode(code,name){
                if(!this.useVip && name!='重选会员卡'&& this.$store.state.loginData.register_vip_must==1){
                    this.$message.error('请登录会员后在尝试');
                    return '';
                }
                this.getCompFocus();
                if(this.orderData.shouldPay<=0&&this.payBack){
                    this.pageBack(-1);
                    return '';
                }
                if(this.orderData.card && code=='vippay' || this.orderData.weip && code=='weipay' || this.orderData.zfbao && code=='zfb'){
                    this.confirm(`当前付款方式(${name})已存在，请选择其他付款方式！`)
                    return '';
                }
                console.log(code)
                this.payModeVal.name = name;
                this.payModeVal.code = code;
                this.inputShouldPay1.value = this.orderData.shouldPay;
                this.inputShouldPay2.value = this.orderData.shouldPay;
                this.inputCode.value = null;//条码输入框
                this.inputVipId.value = null;//会员卡号输入框
                // 弹出输入框
                this.dialogPayMode.code = code;
                this.dialogPayMode.ifShow = true;
                this.inputCompSize.ifFocus = true;
            },
            // 输入整单折价金额、比例
            cashStr_D(str){
                let discountDlg = this.discountDlg;
                if(str == 'delete'){
                    discountDlg.value = discountDlg.value.substr(0,discountDlg.value.length-1);
                }else{
                    discountDlg.value += str;
                }
                // 输入不合法，则不保存
                if(!isNaN(discountDlg.value)){
                    this.discountDlg = discountDlg;
                }
            },
            // 隐藏折价模态框
            discountCancel(){
                this.discountDlg.ifShow = false;
                this.discountDlg.activeTabName = 'scale';
            },
            // 权限校验
            checkPowerCallback(_type,callback){
                if(_type=='discount'){
                    this.checkInfo = {
                        rule_id:'3',//整单打折
                        ifAsk:true,//弹出登录出口前是否询问
                        msg:'整单折扣'
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
            },
            // 提交折价信息
            discountSure(){
                let discountDlg = this.discountDlg;
                let value = discountDlg.value;
                if(isNaN(value)){
                    this.notify('输入的信息不合法')
                    return '';
                }
                if(discountDlg.activeTabName == 'scale' && (discountDlg.value>99 || parseInt(discountDlg.value) != discountDlg.value)){
                    this.notify('请输入1-99的整数比例');
                    return '';
                }
                if(discountDlg.activeTabName == 'scale'){
                    this.discountDlg.ifDiscountScale = true;
                    this.discountDlg.ifDiscountMoney = false;
                    this.countChange(this.discountDlg.value)
                }else if(discountDlg.activeTabName == 'money'){
                    this.discountDlg.ifDiscountScale = false;
                    this.discountDlg.ifDiscountMoney = true;
                    this.countChange(this.discountDlg.value)
                }
                this.discountCancel()
            },
            mathCeilFunc(_num){
                let num = parseFloat(parseFloat(_num).toFixed(1)).toFixed(2)
                return num;
            },
            // 向下保留ws位小数
            myFunction(num,ws){
                var money = parseFloat(parseFloat(num).toFixed(1))
                return money;
                // var m = Math.pow(10,ws);
                // return Math.floor(num*m)/m;
            },
            // 处理会员信息（家庭卡）
            reUseVip(vipMsg){
                if(vipMsg.now_code==2 || vipMsg.now_code==3){//会员卡 手机号
                    // if(vipMsg.family_money && vipMsg.user_money<this.orderData.shouldPay && vipMsg.family_money>=this.orderData.shouldPay){
                    if(vipMsg.family_money && vipMsg.identity_type!=0 && parseFloat(vipMsg.family_money)>=parseFloat(this.orderData.shouldPay)){
                        //家庭卡且不是父卡 子卡钱不够，父卡钱够
                        vipMsg.payCardType = 'family';
                    }else{
                        // 不是家庭卡 或 家庭卡且自身是父卡
                        vipMsg.payCardType = 'user';
                    }
                // }else if(vipMsg.now_code==1 && vipMsg.identity_type==0){//小程序父卡
                }else if(vipMsg.now_code==1 && vipMsg.family_use_now==1){//小程序父卡    
                    vipMsg.payCardType = 'family';
                }else if(vipMsg.now_code==1){//小程序子卡
                    vipMsg.payCardType = 'user';
                }
                localStorage.useVip = JSON.stringify(vipMsg);
                this.useVip = vipMsg;
                // 后台判断是否有优惠券
                this.couponFunc();
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
            confirm(text,callback){
                this.$confirm(text, '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                }).then(() => {
                    if(callback) callback()
                }).catch(() => {
                    if(callback) callback()      
                });
                /*this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});*/
            },
            timestampToTime(timestamp) {
                var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                return Y+M+D;
            },
            // 弹出收银箱
            OpenQx(){
                let LODOP=getLodop();
                if(LODOP){
                    // LODOP.WRITE_PORT_DATA("COM4",String.fromCharCode(27)+','+String.fromCharCode(112)+','+String.fromCharCode(0)+','+String.fromCharCode(128)+','+String.fromCharCode(128));
                    let strData=String.fromCharCode(27,112,1,128,128);
                    LODOP.SET_PRINT_MODE("SEND_RAW_DATA_ENCODE","UTF-8");//UTF-8 UTF-7 UNICODE ANSI UTF-16 UTF-16BE GBK BIG5 EUC-JP
                    if (LODOP.CVERSION) {
                        if (LODOP.SEND_PRINT_RAWDATA(strData))
                            console.log("发送命令成功！"); else console.log("发送命令失败！");
                    }
                }
            },
            // 打印小票
            _print(){
                this.printData.orderData.orderId = this.payBack.order_sn;
                this.printData.orderData.order_over_time = this.payBack.order_over_time;
                this.printData.orderData.wipeZeroMoney = this.payBack.wipeZeroMoney;//抹零
                this.printData.orderData.giveChangeMoney = (this.payBack.giveChangeMoney>0?this.payBack.giveChangeMoney:(0-this.payBack.giveChangeMoney).toFixed(2));//抹零
                this.printData.orderData.receivable = this.couponOrderTotal||this.orderData.receivable;
                this.printData.orderData.goods = this.afterGoods||this.$store.state.cartList;
                this.printData.orderData.cash = this.orderData.cash||0;
                this.printData.orderData.weip = this.orderData.weip||0;
                this.printData.orderData.change = this.orderData.change||0;
                this.printData.orderData.card = this.orderData.card||0;
                this.printData.orderData.zfbao = this.orderData.zfbao||0;
                this.printData.orderData.bankpay = this.orderData.bankpay||0;
                this.printData.orderData.familyCard = this.orderData.familyCard||0;
                this.printData.orderData.conpon = this.payBack.all_relief_money||0;
                this.printData.orderData.totalNum = this.$store.state.totalNum;
                if(this.discountDlg.ifDiscountScale||this.discountDlg.ifDiscountMoney){
                    this.printData.orderData.discountPrice = this.discountDlg.value
                }
                
                this.printData.orderData.nickname = this.payBack.nickname||null;//会员昵称
                this.printData.orderData.user_money = this.payBack.user_money||null;//会员余额
                this.$refs.receiptModal.print();
            },
            getSetupList(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'getPayType',
                    access_token:loginData.access_token,
                    user_token:loginData.user_token,
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.login}`, param).then((res) => {
                    if(res.data.code==1){
                        this.payType = res.data.data;
                        for(let i=0;i<this.payType.length;i++){
                            if(this.payType[i].code=='cash'){
                                this.cashPay = true;
                            }else if(this.payType[i].code=='vippay'){
                                this.vipPay = true;
                            }
                        }
                        /*[
                            {name:'支付宝',icon:'./../../assets/paytype_zhifubao.png',code:'zfb'},
                            {name:'微信支付',icon:'./../../assets/paytype_weixin.png',code:'weipay'},
                            // {name:'银行卡',icon:'./../../assets/paytype_yinlian.png',code:'bank'},
                            {name:'会员卡',icon:'./../../assets/paytype_chuxuka.png',code:'vippay'},
                            // {name:'积分付款',icon:'./../../assets/paytype_jifen.png',code:'jf'},
                            // {name:'微信扫码付',icon:'',code:'wxsm'}
                        ]*/
                    }else{
                        this.notify('没有查询到会员信息')
                    }
                }, (res) => {
                    console.log(res)
                });
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
            }
        },
        updated:function(){
            // console.log(this.$route.query)
        },
        watch:{
            $route(to,from){
                console.log(to.path);
                if(to.path == '/cashier'){
                    this.initComp()//初始化组件数据
                }
            },
            userAccount(val){
                // alert(val)
            },
            couponList(val,oldval){
                // 清空优惠券的优惠金额
                if(val.length<=0){ 

                }else{
                    // 重新计算优惠券的优惠金额

                }
            }
            // $store.state.totalMoney(val){
            //     console.log(val)
            // }
        },
        //keep-alive 组件停用时调用
        deactivated:function(){
            console.log('阿偶')
        },
        //keep-alive 组件激活时调用
        activated:function(){
            console.log('activated')
            console.log(this.payBack);
            let totalMoney = this.$store.state.totalMoney;
            this.orderData.totalMoney = totalMoney;
            console.log(`totalMoney:${totalMoney}`)
            this.countChange(totalMoney);
            if(localStorage.useVip){
                this.reUseVip(JSON.parse(localStorage.useVip))
            } 
            // this.useVip = JSON.parse(localStorage.useVip);
            this.getSetupList();
            this.handleTrigger();
        },
        mounted:function(){
          console.log('mounted')
        }
    }
</script>