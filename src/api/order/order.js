import request from '@/utils/request'

export default {

  //1、创建订单
  createOrder (courseId) {
    return request({
      url: '/eduorder/order/createOrder/' + courseId,
      method: 'post'
    })
  },

  //2、根据订单号 获取订单
  getOrderById (orderId) {
    return request({
      url: '/eduorder/order/getOrderByOrderId/' + orderId,
      method: 'get'
    })
  },

  //3、生成微信支付二维码
  //orderNo:订单号
  createOrderNo (orderNo) {
    return request({
      url: '/eduorder/paylog/createNative/' + orderNo,
      method: 'get'
    })
  },


  //4、根据id获取订单支付状态
  queryPayStatus (orderNo) {
    return request({
      url: '/eduorder/paylog/queryPayStatus/' + orderNo,
      method: 'get'
    })
  },


  //5、获取订单分页列表
  getOrderPageList (page, limit, order) {
    return request({
      url: `/eduorder/order/pageOrderList/${page}/${limit}`,
      method: 'post',
      data: order
    })
  },

  //6、根据订单id删除订单
  deleteOrder (orderId) {
    return request({
      url: '/eduorder/order/deleteOrder/' + orderId,
      method: 'delete'
    })
  }


}