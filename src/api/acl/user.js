import request from '@/utils/request'

const api_name = '/admin/acl/user'

export default {

  //1、获取管理用户分页列表
  getPageList (page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj // url查询字符串或表单键值对
    })
  },

  //2、根据用户id 查询用户
  getById (id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },


  //3、新增管理用户
  save (user) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: user
    })
  },
  //4修改管理用户
  updateById (user) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: user
    })
  },
  //5根据用户获取角色数据
  getAssign (userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },
  //6根据用户分配角色
  saveAssign (userId, roleId) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params: { userId, roleId }
    })
  },
  //7删除管理用户
  removeById (id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  //8根据id列表 批量删除管理用户
  removeRows (idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList
    })
  }
}
