<!-- 
    小票设置
 -->
<template>
    <div id="receiptSetup">
        <div class="receiptModel" ref="receipt" v-if="printData.setupData" v-show="printData.initData.ifShow=='1'||printData.initData.ifShow==1">
        <!-- <div class="receiptModel" ref="receipt"> -->
            <!-- 订单 -->
            <!-- <img style="width: 110px;" src="./../../assets/logo_store.png"> -->
            <div class='receiptBox' v-if="printData.setupData&&printData.initData.printType=='pay'" :style="{width:(printData.setupData.xpz_width)+'mm'}" style="background-color: rgba(255,255,255,0);padding: 0;box-sizing: border-box;font-size: 11px;font-family:'黑体';">
                <p class='storeName' style='text-align: center;margin: 2px 0 0 0;' :style="printData.setupData.xp_big_title?'font-weight:bold':''">{{printData.setupData.xp_title}}</p>
                <p v-if="printData.setupData.md_info" class='storeName' style='text-align: center;margin: 2px 0 0 0;'>{{printData.setupData.md_info}}</p>
                <div class='reTop' style='margin-top: 8px;'>
                    <p style="margin:0;">单号：{{printData.orderData?printData.orderData.orderId:''}}</p>
                    <p style="margin:0;">收银员：{{$store.state.loginData.username}}</p>
                    <!-- <p style="margin:0;">下单时间：{{printData.orderData?printData.orderData.order_over_time:''}}</p> -->
                    <p style="margin:0;">购买时间：{{printData.orderData?printData.orderData.order_over_time:''}}</p>
                    <!-- <p v-if="printData.setupData.yy_info" style="margin:0;">营业员：{{printData.setupData.yy_info}}</p> -->
                    <p style="margin:0;">打印时间：{{printTime}}</p>
                    <p v-if="printData.initData.ifReprint" style="margin:0;">*重打小票*</p>
                </div>
                <div class='goodsBox' style='margin-top: 10px;height: auto;'>
                    <div class='goodsTop' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;border-top: 1px solid #333;border-bottom: 1px solid #333;padding: 6px 0;'>
                        <span v-if="printData.setupData.name" style='width:40%;text-align:center;'>商品</span>
                        <span v-if="printData.setupData.bar_code&&!printData.setupData.name" style='width:50%;'></span>
                        <span v-if="printData.setupData.num" style='width:30%;text-align:center;'>数量</span>
                        <span v-if="printData.setupData.total_price" style='width:20%;text-align:center;'>小计</span>
                    </div>
                    <ul v-if="printData.orderData" class='goodsCont' style='border-bottom: 1px solid #333;padding-left: 0px;margin: 0;padding:4px 0;'>
                        <li v-if="printData.orderData.goods" v-for="cartItem,index in printData.orderData.goods" :key="index" style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;list-style: none;'>
                            <span v-if="printData.setupData.name" :style="printData.setupData.bar_code?'width:100%;':'width:100%;'" style="display:inline-block;word-break: break-all;">{{cartItem.name}}</span>
                            <span v-if="printData.setupData.bar_code" style='width:42%;display:inline-block;word-break: break-all;'>{{cartItem.bar_code}}</span>
                            <span v-if="printData.setupData.price && cartItem.originalprice && !printData.setupData.bar_code " style='width:32%;display:inline-block;word-break: break-all;'>原价:{{cartItem.originalprice}}</span>
                            <span v-if="printData.setupData.num" style='width:30%;text-align:center;display:inline-block;word-break: break-all;' :style="printData.setupData.bar_code?'width:30%;':'width:36%;'">{{cartItem.saleprice}}元*{{parseFloat(cartItem.num)}}</span>
                            <span v-if="printData.setupData.total_price" style='text-align:center;display:inline-block;word-break: break-all;' :style="printData.setupData.bar_code?'width:20%;':'width:28%;'">{{cartItem.total}}</span>
                            <span v-if="printData.setupData.price && cartItem.originalprice && printData.setupData.bar_code" style='width:30%;display:inline-block;word-break: break-all;'></span>
                            <span v-if="printData.setupData.price && cartItem.originalprice && printData.setupData.bar_code" style='width:40%;text-align:center;display:inline-block;word-break: break-all;'>原价:{{cartItem.originalprice}}</span>
                        </li>
                    </ul>
                    <div class='goodsFoot' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                        <span style='width:70%;'>合计数量：{{printData.orderData.totalNum}}</span>
                        <span style='width:70%;' v-if="printData.orderData.yunfei>0">运费：{{printData.orderData.yunfei}}元</span>
                        <span style='width:70%;' v-if="printData.orderData.conpon>0">优惠券：{{printData.orderData.conpon}}元</span>
                        <span style='width:70%;'>应付：{{printData.orderData.receivable}}元</span>
                        <span style='width:70%;' v-if="printData.orderData.discountPrice">折扣应付：{{printData.orderData.discountPrice}}元</span>
                        <span style='width:70%;' v-if="printData.orderData.wipeZeroMoney>0||printData.orderData.wipeZeroMoney<0">抹零：{{printData.orderData.wipeZeroMoney}}元</span>
                        <span style='width:70%;' v-if="printData.orderData.giveChangeMoney>0">找零：{{printData.orderData.giveChangeMoney}}元</span>
                    </div>
                </div>
                <div class='reFoot' style='margin: 0;padding: 0;display:flex;flex-wrap: wrap;width:100%;'>
                    <div style="width:18%;float:left;line-height:20px;">付款：</div>
                    <div style="width:70%;float:left;line-height:20px;text-align:left;">
                        <div v-if="printData.orderData.cash>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>现金 {{printData.orderData.cash}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.card>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>储值卡 {{printData.orderData.card}}元<span v-if="printData.orderData.user_money&&!printData.orderData.cardReturn"> <br>储值卡余额 {{printData.orderData.user_money}}元</span></div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.familyCard>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>家庭卡支付 {{printData.orderData.familyCard}}元<span v-if="printData.orderData.family_money&&!printData.orderData.familyReturn"> <br>家庭卡余额 {{printData.orderData.family_money}}元</span></div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.weip>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>微信支付 {{printData.orderData.weip}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.zfbao>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>支付宝支付 {{printData.orderData.zfbao}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.bankpay>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>农行聚合码支付 {{printData.orderData.bankpay}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                    </div>
                </div>
                <div v-if="printData.orderData.cardReturn||printData.orderData.weipReturn||printData.orderData.zfbaoReturn||printData.orderData.bankpayReturn||printData.orderData.familyReturn" class='reFoot' style='margin: 0;padding: 0;display:flex;flex-wrap: wrap;width:100%;'>
                    <div style="width:18%;float:left;line-height:20px;">退款：</div>
                    <div style="width:70%;float:left;line-height:20px;text-align:left;">
                        <div v-if="printData.orderData.cardReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>储值卡退款 {{(printData.orderData.cardReturn).toFixed(2)}}元<span v-if="printData.orderData.user_money"> <br>储值卡余额 {{printData.orderData.user_money}}元</span></div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.familyReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>家庭卡退款 {{(printData.orderData.familyReturn).toFixed(2)}}元<span v-if="printData.orderData.family_money"> <br>家庭卡余额 {{printData.orderData.family_money}}元</span></div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.weipReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>微信退款 {{(printData.orderData.weipReturn).toFixed(2)}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.zfbaoReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>支付宝退款 {{(printData.orderData.zfbaoReturn).toFixed(2)}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.cashReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>现金退款 {{printData.orderData.cashReturn}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.bankpayReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>农行聚合码退款 {{(printData.orderData.bankpayReturn).toFixed(2)}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                    </div>
                </div>
                <div class='reFoot' style='margin: 0;padding: 0;width:100%;'>
                    <p v-if="printData.setupData.hy_name&&printData.userData.name" style="margin:0;width:100%;">会员：{{printData.userData.name?printData.userData.name.replace(/^([\u4E00-\u9FA5a-zA-Z]{1})([\u4E00-\u9FA5a-zA-Z]+)/,"$1**"):''}}</p>
                    <p v-if="printData.setupData.hy_name&&printData.userData.mobile" style="margin:0;width:100%;">会员电话：{{printData.userData.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</p>
                    <p v-if="printData.setupData.hy_address && printData.userData.province_name" style="margin:0;width:100%;clear: both;">会员地址：{{printData.userData.province_name||''}} {{printData.userData.city_name||''}} {{printData.userData.county_name||''}}</p>
                    <div v-if="printData.setupData.xp_sh_info" style="width:100%;">
                        <p style="margin:0;" v-if="printData.userData.sh_name">收货人：{{printData.userData.sh_name}}</p>
                        <p style="margin:0;" v-if="printData.userData.sh_mobile">收货人电话：{{(printData.userData.sh_mobile).replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</p>
                        <p style="margin:0;" v-if="printData.userData.sh_address">收货地址：{{printData.userData.sh_address}}</p>
                    </div>
                </div>
                <div v-if="printData.setupData.xp_hnum>=1" class='reFoot' style='margin: 10px 0 0 0;padding: 0;width:100%;'>
                    <p v-if="printData.setupData.xp_hnum>=1" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer1}}</p>
                    <p v-if="printData.setupData.xp_hnum>=2" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer2}}</p>
                    <p v-if="printData.setupData.xp_hnum>=3" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer3}}</p>
                    <p v-if="printData.setupData.xp_hnum>=4" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer4}}</p>
                    <p v-if="printData.setupData.xp_hnum>=5" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer5}}</p>
                </div>
            </div>
            <!-- 充值 -->
            <div class='receiptBox' v-else-if="printData.setupData&&printData.initData.printType=='recharge'" :style="{width:(printData.setupData.xpz_width)+'mm'}" style="background-color: rgba(255,255,255,0);padding: 0;box-sizing: border-box;font-size: 11px;font-family:'黑体';">
                <p class='storeName' style='text-align: center;margin-top: 2px;'>青蛙家会员充值</p>
                <div class='reTop' style='margin-top: 14px;'>
                    <p style="margin:0;">单号：{{printData.rechargeData.sn}}</p>
                    <p style="margin:0;">充值时间：{{printData.rechargeData.pay_time}}</p>
                    <p style="margin:0;">打印时间：{{printTime}}</p>
                    <p style="margin:0;">充卡门店：{{printData.rechargeData.store_name}}</p>
                    <p style="margin:0;">收银员：{{printData.rechargeData.username}}</p>
                    <p v-if="printData.initData.ifReprint" style="margin:0;">*重打小票*</p>
                    <br>
                    <p style="margin:0;">会员：{{printData.rechargeData.vipName?printData.rechargeData.vipName.replace(/^([\u4E00-\u9FA5a-zA-Z]{1})([\u4E00-\u9FA5a-zA-Z]+)/,"$1**"):''}} {{printData.rechargeData.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</p>
                    <p style="margin:0;">支付方式：{{printData.rechargeData.type}}</p>
                    <p style="margin:0;">充值金额：{{printData.rechargeData.money}}元</p>
                    <p v-if="parseFloat(printData.rechargeData.give)>0" style="margin:0;">赠送金额：{{printData.rechargeData.give}}元</p>
                    <p style="margin:0;">充后余额：{{printData.rechargeData.user_money}}元</p>
                </div>
                <div class='reFoot' style='margin-top: 14px;'>
                    <p class='welcome' style='margin: 0;text-align: center;width:100%;'>如有疑问请拨打</p>
                    <p class='welcome' style='margin: 0;text-align: center;width:100%;'>店长电话：{{printData.rechargeData.store_phone}}</p>
                </div>
            </div>
            <!-- 退货 -->
            <div class='receiptBox' v-else-if="printData.setupData&&printData.initData.printType=='returnGoods'" :style="{width:(printData.setupData.xpz_width)+'mm'}" style="background-color: rgba(255,255,255,0);padding: 0;box-sizing: border-box;font-size: 11px;font-family:'黑体';">
                <p class='storeName' style='text-align: center;margin: 2px 0 0 0;' :style="printData.setupData.xp_big_title?'font-weight:bold':''">{{printData.setupData.xp_title}}<span v-if="printData.initData.printType=='returnGoods'">（退货小票）</span></p>
                <p v-if="printData.setupData.md_info" class='storeName' style='text-align: center;margin: 2px 0 0 0;'>{{printData.setupData.md_info}}</p>
                <div class='reTop' style='margin-top: 8px;'>
                    <p style="margin:0;">单号：{{printData.orderData?printData.orderData.orderId:''}}</p>
                    <p style="margin:0;">收银员：{{$store.state.loginData.username}}</p>
                    <!-- <p style="margin:0;">下单时间：{{printData.orderData?printData.orderData.order_over_time:''}}</p> -->
                    <p style="margin:0;">退货时间：{{this.formatTime(new Date())}}</p>
                    <!-- <p v-if="printData.setupData.yy_info" style="margin:0;">营业员：{{printData.setupData.yy_info}}</p> -->
                    <p style="margin:0;">打印时间：{{printTime}}</p>
                    <p v-if="printData.initData.ifReprint" style="margin:0;">*重打小票*</p>
                </div>
                <div class='goodsBox' style='margin-top: 10px;height: auto;'>
                    <div class='goodsTop' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;border-top: 1px solid #333;border-bottom: 1px solid #333;padding: 6px 0;'>
                        <span v-if="printData.setupData.name" style='width:40%;text-align:center;'>商品</span>
                        <span v-if="printData.setupData.bar_code&&!printData.setupData.name" style='width:50%;'></span>
                        <span v-if="printData.setupData.num" style='width:30%;text-align:center;'>数量</span>
                        <span v-if="printData.setupData.total_price" style='width:20%;text-align:center;'>小计</span>
                    </div>
                    <ul v-if="printData.orderData" class='goodsCont' style='border-bottom: 1px solid #333;padding-left: 0px;margin: 0;padding:4px 0;'>
                        <li v-if="printData.orderData.goods" v-for="cartItem,index in printData.orderData.goods" :key="index" style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;list-style: none;'>
                            <span v-if="printData.setupData.name" :style="printData.setupData.bar_code?'width:100%;':'width:100%;'" style="display:inline-block;word-break: break-all;">{{cartItem.name}}</span>
                            <span v-if="printData.setupData.bar_code" style='width:42%;display:inline-block;word-break: break-all;'>{{cartItem.bar_code}}</span>
                            <span v-if="printData.setupData.price && !printData.setupData.bar_code " style='width:30%;display:inline-block;word-break: break-all;'></span>
                            <span v-if="printData.setupData.num" style='width:30%;text-align:center;display:inline-block;word-break: break-all;' :style="printData.setupData.bar_code?'width:30%;':'width:38%;'">{{cartItem.saleprice}}元*{{parseFloat(cartItem.num)}}</span>
                            <span v-if="printData.setupData.total_price" style='text-align:center;display:inline-block;word-break: break-all;' :style="printData.setupData.bar_code?'width:20%;':'width:28%;'">{{cartItem.total}}</span>
                            <!-- <span v-if="printData.setupData.price && printData.setupData.bar_code" style='width:30%;display:inline-block;word-break: break-all;'></span>
                            <span v-if="printData.setupData.price && printData.setupData.bar_code" style='width:40%;text-align:center;display:inline-block;word-break: break-all;'></span> -->
                        </li>
                    </ul>
                    <div class='goodsFoot' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                        <span style='width:70%;'>合计数：{{printData.orderData.totalNum}}</span>
                        <span style='width:70%;'>合计应退：{{printData.orderData.totalMoney}}元</span>
                        <span style='width:70%;' v-if="printData.orderData.wipeZeroMoney>0||printData.orderData.wipeZeroMoney<0">退款抹零：{{printData.orderData.wipeZeroMoney}}元</span>
                    </div>
                </div>
                <div class='reFoot' style='margin: 0;padding: 0;display:flex;flex-wrap: wrap;width:100%;'>
                    <div style="width:18%;float:left;line-height:20px;">退款：</div>
                    <div style="width:70%;float:left;line-height:20px;text-align:left;">
                        <div v-if="printData.orderData.cardReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>储值卡退款 {{printData.orderData.cardReturn}}元<span v-if="printData.orderData.user_money"> <br>余额 {{printData.orderData.user_money}}元</span></div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.familyReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>家庭卡退款 {{(printData.orderData.familyReturn).toFixed(2)}}元<span v-if="printData.orderData.family_money"> <br>家庭卡余额 {{printData.orderData.family_money}}元</span></div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.weipReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>微信退款 {{printData.orderData.weipReturn}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.zfbaoReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>支付宝退款 {{printData.orderData.zfbaoReturn}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.cashReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>现金退款 {{printData.orderData.cashReturn}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                        <div v-if="printData.orderData.bankpayReturn>0" class='payType' style='display: flex;flex-wrap: wrap;line-height: 16px;text-align: left;'>
                            <div style='width:100%;display:inline-block;float:left;line-height:20px;'>农行聚合码退款 {{printData.orderData.bankpayReturn}}元</div>
                            <!-- <div style='width:30%;display:inline-block;float:left;line-height:20px;'></div> -->
                        </div>
                    </div>
                </div>
                <div class='reFoot' style='margin: 0;padding: 0;width:100%;'>
                    <p v-if="printData.setupData.hy_name&&printData.userData.name" style="margin:0;width:100%;">会员：{{printData.userData.name?printData.userData.name.replace(/^([\u4E00-\u9FA5a-zA-Z]{1})([\u4E00-\u9FA5a-zA-Z]+)/,"$1**"):''}}</p>
                    <p v-if="printData.setupData.hy_name&&printData.userData.mobile" style="margin:0;width:100%;">会员电话：{{printData.userData.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</p>
                    <p v-if="printData.setupData.hy_address && printData.userData.province_name" style="margin:0;width:100%;clear: both;">会员地址：{{printData.userData.province_name||''}} {{printData.userData.city_name||''}} {{printData.userData.county_name||''}}</p>
                    <div v-if="printData.setupData.xp_sh_info" style="width:100%;">
                        <p style="margin:0;" v-if="printData.userData.sh_name">收货人：{{printData.userData.sh_name}}</p>
                        <p style="margin:0;" v-if="printData.userData.sh_mobile">收货人电话：{{(printData.userData.sh_mobile).replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</p>
                        <p style="margin:0;" v-if="printData.userData.sh_address">收货地址：{{printData.userData.sh_address}}</p>
                    </div>
                </div>
                <div v-if="printData.setupData.xp_hnum>=1" class='reFoot' style='margin: 10px 0 0 0;padding: 0;width:100%;'>
                    <p v-if="printData.setupData.xp_hnum>=1" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer1}}</p>
                    <p v-if="printData.setupData.xp_hnum>=2" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer2}}</p>
                    <p v-if="printData.setupData.xp_hnum>=3" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer3}}</p>
                    <p v-if="printData.setupData.xp_hnum>=4" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer4}}</p>
                    <p v-if="printData.setupData.xp_hnum>=5" class='welcome' style='margin: 0;text-align: center;width:100%;'>{{printData.setupData.footer5}}</p>
                </div>
            </div>
            <!-- 对账 -->
            <div class='receiptBox' v-else-if="printData.setupData&&printData.initData.printType=='statement'" :style="{width:(printData.setupData.xpz_width)+'mm'}" style="background-color: rgba(255,255,255,0);padding: 0;box-sizing: border-box;font-size: 11px;font-family:'黑体';">
                <p class='storeName' style='text-align: center;margin-top: 2px;'>青蛙家收银对账单</p>
                <div class='reTop' style='margin-top: 14px;padding-bottom:30px;'>
                    <p style="margin:0;">营业门店：{{printData.statementData.store_name}}</p>
                    <p style="margin:0;">收银员：{{printData.statementData.realname}}</p>
                    <p style="margin:0;">对账时间：{{printData.statementData.handoverTime}}</p>
                    <p style="margin:0;">首笔：{{printData.statementData.one_next}}</p>
                    <p style="margin:0;">末笔：{{printData.statementData.finally_next}}</p>
                    <p style="margin:0;">总笔数：{{printData.statementData.total_num}}</p>
                    <br>
                    <p style="text-align:center;">下单</p>
                    <div>
                        <p style="margin:0;">现金</p>
                        <p style="margin:0;text-indent:10px;">销售笔数：{{printData.statementData.cash_market_num}} 金额：{{printData.statementData.cash_market_price}}元</p>
                        <p style="margin:0;text-indent:10px;">退货笔数：{{printData.statementData.cash_return_num}} 金额：{{printData.statementData.cash_return_price}}元</p>
                        <p style="margin:0;text-indent:10px;">找零笔数：{{printData.statementData.cash_change_num}} 金额：{{printData.statementData.cash_change_price}}元</p>
                    </div>
                    <div>
                        <p style="margin:0;">储值卡</p>
                        <p style="margin:0;text-indent:10px;">销售笔数：{{printData.statementData.card_market_num}} 金额：{{printData.statementData.card_market_price}}元</p>
                        <p style="margin:0;text-indent:10px;">退货笔数：{{printData.statementData.card_return_num}} 金额：{{printData.statementData.card_return_price}}元</p>
                    </div>
                    <div>
                        <p style="margin:0;">支付宝</p>
                        <p style="margin:0;text-indent:10px;">销售笔数：{{printData.statementData.alipay_market_num}} 金额：{{printData.statementData.alipay_market_price}}元</p>
                        <p style="margin:0;text-indent:10px;">退货笔数：{{printData.statementData.alipay_return_num}} 金额：{{printData.statementData.alipay_return_price}}元</p>
                    </div>
                    <div>
                        <p style="margin:0;">微信</p>
                        <p style="margin:0;text-indent:10px;">销售笔数：{{printData.statementData.wx_market_num}} 金额：{{printData.statementData.wx_market_price}}元</p>
                        <p style="margin:0;text-indent:10px;">退货笔数：{{printData.statementData.wx_return_num}} 金额：{{printData.statementData.wx_return_price}}元</p>
                    </div>
                    <div>
                        <p style="margin:0;">抹零</p>
                        <p style="margin:0;text-indent:10px;">销售笔数：{{printData.statementData.cash_erase_num}} 金额：{{printData.statementData.cash_erase_price}}元</p>
                        <p style="margin:0;text-indent:10px;">退货笔数：{{printData.statementData.cash_return_erase_num}} 金额：{{printData.statementData.cash_return_erase_price}}元</p>
                    </div>
                    <br>
                    <p style="text-align:center;">充值</p>
                    <div>
                        <p style="margin:0;">现金笔数：{{printData.statementData.cash_recharge_num}} 金额：{{printData.statementData.cash_recharge_price}}元</p>
                        <p style="margin:0;">支付宝笔数：{{printData.statementData.alipay_recharge_num}} 金额：{{printData.statementData.alipay_recharge_price}}元</p>
                        <p style="margin:0;">微信笔数：{{printData.statementData.wx_recharge_num}} 金额：{{printData.statementData.wx_recharge_price}}元</p>
                    </div>

                    <br>
                    <div>
                        <p style="margin:0;">合计</p>
                        <p style="margin:0;text-indent:10px;">总笔数：{{printData.statementData.total_num}} 金额：{{printData.statementData.total_price}}元</p>
                        <p style="margin:0;text-indent:10px;">销售笔数：{{printData.statementData.income_num}} 金额：{{printData.statementData.income_price}}元</p>
                        <p style="margin:0;text-indent:10px;">退货笔数：{{printData.statementData.return_total_num}} 金额：{{printData.statementData.return_total_price}}元</p>
                        <p style="margin:0;text-indent:10px;">抹零/找零总笔数：{{printData.statementData.erase_total_num}} 金额：{{printData.statementData.erase_total_price}}元</p>
                        <p style="margin:0;text-indent:10px;">充值笔数：{{printData.statementData.recharge_total_num}} 金额：{{printData.statementData.recharge_total_price}}元</p>
                    </div>
                </div>
                <!-- <div style='margin-top: 14px;'> -->
                    <!-- <p class='welcome' style='margin: 0;text-align: center;width:100%;'>如有疑问请拨打</p> -->
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>
<style type="text/css">
    #receiptSetup{/*height:100%;*/overflow: auto;}
    #receiptSetup>.el-container{padding: 20px 10px;height: 100%;min-height: 560px;}
    #receiptSetup .el-table{margin: 20px 0;}
    #receiptSetup .el-input{width: 200px;}

    .receiptSave{position: absolute;bottom: 20px;right: 300px;}
    .receiptPrint{position: absolute;bottom: 20px;right: 200px;}
    .receiptModel{position: absolute;bottom: 80px;right: 150px;z-index:1;/*width: 340px;height: 470px;*/padding: 20px;box-sizing: border-box;
        background: url(./../../assets/receipt_bg.png) no-repeat;background-size: 100% 100%;}
