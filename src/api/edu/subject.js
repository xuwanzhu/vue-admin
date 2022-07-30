import request from '@/utils/request'
//向后端请求数据

//简单理解：axios负责与后端交互，axios主要是用于向后台发起请求的，还有在请求中做更多是可控功能


export default {
  //1、课程分类列表
  getSubjectList () {
    return request({
      url: `/eduservice/subject/getAllSubject`, //这里url不是用单引号！！！！！
      method: 'get', //后端请求方式
      //params
      //teacherQuery条件对象,后端使用RequestBody获取数据用data,而不是上面的params
      //data表示把teacherQuery对象转换成json进行传递到接口里面
      //data: teacherQuery
    })
  }

}
