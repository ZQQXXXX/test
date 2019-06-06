<template>
    <div id="HomePapers">
        <el-card v-loading="loading" shadow="none">
            <div slot="header">问卷管理
                <el-button size="mini" @click="add()" type="primary">+创建问卷</el-button>
            </div>
            <el-input style="margin-top: 15px;" placeholder="请输入内容" v-model="fieldVal" class="input-with-select">
                <el-select v-model="field" slot="prepend" placeholder="请选择" style="width:100px">
                    <el-option label="标题" value="title"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </el-card>
        <el-table :data="papers" v-loading="loading" border>
            <el-table-column prop="ctime" label="创建时间" :formatter="formatCtime" width="252"></el-table-column>
            <el-table-column prop="title" label="标题" width="160"></el-table-column>
            <el-table-column prop="users[0].username" label="创建人" width="150"></el-table-column>
            <el-table-column prop="classes[0].class_name" label="班级" width="150"></el-table-column>
            <el-table-column label="操作" width="380">
                <div slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="edit(row.id)">编辑 <i class="el-icon-edit"></i></el-button>
                    <el-button type="success" size="mini" @click="publish(row.id)">发布 <i class="el-icon-tickets"></i></el-button>
                    <el-button type="warning" size="mini" @click="analysis(row.id)">分析 <i class="el-icon-menu"></i></el-button>
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
            :page-sizes="[5,10,50]"
            @size-change="sizeChange"
            >
        </el-pagination>
    </div>
</template>
<script>
    import moment from 'moment'
    export default {
        data(){
            return {
                field:'title',
                fieldVal:'',
                loading:false,
                papers:[],
                pageSize:5, //每页的记录条数
                currentPage:1, //当前页
                total:0,//总条数
                pageNum:0,//页数
            }
        },
        created(){
            this.getPapers()
        },
        methods:{
            analysis(id){
                this.$router.push({
                    name:'analysis',
                    params:{id}
                })
            },
            publish(id){
                this.$router.push({
                    name:'publish',
                    params:{id}
                })
            },
            formatCtime(row){
                return moment(row.ctime).format('YYYY-MM-DD hh:mm:ss')
            },
            del(id){
                this.$confirm('删除','确定删除吗？','提示').then(()=>{
                    this.axios.delete(`/papers/del/${id}`).then(()=>{
                        this.getPapers()
                        this.$message.success('删除成功！')
                    }).catch(()=>{
                        this.$message.success('删除失败！')
                    })
                })           
            },
            edit(id){
                this.$router.push({
                    name:'PapersEdit',
                    params:{
                        id
                    }
                })
            },
            add(){
                this.$router.push({
                    name:'PapersAdd'
                })
            },
            search(){
            this.getPapers() 
            },
            currentChange(){
                this.getPapers()
            },
            sizeChange(size){
                this.pageSize=size
                this.getPapers()
            },
            // topage(i){
            //     this.currentPage=i
            //     this.getPapers()
            // },
            getPapers(){
                this.loading=true
                this.axios.get('/papers',{
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
                    this.papers=data.rows 
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

