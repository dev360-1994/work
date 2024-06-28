import React, { Component } from 'react'
import {
  Text,View,TouchableOpacity,Keyboard,Animated,FlatList,StyleSheet ,InteractionManager } from 'react-native'
import { Icon } from 'react-native-elements'
import { IncidentService, CommonService, ActionService } from '../../../Services/index'
import { connect } from 'react-redux'
import message from '../../../Utility/Message'
import customDate from '../../../Utility/customDate'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment'
import { HeaderView, SearchOptionDialogView } from '../../../component/index'
import styles from './Style';
import appStyles from '../../../../AppStyle';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Marker } from 'react-native-maps';
import MapView from '../../../Custom-NodeModules/react-native-map-clustering';
import { NavigationEvents } from 'react-navigation';
class SearchIncidentScreen extends Component {
  constructor(props) {
    super(props)
    this.mapRef  = React.createRef()
    this.state = {
      dialogvisible: false, noload: true,incidentId: 0,
      markedDates: {},keyword: '',data: [],canLoadMoreContent: true,
      iteration: 0, spinner: false,noresult: false, totalrecored: 0, pageLoad: true,sideBar: false,
      allImpacts: [], allStatus: [], impactName: [],impactId: [],statusNames: [], statusId: [],
      visible: false, checked: false,
      Ischeckdate: false, Ischeckstatus: false,IscheckSite: false, IscheckBusinessUnit: false,
      startDate: '', endDate: '', initialize: true,today: true,lastWeek: true, thisMonth: true,lastMonth: true,
      statusColor: 0,
      isLoading: true,
      valueBunit: [],valueSite: [], valueHazardType: [],
      siteColor: 0,
      businessUnitsColor: 0,
      allBusinessUnit: [],allSite: [],businessUnit: [],businessUnitValue: [],siteName: [],siteNameValue: [],
      significantArr: [{ "Id": "0", "Name": "No" }, { "Id": "1", "Name": "Yes" }], significantId: [],significantName: [],
      searchModal: {
        'Ischeckincident': false,'Ischeckimpacts': false,'IscheckKeyword': false,'IscheckSignificant': false,'IscheckHazardType': false,
        'IscheckCategory': false,'IscheckInjury': false,'IscheckHazard': false,
        'impactColor': 0,'significantColor': 0,'hazardTypeColor': 0,'categoryColor': 0,'injuryColor': 0,
        'injuryandIllnessTypeName': [],'injuryandIllnessTypeVal': [],
        'categoryName': [], 'categoryVal': [],
        'allHazards': [],'hazardTypeName': [],'hazardTypeValue': [],'hazardName': [],'hazardValue': [],'hazardColor': 0,
      },
      ShowClusterMap: false,
      clusterMapData: [],
      customCluster:[],
      mapview: 'standard',
      mapviewpicker:false,
      latitude: 0,
      longitude: 0,
      openIncidentView:false,
      isRemoveMapFilter:false,
      lastValueSite:[]
    }
  }

