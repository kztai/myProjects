const { baseUrl } = require('../../common/js/base');

function getUserInfo(userId) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'user/userInfo',
      header: {
        authorization: 'Bearer ' + token
      },
      data: {
        userId
      },
      method: 'get',
      success: (res) => {
        if (res.statusCode !== 200) {
          reject({ errMsg: res.data })
          return;
        }
        // 这里成功返回表示http请求没问题，但是后端业务层可能返回错误信息：
        if (res.data.code === 200) {
          resolve(res.data.data)
        } else if (res.data.code === 401 || res.data.code === 402) {
          reject({ errMsg: res.data.message })
          // 通用错误代码401、402（表示token验证失败），在这一层先拦截，跳转到登录界面：
          wx.navigateTo({ url: '/pages/login/login' })
        } else {
          reject({ errMsg: res.data.message })
        }
      },
      fail(err) {
        // 这里失败返回表示http请求出错：
        reject(err)
      }
    })
  })
}


module.exports = {
  getUserInfo
};