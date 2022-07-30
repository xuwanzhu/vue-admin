import request from '@/utils/request'

export default {
  //1、获取支付分页列表
  getPayLogPageList (page, limit, payLog) {
    return request({
      url: `/eduorder/paylog/pagePayLogList/${page}/${limit}`,
      method: 'post',
      data: payLog
    })
  },

  //2、根据支付id删除支付数据
  deletePayLog (paylogId) {
    return request({
      url: '/eduorder/paylog/deletePayLog/' + paylogId,
      method: 'delete'
    })
  }


}