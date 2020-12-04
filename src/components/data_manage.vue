<template>
    <div class="dataman" ref="dataman">
        <div style="display:flex;">
            <div  style="width:200px;background:#DBF1FD;margin-top:50px;">
                <div style="text-align:center">区县选择</div>  
                <el-tree 
                    :data="optionscounty"  
                    show-checkbox 
                    node-key="value" 
                    ref="countytree" 
                    highlight-current
                    :default-expanded-keys="[51, 5116]"
                    :default-checked-keys="defalutcounty"
                    check-on-click-node :props="defaultProps" 
                    :check-strictly="true" 
                    @node-click="countyClick"
                    @check="getCountyKeys"
                    style="background:#DBF1FD;margin-top:10px;">
                </el-tree>
                <div style="width:200px;background:#DBF1FD;"></div>
            </div>
            <div  class="selcounty" style="width:200px;background:#DBF1FD;margin-top:50px;">
                <div>查询数据类型</div>
                <div style="width:200px;background:#DBF1FD;"></div>
                <el-tree 
                    :data="optionsdatatype"  
                    show-checkbox 
                    default-expand-all 
                    node-key="code" 
                    ref="datatree" 
                    highlight-current
                    check-on-click-node :props="defaultProps" 
                    :check-strictly="true" 
                    @check="getDatatypeKeys"
                    style="background:#DBF1FD;margin-top:10px;">
                </el-tree>
            </div>
            <div style="flex:1;">
                <div>
                    <el-button type="primary" @click="searchFile" style="margin-top:50px;">查询</el-button>
                    <span style="margin-left:20px;">{{searchTitle}}</span>
                    <div style="text-align:center;">
                    <el-button class="download" type="primary" size="small" @click="downLoad" v-show="fileSelect">下载文件</el-button>
                    <el-button type="danger" v-show="fileSelect"  size="small" @click="open">删除</el-button>
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
                            :on-change="handleChange1"
                            :auto-upload="false">
                            <el-button slot="trigger" type="primary" size="small" v-show="fileSelect">选择文件</el-button>
                            <el-button type="success" 
                            @click="submitUpload1" id="changeFileList" size="small" style="margin-left: 10px;" v-show="fileSelect">重新上传</el-button>
                            <div slot="tip" class="el-upload__tip" v-show="fileSelect">只能上传.zip文件</div>
                            <!-- <span slot="tip" class="el-upload__tip" style="color: red;width:200px;">{{message}}</span> -->
                    </el-upload>
                    <el-progress v-if="loading1" :percentage="percentage1" :color="colors" class="progress" style="margin:0 30%;"></el-progress>
                    <!-- </span> -->
                    </div>
                     <div><downpro/></div>
                </div>
                <div class="uploadpart">
                    <div style="margin-top:100px;">
                        <span class="seldata">请选择上传数据类型：</span>
                        <el-select  @change="dataTypeChange" v-model="datavalue" placeholder="仅上传文件选择">
                            <el-option
                            v-for="item in allTypeId"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <span class="selyear">请选择年份：</span>
                        <el-date-picker
                            v-model="value3"
                            type="year"
                            placeholder="仅上传文件选择" @change="clickyear"></el-date-picker>
                    </div>
                    <div class="upload">
                    <div class="uploadFile">
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
                        </el-upload>
                        <el-progress v-if="loading" :percentage="percentage" :color="colors" class="progress" style="margin:0 30%;"></el-progress>
                    </div>
                </div>
            </div>
            </div>
        </div>
        
        </div>
</template>

<script>
// import county_select from './countySelect.vue'
// import JsZip from 'jszip'

import {axios} from "axios"
import {post} from '../api/post.js'
import {dataget} from '../api/get.js'
import {postaxios} from "../api/request.js"
import downpro from "./downprogress.vue"
import { eventBus } from '../main'
import { parse } from 'qs'
// import test from "../api/request.js"
// import {testaxios} from "axios.js"

let id = 1000;

