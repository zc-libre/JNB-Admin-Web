<template>
  <div class="app-container" style="margin-top: 20px;margin-left: 300px">
    <el-form ref="form" :model="form" :label-position="labelPosition" :rules="rules">
      <el-form-item label="案例标题">
        <el-input v-model="form.title" placeholder="请输入案例标题" style="width: 50%" />
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="案例内容">
        <editor v-model="form.content" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Editor from '../../components/Editor'
export default {
  name: 'CaseEdit',
  components: { Editor },
  data() {
    return {
      labelPosition: 'top',
      form: {
        caseImg: '',
        title: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 5, message: '标题最少5个字符', trigger: 'blur' }
        ],
        caseImg: [
          { required: true, message: '图片不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
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

</style>
