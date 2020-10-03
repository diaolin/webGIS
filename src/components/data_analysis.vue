<template>
    <div>
        <div class = "content5" style="display:flex;">
        <div id = "left" style="width:300px;">
             <el-tree :data="dataTree"  show-checkbox default-expand-all node-key="label" ref="tree" highlight-current
                    check-on-click-node :props="defaultProps" :check-strictly="true" :render-content="renderContent" :default-checked-keys='resourceCheckedKey' @check="getCheckedKeys">
            </el-tree>
        </div>
        <div id = "right" style="flex:1;">
            <div id="map">
                <span>
                    <el-button  type="primary" id="type" value="Polygon" @click="drawPolygon()">绘制</el-button>
                    <el-button  type="primary" id="type" value="None" @click="removePolygon()">清除绘制</el-button>
                    <el-button  type="primary" id="type" value="None" @click="removeDraw()">取消绘制</el-button>
                    <el-button type="primary" v-show="selectFea" @click="selectFeature()">选择要素</el-button>
                    <el-button type="primary" v-show="!selectFea" disabled>选择要素</el-button>
                    <el-button type="primary" v-show="feaChart" @click="addChart()">要素图表</el-button>
                    <el-button type="primary" v-show="!feaChart" disabled>要素图表</el-button>
                    <el-button type="primary" v-show="feature" @click="removeFea()">删除要素</el-button>
                    <el-button type="primary" v-show="!feature" disabled>删除图表</el-button>
                    <el-button type="primary" @click="Intersect()">相交</el-button>
                    <el-button type="primary" @click="testcaijian()">测试</el-button>
                </span>
                <el-button class="export" type="primary" @click="exportShp()">导出</el-button>
                <div id="barline" v-show="barlineShow">
                </div>
            </div>
           
        </div>
        
        <!-- <el-container>
            <el-aside width="25%">
                <el-tree :data="dataTree"  show-checkbox default-expand-all node-key="label" ref="tree" highlight-current
                    check-on-click-node :props="defaultProps" :check-strictly="true" :render-content="renderContent"  @check="getCheckedKeys">
                </el-tree>
            </el-aside>

            <el-container>
                <el-main>
                    <div id="map">
                    </div>
                </el-main>
                
            </el-container>
        </el-container> -->
        <!-- <div id="location"></div> -->
        </div>
    </div>
    <!-- <link rel="stylesheet" href="https://openlayers.org/en/v3.19.1/css/ol.css" type="text/css"> -->
</template>

