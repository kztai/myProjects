// pages/pullRefreshLoadLearn/pullRefreshLoadLearn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    isLoading: false,
    list: [1,2,3,4,5,6,7,8,9]
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('监听用户下拉动作');
    this.setData({
      count: 0
    });
    // 下拉的loading状态需要手动关闭：
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   * 注意：需要处理触发触底事件，但是已经没有数据的情况。（通过判断：page * pageSize >= total）
   */
  onReachBottom() {
    console.log('监听页面上拉触底');
    // 判断是否还有数据：
    if(this.data.list.length >= 30) {
      return wx.showToast({
        title: '数据已加载完毕！',
        icon: 'none'
      })
    }
    // 判断是否loading态，防止反复发出请求：
    if(!this.data.isLoading) {
      // loading态置为true：
      this.setData({
        isLoading: true
      })
      wx.showLoading({
        title: '加载中...',
      });
      setTimeout(()=> {
        this.data.list.push('kzt', 'kzt1', 'kzt2');
        this.setData({
          list: this.data.list,
          isLoading: false
        });
        wx.hideLoading()
      }, 1000)
    }
  },

  countAdd() {
    this.setData({
      count: this.data.count+1
    })
  }
})