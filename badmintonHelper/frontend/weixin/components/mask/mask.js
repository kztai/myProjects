// components/mask/mask.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    isHidden: {
      type: Boolean,
      value: true,
    },
    direction: {
      type: String,
      value: 'toTop',  // toLeft, toTop, toBottom, toRight
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    maskAnimation: null,
    directionClassName: {
      toLeft: 'to-left',
      toRight: 'to-right',
      toTop: 'to-top',
      toBottom: 'to-bottom',
    }
  },

  lifetimes: {
    ready() {
      // this.data.maskAnimation = wx.createAnimation()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // toggleMask() {
    //   this.setData({
    //     isHidden: !this.properties.isHidden
    //   })
    // }
  }
})