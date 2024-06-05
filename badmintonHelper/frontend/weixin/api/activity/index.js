const { baseUrl } = require('../../common/js/base');

function getActivityList(type) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'activity/list?type=' + type,
      header: {
        authorization: 'Bearer ' + token
      },
      method: 'GET',
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

function getActivityDetail(id) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'activity/detail/' + id,
      header: {
        authorization: 'Bearer ' + token
      },
      method: 'GET',
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

// 新增活动数据
function addActivityDetail(data) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'activity/detail/',
      header: {
        authorization: 'Bearer ' + token
      },
      method: 'POST',
      data,
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

// 修改活动数据
function modifyActivityDetail(data) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'activity/detail/',
      header: {
        authorization: 'Bearer ' + token
      },
      method: 'PUT',
      data,
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

// 删除活动数据
function delActivityDetail(id) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'activity/detail/' + id,
      header: {
        authorization: 'Bearer ' + token
      },
      method: 'DELETE',
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

// 获取报名者信息：
function getApplyInfoList(activityId) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'activity/applyInfo?activityId=' + activityId,
      header: {
        authorization: 'Bearer ' + token
      },
      method: 'GET',
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

// 新增活动报名数据
function applyActivity(data) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'activity/apply/',
      header: {
        authorization: 'Bearer ' + token
      },
      method: 'POST',
      data,
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

function cancelApplyActivity(data) {
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + 'activity/apply/',
      header: {
        authorization: 'Bearer ' + token
      },
      method: 'DELETE',
      data,
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
  getActivityList,
  getActivityDetail,
  addActivityDetail,
  modifyActivityDetail,
  delActivityDetail,
  getApplyInfoList,
  applyActivity,
  cancelApplyActivity,
};