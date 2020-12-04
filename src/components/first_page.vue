<template>
    <!-- <div></div> -->
    <div id="sycontent" ref="sycontent">
        <div class="headpart">
            <div>广安市国土调查成果管理与数据共享服务平台</div>
            <div style="display:flex;">
                <div ref="bodypart1" id="map" style="height:500px;width:700px;">
                    <div id="css_animation"></div>
                    <div v-for="item in allcountypoint" :key="item.id" :class="item.classname" :id="item.idname">
                        <div class="front"></div>
                        <div class="back"></div>
                        <div class="left"></div>
                        <div class="right"></div>
                        <div class="bottom"></div>
                    </div>
                </div>
                <div style="flex:1;margin-top:60px;">
                    <p style="text-indent:2em;font-size:20px;margin:100px;text-align:justify!important;font-family: Monospace;font-weight:500;">
                    &nbsp;&nbsp;广安市是中国改革开放和现代化建设总设计师-邓小平同志的故乡。中国改革开放的巨大成就，使伟人故乡蜚声中外，世界瞩目。区位独特，资源富集。广安位于四川省东部、华蓥山中段、渠江和嘉陵江中游，距重庆市区100余公里，是四川最东端的城市。全市幅员面积6344平方公里，辖广安区、华蓥市及武胜、岳池、邻水三县。盛产粮食、油料、生猪、桑蚕、柑桔，地下资源丰富，开发潜力巨大。市境东部纵贯南北的华蓥山，矿藏尤多，已探明的矿藏达30余种，储量大，品位高，易开发。
                    </p>
                </div>
            </div>
        </div>
        <div class="bodypart">
        </div>
        <div class="footpart" style="margin-top:10px;">
        </div>
    </div>
    <!-- <div id="sycontent" ref="sycontent">
    
  </div> -->
