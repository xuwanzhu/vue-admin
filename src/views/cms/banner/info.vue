<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-form label-width="120px">
      <!-- 轮播图名称-->
      <el-form-item label="轮播图名称">
        <el-input v-model="banner.title" placeholder=" 轮播图名称"></el-input>
      </el-form-item>

      <!--轮播图链接地址-->
      <el-form-item label="图片链接地址">
        <el-select v-model="banner.linkUrl" clearable placeholder="请选择">
          <!--
        数据类型一定要和取出的json中的一致，否则没法回填
        因此，这里value使用动态绑定的值，保证其数据类型是number
        -->
          <el-option :value="1" label="课程页" />
          <el-option :value="2" label="讲师页" />
        </el-select>
      </el-form-item>

      <!-- 轮播图封面-->
      <el-form-item label="轮播图封面">
        <el-upload :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/upload'" class="avatar-uploader">
          <img :src="banner.imageUrl" width="400px" height="250px">
        </el-upload>
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0" />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="SaveOrUpdate">保存并下一步</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>


<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'

export default {
  data () {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用

      banner: {
        title: '',
        imageUrl: '',
        linkUrl: '',
        sort: 0,
      },

      BASE_API: process.env.BASE_API, // 接口API地址


      courseId: "" //课程id,返回上一步时用来（回显数据）

    }
  },


  created () {
    //修改课程初始化
    //根据课程id回显数据
    //获取网址中的id,   为啥是id?因为路由中的参数就名为id
    if (this.$route.params && this.$route.params.id) {
      //获取id
      this.courseId = this.$route.params.id
      //调用获取章节和小节列表的方法,或者做数据回显
      this.getCourseInfo()
    } else { //添加课程初始化，不能删，它和watch监听功能不一样
      this.getListTeacher()
      this.getOneSubjectLever()
    }

  },

  watch: {  //监听路由变化，若变化，则执行以下方法
    $route (to, from) {
      this.banner = {
        title: '',
        imageUrl: '',
        linkUrl: '',
        sort: 0,
      }
    }
  },



  methods: {
    //判断是添加还是修改课程
    SaveOrUpdate () {
      //1、添加(保存)课程
      if (this.courseInfo.id == null) {
        course.addCourseInfo(this.courseInfo)//将表单对象courseInfo传到后台
          .then(response => {
            //提示成功
            this.$message({
              type: 'success',
              message: '添加课程信息成功！'
            }),

              //跳转到第二步
              //这个跳转路径是 router中path中的地址
              this.$router.push({ path: '/course/chapter/' + response.data.courseId })


          })
      }
      else {  //2、修改课程信息
        course.updateCourseInfo(this.courseInfo)
          .then(response => {
            //提示成功
            this.$message({
              type: 'success',
              message: '修改课程信息成功！'
            }),

              //跳转到第二步
              //这个跳转路径是 router中path中的地址
              this.$router.push({ path: '/course/chapter/' + this.courseInfo.id })
          })

      }
    },



    //上传封面成功调用的方法
    //结果回调
    handleAvatarSuccess (response, file) {
      this.courseInfo.cover = response.data.url
    },

    //上传封面之前调用的方法
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    //根据课程id回显数据(返回上一步)
    getCourseInfo () {
      course.getCourseInfoById(this.courseId)
        .then(response => {
          this.courseInfo = response.data.courseInfo
        })

      //回显课程分类
      //框架会根据一级分类id和一级分类列表  和二级分类id、二级分类列表，对页面的课程分类进行回显
      subject.getSubjectList()
        .then(response => {
          //1、获得所有一级分类和二级分类
          this.subjectOneList = response.data.list
          //2、获得将回显的二级分类subjectTwoList
          for (var i = 0; i < this.subjectOneList.length; i++) {
            if (this.courseInfo.subjectParentId == this.subjectOneList[i].id) {
              this.subjectTwoList = this.subjectOneList[i].children
              console.log(this.subjectTwoList)
            }
          }
        })
      this.getListTeacher() //回显讲师
    }



  }

}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>