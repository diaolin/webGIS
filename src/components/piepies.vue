<template>
    <div class="content3">
        <div id="pie4"></div>
        <div id="barcontent2">
            <div id="pie5"></div>
            <div id="bar6"></div>
        </div>
        
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
            eventBus.$on('gdzzmj', (message) => {
                
            })
            eventBus.$on('gdxhdc', (message) => {
                let arrdata = message;
                let arrjk = [],
                    arrgc = [],
                    arrx = [],
                    arrjkk = [],
                    arrgck = [];
                for (let item in arrdata) {
                    let str = item.substring(0, 2);
                    let endstr = item.substring(item.length - 1, item.length);
                    if (item.length > 4 && str === "jk" && endstr !== 'k') {
                        arrjk.push(arrdata[item]);
                    } else if (item.length > 4 && str === "gc" && endstr !== 'k') {
                        arrgc.push(arrdata[item]);
                    } else if (item.length > 4 && str === "jk" && endstr === 'k') {
                        arrjkk.push(arrdata[item]);
                    } else if (item.length > 4 && str === "gc" && endstr === 'k') {
                        arrgck.push(arrdata[item]);
                    }
                }
                arrjkk.splice(6, 0, null);
                arrgck.splice(6, 0, null);
                console.log("arrjkk", arrjkk);
                for (let i in this.jkgcKey) {
                    arrx.push(this.jkgcKey[i].name);
                }
                this.drawPie('即可恢复', '工程恢复', arrdata.jkhj, arrdata.gchj);
                this.drawBar('即可恢复', '工程恢复', arrjk, arrgc, arrx, arrjkk, arrgck, '可调整');
            })
        },
        watch: {
            "$store.state.DMsg":function(e){
                this.firstCtype = [];
                this.firstCdata = [];
                console.log("zhongzhi",e);
                let arrdata = [],arrgd = [],arrgddata = [];
                // for(let i in message.list){
                //     if(message.list[i].xzqdm === "511681"){
                //         arrdata = message.list[i];
                //     }
                // }
                arrdata = e;
                for(let item in arrdata){
                    let str = item.substring(0,3);
                    let str1 = item.substring(0,4);
                    let str2 = item.substring(6,7);
                    let str3 = item.substring(5,item.length);
                    let str4 = item.substring(0,5);
                    if(str === 'd01' && str1 !== 'd010'){
                        arrgd.push(arrdata[item]);
                    } else if(str === 'dhj' && item.length === 7){
                        let obj;
                        switch(str2){
                            case '1':
                                obj = {
                                    value:arrdata[item],
                                    name:'水田'
                                };
                                console.log("obj",obj);
                                this.firstCdata.push(obj);
                                break;
                            case '2':
                                obj= {
                                    value:arrdata[item],
                                    name:'水浇地'
                                };
                                this.firstCdata.push(obj);
                                break;
                            case '3':
                                obj = {
                                    value:arrdata[item],
                                    name:'旱地'
                                };
                                this.firstCdata.push(obj);
                                break;
                        }
                    } else if(str4 === 'd0101'){
                        this.pieType(arrdata[item],this.arrdata1,str3);
                    } else if(str4 === 'd0102'){
                        this.pieType(arrdata[item],this.arrdata2,str3);
                    } else if(str4 === 'd0103'){
                        this.pieType(arrdata[item],this.arrdata3,str3);
                    }
                   
                }
                for(let i in arrgd){
                    let obj = {
                        value:arrgd[i],
                        name:this.gdtype[i]
                    }
                    arrgddata.push(obj);
                }
                this.drawPie(arrgddata);
                this.drawPie2(this.firstCdata);
                // this.drawPie5();
            }
        },
        data() {
            return {
                pie: '',
                pie5: '',
                bar6:'',
                gdtype:['种植非粮食作物','林粮间作','种植粮食作物','粮与非粮轮作','未耕种','休耕'],
                firstCtype:[],
                firstCdata:[],
                arrdata1:[],
                arrdata2:[],
                arrdata3:[],
                selectType:'水田'
            }
        },
        mounted() {},
        methods: {
            pieType(value,arrdata,str){
                let obj;
                switch(str){
                    case 'Fls':
                        obj = {
                            value:value,
                            name:this.gdtype[0]
                        }
                        arrdata.push(obj);
                        break;
                    case 'Lljz':
                        obj = {
                            value:value,
                            name:this.gdtype[1]
                        }
                        arrdata.push(obj);
                        break;
                    case 'Ls':
                        obj = {
                            value:value,
                            name:this.gdtype[2]
                        }
                        arrdata.push(obj);
                        break;
                    case 'Lyfl':
                        obj = {
                            value:value,
                            name:this.gdtype[3]
                        }
                        arrdata.push(obj);
                        break;
                    case 'Wg':
                        obj = {
                            value:value,
                            name:this.gdtype[4]
                        }
                        arrdata.push(obj);
                        break;
                    case 'Xg':
                        obj = {
                            value:value,
                            name:this.gdtype[5]
                        }
                        arrdata.push(obj);
                        break;
                }
            },
            drawPie(gddata) {
                console.log("gddta",gddata);
                this.pie = this.$echarts.init(document.getElementById('pie4'));
                this.pie.setOption({
                    title: {
                        // text: '某站点用户访问来源',
                        // subtext: '纯属虚构',
                        // left: 'center'
                    },
                    // tooltip: {
                    //     trigger: 'item',
                    //     formatter: '{a} <br/>{b} : {c} ({d}%)'
                    // },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: this.gdtype
                    },
                    series: [{ //显示指示线
                            name: '面积占比',
                            type: 'pie',
                            radius: '55%', //饼图的半径大小
                            center: ['50%', '60%'], //饼图的位置
                            data: gddata,
                        //     itemStyle: {
                        //         emphasis: {
                        //             shadowBlur: 10,
                        //             shadowOffsetX: 0,
                        //             shadowColor: 'rgba(0, 0, 0, 0.5)'
                        //          },
                        //         normal:{
                        //             color:function(params) {
                        //             //自定义颜色
                        //             var colorList = [          
                        //                     '#00FFFF', '#00FF00', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                        //                 ];
                        //                 return colorList[params.dataIndex]
                        //              }
                        //         }
                        //   }
                        },
                        // { //显示饼状图上的文本(百分比、数值)
                        //     name: '面积占比',
                        //     type: 'pie',
                        //     radius: '55%', //饼图的半径大小
                        //     center: ['50%', '60%'], //饼图的位置
                        //     data: gddata,
                        //     itemStyle: {
                        //         normal: { //饼状图上的文本显示
                        //             // color:function(params) {
                        //             // //自定义颜色
                        //             // var colorList = [          
                        //             //         '#00FFFF', '#00FF00', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                        //             //     ];
                        //             //     return colorList[params.dataIndex]
                        //             //  },
                        //             label: {
                        //                 show: true,
                        //                 position: 'inner',
                        //                 formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        //                 textStyle: {
                        //                     fontSize: 12,
                        //                     fontWeight: 'bolder'
                        //                 }
                        //             },
                        //             labelLine: {
                        //                 show: false //显示饼状图上的文本时，指示线不显示，在第一个data时显示指示线
                        //             }
                        //         }
                        //     }
                        // }
                    ]
                });
            },
            drawPie2(data) {
                console.log("data",data);
                this.pie5 = this.$echarts.init(document.getElementById('pie5'));
                this.bar6 = this.$echarts.init(document.getElementById('bar6'));
                this.pie5.setOption({
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
                        left: 'right',
                        data: this.firstCtype
                    },
                    series: [{ //显示指示线
                            name: '面积占比',
                            type: 'pie',
                            radius: '55%', //饼图的半径大小
                            center: ['50%', '60%'], //饼图的位置
                            data: data,
                        //     itemStyle: {
                        //         emphasis: {
                        //             shadowBlur: 10,
                        //             shadowOffsetX: 0,
                        //             shadowColor: 'rgba(0, 0, 0, 0.5)'
                        //          },
                        //         normal:{
                        //             color:function(params) {
                        //             //自定义颜色
                        //             var colorList = [          
                        //                     '#00FFFF', '#00FF00', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                        //                 ];
                        //                 return colorList[params.dataIndex]
                        //              }
                        //         }
                        //   }
                        },
                        { //显示饼状图上的文本(百分比、数值)
                            name: '面积占比',
                            type: 'pie',
                            radius: '55%', //饼图的半径大小
                            center: ['50%', '60%'], //饼图的位置
                            data: data,
                            itemStyle: {
                                normal: { //饼状图上的文本显示
                                    // color:function(params) {
                                    // //自定义颜色
                                    // var colorList = [          
                                    //         '#00FFFF', '#00FF00', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                                    //     ];
                                    //     return colorList[params.dataIndex]
                                    //  },
                                    label: {
                                        show: true,
                                        position: 'inner',
                                        formatter: '{d}%',
                                        textStyle: {
                                            fontSize: 12,
                                            fontWeight: 'bolder'
                                        }
                                    },
                                    labelLine: {
                                        show: false //显示饼状图上的文本时，指示线不显示，在第一个data时显示指示线
                                    }
                                }
                            }
                        }
                    ]
                });
                // this.pie2.click
                let that = this;
                that.pie5.on('click', function (params) {
                    console.log("params",params);
                    
                    that.bar6.setOption({
                        title: {
                            text: params.name,
                        },
                    })
                    if(params.name === '水田'){
                       that.bar6.setOption({
                           series: [{
                                data: that.arrdata1
                            }]
                       })
                    } else if(params.name === '水浇地'){
                        that.bar6.setOption({
                            series: [{
                                data: that.arrdata2
                            }]
                       })
                    } else if(params.name === '旱地'){
                        that.bar6.setOption({
                           series: [{
                                data: that.arrdata3
                            }]
                       })
                    }
                })

                
                that.bar6.setOption({
                    title: {
                        text: this.selectType,
                    },
                    tooltip: {

                    },
                    xAxis: {
                        data:this.gdtype,
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
                        data: this.arrdata1,
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
                                        return parseFloat(params.value.toFixed(0)).toLocaleString();
                                    }
								}
							}
						},
                    }]
                });
            },
            // drawPie5() {
            //     this.pie5 = this.$echarts.init(document.getElementById('pie5'));
            //     let arr = this.firstCdata.concat(this.arrdata1);
                
            //     let arr1 = arr.concat(this.arrdata2);
            //     let arr2 = arr1.concat(this.arrdata3);
            //     console.log("arr",arr);
            //     console.log("arr1",arr1);
            //     console.log("arr2",arr2);
            //     this.pie5.setOption({
            //         tooltip: {
            //             trigger: 'item',
            //             formatter: '{a} <br/>{b}: {c} ({d}%)'
            //         },
            //         legend: {
            //             orient: 'vertical',
            //             left: 10,
            //             data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
            //         },
            //         series: [
            //             {
            //                 name: '访问来源',
            //                 type: 'pie',
            //                 selectedMode: 'single',
            //                 radius: [0, '30%'],

            //                 label: {
            //                     position: 'inner'
            //                 },
            //                 labelLine: {
            //                     show: false
            //                 },
            //                 data: this.firstCdata
            //             },
            //             {
            //                 name: '访问来源',
            //                 type: 'pie',
            //                 radius: ['40%', '55%'],
            //                 label: {
            //                     // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            //                     backgroundColor: '#eee',
            //                     borderColor: '#aaa',
            //                     borderWidth: 1,
            //                     borderRadius: 4,
            //                     // shadowBlur:3,
            //                     // shadowOffsetX: 2,
            //                     // shadowOffsetY: 2,
            //                     // shadowColor: '#999',
            //                     // padding: [0, 7],
            //                     rich: {
            //                         a: {
            //                             color: '#999',
            //                             // lineHeight: 22,
            //                             align: 'center'
            //                         },
            //                         // abg: {
            //                         //     backgroundColor: '#333',
            //                         //     width: '100%',
            //                         //     align: 'right',
            //                         //     height: 22,
            //                         //     borderRadius: [4, 4, 0, 0]
            //                         // },
            //                         hr: {
            //                             borderColor: '#aaa',
            //                             width: '100%',
            //                             borderWidth: 0.5,
            //                             height: 0
            //                         },
            //                         b: {
            //                             fontSize: 16,
            //                             // lineHeight: 33
            //                         },
            //                         per: {
            //                             color: '#eee',
            //                             backgroundColor: '#334455',
            //                             padding: [2, 4],
            //                             borderRadius: 2
            //                         }
            //                     }
            //                 },
            //                 data: arr2
            //             }
            //         ]
            //     })
            // }
        }
    }
</script>

<style>
    .content3 {
        text-align: center;
        display: flex;
        flex-direction: row;
        /* justify-content: space-between; */
        flex-flow: row;
        /*伸缩项目单行排列*/
    }

    #pie4 {
        /* margin-top:5%; */
        width: 600px;
        height: 300px;
    }

    #pie5,#bar6 {
        /* flex:1; */
        width: 600px;
        height: 300px;
    }

    #barcontent2{
        flex: 1;
    }

</style>