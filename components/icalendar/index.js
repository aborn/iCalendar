import {
  VantComponent
} from './common/component';
import {
  ROW_HEIGHT,
  ROW_HEIGHT_6ROW,
  copyDates,
  formatMonthTitle,
  compareMonth,
  getMonths,
  changeType,
  getTargetMonthFirstDate,
  isToday,
  getDate,
  getChangeType,
  getTargetFrameIndex,
  getMonthWeek,
} from './utils';
VantComponent({
  props: {
    title: {
      type: String,
      value: '日期选择',
    },
    subtitle: {
      type: String,
      value: ''
    },
    color: String,
    show: {
      type: Boolean,
      observer(val) {
        if (val) {
          this.initRect();
        }
      },
    },
    formatter: null,
    rangePrompt: String,
    frameIndex: {
      type: Number,
      value: 1
    },
    defaultDate: {
      type: null,
      observer(val) {
        this.setData({
          currentDate: val,
          subtitle: getDate(val).getFullYear() + "年" + (getDate(val).getMonth() + 1) + "月"
        });
      },
    },
    confirmDisabledText: String,
    position: {
      type: String,
      value: 'bottom',
    },
    rowHeight: {
      type: null,
      value: ROW_HEIGHT,
    },
    round: {
      type: Boolean,
      value: true,
    },
    poppable: {
      type: Boolean,
      value: true,
    },
    showMark: {
      type: Boolean,
      value: true,
    },
    showTitle: {
      type: Boolean,
      value: true,
    },
    showSubtitle: {
      type: Boolean,
      value: true,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
    maxRange: {
      type: null,
      value: null,
    },
    tips: {
      type: Object,
      value: null,
    },
    holidayTips: {
      type: Object,
      value: null,
    }
  },
  data: {
    subtitle: '',
    currentDate: null,
    preIndex: null, // 滑动的时候记录上一次的Index,初始化默认为当前的
    curIndex: null, // 当前的index
    cFrameDate: null,
    cDatas: [],
    showToday: false,
    frameIndex: 1,
  },
  created() {
    this.setData({
      currentDate: this.getInitialDate(),
      cDatas: this.initCalenderDatas(),
      preIndex: this.frameIndex || 1,
      curIndex: this.frameIndex || 1,
      cFrameDate: new Date(this.data.currentDate),
      rowHeight: this.recalRowHeight(),
    });
  },
  mounted() {
    if (this.data.show || !this.data.poppable) {
      this.initRect();
    }
  },
  methods: {
    switch2Today(e) {
      /**
      var currentDate = new Date(e.detail)
      var curIndex = this.data.curIndex
      console.log(currentDate)
      console.log('current frame=' + curIndex)
      */
      this.navigateToDay(new Date());
    },
    changeFrame(e) {
      const {
        current,
        source,
        currentItemId
      } = e.detail;

      if (source !== 'touch') {
        // 如因手工切换也走到这里，直接返回，否则会死循环
        return
      }

      const {
        curIndex, // 上一次的frameIndex
      } = this.data;
      var eventType = changeType(curIndex, current);
      var targetDate = getTargetMonthFirstDate(new Date(this.data.cFrameDate), eventType);
      var today = new Date();
      if (today.getFullYear() == targetDate.getFullYear() &&
        today.getMonth() == targetDate.getMonth()) {
        targetDate = today;
      }
      this.navigateToDay(targetDate, source);
    },
    recalRowHeight(d) {
      var date = d || new Date();
      let num = getMonthWeek(date)
      return num > 5 ? ROW_HEIGHT_6ROW : ROW_HEIGHT;
    },
    navigateToDay(targetDate, source) { // 切换到具体某一天
      const {
        curIndex, // 上一次的frameIndex
        cDatas,
        currentDate
      } = this.data;

      var eventType = getChangeType(currentDate, targetDate);
      var targetDateD = getDate(targetDate);
      var currentDateD = getDate(currentDate);
      var showToday = !isToday(new Date(targetDateD))
      this.setData({
        rowHeight: this.recalRowHeight(targetDateD)
      })

      if ("cur" === eventType) { // 如果是当月，不需要滑动，只需要切换到那一日即可
        this.setData({
          showToday,
        })
        this.emit(targetDateD.getTime())
        return
      }

      var targetIndex = getTargetFrameIndex(curIndex, eventType);
      var targetDateMonthFirstDay = new Date(targetDateD.getFullYear(), targetDateD.getMonth(), 1);
      cDatas[targetIndex] = targetDateMonthFirstDay.getTime();

      //console.log('navigateToDay called. current=' + curIndex + ", targetIndex=" + targetIndex +
      //  ", changeType=" + eventType);

      if (targetDateD.getFullYear() !== currentDateD.getFullYear()) {
        this.$emit('onChangeYear', {
          "current": currentDateD.getFullYear(),
          "target": targetDateD.getFullYear()
        });
      }

      if (source === 'autoplay' || source === 'touch') {
        this.setData({
          subtitle: targetDateD.getFullYear() + "年" + (targetDateD.getMonth() + 1) + "月",
          curIndex: targetIndex,
          cDatas, // 刷新当前月的数据
          cFrameDate: targetDateD, // 当前月份所在frame的第一天日期
          currentDate: targetDateD.getTime(), // 选中的具体哪一天
          showToday,
        })
      } else {
        // 表示不是来自滑动，需要切换frame        
        this.setData({
          frameIndex: targetIndex,
          subtitle: targetDateD.getFullYear() + "年" + (targetDateD.getMonth() + 1) + "月",
          curIndex: targetIndex,
          cDatas, // 刷新当前月的数据
          cFrameDate: targetDateD, // 当前月份所在frame的第一天日期
          currentDate: targetDateD.getTime(), // 选中的具体哪一天
          showToday,
        })
      }
      this.emit(targetDateD.getTime())

      this.$emit('changeframe', copyDates(targetDateD));
    },
    reset() {
      this.setData({
        currentDate: this.getInitialDate()
      });
    },
    initRect() {
      if (this.contentObserver != null) {
        this.contentObserver.disconnect();
      }
      const contentObserver = this.createIntersectionObserver({
        thresholds: [0, 0.1, 0.9, 1],
        observeAll: true,
      });
      this.contentObserver = contentObserver;
      contentObserver.relativeTo('.van-calendar__body');
      contentObserver.observe('.month', (res) => {
        if (res.boundingClientRect.top <= res.relativeRect.top) {
          // @ts-ignore
          this.setData({
            subtitle: formatMonthTitle(res.dataset.date)
          });
        }
      });
    },
    initCalenderDatas() {
      var cDatas = [];
      var cursor = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );

      cursor.setMonth(cursor.getMonth() - 1);
      cDatas.push(cursor.getTime());
      cursor.setMonth(cursor.getMonth() + 1);
      cDatas.push(cursor.getTime());
      cursor.setMonth(cursor.getMonth() + 1);
      cDatas.push(cursor.getTime());
      return cDatas;
    },
    getInitialDate() {
      const {
        type,
        defaultDate,
        minDate
      } = this.data;
      return defaultDate || minDate;
    },
    onOpen() {
      this.$emit('open');
    },
    onOpened() {
      this.$emit('opened');
    },
    onClose() {
      this.$emit('close');
    },
    onClosed() {
      this.$emit('closed');
    },
    onClickDay(event) {
      // 日期切换事件
      const {
        date
      } = event.detail;
      this.emit(date);
    },
    unselect(dateArray) {
      const date = dateArray[0];
      if (date) {
        this.$emit('unselect', copyDates(date));
      }
    },
    emit(date) {
      const getTime = (date) => (date instanceof Date ? date.getTime() : date);
      var showToday = !isToday(new Date(date))
      this.setData({
        currentDate: Array.isArray(date) ? date.map(getTime) : getTime(date),
        showToday,
      });
      this.$emit('select', copyDates(date));
    },  
  },
});