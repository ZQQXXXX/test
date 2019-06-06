<template>
    <div id="publish">
        <el-card shadow="never">
            <img src="/static/logo.png" alt="">随堂问卷-{{paper.title}}
            <div>
                <el-button style="margin:10px" @click="$router.push({name:'papers'})" icon="el-icon-back"  size="mini" type="info">返回</el-button> 
            </div>
        </el-card>
        <el-card shadow="never" v-for="(content,index) in paper.content" :key="'paper_'+content.id">
            <div slot="header">
                <span>{{index+1}}、{{content.outline_name}}</span>
            </div>
            <el-radio-group v-model="content.answer">
                <el-radio 
                    :label="item.id" 
                    v-for="item in paper.item" 
                    :key="'item_'+item.id">{{item.item_name}}
                </el-radio>
            </el-radio-group>
        </el-card>
        
        <div>
            <qrcode :value="msg" :options="{width:100}"></qrcode>
            <el-button type="primary" @click="save">提交</el-button>
        </div>
    </div>
</template>
<script>
    import VueQrcode from '@chenfengyuan/vue-qrcode';
    export default {
        props:['id'],
        data(){
            return {
                paper:{},
            }
        },
        components:{
            'qrcode':VueQrcode
        },
        created(){
            this.getPapers()
        },
        computed:{
            msg(){
                let tmp={
                    url:`${this.apiURL}/papers/${this.id}`,
                    id:this.id
                }
                return JSON.stringify(tmp)
            }
        },
        methods:{
            save(){
                for(let i=0;i<this.paper.content.length;i++){
                    if(!this.paper.content[i].answer){
                        this.$message.error(`请选择选项${i+1}`);
                        return
                    }
                }
                this.axios.post('/answers/add',{
                    paper_id:this.id,
                    item:JSON.stringify(this.paper.item),
                    content:JSON.stringify(this.paper.content),
                }).then(()=>{
                    this.$message.success('回答完毕')
                }).catch(()=>{
                    this.$message.error('请勿重复作答')
                })
            },
            async getPapers(){
                const ret=await this.axios.get(`/papers/${this.id}`)
                this.paper=ret.data.data               
            },
        }
    }
</script>

<style>

</style>

