<template>
  <div class="app-container">

    <el-form label-width="120px">

      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0" />
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
        数据类型一定要和取出的json中的一致，否则没法回填
        因此，这里value使用动态绑定的值，保证其数据类型是number
        -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper v-show="imagecropperShow" :width="300" :height="300" :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss/upload'" field="file" @close="close" @crop-upload-success="cropSuccess" />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },//引入声明
  data () {
    return {
      teacher: {//上面双向绑定的teacher对象
        //属性可加可不加，不影响
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        //设置一个默认头像
        avatar: ''
      },
      imagecropperShow: false,//上传弹窗组件是否显示
      imagecropperKey: 0,//上传组件key值
      BASE_API: process.env.BASE_API,//获取dev.env.js中的值
      saveBtnDisabled: false // 保存按钮是否禁用,重复提交则禁用
    }
  },

  created () { //页面渲染之前执行
    this.init()
  },

  watch: {  //路由监听
    $route (to, from) { //路由变化方式，当路由(页面跳转)发生变化时，方法就会执行
      this.init()
    }
  },

  methods: {
    //关闭头像上传弹窗的方法
    close () {
      this.imagecropperShow = false
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },

    //上传头像成功的方法
    cropSuccess (data) {
      //关闭上传弹窗
      this.imagecropperShow = false
      //上传之后接口返回图片地址
      this.teacher.avatar = data.url
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },


    //初始
    init () {
      //判断网址路径中是否有id值，回显、修改
      if (this.$route.params && this.$route.params.id) {  //是route,而不是router,固定写法
        //从路径中获取值
        const id = this.$route.params.id
        //调用根据id查询的方法
        this.getInfo(id)
      } else {
        //清空表单
        this.teacher = {}
        //设置默认头像
        this.teacher.avatar = 'https://edu-guli-project-oss.oss-cn-shenzhen.aliyuncs.com/2022/01/19/QQ%E5%9B%BE%E7%89%8720220119235102.jpg'
      }
    },

    //保存或更新
    saveOrUpdate () {
      this.saveBtnDisabled = true
      //判断是添加还是修改
      //teacher对象有id则为修改，无id则为添加
      if (this.teacher.id) {
        this.updateTeacher()
      } else {
        this.savaData()
      }
    },


    //保存 方法  ,添加讲师
    savaData () {
      //提示
      teacherApi.addTeacher(this.teacher)
        .then(response => {
          return this.$message({
            type: 'success',
            message: '添加成功!'
          }),
            //跳转到列表
            this.$router.push({ path: '/teacher/table' })  //路由
        })
    },

    //根据id查询讲师方法，回显
    getInfo (id) {
      teacherApi.getTeacherInfo(id)
        .then(response => {
          this.teacher = response.data.teacher  //将获取的teacher对象数据赋给当前from表单的teache对象、双向绑定
        })
    },

    //修改讲师 方法
    updateTeacher () {
      teacherApi.updateTeacherInfo(this.teacher)
        .then(response => {
          return this.$message({
            type: 'success',
            message: '修改成功!'
          }),
            //跳转到列表
            this.$router.push({ path: '/teacher/table' })  //路由
        })

    }
  }


}
</script>