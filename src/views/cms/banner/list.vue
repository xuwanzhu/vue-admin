<template>
  <div class="app-container">

    <!-- 查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="bannerQuery.title" placeholder="标题" />
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker v-model="bannerQuery.begin" type="datetime" placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="bannerQuery.end" type="datetime" placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 数据表格 -->
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          <!-- 显示记录的序号 -->
          {{ (page - 1) * limit + scope.$index + 1 }}
          <!-- 这里的scope对象表示这个表格对象 -->
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="400" />
      <el-table-column prop="linkUrl" label="链接地址" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="操作" width="200" align="center">

        <template slot-scope="scope">
          <router-link :to="'/cms/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除
          </el-button>
        </template>

      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper" @current-change="gotoPage" />
  </div>
</template>


<script>
import bannerApi from "@/api/cms/banner";

export default {
  data () {
    //定义变量和初始化
    return {
      page: 1, //page 当前页 它会跟上面的分页进行绑定,所以gotoPage无需用this
      limit: 6, //每页大小 
      total: 0, //总记录数
      bannerQuery: {}, //条件对象

      list: null //后端接口返回的数据集合
    };
  },

  created () {
    //渲染页面之前执行，一般调用methods定义的方法
    this.getList();
  },


  methods: {
    //获取列表
    getList (page = 1) {
      this.page = page;
      bannerApi.getBannerPageList(this.page, this.limit, this.bannerQuery)
        .then(response => {
          debugger
          this.list = response.data.items;
          this.total = response.data.total;
        });
    },

    //2、分页跳转
    gotoPage (page) {
      bannerApi.getBannerPageList(page, this.limit, this.bannerQuery)
        .then(response => {
          this.list = response.data.items;
        })
    },

    //清空功能
    resetData () {
      //将表单输入项的数据置空
      this.bannerQuery = {};
      //重新获取列表数据
      this.getList();
    },

    //删除banner数据
    removeDataById (id) {
      //从用户体验角度出发，加一个友好性的提示，怕用户误操作直接删掉了记录
      this.$confirm("此操作将永久删除banner记录，是否继续？", "提示", {
        confirmButtonText: "确定",//点击确定，执行then方法
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //调用删除的方法
        bannerApi.deleteBanner(id).then(response => {
          //删除成功，提示信息
          this.$message({
            type: "success",
            message: "删除成功"
          });
          //删除之后重新加载列表
          this.getList();
        });
      });
    }
  }
};
</script>
