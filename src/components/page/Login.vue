<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
        <div class="ms-foot">
            <span>©2020&nbsp;kitty163&nbsp;</span>
            <span>&nbsp;(沪)-个人&nbsp;</span>
            <a href="http://www.beian.miit.gov.cn" target="_blank">
                <span class="lh s-bottom-recordcode">&nbsp;沪ICP备19032346号-1&nbsp;</span></a>
            <span class="lh">沪ICP备19032346号</span>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            urlLogin: "/login",
            param: {
                username: '',
                password: '',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.$axios.post(this.$rootUrl + this.urlLogin, this.param)
                    .then((res) => {
                        if(res.data.code === "0"){
                            this.$message.success('登录成功');
                            localStorage.setItem('ms_username', this.param.username);
                            localStorage.setItem('ms_lastLoginTime', res.data.data.lastLoginTime);
                            localStorage.setItem('ms_lastIp', res.data.data.lastIp);
                            localStorage.setItem('ms_ip', res.data.data.ip);
                            this.$router.push('/');
                        } else {
                            this.$message.error('登陆失败，请稍后再试');
                            return false;
                        }
                    });
                } else {
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-foot {
    position: fixed;
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 10px;
    color: #fff;
    bottom: 0;
    z-index: 1;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>