<template>
  <div class="app-container" style="margin-top: 20px;margin-left: 300px">
    <el-form ref="form" :model="form" :label-position="labelPosition" :rules="rules">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入案例标题" style="width: 50%" />
      </el-form-item>
      <el-form-item label="文章首图" prop="newsImage">
        <el-upload
          :class="{uoloadSty: showBtnImg, disUoloadSty: noneBtnImg}"
          list-type="picture-card"
          :file-list="imageList"
          :limit="1"
          :before-upload="beforeUpload"
          :auto-upload="true"
          :headers="headers"
          :show-file-list="true"
          :on-remove="handleImgRemove"
          :on-preview="handlePictureCardPreview"
          :on-change="imgChange"
          :on-success="handleSuccess"
          :on-error="handleError"
          name="file"
          :action="imagesUploadApi"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="文章类型">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in newsTypeList"
            :key="item.id"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
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
import Editor from '../../components/Editor'
import { submit, detail, typeList } from '@/api/jnb/news'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'NewsEdit',
  components: { Editor },
  data() {
    return {
      showBtnImg: true,
      noneBtnImg: false,
      limitCountImg: 1,
      dialogImageUrl: '',
      dialogVisible: false,
      labelPosition: 'top',
      headers: { 'Authorization': getToken() },
      form: {
        id: '',
        img: '',
        title: '',
        type: '',
        description: '',
        content: ''
      },
      imageList: [],
      imageName: '',
      clear: false,
      newsTypeList: [
        {
          id: '',
          typeName: ''
        }
      ],
      value: '',
      rules: {
        title: [
          { required: true, message: '请输入新闻标题', trigger: 'blur' },
          { min: 5, message: '标题最少5个字符', trigger: 'blur' },
          { max: 20, message: '标题做多20个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '文章描述不能为空', trigger: 'change' },
          { max: 300, message: '描述做多300个字符', trigger: 'blur' }
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
  mounted() {
    this.form.id = this.$route.query.id
    if (this.form.id !== null && this.form.id !== undefined) {
      detail(this.form.id).then(res => {
        this.form = res.data
        this.imageList.push({ name: res.data.img, url: this.baseApi + '/file/图片/' + res.data.img })
        this.imgChange(null, this.imageList)
        console.log(res.data)
      })
    }
    typeList().then(res => {
      this.newsTypeList = res.data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(JSON.stringify(this.form))
          submit(JSON.stringify(this.form)).then(res => {
            this.$notify({
              title: '发布成功！',
              type: 'success',
              duration: 2500
            })
          })
          this.$router.push('/jnb/news/list')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.clear = true
      this.handleImgRemove(null, null)
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
    imgChange(file, fileList) {
      this.noneBtnImg = fileList.length >= this.limitCountImg
    },

    handleImgRemove(file, fileList) {
      this.noneBtnImg = fileList.length >= this.limitCountImg
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      this.$notify({
        title: '图片上传成功',
        type: 'success',
        duration: 2500
      })
      console.log(response)
      this.form.img = response.realName
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
/deep/ .disUoloadSty .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
</style>