export default {
    components: {
        downpro
    },
    props:{
        
        value: {
            // type: Array,
            default () {
            return [];
            }
      },
    },
    watch: {
      visible(value) {
        if (value) {
            console.log("empty");
        } else {
          clearInterval(this.interval);
          this.loading = false;
        }
      },
      clientHeight() {
            // this.$refs.sycontent.style.background = this.clientHeight + ' '+this.clientWidth;
            this.changeFixed(this.clientHeight);
            // this.initMap();
        },
        clientWidth() {
            this.changeFixedw(this.clientWidth);
        },
    },
    data() {
        return {
            downloading:false,
            defalutcounty:[511681],
            downpercentage:0,
            loading: false,
            loading1: false,
            percentage:0,
            percentage1:0,
            interval:0,//加载的定时
            colors:[
                {color: '#FEEA53', percentage: 20},
                {color: '#FCB852', percentage: 40},
                {color: '#52A1FC', percentage: 60},
                {color: '#50EDFC', percentage: 80},
                {color: '#5FFC77', percentage: 100}
            ],
            sunmitShow:false,
            // helloTaskId:'',
            imgFlag: false,
            message:'',
            Wordmessage:'', //输入不能为空提示
            fileNmae:'',
            wordFlag:false,
            dataTree:[],
            optionscounty:[],
            optionsdatatype:[],
            uploadFile:'',
            uploadFile1:'',
            countyValue:[],
            value3:'',
            yearValue:'',
            dataValue:'',
            defaultProps: {
            children: 'children',
            label: 'label',
            countyCode:'',
            tempArr:[],
            formData:'',
            // percent:'',
            // submitFlag:false,
            },
            countyNode:'511681',
            datatypeNode:[],
            uploadShow:true,
            downShow:false,
            typeId:'',
            datavalue:'',
            allTypeId:[],
            uploadDataType:'',
            thirdType1:[],
            thirdType2:[],
            searchTitle:'',
            fileSelect:false,
            editCheckId:'',
            clientHeight: '',
            clientWidth: '',
        }
    },
    mounted(){
        this.requestCounty();
        this.requestDataType();
        this.requestTypeId();
    },
    methods:{
        changeFixed(clientHeight) { // 动态修改样式
            // this.$refs.dataman.style.height = clientHeight + 'px';
        },
        changeFixedw(clientWidth) { // 动态修改样式
        
        },
         outlineDo(data) {
             console.log("data",data);
            // const newChild = { id: id++, label: 'testtest', children: [] };
            // if (!data.children) {
            // this.$set(data, 'children', []);
            // }
            // data.children.push(newChild);
        },
        clickvalue () {
            this.countyCode = this.countyValue[2];
            console.log("this.countyValue",this.countyValue)
        },
        clickdata(){
            console.log("this.dataValue",this.dataValue);
        },
        clickyear() {
            let str = String(this.value3);
            this.yearValue = str.substring(11,15);
            // this.downLoad();
        },
        dataTypeChange(params){
            this.uploadDataType = params;
        },
        getCountyKeys(item,node){
            // let node = this.$refs.countytree.getCheckedNodes();
            // console.log("item",item);
            // console.log("node",node);
            this.$refs.countytree.setCheckedNodes([item]);
            this.countyNode = item.value;
        },
        countyClick(item,node,self){
            this.editCheckId=item.value;
            this.$refs.countytree.setCheckedNodes([item])
        },
        getDatatypeKeys(item,node){
            // let node = this.$refs.datatree.getCheckedNodes();
            this.$refs.datatree.setCheckedNodes([item]);
            this.datatypeNode = item;
        },
        requestDataType(){
            // console.log("this.countyNode",this.countyNode);
            this.optionsdatatype = [];
            let that = this;
            dataget("dataManage/getTree.do",'').then(res=>{ 
                console.log("resdata",res.data);
                // this.optionsdatatype = res.data
                let num = 0;
                for(let i in res.data){
                    let arr2 = [];
                    let obj1 = {
                        code:num++,
                        label:res.data[i].data.name,
                        children:res.data[i].children
                    };
                    // console.log("obj1",obj1);
                    for(let j in obj1.children){
                        let arr3 = [];
                        let obj2 = {
                            code:num++,
                            id:obj1.children[j].data.code,
                            label:obj1.children[j].data.name,
                            children:obj1.children[j].children,
                            outline:'离线发布',
                            color:'gray'
                        };
                        arr2.push(obj2);
                        let len = obj1.children[j].children;
                        let name = obj1.children[j].data.name;
                        if(len !== undefined && name === '永久基本农田'){
                            this.thirdType1 = obj1.children[j].children;
                        } else if(len !== undefined && name === '部下发用地管理信息'){
                            this.thirdType2 = obj1.children[j].children;
                        }
                        
                    }
                    let obj12 = {
                        code:num++,
                        label:res.data[i].data.name,
                        children:arr2
                    }
                    that.optionsdatatype.push(obj12);
                }
                // console.log("this.thirdType1",this.thirdType1);
                // console.log("this.thirdType2",this.thirdType2);
                if(this.thirdType1.length > 0){
                    that.optionsdatatype[2].children[0].children = [];
                    let arr = [];
                    for(let i in this.thirdType1){
                        let obj = {
                            code:num++,
                            id:this.thirdType1[i].data.code,
                            label:this.thirdType1[i].data.name
                        }
                        that.optionsdatatype[2].children[0].children.push(obj);
                        // arr.push(obj);
                    }
                    // that.optionsdatatype[2].children[0] = arr;
                }
                if(this.thirdType2.length > 0){
                    that.optionsdatatype[2].children[1].children = [];
                    let arr = [];
                    for(let i in this.thirdType2){
                        let obj = {
                            code:num++,
                            id:this.thirdType2[i].data.code,
                            label:this.thirdType2[i].data.name
                        }
                        that.optionsdatatype[2].children[1].children.push(obj);
                        // arr.push(obj);
                    }
                }
                console.log("that.optionsdatatype",that.optionsdatatype);
            }).catch(err=>{
                console.log("失败");
            });
        },
        requestCounty() {
            let that = this;
            dataget("commom/getCityTree.do",'').then(res=>{  
            console.log("dizhi",res);
                if(res.code === 0){
                    that.optionscounty = res.data;
                } else {
                    that.$router.push({//你需要接受路由的参数再跳转
                        path: '/login'
                    });
                }
            }).catch(err=>{
            console.log("失败");
            });
        },
        requestTypeId(){
            let that = this;
            dataget("dataManage/getResultType.do",'').then(res=>{  
                if(res.code === 0){
                    this.allTypeId = res.data;

                }
            }).catch(err=>{
                console.log("失败");
            });
        },
        handleChange(file, fileList) {
            this.uploadFile = file.raw;
        },
        handleChange1(file, fileList) {
            this.uploadFile1 = file.raw;
        },
        handleExceed(files,fileList){
            this.$message({
                showClose: true,
                message: '只允许上传一个文件',
                type: 'warning'
            });
        },
        handleError(err, file, fileList){
            this.message="上传失败";
        },
        handleSuccess(response, file, fileList){
            this.message="上传成功";
        },
        submitUpload() {
            let fileObject = this.uploadFile;
            console.log("fileObject",fileObject);
            console.log("this.countyCode",this.countyNode);
            console.log("this.yearValue",this.yearValue);
            this.formData = new FormData();
            this.formData.append("dm", this.countyNode);
            this.formData.append("year", this.yearValue);
            this.formData.append("typeId", this.uploadDataType);
            this.formData.append("file", fileObject);
            this.uploadingFile = fileObject;
            let config = {
                onUploadProgress: progressEvent => {
                    let num = (progressEvent.loaded / progressEvent.total * 100).toFixed(1) || 0;
                    this.percentage = Number(num);
                }
            }
            let that = this;
            if(this.countyNode !== '' && this.yearValue !== '' && this.uploadDataType !== ''){
                this.loading = true;
                post('dataManage/upload.do', this.formData, config).then(res=>{  
                    if(res.code === 0){
                        this.$message({
                            type: 'success',
                            message: '上传解析成功',
                        });
                        this.uploadingFile.status = 'success';
                        this.loading = false;
                        this.percentage = 0;
                        that.requestDataType();
                    } else if(res.code === 1){
                        console.log("res",res);
                        let msg = '';
                        for(let i in res.data){
                            msg += res.data[i]+'</br>';
                        }
                        this.$alert(msg, '缺少以下文件', {
                            confirmButtonText: '确定',
                            dangerouslyUseHTMLString:true,
                            callback: action => {
                                // this.$message({
                                // type: 'info',
                                // // message: `action: ${ msg }`
                                // });
                            }
                        });
                    }
                }).catch(err=>{
                    console.log("失败");
                });
            } else {
                this.$message({
                    showClose: true,
                    message: '请先选择区县，数据类型和年份',
                    type: 'warning'
                });
            }
        },
        submitUpload1() {
            let fileObject = this.uploadFile1;
            this.formData = new FormData();
            this.formData.append("dm", this.countyNode);
            this.formData.append("year", this.datatypeNode.label);
            this.formData.append("typeId", this.datatypeNode.id);
            this.formData.append("file", fileObject);
            this.uploadingFile = fileObject;
            let config = {
                onUploadProgress: progressEvent => {
                    let num = (progressEvent.loaded / progressEvent.total * 100).toFixed(1) || 0;
                    this.percentage1 = Number(num);
                }
            }
            let that = this;
            this.loading1 = true;
            post('dataManage/upload.do', this.formData, config).then(res=>{  
                if(res.code === 0){
                    this.$message({
                        type: 'success',
                        message: '上传解析成功',
                    });
                    this.uploadingFile.status = 'success';
                    this.loading1 = false;
                    this.percentage1 = 0;
                    that.requestDataType();
                } else if(res.code === 1){
                    console.log("res",res);
                    let msg = '';
                    for(let i in res.data){
                        msg += res.data[i]+'</br>';
                    }
                    this.$alert(msg, '缺少以下文件', {
                        confirmButtonText: '确定',
                        dangerouslyUseHTMLString:true,
                        callback: action => {
                            // this.$message({
                            // type: 'info',
                            // // message: `action: ${ msg }`
                            // });
                        }
                    });
                }
            }).catch(err=>{
                console.log("失败");
            });
           
        },
        handleRemove(file, fileList) {
            console.log(file, fileList,"删除");
            this.loading = false;
            this.percentage = 0;
        },
        handlePreview(file) {
            console.log(file,"已上传的文件时的钩子");
        },
        append(data) {
            const newChild = { id: id++, label: 'testtest', children: [] };
            if (!data.children) {
            this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        },

        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },

        // renderContent(h, { node, data, store }) {
        //     return (
        //     <span class="custom-tree-node">
        //         <span>{node.label}</span>
        //         <span>
        //         <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
        //         <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
        //         </span>
        //     </span>);
        // },
        downLoad(){
            this.downpercentage = 0;
            const data ={
                dm: this.countyNode,
                year:this.datatypeNode.label,
                typeId:this.datatypeNode.id
            }
            eventBus.$emit("getpro",data);
        },
        // renderContent1(h,{node, data, store}){
        //     let content = <span class="custom-tree-node">
        //         <i class={data.className}></i>
        //         <span style="margin-left:5px;">{node.label}</span>
        //         </span>;
        //     return (content);
        // },
        searchFile(){
            this.fileSelect = false;
            this.searchTitle = '';
            let that = this;
            let formData = new FormData();
            formData.append("dm", this.countyNode);
            formData.append("year", this.datatypeNode.label);
            formData.append("typeId", this.datatypeNode.id);
            console.log("this.datatypeNode",this.datatypeNode.length);
            if(this.countyNode !== '' && this.datatypeNode.length !== 0){
                post('dataManage/check.do', formData).then(res=>{  
                    console.log("reswqdew",res);
                    if (res.code === 1) {
                        this.$message({
                            showClose: true,
                            message: '没有查询到此文件，可在下方上传新的对应文件'
                        });
                        this.uploadShow = true;
                    } else if(res.code === 0){
                        this.searchTitle = res.msg;
                        this.fileSelect = true;
                    }
                }).catch(err=>{
                    console.log("失败");
                });
            } else {
                this.$message({
                    type: 'warning',
                    message: '请先选择区县以及数据类型的年份',
                });
            }
            
        },
        open(){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.searchTitle = '';
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        renderContent(h,{node, data, store}){
            // return (
            //     <span class="custom-tree-node">
            //         <span>{node.label}</span>
            //         <span>
            //         <el-button size="mini" type="text" on-click={ () => this.outlineDo(data) }>离线发布</el-button>
            //         </span>
            //     </span>);
            let content = <span class="custom-tree-node" disabled>
                <span>{node.label}</span>
                <span>
                    <el-button size="mini" type="text" on-click={ () => this.outlineDo(data) }>离线发布</el-button>
                </span>
                </span>;
            return (content);
        },
    }
}
</script>

<style lang="less">
   
    .uploadFile{
       margin-top: 3%;
       text-align: center;
      
    }
   .download{
       margin-top:10%;
   }
   .uploadpart{
       text-align: center;
       margin-top:100px;
       margin-left:200px;
       margin-right:200px;
    //    background: #E2E6E6;
    //    width:600px;
       /* position: absolute; */
   }
   .upload-demo{
        margin-top:20px;
   }
    .el-tree-node {
        .is-leaf+.el-checkbox .el-checkbox__inner {
            display: inline-block;
        }

        .el-checkbox__input>.el-checkbox__inner {
            display: none;
        }
    }
    .selcounty{
        //  background: linear-gradient(#00faff, #00faff) left top,
        // linear-gradient(#00faff, #00faff) left top,
        // linear-gradient(#00faff, #00faff) right top,
        // linear-gradient(#00faff, #00faff) right top,
        // linear-gradient(#00faff, #00faff) left bottom,
        // linear-gradient(#00faff, #00faff) left bottom,
        // linear-gradient(#00faff, #00faff) right bottom,
        // linear-gradient(#00faff, #00faff) right bottom;
        // background-repeat: no-repeat;
        // background-size: 2px 5px, 5px 2px;
        // border: 1px solid blue;
        // width:200px;
        // height: 500px;
        // position:relative;
        // margin-left: 10px;
        // margin-top: 20px;
        // border: 1px solid #043E8A;
        // background-clip: padding-box;
        // box-shadow: 0 1px 1px #043E8A;
        // background: #C7D9FB;
        // border-radius: 5px;
        border-left:1px solid white;
    }
     /* .el-tree-node {
        .is-leaf + .el-checkbox .el-checkbox__inner {
            display:inline-block;
        }
        .el-checkbox__input> .el-checkbox__inner {
            display:none;
        }
    } */
    // .data_man{
    //     width: 100%;
    //     /* height: 100%; */
    //     // position: absolute;
    //     // top: 0;
    //     // left: 0;
    //     z-index: 5;
    //     // background: chocolate;
    // }
.image-border {
	position: absolute;
	width: 20px;
    height: 20px;
    z-index: 999;
}
		
.image-border1 {
	top: 0px;
	left: 0px;
	border-left: 5px solid #043E8A;
	border-top: 5px solid #043E8A;
}
		
.image-border2 {
	top: 0;
	right: 0px;
	border-right: 5px solid #043E8A;
	border-top: 5px solid #043E8A
}
		
.image-border3 {
	bottom: 0;
	left: 0;
	border-bottom: 5px solid #043E8A;
	border-left: 5px solid #043E8A;
}
		
.image-border4 {
	bottom: 0;
	right: 0px;
	border-right: 5px solid #043E8A;
	border-bottom: 5px solid #043E8A;
}
.dataman{
    // width: 400px;
    // position: absolute;
    // top: 0;
    // left: 0;
    z-index: 1;
    height: 100%;
    // background:#F3F4F4;
    // background-image: linear-gradient(#DBF1FD, #DBF1FD);

}
</style>