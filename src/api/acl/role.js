import request from '@/utils/request'

const api_name = '/admin/acl/role'

export default {

  //1、获取角色分页列表
  getPageList (page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj // url查询字符串或表单键值对
    })
  },
  //2、获取角色
  getById (id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },
  //3、新增角色
  save (role) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: role
    })
  },
  //4、修改角色
  updateById (role) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: role
    })
  },
  getAssign (roleId) {
    return request({
      url: `${api_name}/toAssign/${roleId}`,
      method: 'get'
    })
  },
  //6、删除角色
  removeById (id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  //7、根据id列表删除角色
  removeRows (idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList
    })
  }

}
