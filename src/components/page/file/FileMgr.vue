<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 文件管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="文件名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-lx-add" @click="handleUpload">上传</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" size="mini">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column prop="orgName" label="原文件名" style="word-break: break-all"/>
                <el-table-column prop="name" label="文件名"/>
                <el-table-column prop="suffix" label="格式"/>
                <el-table-column prop="path" label="相对路径"/>
                <el-table-column prop="size" label="文件大小">
                    <template slot-scope="scope">
                        <span v-if="scope.row.size <= 1000">{{scope.row.size}}</span>
                        <span v-if="scope.row.size > 1000 && scope.row.size <= 1000000">{{Math.round(scope.row.size / 1000) + " K"}}</span>
                        <span v-if="scope.row.size > 1000000">{{(scope.row.size / 1000000).toFixed(2) + " M"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" >
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | dateTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-lx-down" @click="handleDownload(scope.$index, scope.row)">下载</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 弹出框 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
            <el-upload class="upload-demo" drag :action="urlUpload" multiple :on-success="getData">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">文件大小不能超过200M</div>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            urlSearch: "/file/queryPage",
            urlUpload: this.$rootUrl + "/file/upload",
            urlType: "/user/getTypeMap",
            urlAddOrEdit: "/user/addOrEdit",
            urlDel: "/file/del",
            urlDownload: "/file/download",
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            dialogVisible: false,
            pageTotal: 0,
            form: {
                id: "",
                name: "",
                type: "",
            },
            idx: -1,
            id: -1,
            title: "",
            types: {}
        };
    },
    created() {
        this.getTypes();
        this.getData();
    },
    methods: {
        getData() {
            this.$axios.post(this.$rootUrl + this.urlSearch, this.query)
                .then((res) => {
                    if(res.data.code === "0"){
                        this.tableData = res.data.data.content;
                        this.query.pageIndex = res.data.data.number + 1;
                        this.query.pageSize = res.data.data.size;
                        this.pageTotal = res.data.data.totalElements;
                    } else {
                        this.$message.error('查询失败');
                    }
                });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handleUpload() {
            this.dialogVisible = true;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$axios.post(this.$rootUrl + this.urlDel, {id: row.id})
                    .then((res) => {
                        if(res.data.code === "0"){
                            this.$message.success('成功');
                            this.getData();
                        } else {
                            this.$message.error('失败');
                        }
                    });
            })
        },
        handleDownload(index, row){
            window.location.href=this.$rootUrl + this.urlDownload + "?id="+row.id
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        handleAdd(){
            this.title = "新增";
            this.editVisible = true;
        },
        saveAdd(){

        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            // if(this.form.id === ""){
                // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            // }
            this.$axios.post(this.$rootUrl + this.urlAddOrEdit, this.form)
            .then(res => {
                if(res.data.code === "0"){
                    this.$message.success("成功");
                    this.getData();
                } else {
                    this.$message.error(res.data.msg)
                }
            });
            // this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        getTypes(){
            this.$axios.post(this.$rootUrl + this.urlType, {})
            .then((res) => {
                if(res.data.code === "0"){
                    this.types = res.data.data;
                }
            });
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 12px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
