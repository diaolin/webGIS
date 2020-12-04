<template>
    <div>
        <div class="content3" style="display:flex;">
            <div id="left" style="width:300px;background:#DBF1FD;">
                <countycheck/>
                <el-tree :data="dataTree" show-checkbox default-expand-all node-key="label" ref="tree" highlight-current
                    check-on-click-node :props="defaultProps" :check-strictly="true" :render-content="renderContent"
                    :default-checked-keys='resourceCheckedKey' @check="getCheckedKeys" @node-click="conNodeClick" style="background:#DBF1FD;">
                </el-tree>
            </div>
            <div id="right" style="flex:1;">
                <div id="map">
                    <!-- <canvas id="canvas" width="400" height="300">抱歉，您的浏览器不支持canvas元素</canvas> -->
                    <div id="info">&nbsp;</div>
                    <!-- <button @click="testphoto()">测试</button> -->
                    <!-- <div class="square"></div> -->
                    <!-- <el-button class="clear" type="primary" @click="clearFeaTable()">清除图表</el-button> -->
                    <el-button class="clear" type="primary" @click="jzPhoto()" v-show="jzphotoShow">举证照片</el-button>
                    <el-button class="clear" v-show="jzphotoShow" style="color:black;" disabled>当前层级：{{mapzoom}}</el-button>
                    <!-- <div v-show="jzphotoShow">当前层级：{{mapzoom}}</div> -->
                    <!-- <el-button class="export" type="primary" @click="exportShp()">导出</el-button> -->
                    <div class="curlayer" style="position:absolute;right:100px;top:120px;z-index:999;background:white;">
                        <div v-show="zoomShow">当前层级：{{mapzoom}}</div>
                        <el-tree
                            :data="seldataTree"
                            node-key="label"
                            ref="seltree"
                            default-expand-all
                            @node-drag-start="handleDragStart"
                            @node-drag-enter="handleDragEnter"
                            @node-drag-leave="handleDragLeave"
                            @node-drag-over="handleDragOver"
                            @node-drag-end="handleDragEnd"
                            @node-drop="handleDrop"
                            draggable
                            :allow-drop="allowDrop"
                            :allow-drag="allowDrag"
                            @node-click="handleNodeClick"
                            style="margin-right:20px;">
                            <span class="custom-tree-node" slot-scope="{ node,data }">
                                <i :class="data.className"></i>
                                <span class="iconfont icon-tianchong" :style="{color:data.tciconcolor}"  @click="clicktc(data.id)" disabled></span>
                                <span class="iconfont icon-jurassic_border-linecolor" :style="{color:data.bkiconcolor}"  @click="clickbk(data.id)"></span>
                                <span></span>
                                <span style="margin-left:5px;" >{{node.label}}</span>
                            </span>
                        </el-tree>
                        <!--  -->
                        <!-- <sketch-picker v-show = "colorShow" @input="colorValueChange" v-model="tccolor"></sketch-picker>
                        <div v-show = "borderShow">
                            <el-input v-model="widthinput" placeholder="请输入边框宽度"></el-input>
                            <sketch-picker  @input="borderValueChange" v-model="bkcolor"></sketch-picker>
                        </div> -->
                        <div v-for="(item1,index1) in seldataTree" :key="item1.id" :index="index1">
                            <div v-show = "item1.colorShow">
                                <sketch-picker  @input="colorValueChange" v-model="item1.tccolor" style=""></sketch-picker>
                                <el-button type="primary" @click="clicktcAdd">确定</el-button>
                                <el-button type="info" @click="tcColorCancel">取消</el-button>
                            </div>
                            <div v-show = "item1.borderShow">
                                <el-input v-model="item1.width" placeholder="请输入边框宽度" @input="bkwidthChange"></el-input>
                                <sketch-picker  @input="borderValueChange" v-model="item1.bkcolor"></sketch-picker>
                                <el-button type="primary" @click="bkColorAdd">确定</el-button>
                                <el-button type="info" @click="bkColorCancel">取消</el-button>
                            </div>
                        </div>
                    </div>
                    <div id="featable" v-show="featableShow">
                        <el-table
                            :data="allFormData">
                            <el-table-column
                            prop="name"
                            label="属性字段"
                            width="150" style="background-color:red;">
                            </el-table-column>
                            <el-table-column
                            prop="value"
                            label="属性值"
                            width="300">
                            </el-table-column>
                        </el-table>
                        <!-- <div v-for="(item,index) in allFormData" :key="index">{{item.title}}</div> -->
                    </div>
                    <div id="photo" v-show="photoShow">
                        <el-carousel :autoplay="false" :interval="0" @change="changePhoto" ref="carousel"
                            style="position:absolute;width:600px;height:400px;right:0;bottom:0;">
                            <el-carousel-item v-for="(item,index2) in photodata" :key="index2" :index="item"
                                name="index" style="width:600px;height:400px;">
                                <div @click="setActiveItem(index)">拍摄时间:{{ item.time }}</div>
                                <el-image :src="item.url" :preview-src-list="item.qthksrc"
                                    style="width:90%;height:90%;">
                                </el-image>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
                <!-- <div id="scalebar" style="bottom:0;position:absolute;"></div>-->
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
            <div id="location"></div>
        </div>
    </div>
    <!-- <link rel="stylesheet" href="https://openlayers.org/en/v3.19.1/css/ol.css" type="text/css"> -->
