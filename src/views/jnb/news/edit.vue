<template>
  <div class="app-container" style="margin-top: 20px;margin-left: 300px">
    <el-form ref="form" :model="form" :label-position="labelPosition" :rules="rules">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入案例标题" style="width: 50%" />
      </el-form-item>
      <el-form-item label="文章首图" prop="newsImage">
        <el-upload
          class="upload-demo"
          drag
          :limit="1"
          :before-upload="beforeUpload"
          :auto-upload="true"
          :headers="headers"
          :on-success="handleSuccess"
          :on-error="handleError"
          name="file"
          :action="imagesUploadApi"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          style="width: 50%"
        />
      </el-form-item>
      <el-form-item label="案例内容" prop="content">
        <editor @submit-text="getHtml" />
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
import Editor from '../../components/Editor'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'NewsEdit',
  components: { Editor },
  data() {
    return {
      labelPosition: 'top',
      headers: { 'Authorization': getToken() },
      form: {
        newsImage: '',
        title: '',
        description: '',
        content: ''
      },
      imageName: '',
      rules: {
        title: [
          { required: true, message: '请输入新闻标题', trigger: 'blur' },
          { min: 5, message: '标题最少5个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '文章描述不能为空', trigger: 'change' }
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
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert(JSON.stringify(this.form))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getHtml(data) {
      this.form.content = data
      console.log(this.form.content)
    },
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.form.name = file.name
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      this.$notify({
        title: '图片上传成功',
        type: 'success',
        duration: 2500
      })
      this.form.newsImage = response.realName
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    }
  }
}
</script>

<style scoped>

</style>
