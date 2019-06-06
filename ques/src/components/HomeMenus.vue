<template>
    <div id="homeMenus">
        <!-- 添加根节点 -->
        <el-dialog title="添加菜单" :visible.sync="rootVisible">
            <el-form ref="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="rootmenuName"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-select  v-model="rootmenuIocn" placeholder="请选择">
                        <el-option v-for="(icon,index) in icons" :key="'icon_'+index" :label="icon" :value="icon">
                            <i :class="icon"></i> {{icon}}
                        </el-option>                         
                    </el-select>
                    <i :class="rootmenuIocn"></i>              
                </el-form-item>
                <el-form-item label="路由">
                    <el-input v-model="rootmenuRouter" ></el-input>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio v-model="rootmenuStatus" label="1">显示</el-radio>
                    <el-radio v-model="rootmenuStatus" label="0">不显示</el-radio>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="rootSave()">创建</el-button>
                    <el-button @click="rootVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑节点" :visible.sync="editVisible">
            <el-form ref="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="editmenuName"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-select  v-model="editmenuIocn" placeholder="请选择">
                        <el-option v-for="(icon,index) in icons" :key="'icon_'+index" :label="icon" :value="icon">
                            <i :class="icon"></i> {{icon}}
                        </el-option>                         
                    </el-select>
                    <i :class="editmenuIocn"></i>              
                </el-form-item>
                <el-form-item label="路由">
                    <el-input v-model="editmenuRouter" ></el-input>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio v-model="editmenuStatus" label="1">显示</el-radio>
                    <el-radio v-model="editmenuStatus" label="0">不显示</el-radio>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="editSave()">保存</el-button>
                    <el-button @click="editVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-card shadow="never" v-loading="loading">
            <div slot="header">
                菜单管理
                <el-button type="primary" size="mini" @click="addRoot()"> + 添加菜单</el-button> 
            </div>
            <el-tree :data="menus" :props="{label:'menu_name'}">
                <div slot-scope="{data,node}" id="btns" @mousemove="showOpt=data.id" @mouseout="showOpt=false">                    
                    <span id="menuName"><i :class="data.icon"></i> {{data.menu_name}}</span>
                    <div v-show="showOpt==data.id">
                        <el-button @click.stop="editChild(data)" type="primary" size="mini">编辑 <i class="el-icon-edit"></i></el-button> 
                        <el-button @click.stop="del(data.id)" type="danger" size="mini">删除 <i class="el-icon-delete"></i></el-button> 
                        <el-button v-show="node.previousSibling" @click.stop="sortNode(data.id,'up')" type="primary" size="mini" icon="el-icon-arrow-up" circle></el-button>
                        <el-button v-show="node.nextSibling" @click.stop="sortNode(data.id,'down')" type="primary" size="mini" icon="el-icon-arrow-down" circle></el-button>
                        <el-switch 
                            v-model="data.status" 
                            @change="statusChange(data)" 
                            active-color="#13ce66" 
                            active-value="1" 
                            inactive-color="#ff4949" 
                            inactive-value="0">
                        </el-switch>
                    </div>
                </div>
            </el-tree>
        </el-card>
    </div>
