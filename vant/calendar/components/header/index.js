import { VantComponent } from '../../../common/component';
VantComponent({
  props: {
    title: {
      type: String,
      value: '日期选择',
    },
    subtitle: String,
    showTitle: Boolean,
    showSubtitle: Boolean,
    showToday: Boolean,
    currentDate: null,
  },
  data: {
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  },
  methods: {
    onClick(e) {
      const {
        date
      } = e.currentTarget.dataset
      this.$emit('switchToday', date)
    }
  },
});
