import moment from 'moment';
const customDateArray = {
    startDate : moment(new Date()).format('DD-MM-YYYY'),
    lastWeekFirstDay : moment(new Date()).subtract(8, 'd').format('DD-MM-YYYY'),
    Next30daysFirstDate : moment(new Date()).format('DD-MM-YYYY'),
    Next30dayslastDate : moment(new Date()).add(30, 'd').format('DD-MM-YYYY'),
    Last30daysFirstDate : moment(new Date()).subtract(30, 'd').format('DD-MM-YYYY'),
    ThisYearFirstDate : moment(new Date()).startOf('year').format('DD-MM-YYYY'),
    ThisYearLastDate : moment(new Date()).endOf('year').format('DD-MM-YYYY'),
    Next7daysLastDate : moment(new Date()).add(7, 'd').format('DD-MM-YYYY'),
    thisMonthFirstDate : moment(new Date()).startOf('month').format('DD-MM-YYYY'),
    lastMonthFirstDate : moment(new Date()).subtract(1, 'months').startOf('month').format('DD-MM-YYYY'),
    lastMonthLastDate : moment(new Date()).subtract(1, 'months').endOf('month').format('DD-MM-YYYY'),
    lastDay:moment().subtract(1, 'days').format('DD-MM-YYYY'),
    last7days:moment().subtract(6, 'days').format('DD-MM-YYYY'),
    Last30days:moment().subtract(29, 'days').format('DD-MM-YYYY'),
    Last2000YearDate:moment("20000101").format('DD-MM-YYYY'),

}
export default {
    customDateArray
    
};