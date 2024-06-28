import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  FlatList,
} from 'react-native'
import { Icon } from 'react-native-elements'
import { ActionService, CommonService } from '../../../Services/index'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment'
import message from '../../../Utility/Message'
import customDate from '../../../Utility/customDate'
import { filterArray, convertDateIntoString, convertDateIntoUtcFormat, splitValueFromArray ,splitValueFromArray1} from '../../../Utility/constants';
import { HeaderView, SearchOptionDialogView } from '../../../component/index'
import styles from './Style';
import appStyles from '../../../../AppStyle';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
class SearchActionScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogvisible: false,noload: true,
      businessUnit: [],businessUnitValue: [],siteName: [], siteNameValue: [],actionStatus: [],actionStatusValue: [],
      action: [],actionValue: [],actionType: [],actionTypeValue: [],
      dueDate: [], markedDates: {}, data: [],
      canLoadMoreContent: true, iteration: 1,
      spinner: false,noresult: false, totalrecored: 0,pageLoad: true,sideBar: false,allBusinessUnit: [],allSite: [], allStatus: [],
      allMyAction: [{ Id: 0, Name: "I am action responsible person" }, { Id: 1, Name: "I am action checker person" }],
      actionTypes:[{ Id: 1, Name: "Incidents" },{ Id: 4, Name: "Stand Alone Actions" }],
      visible: false,startDate: '', endDate: '',initialize: true,
      statusColor: 0,siteColor: 0,businessUnitsColor: 0,myActionColor: 0, myActionTypesColor:0,
      dateName: '', isLoading: true,valueBunit: [],valueSite: [],openActionView:false,
      filterName:''
    }
  }
  //#region  Methods
  UNSAFE_componentWillMount= async () => {
    const { navigation } = this.props
    this.focusListener = navigation.addListener('didFocus', (data) => {
      data.action.params && data.action.params.pageLoad == false ? data.action.params.filterName!== undefined  ?this.makeFieldsEmpty(data) :this.searchFilterFunction(data):this.makeFieldsEmpty(data)
})
    this.focusListener = navigation.addListener('willBlur', () => {
      this.setState({ pageLoad: true })
    })
  }
  makeFieldsEmpty(data){
    this.setState({
      dialogvisible: false,noload: true,
      businessUnit: [],businessUnitValue: [],siteName: [], siteNameValue: [],actionStatus: [],actionStatusValue: [],
      action: [],actionValue: [],actionType: [],actionTypeValue: [],
      dueDate: [], markedDates: {}, data: [],lastWeek:true, today: true, Next30days: true, Last30days: true,ThisYear: true, Next7days: true,
      canLoadMoreContent: true, iteration: 1,
      spinner: false,noresult: false, totalrecored: 0,pageLoad: true,sideBar: false,allBusinessUnit: [],allSite: [], allStatus: [],
      allMyAction: [{ Id: 0, Name: "I am action responsible person" }, { Id: 1, Name: "I am action checker person" }],
      actionTypes:[{ Id: 1, Name: "Incidents" },{ Id: 4, Name: "Stand Alone Actions" }],
      visible: false,startDate: '', endDate: '',initialize: true,
      statusColor: 0,siteColor: 0,businessUnitsColor: 0,myActionColor: 0, myActionTypesColor:0,
      dateName: '', isLoading: true,valueBunit: [],valueSite: [],openActionView:false
    },function(){
      this.searchFilterFunction(data)
})
  }
  searchFilterFunction(data){
    CommonService.handleAndroidBackButton(this.handleBackPress)
   data &&  data.action.params && data.action.params.DashboardView == true ? this.setState({openActionView
      :true,filterName:data.action.params.filterName},function(){
        this.searchApplyFilter()}):
    this.searchApplyFilter()
  }
  handleBackPress = () => {
    if (this.state.visible) {
      this.setState({ visible: false })
      return false
    } else {
      this.props.navigation.goBack(null);
      return true
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    debugger;
    const { state } = nextProps.navigation
    if (state.params !== undefined && state.params.pageLoad === false) {
      this.setState({ pageLoad: false })
    }
    if (nextProps.isScreenRefresh === true) {
      this.props.saveIsActionScreenRefresh(false);
      this.makeFieldsEmpty()

    }
  }
  assignValue = () => {
    this.setState({ businessUnit: [], businessUnitValue: [], siteName: [], siteNameValue: [], actionStatus: [], actionStatusValue: [], actionType: [], actionTypeValue: [], action: [], actionValue: [], })
    const { allStatus, allMyAction, businessUnitValue, siteNameValue, actionStatus, actionStatusValue, actionType,
      actionTypeValue,valueSite ,valueBunit ,businessUnit ,siteName ,actionTypes , action, actionValue} = this.state
    this.pushDataInArrays(allMyAction, actionType, actionTypeValue, 'allStatus');
    this.pushDataInArrays(allStatus, actionStatus, actionStatusValue, 'allMyAction');
    this.pushDataInArrays(actionTypes,action, actionValue, 'allMyAction');
    this.pushSubDataInArrays(valueBunit, businessUnitValue ,businessUnit);
    this.pushSubDataInArrays(valueSite, siteNameValue,siteName);
  }
  pushDataInArrays = async (arr, displayName, val, type) => {
      arr.map(item => {
        if (item.checked != undefined && item.checked === true && !val.includes(item.Id)) {
          displayName.push(item.Name)
          val.push(item.Id)
        }
      })
  }
  pushSubDataInArrays = async (arr, val ,displayName) => {
    if (arr.length > 0) {
      arr.map(item => {
        val.push(item.key)
        displayName.push(item.label)
      })
    }
  }
  assignValueToFilterObject(filterObject) {
    const type = filterObject.Name;
    var displayValueObj = {};
    var valueObj = {};
    switch (type) {
      case 'Business Unit':
        displayValueObj = splitValueFromArray(this.state.businessUnit);
        valueObj = splitValueFromArray(this.state.businessUnitValue);
        break;
      case 'Site Name':
        displayValueObj = splitValueFromArray(this.state.siteName)
        valueObj = splitValueFromArray(this.state.siteNameValue)
        break;
      case 'Action Status':
        displayValueObj = splitValueFromArray(this.state.actionStatus);
        valueObj = splitValueFromArray(this.state.actionStatusValue);
        break;
      case 'DueDate':
        var arr = []
        arr = [this.state.startDate, this.state.endDate, this.state.dateName]
        if (arr[0] != '') {
          const displayDueDate = convertDateIntoString(arr)
          displayValueObj = displayDueDate
        }
        else displayValueObj = '';
        if (arr[0] != '') {
          valueObj = convertDateIntoUtcFormat(arr);
        }
        else valueObj = null;
        break;
      case 'My Actions':
        displayValueObj = splitValueFromArray(this.state.actionType);
        valueObj = splitValueFromArray(this.state.actionTypeValue);
        break;
        case 'Action Type':
        displayValueObj = splitValueFromArray(this.state.action);
        valueObj = splitValueFromArray(this.state.actionValue);
      default:
        break;
    }
    filterObject.DisplayValues = displayValueObj;
    filterObject.Values = valueObj;
    return filterObject
  }
  searchApplyFilter = async (Filter) => {
    Keyboard.dismiss()
    this.setState({
      data: [],
      iteration: 1,
      canLoadMoreContent: true,
      visible: false,
      Ischeckdate: false,
      IscheckSite: false,
      Ischeckstatus: false,
      IscheckAction: false,
      IscheckBusinessUnit: false,
      IscheckActionTypes:false,
    })
    this.props.isScreenRefresh === true && this.props.saveIsActionScreenRefresh(false)
    Filter=="Filter" ? this.setState({openActionView:false},function(){this.searchActions(1)}):
    await this.searchActions(1)

  }
  searchActions = async (page ,excelfile) => {
    try {
      this.setState({ spinner: true })
      page = page == undefined ? this.state.iteration : page
      if (!this.state.initialize) this.assignValue()
      var actionFilter = [];
      var overDueAction =false;
      if(this.state.openActionView){
        excelfile = "openActionOverdue"
        if(this.state.filterName=="OverDueAction"){
          overDueAction = true
        }
      }
      for (let index = 0; index < filterArray.length; index++) {
        const filterObject = {
          DisplayValues: [],
          Name: '',
          OtherParamName: null,
          ParamName: '',
          ValueSelected: false,
          Values: [],
        }
        const obj = this.assignValueToFilterObject(filterArray[index]);
        filterObject.DisplayValues.push(obj.DisplayValues);
        filterObject.Name = filterArray[index].Name;
        filterObject.OtherParamName = (filterArray[index].Name == 'DueDate') ?filterArray[index].OtherParamName : null;
        filterObject.ParamName = filterArray[index].ParamName;
        filterObject.ValueSelected = filterArray[index].ValueSelected;
        filterObject.Values.push(obj.Values);
        actionFilter.push(filterObject);
      }
      await ActionService.getActions(actionFilter, page, 20, this.state.initialize, this.props.token ,excelfile ,overDueAction).then((response) => {
        const result = response['data']
        if (excelfile == "excelfile") {
          this.setState({
            dialogvisible: false
          })
          this.showHideSpinner(false)
          CommonService.showSuccessNotification("Action search results are successfully emailed to you")
        }else{
          if (result['Success'] === true) {
            if (this.state.canLoadMoreContent) {
              this.maintainData(result['Data'])
              if (this.state.data.length === 0)
                this.setState({ canLoadMoreContent: false, noresult: true })
              this.setState({
                isLoadingMore: false,
                spinner: false,
                iteration: this.state.iteration + 1,
                initialize: false,
                isLoading: false
  
              })
            }
            this.showHideSpinner(false)
          } else {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(message.internal_error)
          }
        }
      })
      .catch(error => {
        this.setState({ spinner: false ,isLoading: false  },function(){
          CommonService.showErrorNotification(error.message);
        })
      })
    } catch (error) {
      this.setState({ spinner: false ,isLoading: false  },function(){
        CCommonService.showErrorNotification(message.internal_error)
      })
    }finally {
      this.showHideSpinner(false)
    }
  }
  maintainData = async (records) => {
    this.showHideSpinner(true)
    if (this.state.initialize) {
      for (let obj of records[0].ActionStatus) {
        this.state.allStatus.push(obj)
      }
      for (let obj of records[4]) {
        this.state.allBusinessUnit.push(obj)
      }
      for (let obj of records[5]) {
        this.state.allSite.push(obj)
      }
      this.setState({ data: records[1], noresult: false, noload: false })
    } else {
      this.setState({ data: [...this.state.data, ...records[0]], noresult: false, noload: false })
    }

    if(this.state.openActionView){
      if(records[1] ==0 ||  records[2] == 0)
      this.setState({ noload: true })
    }
    else if (this.state.data.length == records[1] || this.state.data.length == records[2]){
      this.setState({ noload: true })
    }
  }
  showHideSpinner(spinnerstate) {
    this.setState({ spinner: spinnerstate })
  }
  addChild(value ,key){
    this.showHideSpinner(true)
    if (this.state.checkboxListType === "BusinessUnit") {
      this.GetChildBusinessUnits(key)
    }else{
      this.GetChildSites(key)
    }
   }
  getParent(root, id , data) {
    var i, node;
    for (var i = 0; i < root.length; i++) {
        node = root[i];
        if (node.key === id || node.children && (node = this.getParent(node.children, id ,data))) {
            root[i].children=[]
            root[i].children.push(...data)
        }
    }
    return null;
}
  GetChildBusinessUnits = async (id) => {
    this.showHideSpinner(true)
    try {
      await ActionService.GetChildBusinessUnits(id, this.props.token)
        .then((response) => {
          const result = response['data']
          if (result['Success'] === true) {
            if (this.state.allBusinessUnit) {
              this.getParent(this.state.allBusinessUnit ,id ,result['Data'])
            }
            this.showHideSpinner(false)
           
          }
          else {
            this.showHideSpinner(false)
            CommonService.handleError(response)
          }
        })
    } catch (error) {
      this.showHideSpinner(false)
      CommonService.showErrorNotification(message.internal_error)
    }
  } 
  GetChildSites = async (id) => {
    this.showHideSpinner(true)
    try {
      await ActionService.GetChildSites(id, this.props.token)
        .then((response) => {
          const result = response['data']
          if (result['Success'] === true) {
            if (this.state.allSite) {
              this.getParent(this.state.allSite ,id ,result['Data'])
            }
            this.showHideSpinner(false)
          }
          else {
            this.showHideSpinner(false)
            CommonService.handleError(response)
          }
        })
    } catch (error) {
      this.showHideSpinner(false)
      CommonService.showErrorNotification(message.internal_error)
    }
  }
  onCancel = () => {
    this.setState({
      startDate: '',
      endDate: '',
      today: true,
      lastWeek: true,
      Next30days: true,
      Last30days: true,
      ThisYear: true,
      Next7days: true,
    })
  }
  selectCustomDate = (selectDateRange, dateTypeName) => {
    this.setState({ startDate: '', endDate: '', dateName: dateTypeName })
    switch (selectDateRange) {
      case 'Today':
        const startDate = customDate.customDateArray.startDate
        const endDate = startDate
        this.setState({
          startDate,
          endDate,
          today: !this.state.today,
          lastWeek: true,
          Next30days: true,
          Last30days: true,
          ThisYear: true,
          Next7days: true,
        })
        break
      case 'LastWeek':
        const lastWeekFirstDay =customDate.customDateArray.lastWeekFirstDay
        const lastWeekLastDay =customDate.customDateArray.startDate
        this.setState({
          startDate: lastWeekFirstDay,
          endDate: lastWeekLastDay,
          lastWeek: !this.state.lastWeek,
          today: true,
          Next30days: true,
          Last30days: true,
          ThisYear: true,
          Next7days: true,
        })
        break
      case 'Next30days':
        const Next30daysFirstDate = customDate.customDateArray.startDate
        const Next30dayslastDate = customDate.customDateArray.Next30dayslastDate
        this.setState({
          startDate: Next30daysFirstDate,
          endDate: Next30dayslastDate,
          Next30days: !this.state.Next30days,
          today: true,
          lastWeek: true,
          Last30days: true,
          Next7days: true,
          ThisYear: true,
        })
        break
      case 'Last30days':
        const Last30daysFirstDate = customDate.customDateArray.Last30daysFirstDate
        const Last30daysLastDate =customDate.customDateArray.startDate
        this.setState({
          startDate: Last30daysFirstDate,
          endDate: Last30daysLastDate,
          Last30days: !this.state.Last30days,
          today: true,
          lastWeek: true,
          Next30days: true,
          ThisYear: true,
          Next7days: true,
        })
        break
      case 'ThisYear':
        const ThisYearFirstDate = customDate.customDateArray.ThisYearFirstDate
        const ThisYearLastDate = customDate.customDateArray.ThisYearLastDate
        this.setState({
          startDate: ThisYearFirstDate,
          endDate: ThisYearLastDate,
          ThisYear: !this.state.ThisYear,
          today: true,
          lastWeek: true,
          Next30days: true,
          Last30days: true,
          Next7days: true,
        })
        break
      case 'Next7days':
        const Next7daysFirstDate = customDate.customDateArray.startDate
        const Next7daysLastDate = customDate.customDateArray.Next7daysLastDate
        this.setState({
          startDate: Next7daysFirstDate,
          endDate: Next7daysLastDate,
          Next7days: !this.state.Next7days,
          today: true,
          lastWeek: true,
          Next30days: true,
          Last30days: true,
          ThisYear: true,
        })
        break
        case 'OverDueAction':
          this.state.startDate=customDate.customDateArray.Last2000YearDate
          this.state.endDate=customDate.customDateArray.lastDay
          this.setState({
            Next7days: true,
            today: true,
            lastWeek: true,
            Next30days: true,
            Last30days: true,
            ThisYear: true,
          })
          break
    }
  }
  selectDate(fromDate, toDate, dateTypeName) {
    if (fromDate.trim() !== '' && fromDate != null) {
      this.setState({ startDate: moment(fromDate).format('DD-MM-YYYY') })
    }
    if (toDate.trim() !== '' && toDate != null) {
      this.setState({ endDate: moment(toDate).format('DD-MM-YYYY') })
    } else {
      this.setState({ endDate: fromDate })
    }
    this.setState({
      today: true,
      lastWeek: true,
      Next30days: true,
      Last30days: true,
      ThisYear: true,
      Next7days: true,
      dateName: dateTypeName
    })
  }
  handleArrayCheckbox = async (key, arr, Color, val) => {
    let currentItem = arr[key]
    currentItem.checked = !currentItem.checked
    arr[key] = currentItem
    const count = arr[key].checked == true ? val + 1 : val - 1
    this.setState({ [Color]: count })
    this.setState({ arr, iteration: 0 })
  }
  renderItem({ item, index }) {
    const unitArray = item.BusinessUnit.includes('>') ? item.BusinessUnit.split('>') : [item.BusinessUnit]
    const unit = unitArray.length > 1 ? unitArray[unitArray.length - 1] : unitArray[0]
    const siteArray = item.Site.includes('>') ? item.Site.split('>') : [item.Site]
    const site = siteArray.length > 1 ? siteArray[siteArray.length - 1] : siteArray[0]
    const date = moment(item.DueDate).subtract(1, "days").format('DD-MMM-YYYY');
    return (
      <View style={index % 2 == 0 ? appStyles.resultList : appStyles.secondResult}>
        <TouchableOpacity
          style={appStyles.resultContainer}
          onPress={() =>
              (item.ActionType == 1 || item.ActionType == 4) &&
             this.props.navigation.navigate('ActionDetail', { id: item.EncryptedID, actionid: item.ActionID, pageName: 'SearchActionScreen' , ActionType :item.ActionType })
          }
        >
          <View style={appStyles.descriptionCont}>
            <Text style={appStyles.descriptionText}>{item.ActionDescription}</Text>
            <TouchableOpacity
              style={appStyles.descriptionBtn}
              onPress={() =>
                 (item.ActionType ==1 || item.ActionType == 4) &&
                 this.props.navigation.navigate('ActionDetail', { id: item.EncryptedID, actionid: item.ActionID, pageName: 'SearchActionScreen' ,ActionType :item.ActionType })
              }
            >
              <Icon
                name='chevron-right'
                type='octicon'
                color='#575757'
                size={25}
              />
            </TouchableOpacity>
          </View>
          {(item.ActionType === 1 || item.ActionType === 4) && < View style={appStyles.detailsCont}>
            <View style={appStyles.secondLine}>
            {item.ActionType == '1' ?<Text style={appStyles.detailsText}>{item.Type}&nbsp;&nbsp;{item.EncryptedID}</Text>:
            <Text style={appStyles.detailsText}>{item.Type}</Text>}
          </View>
          </View>}
          <View style={appStyles.detailsCont}>
            <View style={styles.leftDetails}>
              <Text style={appStyles.detailsText}>{item.ActionStatus}</Text>
            </View>
            <View style={styles.resultDate}>
              <Text style={appStyles.detailsText}>Due: {date}</Text>
            </View>
          </View>
          <View style={appStyles.detailsCont}>
            <View style={appStyles.secondLine}>
              <Text style={appStyles.detailsText}>{unit}</Text>
            </View>
          </View>
          <View style={appStyles.lastdetailsCont}>
            <View style={appStyles.secondLine}>
              <Text style={appStyles.detailsText}>{site}</Text>
            </View>
          </View>
          <View style={appStyles.detailsCont}>
            <View style={appStyles.secondLine}>
              <Text style={appStyles.detailsText}>{item.ResponsibleUser}&nbsp;&nbsp;(Responsible Person)</Text>
            </View>
          </View>
          <View style={appStyles.detailsCont}>
            <View style={appStyles.secondLine}>
              <Text style={appStyles.detailsText}>{item.Checker}&nbsp;&nbsp;(Checker)</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  renderFooter() {
    return (
      <View style={{ paddingVertical: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        {this.state.data.length !== 0 && this.state.noload == false &&
          <TouchableOpacity
            onPress={() => this.searchActions()}
            activeOpacity={0.9}
            style={{ width: "60%", height: 40, paddingHorizontal: 10, borderRadius: 25, backgroundColor: "#eb8c3a", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ color: 'white', fontSize: 15, textAlign: 'center', }}>Load More</Text>
          </TouchableOpacity>
        }
      </View>
    );
  }
  onComfirm(value) {
    const {checkboxListType,valueBunit,valueSite} = this.state
          checkboxListType == "BusinessUnit" ?
            this.setState({valueBunit: value }) : 
              this.setState({valueSite: value })
              valueBunit.length > 0 ?this.setState({ businessUnitsColor: 1 }):this.setState({ businessUnitsColor: 0 })
              valueSite.length > 0 ?this.setState({ siteColor: 1 }):this.setState({ siteColor: 0 })
  }
  onClose(){
    const {checkboxListType,valueBunit,valueSite} = this.state
    checkboxListType == "BusinessUnit" ?
    this.setState({valueBunit: [] ,businessUnitsColor: 0}) : 
    this.setState({valueSite: [],siteColor: 0 })         
  }
  //#endregion
  render() {
    const { visible, allStatus, statusColor, allSite, siteColor, allBusinessUnit, businessUnitsColor, myActionColor, allMyAction, checkboxListType,  Next30days, Last30days, ThisYear, Next7days, endDate, Ischeckstatus, IscheckSite,valueBunit,valueSite ,actionTypes ,myActionTypesColor } = this.state
    if (this.state.isLoading) {
      return (
        <View style={appStyles.container}>
          <HeaderView
            PropFunction={() => {
              this.props.navigation.openDrawer()
              this.setState({ sideBar: true })
            }}
            Title={'Action Search'}
            Pagename={'Search'}
            StateChange={() => {
              this.setState({ visible: true })
            }}
            Sendfile={() => {
              this.setState({
                dialogvisible: true
              }) }}
          ></HeaderView>
          <View style={appStyles.spinnercontainer}>
            <Spinner
              visible={this.state.isLoading}
              textStyle={appStyles.spinnerTextStyle}
            />
          </View>
        </View>
      )
    } else {
      return (
        <View style={appStyles.container}>
          <HeaderView
            PropFunction={() => {
              this.props.navigation.openDrawer()
              this.setState({ sideBar: true })
            }}
            Title={'Action Search'}
            Pagename={'Search'}
            StateChange={() => {
              this.setState({ visible: true })
            }}
            Sendfile={() => {
              this.setState({
                dialogvisible: true
              })
            }}
          ></HeaderView>
          <View style={appStyles.spinnercontainer}>
            <Spinner
              visible={this.state.spinner}
              textStyle={appStyles.spinnerTextStyle}
            />
          </View>
          <SearchOptionDialogView
          spinner={this.state.spinner}
           onComfirm={(value) => {this.onComfirm(value)}}
           onClose={()=>console.log("")}
           treeData={this.state.treeData}
           value={ checkboxListType == "BusinessUnit" ?
           valueBunit : valueSite
         }
           addChild={(value,key)=>this.addChild(value,key)}
           valuedata={(value) => {
            checkboxListType == "BusinessUnit" ?
            this.setState({valueBunit: value }) : 
              this.setState({valueSite: value })
         }}

            pageName={'SearchActionScreen'}
            isMobileUser={this.props.isMobileUser}
            visible={visible}
            onCancel={() => this.onCancel()}
            visibleFalse={() => this.setState({ visible: false })}
            searchApplyFilter={() => this.searchApplyFilter("Filter")}
            businessUnit={() => this.setState({
              IscheckBusinessUnit: !this.state.IscheckBusinessUnit,
              IscheckSite: false,
              Ischeckdate: false,
              Ischeckstatus: false,
              IscheckAction: false,
              checkboxListType: "BusinessUnit",
              IscheckActionTypes:false,
            })}
            businessUnitsColor={businessUnitsColor}
            IscheckBusinessUnit={this.state.IscheckBusinessUnit}
            IscheckBusinessUnitFuntion={() => this.setState({
              IscheckBusinessUnit: !this.state.IscheckBusinessUnit,
              checkboxListType: "BusinessUnit"
            })}
            allBusinessUnit={allBusinessUnit}
            handlesubcheckbox={(id, type, name, pId) => this.handlesubcheckbox(id, type, name, pId)}
            handleArrayCheckbox={(key, array, color, val) => this.handleArrayCheckbox(key, array, color, val)}
            checkboxListType={checkboxListType}
            actionTypes={actionTypes}
            IscheckActionTypes={this.state.IscheckActionTypes}
            ActionsTypes={() => this.setState({
              IscheckActionTypes:!this.state.IscheckActionTypes,
              IscheckAction: false,
              IscheckSite: false,
              Ischeckstatus: false,
              Ischeckdate: false,
              IscheckBusinessUnit: false
            })
            }
            myActionTypesColor={myActionTypesColor}
            allMyAction={this.state.allMyAction}
            IscheckAction={this.state.IscheckAction}
            IscheckActionFunction={() => this.setState({
              IscheckAction: !this.state.IscheckAction
            })}
            Actions={() => this.setState({
              IscheckAction: !this.state.IscheckAction,
              IscheckSite: false,
              Ischeckstatus: false,
              Ischeckdate: false,
              IscheckBusinessUnit: false,
              IscheckActionTypes:false,
            })
            }
            myActionColor={myActionColor}
            allSite={allSite}
            IscheckSite={IscheckSite}
            siteColor={siteColor}
            site={() => this.setState({
              IscheckSite: !this.state.IscheckSite,
              Ischeckdate: false,
              Ischeckstatus: false,
              IscheckAction: false,
              IscheckBusinessUnit: false,
              checkboxListType: "Site",
              IscheckActionTypes:false,
            })}
            IscheckSiteFuntion={() => this.setState({
              IscheckSite: !this.state.IscheckSite,
              checkboxListType: "Site"
            })}
            date={() => this.setState({
              Ischeckdate: !this.state.Ischeckdate,
              IscheckSite: false,
              Ischeckstatus: false,
              IscheckAction: false,
              IscheckBusinessUnit: false,
              IscheckActionTypes:false,
            })
            }
            startDate={this.state.startDate}
            IscheckdateFunction={() => this.setState({
              Ischeckdate: !this.state.Ischeckdate
            })
            }
            Ischeckdate={this.state.Ischeckdate}
            today={this.state.today}
            selectCustomDate={(type, name) => this.selectCustomDate(type, name)}
            lastWeek={this.state.lastWeek}
            Next30days={Next30days}
            Last30days={Last30days}
            ThisYear={ThisYear}
            Next7days={Next7days}
            endDate={endDate}
            selectDate={(fromDate, toDate, type) => this.selectDate(fromDate, toDate, 'Custom Range')}
            status={() => this.setState({
              Ischeckstatus: !this.state.Ischeckstatus,
              Ischeckdate: false,
              IscheckAction: false,
              IscheckSite: false,
              IscheckBusinessUnit: false,
              IscheckActionTypes:false,
            })}
            statusColor={statusColor}
            IscheckstatusFunction={() => this.setState({
              Ischeckstatus: !this.state.Ischeckstatus
            })}
            Ischeckstatus={Ischeckstatus}
            allStatus={allStatus}
            closeTab={(state) => this.setState({ [state]: ![state] })}
            />

          {this.state.noresult && (
            <View>
              <Text style={appStyles.noresult}>No Result Found.</Text>
            </View>
          )}
          <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <View>
              <FlatList
                style={{ backgroundColor: '#FFF' }}
                data={this.state.data}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={this.renderFooter.bind(this)}
              />
            </View>
          </SafeAreaView>
          <Dialog
          width={0.8}
          rounded={false}
          visible={this.state.dialogvisible}>
            <DialogContent>
              <View style={styles.modalHead}>
                <Text style={styles.modalHeadText}>Export Search result to excel</Text>
              </View>
              <View style={styles.modalTextWrap}>
                <Text style={styles.modaltext}>
                  Click the "Send Email" button below to email an excel file containing search results,
                </Text>
                <Text style={styles.modaltext}>
                  The file will be emailed to:
                </Text>
                <Text style={[styles.modaltext, {paddingLeft:15}]}>
                  {this.props.email}
                </Text>
                
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                style={[styles.modalFooterBtn, {backgroundColor:"#9c9c9c"}]}
                onPress={() => {
                          this.setState({
                            dialogvisible: false
                          })
                        }}
                >

                  <Text style={{textAlign:"center", color:"#fff"}}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.modalFooterBtn, {backgroundColor:"#5294e2"}]}
                onPress={()=>this.searchActions( undefined , 'excelfile')}
                >
                  <Text style={{textAlign:"center", color:"#fff"}}>Send Email</Text>
                </TouchableOpacity>
              </View>
            </DialogContent>
          </Dialog>
        </View>
      )
    }
  }
}

function mapStateToProps(state) {
  debugger;
  return {
    token: state.home.authorizeToken,
    userId: state.home.userId,
    tenantId: state.home.tenantId,
    langaugeId: state.home.languageId,
    isMobileUser: state.home.isMobileUser,
    email :state.home.email,
    isScreenRefresh:state.home.isActionScreenRefresh,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    saveIsActionScreenRefresh: (value) => dispatch({ type: "SaveIsActionScreenRefresh", data: value }),
    saveIsIncidentScreenRefresh: (value) => dispatch({ type: "SaveIsIncidentScreenRefresh", data: value }),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchActionScreen)
