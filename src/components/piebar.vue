<template>
    <div class="content3">
        <div id="pie3"></div>
        <div id="bar5"></div>
    </div>
</template>

<script>
    import {
        eventBus
    } from '../main'
    export default {
        name: 'hello',
        created() {
            eventBus.$off("tdlyaqsmj");
            eventBus.$off("jkhfmj");
            eventBus.$off("tdlymj");
            eventBus.$off("czcmj");
            eventBus.$off("gdzzmj");
            eventBus.$off("gdxhdc");
            eventBus.$on('tdlyaqsmj', (message) => {
                let arrdata = message;
                let arrgy = [],arrjt = [],arrx = [];
                for(let item in arrdata){
                    let str = item.substring(item.length-2,item.length);
                    if(str === "Gy"){
                        arrgy.push(arrdata[item]);
                    } else if(str === "Jt"){
                        arrjt.push(arrdata[item]);
                    }
                }
                for(let i in this.gyjtKey){
                    arrx.push(this.gyjtKey[i].name);
                }
                this.drawPie('国有','集体',arrdata.gy,arrdata.jt);
                this.drawBar('国有','集体',arrgy,arrjt,arrx);
            })
            eventBus.$on('jkhfmj', (message) => {
                console.log("message");
                let arrdata = message;
                let arrjk = [],arrgc = [],arrx = [],arrjkk = [],arrgck = [];
                for(let item in arrdata){
                    let str = item.substring(0,2);
                    let endstr = item.substring(item.length-1,item.length);
                    if(item.length > 4 && str === "jk" && endstr !== 'k'){
                        arrjk.push(arrdata[item]);
                    } else if(item.length > 4 && str === "gc" && endstr !== 'k'){
                        arrgc.push(arrdata[item]);
                    } else if(item.length > 4 && str === "jk" &&  endstr === 'k'){
                        arrjkk.push(arrdata[item]);
                    } else if(item.length > 4 && str === "gc" && endstr === 'k'){
                        arrgck.push(arrdata[item]);
                    }
                }
                arrjkk.splice(6,0,null);
                arrgck.splice(6,0,null);
                console.log("arrjkk",arrjkk);
                for(let i in this.jkgcKey){
                    arrx.push(this.jkgcKey[i].name);
                }
                this.drawPie('即可恢复','工程恢复',arrdata.jkhj,arrdata.gchj);
                this.drawBar('即可恢复','工程恢复',arrjk,arrgc,arrx,arrjkk,arrgck,'可调整');
            })
        },
        watch: {
            "$store.state.BMsg":function(e){
               console.log("Beeeee",e);
                let arrdata = e;
                let arrgy = [],arrjt = [],arrx = [];
                for(let item in arrdata){
                    let str = item.substring(item.length-2,item.length);
                    if(str === "Gy"){
                        arrgy.push(arrdata[item]);
                    } else if(str === "Jt"){
                        arrjt.push(arrdata[item]);
                    }
                }
                for(let i in this.gyjtKey){
                    arrx.push(this.gyjtKey[i].name);
                }
                this.drawPie('国有','集体',arrdata.gy,arrdata.jt);
                this.drawBar('国有','集体',arrgy,arrjt,arrx);
            },
            "$store.state.CMsg":function(e){
                console.log("ceeee",e);
                let arrdata = e;
                let arrjk = [],arrgc = [],arrx = [],arrjkk = [],arrgck = [];
                for(let item in arrdata){
                    let str = item.substring(0,2);
                    let endstr = item.substring(item.length-1,item.length);
                    if(item.length > 4 && str === "jk" && endstr !== 'k'){
                        arrjk.push(arrdata[item]);
                    } else if(item.length > 4 && str === "gc" && endstr !== 'k'){
                        arrgc.push(arrdata[item]);
                    } else if(item.length > 4 && str === "jk" &&  endstr === 'k'){
                        arrjkk.push(arrdata[item]);
                    } else if(item.length > 4 && str === "gc" && endstr === 'k'){
                        arrgck.push(arrdata[item]);
                    }
                }
                arrjkk.splice(6,0,null);
                arrgck.splice(6,0,null);
                console.log("arrjkk",arrjkk);
                for(let i in this.jkgcKey){
                    arrx.push(this.jkgcKey[i].name);
                }
                this.drawPie('即可恢复','工程恢复',arrdata.jkhj,arrdata.gchj);
                this.drawBar('即可恢复','工程恢复',arrjk,arrgc,arrx,arrjkk,arrgck,'可调整');
            }
        },
        data() {
            return {
                pie:'',
                bar:'',
                gyjtKey:[
                    {key:'d00',name:"湿地"},
                    {key:'d01',name:"耕地"},
                    {key:'d02',name:"种植园用地"},
                    {key:'d03',name:"林地"},
                    {key:'d04',name:"草地"},
                    {key:'d05',name:"商业服务业用地"},
                    {key:'d06',name:"工矿用地"},
                    {key:'d07',name:"住宅用地"},
                    {key:'d08',name:"公共管理与公共服务用地"},
                    {key:'d09',name:"特殊用地"},
                    {key:'d10',name:"交通运输用地"},
                    {key:'d11',name:"水域及水利设施用地"},
                    {key:'d12',name:"其他土地"}
                ],
                jkgcKey:[
                    {key:'0',name:"果园"},
                    {key:'1',name:"茶园"},
                    {key:'2',name:"橡胶园"},
                    {key:'3',name:"其他园地"},
                    {key:'4',name:"乔木林地"},
                    {key:'5',name:"竹林地"},
                    {key:'6',name:"灌木林地"},
                    {key:'7',name:"其他林地"},
                    {key:'8',name:"其他草地"},
                    {key:'9',name:"坑塘水面"},
                ]
            }
        },
        mounted() {
        },
        methods: {
            drawPie(type1,type2,data1,data2){
                this.pie = this.$echarts.init(document.getElementById('pie3'));
                this.pie.setOption({
                    title: {
                        // text: '某站点用户访问来源',
                        // subtext: '纯属虚构',
                        // left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    // legend: {
                    //     // orient: 'vertical',
                    //     left: 'center',
                    //     data: [type1, type2]
                    // },
                    series: [
                        {//显示指示线
                            name: '面积占比',
                            type: 'pie',
                            radius: '55%',//饼图的半径大小
                            center: ['50%', '60%'],//饼图的位置
                            data: [
                                { value: data1, name: type1 },
                                { value: data2, name: type2 }
                            ]
                        },
                        {//显示饼状图上的文本(百分比、数值)
                            name: '面积占比',
                            type: 'pie',
                            radius: '55%',//饼图的半径大小
                            center: ['50%', '60%'],//饼图的位置
                            data: [
                                { value: data1, name: type1 },
                                { value: data2, name: type2 }
                            ],
                            itemStyle: {
                                normal : {//饼状图上的文本显示
                                    label:{
                                        show : true,
                                        position : 'inner',
                                        formatter: "{d}%",//数值和百分比
                                        textStyle : {
                                            fontSize : 12,
                                            fontWeight : 'bolder'
                                        }
                                    },
                                    labelLine:{
                                        show : false //显示饼状图上的文本时，指示线不显示，在第一个data时显示指示线
                                    }
                                }
                            }
                        }
                    ]
                });
            },
            drawBar(type1,type2,arrgy,arrjt,xAxisarr,arrjkk,arrgck,type3){
                this.bar = this.$echarts.init(document.getElementById('bar5'));
                this.bar.setOption({
                    tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                // toolbox: {
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         magicType: {show: true, type: ['line', 'bar']},
                //         restore: {show: true},
                //         saveAsImage: {show: true}
                //     }
                // },
                legend: {
                    data: [type1, type2, type3]
                },
                xAxis: 
                    {
                        interval:0, 
                        type: 'category',
                        data: xAxisarr,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel:{
                            formatter:function(value){
                                if(value.length > 8){
                                     return value.substring(0,4)+"\n"+value.substring(4,8)+'\n'+value.substring(8,value.length)
                                }
                                else if(value.length > 4 && value.length <= 8){
                                    return value.substring(0,4)+"\n"+value.substring(4,value.length)
                                } else {
                                    return value
                                }
                            }
                        }
                    }
               ,
                yAxis: [
                    {
                        type: 'value',
                        name: '面积(公顷)',
                    }
                ],
                grid: {
                    // 间距是 根据x、y轴计算的；假如都是0，x、y轴的label汉字就隐藏掉了。
                    left: 50, // 默认10%，给24就挺合适的。
                    top: 100, // 默认60
                    right: 2, // 默认10%
                    bottom: 150, // 默认60
                },
                series: [
                    
                    {
                        name: type1,
                        type: 'bar',
                        data: arrgy,
                        stack: '即可',
                        barWidth: 20,
                        itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: 'black',
										fontSize: 16
                                    },
                                    formatter:function(params){
                                        return parseFloat(params.data.toFixed(0)).toLocaleString();
                                    }
								}
							}
						},
                    },
                    {
                        name: '可调整',
                        type: 'bar',
                        data: arrjkk,
                        stack: '即可',
                        color:'#4cabce',
                        barWidth: 20,
                    },
                    {
                        name: type2,
                        type: 'bar',
                        data: arrjt,
                        stack: '工程',
                        barWidth: 20,
                        itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: 'black',
										fontSize: 16
                                    },
                                    formatter:function(params){
                                        return parseFloat(params.data.toFixed(0)).toLocaleString();
                                    }
								}
							}
						},
                    },
                    {
                        name: '可调整',
                        type: 'bar',
                        data: arrgck,
                        stack: '工程',
                        color:'#4cabce',
                    },
                ]
                })
            }       
        }
    }
</script>

<style>
    .content3{
        text-align: center;
        display: flex;
        flex-direction: row;
        /* justify-content: space-between; */
        flex-flow:row;/*伸缩项目单行排列*/  
    }
    #pie3 {
        width: 300px;
        height: 200px;
    }
    #bar5 {
        /* flex:1; */
        width: 900px;
        height: 700px;
    }
</style>