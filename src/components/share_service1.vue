<template>
    <div>
        <div>地类图斑：
            <a :href="baseUrl+dltb" target="_blank" class="buttonText">地类图斑</a>
        </div>
        <div>行政区：
            <a :href="baseUrl+xzq" target="_blank" class="buttonText">行政区</a>
        </div>
        <div>村级调查图:
            <a :href="baseUrl+cjdcq" target="_blank" class="buttonText">村级调查图</a>
        </div>
        <el-input v-model="input" placeholder="请输入地类编码" @change="changeEvent" style="width:200px;"></el-input>
         <el-button type="primary" @click="searchCode()">查询</el-button>
         <!-- <el-button type="primary" @click="searchTable()">属性表</el-button> -->
         <div style="display:flex;"> 
             <div style="width:300px;overflow:auto;">
                 <div v-for="item in allFormData" :key="item.title" :index="item.title" >{{item.title}}</div>
             </div>
             <div id="dltb" style="flex:1;" v-show="mapShow">
             </div>
         </div>
    </div>
</template>

<script>
    import Map from "ol/Map";
    import EqualTo from 'ol/format/filter/EqualTo'
    import View from "ol/View";
    import TileLayer from "ol/layer/Tile";
    import XYZ from "ol/source/XYZ";
    import TileWMS from "ol/source/TileWMS.js";
    import {
        fromLonLat
    } from "ol/proj.js";
    import OSM from "ol/source/OSM";
    import "ol/ol.css";
    import control from "ol/control/Control"
    import Projection from 'ol/proj/Projection'
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
        Fill
    } from 'ol/style'
    import IsLike from 'ol/format/filter/IsLike';
    export default {
        created(){
        
        },
        data() {
            return {
                baseUrl: 'http://192.168.100.115:8080/geoserver/WebLayer/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebLayer',
                dltb: '%3Adltb&bbox=3.63655589724E7%2C3333897.2863%2C3.6394903276E7%2C3373469.3127&width=569&height=768&srs=EPSG%3A4524&format=application/openlayers',
                xzq: '%3Axzq&bbox=3.63655589724E7%2C3333897.2863%2C3.6394903276E7%2C3373469.3127&width=569&height=768&srs=EPSG%3A4524&format=application/openlayers',
                cjdcq: '%3Acjdcq&bbox=3.63655589724E7%2C3333897.2863%2C3.6394903276E7%2C3373469.3127&width=569&height=768&srs=EPSG%3A4524&format=application/openlayers',
                extent:'',
                layer:'',
                map:'',
                input:'511681211000000910',
                searchFea:'',
                allFormData:[],
                wfsVectorLayer:'',
                mapShow:true
            }
        },
        mounted(){
               this.initDltb();
            // this.searchTable();
        },
        methods:{
            initDltb(){
                this.extent = [36365558.9724, 3333897.2863, 36394903.276, 3373469.3127]; //BBOX范围值
                let projection = new Projection({ //地图投影类型
                    code: 'EPSG:4524',
                    units: 'degrees',
                    extent: this.extent
                });
                    this.map = new Map({
                        layers: this.layer,
                        target: 'dltb',
                        view: new View({
                            projection: projection,
                            center: [36380550, 3355777],
                            zoom: 2
                        })
                    });
                    let str = this.input + "";
                    console.log("str",str);
                    let wfsVectorSource = new VectorSource({
                        format: new GeoJSON(),
                        projection: 'EPSG:4524',
                        url:'http://192.168.100.115:8080/geoserver/WebLayer/wfs?service=wfs&request=GetFeature&version=1.1.0&outputFormat=application/json&TYPENAME=WebLayer:dltb&cql_filter=bsm='+this.input,
                        // strategy: bbox,
                        //  filter: new OpenLayers.Filter.Comparison({
                        //     type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        //     property: "bsm",
                        //     value: 511681211000000295
                        // }),
                        // CQL_FILTER:"bsm:" + 511681211000000295
                        // filter: new IsLike('bsm', '511681211000000295')
                    });
                    // this.map.getView().setCenter([]);
                    //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                    this.wfsVectorLayer = new VectorLayer({
                        source: wfsVectorSource,
                        style: new Style({
                            fill: new Fill({ //矢量图层填充颜色，以及透明度
                                color: 'rgba(28, 124, 197, 0.8)'
                            }),
                            stroke: new Stroke({
                                color: 'rgba(28, 124, 197, 0.7)',
                                width: 1
                            })
                        }),
                        visible: true
                    });
                    this.map.addLayer(this.wfsVectorLayer);
                    this.mapShow = false;
                    let arrFea = wfsVectorSource.idIndex_;
                    this.searchFea = arrFea;
                    console.log("arrFea",arrFea);
                    let that = this;
                    setTimeout(function(){
                        that.searchTable();
                    },300)
            },
            searchCode(){
                // var filter = new OpenLayers.Filter.Comparison({
                //     type: OpenLayers.Filter.Comparison.EQUAL_TO, // 表达式 equal
                //     property: "status",
                //     value: "1"
                // });

                // 511681211000000910
                this.allFormData = [];
                console.log("this.input",this.input);
                if(this.input.length !== 18){
                    this.$message({
                            showClose: true,
                            message: '标识码为18位',
                            type: 'warning'
                        });
                } else {
                    let that = this;
                    let str = that.input + "";
                    this.map.removeLayer(this.wfsVectorLayer);
                    // var filterStrategy = new OpenLayers.Strategy.Filter({filter: filter});
                    let wfsVectorSource = new VectorSource({
                        format: new GeoJSON(),
                        projection: 'EPSG:4524',
                        url:'http://192.168.100.115:8080/geoserver/WebLayer/wfs?service=wfs&request=GetFeature&version=1.1.0&outputFormat=application/json&TYPENAME=WebLayer:dltb&cql_filter=bsm='+that.input,
                        // strategy: bbox,
                        //  filter: new OpenLayers.Filter.Comparison({
                        //     type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        //     property: "bsm",
                        //     value: 511681211000000295
                        // }),
                        // CQL_FILTER:"bsm:" + 511681211000000295
                        // filter: new IsLike('bsm', '511681211000000295')
                    });
                    // this.map.getView().setCenter([]);
                    //创建wfs图层，注意需要设置好描边样式，否则不展示效果出来
                    this.wfsVectorLayer = new VectorLayer({
                        source: wfsVectorSource,
                        style: new Style({
                            fill: new Fill({ //矢量图层填充颜色，以及透明度
                                color: 'rgba(28, 124, 197, 0.8)'
                            }),
                            stroke: new Stroke({
                                color: 'rgba(28, 124, 197, 0.7)',
                                width: 1
                            })
                        }),
                        visible: true
                    });
                    this.map.addLayer(this.wfsVectorLayer);
                    // for(let item in this.searchFea){
                    //     let point = this.searchFea[item].values_.geometry.flatCoordinates;
                    //     let lng = point[0];
                    //     let lat = point[1];
                    //     this.map.getView().setCenter([lng,lat]);
                    //     this.map.getView().setZoom(8);
                    // }
                    this.mapShow = false;
                    let arrFea = wfsVectorSource.idIndex_;
                    console.log("arrFea1",arrFea);
                    this.searchFea = arrFea;
                    setTimeout(function(){
                        that.searchTable();
                    },300)
                    console.log("wfsVectorSource", wfsVectorSource);
                }
            },
            searchTable(){
                console.log("this.searchFea",this.searchFea);
                this.mapShow = true;
                for(let item in this.searchFea){
                    let point = this.searchFea[item].values_.geometry.flatCoordinates;
                    let lng = point[0];
                    let lat = point[1];
                    this.map.getView().setCenter([lng,lat]);
                    this.map.getView().setZoom(9);
                    for(let j in this.searchFea[item].values_){
                        let obj = {
                            title:j+' = '+this.searchFea[item].values_[j]
                        }
                        this.allFormData.push(obj);
                    }
                    console.log("item",item);
                }
                
            },
            changeEvent(){
                console.log("thishf",this.input);
            }
        }
    }
</script>

<style>
#dltb{
    width:50%;
    height: 50%;
    float: right;
}
</style>