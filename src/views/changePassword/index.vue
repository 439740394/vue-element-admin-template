<template>
  <div class="app-container">
    <div class="change_password_container" style="margin-top: 40px">
      <h3 style="text-align: center;">修改密码</h3>
      <el-row style="margin-top: 20px;">
        <el-col :xs="24" :sm="24" :md="{span: 8, offset: 8}" :lg="{span: 6, offset: 9}" :xl="{span: 6, offset: 9}">
          <el-form ref="form" :model="formData" :rules="rules" label-width="100px" size="large">
            <el-form-item label-width="0" prop="username">
              <el-input v-model="formData.username" prefix-icon="el-icon-user" disabled readonly />
            </el-form-item>
            <el-form-item label-width="0" prop="passwordold">
              <el-input v-model="formData.passwordold" prefix-icon="el-icon-unlock" type="password" @keydown.enter.native="handleClickSubmit" />
            </el-form-item>
            <el-form-item label-width="0" prop="passwordNew">
              <el-input v-model="formData.passwordNew" prefix-icon="el-icon-unlock" type="password" @keydown.enter.native="handleClickSubmit" />
            </el-form-item>
            <el-form-item label-width="0" style="text-align: center;">
              <el-button :loading="loading" type="primary" @click="handleClickSubmit">提交</el-button>
              <el-button type="danger" @click="handleClickReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { changePassword } from '@/api/user'

export default {
  name: 'ChangePasswrod',
  data() {
    return {
      loading: false,
      formData: {
        username: this.$store.getters.name,
        passwordold: '',
        passwordNew: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        passwordold: [{
          required: true,
          message: '请输入旧密码',
          trigger: 'blur'
        }],
        passwordNew: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    handleClickReset() {
      this.$refs.form.resetFields()
    },
    handleClickSubmit() {
      this.$refs.form.validate(async(vaild) => {
        if (vaild) {
          this.loading = true
          try {
            const result = await changePassword(this.formData)
            if (result.status === 200) {
              this.$message({
                type: 'success',
                message: result.msg || '修改成功',
                duration: 1000,
                onClose: async() => {
                  await this.$store.dispatch('user/logout')
                  this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                }
              })
            }
            this.loading = false
          } catch (e) {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
