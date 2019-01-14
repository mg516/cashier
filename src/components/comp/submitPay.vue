<template>
    <el-dialog :title="payModeVal.name" :visible.sync="dialogPayMode.ifShow" width="580px">
        <div v-if="dialogPayMode.code=='zfb'||dialogPayMode.code=='wx'" style="text-align:center;">
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
        <div v-else-if="dialogPayMode.code=='wxsm'" style="text-align:center;">
            <div class="demo-input-suffix" style="margin-bottom: 20px;">
                付款金额：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputShouldPay2"></inputComp>
            </div>
            <div class="demo-input-suffix">
                备　　注：<inputComp @info='inputInfo' :inputCompSize="inputCompSize" :inputCompValue="inputCode"></inputComp>
            </div>
        </div>
        <div v-else-if="dialogPayMode.code=='chzh'">
            <el-row width='' style="border:1px solid #000;">
                <el-col :span="8">
                    <div class="cardBox">
                        <div class="cardTitle">当前付款卡信息</div>
                        <div class="cardMsg"><div class="cardLabel">会 员 号：</div><div class="cardVal">{{useVip.customer_id}}</div></div>
                        <div class="cardMsg"><div class="cardLabel">姓　　名：</div><div class="cardVal">{{useVip.name}}</div></div>
                        <div class="cardMsg"><div class="cardLabel">可用余额：</div><div class="cardVal">{{useVip.user_money}}</div></div>
                        <div class="cardMsg"><div class="cardLabel">手　　机：</div><div class="cardVal">{{useVip.mobile}}</div></div>
                        <div @click='rechargeVip' style="margin:4px;display:inline-block;line-height:26px;padding:0 6px;border:1px solid #000000;color:#000000;font-size:12px;font-weight:bold;">充值</div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="cardPayBox">
                        <div class="cardPayMsg">
                            <span class="cardPayLabel">会　　员：</span>
                            <inputComp v-model="userAccount" @info='inputVip' :disabled="!useVip?false:true" :inputCompSize="inputCompSize1" :inputCompValue="inputVipId"></inputComp>
                            <div class="cardPayHandle" @click="searchVip">查询Ent</div>
                            <div class="cardPayHandle">读卡F1</div>
                        </div>
                        <div class="cardPayMsg">
                            <span class="cardPayLabel">待　　收：</span>
                            <div class="cardPayVal">{{orderData.shouldPay}}</div>
                        </div>
                        <div class="cardPayMsg">
                            <span class="cardPayLabel">付款金额：</span>
                            <inputComp @info='inputInfo' :inputCompSize="inputCompSize1" :inputCompValue="inputShouldPay2" v-on:keyEnter="surePayMode"></inputComp>
                        </div>
                        <div class="cardPayMsg">
                            <span class="cardPayLabel">密　　码：</span>
                            <inputComp v-model="userPassword" @info='inputPasswordFunc' :inputCompSize="inputCompSize1" :inputCompValue="inputPassword"></inputComp>
                            <div class="cardPayHandle">修改密码F3</div>
                        </div>
                    </div>
                    <rechargeComp ref="rechargeComp" :vipData='curVip' :refresh='searchVip'></rechargeComp>
                </el-col>
            </el-row>
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
            <el-button type="primary" plain @click="cancelPayMode">取 消</el-button>
            <el-button type="primary" @click="surePayMode">确 定</el-button>
        </span>
    </el-dialog>
</template>
<!-- 未使用 -->
<script type="text/javascript">
    import inputcomp from "../Comp/inputComp"
    import rechargeComp from "../vip/recharge"
    export default {
        components: {
            'inputComp': inputcomp,//输入框组件
            'rechargeComp': rechargeComp
        },
        data(){
            return{
                
            }
        }
    }
</script>