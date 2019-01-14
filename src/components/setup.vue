<template>
	<el-container style="height:100%;padding:10px;">
		<div id="setUp">
			<el-tabs v-model="activeIndex" tab-position="left" style="background-color:#fff;width:100%;height:100%;border-radius:4px;">
				<el-tab-pane name="1" label="打印设置" style="height:100%;overflow: auto;"><printerSetup ref='printerSetup'></printerSetup></el-tab-pane>
                <el-tab-pane name="2" label="小票设置" style="height:100%;overflow: auto;"><receiptSetup ref='receiptSetup'></receiptSetup></el-tab-pane>
				<el-tab-pane name="3" label="操作设置" style="height:100%;overflow: auto;"><handleSetup ref='handleSetup'></handleSetup></el-tab-pane>
			</el-tabs>
		</div>
	</el-container>
</template>
<style type="text/css">
	#setUp{width: 100%;height: 100%}
	#setUp>.el-tabs .el-tabs__content{height: 100%}
</style>
<script>
import printerSetup from "./setUp/printerSetup"
import receiptSetup from "./setUp/receiptSetup"
import handleSetup from "./setUp/handleSetup"
export default {
	components: {
        'printerSetup': printerSetup,
        'receiptSetup': receiptSetup,
        'handleSetup': handleSetup
    },
    watch:{
        'activeIndex':function(val){
            this.getUnitData(val)
        },
        $route(to,from){
            // debugger
            console.log(to.path);
            if(to.path == '/setup'){
                this.getUnitData('1');
            }
        },
    },
	data() {
  		return {
    		activeIndex:'1'
    	};
    },
    methods:{
    	getUnitData(_index){
            let index = _index;
            if(!index) index = this.activeIndex;
            else this.activeIndex = index;
            if(index=='1') this.$refs.printerSetup.reload();
            if(index=='2') this.$refs.receiptSetup.reload();
            if(index=='3') this.$refs.handleSetup.reload();
        }
    },
    mounted:function(){
    	this.getUnitData();
    }
};
</script>