</style>
<script type="text/ecmascript-6">
    import {getLodop} from '../../static/LodopFuncs.js'
    export default{
        name:'receiptModal',
        props:["printData"],//是否显示(1显示),订单信息,配置信息,会员信息
        data(){
            return{
                printTime:'2018-11-11 10:01:35',
            }
        },
        watch:{
            //每当组件传来的数据改变，vue会重新渲染该组件，导致当前的值被组件传来的值覆盖(这里组件传来的null)
            /*'printData.setupData'(val,oldval){
                if(oldval && !val){
                    this.printData.setupData = oldval;
                }
            },*/
            /*'printData':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                },
                deep: true    //深度监听
            },*/
            /*'printData.orderData'(val,oldval){
            },*/
            $route(to,from){
                
            },
        },
        methods:{
            initSetup(){
                this.getConfig();
            },
            // 打印小票
            print(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'getPrintName',
                    // access_token:'39454ad13b85965ed40d3632b7de212f',//loginData.access_token,
                    access_token:loginData.access_token,//loginData.access_token,
                    member_id:loginData.id
                }
                this.printTime = this.formatTime(this.getTime(5000));
                // console
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.print}`, param).then((res) => {
                    // console.log(res.data.data)
                    if(res.data){
                        if(res.data.data&&res.data.data.print_name){
                            let curPrint = res.data.data.print_name;
                            // debugger
                            let html = this.$refs.receipt.innerHTML;
                            // return
                            var LODOP = getLodop();
                            LODOP.PRINT_INIT("");
                            LODOP.SET_PRINT_COPIES(this.printData.setupData?this.printData.setupData.xp_fnum:1);//设置打印份数

                            LODOP.SET_PRINTER_INDEXA(curPrint);//设置打印机（允许重新选择）
                            // LODOP.SET_PRINTER_INDEX(curPrint);//设置打印机（禁止重新选择）

                            // LODOP.PRINT_INITA(0,0,0,0,'样票')
                            // LODOP.GET_VALUE('ItemGroundColor',"#FF0000");
                            // LODOP.SET_PRINT_STYLEA(2, "FontSize", 12);
                            // LODOP.SET_PRINT_STYLEA(2, "Bold", 1);
                            // LODOP.SET_PRINT_STYLEA(0, "TransColor", "#FFFFFF");
                            LODOP.SET_PRINT_PAGESIZE(3,'58mm','0mm','');//设定纸张大小
                            LODOP.ADD_PRINT_HTM(0, 0, "58mm", '1mm', html);
                            // LODOP.ADD_PRINT_IMAGE(10,10,300,160,"<img src='https://www.w3cschool.cn/attachments/image/20170831/1504170750981724.jpg'/>");
                            // LODOP.SET_PRINT_STYLEA(0,"HtmWaitMilSecs",1000)//设置上一项延迟超文本下载1000毫秒
                            // LODOP.PREVIEW()//打印预览
                            // LODOP.PRINT_DESIGN();//打开打印设计
                            // LODOP.ADD_PRINT_BARCODE(156,0,238,62,"PDF417","printData.orderData?printData.orderData.orderId:''");
                            // LODOP.ADD_PRINT_HTML(0,0, 110,26,"<img style='width: 110px;' src='http://192.168.3.144:8010/assets/957e021d1f9b077cbd41658fc82914c8.png'>");  
                            setTimeout(()=>{
                                LODOP.PRINT()//打印
                            },1000)
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
            //获取小票配置
            getConfig(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'getSetInfo',
                    access_token:loginData.access_token,//loginData.access_token,
                    // access_token:'39454ad13b85965ed40d3632b7de212f',//loginData.access_token,
                    member_id:loginData.id
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.print}`, param).then((res) => {
                    // console.log(res.data.data)
                    if(res.data){
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
                            form.ifShow = false;
                            this.$set(this.printData,'setupData',form)
                        }else{
                            this.confirm(res.data.msg)
                        }
                    }else{
                        this.confirm('获取小票配置失败')
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            confirm(text){
                this.$confirm(text).then(_ => {
                    done();//用于关闭弹出框
                }).catch(_ => {});
            },
            formatTime(_time){
                let date = new Date();
                if(_time) date = _time;
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const day = date.getDate()
                const hour = date.getHours()
                const minute = date.getMinutes()
                const second = date.getSeconds()
                return `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day} ${hour<10?'0'+hour:hour}:${minute<10?'0'+minute:minute}:${second<10?'0'+second:second}`
                // return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
            },
            // 延迟n秒后的时间戳
            getTime(n){
                let time = Date.parse(new Date())
                let newTime = new Date(time + n)
                return newTime;
            }
        },
        mounted:function(){
            // 父组件没传入配置信息，则获取配置信息
            if(!this.printData.setupData){
                this.getConfig();
            }
        }
    }
</script>