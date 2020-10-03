<template>
    <div>
        <div class="container" style="display:flex;">
            <div class="selcounty" style="width:200px;">
                <!-- <span class="county">请选择所在区县：</span>
                <el-cascader
                    placeholder="可输入关键词搜索"
                    :options="optionscounty"
                    filterable v-model="countyValue" @change="clickvalue"></el-cascader> -->
                <el-tree
                    :data="optionscounty"
                    show-checkbox
                    node-key="value"
                    ref="countytree"
                    :default-expanded-keys="[51, 5116]"
                    :default-checked-keys="[511681]"
                    @check="getCountyKeys"
                    :props="defaultProps">
                </el-tree>
                <!-- <span class="type">请选择数据类型：</span>
                <el-cascader
                    placeholder="可输入关键词搜索"
                    :options="optionsdatatype"
                    filterable v-model="dataValue" @change="clickdata"></el-cascader> -->
            </div>
            <div style="width:200px;">
                 <el-tree
                    :data="optionsdatatype"
                    show-checkbox
                    node-key="id"
                    ref="datatree"
                    default-expand-all
                    :default-expanded-keys="[]"
                    :default-checked-keys="[]"
                    @check="getDatatypeKeys"
                    :props="defaultProps">
                </el-tree>
            </div>
            <div style="flex:1;">
                <span class="selyear">请选择年份：</span>
                <el-date-picker
                    v-model="value3"
                    type="year"
                    placeholder="选择年" @change="clickyear"></el-date-picker>
                <span><el-button type="primary" @click="searchFile">查询</el-button></span>
                <div class="upload">
                <div class="uploadFile">
                    <!-- <el-upload
                        class="upload-demo"
                        ref="upload"
                        accept=".zip"
                        action=""
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>
                    </el-upload> -->
                    <el-upload
                        class="upload-demo"
                        action=""
                        :file-list="value"
                        ref="uploadFile"
                        :on-preview="handlePreview"
                        name="classZip"
                        accept=".zip"
                        :on-remove="handleRemove"
                        :on-error="handleError"
                        :on-success="handleSuccess"
                        multiple 
                        :on-exceed="handleExceed"
                        :limit="1"
                        :on-change="handleChange"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary" v-show="uploadShow">选择文件</el-button>
                        <el-button type="success" size="small"
                        @click="submitUpload" id="changeFileList" style="margin-left: 10px;" v-show="uploadShow">上传文件</el-button>
                        <div slot="tip" class="el-upload__tip" v-show="uploadShow">只能上传.zip文件</div>
                        <!-- <span slot="tip" class="el-upload__tip" style="color: red;width:200px;">{{message}}</span> -->
                    </el-upload>
                    <el-progress v-if="loading" :percentage="percentage" :color="colors" class="progress" style="margin:0 30%;"></el-progress>
                    <el-button class="download" size="small" type="primary" @click="downLoad" v-show="downShow">下载文件</el-button>
                    <!-- <el-progress v-if="downloading" :percentage="downpercentage" :color="colors" class="progress" ref="progress"></el-progress> -->
                        <div><downpro/></div>
                </div>
            </div>
            </div>

        </div>
        
        </div>
</template>
<script src="https://unpkg.com/elm-pep"></script>
<script>
import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import {Icon, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';


let id = 1000;

export default {
   
    data() {
        return {
            
            
        }
    },
    mounted(){
        this.searchFile();
    },
    methods:{
        searchFile(){
            var raster = new TileLayer({
            source: new OSM(),
            });

            var source = new VectorSource();

            var styleFunction = function (feature) {
            var geometry = feature.getGeometry();
            var styles = [
                // linestring
                new Style({
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2,
                }),
                }) ];

            geometry.forEachSegment(function (start, end) {
                var dx = end[0] - start[0];
                var dy = end[1] - start[1];
                var rotation = Math.atan2(dy, dx);
                // arrows
                styles.push(
                new Style({
                    geometry: new Point(end),
                    image: new Icon({
                    src: 'data/arrow.png',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation,
                    }),
                })
                );
            });

            return styles;
            };
            var vector = new VectorLayer({
            source: source,
            style: styleFunction,
            });

            var map = new Map({
            layers: [raster, vector],
            target: 'map',
            view: new View({
                center: [-11000000, 4600000],
                zoom: 4,
            }),
            });

            map.addInteraction(
            new Draw({
                source: source,
                type: 'LineString',
            })
            );
        }
    }
}
</script>

<style>
   
    .uploadFile{
       margin-top: 3%;
       text-align: center;
      
    }
    
   .download{
       margin-top:10%;
   }
    
     /* .el-tree-node {
        .is-leaf + .el-checkbox .el-checkbox__inner {
            display:inline-block;
        }
        .el-checkbox__input> .el-checkbox__inner {
            display:none;
        }
    } */
</style>