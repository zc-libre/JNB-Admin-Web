<template>
  <div class="app-container" style="margin-top: 20px;margin-left: 300px">
    <el-form ref="form" :model="form" :label-position="labelPosition" :rules="rules">
      <el-form-item label="职位名称" prop="jobName">
        <el-input v-model="form.jobName" placeholder="请输入职位名称" style="width: 50%" />
      </el-form-item>

      <el-form-item label="案例内容" prop="content">
        <editor :content="form.content" :is-clear="clear" @submit-text="getHtml" />
      </el-form-item>
    </el-form>
    <el-row :gutter="30">
      <el-col :span="1" :offset="13">
        <el-button type="info" @click="resetForm('form')">重置</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="success" @click="submitForm('form')">发布</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Editor from '@/views/components/Editor'
import { submit, detail } from '@/api/jnb/Job'

export default {
  name: 'JobPublish',
  components: { Editor },
  data() {
    return {
      form: {
        id: null,
        jobName: '',
        content: ''
      },
      clear: false,
      labelPosition: 'top',
      rules: {
        jobName: [
          { required: true, message: '请输入职位名称', trigger: 'blur' },
          { min: 5, message: '标题最少5个字符', trigger: 'blur' },
          { max: 20, message: '标题做多20个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'imagesUploadApi'
    ])
  },
  created() {
    this.form.id = this.$route.query.id
    if (this.form.id !== null && this.form.id !== undefined) {
      detail(this.form.id).then(res => {
        this.form = res.data
      })
    }
  },
  methods: {
    getHtml(data) {
      this.form.content = data
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          submit(JSON.stringify(this.form)).then(res => {
            this.$notify({
              title: '发布成功！',
              type: 'success',
              duration: 2500
            })
          })
          this.$router.push('/jnb/job/list')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.clear = true
    }
  }
}
</script>

<style scoped>

</style>
