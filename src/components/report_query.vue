<template>
    <div>
        <div class="selectInput">
            <!-- <selectreport /> -->
            <span class="county">请选择所在区县：</span>
            <el-cascader
                placeholder="可输入关键词搜索"
                :options="optionscounty"
                filterable v-model="countyValue"  @change="clickvalue"></el-cascader>
            <span class="datatype">请选择数据类型：</span>
            <el-select v-model="datatypeValue" @change="clicktypevalue" placeholder="请选择" style="width:25%">
                <el-option
                v-for="item in optionsdatatype"
                :key="item.datavalue"
                :label="item.datalabel"
                :value="item.datalabel">
                </el-option>
            </el-select>
            <span class="year">请选择年份：</span>
                <el-select v-model="datayearValue" @change="clickyear" placeholder="请选择">
                    <el-option
                    v-for="item in optionsdatayear"
                    :key= "item.yearlabel1"
                    :label="item.yearlabel"
                    :value="item.yearlabel">
                    </el-option>
                </el-select>
            <el-button type="primary" class="search" @click="searchExcel()">查询</el-button>
        </div>
        <div>
            <div class="echart" v-show="echartShow">
                <echart/>
            </div>
            <div class="piebarbar" v-show="piebarbarShow">
                <piebarbar/>
            </div>
            <div class="piebar" v-show="piebarShow">
                <piebar/>
            </div>
             <div class="piepies" v-show="piepiesShow">
                <piepies/>
            </div>
            <div class="barbar" v-show="barbarShow">
                <barbar/>
            </div>
        </div>
    </div>
