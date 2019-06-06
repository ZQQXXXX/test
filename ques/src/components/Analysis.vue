<template>
    <div id="analysis">
        <div>
            <el-button @click="$router.push({name:'papers'})" icon="el-icon-back"  size="mini" type="info">返回</el-button> 
        </div>
        <ve-histogram :data="total"></ve-histogram>
        <ve-pie :data="total"></ve-pie>
    </div>
</template>
<script>
    export default {
        props:['id'],
        data(){
            return {
                answers:[],
                item:[],
                chartData: {
                    columns: ['options', 'number'],
                    rows: [
                        { 'options': '优秀', 'number': '3'},
                        { 'options': '良好', 'number': '7'},
                    ]
                }
            }
        },
        computed:{
            total(){
                let rows=[];
                let res={};
                let map={};
                this.item.forEach(el=>{
                    res[el.id]=0
                    map[el.item_name]=el.id
                    rows.push({
                        options:el.item_name,
                        number:'',
                    })
                })           
                this.answers.forEach(el=>{
                    el.content.forEach(sel=>{
                        res[sel.answer]++
                    })
                })
                rows.forEach(r=>{
                    r.number=res[map[r.options]]
                }) 
                return {
                    columns: ['options', 'number'],
                    rows
                }
            }
        },
        created(){
            this.getPapers()
        },
        methods:{
            async getPapers(){
                const ret=await this.axios.get(`/papers/answer/${this.id}`)
                this.item=JSON.parse(ret.data.data.item)
                this.answers=ret.data.data.answers
            },
        }
    }
</script>

