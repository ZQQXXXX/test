<template>
    <div id="PapersAdd">
        <el-card  shadow="never">
            <div slot="header">
                编辑
                <el-button @click="$router.push({name:'papers'})" icon="el-icon-back"  size="mini" type="info">返回</el-button> 
            </div>           
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="标题" label-width="60px" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="班级" label-width="60px" prop="class_id">
                    <el-select v-model="form.class_id" placeholder="请选择">
                        <el-option v-for="cls in classes" :key="'cls_'+cls.id" :label="cls.class_name+'班'" :value="cls.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选项" label-width="60px" prop="item">
                    <el-select v-model="form.item" placeholder="请选择">
                        <el-option 
                            v-for="item in items" 
                            :key="'item_'+item.id" 
                            :label="item.item_name" 
                            :value="JSON.stringify(item.children)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="大纲" label-width="60px">
                    <el-tree 
                        node-key="id"
                        ref="tree"
                        :render-after-expand="false"
                        @check-change="checkChange" 
                        :show-checkbox="true" :data="outlines" 
                        :props="{label:'outline_name'}">
                    </el-tree>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="save('form')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
export default {
    props:['id'],
    data(){
        return {
            classes:[],
            items:[],
            outlines:[],
            form:{
                title:'',
                class_id:'',
                item:'',
                content:[],
            },
            rules:{
                title:[
                    {required: true,message: '标题不能为空',trigger: 'blur'}
                ],
                class_id:[
                    {required: true,message: '班级不能为空',trigger: 'blur'}
                ],
                item:[
                    {required: true,message: '选项不能为空',trigger: 'blur'}
                ]
            }
        }
    },
    created(){
        this.getClasses();
        this.getItems();
        this.getOutlines();
        
    },
    methods:{
        async getPapers(){
            const ret=await this.axios.get(`/papers/${this.id}`)
            let {title,class_id,item,content} =ret.data.data
            this.form.title=title
            this.form.class_id=class_id
            this.form.item=JSON.stringify(item)
            this.$refs.tree.setCheckedNodes(content)
            
        },
        save(formtext){
            this.$refs[formtext].validate((valid)=>{
                if(valid){
                    this.axios.put(`/papers/edit/${this.id}`,{
                        title:this.form.title,
                        class_id:this.form.class_id,
                        item:this.form.item,
                        content:JSON.stringify(this.form.content),
                    }).then(()=>{
                        this.$router.push({
                            name:'papers'
                        })
                    })
                }
            })            
        },
        checkChange(node,flag){
            if(node.children.length==0){
                if(flag){
                    this.form.content.push(node)
                }else{
                    let i=this.form.content.indexOf(node);
                    this.form.content.splice(i,1)
                }
            }           
        },
        //获取大纲
        getOutlines(){
            this.axios.get('/outlines').then((ret)=>{
                this.outlines=ret.data.data
                this.getPapers();
            })
        },
        //获取选项
        getItems(){
            this.axios.get('/items').then((ret)=>{
                this.items=ret.data.data
            })
        },
        //获取班级
        getClasses(){
            this.axios.get('/classes',{
                params:{
                   pageSize:999,
                   currentPage:1,

                }
            }).then((ret)=>{
                this.classes=ret.data.data.rows
            })
        }
    }
}
</script>
<style>
    .el-tree-node__content{
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding:5px 0;
        margin:5px 0;
        width:217px;
    }
</style>


