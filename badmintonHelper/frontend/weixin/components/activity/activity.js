
const { activityStatus } = require("../../utils/map");
const { ActivityStatusEnum } = require("../../utils/enum");
const { themeColor, successColor } = require('../../common/js/color');
const { getActivityList } = require('../../api/activity/index');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'all',  // all-所有  myAll-我的所有 myRelease-我发布  myJoin-我参加的
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    successColor,
    ActivityStatusEnum,
    activityStatus,
    isRefresh: false,
    arrActivityDetail: [],
  },

  // lifetimes: {
  //   ready() {
  //     this.init();
  //   }
  // },

  // 监听器，类似vue中的watch
  // 与vue中不一样的地方是：一个key可以同时监听多个属性，参数也是对应属性的新值。
  observers: {
    type() {
      this.init();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init(callback) {
      getActivityList(this.properties.type).then((res) => {
        this.setData({
          arrActivityDetail: res
        });
        callback && callback();
      }).catch((err) => {
        wx.showToast({
          title: err.errMsg,
          icon: 'none',
          duration: 3000
        });
        callback && callback();
      })
    },

    // 下拉刷新列表：
    refreshActivityList() {
      // scroll-view组件关闭下拉刷新状态的方式：
      this.setData({
        isRefresh: true
      });
      this.init(() => {
        this.setData({
          isRefresh: false
        })
      })
    },

    showActivityDetail(e) {
      const param = e.currentTarget.dataset;
      wx.navigateTo({
        url: '/pages/activityDetail/activityDetail?activityId=' + param.activityid,
        success(res) { },
        fail(err) { },
        complete() { }
      })
    },

    // 结束下拉刷新时触发：
    stopRefreshActivityList() {
      // console.log(222);
    },

    // 滚动到底部时触发：
    loadMoreActivity() {
      // todo 判断是否到底
      console.log(33333333333);
    }
  },
})