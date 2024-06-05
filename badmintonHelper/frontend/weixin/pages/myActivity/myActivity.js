const { themeColor } = require('../../common/js/color');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    myActivityList: ["全部", "发起", "参与"],
    selectedColor: themeColor,
    selected: 0,
    activityType: 'myAll'
  },

  onShow() {

  },

  changeMyActivityType(e) {
    const index = e.currentTarget.dataset.index
    let activityType = null;
    switch (index) {
      case 0:
        activityType = "myAll";
        break;
      case 1:
        activityType = "myRelease";
        break;
      case 2:
        activityType = "myJoin";
        break;
    }

    this.setData({
      selected: index,
      activityType
    })
  },

})