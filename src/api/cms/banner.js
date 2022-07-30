import request from '@/utils/request'
//向后端请求数据

//简单理解：axios负责与后端交互，axios主要是用于向后台发起请求的，还有在请求中做更多是可控功能


export default {
  //1、获取多条件Banner分页列表
  getBannerPageList (page, limit, bannerQuery) {
    return request({
      url: `/educms/banneradmin/pageBanner/${page}/${limit}`, //这里url单引号！！！！！
      method: 'post',
      data: bannerQuery
    })
  },

  //2、添加Banner
  addBanner (banner) {
    return request({
      url: '/educms/banneradmin/save',
      method: 'post',
      data: banner
    })
  },

  //3、修改Banner
  updateBanner (banner) {
    return request({
      url: '/educms/banneradmin/update',
      method: 'post',
      data: banner
    })
  },

  //4、删除Banner
  deleteBanner (id) {
    return request({
      url: `/educms/banneradmin/remove/${id}`,
      method: 'delete' //后端请求方式
    })
  },

  //5、根据id查询Banner对象数据
  getBannerById (id) {
    return request({
      url: `/educms/banneradmin/selectBannerById/${id}`,
      method: 'get' //后端请求方式
    })
  }

}