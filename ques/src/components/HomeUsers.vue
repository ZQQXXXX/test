<template>
    <div id="homeUsers">
        <el-card v-loading="loading" shadow="none">
            <div slot="header">用户管理
                <el-button size="mini" @click="add()" type="primary"> + 添加</el-button>
            </div>
            <el-input style="margin-top: 15px;" placeholder="请输入内容" v-model="fieldVal" class="input-with-select">
                <el-select v-model="field" slot="prepend" placeholder="请选择" style="width:100px">
                <el-option label="用户名" value="username"></el-option>
                <el-option label="电话" value="phone"></el-option>
                <el-option label="邮箱" value="email"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </el-card>
        <el-table :data="users" v-loading="loading" border>
            <el-table-column prop="username" label="用户名" width="180"></el-table-column>
            <el-table-column prop="gender" label="性别" width="180"><!--判断男女 :formatter="function(row){return row.gender=='m'?'男':'女'}"-->
                <div slot-scope="{row}">                  
                    <el-button v-if="row.gender=='m'" type="primary" circle size="mini">男</el-button>
                    <el-button v-if="row.gender=='f'" type="danger" circle size="mini">女</el-button>
                </div>
            </el-table-column>
            <el-table-column prop="phone" label="手机" width="230">
                <div slot-scope="{row}">
                    <el-button type="primary" plain size="mini">{{row.phone}}</el-button>
                </div>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="230">
                <div slot-scope="{row}">
                    <el-button type="primary" plain size="mini">{{row.email}}</el-button>
                </div>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <div slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="edit(row.id)">编辑 <i class="el-icon-edit"></i></el-button>
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
        <!--<ul>
            <li @click="topage(i)" v-for="i in pageNum" :key="'pageNum_'+i">{{i}}</li>
        </ul>-->
    </div>
</template>
<script>
export default {
    data(){
        return {
            field:'',
            fieldVal:'',
            loading:false,
            users:[],
            pageSize:5, //每页的记录条数
            currentPage:1, //当前页
            total:0,//总条数
            pageNum:0,//页数
        }
    },
    created(){
        this.getUsers()
    },
    methods:{
        del(id){
            this.$confirm('删除','确定删除吗？','提示').then(()=>{
                this.axios.delete(`/users/del/${id}`).then(()=>{
                    this.getUsers()
                    this.$message.success('删除成功！')
                }).catch(()=>{
                    this.$message.success('删除失败！')
                })
            })           
        },
        edit(id){
            this.$router.push({
                name:'usersEdit',
                params:{
                    id
                }
            })
        },
        add(){
            this.$router.push({
                name:'usersAdd'
            })
        },
        search(){
           this.getUsers() 
        },
        currentChange(){
            this.getUsers()
        },
        sizeChange(size){
            this.pageSize=size
            this.getUsers()
        },
        // topage(i){
        //     this.currentPage=i
        //     this.getUsers()
        // },
        getUsers(){
            this.loading=true
            this.axios.get('/users',{
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
                this.users=data.rows 
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


