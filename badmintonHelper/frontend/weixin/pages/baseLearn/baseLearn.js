// Page 构造器适用于简单的页面。

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexType: 1,
    count: 0,
    inputValue: 'kzttt',
    imgSrc: '../../image/jd618.png',
    arrList: ['香蕉', '苹果', '葡萄']
  },

  /**
   * 1、生命周期函数--监听页面加载
   * 类似vue中的created
   */
  onLoad(options) {
    // 1、通过 getApp 方法获取到全局唯一的 App 实例，获取App上的数据或调用开发者注册在 App 上的函数。
    const appInstance = getApp()
    console.log(appInstance.globalData.userInfo)
    console.log(appInstance.globalData.func(222))
  },

  /**
   * 2、生命周期函数--监听页面初次渲染完成
   * 类似vue中的mounted
   */
  onReady() {
    // 动态设置标题：
    wx.setNavigationBarTitle({
      title: '基础学习',
    })
  },

  /**
   * 3、生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 4、生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 5、生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onPageScroll: function () {
    // 页面滚动时执行
  },

  onResize: function () {
    // 页面尺寸变化时执行
  },

  onTabItemTap(item) {
    // tab 点击时执行
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },

  // 事件响应函数
  viewTap: function () {
    this.setData({
      text: 'Set some data for updating view.'
    }, function () {
      // this is setData callback
    })
  },

  onClick(e) {
    console.log(e);
  },

  onCountAdd(e) {
    // 2、通过setData函数，来动态改变响应式的值（类似react）
    this.setData({
      count: this.data.count + 1
    })
  },

  onParaTest(e) {
    // 3、通过e.target.dataset方式获取事件传参：
    console.log(e.target.dataset.info);
  },

  onInputChange(e) {
    // 4、通过e.detail.value方式获取输入框的值：
    this.setData({
      inputValue: e.detail.value
    })
  },

  // get请求示例：
  getUserInfo() {
    wx.request({
      url: 'https://www.escook.cn/api/get',
      method: 'GET',
      data: {
        name: 'kzt',
        age: 29
      },
      success: (res) => {
        console.log(res);
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  // post请求示例：
  postInfo() {
    wx.request({
      url: 'https://www.escook.cn/api/post',
      method: 'POST',
      data: {
        name: 'kzt',
        age: 29
      },
      success: (res) => {
        console.log(res);
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  // 自由数据
  customData: {
    hi: 'MINA'
  }
})