</template>
<script>
    import Map from "ol/Map";
    import View from "ol/View";
    import Projection from 'ol/proj/Projection';
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
    import TileLayer from "ol/layer/Tile";
    // import XYZ from "ol/source/XYZ";
    import TileWMS from "ol/source/TileWMS.js";
    import control from "ol/control"
    import county from "../assets/json/county.json"
    import Overlay from "ol/Overlay"
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
    export default {
        data() {
            return {
                clientHeight: '',
                clientWidth: '',
                map: '',
                allcountypoint: [{
                    "id": 0,
                    "name": "广安",
                    "lng": 106.639267,
                    "lat": 30.462494,
                    "point": [106.639267,30.462494],
                    "idname": "css_animation0",
                    "classname": "css_animation"
                }],
                arrfea:''
            }
        },
        watch: {
            // 如果 clientHeight 发生改变，这个函数就会运行
            clientHeight() {
                // this.$refs.sycontent.style.background = this.clientHeight + ' '+this.clientWidth;
                this.changeFixed(this.clientHeight);
                // this.initMap();
            },
            clientWidth() {
                this.changeFixedw(this.clientWidth);
            },
            county() {

            },
            arrfea(value){
                console.log("arrfea",value);
                for(let item in this.arrfea){
                    console.log("arrfea",this.arrfea[item].values_.xzqdm);
                }
                for(let i in this.arrfea){
                    if(this.arrfea[i].values_.xzqdm === '511600'){
                        this.addselCounty(this.arrfea[i].values_.geometry);
                    }
                }
            }
        },
        created() {
            // this.allcountypoint = county;
            // for(let i in county){
            //     let obj = {
            //         id:county[i].id,
            //         point:[county[i].lng,county[i].lat],
            //         name:county[i].name,
            //         idname:'css_animation'+i,
            //         classname:'css_animation'
            //     }
            //     this.allcountypoint.push(obj);
            // }
        },
        mounted() {
            // this.allcountypoint = county;
            // 获取浏览器可视区域高度
            this.clientHeight = document.documentElement.clientHeight; // document.body.clientWidth;
            this.clientWidth = document.body.clientWidth // document.body.clientWidth;
            window.onresize = function temp() { // 在窗口或框架被调整大小时触发
                this.clientHeight = document.documentElement.clientHeight;
                this.clientWidth = document.body.clientWidth;
            };
            this.initMap();
            this.addCountyPoint();

        },
        methods: {
            changeFixed(clientHeight) { // 动态修改样式
                // this.$refs.headpart1.style.height = clientHeight * 0.13 + 'px';
                // this.$refs.headpart1.style.margin = clientHeight * 0.02 + 'px';
                // this.$refs.headpart2.style.height = clientHeight * 0.13 + 'px';
                // this.$refs.headpart2.style.margin = clientHeight * 0.02 + 'px';
                // this.$refs.headpart3.style.height = clientHeight * 0.13 + 'px';
                // this.$refs.headpart3.style.margin = clientHeight * 0.02 + 'px';
                // this.$refs.headpart4.style.height = clientHeight * 0.13 + 'px';
                // this.$refs.headpart4.style.margin = clientHeight * 0.02 + 'px';
                // this.$refs.bodypart1.style.height = clientHeight * 0.5 + 'px';
                // this.$refs.bodypart1.style.width = this.clientHeight * 0.5 + 'px';
                // this.$refs.bodypart2.style.height = clientHeight * 0.5 + 'px';
                // this.$refs.footpart1.style.height = clientHeight * 0.22 + 'px';
                // this.$refs.footpart2.style.height = clientHeight * 0.22 + 'px';
                // this.$refs.footpart3.style.height = clientHeight * 0.22 + 'px';
                this.$refs.sycontent.style.height = clientHeight + 'px';
            },
            changeFixedw(clientWidth) { // 动态修改样式
                // this.$refs.sycontent.style.width = clientWidth+'px';
                //  this.$refs.sycontent.style.width = 1950 + 'px';
                //  this.$refs.bodypart1.style.width = clientWidth / 2 + 'px';
            },
            initMap() {
                proj4.defs("EPSG:4524",
                    "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
                register(proj4);
                let point = transform([104.07447,30.584715], 'EPSG:4326', 'EPSG:4524')
                console.log("point",point);
                let extent =  [35500984, 2896779.5,36551456, 3834247.5]; //BBOX范围值
                let projection = new Projection({ //地图投影类型
                    code: 'EPSG:4524',
                    units: 'degrees',
                    extent: extent
                });
                let layer = [
                    new TileLayer({
                        //extent:extent, //可注释
                        source: new TileWMS({
                            url: this.$store.state.ConfigBaseURL+'geoserver/WebLayer/wms',
                            params: {
                                'LAYERS': 'WebLayer:scxzq',
                                // 'TILED': true,
                                'VERSION': '1.1.1',
                                'BBOX': extent,
                                'SRS': 'EPSG:4524',
                                "exceptions": 'application/vnd.ogc.se_inimage',
                                // 'env':'color:red;'
                                //'sld': "http://192.168.100.115:8080/111/cccccsld.sld"
                            },
                            serverType: 'geoserver'
                        })
                    })
                ];

                this.map = new Map({
                    layers: layer,
                    target: 'map',
                    view: new View({
                        projection: projection,
                        center: point,
                        zoom: 1
                    }),
                    // controls: new control({
                    //     zoom: false,
                    //     rotate: false,
                    //     attribution: false
                    // }).extend([

                    // ])
                });

                // let source = new VectorSource({
                //     format: new GeoJSON(),
                //     url: this.$store.state.ConfigBaseURL+'geoserver/WebLayer/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebLayer%3Ascxzq%20&outputFormat=application%2Fjson',
                //     // strategy: bbox,
                //     overlaps: false
                //     // filter: new Intersects('draw',test)
                // });
                // console.log("source", source);
                //     this.arrfea = source.idIndex_;
                //     setTimeout(()=>{
                //         // console.log("arrfea",this.arrfea);
                //     },300)
                  
                // //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                // let sourcelayer = new VectorLayer({
                //     source: source,
                //     style: new Style({
                //         fill: new Fill({ //矢量图层填充颜色，以及透明度
                //             color: 'rgba(0,205,240,0.7)'
                //         }),
                //         stroke: new Stroke({
                //             color: 'white',
                //             width: 2
                //         })
                //     }),
                //     visible: true
                // });
                // this.map.addLayer(sourcelayer);
                let ctls = this.map.getControls();
                console.log("ctls", ctls);
                let ctlsLength = ctls.getArray().length;
                this.map.removeControl(ctls.getArray()[0]);
                // for (let i = 0; i < ctlsLength; i  ) {
                //     this.map.removeControl(ctls.getArray()[i]);
                // }
            },
            addselCounty(geo){
                console.log("geo",geo);
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
                        'geometry': geo
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
                let ploygonLayer = new VectorLayer({
                    source: source,
                    style: styles,
                });
                this.map.addLayer(ploygonLayer);
            },
            addCountyPoint() {
                proj4.defs("EPSG:4524",
                    "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
                register(proj4);
                let point = transform([106.639267,30.462494], 'EPSG:4326', 'EPSG:4524')
                // let arr = [];
                console.log("point2",point);
                // for (let i in this.allcountypoint) {
                    let point_div = document.getElementById(this.allcountypoint[0].idname);
                    let point_overlay = new Overlay({
                        element: point_div,
                        positioning: 'center-center'
                    });
                    // let obj = {
                    //     point: this.allcountypoint[i].point,
                    //     overlay: point_overlay
                    // }
                    // arr.push(obj);
                    this.map.addOverlay(point_overlay);
                    point_overlay.setPosition(point);
                // }
                // console.log("arr", arr);
                // for (let i in arr) {
                //     this.map.addOverlay(arr[i].overlay);
                //     arr[i].overlay.setPosition(arr[i].point);
                // }
                let point_div1 = document.getElementById("css_animation");
                let point_overlay1 = new Overlay({
                    element: point_div1,
                    positioning: 'center-center'
                });
                this.map.addOverlay(point_overlay1);
                point_overlay1.setPosition(point);
            }
        }
    }
</script>
<style scoped>
    .sycontent {
        z-index: 1;
        width: 100%;
        /* position: absolute; */
        /* top: 0;
        left: 0; */
        background-image: linear-gradient(rgba(4, 62, 138, 1), black);
        
        /* background: rgba(3, 72, 163, 0.7); */
    }

    .el-row {
        /* margin-bottom: 20px; */
        /* &:last-child {
            margin-bottom: 0;
        } */
    }

    .el-row>last-child {
        margin-bottom: 0;
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        /* background: #99a9bf; */
    }

    .bg-purple {
        /* background: #d3dce6; */
    }

    .bg-purple-light {
        /* background: #e5e9f2; */
    }

    .grid-content {
        border-radius: 4px;
        /* min-height: 36px; */
    }

    .row-bg {
        /* padding: 10px 0; */
        background-color: #f9fafc;
    }

    .label {
        /* width: 100%;
        height: 100px; */
        /* height:100px; */
    }

    .headpart{
        margin-top:100px;
        font-size: 32px;
        text-align: center;
        /* color: white; */
        height:500px;
    }
    /* .bodypart{
        height:500px;
        margin-top:10px;
    } */
    .footpart {
        /* height:300px; */
        /* width: 100%; */
        /* margin-top: 10px; */
        /* height: ; */
    }

    #sycontent {
        /* background-image: radial-gradient(circle,rgba(4, 62, 138, 1),black); */
        /* background-image: linear-gradient(rgba(4, 62, 138, 1), black);
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5; */
        background: url("../assets/images/4.jpg") no-repeat center 0;
        width: 100%;
        /* height: 100%; */
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        background-size:cover;
        /* width:100%; */
        /* width:1700px; */
        /* background-size: 1700px 800px; */
        
    }

    #css_animation {
        height:50px;
        width:50px;
        border-radius: 25px;
        background: #A1D8F7;
        transform: scale(0);
        animation: myfirst 3s;
        animation-iteration-count: infinite;
    }
    @keyframes myfirst {
        to {
            transform: scale(2);
            background: rgba(0, 0, 0, 0);
        }
    }

    .css_animation {
        width: 40px;
        height: 40px;
        transform-style: preserve-3d;
        transform: rotateX(-30deg) rotateY(-80deg);
    } 
    .css_animation div {
        position: absolute;
        top: -10px;
        width: 0px;
        height: 0px;
        border: 10px solid transparent;
        border-bottom-width: 20px;
        opacity: 0.8;
        z-index: 99999;
    }

    .css_animation .front {
        transform: translateZ(10px) rotateX(30deg);
        border-bottom-color: #a3daff;
        transform-origin: 0 100%;
    }

    .css_animation .back {
        transform: translateZ(-10px) rotateX(-30deg);
        border-bottom-color: #1ec0ff;
        transform-origin: 0 100%;
    }

    .css_animation .left {
        transform: translateX(-10px) rotateZ(30deg) rotateY(90deg);
        border-bottom-color: #0080ff;
        transform-origin: 50% 100%;
    }

    .css_animation .right {
        transform: translateX(10px) rotateZ(-30deg) rotateY(90deg);
        border-bottom-color: #03a6ff;
        transform-origin: 50% 100%;
    }

    .css_animation .bottom {
        transform: translateX(-10px) rotateZ(90deg) rotateY(90deg);
        background: cyan;
        width: 20px;
        height: 20px;
        border: 0;
        top: 0;
        transform-origin: 50% 100%;
    }
    
</style>