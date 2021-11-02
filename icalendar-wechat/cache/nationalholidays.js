/**
 * 国定节假日
 */

const nationalholidays = {
  2022: {
    year: 2022,
    holidays: [
      "01-01",
      "01-02",
      "01-03",
      "01-31",
      "02-01",
      "02-02",
      "02-03",
      "02-04",
      "02-05",
      "02-06",
      "04-03",
      "04-04",
      "04-05",
      "04-30",
      "05-01",
      "05-02",
      "05-03",
      "05-04",
      "06-03",
      "06-04",
      "06-05",
      "09-10",
      "09-11",
      "09-12",
      "10-01",
      "10-02",
      "10-03",
      "10-04",
      "10-05",
      "10-06",
      "10-07",
    ],
    workdays: [
      "01-29",
      "01-30",
      "04-02",
      "04-24",
      "05-07",
      "10-08",
      "10-09",
    ]
  },
  2021: {
    year: 2021,
    holidays: [
      "01-01",
      "01-02",
      "01-03",
      "02-11",
      "02-12",
      "02-13",
      "02-14",
      "02-15",
      "02-16",
      "02-17",
      "04-03",
      "04-04",
      "04-05",
      "05-01",
      "05-02",
      "05-03",
      "05-04",
      "05-05",
      "06-12",
      "06-13",
      "06-14",
      "09-19",
      "09-20",
      "09-21",
      "10-01",
      "10-02",
      "10-03",
      "10-04",
      "10-05",
      "10-06",
      "10-07"
    ],
    workdays: [
      "02-07",
      "02-20",
      "04-25",
      "05-08",
      "09-18",
      "09-26",
      "10-09"
    ]
  }
}

module.exports = {
  nationalholidays
}