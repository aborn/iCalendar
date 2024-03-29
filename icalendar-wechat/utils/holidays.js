/* *
  @Author: drfu*
  @Description: 数据来源于国务院办公厅关于2020年部分节假日安排的通知（国办发明电〔2019〕16号）_政府信息公开专栏，http://www.gov.cn/zhengce/content/2019-11/21/content_5454164.htm
  @Date: 2020-10-12 14:29:45*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-16 17:38:08
*/

// 节日列表
export const festival = {
  // 农历固定日期节日
  lunar: {
    1: {
      1: {
        type: 'festival',
        name: '春节',
        label: '春节'
      },
      15: {
        type: 'festival',
        name: '元宵节',
        label: '元宵'
      }
    },
    2: {
      2: {
        type: 'festival',
        name: '龙抬头',
        label: '龙抬头'
      }
    },
    5: {
      5: {
        type: 'festival',
        name: '端午节',
        label: '端午节'
      }
    },
    7: {
      7: {
        type: 'festival',
        name: '七夕节',
        label: '七夕'
      },
      15: {
        type: 'festival',
        name: '中元节',
        label: '中元节'
      }
    },
    8: {
      15: {
        type: 'festival',
        name: '中秋节',
        label: '中秋节'
      }
    },
    9: {
      9: {
        type: 'festival',
        name: '重阳节',
        label: '重阳节'
      }
    },
    12: {
      8: {
        type: 'festival',
        name: '腊八节',
        label: '腊八'
      },
      30: {
        type: 'festival',
        name: '除夕',
        label: '除夕'
      }
    }
  },
  // 阳历固定日期节日
  solar: {
    1: {
      1: {
        type: 'festival',
        name: '元旦节',
        label: '元旦节'
      }
    },
    2: {
      14: {
        type: 'festival',
        name: '情人节',
        label: '情人节'
      }
    },
    3: {
      8: {
        type: 'festival',
        name: '女神节',
        label: '女神节'
      },
      12: {
        type: 'festival',
        name: '植树节',
        label: '植树节'
      }
    },
    4: {
      1: {
        type: 'festival',
        name: '愚人节',
        label: '愚人节'
      },
      23: {
        type: 'festival',
        name: '世界读书日',
        label: '世界读书日'
      }
    },
    5: {
      1: {
        type: 'festival',
        name: '劳动节',
        label: '劳动节'
      },
      4: {
        type: 'festival',
        name: '青年节',
        label: '青年节'
      }
    },
    6: {
      1: {
        type: 'festival',
        name: '儿童节',
        label: '儿童节'
      }
    },
    7: {
      1: {
        type: 'festival',
        name: '建党节',
        label: '建党节'
      }
    },
    8: {
      1: {
        type: 'festival',
        name: '建军节',
        label: '建军节'
      }
    },
    9: {
      10: {
        type: 'festival',
        name: '教师节',
        label: '教师节'
      }
    },
    10: {
      1: {
        type: 'festival',
        name: '国庆节',
        label: '国庆节'
      },
      24: {
        type: 'festival',
        name: '程序员节',
        label: '程序员节'
      },
      31: {
        type: 'festival',
        name: '万圣节',
        label: '万圣节'
      }
    },
    12: {
      4: {
        type: 'festival',
        name: '宪法日',
        label: '宪法日'
      },
      25: {
        type: 'festival',
        name: '圣诞节',
        label: '圣诞节'
      }
    }
  }
}
