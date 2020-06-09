<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 站内信</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                    <el-table :data="unread" :show-header="false" style="width: 100%" @row-click="handleDetail">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">【{{JSON.parse(scope.row.body).key}}】{{JSON.parse(scope.row.body).value.substring(0, 150)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="210">
                            <template slot-scope="scope">
                                <el-button size="small" @click.native.stop="handleRead(scope.$index)">标为已读</el-button>
                                <el-button size="small" type="primary" @click.native.stop="handleSave(scope.$index)">保存消息</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button size="small" type="danger" @click.native.stop="handleExample()">模拟一个错误</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`保存的消息(${unread.length})`" name="second">
                    <el-table :data="unread" :show-header="false" style="width: 100%" @row-click="handleDetail">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">【{{JSON.parse(scope.row.body).key}}】{{JSON.parse(scope.row.body).value.substring(0, 150)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" type="danger" @click.native.stop="handleSave(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
<!--                <el-tab-pane :label="`已保存的消息(${read.length})`" name="second">-->
<!--                    <template v-if="message === 'second'">-->
<!--                        <el-table :data="read" :show-header="false" style="width: 100%">-->
<!--                            <el-table-column>-->
<!--                                <template slot-scope="scope">-->
<!--                                    <span class="message-title">{{scope.row.title}}</span>-->
<!--                                </template>-->
<!--                            </el-table-column>-->
<!--                            <el-table-column prop="date" width="150"></el-table-column>-->
<!--                            <el-table-column width="120">-->
<!--                                <template slot-scope="scope">-->
<!--                                    <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>-->
<!--                                </template>-->
<!--                            </el-table-column>-->
<!--                        </el-table>-->
<!--                        <div class="handle-row">-->
<!--                            <el-button type="danger">删除全部</el-button>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-tab-pane>-->
<!--                <el-tab-pane :label="`回收站(${recycle.length})`" name="third">-->
<!--                    <template v-if="message === 'third'">-->
<!--                        <el-table :data="recycle" :show-header="false" style="width: 100%">-->
<!--                            <el-table-column>-->
<!--                                <template slot-scope="scope">-->
<!--                                    <span class="message-title">{{scope.row.title}}</span>-->
<!--                                </template>-->
<!--                            </el-table-column>-->
<!--                            <el-table-column prop="date" width="150"></el-table-column>-->
<!--                            <el-table-column width="120">-->
<!--                                <template slot-scope="scope">-->
<!--                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>-->
<!--                                </template>-->
<!--                            </el-table-column>-->
<!--                        </el-table>-->
<!--                        <div class="handle-row">-->
<!--                            <el-button type="danger">清空回收站</el-button>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-tab-pane>-->
            </el-tabs>
        </div>
        <!-- 弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="detailVisible" width="60%">
            <el-form>
                <pre>
                    {{dialogContent}}
                </pre>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                unread: [],
                detailVisible: false,
                dialogTitle: '1212',
                dialogContent: ''
            }
        },
        methods: {
            handleRead(index) {
                this.$confirm('标记后消息会丢失，确认标记已读？', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    const item = this.unread.splice(index, 1);
                    this.$message.success('成功');
                    item[0].ack()
                })
            },
            handleSave(index) {
                const item = this.unread.splice(index, 1);
                this.read = item.concat(this.read);
            },
            handleDel(index) {
                const item = this.read.splice(index, 1);
                this.recycle = item.concat(this.recycle);
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1);
                this.read = item.concat(this.read);
            },
            handleDetail(row, event, column) {
                const json = JSON.parse(row.body);
                this.dialogTitle = json.key;
                this.detailVisible = true;
                this.dialogContent = json.value;
            },
            handleExample(){
                this.$axios.post(this.$rootUrl + "/aaa/bbb", {})
                    .then(res => {

                    });
            }
        },
        computed: {
            unreadNum(){
                return this.unread.length;
            }
        },
        created() {
            this.unread = this.$parent.innerMsgList;
        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

