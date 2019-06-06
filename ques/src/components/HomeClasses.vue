<template>
    <div id="homeClasses">
        <!-- 添加根节点 -->
        <el-dialog title="添加班级" :visible.sync="rootVisible">
            <el-form label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="addclass_name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="rootSave()">创建</el-button>
                    <el-button @click="rootVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑班级" :visible.sync="editVisible">
            <el-form label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="editclass_name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  @click="editSave()">保存</el-button>
                    <el-button @click="editVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-card v-loading="loading" shadow="none">
            <div slot="header">班级管理
                <el-button size="mini" @click="add()" type="primary">+ 添加班级</el-button>
            </div>
            <el-input style="margin-top: 15px;" placeholder="请输入内容" v-model="fieldVal" class="input-with-select">
                <el-select v-model="field" slot="prepend" placeholder="请选择" style="width:100px">
                    <el-option label="班级号" value="class_name"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </el-card>
        <el-table :data="classes" v-loading="loading" border>
            <el-table-column prop="class_name" label="班级号" width="230"></el-table-column>
            <el-table-column prop="ctime" label="创建时间" :formatter="formatCtime" width="300"></el-table-column>
            <el-table-column prop="mtime" label="更新时间" :formatter="formatMtime" width="300"></el-table-column>
            <el-table-column label="操作" width="300">
                <div slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="edit(row)">编辑 <i class="el-icon-edit"></i></el-button>
                    <el-button type="danger" size="mini" @click="del(row.id)">删除 <i class="el-icon-delete"></i></el-button>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination 
            background 
            layout="prev, pager, next, sizes" 
            :total="total" 
            :page-size="pageSize"
            :currentPage.sync="currentPage"
            @current-change="currentChange"
            :page-sizes="[3,10]"
            @size-change="sizeChange"
            >
        </el-pagination>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        data(){
            return {
                field:'',
                fieldVal:'',
                loading:false,
                classes:[],
                pageSize:3, //每页的记录条数
                currentPage:1, //当前页
                total:0,//总条数
                pageNum:0,//页数
                rootVisible:false,
                editVisible:false,
                addclass_name:'',
                editclass_name:'',
                editId:'',
            }
        },
        created(){
            this.getClasses()
        },
        methods:{
            //编辑创建
            editSave(){
                let editclass_name=this.editclass_name
                if(editclass_name==""){
                    this.$message.error('名称不能为空！')
                }else{
                    this.axios.put(`/classes/edit/${this.editId}`,{
                        class_name:this.editclass_name
                    }).then(()=>{
                        this.getClasses(),
                        this.editVisible=false
                    })
                }               
            },
            //添加跟节点创建
            rootSave(){
                let addclass_name=this.addclass_name
                if(addclass_name==""){
                    this.$message.error('名称不能为空！')
                }else{
                    this.axios.post('/classes/add',{
                        class_name:this.addclass_name
                    }).then(()=>{
                        this.getClasses(),
                        this.rootVisible=false
                        this.addclass_name=''
                    }).catch(()=>{
                        
                    })
                }                
            },
            formatCtime(row){
                return moment(row.ctime).format('YYYY-MM-DD HH:mm:ss')
            },
            formatMtime(row){
                return moment(row.mtime).format('YYYY-MM-DD HH:mm:ss')
            },
            del(id){
                this.$confirm('删除','确定删除吗？','提示').then(()=>{
                    this.axios.delete(`/classes/del/${id}`).then(()=>{
                        this.$message.success('删除成功！')
                        this.getClasses()
                    }).catch(()=>{
                        this.$message.success('删除失败！')
                        this.getClasses()
                    })
                })           
            },
            edit(row){
                this.editId=row.id;
                this.editclass_name=row.class_name//数据回填
                this.editVisible=true
            },
            add(){
               this.rootVisible=true
            },
            search(){
                this.getClasses() 
            },
            currentChange(){
                this.getClasses()
            },
            sizeChange(size){
                this.pageSize=size
                this.getClasses()
            },
            // topage(i){
            //     this.currentPage=i
            //     this.getUsers()
            // },
            getClasses(){
                this.loading=true
                this.axios.get('/classes',{
                    params:{
                        field:this.field,
                        fieldVal:this.fieldVal,
                        pageSize:this.pageSize,//每页的记录条数
                        currentPage:this.currentPage,//当前页
                    }
                }).then((ret)=>{
                    this.loading=false
                    const{data}=ret.data
                    //console.log(data)
                    this.total=data.total
                    this.pageNum=Math.ceil(data.total/data.pageSize)
                    this.classes=data.rows 
                })
            }
        }
    }
</script>
<style scoped>
    .el-pagination{
        margin:20px 0;
    }
</style>

