<template>
    <div id="login">
        <el-dialog :visible="true" width="400px" :show-close="false">
            <div slot="title" id="top">
                <img src="/static/logo.png" alt="">问卷系统登陆
            </div>
            <el-form label-width="80px" label-position="left">
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" id="footer" >
                <el-button type="primary" id="log" @click="login()">登录</el-button>
                <router-link to="/regist" @click="reg()">立即注册</router-link>
            </div>
        </el-dialog>       
    </div>
</template>
<script>
export default {
    data(){
        return {
            form:{
                username:'',
                password:'',
            }           
        }
    },
    created(){
        this.islogin()
    },
    methods:{
        reg(){
            this.$router.push({
                name:'regist'
            })
        },
        islogin(){
            this.axios.get('/users/islogin').then((ret)=>{
                const {error,data}=ret.data
                //console.log(data)
                if(data==1){//表示data==1，是登录状态，跳转到home页面，当手动转到login登录页面，会直接跳转到home页
                    this.$router.push({name:'users'})
                }
            })
        },
       login(){
            this.axios.post('/users/login',{
                ...this.form //手动拼接 `usersname=${this.form.username}``password=${this.form.password}`
            }).then((ret)=>{
                const {data,error}=ret.data
                this.store.set('userInfo',data)//保存用户信息
                this.$router.push({
                    name:'home'
                })
            }).catch(()=>{
                this.$message.error('用户名或密码错误');
            })
       } 
    }
}
</script>
<style>
    .el-form{
        padding:0 20px;        
    }
    #top{
        width:310px;
        height:52px;
        margin:auto;
        color:#333;
    }
    .el-dialog__body{
        padding-bottom:0;
    }
    #footer{
        width:150px;
        margin:auto;
    }
</style>

