<template>
    <div class="loadingBox" v-if="loadingConfig.status">
        <div class="spinner" :style="spinnerStyle">
            <div>
                <i class="icon-loading" :style="iconStyle"></i><br>
                <i class="text-loading" :style=""></i>
            </div>
            <!-- <p class="text-loading" :style="textStyle">{{loadingConfig.text}}</p> -->
        </div>
    </div>
</template>
<style type="text/css">
    .loadingBox{background-color: rgba(0, 0, 0, 0.1);z-index: 99999999;position: fixed;margin: 0;top: 0;
        right: 0;bottom: 0;left: 0;transition: opacity .3s;color: #666;
        font-weight: bold;letter-spacing: 2px;font-size: 13px;}
    /*animation: rotating 2s linear infinite;*/
    .icon-loading{background-size: 100% 100%;display: inline-block;width: 140px;height: 140px;}
    .spinner{margin-top: -70px;top: 50%;width: 100%;text-align: center;position: absolute;}
    .spinner>div{margin: 0 auto;background-color: #fff;width: 180px;height: 180px;border-radius: 20px;padding: 2px;box-sizing: border-box;}
    .text-loading{background: url(./../../assets/loading-text1.gif) no-repeat;background-size: 100% 100%;display: inline-block;height: 27px;width: 147px;}
</style>
<!-- 未使用 -->
<script type="text/javascript">
    export default {
        name:'loading',
        props:["loadingConfig"],
        data(){
            return{
                spinnerStyle:{
                    marginTop: - parseInt(this.loadingConfig.height/2) + 'px'
                },
                iconStyle:{
                    backgroundImage: 'url(' + this.loadingConfig.icon||'./../../assets/loading-icon.gif' + ')',
                    width: this.loadingConfig.width + 'px',
                    height: this.loadingConfig.height + 'px',
                    fontSize: '13px'
                },
                textStyle:{
                    color: this.loadingConfig.color,
                },
            }
        },
        watch:{
            
        },
        methods:{
            
        },
        mounted:function(){
            // debugger
            // this.initComp();
        },
    }
</script>