<template>
    <div>
        <div class = "content5" style="display:flex;">
        <div id = "left" style="width:300px;background:#DBF1FD">
            <!-- :render-content="renderContent"  -->
            <countycheck/>
             <el-tree :data="dataTree"  show-checkbox default-expand-all node-key="label" ref="tree" highlight-current
                    check-on-click-node :props="defaultProps" :check-strictly="true" :default-checked-keys='resourceCheckedKey' @check="getCheckedKeys" style="background:#DBF1FD">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="custom-tree-node">
                            <i :class="data.className"></i>
                            <span>{{ node.label }}</span>
                        </span>
                        <a class="deltext" :style="{'display':data.className === 'iconfont icon-zhengque'? 'inline-block':'none'}" :href="data.href" target="_blank">详情</a>
                    </span>
            </el-tree>
        </div>
        <div id = "right" style="flex:1;">
            <div id="map" v-loading="loading">
                <div id="barline" v-show="barlineShow">
                </div>
            </div>
        </div>
        <div class="sqlmb" style="width:400px;">
            <!-- <el-button @click="definerangevalue">测试</el-button> -->
            <span style="margin-left:50px;margin-top:50px;">范围选择：</span>
            <!-- <el-select v-model="optionslayer1value" placeholder="请选择上传图层">
                <el-option-group
                v-for="group in optionslayer1all"
                :key="group.label"
                :label="group.label">
                <el-option
                    v-for="item in group.options"
                    :key="item.jx"
                    :label="item.label"
                    :value="item.jx">
                </el-option>
                </el-option-group>
            </el-select> -->
            <el-cascader
                ref="myCascader"
                :options="optionsRange"
                :props="{ checkStrictly: true }"
                @change="getCheckedNodes"
                clearable></el-cascader>
            <el-input v-model="circlewidth" placeholder="请输入缓冲半径(m)" v-show="drawPointShow" style="width:40%;margin-top:20px;margin-left:120px;"></el-input>
            <el-input v-model="linewidth" placeholder="请输入缓冲距离(m)" v-show="drawLineShow" style="width:40%;margin-top:20px;margin-left:120px;"></el-input>
            <div class="sharebutton" v-show="updatadrawshow">
                 <el-button  type="primary"  @click="clearDraw()">清除</el-button>
                 <el-button  type="primary"  @click="reDrawLayer()">重新绘制</el-button>
            </div>
            <div style="height:20px;"></div>
            <div>
                <span style="margin-left:50px;margin-top:50px;">图层选择：</span>
                <el-select v-model="optionslayer2value" placeholder="请选择图层">
                    <el-option
                    v-for="item in optionslayer2"
                    :key="item.jx"
                    :label="item.label"
                    :value="item.jx">
                    </el-option>
                </el-select>
            </div>
            <div style="height:20px;"></div>
            <span style="margin-left:50px;margin-top:50px;">字段选择：</span>
            <el-select v-model="objvalue" multiple placeholder="请先选择图层">
                <el-option
                v-for="item in objoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <div style="height:20px;"></div>
            <!-- <div>
                 <el-button  type="primary"  @click="insectLayer()">相交</el-button>
                 <el-button  type="primary"  @click="exportshpLayer()">导出shp</el-button>
            </div> -->
            <div style="margin-left:50px;">字段筛选：</div>
            <div class="sqledit">
                <div  class="objtext" style="cursor:pointer">
                    <div v-for="(objtextitem,objindex) in sqloptions" :key="objtextitem.item1" :index="objindex" @click="clickobjtext(objindex)" @dblclick="dbclickobjtext(objtextitem.item1)">
                        <div :style="{color:objtextitem.color}">{{objtextitem.item1}}</div>
                    </div>
                </div>
                <div class="parent">
                    <div class="son1">
                        <button class="grand" @click="clickysf('=')">=</button>
                        <button class="grand" @click="clickysf('<>')">{{dyxy}}</button>
                        <button class="grand" @click="clickysf('LIKE')">Like</button>
                        <button class="grand" @click="clickysf('>')">></button>
                        <button class="grand" @click="clickysf('>=')">>=</button>
                        <button class="grand" @click="clickysf('AND')">And</button>
                        <button class="grand" @click="clickysf('<')">{{xy}}</button>
                        <button class="grand" @click="clickysf('<=')">{{xydy}}</button>
                        <button class="grand" @click="clickysf('OR')">Or</button>
                        <button class="grand" @click="clickysf('_')">_</button>
                        <button class="grand" @click="clickysf('%')">%</button>
                        <button class="grand" @click="clickysf('()')">()</button>
                        <button class="grand" @click="clickysf('NOT')">Not</button>
                        <button class="grand" @click="clickysf('IS')">Is</button>
                        <!-- <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button>
                        <el-button class="grand"></el-button> -->
                    </div>

                    <div class="son2">
                        <div class="grand1" style="cursor:pointer">
                            <div v-for="vitem in arronlyvalue" :key="vitem" style="font-size:12px;" @dblclick="dbclickonlytext(vitem)">
                                <div>{{vitem}}</div>
                            </div>
                        </div>
                        
                        <div class="grand2" @click="getonlyvalue">
                            <button>获取唯一值</button>
                        </div>
                    </div>
                </div>
                <div style="margin-left:10px;">SELECT  *FROM {{tablename}} WHERE</div>
                <div class="objtext">
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder=""
                    v-model="sqlsearch"
                    class="info-textarea">
                    </el-input>
                </div>
                <div style="float:right;margin:0 10px;">
                    <button @click="clearsql">清除</button>
                    <button>确认</button>
                    <button>取消</button>
                </div>
            </div>
            <div style="text-align:center;">
                 <el-button type="primary" @click="exportRangeShp()" :disabled="exportShow" >导出shp</el-button>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    // const geourl = 'http://192.168.100.115:8080';
    import global from './global'
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
    import propertyTable from '../assets/json/propertyTable.json'
    import countycheck from './countySelect'
    import {
        eventBus
    } from '../main'
    export default {
        data() {
            return {
                token:global.token,
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
                                className:'iconfont icon-zhengque',
                                href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3Axzq&bbox=3.6365556E7%2C3333897.25%2C3.6394904E7%2C3373469.5&width=569&height=768&srs=EPSG%3A4524&format=application/openlayers'
                            }, {
                                value:0,
                                label: '村级调查区',
                                jx:'cjdcq',
                                className:'iconfont icon-zhengque',
                                href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3Acjdcq&bbox=3.6365556E7%2C3333897.25%2C3.6394904E7%2C3373469.5&width=569&height=768&srs=EPSG%3A4524&format=application/openlayers'
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
                                className:'iconfont icon-zhengque',
                                href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3Adltb&bbox=3.6365556E7%2C3333897.25%2C3.6394904E7%2C3373469.5&width=569&height=768&srs=EPSG%3A4524&format=application/openlayers'
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
                                className:'iconfont icon-zhengque',
                                href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3Aczcdyd&bbox=3.6365708E7%2C3334073.75%2C3.6394272E7%2C3373364.5&width=558&height=768&srs=EPSG%3A4524&format=application/openlayers'
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
                                className:'iconfont icon-zhengque',
                                href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3Attq&bbox=3.637088E7%2C3339170.5%2C3.6391704E7%2C3373289.5&width=468&height=768&srs=EPSG%3A4524&format=application/openlayers'
                            }, {
                                value:0,
                                label: '拆除未尽区',
                                jx:'ccwjq',
                                className:'iconfont icon-zhengque',
                                href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3Accwjq&bbox=3.636774E7%2C3337067.75%2C3.6391036E7%2C3371380.25&width=521&height=768&srs=EPSG%3A4524&format=application/openlayers'
                            }, {
                                value:0,
                                label: '路面范围',
                                jx:'lmfw',
                                className:'iconfont icon-zhengque',
                                href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3Almfw&bbox=3.6368596E7%2C3334042.75%2C3.6394876E7%2C3373071.25&width=517&height=768&srs=EPSG%3A4524&format=application/openlayers'
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
                        jx:'511681jctb_2019',
                        href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3A511681jctb_2019&bbox=3.6367104E7%2C3334222.25%2C3.6393376E7%2C3373644.25&width=511&height=768&srs=EPSG%3A4524&format=application/openlayers'
                    }, {
                        value:0,
                        label: '2018年监测图斑',
                        className:'iconfont icon-zhengque',
                        jx:'511681jctb_2018',
                        href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3A511681jctb_2018&bbox=3.637046E7%2C3340045.0%2C3.6391456E7%2C3373545.0&width=481&height=768&srs=EPSG%3A4524&format=application/openlayers'
                    }, {
                        value:0,
                        label: '2017年监测图斑',
                        className:'iconfont icon-zhengque',
                        jx:'511681jctb1_2017',
                        href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3A511681jctb1_2017&bbox=3.6367216E7%2C3334678.25%2C3.6392232E7%2C3368762.5&width=563&height=768&srs=EPSG%3A4524&format=application/openlayers'
                    }]
                    }, {
                    label: '影像成果',
                    children: [{
                        value:1,
                        label: '三次调查底图',
                        className:'iconfont icon-zhengque',
                        jx:'511681PL1+GF2DOM011',
                        href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3A511681PL1%2BGF2DOM011&bbox=3.63654589724E7%2C3333797.2870649733%2C3.63950034724E7%2C3373569.2870649733&width=570&height=768&srs=EPSG%3A4524&format=application/openlayers'
                    }]
                    },{
                    label: '相关业务数据',
                    children: [{
                        value:0,
                        label: '永久基本农田',
                        className:'iconfont icon-zhengque',
                        jx:'5116812014jbntbhtb',
                        href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3A5116812014jbntbhtb&bbox=3.6365424E7%2C3338644.25%2C3.6392848E7%2C3373628.5&width=602&height=768&srs=EPSG%3A4524&format=application/openlayers'
                    }, {
                        label: '部下发用地管理信息',
                        children: [{
                            label: '2019年',
                            children: [{
                                value:0,
                                label: '农用地转用',
                                className:'iconfont icon-zhengque',
                                jx:'nzyxmtb_2010_2019_511681',
                                href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3Anzyxmtb_2010_2019_511681&bbox=3.6367336E7%2C3337412.25%2C3.6390092E7%2C3373473.75&width=484&height=768&srs=EPSG%3A4524&format=application/openlayers'
                            }, {
                                value:0,
                                label: '土地整理',
                                className:'iconfont icon-zhengque',
                                jx:'tdzzysxmtb_2011_2018_511681',
                                href:this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wms?service=WMS&version=1.1.0&request=GetMap&layers=WebGisdl%3Atdzzysxmtb_2011_2018_511681&bbox=3.6364748E7%2C3341636.75%2C3.6396188E7%2C3376967.25&width=683&height=768&srs=EPSG%3A4524&format=application/openlayers'
                            }]
                        }]
                    }]
                    }
                ],
                optionslayer1:[
                {
                    jx: 'point',
                    label: '绘制点'
                }, {
                    jx: 'line',
                    label: '绘制线'
                },{
                    jx: 'polygon',
                    label: '绘制面'
                },{
                    jx: 'file',
                    label: '上传文件'
                }],
                optionslayer1value:'',
                optionslayer2value:'',
                insectvector:'',
                insectdraw:'',
                drawInsectPoint:'',
                arrinsects:[],
                drawPointShow:false,
                drawLineShow:false,
                drawPolyShow:false,
                allleaflayers:[],
                optionslayer1all:[],
                optionslayer2:[],
                insecttype:'',
                circlewidth:'',
                linewidth:'',
                requestLayer:'',
                loading: false,
                clicknode:'',
                optionsRange:[{
                        value: 'point',
                        label: '绘制点',
                    },{
                        value: 'line',
                        label: '绘制线',
                    },{
                        value: 'polygon',
                        label: '绘制面',
                    },{
                        value: 'file',
                        label: '上传文件',
                    },{
                        value: 'complete',
                        label: '整个图层',
                    },{
                        value: 'xz1',
                        label: '乡镇1',
                        children: [{
                            value: 'c1',
                            label: '村1',
                        }, {
                            value: 'c2',
                            label: '村2',
                        }],

                    },{
                        value: 'xz2',
                        label: '乡镇2',
                        children: [{
                            value: 'c3',
                            label: '村1',
                        }, {
                            value: 'c4',
                            label: '村2',
                        }, {
                            value: 'c5',
                            label: '村3',
                        }],
                        
                    }  
                 ],
                 objoptions:[],
                 objvalue:'',
                 exportShow:false,
                 sqloptions:[],
                 dyxy:'<>',
                 xy:'<',
                 xydy:'<=',
                 tablename:'',
                 sqlsearch:'',
                 timer:null,
                 allobjtext:[],
                 arronlyvalue:[],
                 curclickobj:'',
                 updatadrawshow:false    
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
            },
            optionslayer1value(value){
                console.log("value",value);
                this.drawPointShow = false;
                this.drawLineShow = false;
                this.drawPolyShow = false;
                this.barlineShow = false;
                this.map.removeInteraction(this.insectdraw);
                this.map.removeLayer(this.insectvector);
                this.map.removeLayer(this.requestLayer); 
                switch(value){
                    case 'point':
                        this.drawPointShow = true;
                        this.insecttype  = 'Point';
                        this.drawInsect();
                    break;
                    case 'line':
                        this.drawLineShow = true;
                        this.insecttype  = 'LineString';
                        this.drawInsect();
                    break;
                    case 'polygon':
                        // this.drawPolyShow = true;
                        this.insecttype  = 'Polygon';
                        this.drawInsect();
                    break;
                    case '上传文件':
                    break;
                    default:
                        console.log("剩余");      
                }
            },
            optionslayer2value(value){
                for(let i in this.optionslayer2){
                    if(value === this.optionslayer2[i].jx){
                        this.tablename = this.optionslayer2[i].label;
                    }
                }
                let url = 'geoserver/WebGisdl/wfs?service=wfs&request=GetFeature&version=1.1.0&outputFormat=application/json&TYPENAME=WebGisdl:'+value;
                dataget(url, '').then(res => {
                    console.log("value2res",res);
                    let pro = res.features[0].properties
                    setTimeout(()=>{
                        for(let i in res.features){
                            this.allobjtext.push(res.features[i].properties);
                        }
                        
                        this.objectadd(pro);
                    },300)
                }).catch(err => {
                    this.$message.error('请求字段数据失败');
                });
            },
            drawInsectPoint(val){
                console.log("insectvector",val);
                
            }
        },
        created() {
            eventBus.$off("username");
            eventBus.$on('countyValue', (message) => {
                console.log("countyValue133",message);
                // window.sessionStorage.setItem('user',message)
            })
        },
        components: {
            countycheck
        },
        mounted() {
            this.initMap();
            this.requestTree();
            this.defaultCheck();
            this.getAllLeaf();
            console.log("global.token",this.$store.state.ConfigBaseURL);
            // this.drawInsect();
            // this.quchong();
        },
        methods: {
            clearsql(){
                this.sqlsearch = '';
            },
            getonlyvalue(){
                let arr = [];
                for(let i in this.allobjtext){
                    for(let item in this.allobjtext[i]){
                        if('"'+item+'"' === this.curclickobj){
                            if(arr.includes('"' + this.allobjtext[i][item]+'"') === false){
                                arr.push('"'+this.allobjtext[i][item]+'"');
                            }
                        }
                    }
                }
                this.arronlyvalue = arr;
            },
            searchName(label){
                let name;
                for(let i in propertyTable){
                    if(propertyTable[i].label === label){
                        return propertyTable[i].value;
                    }
                }
                
            },
            objectadd(value){
                // let arrFea = value.idIndex_;
                for(let item in value){
                    let obj = {
                        value:item,
                        label:item
                    }
                    this.objoptions.push(obj);
                    let item1 = '"'+item +'"'
                    let itemobj = {
                        color:'black',
                        item1:item1
                    }
                    this.sqloptions.push(itemobj);
                }
            },
            clickobjtext(index){
                console.log("index",index);
                for(let i in this.sqloptions){
                    this.sqloptions[i].color = 'black';
                }
                 this.$set(this.sqloptions,index,
                        {
                            color:'blue',
                            item1:this.sqloptions[index].item1
                        });
                this.arronlyvalue = [];
                clearTimeout(this.timer); 
                 this.timer = setTimeout(() =>{
                //这里面写单击事件的逻辑
                   this.curclickobj = this.sqloptions[index].item1;
                }, 300);    //定时器时间
            },
            dbclickobjtext(clickvalue){
                this.arronlyvalue = [];
                this.curclickobj = clickvalue;
                if(this.sqlsearch === ''){
                    this.sqlsearch += clickvalue;
                } else {
                    this.sqlsearch += ' '+clickvalue;
                }
                clearTimeout(this.timer); 
                console.log("cilckvalue",clickvalue);
            },
            dbclickonlytext(onlytext){
                this.sqlsearch += ' '+onlytext;
                // console.log("onlytext",onlytext);
            },
            clickysf(value){
                this.sqlsearch += ' '+ value;
                console.log("cilckvalue1",value);
            },
            getCheckedNodes(node){
                this.optionslayer1value = node[0];
                console.log("node",node);
            },
            getAllLeaf(){
                let arr = [],arr1 = [],arr2 = [],arr3 = [],arr4 = [],result = [];
                for(let i in this.dataTree){
                    if(this.dataTree[i].children.length > 0){
                        arr1.push(this.dataTree[i].children);
                    } else {
                        arr.push(this.dataTree[i]);
                    }
                }
                for(let i in arr1){
                    for(let j in arr1[i]){
                        if(arr1[i][j].children && arr1[i][j].children.length > 0){
                            arr2.push(arr1[i][j].children);
                        } else {
                            arr.push(arr1[i][j]);
                        }
                    }
                }
                for(let i in arr2){
                    for(let j in arr2[i]){
                        if(arr2[i][j].children && arr2[i][j].children.length > 0){
                            arr3.push(arr2[i][j].children);
                        } else {
                            arr.push(arr2[i][j]);
                        }
                    }
                }
                for(let i in arr3){
                    for(let j in arr3[i]){
                        if(arr3[i][j].children && arr3[i][j].children.length > 0){
                            arr4.push(arr3[i][j].children);
                        } else {
                            arr.push(arr3[i][j]);
                        }
                    }
                }
                for(let i in arr4){
                    arr.push(arr4[i]);
                }
                for(let i in arr){
                    if(arr[i].className === 'iconfont icon-zhengque' && arr[i].jx !== '511681PL1+GF2DOM011'){
                        result.push(arr[i]);
                    }
                }
                this.allleaflayers = result;
                this.optionslayer2 = result;
                let obj = {
                    label:'自定义图层',
                    options: this.optionslayer1
                }
                this.optionslayer1all.push(obj);
                let obj1 = {
                    label:'已有图层',
                    options:result
                }
                this.optionslayer1all.push(obj1);
            },
            defaultProps() {

            },
            defaultCheck(){
                // this.$nextTick(() => {
                //     // treeBox 元素的ref   value 绑定的node-key
                //     this.$refs.tree.setChecked('dltb',true); 
                // });
            },
            drawInsect(){
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
                this.insectvector = new VectorLayer({
                    source:source
                });
                let that = this;
                let typeSelect = document.getElementById('insecttype');
                // let draw;
                function addInteraction() {
                    that.map.removeInteraction(that.insectdraw);
                    // let value = typeSelect.value;
                    let value = that.insecttype;
                    console.log("valuellll",value);
                    if(value !== 'None'){
                        that.insectdraw = new Draw({
                            source:source,
                            type: that.insecttype
                        });
                        that.map.addInteraction(that.insectdraw);
                        that.insectdraw.on('drawend',function(evt){
                            that.map.removeInteraction(that.insectdraw);
                            that.updatadrawshow = true;
                            let feature=evt.feature;
                            let geometry=feature.getGeometry();
                            let coordinate=geometry.getCoordinates();
                            that.drawInsectPoint = coordinate;
                            that.geometry = geometry;
                        })
                    }
                }
               
                that.map.addLayer(this.insectvector);
                addInteraction();
                that.drawPoint = that.insectdraw.sketchLineCoords_;
            },
            clearDraw(){
                this.map.removeLayer(this.insectvector);
            },
            reDrawLayer(){
                this.map.removeLayer(this.insectvector);
                this.drawInsect();
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
                this.clicknode = node;
                console.log("node",node);
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
                let layerName = 'WebGisdl:'+layer;
                this.allLayer = [];
                let selectlayer = 
                    new TileLayer({
                        //extent:extent, //可注释
                        source: new TileWMS({
                            url: this.$store.state.ConfigBaseURL+'/geoserver/WebGisdl/wms',
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
                            url: this.$store.state.ConfigBaseURL+'geoserver/dlTest/wms',
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
                 this.layer[0].set("name",'WebGisdl:511681PL1+GF2DOM011');
                
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
                    <span style="{'display':data.value ? 'block':'none'}" >查看</span>
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
                    console.log("valuellll",value);
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
                
                that.map.addLayer(this.vector);
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
                    console.log("this.drawPoint[i]",this.drawPoint[i]);
                    arrpoint1 = this.drawPoint[i].join('%20');
                }
                let test = this.geometry;
                let arrpoint = arrpoint1;
                console.log("arrpoint",arrpoint);
                let wfsVectorSource = new VectorSource({
                    format: new GeoJSON(),
                    url: this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebGisdl%3Adltb%20&outputFormat=application%2Fjson%20&filter=%20%3CFilter%20xmlns=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%20%3CIntersects%3E%20%3CPropertyName%3Eshape%3C/PropertyName%3E%20%3Cgml:Polygon%3E%20%3Cgml:outerBoundaryIs%3E%20%3Cgml:LinearRing%3E%20%3Cgml:coordinates%3E'+arrpoint+'%3C/gml:coordinates%3E%20%3C/gml:LinearRing%3E%20%3C/gml:outerBoundaryIs%3E%20%3C/gml:Polygon%3E%20%3C/Intersects%3E%20%3C/Filter%3E',
                    strategy: bbox,
                    overlaps:false
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
           addChart(resdata){
                let arrFea = [];
                let arrchart = [],arrdl = [],arrdlmj = [],arrtbs = [];
                // for(let item in this.testdata){
                //     arrFea.push(this.testdata[item]);
                // }
                // for(let i in resdata){

                // }
                // for(let i in arrFea){
                //     if(!arrmc.includes(arrFea[i].values_.dlmc)){
                //         arrmc.push(arrFea[i].values_.dlmc);
                //     }
                // }
                console.log("arrFAFSTAD",resdata);
                for(let i in resdata){
                    arrFea.push(resdata[i].properties);
                }
                // let arrdata = arrFea.reduce((obj,item) => {
                //     let find = obj.find(i => i.values_.dlmc === item.values_.dlmc)
                //     let _d = {
                //         ...item,
                //         count:1,
                //         name:item.values_.dlmc,
                //         area:item.values_.tbdlmj
                //     }
                //     find?find.count++:obj.push(_d)
                //     find?find.area += item.values_.tbdlmj:obj.push(_d)
                //     return obj;
                // },[]);
                let arrdata = arrFea.reduce((obj,item) => {
                    let find = obj.find(i => i['511681dltb_dlmc'] === item['511681dltb_dlmc'])
                    let _d = {
                        ...item,
                        count:1,
                        name:item['511681dltb_dlmc'],
                        area:item['511681dltb_tbdlmj']
                    }
                    find?find.count++:obj.push(_d)
                    find?find.area += item['511681dltb_tbdlmj']:obj.push(_d)
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
                    }
                ]
                })
            },
            removeFea(){
                this.barlineShow = false;
                this.map.removeLayer(this.wfsVectorLayer);
            },
            insectPre(type){
                let updata,str = [];
                if(this.optionslayer1value === '' || this.optionslayer2value === ''){
                    this.$message({
                        message: '请先选择两个图层',
                        type: 'warning'
                    });
                    this.loading  = false;
                    return;
                }
                if(this.optionslayer1value === 'point'){
                    if(this.circlewidth === ''){
                        this.$message({
                            message: '请先输入缓冲半径',
                            type: 'warning'
                        });
                        this.loading  = false;
                        return;
                    }
                    if(this.drawInsectPoint === ''){
                        this.$message({
                            message: '请先在地图上绘制点',
                            type: 'warning'
                        });
                        this.loading  = false;
                        return;
                    }
                }
                if(this.optionslayer1value === 'line'){
                    if(this.linewidth === ''){
                        this.$message({
                            message: '请先输入缓冲的距离',
                            type: 'warning'
                        });
                        this.loading  = false;
                        return;
                    }
                    if(this.drawInsectPoint === ''){
                        this.$message({
                            message: '请先在地图上绘制线',
                            type: 'warning'
                        });
                        this.loading  = false;
                        return;
                    }
                }
               
                if(this.optionslayer1value === 'polygon'){
                    if(this.drawInsectPoint === ''){
                        this.$message({
                            message: '请先在地图上绘制面',
                            type: 'warning'
                        });
                        this.loading  = false;
                        return;
                    }
                    for(let i in this.drawInsectPoint[0]){
                        str += '['+this.drawInsectPoint[0][i]+'],';
                    }
                    str = str.substring(0,str.length-1)
                }

                switch(this.optionslayer1value){
                    case 'point':
                        updata = '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd"> <ows:Identifier>JTS:buffer</ows:Identifier> <wps:DataInputs> <wps:Input> <ows:Identifier>geom</ows:Identifier> <wps:Data> <wps:ComplexData mimeType="application/wkt"><![CDATA[POINT('+this.drawInsectPoint[0]+' '+ this.drawInsectPoint[1]+')]]></wps:ComplexData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>distance</ows:Identifier> <wps:Data> <wps:LiteralData>'+this.circlewidth+'</wps:LiteralData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>capStyle</ows:Identifier> <wps:Data> <wps:LiteralData>Round</wps:LiteralData> </wps:Data> </wps:Input> </wps:DataInputs> <wps:ResponseForm> <wps:RawDataOutput mimeType="application/json"> <ows:Identifier>result</ows:Identifier> </wps:RawDataOutput> </wps:ResponseForm> </wps:Execute>';
                    break;
                    case 'line':
                        updata = '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd"> <ows:Identifier>JTS:buffer</ows:Identifier> <wps:DataInputs> <wps:Input> <ows:Identifier>geom</ows:Identifier> <wps:Data> <wps:ComplexData mimeType="application/wkt"><![CDATA[LINESTRING('+this.drawInsectPoint[0][0]+' '+this.drawInsectPoint[0][1]+','+this.drawInsectPoint[1][0]+' '+this.drawInsectPoint[1][1]+ ')]]></wps:ComplexData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>distance</ows:Identifier> <wps:Data> <wps:LiteralData>'+this.linewidth+'</wps:LiteralData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>capStyle</ows:Identifier> <wps:Data> <wps:LiteralData>Round</wps:LiteralData> </wps:Data> </wps:Input> </wps:DataInputs> <wps:ResponseForm> <wps:RawDataOutput mimeType="application/json"> <ows:Identifier>result</ows:Identifier> </wps:RawDataOutput> </wps:ResponseForm> </wps:Execute>';
                    break;
                    case 'polygon':
                        updata = '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd"> <ows:Identifier>vec:IntersectionFeatureCollection</ows:Identifier> <wps:DataInputs> <wps:Input> <ows:Identifier>first feature collection</ows:Identifier> <wps:Data> <wps:ComplexData mimeType="application/json"><![CDATA[{"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"EPSG:4524"}},"features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[['+str+']]},"properties":{},"id":"fid-7c1c5c9d_175afb25bab_-7fff"}]}]]></wps:ComplexData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>second feature collection</ows:Identifier> <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST"> <wps:Body> <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:WebGisdl="http://WebGisdl"> <wfs:Query typeName="WebGisdl:'+this.optionslayer2value+'"/> </wfs:GetFeature> </wps:Body> </wps:Reference> </wps:Input> <wps:Input> <ows:Identifier>intersectionMode</ows:Identifier> <wps:Data> <wps:LiteralData>INTERSECTION</wps:LiteralData> </wps:Data> </wps:Input> </wps:DataInputs> <wps:ResponseForm> <wps:RawDataOutput mimeType="application/'+type+'"> <ows:Identifier>result</ows:Identifier> </wps:RawDataOutput> </wps:ResponseForm> </wps:Execute>';
                    break;
                    case 'file':
                    break;
                    default:
                        updata = '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd"> <ows:Identifier>vec:IntersectionFeatureCollection</ows:Identifier> <wps:DataInputs> <wps:Input> <ows:Identifier>first feature collection</ows:Identifier> <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST"> <wps:Body> <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:WebGisdl="http://WebGisdl"> <wfs:Query typeName="WebGisdl:'+this.optionslayer1value+'"/> </wfs:GetFeature> </wps:Body> </wps:Reference> </wps:Input> <wps:Input> <ows:Identifier>second feature collection</ows:Identifier> <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST"> <wps:Body> <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:WebGisdl="http://WebGisdl"> <wfs:Query typeName="WebGisdl:'+this.optionslayer2value+'"/> </wfs:GetFeature> </wps:Body> </wps:Reference> </wps:Input> <wps:Input> <ows:Identifier>intersectionMode</ows:Identifier> <wps:Data> <wps:LiteralData>INTERSECTION</wps:LiteralData> </wps:Data> </wps:Input> </wps:DataInputs> <wps:ResponseForm> <wps:RawDataOutput mimeType="application/'+type+'"> <ows:Identifier>result</ows:Identifier> </wps:RawDataOutput> </wps:ResponseForm> </wps:Execute>';
                }
                return updata;
            },
            insectLayer(){
                this.map.removeLayer(this.requestLayer); 
                let updata = this.insectPre('json');
                let str1 = [];
                this.loading  = true;
                if(this.optionslayer1value === 'point' || this.optionslayer1value === 'line'){
                    this.instance.regist(updata).then(res => {
                        for(let i in res.data.coordinates[0]){
                            str1 += '['+res.data.coordinates[0][i]+'],';
                        }
                        str1 = str1.substring(0,str1.length-1)
                        let polydata = '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd"> <ows:Identifier>vec:IntersectionFeatureCollection</ows:Identifier> <wps:DataInputs> <wps:Input> <ows:Identifier>first feature collection</ows:Identifier> <wps:Data> <wps:ComplexData mimeType="application/json"><![CDATA[{"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"EPSG:4524"}},"features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[['+str1+']]},"properties":{},"id":"fid-7c1c5c9d_175afb25bab_-7fff"}]}]]></wps:ComplexData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>second feature collection</ows:Identifier> <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST"> <wps:Body> <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:WebGisdl="http://WebGisdl"> <wfs:Query typeName="WebGisdl:'+this.optionslayer2value+'"/> </wfs:GetFeature> </wps:Body> </wps:Reference> </wps:Input> <wps:Input> <ows:Identifier>intersectionMode</ows:Identifier> <wps:Data> <wps:LiteralData>INTERSECTION</wps:LiteralData> </wps:Data> </wps:Input> </wps:DataInputs> <wps:ResponseForm> <wps:RawDataOutput mimeType="application/json"> <ows:Identifier>result</ows:Identifier> </wps:RawDataOutput> </wps:ResponseForm> </wps:Execute>';
                        this.requestinsect(polydata);
                    }).catch(function (error) {
                        this.loading  = false;
                        this.$message.error('相交失败');
                    });
                } else if(this.optionslayer1value === 'file') {
                    console.log("");
                } else {
                    this.requestinsect(updata);
                }
            },
            requestinsect(updata){
                this.instance.regist(updata).then(res => {
                    console.log("res",res);
                    let source = new VectorSource({
                        features: new GeoJSON().readFeatures(res.data),
                    });
                    let styles = [
                        new Style({
                            stroke: new Stroke({
                                color: 'green',
                                width: 1,
                            }),
                            fill: new Fill({
                                color: 'rgba(28, 124, 197, 0.5)',
                            }),
                        })
                    ]
                    this.requestLayer = new VectorLayer({
                        source: source,
                        style: styles,
                    });
                    this.map.addLayer(this.requestLayer); 
                    this.loading  = false;
                    if(this.optionslayer1value === '511681dltb' || this.optionslayer2value === '511681dltb'){
                        this.addChart(res.data.features);
                    }
                }).catch(function (error) {
                    this.loading  = false;
                    this.$message.error('相交失败');
                });
            },
            exportshpLayer(){
                let updata = this.insectPre('zip');
                let str1 = [];
                this.loading  = true;
                if(this.optionslayer1value === 'point' || this.optionslayer1value === 'line'){
                    this.instance.regist(updata).then(res => {
                        console.log("res.data.coordinates[0]",res.data.coordinates[0]);
                        for(let i in res.data.coordinates[0]){
                            str1 += '['+res.data.coordinates[0][i]+'],';
                        }
                        str1 = str1.substring(0,str1.length-1)
                        let polydata = '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd"> <ows:Identifier>vec:IntersectionFeatureCollection</ows:Identifier> <wps:DataInputs> <wps:Input> <ows:Identifier>first feature collection</ows:Identifier> <wps:Data> <wps:ComplexData mimeType="application/json"><![CDATA[{"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"EPSG:4524"}},"features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[['+str1+']]},"properties":{},"id":"fid-7c1c5c9d_175afb25bab_-7fff"}]}]]></wps:ComplexData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>second feature collection</ows:Identifier> <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST"> <wps:Body> <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:WebGisdl="http://WebGisdl"> <wfs:Query typeName="WebGisdl:'+this.optionslayer2value+'"/> </wfs:GetFeature> </wps:Body> </wps:Reference> </wps:Input> <wps:Input> <ows:Identifier>intersectionMode</ows:Identifier> <wps:Data> <wps:LiteralData>INTERSECTION</wps:LiteralData> </wps:Data> </wps:Input> </wps:DataInputs> <wps:ResponseForm> <wps:RawDataOutput mimeType="application/zip"> <ows:Identifier>result</ows:Identifier> </wps:RawDataOutput> </wps:ResponseForm> </wps:Execute>';
                        this.requestinsectzip(polydata);
                    }).catch(function (error) {
                        this.loading  = false;
                        this.$message.error('相交失败');
                    });
                } else if(this.optionslayer1value === 'file'){
                    console.log('');
                } else{
                    this.requestinsectzip(updata);
                }
                
            },
            requestinsectzip(updata){
                let fileName = 'InsectLayer';
                this.instanceget.download(updata).then(res => {
                    let blob = new Blob([res.data], {
                            type: 'application/zip'
                        })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = fileName
                    link.click()
                    //释放内存
                    window.URL.revokeObjectURL(link.href) 
                    this.loading  = false;
                }).catch(function (error) {
                    this.loading  = false;
                    this.$message.error('导出失败');
                });
            },
            exportRangeShp(){
                console.log("this.optionslayer1value",this.optionslayer1value);
                if(this.optionslayer1value === ''){
                    this.$message({
                        message: '请先选择范围',
                        type: 'warning'
                    });
                }
                if(this.optionslayer2value === ''){
                    this.$message({
                        message: '请先选择图层',
                        type: 'warning'
                    });
                }
                console.log("this.objvalue",this.objvalue);
                let url;
                if(this.objvalue.length > 0){
                    let obj = this.objvalue.join();
                    url = this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wfs?service=wfs&request=GetFeature&version=1.1.0&outputFormat=SHAPE-ZIP&TYPENAME=WebGisdl:'+this.optionslayer2value+'&propertyName=shape,'+obj;
                } else if (this.objvalue.length === 0){
                    url = this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/wfs?service=wfs&request=GetFeature&version=1.1.0&outputFormat=SHAPE-ZIP&TYPENAME=WebGisdl:'+this.optionslayer2value;
                }
                
                let fileName = 'ResultLayer';
                // let url =
                //     this.$store.state.ConfigBaseURL+'geoserver/WebGisdl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WebGisdl:' +
                //     this.optionslayer2value + '&outputFormat=SHAPE-ZIP'+'&propertyName='+test;
                this.exportShow = true;
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
                    this.exportShow = false;
                }).catch(error => this.$message.error(error))
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

    .deltext{
        // float:right;
        color:blue;
        margin-left: 10px;
        font-size: 12px;
    }
    .sqledit{
        border: 1px solid gray;
        margin: 10px;
        height: 400px;
    }
    .objtext{
        margin: 10px;
        border: 1px solid gray;
        height: 80px;
        overflow-y: scroll;
    }
    .parent{
        display:flex;
        width:100%;
        height:150px;
        flex-wrap: wrap;
    }
    .son1{
        margin: 10px;
        flex:1;
        display: flex;
        flex-wrap: wrap;
        width: 50%;
        // border: 1px solid gray;
    }
    .grand{
        margin: 3px;
        height: 16%;
        width: 25%;
    }
    .son2{
        margin: 10px;
        flex:1;
        // flex-wrap: wrap;
        width: 50%;
    }
    .grand1{
        border: 1px solid gray;
        overflow: scroll;
        height: 100px;
        // flex-wrap: wrap;
    }
    .grand2{
        margin-top: 5px;
        //  height: 20%;
        // flex-wrap: wrap;
    }
    .sqlmb{
        border: 1px solid #F3F4F4;
        background-clip: padding-box;
        box-shadow: 0 1px 1px #F3F4F4;
        background: #F3F4F4;
        border-radius: 5px;
        position:relative;
        margin-left: 10px;
    }
    
    .info-textarea{
        font-family:"微软雅黑";
        font-size: 14px;
    }
    .sharebutton{
        text-align:center;
        margin-top:20px;
    }
</style>