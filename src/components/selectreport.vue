<template>
    <div>
        <!-- <div class="selectInput"> -->
            <span class="county">请选择所在区县：</span>
            <el-cascader placeholder="可输入关键词搜索" :options="optionscounty" filterable v-model="countyValue"
                @change="clickvalue"></el-cascader>
            <span class="datatype">请选择数据类型：</span>
            <el-select v-model="datatypeValue" @change="clicktypevalue" placeholder="请选择" style="width:25%">
                <el-option v-for="item in optionsdatatype" :key="item.datavalue" :label="item.datalabel"
                    :value="item.datalabel">
                </el-option>
            </el-select>
        <!-- </div> -->
    </div>
</template>
<script>
    import {
        dataget
    } from '../api/get.js'
    import {
        post
    } from '../api/post.js'
    import echart from './echart.vue'
    import { eventBus } from '../main'
    export default {
        data() {
            return {
                countyValue: '',
                datatypeValue: '',
                datayearValue: '',
                optionscounty: [],
                optionsdatatype: [],
                optionsdatayear: [],
                value: '',
                countyCode: '',
            }
        },
        components: {
            // echart,
        },
        mounted() {
            this.requestCounty();
            this.requestDataType();
        },
        methods: {
            clickvalue() {
                this.countyCode = this.countyValue[2];
                // console.log('countyValue', this.countyValue)
                if(this.datatypeValue !== '' && this.countyValue !== ""){
                    let data = {
                        county:this.countyValue,
                        datatype:this.datatypeValue
                    }
                    eventBus.$emit("selectreport",data)
                }
            },
            clicktypevalue() {
                // console.log('datatypeValue', this.datatypeValue);
                if(this.datatypeValue !== '' && this.countyValue !== ""){
                    let data = {
                        county:this.countyValue,
                        datatype:this.datatypeValue
                    }
                    eventBus.$emit("selectreport",data)
                }
            },
            requestCounty() {
                let that = this;
                dataget("commom/getCityTree.do", '').then(res => {
                    if (res.code === 0) {
                        that.optionscounty = res.data;
                    } else {
                        that.$router.push({ //你需要接受路由的参数再跳转
                            path: '/login'
                        });
                    }
                }).catch(err => {
                    console.log("失败");
                });
            },
            requestDataType() {
                let that = this;
                dataget("report/getExcelNameList.do", '').then(res => {
                    for (let i in res.data) {
                        let obj = {
                            datavalue: i,
                            datalabel: res.data[i]
                        };
                        that.optionsdatatype.push(obj);
                    }
                    console.log("that.optionsdatatype", that.optionsdatatype);
                }).catch(err => {
                    console.log("失败");
                });
            },
            
        }
    }
</script>
<style>
    .selectInput {
        margin-top: 2%;
    }

    .county,
    .year,
    .datatype,
    .search {
        margin-left: 20px;
    }
</style>