<template>
   <div id="home">
       <el-container>
            <el-header>
                <img src="/static/logo.png" alt="">随堂问卷管理系统
                <el-tag size="mini">{{userInfo.username}}</el-tag>
                <el-button type="text" @click="logout()">注销</el-button>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu :router="true">
                        <el-menu-item  v-for="menu in menus" :key="'menu'+menu.id" :index="menu.router">
                            <i :class="menu.icon"></i>
                            {{menu.menu_name}}                            
                        </el-menu-item>
                        <!-- <el-menu-item index="/home/menus">大纲管理</el-menu-item>
                        <el-menu-item index="1-3">问卷管理</el-menu-item>
                        <el-menu-item index="1-4">菜单管理</el-menu-item>
                        <el-menu-item index="1-5">角色管理</el-menu-item>
                        <el-menu-item index="1-5">选项管理</el-menu-item>
                        <el-menu-item index="1-5">个人中心</el-menu-item>
                        <el-menu-item index="1-5">每日汇总</el-menu-item> -->
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div> 
</template>

<script>
    export default {
        data(){//静态属性
            return {
                menus:[]
            }
        },
        computed:{//计算属性
            userInfo(){
                return this.store.get('userInfo')
            }
        },
        created(){
            this.getUsers()
            this.getMenus()
            this.$root.$on('menusDate',()=>{
                this.getMenus()
            })
        },
        beforeRouteEnter(to,from,next){
            next((vm)=>{
                vm.axios.get('/users/islogin').then((ret)=>{
                    const{data}=ret.data
                    if(data==0){
                        vm.$router.push({name:'login'})
                    }
                })
            })
        },
        methods:{
            getMenus(){
                this.axios.get('/menus',{
                    params:{
                        status:1
                    }
                }).then((ret)=>{
                    const{data,error}=ret.data
                    this.menus=data
                })
            },
            getUsers(){
                this.axios.get('/users').then((ret)=>{
                    let {data,error}=ret
                    if(errop==1){
                        this.$router.push({
                            name:'login'
                        })
                    }
                }).catch(()=>{

                })
            },
            logout(){//注销
                this.axios.get('/users/logout').then(()=>{
                    this.$router.push({
                        name:'login'
                    })
                }).catch(()=>{

                })
            }
        }
    }
</script>

<style scoped>

</style>
