<template>
    <div>
        <el-button type="success" plain @click="handleAddClick">增加</el-button>
        <el-table :data="tableData" border style="width: 100%">
            <!-- <el-table-column prop="date" label="日期" width="180">
            </el-table-column> -->
            <el-table-column prop="name" label="行政区名称" width="180">
            </el-table-column>
            <el-table-column prop="code" label="行政区代码" width="180">
            </el-table-column>
            <!-- <el-table-column prop="phone" label="电话" width="180">
            </el-table-column> -->
            <el-table-column prop="layer" label="默认加载图层">
            </el-table-column>

            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleEditClick(scope.$index,scope.row)" size="mini">编辑
                    </el-button>
                    <el-button type="danger" size="mini" @click="handleDelClick(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="修改用户" :visible.sync="editBox" width="50%" :before-close="handleClose">
            <el-form ref="form" label-width="100px" v-model="user">
                <!-- <el-form-item label="时间:">
                    <el-input placeholder="请输入时间" maxlength="50" v-model="user.date"></el-input>
                </el-form-item> -->
                <!--                <el-form-item label="时间:">-->
                <!--                    <el-date-picker-->
                <!--                            v-model = "user.date"-->
                <!--                            type="date"-->
                <!--                            placeholder="选择日期">-->
                <!--                    </el-date-picker>-->
                <!--                </el-form-item>-->
                <el-form-item label="行政区名称:">
                    <el-input placeholder="行政区名称" maxlength="50" v-model="user.name"></el-input>
                </el-form-item>
                <el-form-item label="行政区代码:">
                    <el-input placeholder="请输入行政区代码" maxlength="50" v-model="user.code"></el-input>
                </el-form-item>
                <!-- <el-form-item label="电话:">
                    <el-input placeholder="请输入电话" maxlength="50" v-model="user.phone"></el-input>
                </el-form-item> -->
                <el-form-item label="默认加载图层:">
                    <el-input placeholder="请输入图层" maxlength="50" v-model="user.layer"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleEditUser">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加用户" :visible.sync="addBox" width="50%" :before-close="handleClose">
            <el-form ref="form" label-width="100px" v-model="addUserData">
                <!-- <el-form-item label="时间:">
                    <el-date-picker v-model="addUserData.date" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item> -->
                <el-form-item label="行政区名称:">
                    <el-input placeholder="行政区名称" maxlength="50" v-model="addUserData.name"></el-input>
                </el-form-item>
                <el-form-item label="行政区代码:">
                    <el-input placeholder="请输入行政区代码" maxlength="50" v-model="addUserData.code"></el-input>
                </el-form-item>
                <!-- <el-form-item label="科室:">
                    <el-input placeholder="请输入科室" maxlength="50" v-model="addUserData.keshi"></el-input>
                </el-form-item> -->
                <el-form-item label="默认加载图层:">
                    <el-input placeholder="请输入图层" maxlength="50" v-model="addUserData.layer"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleAddUser">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>


<script>
    export default {
        name: "TableData",
        data() {
            return {
                tableData: [{
                    // date: '2016-03-02',
                    name: '四川省广安市',
                    code:'511600',
                    layer:'行政区、村级调查图、三次调查底图'
                   
                }, {
                    name: '四川省广安市',
                    code:'511600',
                    layer:'行政区、村级调查图、三次调查底图、举证成果、地类图斑、2019年监测图斑'
                }, {
                    name: '四川省广安市',
                    code:'511600',
                    keshi:'耕地保护监督科',
                    layer:'三次调查底图、举证成果、地类图斑、永久基本农田'
                }, {
                    name: '四川省广安市',
                    code:'511600',
                    keshi:'耕地保护监督科',
                    layer:'坡度图、路面范围、推图区、城镇村等用地'
                }],
                addBox: false,
                editBox: false,
                user: {},
                editIndex: "",
                addUserData: {
                    date: "",
                    name: "",
                    address: ""
                }
            }
        },
        methods: {
            handleEditClick(index, row) {
                this.editBox = true
                this.user = row
                this.editIndex = index
            },

            // eslint-disable-next-line no-unused-vars
            handleDelClick(index, row) {
                this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData.splice(index, 1)
                    this.$message({
                        showClose: true,
                        message: "删除成功",
                        type: 'success'
                    });
                })
            },
            handleClose(done) {
                done();
            },
            handleEditUser() {
                this.tableData.splice(this.editIndex, 1, this.user)
                this.$message({
                    showClose: true,
                    message: "修改成功",
                    type: 'success'
                });
                this.editBox = false
            },
            handleAddClick() {
                this.addBox = true
            },
            handleAddUser() {
                // let strDate = dateFormat("YYYY-mm-dd", this.addUserData.date)
                // this.addUserData.date = strDate
                this.tableData.push(this.addUserData)
                this.addBox = false
                this.addUserData = {}
                this.$message({
                    showClose: true,
                    message: "添加成功",
                    type: 'success'
                });
            }
        }
    }

    function dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(), // 年
            "m+": (date.getMonth() + 1).toString(), // 月
            "d+": date.getDate().toString(), // 日
            "H+": date.getHours().toString(), // 时
            "M+": date.getMinutes().toString(), // 分
            "S+": date.getSeconds().toString() // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
        }
        return fmt;
    }
</script>

<style>
.v-modal{
    position: relative;
    z-index: 1;
}

</style>