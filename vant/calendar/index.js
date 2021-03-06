import {
  VantComponent
} from '../common/component';
import {
  ROW_HEIGHT,
  getNextDay,
  compareDay,
  copyDates,
  calcDateNum,
  formatMonthTitle,
  compareMonth,
  getMonths,
  getDayByOffset,
  changeType,
  getTargetMonthFirstDate,
  isToday,
  getDate,
  getChangeType,
  getTargetFrameIndex,
} from './utils';
import Toast from '../toast/toast';
import {
  requestAnimationFrame
} from '../common/utils';
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
          this.scrollIntoView();
        }
      },
    },
    formatter: null,
    confirmText: {
      type: String,
      value: '确定',
    },
    rangePrompt: String,
    frameIndex: {
      type: Number,
      value: 1
    },
    defaultDate: {
      type: null,
      observer(val) {
        this.setData({
          currentDate: val
        });
        this.scrollIntoView();
      },
    },
    allowSameDay: Boolean,
    confirmDisabledText: String,
    type: {
      type: String,
      value: 'single',
      observer: 'reset',
    },
    minDate: {
      type: null,
      value: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).getTime(),
    },
    maxDate: {
      type: null,
      value: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ).getTime(),
    },
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
  },
  data: {
    subtitle: '',
    currentDate: null,
    scrollIntoView: '',
    preIndex: null, // 滑动的时候记录上一次的Index,初始化默认为当前的
    curIndex: null, // 当前的index
    cFrameDate: null,
    cDatas: [],
    showToday: false,
    frameIndex: 1
  },
  created() {
    this.setData({
      currentDate: this.getInitialDate(),
      cDatas: this.initCalenderDatas(),
      preIndex: this.frameIndex || 1,
      curIndex: this.frameIndex || 1,
      cFrameDate: new Date(this.data.currentDate)
    });
  },
  mounted() {
    if (this.data.show || !this.data.poppable) {
      this.initRect();
      this.scrollIntoView();
    }
  },
  methods: {
    switch2Today(e) {
      console.log('switch2Today called')
      var currentDate = new Date(e.detail)
      var curIndex = this.data.curIndex
      console.log(currentDate)
      console.log('current frame=' + curIndex)

      this.switch2day(new Date());
    },
    changeFrame(e) {
      const {
        current,
        source,
        currentItemId
      } = e.detail;

      const {
        curIndex,   // 上一次的frameIndex
        cDatas
      } = this.data;
      var eventType = changeType(curIndex, current);
      var targetDate = getTargetMonthFirstDate(new Date(this.data.cFrameDate), eventType);
      cDatas[current] = targetDate.getTime();

      var currentDate = targetDate.getTime()
      var today = new Date();
      if (today.getFullYear() == targetDate.getFullYear() &&
        today.getMonth() == targetDate.getMonth()) {
        currentDate = today.getTime() // 处理当月的今天
      }
      var showToday = !isToday(new Date(currentDate))

      if (source !== "touch") {
        return;
      }
      
      console.log('frame chnaged. current=' + current + ", cource=" + source +
        ", currentItemId=" + currentItemId + ", preId=" + curIndex + ", changeType=" + eventType);
      
      this.setData({
        subtitle: targetDate.getFullYear() + "年" + (targetDate.getMonth() + 1) + "月",
        curIndex: current,
        cDatas, // 刷新当前月的数据
        cFrameDate: targetDate, // 当前月份所在frame的第一天日期
        currentDate,            // 选中的具体哪一天
        showToday,
      })

      this.$emit('select', copyDates(currentDate));
    },
    switch2day(targetDate) {  // 切换到具体某一天
      const {
        curIndex,   // 上一次的frameIndex
        cDatas,
        currentDate
      } = this.data;

      var eventType = getChangeType(currentDate, targetDate);
      if ("cur" === eventType) { // 不需要滑动
        return
      }
      var targetIndex = getTargetFrameIndex(curIndex, eventType);
      var targetDateD = getDate(targetDate);
      var targetDateMonthFirstDay = new Date(targetDateD.getFullYear(), targetDateD.getMonth(), 1);
      cDatas[targetIndex] = targetDateMonthFirstDay.getTime();
      var showToday = !isToday(new Date(targetDateD))

      console.log('switch2day chnaged. current=' + curIndex + ", targetIndex=" + targetIndex +
        ", changeType=" + eventType);
      
      this.setData({
        frameIndex: targetIndex,
        subtitle: targetDateD.getFullYear() + "年" + (targetDateD.getMonth() + 1) + "月",
        curIndex: targetIndex,
        cDatas, // 刷新当前月的数据
        cFrameDate: targetDateD, // 当前月份所在frame的第一天日期
        currentDate: targetDateD.getTime(),            // 选中的具体哪一天
        showToday,
      })

      this.$emit('select', copyDates(currentDate));
    },
    reset() {
      this.setData({
        currentDate: this.getInitialDate()
      });
      this.scrollIntoView();
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
      if (type === 'range') {
        const [startDay, endDay] = defaultDate || [];
        return [
          startDay || minDate,
          endDay || getNextDay(new Date(minDate)).getTime(),
        ];
      }
      if (type === 'multiple') {
        return defaultDate || [minDate];
      }
      return defaultDate || minDate;
    },
    scrollIntoView() {
      requestAnimationFrame(() => {
        const {
          currentDate,
          type,
          show,
          poppable,
          minDate,
          maxDate,
        } = this.data;
        // @ts-ignore
        const targetDate = type === 'single' ? currentDate : currentDate[0];
        const displayed = show || !poppable;
        if (!targetDate || !displayed) {
          return;
        }
        const months = getMonths(minDate, maxDate);
        months.some((month, index) => {
          if (compareMonth(month, targetDate) === 0) {
            this.setData({
              scrollIntoView: `month${index}`
            });
            return true;
          }
          return false;
        });
      });
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
      const {
        date
      } = event.detail;
      const {
        type,
        currentDate,
        allowSameDay
      } = this.data;
      if (type === 'range') {
        // @ts-ignore
        const [startDay, endDay] = currentDate;
        if (startDay && !endDay) {
          const compareToStart = compareDay(date, startDay);
          if (compareToStart === 1) {
            this.select([startDay, date], true);
          } else if (compareToStart === -1) {
            this.select([date, null]);
          } else if (allowSameDay) {
            this.select([date, date]);
          }
        } else {
          this.select([date, null]);
        }
      } else if (type === 'multiple') {
        let selectedIndex;
        // @ts-ignore
        const selected = currentDate.some((dateItem, index) => {
          const equal = compareDay(dateItem, date) === 0;
          if (equal) {
            selectedIndex = index;
          }
          return equal;
        });
        if (selected) {
          // @ts-ignore
          const cancelDate = currentDate.splice(selectedIndex, 1);
          this.setData({
            currentDate
          });
          this.unselect(cancelDate);
        } else {
          // @ts-ignore
          this.select([...currentDate, date]);
        }
      } else {
        this.select(date, true);
      }
    },
    unselect(dateArray) {
      const date = dateArray[0];
      if (date) {
        this.$emit('unselect', copyDates(date));
      }
    },
    select(date, complete) {
      if (complete && this.data.type === 'range') {
        const valid = this.checkRange(date);
        if (!valid) {
          // auto selected to max range if showConfirm
          if (this.data.showConfirm) {
            this.emit([
              date[0],
              getDayByOffset(date[0], this.data.maxRange - 1),
            ]);
          } else {
            this.emit(date);
          }
          return;
        }
      }
      this.emit(date);
      if (complete && !this.data.showConfirm) {
        this.onConfirm();
      }
    },
    emit(date) {
      const getTime = (date) => (date instanceof Date ? date.getTime() : date);
      this.setData({
        currentDate: Array.isArray(date) ? date.map(getTime) : getTime(date),
      });
      this.$emit('select', copyDates(date));
    },
    checkRange(date) {
      const {
        maxRange,
        rangePrompt
      } = this.data;
      if (maxRange && calcDateNum(date) > maxRange) {
        Toast({
          context: this,
          message: rangePrompt || `选择天数不能超过 ${maxRange} 天`,
        });
        return false;
      }
      return true;
    },
    onConfirm() {
      if (
        this.data.type === 'range' &&
        !this.checkRange(this.data.currentDate)
      ) {
        return;
      }
      wx.nextTick(() => {
        // @ts-ignore
        this.$emit('confirm', copyDates(this.data.currentDate));
      });
    },
  },
});