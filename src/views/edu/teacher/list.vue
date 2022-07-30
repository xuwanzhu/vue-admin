<!--在讲师列表页面list.vue调用定义的接口方法，得到返回的数据，并进行显示-->
<template>
  <div class="app-container">
    <!--条件查询表单-->
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker v-model="teacherQuery.begin" type="datetime" placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
      </el-form-item>

      <el-form-item>
        <el-date-picker v-model="teacherQuery.end" type="datetime" placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>

      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <!-- 底层封装了for循环，它会自己去遍历 list 中的对象数据 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="数据加载中" border fit highlight-current-row>

      <el-table-column label="序号" width="70" align="center">
        <!--scope : 表示范围，即整个表格是一个scope，也就是范围或者域-->
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160" />
      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <!--点击修改按钮时，进入该路由路径，即执行路由跳转功能-->
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>

          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!--@current-change分页的方法-->
    <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper" @current-change="getList" />

  </div>
</template> 
<script>
//引入调用的teacher.js文件
import teacher from '@/api/edu/teacher'

export default {
  //写核心代码的位置
  //data: {},
  data () {   //定义变量和初始值
    return {
      list: null,//查询之后接口返回 的集合
      listLoading: false, // 是否显示loading信息
      page: 1,  //当前页，默认为1
      limit: 10,  //每页记录数
      total: 0,   //总记录数
      teacherQuery: {}  //条件封装对象
    }
  },

  created () { //页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
  },

  methods: {  //创建具体的方法，调用teacher.js定义的方法
    getList (page = 1) {  //不传page默认等于1，若传page则等于相应的page值
      // axios.post("").then().catch() 弃用
      console.log('加载列表')
      //console.log("page-->" + page)
      //this.listLoading = true
      this.page = page
      teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then(response => { //请求成功之后执行,response中有getTeacherListPage方法返回的数据集
          //console.log(response)
          this.list = response.data.rows   //将response中的数据   返还给list
          this.total = response.data.total
          //console.log(this.list)
          //console.log(this.total)
        })
        .catch(erro => {
          console.log("121212")
        }) //请求失败之后执行
    },

    //清空 方法
    resetData () {
      this.teacherQuery = {} //将已输入框的值 清空
      this.getList() //重新显示所有数据
    },

    //删除讲师方法
    removeDataById (id) {

      //消息提示
      this.$confirm('是否删除该讲师记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacher.removeById(id) //执行teacher.js中的删除方法

          .then(response => {//删除成功，则提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            //删除之后，返回列表
            this.getList()
          })//可以没有catch，因为request.js中也会返回错误信息

      })
    }
  }
}
</script>