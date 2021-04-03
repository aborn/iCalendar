import { VantComponent } from '../../../common/component';
import {
  compareDay,
  getMonthEndDay,  
} from '../../utils';
VantComponent({
  props: {
    date: {
      type: null,
      observer: 'setDays',
    },
    color: String,    
    showMark: Boolean,
    rowHeight: null,
    formatter: {
      type: null,
      observer: 'setDays',
    },
    currentDate: {
      type: null,
      observer: 'setDays',
    },
    tips: null,
    holidayTips: null,
    allowSameDay: Boolean,
    showSubtitle: Boolean,
    showMonthTitle: Boolean,
  },
  data: {
    visible: true,
    days: [],
  },
  methods: {
    onClick(event) {
      const { index } = event.currentTarget.dataset;
      const item = this.data.days[index];
      if (item.type !== 'disabled') {
        this.$emit('click', item);
      }
    },
    setDays() {
      const days = [];
      const startDate = new Date(this.data.date);
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      const totalDay = getMonthEndDay(
        startDate.getFullYear(),
        startDate.getMonth() + 1
      );
      for (let day = 1; day <= totalDay; day++) {
        const date = new Date(year, month, day);
        const type = this.getDayType(date);;
        let config = {
          date,
          type,
          text: day,
        };
        if (this.data.formatter) {
          config = this.data.formatter(config);
        }
        days.push(config);
      }
      this.setData({ days });
    },
    getDayType(day) {
      const { currentDate } = this.data;
      return compareDay(day, currentDate) === 0 ? 'selected' : '';
    }
  },
});
