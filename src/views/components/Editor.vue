<template>
  <el-row>
    <el-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
      <div ref="editor" class="text" />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { upload } from '@/utils/upload'
import E from 'wangeditor'
export default {
  name: 'Editor',
  props: {
    content: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editorContent: ''
    }
  },
  computed: {
    editor() {
      return new E(this.$refs.editor)
    },
    ...mapGetters([
      'imagesUploadApi',
      'baseApi'
    ])
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.editorContent = null
      }
    },
    content(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.content)
      }
    }
  },
  mounted() {
    const _this = this
    this.editorContent = this.content
    // 自定义菜单配置
    this.editor.customConfig.zIndex = 10
    // 文件上传
    this.editor.customConfig.customUploadImg = function(files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      files.forEach(image => {
        upload(_this.imagesUploadApi, image).then(res => {
          const data = res.data
          const url = _this.baseApi + '/file/' + data.type + '/' + data.realName
          insert(url)
        })
      })
    }
    this.editor.customConfig.onchange = (html) => {
      this.editorContent = html
      this.$emit('submit-text', html)
    }
    this.editor.create()
    // 初始化数据
    this.editor.txt.html(this.editorContent)
    console.log(this.editorContent)
  }
}
</script>

<style scoped>
.text {
  text-align:left;
}
::v-deep .w-e-text-container {
  height: 420px !important;
}
</style>
