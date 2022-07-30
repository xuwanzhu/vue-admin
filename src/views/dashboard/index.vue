<template>
  <div id="building">
    <div class="dashboard-container">
      <div class="dashboard-text">欢迎您：{{ name }}</div>
      <div class="dashboard-text"><span v-for="role in roles" :key="role">{{ role }} </span></div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 200px;
    text-align: center;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

<style scoped>
#buildiing {
  background: url("http://edu-guli-project-oss.oss-cn-shenzhen.aliyuncs.com/2022/04/21/f27b71332a6c43139250df784bef176414012664a4c6893743.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
</style>
