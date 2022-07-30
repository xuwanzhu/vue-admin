<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker v-model="day" type="date" placeholder="选择要统计的日期" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-button :disabled="btnDisabled" type="primary" @click="create()">生成</el-button>
    </el-form>
  </div>
</template>

<script>
import staApi from '@/api/edu/statistics'

export default {

  data () {
    return {
      day: '',  //选择日期
      btnDisabled: false
    }
  },

  methods: {
    //1、生成数据
    create () {
      this.btnDisabled = true
      staApi.createStatistics(this.day).then(response => {
        this.btnDisabled = false

        this.$message({
          type: 'success',
          message: '生成成功'
        })
      }).catch((response) => {
        this.btnDisabled = false
        this.$message({
          type: 'error',
          message: '生成失败'
        })
      })
    }
  }
}
</script>
