import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Modal, TouchableWithoutFeedback, Keyboard, FlatList, Platform } from 'react-native';
import { Icon, CheckBox } from 'react-native-elements'
import { IncidentService, CommonService,ActionService} from '../../../Services'
import { HeaderView, FooterView, DatePicker, SearchPeopleModal } from '../../../component/index'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment';
import message from '../../../Utility/Message'
import { connect } from 'react-redux'
import Validation from '../../../Utility/Validation'
import styles from './Style';
import SectionedMultiSelect from '../../../Custom-NodeModules/react-native-sectioned-multi-select'
import appStyles from '../../../../AppStyle';
import TreeSelect from '../../../Custom-NodeModules/react-native-tree-select';
import { joinValueInArray} from '../../../Utility/constants';
class ActionDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.scrollView = React.createRef()
        this.state = {
            unSavedChanges: false,
            spinner: false,
            incidentId: '0',
            actionid: '0',
            isDateTimePickerVisible: false,
            showDialog: false,
            pageName: '',
            IncidentLocked: false,
            modal: {
                'description': '',
                'date': '',
                'impactsId': []
            },
            actionModal: {
                'descriptionAction': '',
                'selectedSite': '',
                'selectedBussinessUnit': '',
                'ParentBusinessUnitID' :0,
                'ParentSiteID' :0
            },
            selectType: '',
            actionCommentModel: false,
            ActionProgressStatus: '',
            progressComment: '',
            progressdate: '',
            checkedProgressReject: false,
            checkedProgressApprove: false,
            Progress: {
                'IsCompleted': false
            },
            validationModel: { progressComment: false },
            sitename: 'Select Sites',
            BUnit: 'Select Business Unit',
            allBusinessUnit: [],
            allSite: [],
            valueBunit: [],
            valueSite: [],
        }
    }
    //#region  Methods
    UNSAFE_componentWillMount() {
        const { navigation } = this.props
        let actionid = 0
        this.focusListener = navigation.addListener('willFocus', async (data) => {
            if (data.action.params == undefined ||
                data.action.params.actionid == undefined) {
                actionid = 0

            } else {
                actionid = data.state.params.actionid
            }
            let pageName = data.action.params && data.action.params.pageName
            let IncidentLocked = data.action.params && data.action.params.IncidentLocked
            if (pageName !== undefined) this.setState({ pageName: pageName })
            if (IncidentLocked) {
                this.setState({ IncidentLocked: IncidentLocked });
            } else {
                this.setState({ IncidentLocked: false });
            }
            let id = data.state.params && data.state.params.id
            if (id !== undefined) this.setState({ incidentId: id });
            this.screenIntialize( actionid)
            CommonService.handleAndroidBackButton(this.handleBackPress)
            this.scrollView.current.scrollTo({ x: 0, y: 0, animated: false })
        })

        const dateTime = CommonService.getCurrentDateAndTime()
        this.setState({ progressdate: dateTime.date })
        this.setState({ incidentId: navigation.state.params == undefined ? '' : navigation.state.params.id })
        this.showHideSpinner(true)
    }
    makeFeildEmpty() {
        this.setState({
            IncidentLocked: false,
            actionid: '0',
            unSavedChanges: false,
            modal: {
                'description': '',
                'date': '',
                'impactsId': []
            },
            actionModal: {
                'descriptionAction': '',
                'selectedSite': '',
                'selectedBussinessUnit': '',
                'actionid': '',
                'oldActionImpacts': '',
                'datatime': '',
                'ResponsibleUserID': '',
                'CheckerUserID': '',
                'CheckerUser': '',
                'ResponsibleUser': '',
                'impacts': [],
                'hierarchyOfControls': [],
                'LongTermReasons': [],
                'ActionSource': [],
            },
            Progress: {
                'IsCompleted': false
            },
            sitename: 'Select Sites',
            BUnit: 'Select Business Unit',
            checkedProgressReject: false,
            checkedProgressApprove: false,
            valueBunit:[],
            valueSite:[]
        })
    }
    handleBackPress = () => {
        const { navigation } = this.props
        this.state.pageName == 'SearchActionScreen' ?
            this.props.navigation.navigate('Action Search', { pageLoad: false, id: null }) :
            this.props.navigation.navigate('Actionlist', { id: this.state.incidentId, pageName: this.state.pageName, IncidentLocked: this.state.IncidentLocked, TenantIncidentId: navigation.state.params.TenantIncidentId })
        return true

    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        })
    }
    screenIntialize = async ( actionid) => {
        this.showHideSpinner(false)
        if (actionid > 0) {
            this.setState({ actionid: actionid })
            this.getActionById( actionid)
        } else {
            this.initializedata()
        }
    }
    initializedata = async () => {
        this.showHideSpinner(true)
        try {
            await IncidentService.actionData(
                0, this.props.token,
            ).then(response => {
                const data = response['data']
                const result = data['Data']
                for (var i = 0; i < result['BUnitList'].length; i++) {
                    result['BUnitList'][i].endNode = true
                  }
                  for (var i = 0; i < result['SiteList'].length; i++) {
                    result['SiteList'][i].endNode = true
                  }
                if (data['Success'] === true) {
                    var hierarchyId = []
                    this.setState({
                        allBusinessUnit: result['BUnitList'],
                        allSite: result['SiteList'],
                        actionModal: {
                            ...this.state.actionModal,
                            'actionid': 0,
                            'ActionSourceID': result['ActionSourceID'],
                            'hierarchyOfControlsId': hierarchyId,
                            'impacts':
                                [{
                                    name: 'Select Impacts',
                                    id: 0,
                                    children: result['Impacts']
                                }],
                            'hierarchyOfControls':
                                [{
                                    name: 'Select Hierarchy of control',
                                    id: 0,
                                    children: result['HierarchyOfControls']
                                }],
                        },
                    })
                }
                else {
                    CommonService.handleError(response)
                }
            this.showHideSpinner(false)
            })
                .catch(error => {
                    this.showHideSpinner(false)
                    CommonService.showErrorNotification(error.message)
                })
        } catch (ex) {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(ex.Message)
        }
    }
    getActionById = async (actionid) => {
        this.showHideSpinner(true)
        try {
            await IncidentService.getAction(
                0, actionid, this.props.token,
            ).then(response => {
                this.showHideSpinner(false)
                const data = response['data']
                const result = data['Data']
                if (data['Success'] === true) {
                    var hierarchyId = []
                    var impactId = []
                    if (result['HierarchyOfControlID'] != null) { hierarchyId.push((result['HierarchyOfControlID']).toString()) }
                    for (let i in result['ActionImpacts']) {
                        var val = result['ActionImpacts'][i].Id
                        impactId.push(val.toString())
                    }
                    for (var i = 0; i < result['BUnitList'].length; i++) {
                        result['BUnitList'][i].endNode = true
                      }
                      for (var i = 0; i < result['SiteList'].length; i++) {
                        result['SiteList'][i].endNode = true
                      }
                    this.setState({
                        BUnit: result['BusinessUnitFullName'] != null ? this.getChildName(result['BusinessUnitFullName']) : '',
                        sitename: result['SiteFullName'] != null ? this.getChildName(result['SiteFullName']):'',
                        valueSite:result['SiteFullName'] != null ? {
                            key: (result['SiteID']).toString(),
                            label: result['SiteName'],
                            isLeaf: true
                          }:[],
                          valueBunit:result['BusinessUnitFullName'] != null ? {
                            key: (result['BusinessUnitID']).toString(),
                            label: result['BusinessUnitName'],
                            isLeaf: true
                          }:[],
                        modal: {
                            'description': result['Description'],
                            'date': moment(result['DueDate']).format('DD-MMM-YYYY '),
                            'impactsId': impactId,
                        },
                        actionModal: {
                            selectedSite: result['SiteID'],
                            selectedBussinessUnit: result['BusinessUnitID'],
                            'actionid': this.state.actionid,
                            'oldActionImpacts': result['ActionImpacts'],
                            'descriptionAction': result['ActionReason'],
                            'ActionSourceID': result['ActionSourceID'],
                            'datatime': result['DueDate'],
                            'ResponsibleUserID': result['ResponsibleUserID'],
                            'CheckerUserID': result['CheckerUserID'],
                            'CheckerUser': result['CheckerUser'],
                            'ResponsibleUser': result['ResponsibleUser'],
                            'hierarchyOfControlsId': hierarchyId,
                            'ActionProgress': result['ActionProgress'],
                            'ActionProgressStatus': result['ActionProgressStatus'],
                            'impacts':
                                [{
                                    name: 'Select Impacts',
                                    id: 0,
                                    children: result['ImpactList']
                                }],
                            'hierarchyOfControls':
                                [{
                                    name: 'Select Hierarchy of control',
                                    id: 0,
                                    children: result['HierarchyOfControls']
                                }],
                        },
                        allBusinessUnit: result['BUnitList'],
                        allSite: result['SiteList'],
                    })
                    this.showHideSpinner(false)
                }
                else {
                    this.showHideSpinner(false)
                    CommonService.handleError(response)
                }
            })
                .catch(error => {
                    this.showHideSpinner(false)
                    CommonService.showErrorNotification(error.message)
                })
        } catch (ex) {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(ex.Message)
        }

    }
    getChildName(data) {
        const array = data.split('>')
       // return array.length > 1 ? array[array.length - 1] : array[0]
       return data
    }
    checkUnSavedData() {
        if (this.state.unSavedChanges) {
            Alert.alert(
                'Unsaved Changes',
                'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
                [
                    { text: 'Save Changes', onPress: () =>{this.validatorAction()}},
                    { text: 'Undo Changes', onPress: () =>{ this.navigationBack() }},
                    {text: 'Cancel',style: 'cancel'},
                ],
                { cancelable: false }
            )
        } else { this.navigationBack() }
    }
    navigationBack() {
        const { navigation } = this.props
        this.makeFeildEmpty();
        this.state.pageName == 'SearchActionScreen' ?
            this.props.navigation.navigate('Action Search', { pageLoad: false, id: null }) :
            this.state.pageName == 'ActionlistScreen' ?
                this.props.navigation.navigate('Actionlist', { id: this.state.incidentId, pageName: this.state.pageName, IncidentLocked: this.state.IncidentLocked, TenantIncidentId: navigation.state.params.TenantIncidentId }) :
                this.props.navigation.navigate('Home')

    }
    validatorAction = async () => {
        const { actionModal, modal,sitename,BUnit } = this.state
        const { navigation } = this.props
        const ActionType = navigation.state.params == undefined ? 4 : navigation.state.params.ActionType
        if (ActionType === 4) {
            if (actionModal.descriptionAction == '') {
                CommonService.showErrorNotification(message.actionMessage.Reason)
                return false;
            }
            else if (actionModal.selectedSite == '' || sitename == '' ) {
                CommonService.showErrorNotification(message.actionMessage.Site)
                return false;
            }
            else if (actionModal.selectedBussinessUnit == '' || BUnit == '') {
                CommonService.showErrorNotification(message.actionMessage.Business)
                return false;
            }
        }
        var result = Validation.checkFieldIsNullOrEmpty(modal)
        if (result.status === false) {
            CommonService.showErrorNotification(result.message)
            return false;
        }
        if ( this.props.isMobileUser == false) {
            if (actionModal.ResponsibleUser == undefined) {
                CommonService.showErrorNotification(message.actionMessage.responsibleUser)
                return false;
            }
            else if (actionModal.CheckerUser == undefined) {
                CommonService.showErrorNotification(message.actionMessage.checkerUser)
                return false;
            }

            this.showHideSpinner(true)
            setTimeout(() => {
                this.showHideSpinner(true)
                this.saveAction()
            }, 10);
        }
        else {
            this.showHideSpinner(true)
            this.setState({
                actionModal: {
                    ...actionModal,
                    'ResponsibleUserID': this.props.userId,
                    'ResponsibleUser': this.props.firstName + " " + this.props.lastName,
                    'CheckerUserID': this.props.userId,
                    'CheckerUser': this.props.firstName + " " + this.props.lastName
                }
            })
            setTimeout(() => {
                this.showHideSpinner(true)
                this.saveAction()
            }, 10);
        }
    }
    saveAction = async () => {
        const { navigation } = this.props
        const { actionModal } = this.state
        const type = navigation.state.params == undefined ? 5 : navigation.state.params.ActionType == 4 ? 5 : navigation.state.params.ActionType
            this.setState({
                actionModal: {
                    ...actionModal,
                    'LongTermReasonID': ['0']
                }
            })
        if (type == 1) {
            this.setState({
                actionModal: {
                    ...actionModal,
                    'selectedSite': 0,
                    'selectedBussinessUnit': 0,
                    'descriptionAction': '',
                    'LongTermReasonID': ['0']
                }
            }, function () {
                this.save()
            })
        }
        else {
            this.save()
        }
    }
    save = async () => {
        const { navigation } = this.props
        const { actionModal, modal, incidentId, actionid,sitename,BUnit,IsNewSite,IsNewBUnit } = this.state
        const type = navigation.state.params == undefined ? 5 : navigation.state.params.ActionType == 4 ? 5 : navigation.state.params.ActionType
        var IncidentId = incidentId !== undefined ? incidentId : 0
        const BUnitArray = BUnit.includes('>') ? BUnit.split('>') : [BUnit]
        const bUnit = BUnitArray.length > 1 ? BUnitArray[BUnitArray.length - 1] : BUnitArray[0]
        const siteArray = sitename.includes('>') ? sitename.split('>') : [sitename]
        const site = siteArray.length > 1 ? siteArray[siteArray.length - 1] : siteArray[0]
        try {
            this.showHideSpinner(true)
            await IncidentService.AddAction(actionModal, modal, IncidentId, actionid, this.props.token, parseInt(type) ,site,bUnit,IsNewSite,IsNewBUnit ).then(response => {
                this.showHideSpinner(false)
                const data = response['data']
                if (data['Success'] === true) {
                    if (data.Message == null)
                        CommonService.showSuccessNotification(data.Data.Message)
                    else CommonService.showSuccessNotification(data.Message)
                    this.makeFeildEmpty();
                    this.navigationBack();
                }
                else {
                    CommonService.showErrorNotification(data.Message)
                }
            })
                .catch(error => {
                    this.showHideSpinner(false)
                    CommonService.showErrorNotification(error.message)
                })
        } catch (ex) {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(ex.Message)
        }
    }
    handleDatePicked = (dateTime, type) => {
        const dateArray = moment(dateTime).format('DD-MMM-YYYY ')
        type === 'ProgressDatePicked' ?
            this.setState({
                progressdate: dateArray,
                ActionProgressdatePicker: false
            })
            :
            this.setState({
                modal: { ...this.state.modal, ['date']: dateArray },
                actionModal: { ...this.state.actionModal, ['datatime']: dateTime },
                isDateTimePickerVisible: false, unSavedChanges: true
            })
    }
    onSelected = (selectedItems, type) => {
        type == 'impactsId' ?
            this.setState({
                modal: { ...this.state.modal, 'impactsId': selectedItems, },
                unSavedChanges: true
            })
            :
            this.setState({
                actionModal: { ...this.state.actionModal, [type]: selectedItems },
                unSavedChanges: true
            })
    }
    sectionedMultiView = (items, selectedItem, type, single, title) => {
        return (
            <SectionedMultiSelect
                chipRemoveIconComponent={this.state.IncidentLocked == true}
                disabled={this.state.IncidentLocked == true}
                items={items}
                confirmText='Close'
                uniqueKey='id'
                subKey='children'
                selectText={title}
                hideSearch={false}
                showDropDowns={true}
                single={single}
                readOnlyHeadings={true}
                expandDropDowns={true}
                onSelectedItemsChange={(selectedItems) => this.onSelected(selectedItems, type)}
                selectedItems={selectedItem}
                styles={
                    this.state.IncidentLocked == true ?
                        {
                            chipContainer: {
                                width: '40%'
                            }
                        } : {
                            chipContainer: {}
                        }
                }
            />

        )
    }
    selectedUserData(id, name) {
        const { selectType, actionModal } = this.state
        if (selectType === 'ResponsibleUser') {
            this.setState({
                actionModal: {
                    ...actionModal,
                    'ResponsibleUserID': id,
                    'ResponsibleUser': name,
                }, showDialog: false, unSavedChanges: true
            })
        } else {
            this.setState({
                actionModal: {
                    ...actionModal,
                    'CheckerUserID': id,
                    'CheckerUser': name,
                }, showDialog: false, unSavedChanges: true
            })
        }
    }
    ShowActionProgress = async () => {
        const { navigation } = this.props
        const { Progress, actionModal } = this.state
        const ActionType = navigation.state.params == undefined ? 4 : navigation.state.params.ActionType
        this.setState({ actionCommentModel: true })
        Progress.IsActionCompleted = false;
        Progress.IsActionReopen = false;
        Progress.ProgressIndex = null;
        if (ActionType === 4 || this.props.isMobileUser == false) {
            var isBreak = false;
            for (var indexval in actionModal.ActionProgress) {
                if (!isBreak) {
                    var l = actionModal.ActionProgress.length - (parseInt(indexval) + 1);
                    var lastItembeforeNoChange = actionModal.ActionProgress[actionModal.ActionProgress.length - (parseInt(indexval) + 1)];
                    var lastProgressStatus = lastItembeforeNoChange.ActionProgressStatus + '#' + (lastItembeforeNoChange.ActionProgressStatusID == null ? 0 : lastItembeforeNoChange.ActionProgressStatusID);
                    Progress.IsActionCompleted = lastProgressStatus == actionModal.ActionProgressStatus.CompleteAndReadyForCheck;
                    Progress.IsActionReopen = lastProgressStatus == actionModal.ActionProgressStatus.ActionClosed;
                    var NoChangeStatus = actionModal.ActionProgressStatus.NoChange.substr(0, actionModal.ActionProgressStatus.NoChange.indexOf('#'));
                    if (lastItembeforeNoChange.ActionProgressStatus != NoChangeStatus) {
                        isBreak = true;
                    }
                }
            }
        }
    }
    ActionAcceptOrRejectionStatus = async (type) => {
        const { checkedProgressReject, checkedProgressApprove, actionModal } = this.state
        if (type == 'Reject') {
            if (checkedProgressReject == false) { this.setState({ checkedProgressReject: true, checkedProgressApprove: false, ActionProgressStatus: actionModal.ActionProgressStatus.CompleteRejected }) }
            else this.setState({ checkedProgressReject: true, checkedProgressApprove: false })
        }
        else {
            if (checkedProgressApprove == false) { this.setState({ checkedProgressApprove: true, checkedProgressReject: false, ActionProgressStatus: actionModal.ActionProgressStatus.ActionClosed }) }
            else this.setState({ checkedProgressApprove: true, checkedProgressReject: false })
        }
    }
    addComment = async () => {
        const { navigation } = this.props
        const type = navigation.state.params == undefined ? 5 : navigation.state.params.ActionType == 4 ? 5 : navigation.state.params.ActionType
        if (this.state.progressComment == "") {
            this.setState({ validationModel: { ...this.state.validationModel, progressComment: true } })
        }
        else {
            this.showHideSpinner(true)
            this.setState({ actionCommentModel: false })
            if (this.state.ActionProgressStatus) {
                var ActionProgressStatus = this.state.ActionProgressStatus.split('#')[0];
                var actionProgressStatusID = parseInt(this.state.ActionProgressStatus.split('#')[1]) > 0 ? parseInt(this.state.ActionProgressStatus.split('#')[1]) : null;
            }
            else {
                var ActionProgressStatus = this.state.actionModal.ActionProgressStatus.NoChange.split('#')[0]
                var actionProgressStatusID = parseInt(this.state.actionModal.ActionProgressStatus.NoChange.split('#')[1]) > 0 ? parseInt(this.state.actionModal.ActionProgressStatus.NoChange.split('#')[1]) : null;
            }
            try {
                var ActionProgressvalues = {
                    ActionID: parseInt(this.state.actionModal.actionid),
                    ActionProgressID: parseInt(0),
                    ActionProgressStatus: ActionProgressStatus,
                    ActionProgressStatusID: actionProgressStatusID,
                    comment: this.state.progressComment,
                    CommentDate: new Date(),
                    CompletionDate: new Date(this.state.progressdate),
                    Id: parseInt(this.state.incidentId),
                    UserID: parseInt(this.props.userId),
                    UserName: this.props.firstName + " " + this.props.lastName,
                }
                await IncidentService.updateActionProgress(ActionProgressvalues, type, this.props.token,
                ).then(response => {
                    const data = response['data']
                    if (response.data.Success === true) {

                        CommonService.showSuccessNotification(response.data.Data.Message)
                        setTimeout(() => {
                            this.showHideSpinner(false)
                            this.state.pageName == 'SearchActionScreen' ?
                                this.props.navigation.navigate('Action Search', { pageLoad: false, id: null }) : this.state.pageName == 'HomeScreen' ? this.props.navigation.navigate('Home') :
                                    this.props.navigation.navigate('Actionlist', { id: this.state.incidentId, pageName: this.state.pageName, IncidentLocked: this.state.IncidentLocked, TenantIncidentId: navigation.state.params.TenantIncidentId })
                        }, 5);

                    } else {
                        this.showHideSpinner(false)
                        CommonService.showErrorNotification(response.data.Message)
                    }
                })
                    .catch(error => {
                        this.showHideSpinner(false)
                        CommonService.showErrorNotification(error.message)
                    })
            } catch (ex) {
                this.showHideSpinner(false)
                CommonService.showErrorNotification(ex.Message)
            }
        }
    }
    close = async () => {
        const { navigation } = this.props
        this.state.pageName == 'SearchActionScreen' ?
            this.props.navigation.navigate('Action Search', { pageLoad: false, id: null }) :
            this.props.navigation.navigate('Actionlist', { id: this.state.incidentId, pageName: this.state.pageName, IncidentLocked: this.state.IncidentLocked, TenantIncidentId: navigation.state.params.TenantIncidentId })
    }
    renderActionProcess({ item, index }) {
        const { navigation } = this.props
        var date = moment(item.CommentDate).format('DD-MMM-YYYY');
        const ActionType = navigation.state.params == undefined ? 4 : navigation.state.params.ActionType
        return (

            <View style={[styles.listItem, styles.evenlist, (index % 2 == 0) ? { backgroundColor: '#fff' } : { backgroundColor: '#f5f5f5' }]}>
                <View style={styles.listItemHead}>
                    <Text style={{ color: '#333', fontSize: 13 }}>{date}</Text>
                    {(ActionType === 4 || this.props.isMobileUser == false) ?
                        <Text style={{ color: '#333', fontSize: 13 }}>{item.ActionProgressStatus}</Text> :
                        <View>
                            {item.ActionProgressStatus == "Action Closed" &&
                                <Text style={{ color: '#333', fontSize: 13 }}>Action Closed</Text>}
                        </View>
                    }
                </View>
                <View style={styles.listItemBody}>
                    {(ActionType === 4 || this.props.isMobileUser == false) &&
                        <Text numberOfLines={3} style={{ fontSize: 13 }}>
                            Update By: {item.UserName}
                        </Text>}
                    <Text numberOfLines={3} style={{ fontSize: 13 }}>
                        {item.Comment}
                    </Text>
                </View>
            </View>
        );
    }
    ListEmptyView() {
        return (
            <View><Text style={{ fontSize: 16, color: "#d1d1d1", textAlign: "center", paddingVertical: 20 }}>No Action Progress has been entered.</Text></View>
        );
    }
    showPopUp(fieldname) {
      this.treeSelectRef.open()
        if (fieldname === 'Sites')
            this.setState({
                checkboxListType: "Site",
                isSiteSelected: true,
                searchText: ''
            })
        else
            this.setState({
                checkboxListType: "BusinessUnit",
                isSiteSelected: false,
                searchText: '',
            })
    }
    addNewOption = (text, value) => {
        const { checkboxListType ,valueSite1 ,check} = this.state
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
        if (format.test(this.state.searchText)) {
            CommonService.showWarningNotification(
                message.incidentMessages.special_keyword
            )
            return false
        }
        var key =(Math.random()).toString()
        var val = [{ key: key, label: text ,isLeaf: true }]
        var displayValue = text;
        if (value !== undefined) {
          var arr = [];
          this.findParent(this.state.checkboxListType == "BusinessUnit" ? this.state.allBusinessUnit : this.state.allSite, parseInt(value.key), arr)
          arr.splice(0, 0, text);
          displayValue = joinValueInArray(arr.reverse());
        }
        if (this.state.isSiteSelected) {
            this.setState({ sitename: displayValue, IsNewSite: true })
            this.setState({
                actionModal: {
                    ...this.state.actionModal,
                    ['selectedSite']: text
                },
                unSavedChanges: true,
                valueSite: val[0]
            })
        } else {
            this.setState({ BUnit: displayValue, IsNewBUnit: true })
            this.setState({
                actionModal: {
                    ...this.state.actionModal,
                    ['selectedBussinessUnit']: text
                },
                unSavedChanges: true,
                valueBunit: val[0]
            })
        }
        var arr = []
        arr.push({
            key: key,
            label: text,
            isParent: false,
        })
        if (value !== undefined) {
            checkboxListType == "BusinessUnit" ? this.GetChildBusinessUnits(parseInt(value.key) ,arr):this.GetChildSites(parseInt(value.key) ,arr) 
        } else {
            checkboxListType == "BusinessUnit" ? this.setState({ allBusinessUnit: [...this.state.allBusinessUnit, ...arr],  }) :this.setState({ allSite: [...this.state.allSite, ...arr],})
        }   
    }
    addChild(value, key) {
        this.showHideSpinner(true)
        if (this.state.checkboxListType === "BusinessUnit") {
            this.GetChildBusinessUnits(parseInt(key))
        } else {
            this.GetChildSites(parseInt(key))
        }
    }
    getParent(root, id, data ,arr) {
        var i, node;
        for (var i = 0; i < root.length; i++) {
            node = root[i];
            if (parseInt(node.key) === id || node.children && (node = this.getParent(node.children, id, data ,arr))) {
                root[i].children = []
                if(arr !== undefined) root[i].isParent = true
                root[i].children.push(...data)
            }
        }
        return null;
    }
    GetChildBusinessUnits = async (id , arr ) => {
        try {
            await ActionService.GetChildBusinessUnits(id, this.props.token)
                .then((response) => {
                    const result = response['data']
                    if (result['Success'] === true) {
                        for (var i = 0; i < result['Data'].length; i++) {
                            result['Data'][i].parentId = id
                        }
                        if (this.state.allBusinessUnit) {
                            arr !== undefined && result['Data'].splice(-1,0,...arr)
                            this.getParent(this.state.allBusinessUnit, id, result['Data'] ,arr)
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
    GetChildSites = async (id ,arr) => {
        try {
            await ActionService.GetChildSites(id, this.props.token)
                .then((response) => {
                    const result = response['data']
                    if (result['Success'] === true) {
                        for (var i = 0; i < result['Data'].length; i++) {
                            result['Data'][i].parentId = id
                        }
                        if (this.state.allSite) {
                            arr !== undefined && result['Data'].splice(-1,0,...arr)
                            this.getParent(this.state.allSite, id, result['Data'] ,arr)
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
    onComfirm(value ,addItem ) {
        this.setState({ a: true })
        const { checkboxListType ,valueSite } = this.state
        if (value !== undefined) {
            checkboxListType == "BusinessUnit" ?
            this.setState({ valueBunit: value }) :
            this.setState({ valueSite: value })
            var arr =[];
            this.findParent(this.state.checkboxListType == "BusinessUnit" ? this.state.allBusinessUnit : this.state.allSite ,parseInt(value.key) ,arr)
            var displayValue = joinValueInArray(arr.reverse());
            if (addItem == false) {
                if (checkboxListType == "BusinessUnit") {
                    this.setState({
                        actionModal: { ...this.state.actionModal, ['selectedBussinessUnit']: (value.key)},
                        BUnit: displayValue,
                        IsNewSite: false,
                        unSavedChanges: true
                    })
                } else {
                    this.setState({
                        actionModal: { ...this.state.actionModal, ['selectedSite']: (value.key), },
                        sitename: displayValue,
                        IsNewSite: false,
                        unSavedChanges: true
                    })
                }
            }
            else {
                if (checkboxListType == "BusinessUnit") {
                    this.setState({
                        actionModal: { ...this.state.actionModal, ['ParentBusinessUnitID']: (value.key) },
                        valueBunit: value
                    })
                } else {
                    this.setState({
                        actionModal: { ...this.state.actionModal, ['ParentSiteID']: (value.key) },
                        valueSite: value
                    })
                }
            }
        }
    }
    onClose() {
        const { checkboxListType } = this.state
        checkboxListType == "BusinessUnit" ? this.setState({ valueBunit: [] }) : this.setState({ valueSite: [] })
    }
    findParent(root, id ,arr) {
        var i, node;
        for (var i = 0; i < root.length; i++) {
          node = root[i];
          if (parseInt(node.key) === id || node.children && (node = this.findParent(node.children, id,arr))) {
           if(root[i].parentId){
            arr.push(root[i].label)
            this.findParent(this.state.checkboxListType == "BusinessUnit" ? this.state.allBusinessUnit : this.state.allSite, root[i].parentId,arr)
           }
           else if(root[i].endNode){
            arr.push(root[i].label)
           }
          }
        }
        return null;
      }
    //#endregion
    render() {
        const { navigation } = this.props
        const { showDialog, spinner, actionModal, isDateTimePickerVisible, modal, actionid, actionCommentModel, Progress, validationModel, IncidentLocked } = this.state
        const ActionType = navigation.state.params == undefined ? 4 : navigation.state.params.ActionType
        var lock = ActionType == 1 && IncidentLocked == true ? false : true
        return (
            <View style={appStyles.container}>
                <HeaderView PropFunction={() => this.checkUnSavedData()}
                    Title={actionid && actionid > 0
                        ? 'Action Details'
                        : 'Action'}
                    Pagename={'incident'} />
                <View>
                    <Spinner visible={spinner} />
                </View>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={20}
                    behavior="padding"
                    style={{ flex: 1 }}>
                    <SafeAreaView style={styles.container1}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView ref={this.scrollView}>
                                {ActionType === 4 &&
                                    <View>
                                        <View style={styles.fieldPadding}>
                                            <View style={styles.secField}>
                                                <Text style={styles.textLabel}>Describe the reason/background for the Stand Alone action</Text>
                                                <View style={styles.multiSelctinputPadding}>
                                                    <TextInput
                                                        //  editable = {IncidentLocked === false}
                                                        scrollEnabled={false}
                                                        multiline={true}
                                                        autoCapitalize='none'
                                                        clearButtonMode='always'
                                                        value={actionModal['descriptionAction']}
                                                        style={styles.textArea}
                                                        maxLength={200}
                                                        onChangeText={text =>
                                                            this.setState({
                                                                actionModal: { ...this.state.actionModal, ['descriptionAction']: text },
                                                                unSavedChanges: true
                                                            })
                                                        }
                                                    ></TextInput>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.fieldPadding}>
                                            <View style={styles.secField}>
                                                <Text style={styles.textLabel}>At what site is this action being implemented?</Text>
                                                <View>
                                                    <View style={[appStyles.forfieldIcon, {
                                                        paddingHorizontal: 10,
                                                        width: '100%',
                                                        marginBottom: 10,
                                                        position: 'relative'
                                                    }]}>
                                                        <TouchableOpacity onPress={() => {

                                                            this.showPopUp('Sites')
                                                        }}>
                                                            <Text
                                                               style={[styles.textBox, styles.top ,this.state.sitename.length < 21 ? { height: 40}:{height: 'auto'}]}
                                                                onChangeText={text =>
                                                                    this.setState({ unSavedChanges: true })
                                                                }
                                                            >
                                                                {this.state.sitename}
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <View style={appStyles.fieldIcon}>
                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.fieldPadding}>
                                            <View style={styles.secField}>
                                                <Text style={styles.textLabel}>What business unit is responsible for the action?</Text>
                                                <View>
                                                    <View style={[styles.inputPadding, appStyles.forfieldIcon]}>
                                                        <TouchableOpacity
                                                            onPress={() => {

                                                                this.showPopUp('Business Unit')
                                                            }
                                                            }
                                                        >
                                                            <Text
                                                               style={[styles.textBox, styles.top ,this.state.BUnit.length < 21 ? { height: 40}:{height: 'auto'}]}
                                                                placeholder='Select Business Unit'
                                                                onChangeText={text =>
                                                                    this.setState({ unSavedChanges: true })
                                                                }
                                                            >
                                                                {this.state.BUnit}
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <View style={appStyles.fieldIcon}>
                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>}
                                <View style={styles.fieldPadding}>
                                    <View style={styles.secField}>
                                        <Text style={styles.textLabel}>Describe the action that need to be completed</Text>
                                        <View style={styles.multiSelctinputPadding}>
                                            <TextInput
                                                editable={lock}
                                                scrollEnabled={false}
                                                multiline={true}
                                                autoCapitalize='none'
                                                clearButtonMode='always'
                                                value={modal['description']}
                                                style={styles.textArea}
                                                maxLength={200}
                                                onChangeText={text =>
                                                    this.setState({
                                                        modal: { ...this.state.modal, ['description']: text },
                                                        unSavedChanges: true
                                                    })
                                                }
                                            ></TextInput>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.fieldPadding}>
                                    <View style={styles.secField}>
                                        <Text style={styles.textLabel}>When does this action need to be completed by?</Text>
                                        <View
                                            style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                            <View style={[appStyles.multiSec, { alignItems: "center", height: 40, paddingLeft: 6, flexDirection: "row", }]}>
                                                <TouchableOpacity onPress={() => IncidentLocked == false &&
                                                    this.setState({ isDateTimePickerVisible: true })} style={{ width: '100%', height: '100%', alignItems: "center", paddingLeft: 6, flexDirection: "row", }}>
                                                    <Text >
                                                        {modal['date']}
                                                    </Text>
                                                    <DatePicker
                                                        Visible={isDateTimePickerVisible}
                                                        handleDatePicker={(date) => this.handleDatePicked(date)}
                                                        cancelDatePicker={() => this.setState({ isDateTimePickerVisible: false })}
                                                    />

                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.dateAndTimeIcon}>
                                                <Icon
                                                    //   onPress={() => IncidentLocked == false && this.setState({ isDateTimePickerVisible: true })}
                                                    name='calendar'
                                                    type='font-awesome'
                                                    color='#c9c9c9'
                                                    size={25}
                                                />
                                            </View>

                                        </View>
                                    </View>
                                </View>
                                {(this.props.isMobileUser == false) &&
                                    //ActionType === 4 ||
                                    <View>
                                        <View style={styles.fieldPadding}>
                                            <View style={styles.secField}>
                                                <Text style={styles.textLabel}>Who is responsible for the action?</Text>
                                                <TouchableWithoutFeedback onPress={() => IncidentLocked == false &&
                                                    this.setState({ showDialog: true, selectType: 'ResponsibleUser' })
                                                }>
                                                    <View
                                                        style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                        <View style={[appStyles.multiSec, { alignItems: "center", height: 40, paddingLeft: 6, flexDirection: "row" }]}>

                                                            <Text>
                                                                {actionModal['ResponsibleUser']}
                                                            </Text>

                                                        </View>
                                                        <View style={appStyles.fieldIcon}>
                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </View>
                                        <View style={styles.fieldPadding}>
                                            <View style={styles.secField}>
                                                <Text style={styles.textLabel}>Who will be checking that the action has been completed?</Text>
                                                <TouchableWithoutFeedback onPress={() => IncidentLocked == false &&
                                                    this.setState({ showDialog: true, selectType: 'CheckerUser', })
                                                }>
                                                    <View
                                                        style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                        <View style={[appStyles.multiSec, { alignItems: "center", height: 40, paddingLeft: 6, flexDirection: "row" }]}>
                                                            <Text>
                                                                {actionModal['CheckerUser']}

                                                            </Text>
                                                        </View>
                                                        <View style={appStyles.fieldIcon}>
                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                        </View>
                                                    </View>

                                                </TouchableWithoutFeedback>
                                            </View>
                                        </View>
                                    </View>

                                }
                                <View style={styles.fieldPadding}>
                                    <View style={styles.secField}>
                                        <Text style={styles.textLabel}>Impacts</Text>
                                        <View
                                            style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                            <View style={appStyles.multiSec}>
                                                {this.sectionedMultiView(actionModal['impacts'], modal['impactsId'], 'impactsId', false, 'Choose Impacts')}

                                            </View>
                                            <View style={appStyles.fieldIcon}>
                                                <Icon name='search' color='#c9c9c9' size={30} />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.fieldPadding}>
                                    <View style={styles.secField}>
                                        <Text style={styles.textLabel}>Hierarchy of control</Text>
                                        <View
                                            style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                            <View style={appStyles.multiSec}>
                                                {this.sectionedMultiView(actionModal['hierarchyOfControls'], actionModal['hierarchyOfControlsId'], 'hierarchyOfControlsId', true, 'Choose Hierarchy of control')}
                                            </View>
                                            <View style={appStyles.fieldIcon}>
                                                <Icon name='search' color='#c9c9c9' size={30} />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {this.state.actionModal["ActionProgress"] &&
                                    <View style={styles.actionList}>
                                        <View style={styles.actionHead}>
                                            <Text style={{ color: '#444', fontSize: 16, alignSelf: 'center' }}>Action Progress</Text>
                                        </View>
                                        <View style={{
                                            paddingHorizontal: 10,
                                            width: '100%',
                                            marginBottom: 20,
                                            marginTop: 10,
                                            position: 'relative'
                                        }}>
                                            <TouchableOpacity onPress={() =>
                                                IncidentLocked == false &&
                                                this.ShowActionProgress()}>
                                                <Text style={[styles.textBox1, Platform.OS === 'android' ? { fontSize: 15 } : { fontSize: 13.5 }]}>
                                                    Add Progress / Complete Action
                                     </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <FlatList
                                            style={{ backgroundColor: '#FFF' }}
                                            data={actionModal["ActionProgress"]}
                                            renderItem={this.renderActionProcess.bind(this)}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListEmptyComponent={this.ListEmptyView}
                                        />
                                    </View>
                                }
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </KeyboardAvoidingView>
                {showDialog && <SearchPeopleModal
                    spinner={spinner}
                    modalVisible={showDialog}
                    selectedUserData={(UserID, UserName, IsUser) => { this.selectedUserData(UserID, UserName, IsUser) }}
                    showPersonField={false}
                    cancel={() => this.setState({ showDialog: false, isLoading: true })}
                />}
                <Modal
                    transparent={true}
                    visible={actionCommentModel}
                    onRequestClose={() => {
                        this.setState({ actionCommentModel: false })
                    }}>
                    {this.state.showInstructions ?
                        <View
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingTop: 60 }}>
                            <ScrollView contentContainerStyle={{ flexDirection: "row", alignItems: "center" }}>
                                {this.state.showInstructions &&
                                    <View style={styles.fieldInstructionWrap}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <Text style={[styles.inputLabel1, { fontWeight: '700' }]}>
                                                Action Checker Instructions:
                                     </Text>
                                            <Icon
                                                onPress={() => this.setState({ showInstructions: false })}
                                                name="close" size={20} iconStyle={{ marginBottom: 8 }} />
                                        </View>
                                        <Text style={[styles.inputLabel1, { fontSize: 13 }]}>
                                            You must provide commentary in the 'Action Progress Comments' box
                                            confirming that you've reviewed the actions and affirmed that the
                                            conditions below have been satisfied
                                     </Text>

                                        <View style={{ paddingLeft: 10 }}>
                                            <View style={styles.questionWrap}>
                                                <Icon
                                                    iconStyle={{ marginRight: 5, marginTop: 6 }}
                                                    size={10}
                                                    name="fiber-manual-record"
                                                />
                                                <Text style={{ color: '#000', fontSize: 13, }}>
                                                    Has the required action been implemented adequately?
                                         </Text>
                                            </View>
                                            <View style={styles.questionWrap}>
                                                <Icon
                                                    iconStyle={{ marginRight: 5, marginTop: 6 }}
                                                    size={10}
                                                    name="fiber-manual-record"
                                                />
                                                <Text style={{ color: '#000', fontSize: 13, }}>
                                                    Has the required action effectively addressed the issue, concern
                                                    or identified hazard/risk?
                                             </Text>
                                            </View>
                                        </View>

                                        <Text style={[styles.inputLabel1, { fontSize: 13 }]}>
                                            If 'YES' to both questions, select 'Approve &amp; Close Action' and
                                            then click Save.
                                    </Text>

                                        <Text style={[styles.inputLabel1, { fontSize: 13 }]}>
                                            If 'NO' to either question, select 'Reject &amp; Return to
                                            Responsible Person', and then click Save.
                                     </Text>

                                        <Text style={[styles.inputLabel1, { fontSize: 13 }]}>
                                            If rejecting and returning this action to the responsible person,
                                            provide a detailed reason for the rejection in the 'Action Progress
                                            Comments' box
                                    </Text>
                                    </View>
                                }
                            </ScrollView>
                        </View>
                        :
                        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
                            <View style={{ marginTop: 70, paddingHorizontal: 25 }}>
                                <ScrollView>
                                    <KeyboardAvoidingView behavior="padding" style={[styles.modalContainer, { backgroundColor: "#fff" }]} >
                                        <View>
                                            {Progress.IsActionCompleted &&
                                                <View style={{ backgroundColor: '#f2f2f2', paddingHorizontal: 20, paddingVertical: 10, }}>

                                                    <Text style={{ fontSize: 18, color: "#424242" }}>Action Progress</Text>
                                                </View>
                                            }
                                            <View style={[styles.fieldWrap, { paddingTop: 15 }]}>
                                                <Text style={styles.inputLabel1}>
                                                    {
                                                        Progress.IsActionCompleted ? "Comment" :
                                                            "Comment about any progress that has been made"

                                                    }

                                                </Text>

                                                <TextInput
                                                    // placeholder="Action progress text"
                                                    style={[styles.customInput, Platform.OS === 'ios' && { height: 80 }, validationModel.progressComment ? { borderColor: 'red', } : { borderColor: '#e2e2e2' }]}
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    autoCapitalize="none"
                                                    onChangeText={text => this.setState({
                                                        'progressComment': text,
                                                    })}
                                                />
                                                {validationModel.progressComment && <Text style={[styles.inputLabel1, { color: 'red' }]}>Comment is required.</Text>}
                                            </View>
                                            {Progress.IsActionCompleted == false && Progress.IsActionReopen == false &&
                                                <View style={styles.fieldWrap}>
                                                    <Text style={styles.inputLabel1}>Is this action completed?</Text>
                                                    <View style={styles.actionWrap}>
                                                        <TouchableOpacity style={[styles.actionBtn, Progress.IsCompleted == false ? { backgroundColor: '#ff9b00' } : { backgroundColor: '#fff' }]}
                                                            onPress={() => {
                                                                (ActionType === 4 || this.props.isMobileUser == false) ?
                                                                    this.setState({ ActionProgressStatus: actionModal.ActionProgressStatus.NoChange, Progress: { ...Progress, IsCompleted: false } }) :
                                                                    this.setState({ ActionProgressStatus: actionModal.ActionProgressStatus.NoChange, Progress: { ...Progress, IsCompleted: false } })
                                                            }
                                                            }
                                                        >
                                                            <Text style={[Progress.IsCompleted == true ? { color: '#424242' } : { color: '#fff' }, { fontSize: 13 }]}>No</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                (ActionType === 4 || this.props.isMobileUser == false) ?
                                                                    this.setState({ ActionProgressStatus: actionModal.ActionProgressStatus.CompleteAndReadyForCheck, Progress: { ...Progress, IsCompleted: true } }) :
                                                                    this.setState({ ActionProgressStatus: actionModal.ActionProgressStatus.ActionClosed, Progress: { ...Progress, IsCompleted: true } })
                                                            }}
                                                            style={[styles.actionBtn, Progress.IsCompleted == true ? { backgroundColor: '#ff9b00' } : { backgroundColor: '#fff' }]} >
                                                            <Text style={[Progress.IsCompleted == true ? { color: '#fff' } : { color: '#424242' }, { fontSize: 13 }]}>Yes</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                            {Progress.IsActionReopen &&
                                                <View style={styles.fieldWrap}>
                                                    <Text style={styles.inputLabel1}>Do you want to re-open this action?</Text>
                                                    <View style={styles.actionWrap}>
                                                        <TouchableOpacity
                                                            style={[styles.actionBtn, Progress.IsCompleted == false ? { backgroundColor: '#ff9b00' } : { backgroundColor: '#fff' }]}
                                                            onPress={() => this.setState({ ActionProgressStatus: actionModal.ActionProgressStatus.NoChange, Progress: { ...Progress, IsCompleted: false } })}>
                                                            <Text style={[Progress.IsCompleted == true ? { color: '#424242' } : { color: '#fff' }, { fontSize: 13 }]}>No</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({ ActionProgressStatus: actionModal.ActionProgressStatus.ReOpened, Progress: { ...Progress, IsCompleted: true } })}
                                                            style={[styles.actionBtn, Progress.IsCompleted == true ? { backgroundColor: '#ff9b00' } : { backgroundColor: '#fff' }]} >
                                                            <Text style={[Progress.IsCompleted == true ? { color: '#fff' } : { color: '#424242' }, { fontSize: 13 }]}>Yes</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                            {Progress.IsCompleted && Progress.IsActionReopen == false &&
                                                <View style={styles.fieldWrap}>
                                                    <Text style={styles.inputLabel1}>Completion Date</Text>
                                                    <View style={styles.actionWrap}>
                                                        <TouchableOpacity style={styles.datePickBtn} onPress={() => this.setState({ ActionProgressdatePicker: true })} >
                                                            <Text style={{ color: '#424242', fontSize: 13 }}>{this.state.progressdate}</Text>
                                                        </TouchableOpacity>
                                                        <DatePicker
                                                            Visible={this.state.ActionProgressdatePicker}
                                                            handleDatePicker={(date) => this.handleDatePicked(date, 'ProgressDatePicked')}
                                                            cancelDatePicker={() => this.setState({ ActionProgressdatePicker: false })}
                                                        />
                                                    </View>
                                                </View>
                                            }
                                            {
                                                Progress.IsActionCompleted &&
                                                <View>
                                                    <View style={styles.fieldWrap}>
                                                        <Text style={styles.inputLabel1}>Action Status</Text>
                                                        <View>
                                                            <View style={styles.checkboxContainer}>
                                                                <CheckBox
                                                                    left
                                                                    size={20}
                                                                    checkedIcon="dot-circle-o"
                                                                    uncheckedIcon="circle-o"
                                                                    containerStyle={styles.radioButton}
                                                                    checked={this.state.checkedProgressApprove}
                                                                    onPress={() => this.ActionAcceptOrRejectionStatus('Approve')}
                                                                />
                                                                <Text style={[styles.inputLabel1, { marginTop: 4 }]}>
                                                                    Approve & Close action
                                                    </Text>
                                                            </View>
                                                            <View style={styles.checkboxContainer}>
                                                                <CheckBox
                                                                    left
                                                                    size={20}
                                                                    checkedIcon="dot-circle-o"
                                                                    uncheckedIcon="circle-o"
                                                                    containerStyle={styles.radioButton}
                                                                    checked={this.state.checkedProgressReject}
                                                                    onPress={() => this.ActionAcceptOrRejectionStatus('Reject')}
                                                                />
                                                                <Text style={[styles.inputLabel1, { marginTop: 4 }]}>
                                                                    Reject & Return to Responsible person
                                                    </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.fieldWrap}>
                                                        <TouchableOpacity onPress={() => this.setState({ showInstructions: true })}>
                                                            <Text style={[styles.inputLabel1z, { fontWeight: '500', color: "#3981ee" }]}>
                                                                Click to read Action Checker Instructions
                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                            }

                                        </View>
                                        <View style={styles.actionfooter}>
                                            <TouchableOpacity style={styles.footerBtn} onPress={() => this.setState({ actionCommentModel: false })}>
                                                <Text style={{ color: '#3981ee', fontSize: 16, textAlign: "left" }}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.footerBtn} onPress={() => this.addComment()}>
                                                <Text style={{ color: '#3981ee', fontSize: 16, textAlign: "right" }}>Save</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </KeyboardAvoidingView>
                                </ScrollView>
                            </View>
                        </View>
                    }
                </Modal>
                <FooterView PropFunction={() => this.validatorAction()} showType={'Action'} IncidentLocked={IncidentLocked} Close={() => this.close()} />
                <TreeSelect
                    ref={node => this.treeSelectRef = node}
                    onComfirm={(value ,addItem) => { this.onComfirm(value ,addItem) }}
                    addNew={this.props.isMobileUser}
                    addNewOption={(text ,value) => this.addNewOption(text ,value)}
                    onClose={() =>console.log('')
                      //  this.onClose()
                    }
                    valuedata={(value) => { this.valuedata(value) }}
                    treeData={this.state.checkboxListType == "BusinessUnit" ? this.state.allBusinessUnit : this.state.allSite}
                    value={this.state.checkboxListType == "BusinessUnit" ? this.state.valueBunit : this.state.valueSite}
                    onlyCheckLeaf={true}
                    multiple={false}
                    addChild={(val, key) => this.addChild(val, key)}
                    spinner={this.state.spinner}
                    selectedParent={(value,index)=>this.selectedParent(value,index)}
                    additemname={this.state.checkboxListType == "BusinessUnit" ? 'Business Unit name' :'Site name'}
                    addMode={() => this.onClose()}
                />
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
        isMobileUser: state.home.isMobileUser,
        firstName: state.home.firstName,
        lastName: state.home.lastName,
        userId: state.home.userId,
    }
}
export default connect(mapStateToProps)(ActionDetailScreen)
