// pages/code/code-grid/code-grid.js
Component({
  /**
   * Component properties
   */
  properties: {
    hourData : {
      type: Array,
    },
  },

  /**
   * Component initial data
   */
  data: {    
  },

  /**
   * Component methods
   */
  methods: {
    boxTapEvent: function(event) {
      console.log('evvveeet', event)
    },
    boxClickEvent(e) {
      console.log('eeeee')
      const {
        value,
        hour
      } = e.currentTarget.dataset
      var title = "编程时间" + (value * 0.5) + "分钟";
      if (value > 0) {
        wx.showToast({
          title,
          icon: 'none'
        });
      }
    },
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      console.log('attached....')
    },
  },
})