<template>
    <div class="pageBox">
        <el-container>
            <el-main style="padding:0;background-color:#fff;">
                <el-container style="background-color:#fff;">
                    <el-header>
                        <!-- <el-checkbox v-model="checked" style='line-height:40px;float:left;margin-right:10px'>联网查询</el-checkbox> -->
                        <div style="float:left;margin-right:10px">
                            <el-cascader placeholder="请选择商品分类" expand-trigger="click" v-model="goodsCartSelect" :options="goodsCart" :props="goodsCartProps" filterable change-on-select @change="selectCart" clearable style="width:240px;"></el-cascader>
                        </div>
                        <el-input ref="goodsInput" style="width:180px;" v-model="form.search" placeholder='请输入商品名称/货号' clearable @clear="callbackFunc(getGoodsList)" @keyup.enter.native="callbackFunc(getGoodsList)"></el-input>
                        <el-select v-model="checkValue" placeholder="请选择" @change="callbackFunc(getGoodsList)">
                            <el-option v-for="item in stockStateOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-button @click="callbackFunc(getGoodsList)" type="primary">查询</el-button>
                    </el-header>
                    <el-main style="padding:10px;" @click.native="focusObj('goodsInput')">
                        <el-table :data="goodsList" border :header-cell-style="rowClass" style="width: 100%;" :row-class-name="tableRowClassName" @sort-change="searchSort">
                            <el-table-column prop="rows" label="行号" width="50" type="index"></el-table-column>
                            <el-table-column prop="bar_code" label="货号" width="150">
                              <template slot-scope="scope">
                                <span>{{scope.row.code?scope.row.code:scope.row.bar_code}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
                            <el-table-column sortable="custom" prop="num" label="库存" width="150">
                              <template slot-scope="scope">
                                <span v-if="scope.row.num<0" style="color:#F56C6C;font-weight:bold;">{{scope.row.num}} {{scope.row.unit}}</span>
                                <span v-else-if="scope.row.num==0" style="color:#E6A23C;font-weight:bold;">{{scope.row.num}} {{scope.row.unit}}</span>
                                <span v-else style="color:#666;font-weight:bold;">{{scope.row.num}} {{scope.row.unit}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="category_id" label="商品类型"></el-table-column>
                            <!-- <el-table-column prop="price" label="库存均价/元"></el-table-column> -->
                        </el-table>
                    </el-main>
                    <el-footer style="height:50px;" @click.native="focusObj('goodsInput')">
                        <div class="handleGoods" style="display:inline-block;float:right;padding-top: 6px;height:auto;">
                            <div class="pageDown" @click="changePage('+','goods')" style="width:80px;margin-left:0;">
                                <img src="./../assets/cut_down.png" width="20px">
                                <span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
                            </div>
                            <span class="pageNum" style="margin:0 10px;line-height:40px;float:right;">第 {{form.page}} 页<span style="font-size:12px;" v-if="totalNum"> ( 共 {{Math.ceil(totalNum/form.limit)}} 页 )</span></span>
                            <div class="pageUp" @click="changePage('-','goods')" style="width:80px;margin-left:0;">
                                <img src="./../assets/cut_up.png" width="20px">
                                <span style="font-size: 12px;color: #6c8bd3;line-height: 38px;"></span>
                            </div>
                        </div>
                    </el-footer>
                </el-container>
            </el-main>
        </el-container>
    </div>
</template>
<style type="text/css">
    @import './../static/manageVip.css'
</style>
<style type="text/css">
    .el-table .danger-row {
      background: rgba(245,108,108,.1);
    }
    .el-table .warning-row {
      background: rgba(230,162,60,.1);
    }
    .el-table .success-row {
      background: rgba(103,194,58,.0);
    }
</style>
<script type="text/ecmascript-6">
    import communityComp from "./comp/communityComp"
    export default {
        name:'shopCart',
        components: {
            'communityComp': communityComp,
        },
        data(){
            var val_name = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入姓名'));
                } else {
                    var r = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
                    if(!r.test(value)){
                        callback(new Error("姓名只可输入中英文和'_'"));
                    }else{
                        callback();
                    }
                }
            };
            var val_mobile = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入手机号'));
                } else if (isNaN(value)) {
                    callback(new Error('手机号必须为数字'));
                } else if ((value).toString().length!=11) {
                    callback(new Error('手机号必须为11位'));
                } else {
                    callback();
                }
            };
            var val_customer_card = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入卡号'));
                } else if (isNaN(value)) {
                    callback(new Error('卡号必须为数字'));
                // } else if ((value).toString().length!=12) {
                //     callback(new Error('请输入12位卡号'));
                } else {
                    callback();
                }
            };
            return {
              // 排序类型(包括排序参数，升降序)
              sortState:null,
              goodsCart: [],
              goodsCartSelect:[],
              goodsCartProps:{
                value: 'goods_category_id',
                label: 'name',
                children: 'son'
              },
              // 库存类型
              stockStateOption:[
                {value: '-1',label: '全部'},
                {value: '1',label: '现有库存'},
                {value: '2',label: '零库存'},
                {value: '3',label: '负库存'},
              ],
              checkValue:'-1',//默认库存类型
              goodsList:[],//购买商品
              totalNum:null,//商品数量
              form:{
                goodsId:null,
                search:null,
                page:1,
                limit:10,
              },
              printData:{
                  setupData:null,
                  initData:{
                      ifShow:0,
                      ifReprint:false,
                      printType:'recharge'
                  },
                  rechargeData:{},
              }
            }
        },
        watch:{
            'form.time':{
                handler:function(newValue,oldValue) {   //特别注意，不能用箭头函数，箭头函数，this指向全局
                    this.form.page = 1;
                    this.getGoodsList();
                },
                deep: true    //深度监听
            },
            $route(to,from){
                console.log(to.path);
                if(to.path == '/goods_stock'){
                    this.initComp();
                }
            },
        },
        mounted:function(){
            this.initComp();
        },
        methods:{
            tableRowClassName({row, rowIndex}) {
              if(row.num<0) {
                return 'danger-row';
              } else if (row.num==0) {
                return 'warning-row';
              } else {
                return 'success-row';
              }
              return '';
            },
            // 重置页号 回调方法
            callbackFunc(_callback){
                this.form.page = 1;
                // this.goodsList = null;
                setTimeout(()=>{
                    _callback();
                },0)
            },
            // 切换页号
            changePage(changeType,_type){
                if(!this.goodsList){return '';}
                let curPage = this.form.page;
                let param = {}
                if(changeType == '+'){
                    if(this.totalNum<=this.form.limit*curPage)return '';
                    this.form.page = parseInt(curPage)+1
                }else if(changeType == '-'){
                    if(curPage==1)return '';
                    this.form.page = parseInt(curPage)-1
                }
                this.getGoodsList();
            },
            // 初始化组件
            initComp(){
                console.log('init')
                this.form = {
                  goodsId:null,
                  search:null,
                  page:1,
                  limit:10,
                }
                this.goodsCart = [];
                this.goodsCartSelect = [];
                this.goodsList = null;
                this.checkValue = '-1';
                // setTimeout(()=>{this.$refs.searchInput.focus();},50)
                this.$store.commit('loading',{obj:this,type:false});
                this.getGoodsCart();//获取商品分类
                this.focusObj('goodsInput')
            },
            focusObj(refname){
                this.$refs[refname].focus();
            },
            // 获取商品分类
            getGoodsCart(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'getCategorys',
                    access_token:loginData.access_token,//loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.stock}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data.code==1){
                        this.goodsCart = res.data.data;
                        this.getGoodsList();
                    }else{
                        this.showMsg('查询商品分类信息失败')
                    }
                }, (res) => {
                    console.log(res)
                });
            },
            // 切换商品分类筛选条件
            selectCart(e){
              if(e){
                this.form.goodsId = e[e.length-1]
                this.form.page = 1;
                this.getGoodsList()
              }
            },
            // 获取排序条件
            searchSort(e){
              this.sortState = e;
              this.form.page = 1;
              this.focusObj('goodsInput')
              this.getGoodsList();
            },
            getGoodsList(){
                let loginData = this.$store.state.loginData;
                let param = {
                    action:'list',
                    access_token:loginData.access_token,//loginData.access_token,
                    user_token:loginData.user_token,//loginData.access_token,
                    list_rows:this.form.limit,
                    page:this.form.page,
                }
                if(this.checkValue!='-1'){
                  param.kc = this.checkValue;
                }
                if(this.form.search){
                    param.search_data = this.form.search
                }
                if(this.form.goodsId){
                  param.category_id = this.form.goodsId;
                }
                if(this.sortState && this.sortState.prop == 'num'){
                  if(this.sortState.order == 'descending'){//降序
                    param.order_kc = 2;
                  }else if(this.sortState.order == 'ascending'){//升序
                    param.order_kc = 1;
                  }
                }
                this.$http.post(`${this.$store.state.host}${this.$store.state.config.stock}`, param).then((res) => {
                    console.log(res.data.data)
                    if(res.data.code==1){
                        this.goodsList = res.data.data.data;
                        console.log(this.goodsList)
                        this.totalNum = res.data.data.total_row
                    }else{
                        this.showMsg('查询信息失败')
                    }
                    this.focusObj('goodsInput')
                }, (res) => {
                    console.log(res)
                    this.focusObj('goodsInput')
                });
            },
            showModal(_cont,title,handle,_callback){
                let cont = _cont;
                cont = cont.replace(/企业贵宾卡/g,"<span style='color:#B76610;font-weight:bold;'> 企业贵宾卡 </span>");
                let param = {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定'
                }
                if(handle[0]) param.confirmButtonText = handle[0];
                if(handle[1]) param.cancelButtonText = handle[1];
                this.$confirm(cont, title||'提示', param).then(() => {
                    if(_callback)_callback()
                }).catch(() => {
                    return '';
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
                return `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`
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