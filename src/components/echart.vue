<template>
    <div class="content1">
        <div id="pie"></div>
        <div id="barcontent">
            <div id="bar1"></div>
            <div id="bar2"></div>
        </div>
    </div>
</template>

<script>
    import {
        dataget
    } from '../api/get.js'
    import landType from '../assets/json/landType.json'
    export default {
        name: 'hello',
        data() {
            return {
                testdata: [],
                pielegend: [],
                piedata: [],
                firstType:[],
                firstData:[],
                firstAllData:[],
                secondType:['水田','水浇地','旱地'],
                secondData:[],
                selectType:'农用地',
                selectData:[]
            }
        },
        mounted() {
            this.searchInitExcel();
            console.log("landType",landType);
        },
        methods: {
            searchInitExcel() {
                // if (this.countyCode !== '' && this.datatypeValue !== '' && this.datayearValue !== '') {
                const data = {
                    xdm: 511681,
                    year: 2019,
                    excelName: '土地利用现状分类面积汇总表',
                    pageNo: 1,
                    pageSize: 10
                }
                let that = this;
                dataget("excel/findOneByXdmAndYear.do", data).then(res => {
                    if (res.code === 0) {
                        for (let i in res.data) {
                            let obj = {
                                value: res.data[i].hj,
                                name: res.data[i].name
                            };
                            // for(let j in res.data[i].data){
                            //     let arrdata = [];
                            //     arrdata.push(res.data[i].data[j].hj);
                            //     let obj1 = {
                            //         name:res.data[i].name,
                            //         arrdata:arrdata
                            //     }
                            // }
                            
                            that.pielegend.push(res.data[i].name);
                            that.piedata.push(obj);
                            // array.splice(index1, 1 , array[index2])
                        }
                        [that.pielegend[1],that.pielegend[2]] = [that.pielegend[2],that.pielegend[1]];
                        [that.piedata[1],that.piedata[2]] = [that.piedata[2],that.piedata[1]];
                    
                        for(let i in res.data[0].data){
                            let arr = res.data[0].data;
                            that.firstType.push(arr[i].name);
                            that.firstData.push(arr[i].hj);
                        }
                        for(let i in res.data[0].data[0].data){
                            let arr = res.data[0].data[0].data;
                            for(let i in arr){
                                that.secondData.push(arr[i]);
                            }
                        }
                        that.firstAllData = res.data;
                        that.drawPie(that.firstType,that.firstData);
                        console.log("excel", res.data);
                    }

                }).catch(err => {
                    console.log("失败");
                });
                // }
            },
            matchKey(code){
                for(let i in landType){
                    if(landType[i].code === code){
                        return landType[i].value;
                    }
                }
            },
            drawPie() {
                // 基于准备好的dom，初始化echarts实例
                let pie = this.$echarts.init(document.getElementById('pie'))
                let bar1 = this.$echarts.init(document.getElementById('bar1'))
                let bar2 = this.$echarts.init(document.getElementById('bar2'))
                let that = this;
                // 绘制图表
                pie.setOption({
                    title: {
                        // text: '某站点用户访问来源',
                        // subtext: '纯属虚构',
                        // left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: that.pielegend
                    },
                    series: [{
                            name: '面积占比',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: that.piedata
                        },
                        {
                            name: '面积占比',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: that.piedata,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: 'inner',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        align: "left",
                                        formatter: function (p) { //指示线对应文字,百分比
                                            return p.percent.toFixed(1) + "%";
                                        }
                                    },
                                    // color: function (params) {
                                    //     //自定义颜色
                                    //     var colorList = ['#00CD00', '#FF7F00'];
                                    //     return colorList[params.dataIndex]
                                    // },
                                    labelLine: { //指示线状态
                                        show: true,
                                        smooth: 0.2,
                                        length: 10,
                                        length2: 20
                                    }
                                }
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                }
                            }
                        }
                    ]
                });

                pie.on('click', function (params) {
                    let bar2arrtype = [],bar2arrdata = [],bar2title='';
                    that.selectType = params.data.name;
                    bar1.setOption({
                        title: {
                            text: that.selectType,
                        }
                    })
                    
                    for(let i in that.firstAllData){
                        if(that.firstAllData[i].name === params.data.name){
                            let arrtype=[],arrdata = [];
                            for(let j in that.firstAllData[i].data){
                                arrtype.push(that.firstAllData[i].data[j].name);
                                arrdata.push(that.firstAllData[i].data[j].hj);
                            }
                            for(let item in that.firstAllData[i].data[0].data){
                                bar2arrtype.push(that.matchKey(item.substr(1)));
                                bar2arrdata.push(that.firstAllData[i].data[0].data[item]);
                            }
                            bar2title = arrtype[0];
                            bar1.setOption({
                                xAxis: {
                                    data:arrtype,
                                    axisLabel:{
                                        interval:0,  
                                        formatter:function(value){
                                            if(value.length > 10){
                                                return value.substring(0,5)+"\n"+value.substring(5,10)+'\n'+value.substring(10,value.length)
                                            }
                                            else if(value.length > 5 && value.length <= 10){
                                                return value.substring(0,5)+"\n"+value.substring(5,value.length)
                                            } else {
                                                return value
                                            }
                                        }
                                    }
                                },
                                series: [{
                                    data: arrdata,
                                }]
                            });
                        }
                    }

                    bar2.setOption({
                        title: {
                            text: bar2title,
                        },
                        xAxis: {
                            data:bar2arrtype,
                            axisLabel:{
                                interval:0,  
                                formatter:function(value){
                                    if(value.length > 10){
                                        return value.substring(0,5)+"\n"+value.substring(5,10)+'\n'+value.substring(10,value.length)
                                    }
                                    else if(value.length > 5 && value.length <= 10){
                                        return value.substring(0,5)+"\n"+value.substring(5,value.length)
                                    } else {
                                        return value
                                    }
                                }
                            }
                        },
                        series: [{
                            data: bar2arrdata,
                        }]
                    });
                });
            
                bar1.setOption({
                    title: {
                        text: that.selectType,
                    },
                    tooltip: {

                    },
                    xAxis: {
                        data:that.firstType,
                        axisLabel:{
                            interval:0,  
                            formatter:function(value){
                                if(value.length > 10){
                                     return value.substring(0,5)+"\n"+value.substring(5,10)+'\n'+value.substring(10,value.length)
                                }
                                else if(value.length > 5 && value.length <= 10){
                                    return value.substring(0,5)+"\n"+value.substring(5,value.length)
                                } else {
                                    return value
                                }
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '面积(公顷)',
                    },
                    series: [{
                        name: '面积(公顷)',
                        type: 'bar',
                        barWidth: 20,
                        data: that.firstData,
                        itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: 'black',
										fontSize: 12
                                    },
                                    formatter:function(params){
                                        return parseFloat(params.data.toFixed(0)).toLocaleString();
                                    }
								}
							}
						},
                    }]
                });
                bar1.on('click', function (params) {
                    console.log('params', params);
                    bar2.setOption({
                        title: {
                            text: params.name,
                        }
                    })
                    for(let i in that.firstAllData){
                        if(that.firstAllData[i].name === that.selectType){
                            for(let j in that.firstAllData[i].data){
                                if(that.firstAllData[i].data[j].name === params.name){
                                    let arr = that.firstAllData[i].data[j];
                                    that.selectData = arr.data;
                                }
                            }
                        }
                    }
                    let arrtype = [],arrdata = [];
                    for(let item in that.selectData){
                        arrtype.push(that.matchKey(item.substr(1)));
                        arrdata.push(that.selectData[item]);
                    }
                    bar2.setOption({
                        xAxis: {
                            data:arrtype,
                            axisLabel:{
                                interval:0,  
                                formatter:function(value){
                                    if(value.length > 10){
                                        return value.substring(0,5)+"\n"+value.substring(5,10)+'\n'+value.substring(10,value.length)
                                    }
                                    else if(value.length > 5 && value.length <= 10){
                                        return value.substring(0,5)+"\n"+value.substring(5,value.length)
                                    } else {
                                        return value
                                    }
                                }
                            }
                        },
                        series: [{
                            data: arrdata,
                        }]
                    });
                });
                bar2.setOption({
                    title: {
                        text: '耕地',
                    },
                    tooltip: {

                    },
                    xAxis: {
                        data:that.secondType,
                        axisLabel:{
                            interval:0,  
                            formatter:function(value){
                                if(value.length > 10){
                                     return value.substring(0,5)+"\n"+value.substring(5,10)+'\n'+value.substring(10,value.length)
                                }
                                else if(value.length > 5 && value.length <= 10){
                                    return value.substring(0,5)+"\n"+value.substring(5,value.length)
                                } else {
                                    return value
                                }
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '面积(公顷)',
                    },
                    series: [{
                        name: '面积(公顷)',
                        type: 'bar',
                        barWidth: 20,
                        data: that.secondData,
                        itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: 'black',
										fontSize: 12
                                    },
                                    formatter:function(params){
                                        return parseFloat(params.data.toFixed(0)).toLocaleString();
                                    }
								}
							}
						},
                    }]
                });
            },
        }
    }
</script>

<style>
    .content1 {
        display: flex;
    }

    #pie {
        width: 600px;
        height: 300px;
    }

    #bar1,#bar2 {
        width: 600px;
        height: 300px;
    }
 
    #barcontent{
        flex: 1;
    }
</style>