<script>
    import Map from "ol/Map";
    import View from "ol/View";
    import TileLayer from "ol/layer/Tile";
    import XYZ from "ol/source/XYZ";
    import TileWMS from "ol/source/TileWMS.js";
    import {
        fromLonLat
    } from "ol/proj.js";
    import OSM from "ol/source/OSM";
    import proj4 from 'proj4';
    import {register} from 'ol/proj/proj4';
    import "ol/ol.css";
    import Draw from 'ol/interaction/Draw'
    import control from "ol/control/Control"
    import {ScaleLine, defaults as defaultControls} from 'ol/control';
    import Projection from 'ol/proj/Projection'
    import Intersects from 'ol/format/filter/Intersects'
    import ImageWMS from 'ol/source/ImageWMS'
    import coordinate from "ol/coordinate"
    import {
        Vector as VectorLayer
    } from 'ol/layer'
    import {
        Vector as VectorSource
    } from 'ol/source'
    import {
        GeoJSON
    } from 'ol/format';
    import {
        bbox
    } from 'ol/loadingstrategy'
    import {
        Polygon,
        Feature,
        Style,
        Stroke,
        Circle,
        Icon,
        Fill
    } from 'ol/style'
    import {
        dataget
    } from '../api/get.js'
    import {
        post
    } from '../api/post.js'
    import axios from "axios"
    import Vue from "vue"
    import Polygon1 from "ol/geom/Polygon"
    import Feature1 from "ol/Feature"
    import array from '../assets/json/lvlvlv.json'
    export default {
        data() {
            return {
                map: null,
                layer:null,
                extent:null,
                test:null,
                allLayer:[],
                allNode:[],
                draw:null,
                vector:null,
                drawPoint:[],
                selectFea:false,
                testdata:'',
                feaChart:false,
                barline:'',
                feature:false,
                wfsVectorLayer:'',
                barlineShow:false,
                geometry:'',
                resourceCheckedKey:['三次调查底图'],
                dataTree: [{
                    label: '调查成果',
                    children: [{
                        label: '三次调查成果',
                        children: [{
                            label: '境界与政区',
                            children: [{
                                value:0,
                                label: '行政区',
                                jx:'xzq',
                                className:'iconfont icon-zhengque'
                            }, {
                                value:0,
                                label: '村级调查区',
                                jx:'cjdcq',
                                className:'iconfont icon-zhengque'
                            }]
                        }, {
                            label: '地貌',
                            children: [{
                                value:0,
                                label: '坡度图',
                                jx:'pdt',
                                className:'iconfont icon-zhengque'
                            }]
                        }, {
                            label: '土地利用',
                            children: [{
                                value:0,
                                label: '地类图斑',
                                jx:'dltb',
                                className:'iconfont icon-zhengque'
                            }]
                        }, {
                            label: '永久基本农田',
                            children: [{
                                value:0,
                                label: '永久基本农田图斑',
                                jx:'yjjbnttb',
                                className:'iconfont icon-gantanhao-yuankuang'
                            }]
                        },{
                            label: '其他土地要素',
                            children: [{
                                value:0,
                                label: '临时用地',
                                jx:'lsyd',
                                className:'iconfont icon-gantanhao-yuankuang'
                            }, {
                                value:0,
                                label: '批准未建设土地',
                                jx:'pzwjstd',
                                className:'iconfont icon-gantanhao-yuankuang'
                            }, {
                                value:0,
                                label: '城镇村等用地',
                                jx:'czcdyd',
                                className:'iconfont icon-zhengque'
                            }, {
                                value:0,
                                label: '重要项目用地',
                                jx:'zyxmyd',
                                className:'iconfont icon-gantanhao-yuankuang'
                            }, {
                                value:0,
                                label: '开发园区',
                                jx:'kfyq',
                                className:'iconfont icon-gantanhao-yuankuang'
                            }, {
                                value:0,
                                label: '光伏板区',
                                jx:'gfbq',
                                className:'iconfont icon-gantanhao-yuankuang'
                            }, {
                                value:0,
                                label: '推土区',
                                jx:'ttq',
                                className:'iconfont icon-zhengque'
                            }, {
                                value:0,
                                label: '拆除未尽区',
                                jx:'ccwjq',
                                className:'iconfont icon-zhengque'
                            }, {
                                value:0,
                                label: '路面范围',
                                jx:'lmfw',
                                className:'iconfont icon-zhengque'
                            }]
                        }]
                    }]
                    }, 
                    {
                    label: '监测成果',
                    children: [{
                        value:0,
                        label: '2019年监测图斑',
                        className:'iconfont icon-zhengque',
                        jx:'511681sdjctb_2019'
                    }, {
                        value:0,
                        label: '2018年监测图斑',
                        className:'iconfont icon-zhengque',
                        jx:'511681jctb_2018'
                    }, {
                        value:0,
                        label: '2017年监测图斑',
                        className:'iconfont icon-zhengque',
                        jx:'511681jctb1_2017'
                    }]
                    }, {
                    label: '影像成果',
                    children: [{
                        value:1,
                        label: '三次调查底图',
                        className:'iconfont icon-zhengque',
                        jx:'511681PL1+GF2DOM011'
                    }]
                    },{
                    label: '相关业务数据',
                    children: [{
                        value:0,
                        label: '永久基本农田',
                        className:'iconfont icon-zhengque',
                        jx:'jbntbhtb'
                    }, {
                        label: '部下发用地管理信息',
                        children: [{
                            label: '2019年',
                            children: [{
                                value:0,
                                label: '农用地转用',
                                className:'iconfont icon-zhengque',
                                jx:'nzyxmtb_2010_2019_511681'
                            }, {
                                value:0,
                                label: '土地整理',
                                className:'iconfont icon-zhengque',
                                jx:'tdzzysxmtb_2011_2018_511681'
                            }]
                        }]
                    }]
                    }
                ],
            };
        },
        watch: {
            // 根据名称筛选部门树
            deptName(val) {
            this.$refs.tree.filter(val);
            },
            // 默认点击Tree第一个节点
            deptTreeData(val) {
                if (val) {
                    this.$nextTick(() => {
                        document.querySelector('.el-tree-node__content').click()
                    })
                }
            }
        },
        mounted() {
            this.initMap();
            this.requestTree();
            this.defaultCheck();
            // this.quchong();
        },
        methods: {
            defaultProps() {

            },
            defaultCheck(){
                // this.$nextTick(() => {
                //     // treeBox 元素的ref   value 绑定的node-key
                //     this.$refs.tree.setChecked('dltb',true); 
                // });
            },
            quchong(){
                var arr = [];
                for(let i in array){
                    arr.push(array[i].zlwz);
                }
                var ary={};
                for(let i=0;i<arr.length;i++){
                        if(arr[i] in ary){
                        ary[arr[i]]=ary[arr[i]]+1; 
                        }else{          
                            ary[arr[i]]=1;
                        }          
                }
                console.log("ary",ary);
            },
            Intersect(){
                console.log("this.vector",this.vector);
                console.log("this.allNode",this.allNode);
                let arrlabel = [],msg = '';
                for(let i in this.allNode){
                    arrlabel.push(this.allNode[i].label);
                }
                msg = arrlabel.join(",");
                if(this.vector !== null){
                    msg +='与绘制图层';
                }
                const h = this.$createElement;
                this.$msgbox({
                title: '提示',
                message: h('p', null, [
                    h('span', null, '确定选择'+msg+'相交么?'),
                    // h('i', { style: 'color: teal' }, 'VNode')
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    // if (action === 'confirm') {
                    // // instance.confirmButtonLoading = true;
                    // // instance.confirmButtonText = '执行中...';
                    // // setTimeout(() => {
                    // //     done();
                    // //     setTimeout(() => {
                    // //     instance.confirmButtonLoading = false;
                    // //     }, 300);
                    // // }, 3000);
                    // } else {
                    
                    // }
                    done();
                }
                }).then(action => {
                this.$message({
                    type: 'info',
                    message: 'action: ' + action
                });
                });
            },
            exportShp() {
                if(this.allNode.length === 0){
                    this.$message({
                        showClose: true,
                        message: '请先选择图层',
                        type: 'warning'
                    });
                }
                for(let i in this.allNode){
                    let fileName = this.allNode[i].label;
                    let fileJx = this.allNode[i].jx;
                    let url =
                        'http://192.168.100.115:8080/geoserver/WebLayer/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebLayer:' +
                        fileJx + '&outputFormat=SHAPE-ZIP';
                    axios({
                        method: 'GET',
                        url: url,
                        params: {
                            // reportRuleId: row.reportRuleId
                        },
                        responseType: 'blob'
                    }).then(response => {
                        console.log("response", response);
                        let blob = new Blob([response.data], {
                            type: 'application/zip'
                        })
                        let link = document.createElement('a')
                        link.href = window.URL.createObjectURL(blob)
                        link.download = fileName
                        link.click()
                        //释放内存
                        window.URL.revokeObjectURL(link.href)
                    }).catch(error => this.$message.error(error))
                }
            },
            requestTree() {
                let that = this;
                dataget("dataManage/getTree.do", '').then(res => {
                    for (let i in res.data) {
                        let arr2 = [];
                        let obj1 = {
                            // id:i,
                            label: res.data[i].data.name,
                            children: res.data[i].children
                        };

                        for (let j in obj1.children) {
                            let arr3 = [];
                            let obj2 = {
                                // id:j,
                                label: obj1.children[j].data.name,
                                children: obj1.children[j].children
                            };
                            arr2.push(obj2);
                            // for(let k in obj2[j].children){
                            //     let obj3 = {
                            //         // id:i,
                            //         label:obj1.children[j].data.name,
                            //         children:obj1.children[j].children
                            //     };
                            //     arr3.push(obj3);
                            // }
                            // let obj22 = {
                            //     label:obj1.children[j].data.name,
                            //     children:arr3
                            // }
                            // arr2.push(obj22);
                        }
                        let obj12 = {
                            label: res.data[i].data.name,
                            children: arr2
                        }
                        // that.dataTree.push(obj12);
                        // console.log("that.dataTree",that.dataTree);
                    }
                }).catch(err => {
                    console.log("失败");
                });
            },
            getCheckedKeys(node) {
                this.allNode = this.$refs.tree.getCheckedNodes();
                this.addMapLayer(node.jx,node.value);
                if(node.value === 0){
                    node.value = 1;
                } else if(node.value === 1){
                    node.value = 0;
                }
                
            },
            addMapLayer(layer,value){
                this.selectFea = false;
                let layerName = 'WebLayer:'+layer;
                this.allLayer = [];
                let selectlayer = 
                    new TileLayer({
                        //extent:extent, //可注释
                        source: new TileWMS({
                            url: 'http://192.168.100.115:8080/geoserver/WebLayer/wms',
                            params: {
                                'LAYERS': layerName,
                                 // 'TILED': true,
                                'VERSION': '1.1.1',
                                'BBOX': this.extent,
                                'SRS': 'EPSG:4524',
                                "exceptions": 'application/vnd.ogc.se_inimage',
                                // 'env':'color:red;'
                                //'sld': "http://192.168.100.115:8080/111/cccccsld.sld"
                            },
                            serverType: 'geoserver'
                        })
                    });
                if(value === 0){
                    this.map.addLayer(selectlayer);
                    selectlayer.set("name",layerName);
                    if(layer === 'dltb'){
                        this.selectFea = true;
                    }
                } else if(value === 1){
                    console.log("layer",layer);
                    console.log("value",value);
                    let arrLayer = this.map.getLayers().array_;
                    console.log("arrLayer",arrLayer);
                    for(let i in arrLayer){
                        let delLayer = arrLayer[i].sourceChangeKey_.bindTo.values_.name;
                        if( delLayer === layerName){
                             this.map.removeLayer(arrLayer[i]);
                        }
                    }
                  
                }
            },
            initMap() {
                this.extent = [36365558.9724, 3333897.2863, 36394903.276, 3373469.3127]; //BBOX范围值
                let projection = new Projection({ //地图投影类型
                    code: 'EPSG:4524',
                    units: 'degrees',
                    extent: this.extent
                });
               this.test = [
                    new TileLayer({
                        //extent:extent, //可注释
                        source: new TileWMS({
                            url: 'http://192.168.100.115:8080/geoserver/dlTest/wms',
                            params: {
                                'LAYERS': 'dlTest:cccc',
                                // 'TILED': true,
                                'VERSION': '1.1.1',
                                'BBOX': this.extent,
                                'SRS': 'EPSG:4524',
                                "exceptions": 'application/vnd.ogc.se_inimage',
                                // 'env':'color:red;'
                                //'sld': "http://192.168.100.115:8080/111/cccccsld.sld"
                            },
                            serverType: 'geoserver'
                        })
                    })
                ];
                this.layer = [
                    new TileLayer({
                        //extent:extent, //可注释
                        source: new TileWMS({
                            url: 'http://192.168.100.115:8080/geoserver/WebLayer/wms',
                            params: {
                                'LAYERS': 'WebLayer:511681PL1+GF2DOM011',
                                // 'TILED': true,
                                'VERSION': '1.1.1',
                                'BBOX': this.extent,
                                'SRS': 'EPSG:4524',
                                "exceptions": 'application/vnd.ogc.se_inimage',
                                // 'env':'color:red;'
                                //'sld': "http://192.168.100.115:8080/111/cccccsld.sld"
                            },
                            serverType: 'geoserver'
                        })
                    })
                ];
                 this.layer[0].set("name",'WebLayer:511681PL1+GF2DOM011');
                
                this.map = new Map({
                    // controls: defaultControls().extend([scaleControl()]),
                    layers: this.layer,
                    target: 'map',
                    // controls: control.defaults().extend([
                    //     scaleLineControl        // 将比例尺控件添加到地图中
                    // ]),
                    view: new View({
                        projection: projection,
                        center: [36380550, 3355777],
                        zoom: 2
                    })
                });
                //  let scaleLineControl = new ScaleLine({
                //     //设置度量单位为米
                //     units: 'metric',
                //     target: 'scalebar',
                //     className: 'ol-scale-line'
                // });
                let control;
               function scaleControl() {
                // if (scaleType === 'scaleline') {
                    control = new ScaleLine({
                    units: 'metric',
                    });
                    // return control;
                // }
                control = new ScaleLine({
                    units: 'metric',
                    bar: true,
                    // steps: scaleBarSteps,
                    // text: scaleBarText,
                    minWidth: 140,
                });
                return control;
                }
                //this.map.addControl(scaleLineControl);
                // console.log("this.map",this.map);
                // console.log("this.layer",this.layer);
                
            },
            renderContent(h,{node, data, store}){
                let content = <span class="custom-tree-node">
                    <i class={data.className}></i>
                    <span style="margin-left:5px;">{node.label}</span>
                    </span>;
                return (content);
            },
            drawPolygon(){
                let source = new VectorSource({
                    wrapX:false,
                    params: {
                                'LAYERS': 'draw',
                                 // 'TILED': true,
                                'VERSION': '1.1.1',
                                // 'BBOX': this.extent,
                                // 'SRS': 'EPSG:4524',
                                // "exceptions": 'application/vnd.ogc.se_inimage',
                                // 'env':'color:red;'
                                //'sld': "http://192.168.100.115:8080/111/cccccsld.sld"
                            },
                });
                //ol.layer.Vector用于显示在客户端渲染的矢量数据。
                this.vector = new VectorLayer({
                    source:source
                });
                let that = this;
                let typeSelect = document.getElementById('type');
                // let draw;
                function addInteraction() {
                    let value = typeSelect.value;
                    if(value !== 'None'){
                        that.draw = new Draw({
                            source:source,
                            type: typeSelect.value
                        });
                        that.map.addInteraction(that.draw);
                        that.draw.on('drawend',function(evt){
                            let feature=evt.feature;
                            let geometry=feature.getGeometry();
                            let coordinate=geometry.getCoordinates();
                            // alert(coordinate);
                            that.drawPoint = coordinate;
                            that.geometry = geometry;
                            console.log("geometry",geometry);
                            console.log("coordinate",coordinate);
                        })
                        // that.map.removeInteraction(draw);
                    }
                }
                
                that.map.addLayer( this.vector);
                console.log("vector", this.vector);
                addInteraction();
                that.drawPoint = that.draw.sketchLineCoords_;
                // console.log("draw1",that.draw.sketchLineCoords_());
                // Draw.prototype.modifyDrawing_= function(e) {
                //     console.log("e",e);
                //     };
            },
            removePolygon(){
                this.map.removeLayer(this.vector);
            },
            removeDraw(){
                this.map.removeInteraction(this.draw);
            },
            selectFeature(){
                console.log("this.drawPoint",this.drawPoint);
                let arrpoint1;
                for(let i in this.drawPoint){
                    arrpoint1 = this.drawPoint[i].join('%20');
                }
                let test = this.geometry;
            
                let arrpoint = arrpoint1;
                console.log("arrpoint",arrpoint);
                let wfsVectorSource = new VectorSource({
                    format: new GeoJSON(),
                    url: 'http://192.168.100.115:8080/geoserver/WebLayer/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebLayer%3Adltb%20&outputFormat=application%2Fjson%20&filter=%20%3CFilter%20xmlns=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%20%3CIntersects%3E%20%3CPropertyName%3Eshape%3C/PropertyName%3E%20%3Cgml:Polygon%3E%20%3Cgml:outerBoundaryIs%3E%20%3Cgml:LinearRing%3E%20%3Cgml:coordinates%3E'+arrpoint+'%3C/gml:coordinates%3E%20%3C/gml:LinearRing%3E%20%3C/gml:outerBoundaryIs%3E%20%3C/gml:Polygon%3E%20%3C/Intersects%3E%20%3C/Filter%3E',
                    strategy: bbox,
                    // filter: new Intersects('draw',test)
                });
                //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                this.wfsVectorLayer = new VectorLayer({
                    source: wfsVectorSource,
                    style: new Style({
                        fill: new Fill({ //矢量图层填充颜色，以及透明度
                            color: 'rgba(28, 124, 197, 0.5)'
                        }),
                        stroke: new Stroke({
                            color: 'rgba(28, 124, 197, 0.7)',
                            width: 1
                        })
                    }),
                    visible: true
                });
                this.map.addLayer(this.wfsVectorLayer);
                let arrFea = wfsVectorSource.idIndex_;
                this.feature = true;
                console.log("arrFea",arrFea);
                this.testdata = arrFea;
                this.feaChart = true;
                // setTimeout(function(){
                //     for(let item in this.testdata){
                //         console.log("llll");
                //         console.log("item",item);
                //         console.log("ffdf",this.testdata[item]);
                //     }
                // },3000)
            },
           addChart(){
                let arrFea = [];
                let arrchart = [],arrdl = [],arrdlmj = [],arrtbs = [];
                for(let item in this.testdata){
                    arrFea.push(this.testdata[item]);
                }
                // for(let i in arrFea){
                //     if(!arrmc.includes(arrFea[i].values_.dlmc)){
                //         arrmc.push(arrFea[i].values_.dlmc);
                //     }
                // }
                let arrdata = arrFea.reduce((obj,item) => {
                    let find = obj.find(i => i.values_.dlmc === item.values_.dlmc)
                    let _d = {
                        ...item,
                        count:1,
                        name:item.values_.dlmc,
                        area:item.values_.tbdlmj
                    }
                    find?find.count++:obj.push(_d)
                    find?find.area += item.values_.tbdlmj:obj.push(_d)
                    return obj;
                },[]);
                for(let i = 0;i < arrdata.length;i += 2){
                    arrchart.push(arrdata[i]);
                }
                console.log("arrchart",arrchart);
                this.barlineShow = true;
                this.barline = this.$echarts.init(document.getElementById('barline'));
                arrchart.sort(up);
                function up(x,y){
                    return x.area-y.area
                }
                for(let i in arrchart){
                    arrdl.push(arrchart[i].name);
                    arrdlmj.push(arrchart[i].area);
                    arrtbs.push(arrchart[i].count);
                }
                let max = Math.max.apply( Math, arrtbs);
                let min = Math.min.apply( Math, arrtbs);
                console.log("max",max);
                console.log("min",min);
                this.barline.setOption({
                    title: {
                    // text: '世界人口总量',
                    // subtext: '数据来自网络'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                backgroundColor:'rgba(255,255,255,0.8)',
                legend: {
                    data: ['地类图斑面积','地类图斑个数']
                },
                grid: {
                    left: '3%',
                    right: '20%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        splitLine:{
                            show:false    //去掉网格线
                        },
                        name: '面积(m²)',
                    },
                    {
                        type: 'value',
                        position: 'top',
                        min: 0,
                        max: max,
                        splitLine:{
                            show:false    //去掉网格线
                        },
                        name: '个数(个)',
                        // name: '降水量',
                        // data: arrdl
                    },
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: arrdl,
                        splitLine:{
                            show:false    //去掉网格线
                        }
                    },
                ],
                series: [
                    {
                        name: '地类图斑面积',
                        type: 'bar',
                        data: arrdlmj,
                        barWidth:10,
                        itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'right', //在上方显示
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
                        // color:'rgba(28, 124, 197)'
                    },
                    {
                        name: '地类图斑个数',
                        type: 'line',
                        xAxisIndex: 1,
                        color:'green',
                        data: arrtbs,
                        // barWidth:10,
                        // color:'rgba(28, 124, 197)'
                    }
                ]
                })
            },
            removeFea(){
                this.barlineShow = false;
                this.map.removeLayer(this.wfsVectorLayer);
            },
            testcaijian(){
                let wfsVectorSource = new VectorSource({
                    format: new GeoJSON(),
                    projection: 'EPSG:4524',
                    url: 'http://192.168.100.115:8080/geoserver/WebLayer/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebLayer%3Adltb&outputFormat=application%2Fjson',
                    strategy: bbox
                });
                //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                let wfsVectorLayer = new VectorLayer({
                    source: wfsVectorSource,
                    style: new Style({
                        fill: new Fill({ //矢量图层填充颜色，以及透明度
                            color: 'rgba(28, 124, 197, 0.5)'
                        }),
                        stroke: new Stroke({
                            color: 'rgba(28, 124, 197, 0.7)',
                            width: 1
                        })
                    }),
                    visible: true
                });
                var styles = {
                    'route' : new Style({
                        stroke : new Stroke({
                            width : 3,
                            color : [ 237, 212, 0, 0.8 ]
                        }),
                        fill : new Fill({
                            color : 'red'
                        })
                    }),
                    'flag' : new Style({
                        image : new Icon({
                            src : 'images/flag_rightgreen_.png',
                            //  anchor: [0, 0],
                            scale : 0.3
                        })
                    }),
                }

                this.map.addLayer(wfsVectorLayer);
                let params = '<?xml version="1.0" encoding="UTF-8"?>'+'<wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd"> <ows:Identifier>JTS:intersection</ows:Identifier> <wps:DataInputs> <wps:Input> <ows:Identifier>a</ows:Identifier> <wps:Data> <wps:ComplexData mimeType="application/wkt"><![CDATA[POLYGON ((36378672.07427999 3362936.3031127225, 36381444.82124698 3362298.667921707,36378546.479469635 3361100.6866537384, 36378218.00073487 3362540.1964031523,36378218.00073487 3362540.1964031523))]]></wps:ComplexData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>b</ows:Identifier> <wps:Reference mimeType="text/xml; subtype=gml/3.1.1" xlink:href="http://192.168.100.115:8080/geoserver/WebLayer/ows?service=WFS&amp;version=1.0.0&amp;request=GetFeature&amp;typeName=WebLayer%3Adltb&amp;outputFormat=gml3" method="GET"/> </wps:Input> </wps:DataInputs> <wps:ResponseForm> <wps:RawDataOutput mimeType="text/xml; subtype=gml/3.1.1"> <ows:Identifier>result</ows:Identifier> </wps:RawDataOutput> </wps:ResponseForm> </wps:Execute>';
                axios({
                    type : 'post',
                    // method: 'POST',
                    url: 'http://192.168.100.115:8080/geoserver/ows?service=WPS&version=1.0.0',
                    contentType : 'text/xml',
                    data:params,
                    // responseType: 'blob',
                }).then(response => {
                    if (response.type == "Polygon") {//如果几何图形是多边形,则调用，后续有更多需求再添加
						var route = new Polygon1(response.coordinates);
					}
 
					var routeFeature = new Feature1({
						geometry : route
					})
					
					routeFeature.setStyle(styles.route);
					wfsVectorSource.getSource().addFeature(routeFeature);
                }).catch(error => console.log("fail"))
            }
        },
        
    }
</script>

<style lang="less">
    #map {
        width: 100%;
        height: 100%;
    }

    #location {
        float: right;
    }
    #barline{
        width:600px;
        height: 550px;
        z-index: 1000;
        position: absolute;
        right: 10px;
        bottom: 0;
        // border: 1px solid rgba(0,0,0,.2);
        // background-clip: padding-box;
        // box-shadow: 0 1px 1px rgba(0,0,0,.4);
        // background: #fff;
        // border-radius: 5px;
    }
    .el-aside {
        background-color: #D3DCE6;
        /* color: #333; */
        text-align: center;
        /* line-height: 200px; */
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        /* line-height: 160px; */
    }

    .el-container {
        margin: 100px;
        width: 80%;
    }
    // .ol-viewport{
    //     display: none;
    // }
    .export {
        // margin-right: 30px;
        // float: right;
    }

    .el-tree-node {
        .is-leaf + .el-checkbox .el-checkbox__inner {
            display:inline-block;
        }
        .el-checkbox__input> .el-checkbox__inner {
            display:none;
        }
    }
</style>