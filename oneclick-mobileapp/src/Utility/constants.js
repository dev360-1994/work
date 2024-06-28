import moment from 'moment';

const filterArray = [
    DueDate = {
        Name: 'DueDate',
        ParamName: '@DueDateform',
        OtherParamName: '@DueDateto',
        ValueSelected: true
    },
    BusinessUnit = {
        Name: 'Business Unit',
        ParamName: '@BusinessUnitID',
        ValueSelected: true
    },
    SiteName = {
        Name: 'Site Name',
        ParamName: '@SiteID',
        ValueSelected: true
    },
    ActionStatus = {
        Name: 'Action Status',
        ParamName: '@ActionStatus',
        ValueSelected: true
    },
    MyActions = {
        Name: 'My Actions',
        ParamName: '@InvolvementItems',
        ValueSelected: true
    },
    ActionType = {
        Name: 'Action Type',
        ParamName: '@ActionType',
        ValueSelected: true
    },
    
]
const convertDateIntoString = (date) => {
    const stringFormat = moment(date[0], 'DD/MM/YYYY').format('DD MMMM YYYY') + "-" + moment(date[1], 'DD/MM/YYYY').format('DD MMMM YYYY');
    return stringFormat;
}

const convertDateIntoUtcFormat = (date) => {
    let startDateUtcFormat = moment(date[0], 'DD-MM-YYYY ').format('YYYY-MM-DD')+"T18:30:00.000Z";
    startDateUtcFormat = (new Date(startDateUtcFormat)).toISOString();
    let endDateUtcFormat = moment(date[1], 'DD-MM-YYYY').format('YYYY-MM-DD')+"T18:29:59.999Z";
    endDateUtcFormat = (new Date(endDateUtcFormat)).toISOString();
    const specificPeriodInString = date[2];
    return { startDateUtcFormat, endDateUtcFormat ,specificPeriodInString};
}
const splitValueFromArray = (items) => {
    const responseString =  items.join();
    return responseString;
  }
const splitValueFromArray1 = (items) => {
    var items = items.length == 0 ? items :items.Split('_')[0]
  const responseString =  items.join();
  return responseString;
}

const joinValueInArray = (items) => {
    const responseString =  items.join('>');
    return responseString;
  }
export {
    filterArray,
    convertDateIntoString,
    convertDateIntoUtcFormat,
    splitValueFromArray,
    splitValueFromArray1,
    joinValueInArray
};