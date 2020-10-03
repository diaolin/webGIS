<template>
    <div>
        <div class = "content3" style="display:flex;">
        <div id = "left" style="width:300px;">
             <el-tree :data="dataTree"  show-checkbox default-expand-all node-key="label" ref="tree" highlight-current
                    check-on-click-node :props="defaultProps" :check-strictly="true" :render-content="renderContent" :default-checked-keys='resourceCheckedKey' @check="getCheckedKeys">
            </el-tree>
        </div>
        <div id = "right" style="flex:1;">
            <div id="map">
                <div id="info">&nbsp;</div>
                <el-button class="clear" type="primary" @click="clearFeaTable()">清除图表</el-button>
                <el-button class="export" type="primary" @click="exportShp()">导出</el-button>
                <div id="featable" v-show="featableShow">
                    <div v-for="(item,index) in allFormData" :key="index" >{{item.title}}</div>
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
        Icon
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
    import {transformExtent} from 'ol/proj'
    import {transform} from 'ol/proj';
    import proj4 from 'proj4';
    import {register} from 'ol/proj/proj4';
    import Feature from 'ol/Feature';
    import Point from 'ol/geom/Point';
    // import {proj4} from "proj4"
    // import * as proj4 from 'ol/proj/proj4';
    export default {
        data() {
            return {
                map: null,
                layer:null,
                extent:null,
                test:null,
                allLayer:[],
                allNode:[],
                allFormData:[],
                featableShow:false,
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
                        },{
                                value:0,
                                label: '举证成果',
                                jx:'jzzp',
                                className:'iconfont icon-zhengque'
                            }]
                    }]
                    }, 
                 {
                    label: '监测成果',
                    children: [{
                        value:0,
                        label: '2019年监测图斑',
                        className:'iconfont icon-zhengque',
                        jx:'jctb_2019'
                    }, {
                        value:0,
                        label: '2018年监测图斑',
                        className:'iconfont icon-zhengque',
                        jx:'jctb_2018'
                    }, {
                        value:0,
                        label: '2017年监测图斑',
                        className:'iconfont icon-zhengque',
                        jx:'jctb1_2017'
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
        mounted() {
            this.initMap();
            this.requestTree();
            
        },
        methods: {
            defaultProps() {

            },
            clickMap(){
                
                
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
                console.log("this.all",this.allNode);
                this.addMapLayer(node.jx,node.value);
                if(node.value === 0){
                    node.value = 1;
                } else {
                    node.value = 0;
                }
                
            },
            addMapLayer(layer,value){
                this.allFormData = [];
                this.featableShow = false;
                this.map.removeLayer(this.wfsVectorLayer);
                let layerName = 'WebLayer:'+layer;
                this.allLayer = [];
                let style;
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
                                //'sld': "http://127.0.0.1:8080/111/cccccsld.sld"
                            },
                            serverType: 'geoserver'
                        }),
                        style: style,
                    });
                
                
                if(value === 0){
                    this.map.addLayer(selectlayer);
                    let that = this;
                    this.map.on('click',function(e){
                        that.allFormData = [];
                        console.log("this.allnode",that.allNode);
                        let coor1 = e.coordinate;
                        let coor=coor1.join(',');
                        let index = that.allNode.length-1;
                        if(that.allNode.length > 1){
                            that.feaClick(coor,layer);
                        }
                    })
                    
                    if(layer === 'jzzp'){
                        proj4.defs("EPSG:4524","+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
                        register(proj4);
                        let that = this;
                        this.map.on("moveend",function(e){
                            let zoom = that.map.getView().getZoom();  //获取当前地图的缩放级别
                            console.log("zoom",zoom);
                            let extent = that.map.getView().calculateExtent(that.map.getSize());
                            let point = transformExtent(extent, 'EPSG:4524', 'EPSG:4326')
                            console.log("extent",extent);
                            console.log("point2",point);
                        });  
                        // 0: 36379850.64837926
                        // 1: 3363564.823680564
                        // 2: 36381348.124964215
                        // 3: 3365835.1914061494
                        let arr = [];
                        let data = [36379850.64837926,3363564.823680564,36381348.124964215,3365835.1914061494];
                        arr.push([data[0],data[1]]);
                        arr.push([data[0],data[3]]);
                        arr.push([data[2],data[1]]);
                        arr.push([data[2],data[3]]);
                        arr.push([data[0],data[1]]);
                        console.log("arr",arr);
                        let arrpoint1;
                        for(let i in arr){
                            arrpoint1 = arr[i].join('%20');
                        }
                        let arrpoint = '36379899.038965724,3363197.1538726836%2036383125.85947783,3362849.3528594025%2036382082.45643799,3360298.81209534%2036379048.858711034,3360627.2908301055%2036379899.038965724,3363197.1538726836';
                        console.log("arrpoint",arrpoint);
                        console.log("arrpoint1",arrpoint1);
                        var iconFeature = new Feature({
                            geometry: new Point([36380550, 3355777]),
                            // population: 4000,
                            // rainfall: 500
                        })
                        var iconStyle = new Style({
                            image: new Icon({
                            // anchor: [0.5, 46],
                            // scale: 10000,
                            imgSize: [200, 200],
                            // anchorXUnits: 'fraction',
                            // anchorYUnits: 'pixels',
                            src: '../assets/logo.png'
                            })
                        })
                        iconFeature.setStyle(iconStyle)
                        let wfsVectorSource = new VectorSource({
                            format: new GeoJSON(),
                            url: 'http://192.168.100.115:8080/geoserver/WebLayer/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebLayer%3Ajzzp%20&outputFormat=application%2Fjson%20&filter=%20%3CFilter%20xmlns=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%20%3CIntersects%3E%20%3CPropertyName%3Eshape%3C/PropertyName%3E%20%3Cgml:Polygon%3E%20%3Cgml:outerBoundaryIs%3E%20%3Cgml:LinearRing%3E%20%3Cgml:coordinates%3E'+arrpoint+'%3C/gml:coordinates%3E%20%3C/gml:LinearRing%3E%20%3C/gml:outerBoundaryIs%3E%20%3C/gml:Polygon%3E%20%3C/Intersects%3E%20%3C/Filter%3E',
                            strategy: bbox,
                            // features:[iconFeature]
                            // filter: new Intersects('draw',test)
                        });
                        //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                        let testLayer = new VectorLayer({
                            source: wfsVectorSource,
                            style: new Style({
                                // image: new Icon({
                                //     src: '../assets/logo.png',
                                //     scale:100
                                // })
                                fill: new Fill({ //矢量图层填充颜色，以及透明度
                                    color: 'red'
                                }),
                                stroke: new Stroke({
                                    color: 'orange',
                                    width: 15
                                })
                            }),
                            visible: true
                        });
                       
                        console.log("wfsVectorSource",wfsVectorSource);
                        this.map.addLayer(testLayer);
                        var displayFeatureInfo = function (pixel) {
                        var feature = that.map.forEachFeatureAtPixel(pixel, function (feature) {
                            
                            return feature;
                        });
                        console.log("feature",feature);

                        var info = document.getElementById('info');
                        if (feature) {
                            info.innerHTML = feature.getId() + ': ' + feature.values_.zp;
                        } else {
                            info.innerHTML = '&nbsp;';
                        }
                        // if (feature !== highlight) {
                        //     if (highlight) {
                        //     featureOverlay.getSource().removeFeature(highlight);
                        //     }
                        //     if (feature) {
                        //     featureOverlay.getSource().addFeature(feature);
                        //     }
                        //     highlight = feature;
                        // }
                        };

                        this.map.on('click', function(e) {
                             let coor1 = e.coordinate;
                            let coor=coor1.join(',');
                            // that.feaClick(coor,layer);
                            var view = that.map.getView();
                            var viewResolution = view.getResolution();
                            var source = testLayer.getSource();
                            var source1 = selectlayer.getSource();
                            console.log("source",source);
                            console.log("source1",source1);
                            // // var source = untiled.get('visible') ? untiled.getSource() : tiled.getSource();
                            // var url = source.getGetFeatureInfoUrl(
                            // evt.coordinate, viewResolution, view.getProjection(),
                            // {'INFO_FORMAT':  'application/json', 'FEATURE_COUNT': 50});
                            // axios({
                            //     method: 'GET',
                            //     url: url,
                            //     params: {
                            //         // reportRuleId: row.reportRuleId
                            //     },
                            //     // responseType: 'json'
                            // }).then(response => {
                            //     console.log("response", response);
                            // }).catch(error => this.$message.error(error))
                            if (e.dragging) {
                                return;
                            }
                        
                            var pixel = that.map.getEventPixel(e.originalEvent);
                            console.log(pixel);
                            displayFeatureInfo(pixel);
                        });
                    } 
                } else {
                    let arrLayer = this.map.getLayers().array_;
                    for(let i in arrLayer){
                        let delLayer = arrLayer[i].values_.source.params_.LAYERS;
                        if( delLayer === layerName){
                             this.map.removeLayer(arrLayer[i]);
                        }
                    }
                  
                }
            },
            feaClick(coor,layername,name){
                console.log("layername",layername);
                console.log("name",name);
                this.map.removeLayer(this.wfsVectorLayer);
                let wfsVectorSource = new VectorSource({
                    format: new GeoJSON(),
                    url:'http://192.168.100.115:8080/geoserver/WebLayer/ows?service=WFS&version=1.0.0%20&request=GetFeature%20&typeName=WebLayer:'+layername+'%20&outputFormat=application%2Fjson%20&filter=%20%3CFilter%20xmlns=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%20%3CIntersects%3E%20%3CPropertyName%3Eshape%3C/PropertyName%3E%20%3Cgml:Point%3E%20%3Cgml:coordinates%3E'+coor+'%3C/gml:coordinates%3E%20%3C/gml:Point%3E%20%3C/Intersects%3E%20%3C/Filter%3E',
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
                        stroke: new Stroke({
                            color: 'rgba(28, 124, 197, 0.7)',
                            width: 4
                        })
                    }),
                    visible: true
                });
                this.map.addLayer(this.wfsVectorLayer);
                let arrFea = wfsVectorSource.idIndex_;
                console.log("arrFea",arrFea);
                let that = this;
                setTimeout(function(){
                    that.searchTable(arrFea,name);
                },500)
            },
            searchTable(arrFea,name){
                this.featableShow = true;
                for(let item in arrFea){
                    let obj1 = {
                        title:name
                    }
                    this.allFormData.push(obj1);
                    for(let j in arrFea[item].values_){
                        let obj = {
                            title:j+' = '+arrFea[item].values_[j]
                        }
                        this.allFormData.push(obj);
                    }
                }
            },
            clearFeaTable(){
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

                var iconFeature = new Feature(new Point([36380550, 3355777]));
                iconFeature.set('style', createStyle('../assets/logo.png', undefined));
                console.log("iconFeature",iconFeature);
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
                // let wfsVectorSource = new VectorSource({
                //     format: new GeoJSON(),
                //     projection: 'EPSG:4524',
                //     url: 'http://192.168.100.115:8080/geoserver/WebLayer/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebLayer%3Ajzzp&outputFormat=application%2Fjson',
                //     strategy: bbox
                // });
                // //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                // let wfsVectorLayer = new VectorLayer({
                //     source: wfsVectorSource,
                //     style: new Style({
                //         fill: new Fill({ //矢量图层填充颜色，以及透明度
                //             color: 'red'
                //         }),
                //         stroke: new Stroke({
                //             color: 'red',
                //             width: 4
                //         })
                //     }),
                //     visible: true
                // });
                // this.layer.push(wfsVectorLayer);
                // // this.map.addLayer(wfsVectorLayer);
                // console.log("wfsVectorSource",wfsVectorSource);
                // // wfsVectorLayer.set("name",layerName);
                this.layer.push(new VectorLayer({
                    style: function (feature) {
                        return feature.get('style');
                    },
                    source: new VectorSource({features: [iconFeature]}),
                    }) );
                this.map = new Map({
                    layers: this.layer,
                    target: 'map',
                    view: new View({
                        projection: projection,
                        center: [36380550, 3355777],
                        zoom: 2
                    })
                });
                this.map.on('click',function(e){
                        console.log("e",e);
                    })
        
                // var mapExtent = this.map.getView().calculateExtent(this.map.getSize());
                // console.log("mapExtentll",mapExtent);
                // var point = olExtent.getCenter(mapExtent)   
                // console.log("point1",point);
                // let point = transformExtent(this.extent, 'EPSG:3857', 'EPSG:4326')
                // console.log("point2",point);
                // console.log("point",point);
                // let scaleLineControl = new ScaleLine({
                //     //设置度量单位为米
                //     units: 'metric',
                //     target: 'scalebar',
                //     className: 'ol-scale-line'
                // });
                // this.map.addControl(scaleLineControl);
                
            },
            renderContent(h,{node, data, store}){
                let content = <span class="custom-tree-node">
                    <i class={data.className}></i>
                    <span style="margin-left:5px;">{node.label}</span>
                    </span>;
                return (content);
            },

        },
    }
</script>

<style lang="less">
    #map {
        // width: 1000px;
        // height: 800px;
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

    .el-tree-node {
        .is-leaf + .el-checkbox .el-checkbox__inner {
            display:inline-block;
        }
        .el-checkbox__input> .el-checkbox__inner {
            display:none;
        }
    }
    
    #featable{
        width:300px;
        height: 570px;
        z-index: 1000;
        position: absolute;
        right: 10px;
        bottom: 0;
        overflow: auto;
        background:rgba(255,255,255,0.8);
        // border: 1px solid rgba(0,0,0,.2);
        // background-clip: padding-box;
        // box-shadow: 0 1px 1px rgba(0,0,0,.4);
        // background: #fff;
        // border-radius: 5px;
    }
</style>