const { themeColor, successColor } = require('../../common/js/color');

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    hideMessageBox: {
      type: Boolean,
      value: false
    },
    messageData: {
      type: Object,
      value: {
        custom: false,
        title: 'title',
        content: 'content',
        confirmText: '确定',
        cancelText: '取消',
        showConfirmBtn: true,
        showCancelBtn: true,
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    successColor,
    animation: null,
    animationData: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComfirmHandle() {
      this.triggerEvent('onConfirm')
      this.setData({
        hideMessageBox: true
      });
    },
    onCancelHandle() {
      this.triggerEvent('onCancel')
      this.setData({
        hideMessageBox: true
      });
    },
    onCloseHandle() {
      this.triggerEvent('onClose')
      this.setData({
        hideMessageBox: true
      });
    },

    // 播放淡入动画
    fadeIn: function () {
      // 描述动画
      this.data.animation.opacity(1).step();
      // 导出动画数据
      this.setData({
        animationData: this.data.animation.export()
      });
    },
    // 播放淡出动画
    fadeOut: function () {
      // 描述动画
      this.data.animation.opacity(0).step();
      // 导出动画数据
      this.setData({
        animationData: this.data.animation.export()
      });
    }
  }
})