<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href="OSS_PATH +
'/excel/model.xlsx?versionId=CAEQMBiBgIC7u_iS9BciIDdmYTJhZWE0N2M0NTRkOTc4MzA1ZmFkNzM1OTQ5Mjc1'">点击下载参考模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload ref="upload" :auto-upload="false" :on-success="fileUploadSuccess" :on-error="fileUploadError"
          :disabled="importBtnDisabled" :limit="1" :action="BASE_API+'/eduservice/subject/addSubject'" name="file"
          accept="application/vnd.ms-xlsx">

          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

          <el-button :loading="loading" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
            {{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>


export default {
  data () {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
      OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
      fileUploadBtnText: '上传到服务器', // 按钮文字
      importBtnDisabled: false, // 按钮是否禁用
      loading: false
    }
  },

  created () {

  },

  methods: {

    //点击按钮上传到服务器的方法  表单提交形式
    submitUpload () {
      this.fileUploadBtnText = '正在上传'
      this.importBtnDisabled = true  // 按钮是否禁用
      this.loading = true
      this.$refs.upload.submit() //js:document.getElementById("upload").submit()
    },

    //上传成功的方法
    fileUploadSuccess () {
      //提示信息
      this.fileUploadBtnText = '导入成功'
      this.loading = false
      this.$message({
        type: 'success',
        message: "添加课程分类成功！"
      })

      //跳转到课程分类列表
      //路由跳转
      this.$router.push({ path: '/subject/list' })

    },

    //上传失败的方法
    fileUploadError () {
      //提示信息
      this.fileUploadBtnText = '导入失败！'
      this.loading = false
      this.$message({
        type: 'error',
        message: "添加课程分类失败！"
      })


    }
  }


}
</script>