  //#region  Methods
  UNSAFE_componentWillMount = async () => {
    this.onCancel()
    const { navigation } = this.props
    this.focusListener = navigation.addListener('didFocus', (data) => {
      data.action.params && data.action.params.pageLoad == false  ? data.action.params.filterName !== undefined ?this.makeFieldsEmpty(data) : this.searchFilterFunction(data):this.makeFieldsEmpty(data)
      this.focusListener = navigation.addListener('willBlur', () => {
        this.setState({ pageLoad: true })
      })
    })

  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { state } = nextProps.navigation
    if (state.params !== undefined && state.params.pageLoad === false) {
      this.setState({ pageLoad: false })
    }
    if (nextProps.isScreenRefresh === true) {
      this.props.saveIsIncidentScreenRefresh(false);
      this.makeFieldsEmpty()
    }
  }
  makeFieldsEmpty(data) {
    this.setState({
      dialogvisible: false, noload: true, incidentId: 0,
      markedDates: {}, keyword: '', data: [], canLoadMoreContent: true,
      iteration: 0, spinner: false, noresult: false, totalrecored: 0, sideBar: false,
      allImpacts: [], allStatus: [], impactName: [], impactId: [], statusNames: [], statusId: [],
      visible: false, checked: false,
      Ischeckdate: false, Ischeckstatus: false, IscheckSite: false, IscheckBusinessUnit: false,
      startDate: '', endDate: '', initialize: true, today: true, lastWeek: true, thisMonth: true, lastMonth: true,
      statusColor: 0, isLoading: true,
      valueBunit: [], valueSite: [], valueHazardType: [],
      siteColor: 0, businessUnitsColor: 0,
      allBusinessUnit: [], allSite: [], businessUnit: [], businessUnitValue: [], siteName: [], siteNameValue: [],
      significantArr: [{ "Id": "0", "Name": "No" }, { "Id": "1", "Name": "Yes" }], significantId: [], significantName: [],
      searchModal: {
        'Ischeckincident': false, 'Ischeckimpacts': false, 'IscheckKeyword': false, 'IscheckSignificant': false, 'IscheckHazardType': false,
        'IscheckCategory': false, 'IscheckInjury': false, 'IscheckHazard': false,
        'impactColor': 0, 'significantColor': 0, 'hazardTypeColor': 0, 'categoryColor': 0, 'injuryColor': 0,
        'injuryandIllnessTypeName': [], 'injuryandIllnessTypeVal': [],
        'categoryName': [], 'categoryVal': [],
        'allHazards': [], 'hazardTypeName': [], 'hazardTypeValue': [], 'hazardName': [], 'hazardValue': [], 'hazardColor': 0,
      },
      ShowClusterMap: false,
      clusterMapData: [],
      mapview: 'standard',
      mapviewpicker: false,
      latitude: 0,
      longitude: 0,
      openIncidentView: false,
      filterName: '',
      isRemoveMapFilter:false,
      lastValueSite:[]

    }, function () {
      this.searchFilterFunction(data)
    })
  }
  searchFilterFunction(data){
    CommonService.handleAndroidBackButton(this.handleBackPress)
    data && data.action.params && data.action.params.DashboardView == true ? this.setState({ openIncidentView: true, filterName: data.action.params.filterName }, function () { this.searchApplyFilter() }) :
      this.searchApplyFilter()
  }
  componentWillUnmount() {
    
    this.focusListener.remove()
    // CommonService.removeAndroidBackButtonHandler()
  }
  clearResult() {
    this.setState({
      data: [],
      iteration: 0,
      keyword: '',
      incidentId: 0,
      noresult: false
    })
  }
  assignValue = () => {
    const { allImpacts, allStatus, statusNames, statusId, impactName, impactId, businessUnit, businessUnitValue, siteName, siteNameValue, valueBunit, valueSite, valueHazardType, significantArr, significantId, significantName, searchModal
    } = this.state
    this.setState({
      impactId: [],
      impactName: [],
      statusNames: [],
      statusId: [],
      businessUnit: [],
      businessUnitValue: [],
      siteName: [],
      siteNameValue: [],
      significantId: [],
      significantName: [],
      searchModal: {
        ...searchModal,
        injuryandIllnessTypeName: [],
        injuryandIllnessTypeVal: [],
        categoryName: [],
        categoryVal: [],
        hazardName: [],
        hazardValue: [],
        hazardTypeName: [],
        hazardTypeValue: [],
      }
    })
    this.pushDataInArrays(allImpacts, impactName, impactId, "id");
    this.pushDataInArrays(allStatus, statusNames, statusId, "id");
    this.pushDataInArrays(significantArr, significantName, significantId);
    this.pushSubDataInArrays(valueBunit, businessUnitValue, businessUnit);
    this.pushSubDataInArrays(valueSite, siteNameValue, siteName);
    this.pushDataInArrays(searchModal.injuryandIllnessType, searchModal.injuryandIllnessTypeName, searchModal.injuryandIllnessTypeVal);
    this.pushDataInArrays(searchModal.category, searchModal.categoryName, searchModal.categoryVal);

    if (valueHazardType.length > 0) {
      var valueHazardsType = [];
      var valueHazard = [];
      valueHazardType.map(item => {
        var findIndex = searchModal.allHazards.findIndex(x => x.key == item.key);
        if (findIndex == -1) {
          valueHazard.push(item);
        }
        else {
          valueHazardsType.push(item);
        }
      })
      this.pushSubDataInArrays(valueHazard, searchModal.hazardValue, searchModal.hazardName);
      this.pushSubDataInArrays(valueHazardsType, searchModal.hazardTypeValue, searchModal.hazardTypeName);
    }


  }
  pushDataInArrays = async (arr, displayName, val, type) => {
    arr.map(item => {
      var id = type == 'id' ? item.id : item.Id
      var name = type == 'id' ? item.name : item.Name
      if (item.checked != undefined && item.checked === true && !val.includes(id)) {
        displayName.push(name)
        val.push(id)
      }
    })
  }
  pushSubDataInArrays = async (arr, val, displayName) => {
    if (arr.length > 0) {
      arr.map(item => {
        val.push(item.key)
        displayName.push(item.label)
      })
    }
  }
  searchApplyFilter = async (Filter) => {
    Keyboard.dismiss()
    this.setState({
      data: [],
      iteration: 0,
      canLoadMoreContent: true,
      visible: false,
      Ischeckincident: false,
      Ischeckdate: false,
      Ischeckstatus: false,
      Ischeckimpacts: false,
      IscheckKeyword: false,
      IscheckSite: false,
      IscheckBusinessUnit: false,
      IscheckSignificant: false,
      searchModal: {
        ...this.state.searchModal,
        'IscheckHazardType': false,
        'IscheckCategory': false,
        'IscheckInjury': false,
        'IscheckHazard': false,
      },
   ShowClusterMap:Filter=='MapView' ? true:false,
    })
    this.props.isScreenRefresh === true && this.props.saveIsIncidentScreenRefresh(false)
    Filter=="Filter" ? this.setState({openIncidentView:false,clusterMapData:[],lastValueSite:this.state.valueSite},function(){this.searchIncidents(0)}):
    await this.searchIncidents(0)
  }
  searchIncidents = async (page, apiType ,noloader) => {
    
    try {
      page = page == undefined ? this.state.iteration : page
      this.setState({ spinner: noloader == "noloader"? false : true ,
     // clusterMapData:[] 
    })
      const { incidentId, keyword, startDate, endDate, statusNames, statusId, impactName, impactId, businessUnit, businessUnitValue, siteName, siteNameValue, significantName, significantId, searchModal ,openIncidentView ,filterName} = this.state
      if (!this.state.initialize) this.assignValue()
      var impactByNames = ''
      var statusByNames = ''
      var businessUnitByNames = ''
      var siteByNames = ''
      var significantByName = ''
      var injuryandIllnessTypeByName = ''
      var categoryByName = ''
      var hazardByName = ''
      var hazardTypeByName = ''
      var openIncident =false;
      if (impactName.length > 0) {
        impactByNames = impactName.join(', ')
      }
      if (statusNames.length > 0) {
        statusByNames = statusNames.join(', ')
      }
      if (businessUnit.length > 0) {
        businessUnitByNames = businessUnit.join(', ')
      }
      if (siteName.length > 0) {
        siteByNames = siteName.join(', ')
      }
      if (significantName.length > 0) {
        significantByName = significantName.join(', ')
      }
      if (searchModal.injuryandIllnessTypeName.length > 0) {
        injuryandIllnessTypeByName = searchModal.injuryandIllnessTypeName.join(', ')
      }
      if (searchModal.categoryName.length > 0) {
        categoryByName = searchModal.categoryName.join(', ')
      }
      if (searchModal.hazardName !== undefined && searchModal.hazardName.length > 0) {
        hazardByName = searchModal.hazardName.join(', ')
      }
      if (searchModal.hazardTypeName !== undefined && searchModal.hazardTypeName.length > 0) {
        hazardTypeByName = searchModal.hazardTypeName.join(', ')
      }
      if(openIncidentView){
        if(filterName=="openIncident"){
          openIncident = true
        }else{
          this.selectCustomDate(filterName)
        }
      }
      await IncidentService.getIncidents(
        incidentId, keyword, this.state.startDate, this.state.endDate, impactByNames, impactId, statusByNames, statusId, page, 20, this.state.initialize, this.props.token,
        businessUnitByNames, businessUnitValue, siteByNames, siteNameValue, significantByName,
        significantId, injuryandIllnessTypeByName, searchModal.injuryandIllnessTypeVal,
        categoryByName, searchModal.categoryVal, hazardByName, searchModal.hazardValue, hazardTypeByName, searchModal.hazardTypeValue, apiType ,openIncident
      )
        .then(response => {
          
          const result = response['data']
          if (apiType == "excelfile") {
            this.setState({
              dialogvisible: false
            })
            this.showHideSpinner(false)
            CommonService.showSuccessNotification("Incident search results are successfully emailed to you")
          }
          else if (apiType == "MapView") {
            if (response.data.Success) 
           this.setState({ clusterMapData: [...this.state.clusterMapData,...response.data.Data] },function(){
            this.state.clusterMapData = this.removeDuplicates(this.state.clusterMapData, item => item.ID)
              if(this.state.clusterMapData.length != 0)
                this.setState({ latitude: parseFloat(this.state.clusterMapData[0].Latitude),
                  longitude:parseFloat(this.state.clusterMapData[0].Longitude)},function(){
                    setTimeout(() => {
                      this.showHideSpinner(false)
                      
                    }, 10);
                  })
           })
          }
          else {
            if (result['Success'] === true) {
              if (this.state.canLoadMoreContent) {
                apiType == 'removeMapFilter' && this.setState({data:[],iteration:0})
                this.maintainData(result['Data'], result['Message'])
                if (this.state.data.length === this.state.totalrecored)
                  this.setState({ canLoadMoreContent: false })
                this.setState({
                  isLoadingMore: false,
                  spinner: false,
                  iteration: this.state.iteration + 1,
                  totalrecored: parseInt(result['Message']),
                  initialize: false,
                  isLoading: false
                })
              }
              this.setState({ initialize: false })
              this.showHideSpinner(false)
              console.log("er",result['Data'],this.state.data)
            //  this.searchIncidents(undefined, 'MapView' ,"noloader")
            } else {
              this.showHideSpinner(false)
              CommonService.handleError(response)
            }
            this.showHideSpinner(false)
          }
        })
        .catch(error => {
          this.showHideSpinner(false)
          CommonService.showErrorNotification(error.message)
          })
    } catch (error) {
      this.setState({ spinner: false ,isLoading: false  },function(){
        CommonService.showErrorNotification(message.internal_error)
      })
    } finally {
      this.showHideSpinner(false)
    }
  }
  removeDuplicates(data, key) {
    return [
      ...new Map(data.map(item => [key(item), item])).values()
    ]
  };
  showHideSpinner(spinnerstate) {
    this.setState({
      spinner: spinnerstate
    })
  }
  handleBackPress = () => {
    if (this.state.visible) {
      this.setState({ visible: false })
      return false
    }

    if (this.state.sideBar) {
      this.setState({ sideBar: false })
      return false
    } else {
      this.props.navigation.navigate('Home')
      return true
    }
  }
  selectDate(fromDate, toDate) {
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
      lastMonth: true,
      lastWeek: true,
      thisMonth: true
    })
  }
  maintainData = async (records, recordcount) => {
    this.showHideSpinner(true)
    if (this.state.initialize) {
      for (let obj of records[0]) {
        this.state.allStatus.push(obj)
      }
      for (let obj of records[1]) {
        this.state.allImpacts.push(obj)
      }
      for (let obj of records[3]) {
        this.state.allBusinessUnit.push(obj)
      }
      for (let obj of records[2]) {
        this.state.allSite.push(obj)
      }
      this.setState({
        searchModal: {
          ...this.state.searchModal,
          hazardType: [...records[4]],
          injuryandIllnessType: [...records[5]],
          category: [...records[6]],
        },
        data: records[7], noload: false
      })
      for (let i in records[4]) {
        this.state.searchModal.allHazards.push({
          key: (records[4][i].HazardTypeID).toString(),
          label: records[4][i].HazardTypeName,
          isParent: true
        })
      }

    } else {
      this.setState({ data: [...this.state.data, ...records[0]], noload: false })
    }
    this.setState({ noresult: recordcount == 0 ? true : false })
    if (this.state.data.length == recordcount) {
      this.setState({ noload: true })
    }
    this.showHideSpinner(false)
  }
  getIncidentScreen = incidentId => {
    this.setState({ visible: false })
    this.props.navigation.navigate('Incident', { id: incidentId })

  }
  selectCustomDate = async  selectDateRange => {
    this.setState({ startDate: '', endDate: '' })
    switch (selectDateRange) {
      case 'Today':
        const startDate = customDate.customDateArray.startDate
        const endDate = startDate

        this.setState({
          startDate,
          endDate,
          today: !this.state.today,
          lastWeek: true,
          thisMonth: true,
          lastMonth: true
        })
        break
      case 'LastWeek':
        const lastWeekFirstDay = customDate.customDateArray.lastWeekFirstDay
        const lastWeekLastDay = customDate.customDateArray.startDate

        this.setState({
          startDate: lastWeekFirstDay,
          endDate: lastWeekLastDay,
          lastWeek: !this.state.lastWeek,
          today: true,
          thisMonth: true,
          lastMonth: true
        })
        break
      case 'ThisMonth':
        const thisMonthFirstDate = customDate.customDateArray.thisMonthFirstDate
        const thisMonthCurrentDate = customDate.customDateArray.startDate

        this.setState({
          startDate: thisMonthFirstDate,
          endDate: thisMonthCurrentDate,
          thisMonth: !this.state.thisMonth,
          today: true,
          lastWeek: true,
          lastMonth: true
        })
        break
      case 'LastMonth':
        const lastMonthFirstDate = customDate.customDateArray.lastMonthFirstDate
        const lastMonthLastDate = customDate.customDateArray.lastMonthLastDate

        this.setState({
          startDate: lastMonthFirstDate,
          endDate: lastMonthLastDate,
          lastMonth: !this.state.lastMonth,
          today: true,
          lastWeek: true,
          thisMonth: true
        })
        break
        case 'Last30days':
          this.state.startDate=customDate.customDateArray.Last30days
          this.state.endDate=customDate.customDateArray.startDate
          break
          case 'last7days':
            this.state.startDate=customDate.customDateArray.last7days
            this.state.endDate=customDate.customDateArray.startDate
            break
    }
  }
  onCancel = () => {
    this.setState({
      impactName: [],
      impactId: [],
      statusNames: [],
      statusId: [],
      startDate: '',
      endDate: '',
      today: true,
      lastWeek: true,
      thisMonth: true,
      lastMonth: true,
      impactColor: 0,
      statusColor: 0,
      keyword: '',
      ShowClusterMap:false

    })
  }
  addChild(value, key) {
    if (this.state.checkboxListType === "BusinessUnit") {
      this.GetChildBusinessUnits(key)
    }
    else if (this.state.checkboxListType === "Site") {
      this.GetChildSites(key)
    }
    else {
      this.showHideSpinner(true)
      var hazards = []
      var Hazards = []
      var item = this.state.searchModal.hazardType.filter(item => (item.HazardTypeID).toString() == key);
      hazards.push(...item[0].Hazards)
      for (i in hazards) {
        Hazards.push({
          key: (hazards[i].HazardID).toString(),
          label: hazards[i].HazardName,
          isParent: false
        })
      }
      this.getParent(this.state.searchModal.allHazards, key, Hazards)
      this.setState({ va: true }, function () { this.showHideSpinner(false) });
    }
  }
  removeChild(value, key){
    this.removeParent(this.state.allBusinessUnit, key)
    // this.setState({ alla: true })
  }
  removeParent(root, id) {
    var i, node;
    for (var i = 0; i < root.length; i++) {
      node = root[i];
      if (node.key === id || node.children && (node = this.removeParent(node.children, id))) {
        root[i].children = undefined
        root[i].children1 = undefined
      }
    }
    this.setState({ all: true })
    return null;
  }
  getParent(root, id, data) {
    var i, node;
    for (var i = 0; i < root.length; i++) {
      node = root[i];
      if (node.key === id || node.children && (node = this.getParent(node.children, id, data))) {
        root[i].children = []
        root[i].children1 = []
        root[i].children.push(...data)
        root[i].children1.push(...data)
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
              this.getParent(this.state.allBusinessUnit, id, result['Data'])
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
              this.getParent(this.state.allSite, id, result['Data'])
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
  onComfirm(value) {
    const { checkboxListType, valueBunit, valueSite, valueHazardType } = this.state
    checkboxListType == "BusinessUnit" && this.setState({ valueBunit: value })
    checkboxListType == "Site" && this.setState({ valueSite: value })
    checkboxListType == "hazardType" && this.setState({ valueHazardType: value })
    valueBunit.length > 0 ? this.setState({ businessUnitsColor: 1 }) : this.setState({ businessUnitsColor: 0 })
    valueSite.length > 0 ? this.setState({ siteColor: 1 }) : this.setState({ siteColor: 0 })
    valueHazardType.length > 0 ? this.setState({ searchModal: { ...this.state.searchModal, hazardColor: 1 } }) : this.setState({ searchModal: { ...this.state.searchModal, hazardColor: 0 } })
  }
  onClose() {
    const { checkboxListType, valueBunit, valueSite } = this.state
    checkboxListType == "BusinessUnit" && this.setState({ valueBunit: [], businessUnitsColor: 0 })
    checkboxListType == "Site" && this.setState({ valueSite: [], siteColor: 0 })
    checkboxListType == "hazardType" && this.setState({ valueHazardType: [], searchModal: { ...this.state.searchModal, hazardColor: 0 } })
  }
  renderItem({ item, index }) {
    // const unitArray = item.BusinessUnit.includes('>')
    //   ? item.BusinessUnit.split('>')
    //   : [item.BusinessUnit]
    // const unit =
    //   unitArray.length > 1 ? unitArray[unitArray.length - 1] : unitArray[0]
    // const siteArray = item.Site.includes('>')
    //   ? item.Site.split('>')
    //   : [item.Site]
    // const site =
    //   siteArray.length > 1 ? siteArray[siteArray.length - 1] : siteArray[0]
    return (
      <View style={index % 2 == 0 ? appStyles.resultList : appStyles.secondResult}>
        <TouchableOpacity
          style={appStyles.resultContainer}
          onPress={() => this.getIncidentScreen(item.IncidentId)}
        >
          <View style={appStyles.descriptionCont}>
            <Text style={appStyles.descriptionText}>{item.ShortDescription}</Text>
            <TouchableOpacity
              style={appStyles.descriptionBtn}
              onPress={() => this.getIncidentScreen(item.IncidentId)}
            >
              <Icon
                name='chevron-right'
                type='octicon'
                color='#575757'
                size={25}
              />
            </TouchableOpacity>
          </View>
          <View style={appStyles.detailsCont}>
            <View style={styles.leftDetails}>
              <Text style={appStyles.detailsText}>{item.Status}</Text>
            </View>
            <View style={styles.resultDate}>
              <Text style={appStyles.detailsText}>{item.Date}</Text>
            </View>
          </View>
          <View style={appStyles.detailsCont}>
            <View style={appStyles.secondLine}>
              <Text style={appStyles.detailsText}>{item.Impacts}</Text>
            </View>
          </View>
          <View style={appStyles.detailsCont}>
            <View style={appStyles.secondLine}>
              <Text style={appStyles.detailsText}>{item.BusinessUnit}</Text>
            </View>
          </View>
          <View style={appStyles.lastdetailsCont}>
            <View style={appStyles.secondLine}>
              <Text style={appStyles.detailsText}>{item.Site}</Text>
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
            onPress={() => this.searchIncidents()}
            activeOpacity={0.9}
            style={{ width: "60%", height: 40, paddingHorizontal: 10, borderRadius: 25, backgroundColor: "#eb8c3a", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ color: 'white', fontSize: 15, textAlign: 'center', }}>Load More</Text>
          </TouchableOpacity>
        }
      </View>

    );
  }
  handleArrayCheckbox = async (key, arr, Color, val) => {
    let currentItem = arr[key]
    currentItem.checked = !currentItem.checked
    arr[key] = currentItem
    const count = arr[key].checked == true ? val + 1 : val - 1
    this.setState({
      searchModal: { ...this.state.searchModal, [Color]: count }, [Color]: count
    });
  }
  showHideMap = async () => {
    this.setState({ ...this.state, ShowClusterMap: true}, function () {
       this.searchIncidents(undefined, 'MapView')
    })
  }
  filterSites = async (cluster, marker) => {
console.log("valueSite",this.state.valueSite)
    this.setState({isRemoveMapFilter:true})
    this.showHideSpinner(true)
    const valueSite = [];
    var SiteItems = [];
      if (marker.length) {
        for (var indexval in marker) {
          var site = SiteItems.some(temp => temp.key == marker[indexval].properties.siteid)
          if (site == false) {
            SiteItems.push({ 'key': marker[indexval].properties.siteid, 'label': marker[indexval].properties.site });
            valueSite.push({ 'key': marker[indexval].properties.siteid, 'label': marker[indexval].properties.site });
            this.setState({ valueSite: [...valueSite] });
          }
        }
        this.setState({ clusterMapData: [...this.state.clusterMapData, ...marker] })
  
      }
      else {
        valueSite.push({ 'key': marker.properties.siteid, 'label': marker.properties.site });
        this.setState({ valueSite });
      }
    setTimeout(() => {
      this.searchIncidents(undefined, 'MapView')
      this.searchApplyFilter('MapView')
    },5);
  }
  removeMapFilter = async () => {
    this.setState({valueSite:this.state.lastValueSite,iteration: 0,},function(){
      this.searchIncidents(undefined,'removeMapFilter')

    })
    const {clusterMapData} = this.state
    this.setState({isRemoveMapFilter:false})
    var initialRegion={
       latitude: parseFloat(clusterMapData[0].Latitude) ,
       longitude:  parseFloat(clusterMapData[0].Longitude) ,
       latitudeDelta: 0.09,
       longitudeDelta: 0.05,
    }
    this. mapRef.current.animateToRegion(initialRegion, 1000);

  }
  //#endregion
  render() {
    const { searchModal, checkboxListType, clusterMapData, ShowClusterMap, latitude,longitude,valueSite,isRemoveMapFilter} = this.state
    if (this.state.isLoading) {
      return (
        <View style={appStyles.container}>
          <HeaderView
            PropFunction={() => {
              this.props.navigation.openDrawer()
              this.setState({ sideBar: true })
            }}
            Title={'Incident Search'}
            Pagename={'Search'}
            StateChange={() => {
              this.setState({ visible: true ,
                 valueSite :[] 
                })
            }}
            Sendfile={() => {
              this.setState({
                dialogvisible: true
              })
            }}
            ShowMap={() => { this.showHideMap() }}
            hideMapIcon={ShowClusterMap}
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
            hideMapIcon={ShowClusterMap}
            Title={'Incident Search'}
            Pagename={'Search'}
            StateChange={() => {
              this.setState({ visible: true , 
                //valueSite :[]
              },function(){valueSite.length > 0 ? this.setState({ siteColor: 1 }) : this.setState({ siteColor: 0 })})
            }}
            Sendfile={() => {
              this.setState({
                dialogvisible: true
              })
            }}
            ShowMap={() => { this.showHideMap() }}
          ></HeaderView>
          <View style={appStyles.spinnercontainer}>
            <Spinner
              visible={this.state.spinner}
              textStyle={appStyles.spinnerTextStyle}
            />
          </View>
          <SearchOptionDialogView
            spinner={this.state.spinner}
            pageName={'SearchIncidentScreen'}
            visible={this.state.visible}
            onCancel={() => this.onCancel()}
            visibleFalse={() => this.setState({ visible: false })}
            searchApplyFilter={() =>  this.searchApplyFilter("Filter")}
            keywordState={() => this.setState({
              IscheckBusinessUnit: false,
              IscheckSite: false,
              IscheckBusinessUnit: false,
              Ischeckdate: false,
              Ischeckstatus: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: false,
                Ischeckincident: false,
                Ischeckimpacts: false,
                IscheckKeyword: !searchModal.IscheckKeyword,
                'IscheckHazardType': false,
                'IscheckCategory': false,
                'IscheckInjury': false,
                'IscheckHazard': false,
              },
            })}
            keywordValue={this.state.keyword}
            onChangeTextKeyword={(text) => this.setState({ keyword: text })}
            incidentId={this.state.incidentId}
            incidentState={() =>
              this.setState({
                IscheckBusinessUnit: false,
                IscheckSite: false,
                IscheckBusinessUnit: false,
                Ischeckdate: false,
                Ischeckstatus: false,
                searchModal: {
                  ...searchModal,
                  IscheckSignificant: false,
                  Ischeckincident: !searchModal.Ischeckincident,
                  Ischeckimpacts: false,
                  IscheckKeyword: false,
                  'IscheckHazardType': false,
                  'IscheckCategory': false,
                  'IscheckInjury': false,
                  'IscheckHazard': false,
                },
              })
            }
            onChangeTextIncident={(id) => this.setState({ incidentId: id })}
            date={() => this.setState({
              Ischeckdate: !this.state.Ischeckdate,
              IscheckBusinessUnit: false,
              IscheckSite: false,
              IscheckBusinessUnit: false,
              Ischeckstatus: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: false,
                Ischeckincident: false,
                Ischeckimpacts: false,
                IscheckKeyword: false,
                'IscheckHazardType': false,
                'IscheckCategory': false,
                'IscheckInjury': false,
                'IscheckHazard': false,
              },
            })}
            startDate={this.state.startDate}
            IscheckdateFunction={() => this.setState({ Ischeckdate: !this.state.Ischeckdate })}
            Ischeckdate={this.state.Ischeckdate}
            today={this.state.today}
            selectCustomDate={(type, name) => this.selectCustomDate(type)}
            lastWeek={this.state.lastWeek}
            thisMonth={this.state.thisMonth}
            lastMonth={this.state.lastMonth}
            endDate={this.state.endDate}
            selectDate={(fromDate, toDate, type) => this.selectDate(fromDate, toDate)}
            status={() => this.setState({
              Ischeckstatus: !this.state.Ischeckstatus,
              IscheckBusinessUnit: false,
              IscheckSite: false,
              IscheckBusinessUnit: false,
              Ischeckdate: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: false,
                Ischeckincident: false,
                Ischeckimpacts: false,
                IscheckKeyword: false,
                'IscheckHazardType': false,
                'IscheckCategory': false,
                'IscheckInjury': false,
                'IscheckHazard': false,
              },
            })}
            statusColor={this.state.statusColor}
            IscheckstatusFunction={() => this.setState({ Ischeckstatus: !this.state.Ischeckstatus })}
            Ischeckstatus={this.state.Ischeckstatus}
            allStatus={this.state.allStatus}
            allImpacts={this.state.allImpacts}
            impact={() => this.setState({
              IscheckBusinessUnit: false,
              IscheckSite: false,
              IscheckBusinessUnit: false,
              Ischeckdate: false,
              Ischeckstatus: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: false,
                Ischeckincident: false,
                Ischeckimpacts: !searchModal.Ischeckimpacts,
                IscheckKeyword: false,
                'IscheckHazardType': false,
                'IscheckCategory': false,
                'IscheckInjury': false,
                'IscheckHazard': false,
              },
            })
            }
            businessUnit={() => this.setState({
              IscheckBusinessUnit: !this.state.IscheckBusinessUnit,
              checkboxListType: "BusinessUnit",
              IscheckSite: false,
              IscheckBusinessUnit: false,
              Ischeckdate: false,
              Ischeckstatus: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: false,
                Ischeckincident: false,
                Ischeckimpacts: false,
                IscheckKeyword: false,
                'IscheckHazardType': false,
                'IscheckCategory': false,
                'IscheckInjury': false,
                'IscheckHazard': false,
              },
            })}
            businessUnitsColor={this.state.businessUnitsColor}
            IscheckBusinessUnit={this.state.IscheckBusinessUnit}
            allBusinessUnit={this.state.allBusinessUnit}
            allSite={this.state.allSite}
            IscheckSite={this.state.IscheckSite}
            siteColor={this.state.siteColor}
            site={() => this.setState({
              checkboxListType: "Site",
              IscheckSite: !this.state.IscheckSite,
              IscheckBusinessUnit: false,
              Ischeckdate: false,
              Ischeckstatus: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: false,
                Ischeckincident: false,
                Ischeckimpacts: false,
                IscheckKeyword: false,
                'IscheckHazardType': false,
                'IscheckCategory': false,
                'IscheckInjury': false,
                'IscheckHazard': false,
              },
            })}
            checkboxListType={this.state.checkboxListType}
            onComfirm={(value) => { this.onComfirm(value) }}
            onClose={() => this.onClose()}
            value={this.state.checkboxListType == "BusinessUnit" ? this.state.valueBunit : checkboxListType == "Site" ? this.state.valueSite : this.state.valueHazardType}
            addChild={(value, key) => this.addChild(value, key)}
            removeChild={(value, key) => this.removeChild(value, key)}
            valuedata={(value) => {
              this.state.checkboxListType == "BusinessUnit" ?
                this.setState({ valueBunit: value }) : checkboxListType == "Site" ?
                  this.setState({ valueSite: value }) : this.setState({ searchModal: { ...searchModal, valueHazardType: value } })
            }}
            significantArr={this.state.significantArr}
            significant={() => this.setState({
              IscheckBusinessUnit: false,
              Ischeckdate: false,
              Ischeckstatus: false,
              IscheckSite: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: !searchModal.IscheckSignificant,
                Ischeckincident: false,
                Ischeckimpacts: false,
                IscheckKeyword: false,
                'IscheckHazardType': false,
                'IscheckCategory': false,
                'IscheckInjury': false,
                'IscheckHazard': false,
              },
            })}
            searchModal={searchModal}
            hazardType={() => this.setState({
              checkboxListType: "hazardType",
              IscheckBusinessUnit: false,
              Ischeckdate: false,
              Ischeckstatus: false,
              IscheckSite: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: false,
                Ischeckincident: false,
                Ischeckimpacts: false,
                IscheckKeyword: false,
                'IscheckHazardType': !searchModal.IscheckHazardType,
                'IscheckCategory': false,
                'IscheckInjury': false,
                'IscheckHazard': false,
              },
            })}
            handleArrayCheckbox={(key, array, color, val) => this.handleArrayCheckbox(key, array, color, val)}
            injuryType={() => this.setState({
              IscheckBusinessUnit: false,
              Ischeckdate: false,
              Ischeckstatus: false,
              IscheckSite: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: false,
                Ischeckincident: false,
                Ischeckimpacts: false,
                IscheckKeyword: false,
                'IscheckHazardType': false,
                'IscheckCategory': false,
                'IscheckInjury': !searchModal.IscheckInjury,
                'IscheckHazard': false,
              },
            })}
            Category={() => this.setState({
              IscheckBusinessUnit: false,
              Ischeckdate: false,
              Ischeckstatus: false,
              IscheckSite: false,
              searchModal: {
                ...searchModal,
                IscheckSignificant: false,
                Ischeckincident: false,
                Ischeckimpacts: false,
                IscheckKeyword: false,
                'IscheckHazardType': false,
                'IscheckCategory': !searchModal.IscheckCategory,
                'IscheckInjury': false,
                'IscheckHazard': false,
              },
            })}
            closeTab={(state) => this.setState({ searchModal: { ...searchModal, [state]: !searchModal[state] }, })}
          />

          {this.state.noresult && (
            <View>
              <Text style={appStyles.noresult}>No Result Found.</Text>
            </View>
          )}
          {ShowClusterMap &&  <View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity onPress={() => this.setState({ShowClusterMap:false} )}
              style={{ backgroundColor: "#4f94ed", marginTop: 5, marginBottom: 5, paddingHorizontal: 5, width: 90, height: 30, alignItems: "center" }}><Text style={{ color: "#fff", paddingVertical: 5 }}>Hide Map</Text></TouchableOpacity>
          </View>
         <View style={{ height: 400, paddingHorizontal: 10, backgroundColor: '#ffffff' }}>
            <View style={{ flex: 1,position: "relative" }}>
            <TouchableOpacity style={styles.maplayers} onPress={() => this.setState({
                        mapviewpicker:true
                    })}>
                      <Icon
                        name='layers'
                        type='material-icons'
                        color='#41a1f1'
                        size={24}
                      />
                    </TouchableOpacity>
              <MapView
              ref={this.mapRef}
              style={{ flex: 1 }}
                initialRegion={{
                   latitude: latitude == 0 ?-37.803043914780830 : latitude,
                   longitude: longitude ==0 ? 144.940265745544250 :longitude,
                   latitudeDelta: 0.0922,
                   longitudeDelta:0.0421,
                }}
                mapType={this.state.mapview}
              enableZoomControl={true}
             spiralEnabled={false}
             onClusterPress={(cluster, markers)=> this.filterSites(cluster, markers)}
             extent={900}
             minZoom={0}
             maxZoom={30}
             tracksViewChanges={true}
             cluster={false}
              >
                {clusterMapData.map((marker, i) => (
                  <Marker
                  tracksViewChanges={false}
                    key={i}
                    coordinate={{
                      latitude: parseFloat(marker.Latitude),
                      longitude:parseFloat(marker.Longitude),
                    }}
                    title={marker.ID + " - " + marker.Site}
                    id={marker.SiteID}
                   description={marker.Description}
                   site= {marker.Site}
                   siteid={marker.SiteID}
                   latitude= {parseFloat(marker.Latitude)}
                   longitude={parseFloat(marker.Longitude)}
                  />
                ))}
              </MapView>
                {isRemoveMapFilter && <TouchableOpacity style={styles.hideMapFilter} onPress={() => this.removeMapFilter()}>
                  <Text style={{color:"#4f94ed",fontWeight:"500",textDecorationLine:'underline',}}>Remove Map Filter</Text>
                </TouchableOpacity>}
            </View>
          </View>
          </View>
          }
          <FlatList
            style={{ backgroundColor: '#FFF' }}
            data={this.state.data}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter.bind(this)}
          />
          {
              this.state.mapviewpicker ?
                <Animated.View style={[StyleSheet.absoluteFill, styles.cover]}>
                  <View style={styles.card}>
                    <View style={styles.btnGroup}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => 
                            this.setState({
                                mapview :'standard',
                                mapviewpicker: false
                              }) 
                            }
                      >
                        <Text style={styles.buttonText}>Standard</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.closeButton, styles.centerButton]}
                        onPress={() => 
                            this.setState({
                                mapview :'satellite',
                                mapviewpicker: false
                              }) 
                            }>
                        <Text style={styles.buttonText}>Satellite</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.closeButton, styles.centerButton]}
                        onPress={() => 
                            this.setState({
                                mapview :'hybrid',
                                mapviewpicker: false
                              }) 
                            }>
                        <Text style={styles.buttonText}>Hybrid</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.singlebtn}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => 
                            this.setState({
                                mapviewpicker: false
                              })}>
                        <Text style={[styles.buttonText, styles.bold]}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View> : null}
          <Dialog
            width={0.8}
            rounded={false}
            visible={this.state.dialogvisible}
          >

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
                <Text style={[styles.modaltext, { paddingLeft: 15 }]}>
                  {this.props.email}
                </Text>
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalFooterBtn, { backgroundColor: "#9c9c9c" }]}
                  onPress={() => {
                    this.setState({
                      dialogvisible: false
                    })
                  }}
                >

                  <Text style={{ textAlign: "center", color: "#fff" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalFooterBtn, { backgroundColor: "#5294e2" }]}
                  onPress={() => this.searchIncidents(undefined, 'excelfile')}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>Send Email</Text>
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
    email: state.home.email,
    tenantId: state.home.tenantId,
    langaugeId: state.home.languageId,
    isScreenRefresh:state.home.isIncidentScreenRefresh,

  }
}
SearchIncidentScreen.defaultProps = {
  theme: { markColor: '#00adf5', markTextColor: '#ffffff' },

}
const mapDispatchToProps = (dispatch) => {
  return {
    saveIsActionScreenRefresh: (value) => dispatch({ type: "SaveIsActionScreenRefresh", data: value }),
    saveIsIncidentScreenRefresh: (value) => dispatch({ type: "SaveIsIncidentScreenRefresh", data: value }),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchIncidentScreen)
