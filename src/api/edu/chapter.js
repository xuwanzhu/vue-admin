import request from '@/utils/request'
//向后端请求数据

//简单理解：axios负责与后端交互，axios主要是用于向后台发起请求的，还有在请求中做更多是可控功能


export default {
  //1、查询所有章节列表
  getAllChapterVideo (courseId) {
    return request({
      url: '/eduservice/chapter/getChapterVideo/' + courseId, //这里url单引号！！！！！
      method: 'get', //后端请求方式
      //params
      //teacherQuery条件对象,后端使用RequestBody获取数据用data,而不是上面的params
      //data表示把teacherQuery对象转换成json进行传递到接口里面
      //data: teacherQuery
    })
  },

  //2、添加章节
  addChapterInfo (chapter) {
    return request({
      url: '/eduservice/chapter/addChapter',
      method: 'post', //后端请求方式
      data: chapter
    })
  },

  //3、修改章节
  updateChapterInfo (chapter) {
    return request({
      url: '/eduservice/chapter/updateChaper',
      method: 'post', //后端请求方式
      data: chapter
    })
  },

  //4、根据id删除章节
  deleteChapterById (chapterId) {
    return request({
      url: '/eduservice/chapter/deleteChapterById/' + chapterId, //这里url单引号！！！！！
      method: 'delete', //后端请求方式
      //params
      //teacherQuery条件对象,后端使用RequestBody获取数据用data,而不是上面的params
      //data表示把teacherQuery对象转换成json进行传递到接口里面
      //data: teacherQuery
    })
  },


  //5、根据id查询单个章节数据
  getOneChapterById (chapterId) {
    return request({
      url: '/eduservice/chapter/getOneChapter/' + chapterId,
      method: 'get', //后端请求方式
    })
  }

}