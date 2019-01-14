<template>
    <el-cascader @change="changeStatus" v-model="communityData" :options="communityOption" @active-item-change="initComp" :props="communityProps"></el-cascader>
</template>
<script type="text/javascript">
    export default {
        name:'communityComp',
        props:["communityData","communityOption"],
        data(){
            return{
                communityProps: {
                  value: 'id',
                  label:'name',
                  children: 'child'
                },
            }
        },
        watch:{
            communityOption:function(val,oldval){
                debugger
                if(oldval && (!val || val.length<=0)){
                    this.communityOption = oldval;
                }
            }
        },
        methods:{
            changeStatus(val){
                // debugger
                console.log(val)
                // console.log(this.communityData)
                this.$emit("getcomData",val)
            },
            // editCommunity(idArr,_indexArr,data){
            //     let indexArr = _indexArr||[];
            //     for(let i = 0;i<this.communityOption.length;i++){
            //         if(this.communityOption[i].id == idArr[0]){
            //             if(idArr.length==1){ this.communityOption[i].child = data; }
            //             else{
            //                 for(let j = 0;j<this.communityOption[i].child.length;j++){
            //                     if(this.communityOption[i].child[j].id == idArr[1]){
            //                         if(idArr.length==2){ this.communityOption[i].child[j].child = data; }
            //                         else{
            //                             for(let k = 0;k<this.communityOption[i].child[j].child.length;k++){
            //                                 if(this.communityOption[i].child[j].child[k].id == idArr[2]){
            //                                     if(idArr.length==3){ this.communityOption[i].child[j].child[k].child = data; }
            //                                     else{
            //                                         for(let m = 0;m<this.communityOption[i].child[j].child[k].child.length;m++){
            //                                             if(this.communityOption[i].child[j].child[k].child[m].id == idArr[3]){
            //                                                 if(idArr.length==4){ this.communityOption[i].child[j].child[k].child[m].child = data; }
            //                                                 else{
                                                                
            //                                                 }
            //                                             break;
            //                                             }
            //                                         }
            //                                     }
            //                                 break;
            //                                 }
            //                             }
            //                         }
            //                     break;
            //                     }
            //                 }
            //             }
            //             break;
            //         }
            //     }
            // },
            // initComp(idArr){
            //     let loginData = this.$store.state.loginData;
            //     let param = {
            //         action:'gethouseList',
            //         access_token:loginData.access_token,//loginData.access_token,
            //         user_token:loginData.user_token,//loginData.access_token,
            //         type:idArr?idArr.length:0,
            //         code:idArr?idArr[idArr.length-1]:loginData.store_id
            //     }
            //     this.$http.post(`${this.$store.state.host}${this.$store.state.config.vip}`, param).then((res) => {
            //         console.log(res.data.data)
            //         if(res.data.code==1){
            //             let data = res.data.data;
            //             if(!idArr || idArr.length<4){
            //                 for(let i=0;i<data.length;i++){
            //                     data[i]['child'] = [];
            //                 }
            //             }
            //             if(idArr){
            //                 this.editCommunity(idArr,null,data);//已存在的id，已选中的索引，后台获取的数据
            //             }else{
            //                 this.communityOption = data;
            //             }
            //         }else{
            //             this.showMsg('查询信息失败')
            //         }
            //     }, (res) => {
            //         console.log(res)
            //     });
            // }
        },
        mounted:function(){
            // debugger
            // if(this.communityOption && this.communityOption>0){
            //     this.initComp();
            // }
        },
    }
</script>