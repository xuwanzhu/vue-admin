<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：Java从入门到精通"></el-input>
      </el-form-item>

      <!-- 课程讲师-->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <!--  v-for 为循环 -->
          <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id" />
        </el-select>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程类别">
        <!-- 一级分类 
        @change 为触发事件，用来显示二级分类
        -->
        <el-select v-model="courseInfo.subjectParentId" placeholder="一级分类" @change="subjectLevelOneChanged">
          <el-option v-for="subject in subjectOneList" :key="subject.id" :label="subject.title" :value="subject.id" />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option v-for="subject in subjectTwoList" :key="subject.id" :label="subject.title" :value="subject.id" />
        </el-select>
      </el-form-item>

      <el-form-item label=" 总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="???2222">
        </el-input-number>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="250" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/upload'" class="avatar-uploader">
          <img :src="courseInfo.cover" width="400px" height="250px">
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="???1111">
        </el-input-number>
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
import Tinymce from '@/components/Tinymce' //引入富文本组件

export default {
  components: { Tinymce },//声明富文本组件
  data () {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用

      courseInfo: {
        title: '',
        subjectParentId: '',//一级分类id
        subjectId: '', //二级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: process.env.OSS_PATH + '/subject/subject.jpg', //定义默认封面
        price: 0
      },
      BASE_API: process.env.BASE_API, // 接口API地址
      teacherList: {},  //保存课程讲师列表信息
      subjectOneList: {}, //用来保存后台返回的 一级分类数据
      subjectTwoList: {}, //用来保存后台返回的 二级分类数据

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
      this.courseInfo = {
        title: '',
        subjectParentId: '',//一级分类id
        subjectId: '', //二级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: process.env.OSS_PATH + '/subject/subject.jpg', //定义默认封面
        price: 0
      };
      this.getListTeacher()
      this.getOneSubjectLever()
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

    //课程讲师列表
    getListTeacher () {
      course.getTeacherList()
        .then(response => {
          this.teacherList = response.data.items
        })
    },

    //显示一级分类
    getOneSubjectLever () {
      subject.getSubjectList()
        .then(response => {
          this.subjectOneList = response.data.list  //返回一级分类数据
        })
    },

    //显示二级分类
    //当你点击某个一级分类时，出发change事件，执行该方法
    subjectLevelOneChanged (value) {  //value为框架返回的 一级分类的id
      //返回二级分类数据
      for (var i = 0; i < this.subjectOneList.length; i++) {
        var oneSubject = this.subjectOneList[i] //一级分类对象
        if (oneSubject.id === value) { //如果数据库list中的前端id  等于 下拉框返回的一级分类id 
          this.subjectTwoList = oneSubject.children
          this.courseInfo.subjectId = '' //当重新选择一级分类下拉框，此时二级分类下拉框置为空
        }
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