</template>
<script src="https://cdn.bootcdn.net/ajax/libs/proj4js/1.1.0/defs/EPSG102067.js"></script>
<script>
    import Map from "ol/Map";
    import View from "ol/View";
    import TileLayer from "ol/layer/Tile";
    import XYZ from "ol/source/XYZ";
    import TileWMS from "ol/source/TileWMS.js";
    import getCenter from "ol/"
    import {
        fromLonLat
    } from "ol/proj.js";
    import OSM from "ol/source/OSM";
    import "ol/ol.css";
    import control from "ol/control/Control"
    import ScaleLine from "ol/control/ScaleLine"
    import Projection from 'ol/proj/Projection'
    import Image from 'ol/layer/Image'
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
        Style,
        Stroke,
        Circle,
        Fill,
        Icon,
        Text
    } from 'ol/style'
    import {
        dataget
    } from '../api/get.js'
    import {
        post
    } from '../api/post.js'
    import axios from "axios"
    import Vue from "vue"
    import * as olExtent from 'ol/extent';
    import {
        transformExtent
    } from 'ol/proj'
    import {
        transform
    } from 'ol/proj';
    import proj4 from 'proj4';
    import {
        register
    } from 'ol/proj/proj4';
    import Feature from 'ol/Feature';
    import Point from 'ol/geom/Point';
    import Select from 'ol/interaction/Select'
    import LineString from 'ol/geom/LineString'
    import Polygon from 'ol/geom/Polygon'
    import Polyline from 'ol/format/Polyline';
    import MultiLineString from 'ol/geom/MultiLineString';
    import {
        toContext
    } from 'ol/render';
    import { Button } from 'element-ui';
    import { reactive, toRefs } from "vue";
    import Sketch from 'vue-color'
    import propertyTable from '../assets/json/propertyTable.json'
    // import {proj4} from "proj4"
    // import * as proj4 from 'ol/proj/proj4';
    import countycheck from './countySelect'
    import {
        eventBus
    } from '../main'
    export default {
        created() {
            eventBus.$off("username");
            eventBus.$on('countyValue', (message) => {
                // console.log("countyValue132",message);
                // window.sessionStorage.setItem('user',message)
            })
        },
        data() {
            return {
                widthinput:'',
                map: null,
                layer: null,
                extent: null,
                test: null,
                requestVectorSource: null,
                vectorLayer: null,
                endvectorlayer: null,
                polygonPoints: [],
                clickpoint: [],
                photoShow: false,
                clickphotoFlag: false,
                jzphotoShow: false,
                testgeom: null,
                selectextent: [],
                allLayer: [],
                allNode: [],
                allFormData: [],
                allFeature: [],
                featableShow: false,
                requestLayer: [],
                photodata: [],
                allphotodata: [],
                ploygonLayer: null,
                selploygonLayer: [],
                cliploygonLayer: [],
                vector1: null,
                resourceCheckedKey: ['三次调查底图'],
                dataTree: [{
                        label: '调查成果',
                        children: [{
                            label: '三次调查成果',
                            children: [{
                                label: '境界与政区',
                                children: [{
                                    id:0,
                                    value: 0,
                                    label: '行政区',
                                    jx: 'xzq',
                                    className: 'iconfont icon-zhengque',
                                }, {
                                    id:1,
                                    value: 0,
                                    label: '村级调查区',
                                    jx: 'cjdcq',
                                    className: 'iconfont icon-zhengque',
                                }]
                            }, {
                                label: '地貌',
                                children: [{
                                    id:2,
                                    value: 0,
                                    label: '坡度图',
                                    jx: 'pdt',
                                    className: 'iconfont icon-zhengque',
                                }]
                            }, {
                                label: '土地利用',
                                children: [{
                                    id:3,
                                    value: 0,
                                    label: '地类图斑',
                                    jx: 'dltb',
                                    className: 'iconfont icon-zhengque'
                                }]
                            }, {
                                label: '永久基本农田',
                                children: [{
                                    id:4,
                                    value: 0,
                                    label: '永久基本农田图斑',
                                    jx: 'yjjbnttb',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }]
                            }, {
                                label: '其他土地要素',
                                children: [{
                                    id:5,
                                    value: 0,
                                    label: '临时用地',
                                    jx: 'lsyd',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    id:6,
                                    value: 0,
                                    label: '批准未建设土地',
                                    jx: 'pzwjstd',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    id:7,
                                    value: 0,
                                    label: '城镇村等用地',
                                    jx: 'czcdyd',
                                    className: 'iconfont icon-zhengque'
                                }, {
                                    id:8,
                                    value: 0,
                                    label: '重要项目用地',
                                    jx: 'zyxmyd',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    id:9,
                                    value: 0,
                                    label: '开发园区',
                                    jx: 'kfyq',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    id:10,
                                    value: 0,
                                    label: '光伏板区',
                                    jx: 'gfbq',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    id:11,
                                    value: 0,
                                    label: '推土区',
                                    jx: 'ttq',
                                    className: 'iconfont icon-zhengque'
                                }, {
                                    id:12,
                                    value: 0,
                                    label: '拆除未尽区',
                                    jx: 'ccwjq',
                                    className: 'iconfont icon-zhengque'
                                }, {
                                    id:13,
                                    value: 0,
                                    label: '路面范围',
                                    jx: 'lmfw',
                                    className: 'iconfont icon-zhengque'
                                }]
                            }, {
                                id:14,
                                value: 0,
                                label: '举证成果',
                                jx: '511681jzzp',
                                className: 'iconfont icon-zhengque'
                            }]
                        }]
                    },
                    {
                        label: '监测成果',
                        children: [{
                            id:15,
                            value: 0,
                            label: '2019年监测图斑',
                            className: 'iconfont icon-zhengque',
                            jx: '511681jctb_2019'
                        }, {
                            id:16,
                            value: 0,
                            label: '2018年监测图斑',
                            className: 'iconfont icon-zhengque',
                            jx: '511681jctb_2018'
                        }, {
                            id:17,
                            value: 0,
                            label: '2017年监测图斑',
                            className: 'iconfont icon-zhengque',
                            jx: '511681jctb1_2017'
                        }]
                    }, {
                        label: '影像成果',
                        children: [{
                            id:18,
                            value: 1,
                            label: '三次调查底图',
                            className: 'iconfont icon-zhengque',
                            jx: '511681PL1+GF2DOM011'
                        }]
                    }, {
                        label: '相关业务数据',
                        children: [{
                            id:19,
                            value: 0,
                            label: '永久基本农田',
                            className: 'iconfont icon-zhengque',
                            jx: '5116812014jbntbhtb'
                        }, {
                            label: '部下发用地管理信息',
                            children: [{
                                label: '2019年',
                                children: [{
                                    id:20,
                                    value: 0,
                                    label: '农用地转用',
                                    className: 'iconfont icon-zhengque',
                                    jx: 'nzyxmtb_2010_2019_511681'
                                }, {
                                    id:21,
                                    value: 0,
                                    label: '土地整理',
                                    className: 'iconfont icon-zhengque',
                                    jx: 'tdzzysxmtb_2011_2018_511681'
                                }]
                            }]
                        }]
                    }
                ],
                currentLayer: [],
                selectedFeatures: '',
                allarrpoint: [],
                seldataTree:[{
                    id:18,
                    value: 1,
                    label: '三次调查底图',
                    className: 'iconfont icon-zhengque',
                    jx: '511681PL1+GF2DOM011',
                    color:'gray',
                    tcvector:[],
                    bkvector:[],
                    tccolor:'rgba(255,255,255,1)',
                    bkcolor:'rgba(255,255,255,1)',
                    width:0,
                    colorShow:false,
                    borderShow:false
                }],
                colorShow:false,
                color: 'white',
                diapha:0,
                colors: {
                    hex: '#194d33',
                    hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
                    hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
                    rgba: { r: 25, g: 77, b: 51, a: 1 },
                    a: 1
                },
                tciconcolor:'blue',
                tcVectorSource:'',
                tcLayer:[],
                tccolor:'rgba(255,255,255,1)',
                seltclayer:'',
                seltcid:'',
                bkcolor:'rgba(255,255,255,1)',
                borderShow:false,
                arraddlayer:[],
                selvectorlayer:[],
                dragtype:'',
                addchecklayer:'',
                removechecklayer:'',
                mapzoom:'',
                zoomShow:false,
                formfeature:'',
                formname:''
            };
        },
        components: {
            countycheck
        },
        watch:{
            formfeature(value){
                setTimeout( ()=> {
                    this.searchTable(value, this.formname);
                    }, 500)
            },
            seldataTree: function(e){
                let arrlayer = [];
                for(let i in e){
                    arrlayer.push(e[i].jx);
                }
                if(arrlayer.includes('dltb') === false && arrlayer.includes('pdt') === false){
                    this.zoomShow = false;
                } else {
                    this.zoomShow = true;
                }
                // console.log("akdkhseafhyu");
                // if(e === this.seldataTree){

                // } else {
                //     // this.seldataTree = e;
                //     // for(let i in this.seldataTree){
                //     // let obj = this.seldataTree[i];
                //     //     obj["color"] = "blue";
                //     //     obj["vector"] = [];
                //     // }
                //     console.log("this.seldataTree",this.seldataTree);
                // }
                // console.log("llll",this.allNode);
                this.clearvectorlayer('TILE');
                // return;
                // let len = this.seldataTree.length;
                // for(let i = len-1 ;i >= 0;i--){
                //     this.addMapLayer(this.seldataTree[i].jx, 0);
                // }
            },
            removechecklayer: function(e){
                
            },
            'widthinput':function(e){
                // this.tcColorAdd();
            }
        },
        
        mounted() {
            this.initMap();
            this.requestTree();
            
        },
        methods: {
            clicktcAdd(){
                let tccolor;
                for(let i in this.seldataTree){
                    if(this.seltcid === this.seldataTree[i].id){
                        tccolor = this.seldataTree[i].tccolor;
                    }
                }
                this.tcColorAdd('tc',0,'rgba(0,0,0,0)',tccolor);
            },
            bkwidthChange(value){
                this.widthinput = value;
                for(let i in this.seldataTree){
                    if(this.seltcid === this.seldataTree[i].id){
                        this.seldataTree[i].width = value;
                        this.$set(this.seldataTree, i, this.seldataTree[i]);
                    }
                }
            },
            tcShow(index){
                console.log("index",index);
            },
            colorValueChange(color){
                this.tccolor = color.hex8;
                for(let i in this.seldataTree){
                    if(this.seltcid === this.seldataTree[i].id){
                        this.seldataTree[i].tccolor = color.hex8;
                        this.seldataTree[i].tciconcolor = color.hex8;
                        // this.$set(this.seldataTree, i, this.seldataTree[i]);
                        let obj = this.seldataTree[i];
                         this.$set(this.seldataTree,i,
                        {
                            colorShow:obj.colorShow,
                            bkcolor:obj.bkcolor,
                            borderShow:obj.borderShow,
                            className:obj.className,
                            tciconcolor:color.hex8,
                            bkiconcolor:obj.bkiconcolor,
                            id:obj.id,
                            jx:obj.jx,
                            label:obj.label,
                            tccolor:color.hex8,
                            value:obj.value,
                            tcvector:obj.tcvector,
                            bkvector:obj.bkvector,
                            width:obj.width
                        });
                        // obj["tccolor"] = color.hex8;
                    }
                }
                // this.bkcolor = 'rgba(255,255,255,1)';
                console.log("this.seldataTree",this.seldataTree);
                // this.tcColorAdd('tc');
            },
            borderValueChange(color){
                this.bkcolor = color.hex8;
                for(let i in this.seldataTree){
                    if(this.seltcid === this.seldataTree[i].id){
                        this.seldataTree[i].bkcolor = color.hex8;
                        this.seldataTree[i].bkiconcolor = color.hex8;
                        // this.seldataTree[i].width = this.widthinput;
                        // this.$set(this.seldataTree, i, this.seldataTree[i]);
                        let obj = this.seldataTree[i];
                         this.$set(this.seldataTree,i,
                        {
                            colorShow:obj.colorShow,
                            bkcolor:color.hex8,
                            borderShow:obj.borderShow,
                            className:obj.className,
                            tciconcolor:obj.tciconcolor,
                            bkiconcolor:color.hex8,
                            id:obj.id,
                            jx:obj.jx,
                            label:obj.label,
                            tccolor:obj.tccolor,
                            value:obj.value,
                            tcvector:obj.tcvector,
                            bkvector:obj.bkvector,
                            width:obj.width
                        });
                        // let obj = this.seldataTree[i];
                        // obj["bkcolor"] = color.hex8;
                        // obj["width"] = this.widthinput;
                    }
                }
                // this.tccolor = 'rgba(255,255,255,1)';
                // this.tcColorAdd('bk');
            },
            headleChangeColor(color){
                console.log("color",color);
            },
            handleDragStart(node, ev) {
                console.log('drag start', node);
            },
            handleDragEnter(draggingNode, dropNode, ev) {
                console.log('tree drag enter: ', dropNode.label);
            },
            handleDragLeave(draggingNode, dropNode, ev) {
                console.log('tree drag leave: ', dropNode.label);
            },
            handleDragOver(draggingNode, dropNode, ev) {
                console.log('tree drag over: ', dropNode.label);
            },
            handleDragEnd(draggingNode, dropNode, dropType, ev) {
                console.log('tree drag end: ', dropNode && dropNode.label, dropType);
            },
            handleDrop(draggingNode, dropNode, dropType, ev) {
                this.dragtype = dropType;
                console.log('tree drop: ', dropNode.label, dropType);
            },
            allowDrop(draggingNode, dropNode, type) {
                
                if(type !== 'inner'){
                    return true;
                } else {
                    return false;
                }
                // if (draggingNode.data.level === dropNode.data.level) {
                //     if (draggingNode.data.aboveId === dropNode.data.aboveId) {
                //     return type === 'prev' || type === 'next'
                //     }
                // } else {
                //     // 不同级进行处理
                //     return false
                // } 

            },
            allowDrag(draggingNode) {
                // console.log('tuotutotuot');
                // if(this.dragtype === 'inner'){
                //     return;
                // } else {
                    return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
                // }
            },
            setActiveItem(index) {
                this.$refs.carousel.setActiveItem(index);
            },
            changePhoto(key1, key2) {
                // this.map.removeLayer(this.selploygonLayer);
                // this.map.removeLayer(this.cliploygonLayer);
                if (this.cliploygonLayer.length > 0) {
                    for (let i in this.cliploygonLayer) {
                        this.map.removeLayer(this.cliploygonLayer[i]);
                    }
                }
                if (this.selploygonLayer.length > 0) {
                    for (let i in this.selploygonLayer) {
                        this.map.removeLayer(this.selploygonLayer[i]);
                    }
                }
                this.selectedFeatures.clear();
                let that = this;
                this.clickphotoFlag = true;
                this.map.removeLayer(this.endvectorlayer);
                let route = /** @type {import("../src/ol/geom/LineString.js").default} */ (new Polyline({
                    factor: 1e6,
                }).readGeometry(this.allFeature[key1], {
                    dataProjection: 'EPSG:4524',
                    featureProjection: 'EPSG:4524',
                }));
                let routeCoords = route.getCoordinates();
                let endpoint = this.allFeature[key1].getGeometry().flatCoordinates;
                this.testfu(endpoint);
                for (let i in this.allarrpoint) {
                    if (this.allarrpoint[i][0][0] === endpoint[0] && this.allarrpoint[i][3][0] === endpoint[2]) {
                        let geojsonObject = {
                            'type': 'FeatureCollection',
                            'crs': {
                                'type': 'name',
                                'properties': {
                                    'name': 'EPSG:4524',
                                },
                            },
                            'features': [{
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Polygon',
                                    'coordinates': [this.allarrpoint[i]],
                                },
                            }]
                        };
                        let source = new VectorSource({
                            features: new GeoJSON().readFeatures(geojsonObject),
                        });
                        let styles = [
                            new Style({
                                stroke: new Stroke({
                                    color: 'red',
                                    width: 2,
                                }),
                                fill: new Fill({
                                    color: 'rgba(213,250,143,0.1)',
                                }),
                            })
                        ]
                        let cliploygonLayer = new VectorLayer({
                            source: source,
                            style: styles,
                        });
                        this.cliploygonLayer.push(cliploygonLayer);
                        that.map.addLayer(cliploygonLayer);
                    }
                }
                that.map.getView().setZoom(11);
            },
            testfu(endpoint) {
                this.map.getView().setCenter([endpoint[2], endpoint[3]]);
            },
            defaultProps() {

            },
            exportShp() {
                if (this.allNode.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请先选择图层',
                        type: 'warning'
                    });
                }
                for (let i in this.allNode) {
                    let fileName = this.allNode[i].label;
                    let fileJx = this.allNode[i].jx;
                    let url =
                        this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebGisdl:' +
                        fileJx + '&outputFormat=SHAPE-ZIP';
                    axios({
                        method: 'GET',
                        url: url,
                        params: {
                            // reportRuleId: row.reportRuleId
                        },
                        responseType: 'blob'
                    }).then(response => {
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
                console.log("clicklll",node);
                this.allNode = this.$refs.tree.getCheckedNodes();
                this.addMapLayer(node.jx, node.value);
                if (node.children === undefined && node.value === 0) {
                    node.value = 1;
                    this.addchecklayer = node;
                    let obj = this.addchecklayer;
                    console.log("obj",obj);
                    obj["tciconcolor"] = "gray";
                    obj["bkiconcolor"] = "gray";
                    obj["tcvector"] = [];
                    obj["bkvector"] = [];
                    obj["tccolor"] = 'rgba(255,255,255,1)';
                    obj["bkcolor"] = 'rgba(255,255,255,1)';
                    obj["width"] = '';
                    obj["colorShow"] = false;
                    obj["borderShow"] = false;
                    this.seldataTree.unshift(obj);
                } else if(node.children === undefined && node.value === 1){
                    node.value = 0;
                    this.removechecklayer = node;
                    let arr = [];
                    for(let i in this.seldataTree){
                        if(node.jx !== this.seldataTree[i].jx){
                            arr.push(this.seldataTree[i]);
                        }
                    }
                    this.seldataTree = arr;
                }
            },
            handleNodeClick(data) {
                console.log(data);
                this.seltclayer = data.jx;
                this.seltcid = data.id;
            },
            conNodeClick(data){
                console.log("click",data);
            },
            bkColorAdd(){
                let width,bkcolor;
                for(let i in this.seldataTree){
                    if(this.seltcid === this.seldataTree[i].id){
                        if(this.seldataTree[i].width === 0 || this.seldataTree[i].width === ''){
                            this.$message({
                                message: '请输入一个边框宽度值',
                                type: 'warning'
                            });
                            return;
                        } else {
                            this.seldataTree[i].borderShow = false;
                            this.$set(this.seldataTree, i, this.seldataTree[i]);
                            width = this.seldataTree[i].width;
                            bkcolor = this.seldataTree[i].bkcolor;
                        }
                    }
                }
                console.log("this.seldataTree",this.seldataTree);
                this.tcColorAdd('bk',width,bkcolor,'rgba(0,0,0,0)');
            },
            bkColorCancel(){
                for(let i in this.seldataTree){
                    if(this.seltcid === this.seldataTree[i].id){
                        this.seldataTree[i].borderShow = false;
                        this.$set(this.seldataTree, i, this.seldataTree[i]);
                    }
                }
            },
            tcColorCancel(){
                for(let i in this.seldataTree){
                    if(this.seltcid === this.seldataTree[i].id){
                        this.seldataTree[i].colorShow = false;
                        this.$set(this.seldataTree, i, this.seldataTree[i]);
                    }
                }
            },
            tcColorAdd(type,width,bkcolor,tccolor){
                if(this.seltclayer === 'dltb' || this.seltclayer === 'pdt'){
                    if(this.mapzoom < 5){
                        this.$message({
                            message: '请滑动鼠标到5或者5以上的层级',
                            type: 'warning'
                        })
                        return;
                    }   
                }
                if(type === 'tc'){
                    let selvector = [],dellayer = [],remainlayer = [];
                    for(let i in this.seldataTree){
                        if(this.seltcid === this.seldataTree[i].id){
                            this.seldataTree[i].colorShow = false;
                            this.$set(this.seldataTree, i, this.seldataTree[i]);
                            selvector = this.seldataTree[i].tcvector;
                        }
                    }
                    if(selvector.length > 0){
                        this.map.removeLayer(selvector[0]);
                    }
                    // let test = this.map.getLayers();
                    // for(let i in selvector){
                    //     if(selvector[i].layer.style_.fill_.color !== 'rgba(255,255,255,1)'){
                    //         dellayer.push(selvector[i].layer);
                    //     } else {
                    //         remainlayer.push(selvector[i].layer);
                    //     }
                    // }
                    // if(dellayer.length > 0){
                    //     for(let i in dellayer){
                    //         this.map.removeLayer(dellayer[i]);
                    //     }
                    // }
                    for(let i in this.seldataTree){
                        if(this.seltcid === this.seldataTree[i].id){
                            this.seldataTree[i].tcvector = [];
                            this.$set(this.seldataTree, i, this.seldataTree[i]);
                        }
                    }
                } else if (type === 'bk'){
                    let selvector = [],dellayer = [],remainlayer = [];
                    for(let i in this.seldataTree){
                        if(this.seltcid === this.seldataTree[i].id){
                            selvector = this.seldataTree[i].bkvector;
                        }
                    }
                    if(selvector.length > 0){
                        this.map.removeLayer(selvector[0]);
                    }
                    // for(let i in selvector){
                    //     if(selvector[i].layer.style_.stroke_.color_ !== 'rgba(255,255,255,1)' || selvector[i].layer.style_.stroke_.width_ !== ''){
                    //         dellayer.push(selvector[i].layer);
                    //     } else {
                    //         remainlayer.push(selvector[i].layer);
                    //     }
                    // }
                    // if(dellayer.length > 0){
                    //     for(let i in dellayer){
                    //         this.map.removeLayer(dellayer[i]);
                    //     }
                    // }
                    for(let i in this.seldataTree){
                        if(this.seltcid === this.seldataTree[i].id){
                            this.seldataTree[i].bkvector = [];
                            this.$set(this.seldataTree, i, this.seldataTree[i]);
                        }
                    }
                }
                // this.map.removeLayer(this.tcLayer);
                let that = this;
                let test = this.map.getLayers();
                console.log("test",test);
                let url;
                let extend = that.map.getView().calculateExtent(that.map.getSize());
                that.selectextent = this.selectExtent(extend);
                if(that.seltclayer === 'dltb' || that.seltclayer === 'pdt'){
                    url = this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebGisdl%3A'+that.seltclayer+'%20&outputFormat=application%2Fjson%20&filter=%20%3CFilter%20xmlns=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%20%3CIntersects%3E%20%3CPropertyName%3Eshape%3C/PropertyName%3E%20%3Cgml:Polygon%3E%20%3Cgml:outerBoundaryIs%3E%20%3Cgml:LinearRing%3E%20%3Cgml:coordinates%3E' +
                        this.selectextent +
                        '%3C/gml:coordinates%3E%20%3C/gml:LinearRing%3E%20%3C/gml:outerBoundaryIs%3E%20%3C/gml:Polygon%3E%20%3C/Intersects%3E%20%3C/Filter%3E';
                } else {
                    url = this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebGisdl%3A'+that.seltclayer+'%20&outputFormat=application%2Fjson';
                }
                this.tcVectorSource= new VectorSource({
                    format: new GeoJSON(),
                    url:url,
                    strategy: bbox,
                    overlaps:false
                    // filter: new Intersects('draw',test)
                });
                //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                let tcLayer = new VectorLayer({
                    source: that.tcVectorSource,
                    style: new Style({
                        fill: new Fill({ //矢量图层填充颜色，以及透明度
                            color: tccolor
                        }),
                        stroke: new Stroke({
                            color: bkcolor,
                            width: width
                        })
                    }),
                    visible: true
                });
                for(let i in this.seldataTree){
                    if(this.seltclayer === this.seldataTree[i].jx){
                        // let obj = this.seldataTree[i];
                        // this.seldataTree[i].vector.push(this.tcLayer);
                        // this.tcLayer.push(obj);
                        if(type === 'tc'){
                            this.seldataTree[i].tcvector.push(tcLayer);
                        } else if(type === 'bk'){
                            this.seldataTree[i].bkvector.push(tcLayer);
                        }
                        this.$set(this.seldataTree, i, this.seldataTree[i]);
                    }
                }
                this.map.addLayer(tcLayer);
                let layers = this.map.getLayers();
                console.log("layers",layers);
                for(let i in layers.array_){
                    if(layers.array_[i].type === 'TILE'){
                        let name = layers.array_[i].values_.source.params_.LAYERS;
                        console.log("name");
                        console.log("this.seltclayer",this.seltclayer);
                        if(name.substring(9,name.length) === this.seltclayer){
                            layers.array_[i].setVisible(false);
                        }
                    }
                }
            },
            selgetCheckedKeys(node) {
                let lll = this.$refs.seltree.getCheckedNodes();
                console.log("node",lll);
            },
            clearvectorlayer(type) {
                this.arraddlayer = [];
                let arrlayers = this.map.getLayers();
                console.log("arrlayers",arrlayers);
                // return;
                let dellayer = [],dellayertile = [];
                if(type === 'VECTOR'){
                    for (let i in arrlayers.array_) {
                        if (arrlayers.array_[i].type === type) {
                            dellayer.push(arrlayers.array_[i]);
                        }
                    }
                    for (let i in dellayer) {
                        this.map.removeLayer(dellayer[i]);
                    }
                } else if(type === 'TILE'){
                    for (let i in arrlayers.array_) {
                        if (arrlayers.array_[i].type === 'VECTOR') {
                            dellayer.push(arrlayers.array_[i]);
                        }
                    }
                    for (let i in dellayer) {
                        this.map.removeLayer(dellayer[i]);
                    }
                    let arrsellayername = [];
                    let len = this.seldataTree.length;
                    let arrlen = arrlayers.array_.length;
                    let arrsellayer = arrlayers.array_;
                    console.log("arrsellayer",arrsellayer);
                    for(let j in arrlayers.array_){
                        let sellayername = arrlayers.array_[j].values_.source.params_.LAYERS;
                        let sellen = sellayername.length;
                        let selname = sellayername.substring(9,sellen);
                        arrsellayername.push(selname);
                    }
                    console.log("arrsellayername",arrsellayername);
                    for(let i = len-1 ;i >= 0;i--){
                        console.log("lla",this.seldataTree[i].jx);
                        if(arrsellayername.includes(this.seldataTree[i].jx) === true){
                            this.addselLayer(this.seldataTree[i],arrsellayer);
                        } 
                        // else{
                        //     this.addMapLayer(this.seldataTree[i].jx, 0);
                        // }
                    }
                    let afterlayers = this.map.getLayers().array_;
                    for(let i = 0;i < arrlen;i++){
                        dellayertile.push(afterlayers[i]);
                        // this.map.removeLayer();
                    }
                    for (let i in dellayertile) {
                        this.map.removeLayer(dellayertile[i]);
                    }
                    console.log("this.arraddlayer",this.arraddlayer)
                    for(let i in this.arraddlayer){
                        this.map.addLayer(this.arraddlayer[i]);
                    }
                    console.log("afterlayers",afterlayers);
                }
            },
            addselLayer(layer,arrsellayer){
                for(let i in arrsellayer){
                    let sellayername = arrsellayer[i].values_.source.params_.LAYERS;
                    let sellen = sellayername.length;
                    let selname = sellayername.substring(9,sellen);
                    if(selname === layer.jx){
                        this.arraddlayer.push(arrsellayer[i]);
                        this.addselvector(selname);
                        // this.map.removeLayer(arrsellayer[i]);
                        // this.map.addLayer(arrsellayer[i]);
                    }
                }
                console.log(" this.arraddlayer", this.arraddlayer);
            },
            addselvector(layer){
                console.log("this.seldatatress",this.seldataTree);
                let selvectorlayer = [],selvectorlayer1 = [];
                for(let i in this.seldataTree){
                    if(layer === this.seldataTree[i].jx){
                        if(this.seldataTree[i].tcvector.length > 0){
                            selvectorlayer = this.seldataTree[i].tcvector;
                        }
                        if(this.seldataTree[i].bkvector.length > 0){
                            selvectorlayer1 = this.seldataTree[i].bkvector;
                        }
                    }
                }
                console.log("selvectorlayer",selvectorlayer);
                console.log("this.seldataTree",this.seldataTree);
                // for(let i in selvectorlayer){
                    if(selvectorlayer.length > 0){
                        this.arraddlayer.push(selvectorlayer[0]);
                    }
                    if(selvectorlayer1.length > 0){
                        this.arraddlayer.push(selvectorlayer1[0]);
                    }
                // }
            },
            addMapLayer(layer, value) {
                this.clearvectorlayer('VECTOR');
                this.photoShow = false;
                this.allFormData = [];
                this.featableShow = false;
                this.map.removeLayer(this.wfsVectorLayer);
                let layerName = 'WebGisdl:' + layer;
                this.allLayer = [];
                let style;
                let extend = [36365558.9724, 3333897.2863, 36374903.276, 3373469.3127]; //BBOX范围值
                let style1 = new Style({
                            fill: new Fill({ //矢量图层填充颜色，以及透明度
                                color: 'blue'
                            }),
                            stroke: new Stroke({
                                color: 'red',
                                width: 2
                            })
                        });
                let selectlayer =
                    new TileLayer({
                        //extent:extent, //可注释
                        source: new TileWMS({
                            url: this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms',
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
                        }),
                        extent: this.extent
                    });

                if (value === 0) {
                    this.currentLayer.push(layer);
                    this.map.addLayer(selectlayer);
                    // this.defaultStyleAdd(layer,1,'blue','red');
                    let that = this;
                    this.map.on('click', function (e) {
                        that.allFormData = [];
                        let coor1 = e.coordinate;
                        let coor = coor1.join(',');
                        let index = that.allNode.length - 1;
                        let len = that.currentLayer.length;
                        if (that.allNode.length > 1 && that.currentLayer[len - 1] !== '511681jzzp') {
                            that.feaClick(coor, layer,layer);
                        }
                    })
                    if (layer === '511681jzzp') {
                        this.jzphotoShow = true;
                    }
                } else {
                    if (layer === '511681jzzp') {
                        this.jzphotoShow = false;
                    }
                    for (let i in this.currentLayer) {
                        if (layer === this.currentLayer[i]) {
                            this.currentLayer.splice(i, 1);
                        }
                    }
                    let arrLayer = this.map.getLayers().array_;
                    console.log("lvlvlvlvl",arrLayer);
                    console.log("layerName",layerName);
                    for (let i in arrLayer) {
                        let delLayer = arrLayer[i].values_.source.params_.LAYERS;
                        if (delLayer === layerName) {
                            this.map.removeLayer(arrLayer[i]);
                        }
                    }
                    let arrLayer1 = this.map.getLayers().array_;
                    console.log("lvlvlvlvl",arrLayer1);
                    return;

                }
            },
            defaultStyleAdd(layer,width,tccolor,bkcolor){
                console.log("layervcsduvbhjsdb",layer);
                let tcVectorSource= new VectorSource({
                    format: new GeoJSON(),
                    url:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebGisdl%3A'+layer+'%20&outputFormat=application%2Fjson',
                    strategy: bbox,
                    overlaps:false
                    // filter: new Intersects('draw',test)
                });
                //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                let tcLayer = new VectorLayer({
                    source: tcVectorSource,
                    style: new Style({
                        fill: new Fill({ //矢量图层填充颜色，以及透明度
                            color: tccolor
                        }),
                        stroke: new Stroke({
                            color: bkcolor,
                            width: width
                        })
                    }),
                    visible: true
                });
                console.log('testllll',tcLayer);
                this.map.addLayer(tcLayer);
                let test = this.map.getLayers();
            },
            jzPhoto() {
                this.clearvectorlayer('VECTOR');
                this.photoShow = true;
                proj4.defs("EPSG:4524",
                    "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
                register(proj4);
                let that = this;
                let extend = that.map.getView().calculateExtent(that.map.getSize());
                that.selectextent = this.selectExtent(extend);
                if(this.mapzoom < 7){
                    this.$message({
                        message: '请滚动鼠标层级放大到7及7以上',
                        type: 'warning'
                    });
                } else {
                    that.requestFeature();
                }
            },
            selectExtent(extend) {
                let arr = [],
                    arr1 = [];
                arr.push([extend[0], extend[1]]);
                arr.push([extend[2], extend[1]]);
                arr.push([extend[2], extend[3]]);
                arr.push([extend[0], extend[3]]);
                arr.push([extend[0], extend[1]]);
                arr1.push(arr);
                let result;
                for (let i in arr1) {
                    result = arr1[i].join('%20');
                }
                return result;
            },
            requestFeature() {
                // console.log("请求要素");
                this.Feature = [];
                this.polygonPoints = [];
                this.requestVectorSource = new VectorSource({
                    format: new GeoJSON(),
                    url: this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebGisdl%3A511681jzzp%20&outputFormat=application%2Fjson%20&filter=%20%3CFilter%20xmlns=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%20%3CIntersects%3E%20%3CPropertyName%3Eshape%3C/PropertyName%3E%20%3Cgml:Polygon%3E%20%3Cgml:outerBoundaryIs%3E%20%3Cgml:LinearRing%3E%20%3Cgml:coordinates%3E' +
                        this.selectextent +
                        '%3C/gml:coordinates%3E%20%3C/gml:LinearRing%3E%20%3C/gml:outerBoundaryIs%3E%20%3C/gml:Polygon%3E%20%3C/Intersects%3E%20%3C/Filter%3E',
                    strategy: bbox,
                    // features:[iconFeature]
                    // filter: new Intersects('draw',test)
                });
                let that = this;
                let styleFunction = function (feature) {
                    // console.log("feature",feature);
                    let geometry = feature.getGeometry();
                    // console.log("geometry",geometry);
                    let styles = [
                        // linestring
                        new Style({
                            stroke: new Stroke({
                                color: 'orange',
                                width: 2
                            })
                        })
                    ];
                    let linePoints = feature.getGeometry().getCoordinates();
                    // console.log("linePoints",linePoints);
                    let arrpoint = geometry.flatCoordinates;
                    drawarrowtest([arrpoint[0], arrpoint[1]], [arrpoint[2], arrpoint[3]]);
                    function drawarrowtest(start, end) {
                        // console.log("start",start);
                        // console.log("end",end);
                        // geometry.forEachSegment(function (start, end) {
                        let dx = end[0] - start[0];
                        let dy = end[1] - start[1];
                        let rotation = Math.atan2(dy, dx);
                        // console.log("rotationora",rotation);
                        let lineStr1 = new LineString([end, [end[0] - 3, end[1] + 3]]);
                        lineStr1.rotate(rotation, end);
                        let lineStr2 = new LineString([end, [end[0] - 3, end[1] - 3]]);
                        lineStr2.rotate(rotation, end);
                        // that.polygonPoints = [start,[end[0] - 2, end[1] + 2],end,[end[0] - 2, end[1] - 2],start];
                        // that.polygonPoints.push([start,end]);
                        // that.polygonPoints = [start,end];
                        that.polygonPoints.push([start, end]);
                        // console.log("that.polygonPoints",that.polygonPoints);
                        let stroke = new Stroke({
                            color: 'green',
                            width: 1
                        });
                        // console.log("that.polygonPoints",that.polygonPoints);
                        // styles.push(new Style({
                        //     stroke: new Stroke({
                        //         color: 'blue',
                        //         width: 8
                        //     })
                        // }));
                        // styles.push(new Style({
                        //     geometry: lineStr1,
                        //     stroke: stroke
                        // }));
                        // styles.push(new Style({
                        //     geometry: lineStr2,
                        //     stroke: stroke
                        // }));
                        // styles.push(new Style({
                        //     geometry: lineStr3,
                        //     stroke: stroke
                        // }));

                    };
                    // console.log("styles",styles);
                    return styles;
                };
                //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                this.requestLayer = new VectorLayer({
                    source: this.requestVectorSource,
                    style: styleFunction,
                    visible: true
                });
                setTimeout(function () {
                    that.addJzzpText();
                    that.drawClickArrow();
                }, 100)
                this.map.addLayer(this.requestLayer);
            },
            drawClickArrow() {
                console.log("画箭头");
                let roundRect = function (x, y, w, h, r) {
                    if (w < 2 * r) r = w / 2;
                    if (h < 2 * r) r = h / 2;
                    this.beginPath();
                    this.moveTo(x + r, y);
                    this.arcTo(x + w, y, x + w, y + h, r);
                    this.arcTo(x + w, y + h, x, y + h, r);
                    this.arcTo(x, y + h, x, y, r);
                    this.arcTo(x, y, x + w, y, r);
                    this.closePath();
                    this.fillStyle = "rgba(108,159,67,1)";
                    this.fill();
                    return this;
                }
                let polygonVertex = [],
                    rotation = '',
                    feature1 = '',
                    stopPoint, beginPoint,
                    CONST = {
                        edgeLen: 100,
                        angle: 15
                    };
                let canvas = document.createElement("canvas"); //创建一个canvas标签
                canvas.width = 100;
                canvas.height = 100;

                //封装的作图对象
                let Plot = {
                    angle: "",
                    //在CONST中定义的edgeLen以及angle参数
                    //短距离画箭头的时候会出现箭头头部过大，修改：
                    dynArrowSize: function () {
                        var x = stopPoint.x - beginPoint.x,
                            y = stopPoint.y - beginPoint.y,
                            length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                        if (length < 250) {
                            CONST.edgeLen = CONST.edgeLen / 7;
                            CONST.angle = CONST.angle * 2;
                        } else if (length < 500) {
                            CONST.edgeLen = CONST.edgeLen * length / 500;
                            CONST.angle = CONST.angle * length / 500;
                        }
                        // console.log(length);
                    },

                    //getRadian 返回以起点与X轴之间的夹角角度值
                    getRadian: function (beginPoint, stopPoint) {
                        Plot.angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math
                            .PI * 180;
                        paraDef(50, 25);
                        Plot.dynArrowSize();
                    },

                    ///获得箭头底边两个点
                    arrowCoord: function (beginPoint, stopPoint) {
                        polygonVertex[0] = beginPoint.x;
                        polygonVertex[1] = beginPoint.y;
                        polygonVertex[6] = stopPoint.x;
                        polygonVertex[7] = stopPoint.y;
                        Plot.getRadian(beginPoint, stopPoint);
                        polygonVertex[8] = stopPoint.x - CONST.edgeLen / 1.5 * Math.cos(Math.PI / 180 * (Plot
                            .angle + CONST.angle / 2));
                        polygonVertex[9] = stopPoint.y - CONST.edgeLen / 1.5 * Math.sin(Math.PI / 180 * (Plot
                            .angle + CONST.angle / 2));
                        polygonVertex[4] = stopPoint.x - CONST.edgeLen / 1.5 * Math.cos(Math.PI / 180 * (Plot
                            .angle - CONST.angle / 2));
                        polygonVertex[5] = stopPoint.y - CONST.edgeLen / 1.5 * Math.sin(Math.PI / 180 * (Plot
                            .angle - CONST.angle / 2));
                        polygonVertex[14] = stopPoint.x - CONST.edgeLen * 7 / 2 * Math.cos(Math.PI / 180 * (Plot
                            .angle + CONST.angle / 4));
                        polygonVertex[15] = stopPoint.y - CONST.edgeLen * 7 / 2 * Math.sin(Math.PI / 180 * (Plot
                            .angle + CONST.angle / 4));
                        polygonVertex[12] = stopPoint.x - CONST.edgeLen * 7 / 2 * Math.cos(Math.PI / 180 * (Plot
                            .angle - CONST.angle / 4));
                        polygonVertex[13] = stopPoint.y - CONST.edgeLen * 7 / 2 * Math.sin(Math.PI / 180 * (Plot
                            .angle - CONST.angle / 4));
                    },
                    //获取另两个底边侧面点
                    sideCoord: function () {
                        let midpoint = {};
                        // midpoint.x = polygonVertex[6] - (CONST.edgeLen * Math.cos(Plot.angle * Math.PI / 180));
                        // midpoint.y = polygonVertex[7] - (CONST.edgeLen * Math.sin(Plot.angle * Math.PI / 180));
                        midpoint.x = (polygonVertex[4] + polygonVertex[8]) / 2;
                        midpoint.y = (polygonVertex[5] + polygonVertex[9]) / 2;
                        polygonVertex[2] = (polygonVertex[4] + midpoint.x) / 2;
                        polygonVertex[3] = (polygonVertex[5] + midpoint.y) / 2;
                        polygonVertex[10] = (polygonVertex[8] + midpoint.x) / 2;
                        polygonVertex[11] = (polygonVertex[9] + midpoint.y) / 2;
                        let midpoint1 = {};
                        // midpoint.x = polygonVertex[6] - (CONST.edgeLen * Math.cos(Plot.angle * Math.PI / 180));
                        // midpoint.y = polygonVertex[7] - (CONST.edgeLen * Math.sin(Plot.angle * Math.PI / 180));
                        midpoint1.x = (polygonVertex[12] + polygonVertex[14]) / 2;
                        midpoint1.y = (polygonVertex[13] + polygonVertex[15]) / 2;
                        polygonVertex[16] = (polygonVertex[12] + midpoint1.x) / 2;
                        polygonVertex[17] = (polygonVertex[13] + midpoint1.y) / 2;
                        polygonVertex[18] = (polygonVertex[14] + midpoint1.x) / 2;
                        polygonVertex[19] = (polygonVertex[15] + midpoint1.y) / 2;
                    },

                    //画箭头
                    drawArrow: function () {
                        // console.log("polygonVertex",polygonVertex);
                        // let ctx;
                        // ctx = $(".drawArrow")[0].getContext('2d');
                        let ctx = canvas.getContext("2d");
                        ctx.beginPath();
                        ctx.moveTo(polygonVertex[0], polygonVertex[1]);
                        ctx.lineTo(polygonVertex[2], polygonVertex[3]);
                        // ctx.lineTo(polygonVertex[4], polygonVertex[5]);
                        ctx.lineTo(polygonVertex[6], polygonVertex[7]);
                        // ctx.lineTo(polygonVertex[8], polygonVertex[9]);
                        ctx.lineTo(polygonVertex[10], polygonVertex[11]);
                        ctx.lineTo(polygonVertex[0], polygonVertex[1]);
                        ctx.closePath();
                        ctx.fillStyle = 'red';
                        ctx.fill();
                    }
                };
                for (let i in this.polygonPoints) {
                    let point = this.polygonPoints[i]
                    beginPoint = {
                            x: point[0][0],
                            y: point[0][1]
                        },
                        stopPoint = {
                            x: point[1][0],
                            y: point[1][1]
                        };
                    this.vector1 = new VectorLayer({
                        source: new VectorSource()
                    });
                    feature1 = new Feature({
                        geometry: new Point(point[1])
                    });
                    let dx = point[1][0] - point[0][0];
                    let dy = point[1][1] - point[0][1];
                    rotation = Math.atan(dx / dy);
                    Plot.arrowCoord(beginPoint, stopPoint);
                    Plot.sideCoord();
                    Plot.drawArrow();
                    let style = new Style({
                        image: new Icon({
                            img: canvas,
                            imgSize: [canvas.width, canvas.height],
                            rotation: rotation,
                            // scale:2
                        }),
                        // text: new Text({
                        //     text: "我是圆角矩形",
                        //     font: "12px 微软雅黑",
                        //     fill: new Fill({ color: "#ffffff" })
                        // })
                    });
                    feature1.setStyle(style);
                    this.vector1.getSource().addFeature(feature1);
                    this.map.addLayer(this.vector1);
                    let arrpoint = [];
                    arrpoint.push([polygonVertex[0], polygonVertex[1]]);
                    // arrpoint.push([polygonVertex[16], polygonVertex[17]]);
                    arrpoint.push([polygonVertex[2], polygonVertex[3]]);
                    arrpoint.push([polygonVertex[4], polygonVertex[5]]);
                    arrpoint.push([polygonVertex[6], polygonVertex[7]]);
                    arrpoint.push([polygonVertex[8], polygonVertex[9]]);
                    arrpoint.push([polygonVertex[10], polygonVertex[11]]);
                    // arrpoint.push([polygonVertex[18], polygonVertex[19]]);
                    arrpoint.push([polygonVertex[0], polygonVertex[1]]);
                    // arrpoint.push([polygonVertex[0], polygonVertex[1]]);
                    this.allarrpoint.push(arrpoint);
                    let geojsonObject = {
                        'type': 'FeatureCollection',
                        'crs': {
                            'type': 'name',
                            'properties': {
                                'name': 'EPSG:4524',
                            },
                        },
                        'features': [{
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Polygon',
                                'coordinates': [arrpoint],
                            },
                        }]
                    };
                    let source = new VectorSource({
                        features: new GeoJSON().readFeatures(geojsonObject),
                    });
                    let styles = [
                        new Style({
                            stroke: new Stroke({
                                color: 'orange',
                                width: 2,
                            }),
                            fill: new Fill({
                                color: 'rgba(213,250,143,0.3)',
                            }),
                        })
                    ]
                    this.ploygonLayer = new VectorLayer({
                        source: source,
                        style: styles,
                    });
                    this.map.addLayer(this.ploygonLayer);
                }
                function paraDef(edgeLen, angle) {
                    CONST.edgeLen = edgeLen;
                    CONST.angle = angle;
                }
                let select = new Select();
                this.map.addInteraction(select);
                this.selectedFeatures = select.getFeatures();
                let that = this;
                this.selectedFeatures.on(['add', 'remove'], function (feature) {
                    let names = that.selectedFeatures.getArray().map(function (feature) {
                        return feature.get('name');
                    });
                    that.selectedFeatures.clear();
                    let clickFea = feature.element.values_.geometry.flatCoordinates;
                    for (let i in that.allFeature) {
                        let selectFea = that.allFeature[i].getGeometry().flatCoordinates;
                        if (selectFea[0] === clickFea[0] && selectFea[2] === clickFea[6]) {
                            // console.log("selectFea[0]", selectFea[0]);
                            that.setActiveItem(i);
                        }
                    }
                    let arrpoint1 = [];
                    for (let i = 0; i < clickFea.length; i = i + 2) {
                        let point = [clickFea[i], clickFea[i + 1]];
                        arrpoint1.push(point);
                    }
                    if (that.cliploygonLayer.length > 0) {
                        for (let i in that.cliploygonLayer) {
                            that.map.removeLayer(that.cliploygonLayer[i]);
                        }
                    }
                    if (that.selploygonLayer.length > 0) {
                        for (let i in that.selploygonLayer) {
                            that.map.removeLayer(that.selploygonLayer[i]);
                        }
                    }
                    let geojsonObject = {
                        'type': 'FeatureCollection',
                        'crs': {
                            'type': 'name',
                            'properties': {
                                'name': 'EPSG:4524',
                            },
                        },
                        'features': [{
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Polygon',
                                'coordinates': [arrpoint1],
                            },
                        }]
                    };
                    let source = new VectorSource({
                        features: new GeoJSON().readFeatures(geojsonObject),
                    });
                    let styles = [
                        new Style({
                            stroke: new Stroke({
                                color: 'red',
                                width: 2,
                            }),
                            fill: new Fill({
                                color: 'rgba(213,250,143,0.1)',
                            }),
                        })
                    ]
                    let selploygonLayer = new VectorLayer({
                        source: source,
                        style: styles,
                    });
                    that.selploygonLayer.push(selploygonLayer);
                    that.map.addLayer(selploygonLayer);
                });
            },
            addJzzpText() {
                this.photodata = [];
                this.allphotodata = [];
                this.allFeature = [];
                let lonlat = this.requestVectorSource.idIndex_;
                for (let item in lonlat) {
                    this.allFeature.push(lonlat[item]);
                    let testpoint = lonlat[item].values_;
                    let point = [testpoint.longi, testpoint.latit];
                    let obj = {
                        time: testpoint.pssj,
                        url: testpoint.zp
                    }
                    this.photodata.push(obj);
                    this.allphotodata.push(lonlat[item]);
                }
            },
            getLayer(Point, map) {
                var layers = map.getLayers();
                for (var i = 0; i < layers.length; i++) {
                    var source = layers[i].getSource();
                    if (source instanceof ol.source.Vector) {
                        var features = source.getFeatures();
                        if (features.length > 0) {
                            for (var j = 0; j < features.length; j++) {
                                if (features[j].getGeometry().getType() == "LineString") {
                                    var Line = features[j];
                                    var Points = Line.getGeometry().getCoordinates();
                                    for (var k = 0; k < Points.length; k++) {
                                        var p = Point.getGeometry().getLastCoordinate();
                                        if (Points[k][0] == p[0] && Points[k][1] == p[1]) {
                                            return Line;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return null;
            },
            feaClick(coor, layername, name) {
                if (layername !== '511681jzzp') {
                    this.map.removeLayer(this.wfsVectorLayer);
                    let wfsVectorSource = new VectorSource({
                        format: new GeoJSON(),
                        url: this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/ows?service=WFS&version=1.0.0%20&request=GetFeature%20&typeName=WebGisdl:' +
                            layername +
                            '%20&outputFormat=application%2Fjson%20&filter=%20%3CFilter%20xmlns=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%20%3CIntersects%3E%20%3CPropertyName%3Eshape%3C/PropertyName%3E%20%3Cgml:Point%3E%20%3Cgml:coordinates%3E' +
                            coor +
                            '%3C/gml:coordinates%3E%20%3C/gml:Point%3E%20%3C/Intersects%3E%20%3C/Filter%3E',
                        projection: 'EPSG:4524',
                        // filter: new Intersects('draw',test)
                    });
                    //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                    this.wfsVectorLayer = new VectorLayer({
                        source: wfsVectorSource,
                        style: new Style({
                            fill: new Fill({ //矢量图层填充颜色，以及透明度
                                color: 'rgba(28, 124, 197, 0.5)'
                            }),
                            // stroke: new Stroke({
                            //     color: 'rgba(28, 124, 197, 0.7)',
                            //     width: 4
                            // })
                        }),
                        visible: true
                    });
                    this.map.addLayer(this.wfsVectorLayer);
                    let arrFea = wfsVectorSource.idIndex_;
                    this.formfeature = wfsVectorSource.idIndex_;
                    this.formname = name;
                    // let that = this;
                    // setTimeout(function () {
                    //     that.searchTable(arrFea, name);
                    // }, 500)
                }
            },
            searchName(label){
                let name;
                for(let i in propertyTable){
                    if(propertyTable[i].label === label){
                        return propertyTable[i].value;
                    }
                }
                
            },
            searchTable(arrFea, name) {
                this.featableShow = false;
                for(let item in arrFea){
                    this.featableShow = true;
                }
                for (let item in arrFea) {
                    // let obj1 = {
                    //     title: name
                    // }
                    // this.allFormData.push(obj1);
                    // for(let j = 1;j < arrFea[item].values_.length;j++){
                    for (let j in arrFea[item].values_) {
                        let namevalue = this.searchName(j);
                        let obj = {
                            name:namevalue,
                            value:arrFea[item].values_[j]
                        }
                        // let obj = {
                        //     title: j + ' = ' + arrFea[item].values_[j]
                        // }
                        this.allFormData.push(obj);
                    }
                }
                this.allFormData.shift();
                console.log("name",name);
                if(name === 'pdt'){
                    this.allFormData.splice(1,1);
                }
                console.log("this.allFormData",this.allFormData);
            },
            clearFeaTable() {
                this.map.removeLayer(this.wfsVectorLayer);
                this.allFormData = [];
                this.featableShow = false;
            },
            initMap() {
                function createStyle(src, img) {
                    return new Style({
                        image: new Icon({
                            anchor: [0.5, 0.96],
                            crossOrigin: 'anonymous',
                            src: src,
                            img: img,
                            imgSize: img ? [img.width, img.height] : undefined,
                        }),
                    });
                }

                this.extent = [36365558.9724, 3333897.2863, 36394903.276, 3373469.3127]; //BBOX范围值
                let projection = new Projection({ //地图投影类型
                    code: 'EPSG:4524',
                    units: 'degrees',
                    extent: this.extent
                });

                this.layer = [
                    new TileLayer({
                        //extent:extent, //可注释
                        source: new TileWMS({
                            url: this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms',
                            params: {
                                'LAYERS': 'WebGisdl:511681PL1+GF2DOM011',
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
                // let layer1 = new TileLayer({
                //         //extent:extent, //可注释
                //         source: new TileWMS({
                //             url: this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms',
                //             params: {
                //                 'LAYERS': 'WebGisdl:cjdcq',
                //                 // 'TILED': true,
                //                 'VERSION': '1.1.1',
                //                 'BBOX': this.extent,
                //                 'SRS': 'EPSG:4524',
                //                 "exceptions": 'application/vnd.ogc.se_inimage',
                //                 // 'env':'color:red;'
                //                 //'sld': "http://192.168.100.115:8080/111/cccccsld.sld"
                //             },
                //             serverType: 'geoserver'
                //         })
                //     })
                //     let layer2 = new TileLayer({
                //         //extent:extent, //可注释
                //         source: new TileWMS({
                //             url: this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms',
                //             params: {
                //                 'LAYERS': 'WebGisdl:xzq',
                //                 // 'TILED': true,
                //                 'VERSION': '1.1.1',
                //                 'BBOX': this.extent,
                //                 'SRS': 'EPSG:4524',
                //                 "exceptions": 'application/vnd.ogc.se_inimage',
                //                 // 'env':'color:red;'
                //                 //'sld': "http://192.168.100.115:8080/111/cccccsld.sld"
                //             },
                //             serverType: 'geoserver'
                //         })
                //     })
                //     this.layer.push(layer1);
                //     this.layer.push(layer2);
                // this.layer[0].set("name", 'WebGisdl:511681PL1+GF2DOM011');
                // this.layer[1].set("name", 'WebGisdl:cjdcq');
                // this.layer[2].set("name", 'WebGisdl:xzq');
                this.map = new Map({
                    layers: this.layer,
                    target: 'map',
                    view: new View({
                        projection: projection,
                        center: [36380550, 3355777],
                        zoom: 2
                    })
                });
                this.map.on("moveend",  (e) =>{
                    this.selectextent = [];
                    this.polygonPoints = [];
                    this.mapzoom = this.map.getView().getZoom(); //获取当前地图的缩放级别
                });
            },
            renderContent(h,{node, data, store}){
                let content = <span class="custom-tree-node" disabled>
                    <i class={data.className}></i>
                    <span style="margin-left:5px;">{node.label}</span>
                    </span>;
                return (content);
            },
            clicktc(id){
                if(id  === 18){
                    this.$message({
                        message: '影像无法填充颜色',
                        type: 'warning'
                    });
                }
                for(let i in this.seldataTree){
                    this.seldataTree[i].borderShow = false;
                    this.seldataTree[i].colorShow = false;
                    this.$set(this.seldataTree, i, this.seldataTree[i]);
                }
                this.colorShow = true;
                this.borderShow = false;
                for(let i in this.seldataTree){
                    if(this.seldataTree[i].id === id && id !== 18){
                        // this.seldataTree[i].color = 'orange';
                        // let obj = ;
                        this.seldataTree[i].colorShow = true;
                        this.$set(this.seldataTree, i, this.seldataTree[i]);
                        // let obj = this.seldataTree[i];
                        // this.$set(this.seldataTree[i], `colorShow`, true)
                        // this.$set(this.seldataTree,i,
                        // {
                        //     colorShow:true,
                        //     bkcolor:obj.bkcolor,
                        //     borderShow:false,
                        //     className:obj.className,
                        //     color:obj.color,
                        //     id:obj.id,
                        //     jx:obj.jx,
                        //     label:obj.label,
                        //     tccolor:obj.tccolor,
                        //     value:obj.value,
                        //     vector:obj.vector,
                        //     width:obj.width
                        // });
                        // this.seldataTree[i]['colorShow'] = true; 
                        // this.seldataTree[i].colorShow = true; 
                    }
                }
                this.seldataTree = this.seldataTree
                // console.log("this.seldataTree",this.seldataTree);
            },
            clickbk(id){
                if(id  === 18){
                    this.$message({
                        message: '影像无法填充边框颜色',
                        type: 'warning'
                    });
                }
                for(let i in this.seldataTree){
                    this.seldataTree[i].borderShow = false;
                    this.seldataTree[i].colorShow = false;
                    this.$set(this.seldataTree, i, this.seldataTree[i]);
                }
                this.borderShow = true;
                this.colorShow = false;
                for(let i in this.seldataTree){
                    if(this.seldataTree[i].id === id && id !== 18){
                        this.seldataTree[i].borderShow = true;
                        this.$set(this.seldataTree, i, this.seldataTree[i]);
                    }
                }
                // this.seldataTree = this.seldataTree
                // console.log("this.seldataTree",this.seldataTree);
            },
            // <i class={data.className}></i>
            //  <sketch-picker v-model={this.colors}></sketch-picker>
            //<colorPicker style="border:1px solid black;" value={this.color} on-change={ () => this.testlll(node.label) }  on-change={ this.headleChangeColor } >
            // </colorPicker>
            // selrenderContent(h,{node, data, store}){
            //     let content = <span class="custom-tree-node">
            //         <i class={data.className}></i>
            //         <span class="iconfont icon-tianchong" v-bind = {style="{color:data.color};"} on-click={ () => this.clicktc(data.id) }></span>
            //         <span></span>
            //         <span style="margin-left:5px;" >{node.label}</span>
            //         </span>
            //     return (content);
            // },
        },
    }
</script>

<style lang="less">
    .square {
        width: 0;
        height: 0;
        border-left: 30px solid greenyellow;
        border-top: 30px solid transparent;
        border-bottom: 30px solid transparent;
    }

    #map {
        width: 100%;
        height: 100%;
    }

    #location {
        float: right;
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

    .clear {
        float: left;
    }

    .export {
        // margin-right: 30px;
        float: right;
    }
    .el-tree{
        // color:#D5D7DA;
        // background: #043E8A;
    }
    .el-tree-node {
        .is-leaf+.el-checkbox .el-checkbox__inner {
            display: inline-block;
        }

        .el-checkbox__input>.el-checkbox__inner {
            display: none;
        }
    }

    #featable {
        width: 400px;
        height: 300px;
        z-index: 1000;
        position: absolute;
        right: 10px;
        bottom: 0;
        overflow: auto;
        background: rgba(255, 255, 255, 0.8);
        // border: 1px solid rgba(0,0,0,.2);
        // background-clip: padding-box;
        // box-shadow: 0 1px 1px rgba(0,0,0,.4);
        // background: #fff;
        // border-radius: 5px;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: rgba(255, 255, 255, 0.5);
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: rgba(255, 255, 255, 0.7);
    }
    
    .div1{
        width:50%;
        // height:300px;
        background:blue;
        position:absolute;
        left:0;
        top:0;
    }
    .div2{
        width:50%;
        // height:300px;
        background:green;
        position:absolute;
        transform:translate(100%, 0);
    }

    .el-table th{
        background-color:#45B0EE;
        color: white;
    }
    #left{
        // background-color: #043E8A;
    }
    .curlayer{
        border: 1px solid #DBF1FD;
        background-clip: padding-box;
        box-shadow: 0 1px 1px #DBF1FD;
        // background: #C7D9FB;
        border-radius: 5px;
        position:relative;
        margin-left: 10px;
        margin-right: 10px;
    }
    // .ol-zoom ol-unselectable ol-control {
    //     display: none;
    // }
    // .ol-zoom-out{
    //     display: none;
    // }
    //  .ol-zoom-in{
    //     display: none;
    //  }
</style>