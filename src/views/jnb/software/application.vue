<template>
  <div class="app-container" style="margin-top: 20px;margin-left: 300px">
    <div>
      <div>
        <h3>智慧枣乡App内容介绍</h3>
      </div>
      <div class="form">
        <el-form ref="form" el-form :model="form" :label-position="labelPosition">
          <el-form-item label="首图" prop="newsImage">
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
          <el-form-item prop="content" label="介绍内容">
            <editor :content="form.content" :is-clear="clear" @submit-text="getHtml" />
          </el-form-item>
        </el-form>
      </div>
      <el-row :gutter="30">
        <el-col :span="1" :offset="12">
          <el-button type="info" @click="resetForm('form')">重置</el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="success" @click="submitForm('form')">发布</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Editor from '../../components/Editor'
import { detail, submit } from '@/api/jnb/product'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'Application',
  components: { Editor },
  data() {
    return {
      showBtnImg: true,
      noneBtnImg: false,
      limitCountImg: 1,
      dialogImageUrl: '',
      dialogVisible: false,
      clear: false,
      labelPosition: 'top',
      imageList: [],
      imageName: '',
      headers: { 'Authorization': getToken() },
      form: {
        id: '',
        img: '',
        content: '',
        type: 1
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
    this.getDetail()
  },
  methods: {
    getDetail() {
      detail(this.form.type).then(res => {
        this.form = res.data
        this.imageList.push({ name: res.data.img, url: this.baseApi + '/file/图片/' + res.data.img })
        this.imgChange(null, this.imageList)
      })
    },
    getHtml(data) {
      this.form.content = data
      console.log(this.form.content)
    },
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
          this.imgChange(null, this.imageList)
          this.imageList = []
          this.form.content = ''
          detail(this.form.type).then(res => {
            this.form = res.data
            this.form.content = res.data.content
            this.imageList.push({ name: res.data.img, url: this.baseApi + '/file/图片/' + res.data.img })
            this.imgChange(null, this.imageList)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.clear = true
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
