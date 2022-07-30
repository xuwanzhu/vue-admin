import request from '@/utils/request'
//向后端请求数据

//简单理解：axios负责与后端交互，axios主要是用于向后台发起请求的，还有在请求中做更多是可控功能


export default {
  //1、添加课程信息
  addCourseInfo (courseInfo) {
    return request({
      url: `/eduservice/course/addCourse`, //这里url不是用单引号！！！！！
      method: 'post', //后端请求方式
      //params
      //teacherQuery条件对象,后端使用RequestBody获取数据用data,而不是上面的params
      //data表示把teacherQuery对象转换成json进行传递到接口里面
      //data: teacherQuery
      data: courseInfo
    })
  },

  //2、获取讲师列表(下拉框)
  getTeacherList () {
    return request({
      url: `/eduservice/teacher/findAll`, //这里url不是用单引号！！！！！
      method: 'get', //后端请求方式
    })
  },

  //3、返回上一步(回显课程数据)
  getCourseInfoById (courseId) {
    return request({
      url: `/eduservice/course/getCourseInfo/${courseId}`,
      method: 'get', //后端请求方式
    })
  },

  //4、返回上一步(修改课程数据)
  updateCourseInfo (courseInfo) {
    return request({
      url: `/eduservice/course/updateCourseInfo`,
      method: 'post', //后端请求方式
      //data表示把courseInfo对象转换成json进行传递到控制层接口里面
      data: courseInfo
    })
  },

  //5、显示课程最终发布信息
  getPublicCourseInfo (courseId) {
    return request({
      url: '/eduservice/course/getCoursePublishVoById/' + courseId,
      method: 'get', //后端请求方式
    })
  },

  //6、发布最终课程
  publicCourse (courseId) {
    return request({
      url: '/eduservice/course/publishCourse/' + courseId,
      method: 'post', //后端请求方式
    })
  },


  //7、课程列表（多条件查询分页）
  //current当前页 limit每页记录数 courseQuery条件对象
  getPageList (current, limit, courseQuery) {
    return request({
      url: `/eduservice/course/pageCourseList/${current}/${limit}`, //这里url不是用单引号！！！！！
      method: 'post', //后端请求方式
      //params
      //courseQuery条件对象,后端使用RequestBody获取数据用data,而不是上面的params
      //data表示把前端courseQuery对象转换成json进行传递到接口里面
      data: courseQuery
    })
  },

  //8、根据id删除课程
  deleteCourseById (courseId) {
    return request({
      url: '/eduservice/course/deleteCourseById/' + courseId,
      method: 'delete', //后端请求方式
    })
  }

}
