import request from '@/utils/request'

export default {
  //1、根据日期生成数据
  createStatistics (day) {
    return request({
      url: `/staservice/statistics/createStatisticsByDate/${day}`, //这里url不是用单引号！！！！！
      method: 'post', //后端请求方式
    })
  },


  //2、根据日期条件生成图表显示
  showChartData (searchObj) {
    return request({
      url: `/staservice/statistics/showChart/${searchObj.begin}/${searchObj.end}/${searchObj.type}`, //这里url不是用单引号！！！！！
      method: 'get', //后端请求方式
    })
  }




}