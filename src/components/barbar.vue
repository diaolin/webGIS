<template>
    <div class="content4">
        <div id="bar7"></div>
        <div id="bar8"></div>
    </div>
</template>

<script>
    import {
        eventBus
    } from '../main'
    import landType from '../assets/json/landType.json'
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
            "$store.state.EMsg":function(e){
                this.arrsectype=[];
                this.arrsecdata=[];
                this.allformdata = e;
                let arrdata = e;
                let arrfirstdata = [],arrfirsttype = [];
                for(let i in arrdata){
                    let obj = {
                        value:arrdata[i].hj,
                        name:arrdata[i].name
                    };
                    arrfirstdata.push(obj);
                    arrfirsttype.push(arrdata[i].name);
                }
                for(let item in arrdata[0].data){
                    let name = this.searchType(item.substr(1));
                    let obj = {
                        value:arrdata[0].data[item],
                        name:name
                    }
                    this.arrsectype.push(name);
                    this.arrsecdata.push(obj);
                }
                this.drawBar(arrfirsttype,arrfirstdata);
              console.log("cinxkioasbcf",e);
            },
           
        },
        data() {
            return {
                bar7:'',
                bar8:'',
                arrsectype:[],
                arrsecdata:[],
                allformdata:[],
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
            searchType(code){
                for(let i in landType){
                    if(code === landType[i].code){
                        return landType[i].value;
                    }
                }
            },
            drawBar(type1,data1){
                this.bar7 = this.$echarts.init(document.getElementById('bar7'));
                this.bar8 = this.$echarts.init(document.getElementById('bar8'));
                this.bar7.setOption({
                    title: {
                        text: '土地利用分类一级类统计图',
                    },
                    tooltip: {

                    },
                    xAxis: {
                        data:type1,
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
                        data: data1,
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

                let that = this;
                this.bar7.on('click', function (params) {
                    that.bar8.setOption({
                        title: {
                            text: params.name,
                        },
                    })
                    let arr= [],arrtype = [],arrdata = [];
                    for(let i in that.allformdata){
                        if(that.allformdata[i].name === params.name){
                            arr = that.allformdata[i].data;
                        }
                    }
                    for(let item in arr){
                        let name = that.searchType(item.substr(1));
                        arrtype.push(name);
                        let obj = {
                            value:arr[item],
                            name:name
                        }
                        arrdata.push(obj);
                    }
                    console.log("arrtype",arrtype);
                    console.log("arrdata",arrdata);
                    that.bar8.setOption({
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
                    })

                })

                this.bar8.setOption({
                    title: {
                        text: '湿地',
                    },
                    tooltip: {

                    },
                    xAxis: {
                        data:this.arrsectype,
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
                        data: this.arrsecdata,
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
            }     
        }
    }
</script>

<style>
    .content4{
        text-align: center;
        /* display: flex;
        flex-direction: row; */
        /* justify-content: space-between; */
        
    }
    #bar7 {
        text-align: center;
        width: 900px;
        height: 300px;
    }
    #bar8 {
        text-align: center;
        /* flex:1; */
        width: 900px;
        height: 300px;
    }
</style>