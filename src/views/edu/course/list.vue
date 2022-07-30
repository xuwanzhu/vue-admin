<!--在讲师列表页面list.vue调用定义的接口方法，得到返回的数据，并进行显示 1-->
<template>
  <div class="app-container">
    <!--条件查询表单-->
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select v-model="searchObj.subjectParentId" placeholder="请选择" @change="subjectLevelOneChanged">
          <el-option v-for="subject in subjectNestedList" :key="subject.id" :label="subject.title"
            :value="subject.id" />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="searchObj.subjectId" placeholder="请选择">
          <el-option v-for="subject in subSubjectList" :key="subject.id" :label="subject.title" :value="subject.id" />
        </el-select>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="searchObj.title" placeholder="课程标题" />
      </el-form-item>

      <!-- 讲师 -->
      <el-form-item>
        <el-select v-model="searchObj.teacherId" placeholder="请选择讲师">
          <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id" />
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>

    </el-form>

    <!-- 表格 -->
    <!-- 底层封装了for循环，它会自己去遍历 list 中的对象数据 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="数据加载中" border fit highlight-current-row
      row-class-name="myClassList">
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="课程信息" width="470" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" alt="scope.row.title" width="150px">
            </div>
            <div class="title">
              <a href="">{{ scope.row.title }}</a>
              <p>{{ scope.row.lessonNum }} </p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate.substr(0, 10) }}
        </template>
      </el-table-column>

      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtModified.substr(0, 10) }}
        </template>
      </el-table-column>

      <el-table-column label="价格" width="100" align="center">
        <template slot-scope="scope">
          {{ Number(scope.row.price) === 0 ? '免费' :'¥' + scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>

      <el-table-column prop="buyCount" label="付费学员" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.buyCount }}人
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">

          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>

          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>

          <el-button type="text" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper" @current-change="fetchData" />

  </div>
</template> 
<script>
//引入调用的js文件
import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'

export default {
  data () {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数

      searchObj: { //封装查询对象
        subjectParentId: '',
        subjectId: '',
        title: '',
        teacherId: ''
      }, // 查询条件

      teacherList: [], // 讲师列表
      subjectNestedList: [], // 一级分类列表
      subSubjectList: [] // 二级分类列表,
    }
  },

  created () {
    // 当页面加载时获取数据
    this.fetchData()
    // 初始化分类列表
    this.initSubjectList()
    // 获取讲师列表
    this.initTeacherList()
  },


  methods: {
    //1、多条件分页查询
    fetchData (page = 1) { // 调用api层获取数据库中的数据
      // 当点击分页组件的切换按钮的时候，会传输一个当前页码的参数page
      // 解决分页无效问题
      this.page = page
      this.listLoading = true
      console.log("==+++=" + this.searchObj.subjectId + "++++")

      console.log("==+++=" + this.searchObj + "++++")
      debugger
      course.getPageList(this.page, this.limit, this.searchObj)
        .then(response => {
          // debugger 设置断点调试
          if (response.success === true) {
            this.total = response.data.total
            this.list = response.data.rows
          }
          this.listLoading = false
        })
    },

    //2、获取讲师列表
    initTeacherList () {
      teacher.getList().then(response => {
        this.teacherList = response.data.items
      })
    },

    //3、初始化分类列表
    initSubjectList () {
      subject.getSubjectList().then(response => {
        this.subjectNestedList = response.data.list
      })
    },

    //4、选择-课程类别
    subjectLevelOneChanged (value) {
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) { //value=teacher.id ，subjectNestedList为一级分类列表
          this.subSubjectList = this.subjectNestedList[i].children
          //this.searchObj.subjectId = '';
          debugger
          console.log("====>>" + this.searchObj.subjectId + "====")
        }
      }
    },

    //5、清空按钮
    resetData () {
      this.searchObj = {
        subjectParentId: '',
        subjectId: '',
        title: '',
        teacherId: ''
      }
      this.subSubjectList = [] // 二级分类列表
      this.fetchData()
    },

    //6、删除
    removeDataById (id) {

      //消息提示
      this.$confirm('是否删除该课程记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        course.deleteCourseById(id) //执行teacher.js中的删除方法

          .then(response => {//删除成功，则提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            //删除之后，返回列表
            this.fetchData()// 当页面加载时获取数据           
            this.initSubjectList()// 初始化分类列表           
            this.initTeacherList()// 获取讲师列表
          })//可以没有catch，因为request.js中也会返回错误信息

      })
    }

  }
}


</script>

<style scoped>
.myClassList .info {
  width: 450px;
  overflow: hidden;
}
.myClassList .info .pic {
  width: 150px;
  height: 90px;
  overflow: hidden;
  float: left;
}
.myClassList .info .pic a {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.myClassList .info .pic img {
  display: block;
  width: 100%;
}
.myClassList td .info .title {
  width: 280px;
  float: right;
  height: 90px;
}
.myClassList td .info .title a {
  display: block;
  height: 48px;
  line-height: 24px;
  overflow: hidden;
  color: #00baf2;
  margin-bottom: 12px;
}
.myClassList td .info .title p {
  line-height: 20px;
  margin-top: 5px;
  color: #818181;
}
</style>