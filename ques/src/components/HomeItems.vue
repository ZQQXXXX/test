<template>
    <div id="homeItems">
        <!-- 添加根节点 -->
        <el-dialog title="添加根选项" :visible.sync="rootVisible">
            <el-form ref="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="rootItemName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="rootSave()">创建</el-button>
                    <el-button @click="rootVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 添加子节点 -->
        <el-dialog title="添加子节点" :visible.sync="childVisible">
            <el-form ref="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="childItemName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="childSave()">创建</el-button>
                    <el-button @click="childVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑节点" :visible.sync="editVisible">
            <el-form ref="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="editItemName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="editSave()">保存</el-button>
                    <el-button @click="editVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-card shadow="never" >
            <div slot="header">
                选项管理
                <el-button type="primary" size="mini"  @click="addRoot()"> + 添加根选项</el-button> 
            </div>
            <el-tree :data="items" :props="{label:'item_name'}">
                <div slot-scope="{data,node}" id="btns" @mousemove="showOpt=data.id" @mouseout="showOpt=false">
                    <span id="itemsName">{{data.item_name}}</span>
                    <div v-show="showOpt==data.id">
                        <el-button @click.stop="editChild(data)" type="primary" size="mini">编辑 <i class="el-icon-edit"></i></el-button> 
                        <el-button @click.stop="addChild(data.id)" type="primary" size="mini"> + 添加子选项</el-button> 
                        <el-button @click.stop="del(data.id)" type="danger" size="mini">删除 <i class="el-icon-delete"></i></el-button> 
                        <el-button v-show="node.previousSibling" @click.stop="sortNode(data.id,'up')" type="primary" size="mini" icon="el-icon-arrow-up" circle></el-button>
                        <el-button v-show="node.nextSibling" @click.stop="sortNode(data.id,'down')" type="primary" size="mini" icon="el-icon-arrow-down" circle></el-button>
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
                items:[],
                rootVisible:false,
                rootItemName:'',
                childVisible:false,
                childItemName:'',
                editVisible:false,
                editItemName:'',
                loading:false,
                parentId:'',
                editId:'',
                showOpt:'',
           }
       },
       created(){
           this.getItems()
       },
       methods:{
           //获取数据
           getItems(){
                this.axios.get('/items').then((ret)=>{  
                    console.log(ret)                
                    const {data}=ret.data
                    this.items=data
                })
            },
            //删除
            del(id){
                this.$confirm('确定删除吗？', '删除', '提示').then(()=>{
                    this.axios.delete(`/items/del/${id}`).then(()=>{
                        this.getItems()
                    }).catch((error)=>{
                        this.$message.error('请先删除子菜单')
                    })
                }).catch(()=>{
                        
                })                
            },
            //添加子节点弹框的创建
            childSave(){
                let childItemName=this.childItemName
                if(childItemName==""){
                    this.$message.error('名称不能为空！')
                }else{
                    this.axios.post('/items/add',{
                        item_name:this.childItemName,
                        parent_id:this.parentId,
                        status:1
                    }).then((ret)=>{
                        this.getItems()
                        this.childVisible=false
                        this.childItemName=""
                    })
                }
            },
            //编辑弹框的保存
            editSave(){
                let editItemName=this.editItemName
                if(editItemName==""){
                    this.$message.error('名称不能为空！')
                }else{
                    this.axios.put(`/items/edit/${this.editId}`,{
                        item_name:this.editItemName,
                        // parent_id:this.parentId,
                        // status:1
                    }).then((ret)=>{
                        this.getItems()
                        this.editVisible=false
                    })
                }               
            },
            //添加子节点弹框
            addChild(id){
                this.parentId=id
                this.childVisible=true
            },
            //编辑弹窗
            editChild(data){
                this.editId=data.id
                this.editItemName=data.item_name//数据回填
                this.editVisible=true
            },
            //向上向下排序
            sortNode(id,dir){
                this.axios.put(`/items/sort/${id}/${dir}`).then(()=>{
                    this.getItems()
                })
            },
            //添加父节点弹框
            addRoot(){
                this.rootVisible=true
            },
            //添加父节点弹框的创建
            rootSave(){
                let rootItemName=this.rootItemName
                if(rootItemName==""){
                    this.$message.error('名称不能为空！')
                }else{
                    this.axios.post('/items/add',{
                        item_name:rootItemName,
                        parent_id:0,
                        status:1
                    }).then((ret)=>{
                        this.getItems()
                        this.rootVisible=false
                        this.rootItemName=""
                    })
                }                
            }
       } 
    }
</script>
<style>
    .el-form-item__label{
        text-align:left;
    }
    #itemsName{
        display:inline-block;
        width:650px;
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
</style>