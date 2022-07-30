import request from '@/utils/request'
//向后端请求数据

//简单理解：axios负责与后端交互，axios主要是用于向后台发起请求的，还有在请求中做更多是可控功能


export default {

  //1、讲师列表
  getList () {
    return request({
      url: `/eduservice/teacher/findAll`,
      method: 'get',
    })
  },

  //2、讲师列表（条件查询分页）
  //current当前页 limit每页记录数 teacherQuery条件对象
  getTeacherListPage (current, limit, teacherQuery) {
    return request({
      url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`, //这里url不是用单引号！！！！！
      method: 'post', //后端请求方式
      //params
      //teacherQuery条件对象,后端使用RequestBody获取数据用data,而不是上面的params
      //data表示把teacherQuery对象转换成json进行传递到接口里面
      data: teacherQuery
    })
  },

  //删除讲师，逻辑删除
  removeById (id) {
    return request({
      url: `/eduservice/teacher/${id}`,
      method: 'delete', //后端请求方式
      //无参数
      //params
    })
  },

  //添加讲师
  addTeacher (teacher) {
    return request({
      url: `/eduservice/teacher/addTeacher`,
      method: 'post', //后端请求方式
      //表单对象
      data: teacher
    })
  },

  //根据id查询讲师
  getTeacherInfo (id) {
    return request({
      url: `/eduservice/teacher/getTeacher/${id}`,
      method: 'get', //后端请求方式
    })
  },

  //修改讲师
  updateTeacherInfo (teacher) {
    return request({
      url: `/eduservice/teacher/updateTeacher`,
      method: 'post', //后端请求方式
      //表单对象
      data: teacher
    })
  }
}
