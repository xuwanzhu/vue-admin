import request from '@/utils/request'
//向后端请求数据

//简单理解：axios负责与后端交互，axios主要是用于向后台发起请求的，还有在请求中做更多是可控功能


export default {
  //1、添加小节
  addVideoInfo (video) {
    return request({
      url: '/eduservice/video/addVideoInfo',
      method: 'post', //后端请求方式
      data: video
    })
  },

  //2、修改小节
  updateVideorInfo (video) {
    return request({
      url: '/eduservice/video/updateVideo',
      method: 'post', //后端请求方式
      data: video
    })
  },

  //3、根据id删除小节
  deleteVideoById (videoId) {
    return request({
      url: '/eduservice/video/deleteVideo/' + videoId, //这里url单引号！！！！！
      method: 'delete', //后端请求方式
    })
  },

   //4、根据id删除阿里云端视频
   deleteAliyunVideoById (videoId) {
    return request({
      url: '/eduvod/video/removeVideo/' + videoId, //这里url单引号！！！！！
      method: 'delete', //后端请求方式
    })
  },


  //5、根据id查询单个小节数据
  getOneVideoById (videoId) {
    return request({
      url: '/eduservice/video/getOneVideo/' + videoId,
      method: 'get', //后端请求方式
    })
  }

}