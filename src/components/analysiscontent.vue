<template>
    <div class="analysistree">
        <div class="leftpart" style="width:300px;">
            <el-tree :data="dataTree" show-checkbox default-expand-all node-key="label" ref="tree" highlight-current
                check-on-click-node :props="defaultProps" :check-strictly="true" :render-content="renderContent"
                :default-checked-keys='resourceCheckedKey' @check="getCheckedKeys">
            </el-tree>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataTree: [{
                        label: '调查成果',
                        children: [{
                            label: '三次调查成果',
                            children: [{
                                label: '境界与政区',
                                children: [{
                                    value: 0,
                                    label: '行政区',
                                    jx: 'xzq',
                                    className: 'iconfont icon-zhengque'
                                }, {
                                    value: 0,
                                    label: '村级调查区',
                                    jx: 'cjdcq',
                                    className: 'iconfont icon-zhengque'
                                }]
                            }, {
                                label: '地貌',
                                children: [{
                                    value: 0,
                                    label: '坡度图',
                                    jx: 'pdt',
                                    className: 'iconfont icon-zhengque'
                                }]
                            }, {
                                label: '土地利用',
                                children: [{
                                    value: 0,
                                    label: '地类图斑',
                                    jx: 'dltb',
                                    className: 'iconfont icon-zhengque'
                                }]
                            }, {
                                label: '永久基本农田',
                                children: [{
                                    value: 0,
                                    label: '永久基本农田图斑',
                                    jx: 'yjjbnttb',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }]
                            }, {
                                label: '其他土地要素',
                                children: [{
                                    value: 0,
                                    label: '临时用地',
                                    jx: 'lsyd',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    value: 0,
                                    label: '批准未建设土地',
                                    jx: 'pzwjstd',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    value: 0,
                                    label: '城镇村等用地',
                                    jx: 'czcdyd',
                                    className: 'iconfont icon-zhengque'
                                }, {
                                    value: 0,
                                    label: '重要项目用地',
                                    jx: 'zyxmyd',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    value: 0,
                                    label: '开发园区',
                                    jx: 'kfyq',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    value: 0,
                                    label: '光伏板区',
                                    jx: 'gfbq',
                                    className: 'iconfont icon-gantanhao-yuankuang'
                                }, {
                                    value: 0,
                                    label: '推土区',
                                    jx: 'ttq',
                                    className: 'iconfont icon-zhengque'
                                }, {
                                    value: 0,
                                    label: '拆除未尽区',
                                    jx: 'ccwjq',
                                    className: 'iconfont icon-zhengque'
                                }, {
                                    value: 0,
                                    label: '路面范围',
                                    jx: 'lmfw',
                                    className: 'iconfont icon-zhengque'
                                }]
                            }]
                        }]
                    },
                    {
                        label: '监测成果',
                        children: [{
                            value: 0,
                            label: '2019年监测图斑',
                            className: 'iconfont icon-zhengque',
                            jx: '511681sdjctb_2019'
                        }, {
                            value: 0,
                            label: '2018年监测图斑',
                            className: 'iconfont icon-zhengque',
                            jx: '511681jctb_2018'
                        }, {
                            value: 0,
                            label: '2017年监测图斑',
                            className: 'iconfont icon-zhengque',
                            jx: '511681jctb1_2017'
                        }]
                    }, {
                        label: '影像成果',
                        children: [{
                            value: 1,
                            label: '三次调查底图',
                            className: 'iconfont icon-zhengque',
                            jx: '511681PL1+GF2DOM011'
                        }]
                    }, {
                        label: '相关业务数据',
                        children: [{
                            value: 0,
                            label: '永久基本农田',
                            className: 'iconfont icon-zhengque',
                            jx: 'jbntbhtb'
                        }, {
                            label: '部下发用地管理信息',
                            children: [{
                                label: '2019年',
                                children: [{
                                    value: 0,
                                    label: '农用地转用',
                                    className: 'iconfont icon-zhengque',
                                    jx: 'nzyxmtb_2010_2019_511681'
                                }, {
                                    value: 0,
                                    label: '土地整理',
                                    className: 'iconfont icon-zhengque',
                                    jx: 'tdzzysxmtb_2011_2018_511681'
                                }]
                            }]
                        }]
                    }
                ],
                resourceCheckedKey:['三次调查底图'],
            }
        },
        methods: {
            defaultProps() {

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
            renderContent(h,{node, data, store}){
                let content = <span class="custom-tree-node">
                    <i class={data.className}></i>
                    <span style="margin-left:5px;">{node.label}</span>
                    </span>;
                return (content);
            },
        }
    }
</script>

<style scoped>
    .analysistree {
        display: flex;
    }
</style>