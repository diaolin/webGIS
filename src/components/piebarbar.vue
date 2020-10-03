<template>
    <div class="content2">
        <div id="pie2"></div>
        <div id="barcontent1">
            <div id="bar3"></div>
            <div id="bar4"></div>
        </div>
    </div>
</template>

<script>
    import {
        eventBus
    } from '../main'
    import {
        dataget
    } from '../api/get.js'
    import landType from '../assets/json/landType.json'
    // import {mapGetters} from vuex
    export default {
        name: 'hello',
        watch: {
            "$store.state.AMsg":function(e){
               this.searchInitExcel(e);
            }
        },
        created() {
            // this.test();
            eventBus.$off("tdlyaqsmj");
            eventBus.$off("jkhfmj");
            eventBus.$off("tdlymj");
            eventBus.$off("czcmj");
            eventBus.$off("gdzzmj");
            eventBus.$off("gdxhdc");
            eventBus.$on('tdlymj', (message) => {
               
            })
            eventBus.$on('czcmj', (message) => {
               
            })
            
        },
        data() {
            return {
                pie2:null,
                bar3:null,
                bar4:null,
                testdata: [],
                pielegend: [],
                piedata: [],
                firstType:[],
                firstData:[],
                firstAllData:[],
                secondType:['水田','水浇地','旱地'],
                secondData:[],
                selectType:'农用地',
                selectData:[],
                test:''
            }
        },
        mounted() {
          
        },
        methods: {
            searchInitExcel(message) {
                // this.test='';
                this.pie2=null;
                this.bar3=null;
                this.bar4=null;
                this.piedata = [];
                this.firstData = [];
                this.firstType = [];
                // this.$echarts.dispose();
                console.log("message",message);
                for (let i in message) {
                    let obj = {
                        value: message[i].hj,
                        name: message[i].name
                    };
                    this.pielegend.push(message[i].name);
                    this.piedata.push(obj);
                }
                [this.pielegend[1],this.pielegend[2]] = [this.pielegend[2],this.pielegend[1]];
                [this.piedata[1],this.piedata[2]] = [this.piedata[2],this.piedata[1]];
            
                for(let i in message[0].data){
                    let arr = message[0].data;
                    this.firstType.push(arr[i].name);
                    this.firstData.push(arr[i].hj);
                }
                for(let i in message[0].data[0].data){
                    let arr = message[0].data[0].data;
                    for(let i in arr){
                        this.secondData.push(arr[i]);
                    }
                }
                this.firstAllData = message;
                this.drawPie();
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
              
                // this.test = ;
                this.pie2 = this.$echarts.init(document.getElementById('pie2'))
                this.bar3 = this.$echarts.init(document.getElementById('bar3'))
                this.bar4 = this.$echarts.init(document.getElementById('bar4'))
                let that = this;
                // 绘制图表
                this.pie2.setOption({
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

                this.pie2.on('click', function (params) {
                    let bar2arrtype = [],bar2arrdata = [],bar2title='';
                    that.selectType = params.data.name;
                    that.bar3.setOption({
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
                            that.bar3.setOption({
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

                    that.bar4.setOption({
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
            
                that.bar3.setOption({
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
                that.bar3.on('click', function (params) {
                    console.log('params', params);
                    that.bar4.setOption({
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
                    that.bar4.setOption({
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
                that.bar4.setOption({
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
   .content2 {
        display: flex;
    }

    #pie2 {
        width: 600px;
        height: 300px;
    }

    #bar3,#bar4 {
        width: 600px;
        height: 300px;
    }
 
    #barcontent1{
        flex: 1;
    }
</style>