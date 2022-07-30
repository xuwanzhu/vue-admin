import request from '@/utils/request'

const api_name = '/admin/acl/permission'

export default {
  //查询所有菜单-递归
  getNestedTreeList () {
    return request({
      url: `${api_name}`,
      method: 'get'
    })
  },

  //递归删除菜单
  removeById (id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: "delete"
    })
  },

  //新增菜单
  saveLevelOne (menu) {
    return request({
      url: `${api_name}/save`,
      method: "post",
      data: menu
    })
  },

  //修改菜单
  update (menu) {
    return request({
      url: `${api_name}/update`,
      method: "put",
      data: menu
    })
  },

  //根据角色获取菜单
  toAssign (roleId) {
    return request({
      url: `${api_name}/toAssign/${roleId}`,
      method: 'get'
    })
  },

  //给角色分配权限
  doAssign (roleId, permissionId) {
    return request({
      url: `${api_name}/doAssign`,
      method: "post",
      params: { roleId, permissionId }
    })
  }
}