</template>
<script>
import {dataget} from '../api/get.js'
import {post} from '../api/post.js'
import piebarbar from './piebarbar.vue'
import piebar from './piebar.vue'
import piepies from './piepies.vue'
import barbar from './barbar.vue'
import echart from './echart.vue'
import selectreport from './selectreport.vue'
import { eventBus } from '../main'
export default {
    beforeDestroy(){
        // eventBus.$emit("tdlymj",12233);
    },
    created() {
        eventBus.$off("selectreport");
        let that = this;
        eventBus.$on('selectreport', (message) => {
            console.log("message",message);
            that.requestYear(message);
            that.countyCode = message.county[2];
            that.datatypeValue = message.datatype;
        })
    },
    data(){
        return{
            countyValue:[],
            datatypeValue:'土地利用现状分类面积汇总表',
            datayearValue:'2019',
            optionscounty:[],
            optionsdatatype:[],
            optionsdatayear: [],
            value: '',
            countyCode:'511681',
            echartShow:true,
            piebarbarShow:false,
            piebarShow:false,
            piepiesShow:false,
            barbarShow:false
            }
    },
    components: {
        echart,
        piebarbar,
        piebar,
        piepies,
        barbar
        // selectreport
    },
    mounted(){
        this.countyValue = ['51','5116','511681'];
        this.requestCounty();
        this.requestDataType();
        // this.initExcel();
    },
    methods:{
        clickvalue () {
            this.countyCode = this.countyValue[2];
            console.log('countyValue',this.countyValue);
            if(this.countyCode !== '' && this.datatypeValue !== ''){
                this.requestYear();
            }
        },
        clicktypevalue() {
            console.log('datatypeValue',this.datatypeValue);
            this.requestYear();
        },
        clickyear() {
            console.log("datayearValue",this.datayearValue);
        },
        // initExcel(){
        //     let  initdata ={
        //             dm: 511681,
        //             year:2019,
        //             excelName:'土地利用现状分类面积汇总表',
        //             pageNo:1,
        //             pageSize:10
        //         }
        //     let that = this;
        //     dataget("excel/findByCodeAndYear.do",initdata).then(res=>{  
        //         eventBus.$emit("tdlymj",res.data);
        //     }).catch(err=>{
        //         console.log("失败");
        //     });
        // },
        requestCounty() {
            let that = this;
            dataget("commom/getCityTree.do",'').then(res=>{  
                if(res.code === 0){
                    that.optionscounty = res.data;
                } else {
                    that.$router.push({//你需要接受路由的参数再跳转
                        path: '/login'
                    });
                }
            }).catch(err=>{
                console.log("失败");
            });
        },
        requestDataType() {
            let that = this;
            dataget("report/getExcelNameList.do",'').then(res=>{  
                for(let i in res.data){
                    let obj = {
                        datavalue:i,
                        datalabel:res.data[i]
                    };
                    that.optionsdatatype.push(obj);
                }
            }).catch(err=>{
                console.log("失败");
            });
        },
        requestYear() {
            console.log("llldlsfk");
            console.log("this.countyCode",this.countyCode);
            console.log("this.datatypeValue",this.datatypeValue);
            if(this.countyCode !== '' && this.datatypeValue !== ''){
                let that = this;
                let params =new FormData();
                params.append("dm",this.countyCode);
                params.append("typeId",235);
                console.log("params",params);
                post("report/getYearsBydmAndTypeId.do",params).then(res=>{  
                    that.optionsdatayear = [];
                    for(let i in res.data){
                        let obj = {
                            yearvalue:i,
                            yearlabel:res.data[i]
                        };
                        that.optionsdatayear.push(obj);
                    }
                    console.log("that.optionsdatayear",that.optionsdatayear);
                }).catch(err=>{
                    console.log("失败");
                });
            } 
            
        },
        
        searchExcel(){
            if(this.countyCode !== '' && this.datatypeValue !== '' && this.datayearValue !== ''){
                const data ={
                    xdm: this.countyCode,
                    year:this.datayearValue,
                    excelName:this.datatypeValue,
                    pageNo:1,
                    pageSize:10
                }
                console.log("data",data);
                let that = this;
                dataget("excel/findOneByXdmAndYear.do",data).then(res=>{
                    if(res.code === 0){
                        that.echartShow = false;
                        that.piebarbarShow = false;
                        that.piebarShow = false;
                        that.piepiesShow = false;
                        that.barbarShow = false;
                        switch(that.datatypeValue){
                            case "土地利用现状分类面积汇总表":
                                that.piebarbarShow = true;
                                // eventBus.$emit("tdlymj",res.data);
                                // that.$router.push({//你需要接受路由的参数再跳转
                                //     path: '/piebarbar'
                                // })
                                that.$store.commit('receiveAMsg', {
                                    AMsg: res.data
                                })
                                break;
                            case "城镇村及工矿用地面积汇总表":
                                // that.piebarbarShow = true;
                                // eventBus.$emit("czcmj",res.data);
                                break;
                            case '土地利用现状一级分类面积汇总表':
                                that.barbarShow = true;
                                that.$store.commit('receiveEMsg', {
                                    EMsg: res.data
                                })
                                // eventBus.$emit("czcmj",res.data);
                                break;
                            case "土地利用现状一级分类面积按权属性质汇总表":
                                that.piebarShow = true;
                                that.$store.commit('receiveBMsg', {
                                    BMsg: res.data
                                })
                                // eventBus.$emit("tdlyaqsmj",res.data);
                                break;
                            case "即可恢复与工程恢复种植属性汇总统计表":
                                that.piebarShow = true;
                                // eventBus.$emit("jkhfmj",res.data);
                                that.$store.commit('receiveCMsg', {
                                    CMsg: res.data
                                })
                                break;
                            case "耕地种植类型面积统计表":
                                that.piepiesShow = true;
                                // eventBus.$emit("gdzzmj",res.data);
                                that.$store.commit('receiveDMsg', {
                                    DMsg: res.data
                                })
                                break;
                            case "耕地细化调查情况统计表":
                                that.piepiesShow = true;
                                eventBus.$emit("gdxhdc",res.data);
                                break;
                        }
                        console.log("excel",res);
                    }  
                }).catch(err=>{
                    console.log("失败");
                });
            } 
        }
    }
}
</script>
<style>
    .selectInput{
        margin-top:2%;
    }
    .county,.year,.datatype,.search{
        margin-left:20px;
    }
    .piebar{
        margin-top:30px;
        text-align: center;
    }
    .echart{
        margin-top:30px;
        text-align: center;
    }
</style>