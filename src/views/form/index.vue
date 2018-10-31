<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="旧密码" prop="oldPSD">
        <el-col :span="11">
          <el-input v-model="form.oldPSD" type="password"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="新密码" prop="newPSD">
        <el-col :span="11">
          <el-input v-model="form.newPSD" type="password"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="再次输入" prop="newPSD2">
        <el-col :span="11">
          <el-input v-model="form.newPSD2" type="password"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePSD } from '@/api/login'
import store from '@/store'

export default {
  data() {
    return {
      form: {
        oldPSD: '',
        newPSD: '',
        newPSD2: ''
      },
      rules: {
        oldPSD: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        newPSD: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        newPSD2: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.newPSD !== this.form.newPSD2) {
            this.$message({
              type: 'warning',
              message: '两次输入的新密码不一致！'
            })
          } else {
            const data = {
              oldPassword: this.form.oldPSD,
              password: this.form.newPSD
            }
            changePSD(data)
              .then(res => {
                if (res.data.resultCode === 200) {
                  this.$alert('修改密码成功，请重新登录！', '提示', {
                    confirmButtonText: '确定'
                  }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                      location.reload()// 为了重新实例化vue-router对象 避免bug
                    })
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改密码失败'
                  })
                }
              })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

