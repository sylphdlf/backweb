<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{lastLoginTime | dateTime}}</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>{{lastIp==='127.0.0.1' ? '本地' : lastLocation}}</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>当前天气</span>
                    </div>

                    <div class="tag-group">
                        <el-tag effect="dark">{{this.lives.city}}</el-tag><br>
                        <el-tag type="success" effect="dark">天气：{{this.lives.weather}}</el-tag><br>
                        <el-tag effect="dark">温度：{{this.lives.temperature}} &#8451;</el-tag><br>
                        <el-tag effect="dark">湿度：{{this.lives.humidity}}%</el-tag><br>
                        <el-tag type="warning"effect="dark">更新时间：{{this.lives.reporttime}}</el-tag>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{userCount}}</div>
                                    <div>用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{this.$parent.innerMsgList.length}}</div>
                                    <div>系统消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="width:100%;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div
                                    class="todo-item"
                                    :class="{'todo-item-del': scope.row.status}"
                                >{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template>
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="accessMonitor"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import Stomp from "stompjs";
import {MQ_PASSWORD, MQ_SERVICE, MQ_TOPIC_ACCESS, MQ_USERNAME} from "../../../utils/mqConfig";
import bus from '../../common/bus';
import moment from "moment";
export default {
    name: 'dashboard',
    data() {
        return {
            client: Stomp.client(MQ_SERVICE),
            headers: {
                login: MQ_USERNAME,
                password: MQ_PASSWORD,
                duration: true,
            },
            urlCityAndWeather: "/cityAndWeather",
            urlAccessCount: "/user/getAccessCount",
            name: localStorage.getItem('ms_username'),
            lastIp: localStorage.getItem('ms_lastIp'),
            ip: localStorage.getItem('ms_ip'),
            lastLoginTime: parseInt(localStorage.getItem('ms_lastLoginTime')),
            lastLocation: '',
            lastCityCode: '',
            userCount: '',
            lives: {
                city: '',
                weather: '',
                temperature: '',
                winddirection: '',
                windpower: '',
                humidity: '',
                reporttime: ''
            },
            forecasts: [],
            todoList: [
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: true
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: true
                }
            ],
            data: [
                {
                    name: '2018/09/04',
                    value: 1083
                },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
            options: {
                type: 'bar',
                title: {
                    text: '最近一周各品类销售图'
                },
                xRorate: 25,
                labels: ['周一', '周二', '周三', '周四', '周五'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 190, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [144, 198, 150, 235, 120]
                    }
                ]
            },
            accessMonitor: {
                type: 'line',
                title: {
                    text: '服务器访问监控'
                },
                labels: ['','','','','','','','',''],
                datasets: [
                    {
                        label: '访问次数',
                        data: [0,0,0,0,0,0,0,0,0]
                    },
                ]
            }
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    created() {
        // this.handleListener();
        // this.changeDate();
        this.cityAndWeather(this.lastIp, this.ip);
        this.accessCount();
        this.connect();
    },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    methods: {
        cityAndWeather(lastIp, ip){
            lastIp = lastIp==='127.0.0.1'?'180.171.83.79':lastIp;
            ip = ip==='127.0.0.1'?'180.171.83.79':ip;
            if(lastIp !== '127.0.0.1'){
                this.$axios.get(this.$pywebUrl + this.urlCityAndWeather + "?lastIp="+lastIp+"&ip="+ip).then(res => {
                    this.lastLocation = res.data.city;
                    this.lives = res.data.lives[0];
                    this.forecasts = res.data.forecasts;
                })
            }
        },
        accessCount(){
            this.$axios.post(this.$rootUrl + this.urlAccessCount, {}).then(res => {
                this.userCount = res.data.msg;
            })
        },
        // changeDate() {
        //     const now = new Date().getTime();
        //     this.data.forEach((item, index) => {
        //         const date = new Date(now - (6 - index) * 86400000);
        //         item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        //         console.log(item.name)
        //     });
        // }
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
        onConnected:function(){
            //订阅的频道
            this.client.subscribe(MQ_TOPIC_ACCESS,this.responseCallback,{ack: 'client'});
        },
        onFailed:function(msg){
            if(null != msg){
                console.log("MQ msg=>" + msg);
            }
        },
        //成功时的回调函数
        responseCallback:function(msg){
            //接收消息的处理
            const obj = JSON.parse(msg.body);
            console.log(obj);
            if(this.accessMonitor.labels.length > 10){
                this.accessMonitor.labels.splice(0, 1);
                this.accessMonitor.datasets[0].data.splice(0, 1);
            }
            this.accessMonitor.labels.push(obj.time);
            this.accessMonitor.datasets[0].data.push(obj.count);
            msg.ack();
        },
        //连接
        connect:function(){
            const headers = {
                login: MQ_USERNAME,
                password: MQ_PASSWORD,
                duration: false,
            };
            this.client.debug = null;
            // this.client.reconnect_delay = 3000;
            this.client.connect(headers,this.onConnected,this.onFailed);
        },
        disConnect:function(){
            this.client.disconnect(this.onFailed, this.headers);
        }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
.tag-group span {
    margin-right: 5px;
    font-size: 14px;
    margin-top: 5px;
}
</style>