</template>
<script>
export default {
        data(){
            return {
                menus:[],
                rootVisible:false,
                rootmenuName:'',
                rootmenuIocn:'',
                rootmenuStatus:'1',
                rootmenuRouter:'/',
                editVisible:false,
                editmenuName:'',
                editmenuIocn:'',
                editmenuStatus:'1',
                editmenuRouter:'/',
                loading:false,
                editId:'',
                showOpt:'',
                icons:[
                    'el-icon-goods',
                    'el-icon-message',
                    'el-icon-bell',
                    'el-icon-mobile-phone',
                    'el-icon-service',
                ],
                num:'',
            }
        },
        created(){
            this.getmenus()
        },
        methods:{
            del(id){
                this.$confirm('确定删除吗？', '删除', '提示').then(()=>{
                    this.axios.delete(`/menus/del/${id}`).then(()=>{
                        this.getmenus()
                        this.$root.$emit('menusDate')
                    }).catch((error)=>{
                        this.$message.error('请先删除子菜单')
                    })
                }).catch(()=>{
                        
                })                
            },//添加菜单弹框的创建
            rootSave(){
                let rootmenuName=this.rootmenuName
                let rootmenuIocn=this.rootmenuIocn
                let rootmenuRouter=this.rootmenuRouter
                let routers=/^(\/\w+){0,}$/
                if(rootmenuName==""){
                    this.$message.error('名称不能为空')
                }else if(rootmenuIocn==""){
                    this.$message.error('图标不能为空')
                }else if(!routers.test(rootmenuRouter)){
                    this.$message.error('路由不能为空,正确格式例如：/home/text')
                }else{
                    this.axios.post('/menus/add',{
                        menu_name:this.rootmenuName,
                        icon:this.rootmenuIocn,
                        status:this.rootmenuStatus,
                        router:this.rootmenuRouter,
                        parent_id:0,
                    }).then((ret)=>{
                        this.getmenus()
                        this.rootVisible=false;
                        this.rootmenuName=''
                        this.rootmenuIocn=''
                        this.rootmenuStatus=''
                        this.rootmenuRouter='/'
                        this.$root.$emit('menusDate')
                    })
                }               
            },//是否显示
            statusChange(data){
                this.axios.put(`/menus/edit/${data.id}`,{
                    status:data.status
                }).then((ret)=>{
                    this.editVisible=false
                    this.num=status
                    this.$root.$emit('menusDate')
                })
            },//编辑弹框的保存
            editSave(){
                let editmenuName=this.editmenuName
                let editmenuIocn=this.editmenuIocn
                let editmenuRouter=this.editmenuRouter
                let routers=/^(\/\w+){0,}$/
                if(editmenuName==""){
                    this.$message.error('名称不能为空')
                }else if(editmenuIocn==""){
                    this.$message.error('图标不能为空')
                }else if(!routers.test(editmenuRouter)){
                    this.$message.error('路由不能为空,正确格式例如：/home/text')
                }else{
                    this.axios.put(`/menus/edit/${this.editId}`,{
                        menu_name:this.editmenuName,
                        icon:this.editmenuIocn,
                        status:this.editmenuStatus,
                        router:this.editmenuRouter,
                        // parent_id:this.parentId,
                        // status:1
                    }).then((ret)=>{
                        this.getmenus()
                        this.editVisible=false
                        this.$root.$emit('menusDate')
                    })
                }                
            },//添加菜单弹框
            addRoot(){
                this.rootVisible=true
            },//编辑弹窗
            editChild(data){
                this.editId=data.id
                this.editmenuName=data.menu_name//数据回填
                this.editmenuIocn=data.icon
                this.editmenuStatus=data.status
                this.editmenuRouter=data.router
                this.editVisible=true
            },//向上向下排序
            sortNode(id,dir){
                this.axios.put(`/menus/sort/${id}/${dir}`).then(()=>{
                    this.getmenus()
                })
            },
            getmenus(){
                this.loading=true
                this.axios.get('/menus').then((ret)=>{
                    const {data}=ret.data
                    this.loading=false
                    this.menus=data
                })
            }
        }
    }
</script>
<style>
    .el-form-item__label{
        text-align:left;
    }
    #menuName{
        display:inline-block;
        width:720px;
        height:28px;
        line-height:28px;
    }
    .el-tree-node__content{
        border:1px solid rgba(0,0,0,0.2);
        padding:10px 0;
        margin:10px 0;
    }
    .el-dialog__body{
        padding-bottom:15px;
    }
    #btns{
        display:flex;
    }
    .el-form-item__label{
        width:160px;
    }
</style>