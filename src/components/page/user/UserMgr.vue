<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="角色" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" size="mini">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column prop="username" label="名称"/>
                <el-table-column prop="type" label="注册类型">
                    <template slot-scope="scope">
                        <span>{{types[scope.row.type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" >
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | dateTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">绑定角色</el-button>
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
        <el-dialog :title="title" :visible.sync="editVisible" width="20%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="名称">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.type">
                        <el-option v-for="(value,key) in types" :key="key" :value="value" :label="value"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            urlSearch: "/user/queryPage",
            urlType: "/user/getTypeMap",
            urlAddOrEdit: "/user/addOrEdit",
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
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
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$message.success('删除成功');
                this.tableData.splice(index, 1);
            })
            .catch(() => {});
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
