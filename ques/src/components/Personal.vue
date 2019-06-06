<template>
    <div id="personal">
        <el-card shadow="never"> 
            <div>            
                个人中心
            </div>
        </el-card>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="margin-top: 15px;">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="form.gender">
                    <el-option label="男" value="m"></el-option>
                    <el-option label="女" value="f"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="edit()">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        props:['id'],
        data(){
            const  phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
            const  emaolReg=/^[a-z0-9]+@[a-z0-9]+\.(com)|(cn)$/
            const  validatePhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('号码不能为空!!'))
                }
                setTimeout(() => {
                    if (!phoneReg.test(value)) {
                    callback(new Error('格式有误，请输入11位手机号'))
                    } else {
                    callback()
                    }
                }, 1000)
            }
            const  validateEmail = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('邮箱不能为空!!'))
                }
                setTimeout(() => {
                    if (!emaolReg.test(value)) {
                    callback(new Error('格式有误'))
                    } else {
                    callback()
                    }
                }, 1000)
            }
            return{
                form:{
                    username:'',
                    phone:'',
                    email:'',
                    gender:'',
                },
                rules:{
                    username:[
                        { required: true,message: '用户名不能为空',trigger: 'blur'},
                        { min: 4, max: 18, message: '用户名4-18个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true,message: '密码不能为空',trigger: 'blur'},
                        { min: 6, max: 18, message: '密码6-18个字符', trigger: 'blur' }
                    ],
                    phone:[
                        { required: true,trigger: 'blur', validator: validatePhone},
                    ],
                    email:[
                        { required: true,trigger: 'blur', validator: validateEmail},
                    ]
                }
            }
        },
        computed:{//计算属性
            userInfo(){
                return this.store.get('userInfo')
            }
        },
        created(){
            this.getUsers()
        },
        methods:{
            getUsers(){
                this.axios.get(`/users/${this.userInfo.id}`).then((ret)=>{
                    const {data}=ret.data
                    console.log(data)
                    this.form.username=data.username
                    this.form.gender=data.gender
                    this.form.phone=data.phone
                    this.form.email=data.email
                })
            },                
            edit(){
                this.axios.put(`/users/edit/${this.userInfo.id}`,this.form).then(()=>{
                    this.$message.success('修改成功！')
                }).catch(()=>{
                    this.$message.error('修改失败！')
                })
            }
        }
    }
</script>
<style>

</style>

