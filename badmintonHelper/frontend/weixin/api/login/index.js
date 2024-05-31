const { baseUrl } = require('../../common/js/base');

function wxLoginApi(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'login/wxLogin',
      data,
      method: 'POST',
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
        reject(err)
      }
    })
  })
}

function wxLogout(data) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'login/wxLogout',
      header: {
        authorization: 'Bearer ' + token
      },
      data,
      method: 'POST',
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
        reject(err)
      }
    })
  })
}

module.exports = {
  wxLoginApi,
  wxLogout
};