// pages/code/code-grid/code-grid.js
Component({
  /**
   * Component properties
   */
  properties: {
    hourData : {
      type: Array,
    },
    type : {
      type: null,
      value: 1
    },
    isToday : {
      type: Boolean,
      value: true
    }
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
    gridItemClickEvent(e) {
      const {value, hour} = e.currentTarget.dataset
      var hourData = this.data.hourData;

      hourData.map((item, index) => {
        if (index === hour) {
          item.type = 'selected';
        } else {
          item.type = undefined;
        }
      })
      this.setData({hourData})

      var title = "编程时间" + (value * 0.5) + "分钟";
      if (value > 0) {
        wx.showToast({
          title,
          icon: 'none'
        });
      }
    },
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
    ready: function () {
      // const {hourData, isToday} = this.data;
      // console.log(hourData)
      // console.log(isToday)
    },
  },
  pageLifetimes: {
    show() {
      console.log('show code-grid')
    }
  }
})