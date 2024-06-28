import React, { Component } from 'react'
import { Text, View, Keyboard, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Alert, ScrollView, TextInput, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native';
import { Icon } from 'react-native-elements'
import { IncidentService, CommonService } from '../../../Services'
import { HeaderView, FooterView, ChoosePageMenu } from '../../../component/index'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment';
import message from '../../../Utility/Message'
import { connect } from 'react-redux'
import Constants from 'expo-constants'
import SectionedMultiSelect from '../../../Custom-NodeModules/react-native-sectioned-multi-select'
import styles from './Style';
import Validation from '../../../Utility/Validation'
import { combineReducers } from 'redux';
import appStyles from '../../../../AppStyle';
import { StackActions } from "react-navigation";
class AdditionalDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            unSavedChanges: false,
            pageName: '',
            nextPagedialog: false,
            additionalDetailModal: {},
            items: {
                'vehicleTypesListSelected' :[],
                'ReportableTosListSelected' :[],
                'contractorVendorsListSelected':[],
                'ContractorVendorsList':[]
            },
        }
    }
    //#region  Methods
    UNSAFE_componentWillMount() {
        const { navigation } = this.props
        let id = navigation.state.params.id
        let pageName = navigation.state.params.pageName
        if (pageName !== undefined) this.setState({ pageName: pageName })
        this.setState({ incidentId: id })
        this.getIncidentById(id)
        this.focusListener = navigation.addListener('didFocus', () => {
            CommonService.handleAndroidBackButton(this.handleBackPress)
        })
    }
    handleBackPress = () => {
       this.checkUnSavedData('goback')
        return true
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        })
    }
    async getIncidentById(id) {
        this.showHideSpinner(true)
        try {
            await IncidentService.getAdditionalDetails(id, this.props.token)
                .then(response => {
                    const result = response['data']
                    const data = result['Data']
                    if (result['Success'] === true) {
                        this.setState({
                            additionalDetailModal: result['Data']
                        })
                        this.dropDownsValues(result, data)
                        this.showHideSpinner(false)
                    } else {
                        this.showHideSpinner(false)
                        CommonService.handleError(response)
                    }
                })
                .catch(error => {
                    this.showHideSpinner(false)
                    CommonService.showErrorNotification(error.message)
                })
        } catch (error) {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(ex.Message)
        }
    }
    async dropDownsValues(result, data) {
        const { additionalDetailModal, items } = this.state
        this.setState({
            additionalDetailModal: result['Data'],
            items: {
                ...this.state.items,
                'contractorInvolvementsList': [
                    {
                        name: 'Select Involvement',
                        id: 0,
                        children: data.ContractorInvolvementsList
                    }
                ],
                'contractorVendorsList': [
                    {
                        name: 'Select Vendor Involved',
                        id: 0,
                        children: data.ContractorVendorsList
                    }
                ],
                'contractorTypesList': [
                    {
                        name: 'Select Contractor',
                        id: 0,
                        children: data.ContractorTypesList
                    }
                ],
                'vehicleTypesList': [
                    {
                        name: 'Select Contractor',
                        id: 0,
                        children: data.VehicleTypesList
                    }
                ],
                'ReportableTosList': [
                    {
                        name: 'Select Contractor',
                        id: 0,
                        children: data.ReportableTosList
                    }
                ],
                'spillCausesList': [
                    {
                        name: 'Select Contractor',
                        id: 0,
                        children: data.SpillCausesList
                    }
                ],
                'spillSourcesList': [
                    {
                        name: 'Select Contractor',
                        id: 0,
                        children: data.SpillSourcesList
                    }
                ],
                'spillTypesList': [
                    {
                        name: 'Select Contractor',
                        id: 0,
                        children: data.SpillTypesList
                    }
                ],
                'unitOfMeasuresList': [
                    {
                        name: 'Select Contractor',
                        id: 0,
                        children: data.UnitOfMeasuresList
                    }
                ],

            }

        })

        this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false ?
            this.state.items["lockedStatus"] = false : this.state.items["lockedStatus"] = true

        if (additionalDetailModal['ContractorCategoryID']) {
            this.pushToArray('contractorTypesListSelected', additionalDetailModal['ContractorCategoryID'])
            this.pushToArray('contractorInvolvementSelected', additionalDetailModal['ContractorInvolvementID'])
            this.pushToArray('contractorVendorsListSelected', additionalDetailModal['ContractorVendorID'])
        }
        if (additionalDetailModal['SpillTypeID']) {
            this.pushToArray('spillTypesListSelected', additionalDetailModal['SpillTypeID'])
            this.pushToArray('spillCausesListSelected', additionalDetailModal['SpillCauseID'])
            this.pushToArray('spillSourcesListSelected', additionalDetailModal['SpillSourceID'])
            this.pushToArray('unitOfMeasuresListSelected1', additionalDetailModal.SpillAmountUOM)
            this.pushToArray('unitOfMeasuresListSelected2', additionalDetailModal.SpillAmountRecoveredUOM)
        }
        if (additionalDetailModal['IncidentVehiclesModel'] != null) {
            var selectedVehicles = []
            for (i in additionalDetailModal['IncidentVehiclesModel']) {
                var val = additionalDetailModal['IncidentVehiclesModel'][i].VehicleTypeID
                selectedVehicles.push(val.toString())
            }
        }
        if (additionalDetailModal['IncidentReportablesToModel'] != null) {
            var selectedReportables = []
            for (i in additionalDetailModal['IncidentReportablesToModel']) {
                var val = additionalDetailModal['IncidentReportablesToModel'][i].ReportableExtToID
                selectedReportables.push(val.toString())
            }

        }
        if (selectedReportables.length >= 0) {
            this.onSelected(selectedReportables, 'ReportableTosListSelected')
        }
        if (selectedVehicles.length >= 0) {
            this.onSelected(selectedVehicles, 'vehicleTypesListSelected')
        }
    }
    async pushToArray(array, value) {
        var id = []
        id.push((value).toString())
        this.onSelected(id, array)
    }
    validations = async (page,listingPage) => {
        const { items, additionalDetailModal } = this.state
        var errorStatus = false;
        if (additionalDetailModal.ContractorIncident) {
            var ContractorIncident = {
                'contractorTypesListSelected': items['contractorTypesListSelected'],
                'contractorVendorsListSelected':  items['contractorVendorsListSelected'],
                'contractorInvolvementSelected': items['contractorInvolvementSelected'],
            }
            var result = Validation.checkFieldIsUndefinedOrEmpty(ContractorIncident)
            if (result.status === false) {
                CommonService.showErrorNotification(result.message)
                errorStatus = true
            }
            else {
                this.state.additionalDetailModal['ContractorCategoryID'] = items['contractorTypesListSelected'][0]
                this.state.additionalDetailModal['ContractorInvolvementID'] = items['contractorInvolvementSelected'][0]
                this.state.additionalDetailModal['ContractorVendorID'] =  items['contractorVendorsListSelected'][0]
            }
        }
        else {
            this.state.additionalDetailModal['ContractorCategoryID'] = null
            this.state.additionalDetailModal['ContractorInvolvementID'] = null
            this.state.additionalDetailModal['ContractorVendorID'] = null

        }
        if (additionalDetailModal.VehiclesInvolved) {
            var IncidentVehiclesModel = []
            if (items['vehicleTypesListSelected'] == undefined || items['vehicleTypesListSelected'].length < 1) {
                CommonService.showErrorNotification(`${message.additionalPageError['vehicleTypesListSelected']}` + " is required.")
                errorStatus = true
            } else {
                for (index in items['vehicleTypesListSelected']) {
                    var findIndex = additionalDetailModal['IncidentVehiclesModel'].findIndex(x => x.VehicleTypeID == items['vehicleTypesListSelected'][index]);
                    if (findIndex == -1) {
                        IncidentVehiclesModel.push({
                            IncidentID: 0,
                            IncidentVehicleTypeID: 0,
                            IsAdded: true,
                            TenantID: 0,
                            VehicleTypeID: items['vehicleTypesListSelected'][index],
                            IsMobileIncidentVehicle:true

                        })
                    }
                    else {
                        IncidentVehiclesModel.push({
                            IncidentID: 0,
                            IncidentVehicleTypeID: 0,
                            IsAdded: false,
                            TenantID: 0,
                            VehicleTypeID: items['vehicleTypesListSelected'][index],
                            IsMobileIncidentVehicle:true

                        })
                    }
                }
            this.state.additionalDetailModal['IncidentVehiclesModel'] = IncidentVehiclesModel
            }

        } else {
            this.state.additionalDetailModal['IncidentVehiclesModel'] = []
        }
        if (additionalDetailModal.ReportableExt) {
            var IncidentReportablesToModel = []
            if (items['ReportableTosListSelected'] == undefined || items['ReportableTosListSelected'].length == 0) {
                CommonService.showErrorNotification(`${message.additionalPageError['ReportableTosListSelected']}` + " is required.")
                errorStatus = true
            }
            else {
                for (index in items['ReportableTosListSelected']) {
                    var findIndex = additionalDetailModal['IncidentReportablesToModel'].findIndex(x => x.ReportableExtToID == items['ReportableTosListSelected'][index]);
                    if (findIndex == -1) {
                        IncidentReportablesToModel.push({
                            IncidentID: 0,
                            IncidentReportableToID: 0,
                            IsAdded: true,
                            ReportableExtToID: items['ReportableTosListSelected'][index],
                            TenantID: 0,
                            IsMobileIncidentReportableTo :true
                        })
                    }
                    else {
                        IncidentReportablesToModel.push({
                            IncidentID: 0,
                            IncidentReportableToID: 0,
                            IsAdded: false,
                            ReportableExtToID: items['ReportableTosListSelected'][index],
                            TenantID: 0,
                            IsMobileIncidentReportableTo :true
                        })
                    }
                }
             this.state.additionalDetailModal['IncidentReportablesToModel'] = IncidentReportablesToModel
                

            }
        } else {
            this.state.additionalDetailModal['IncidentReportablesToModel'] = []
            this.state.additionalDetailModal['ReportableToReference'] = null
        }

        if (additionalDetailModal.Spill) {
            var Spill = {
                'spillTypesListSelected': items['spillTypesListSelected'],
                'spillCausesListSelected': items['spillCausesListSelected'],
                'spillSourcesListSelected': items['spillSourcesListSelected'],
                'SpillAmount': additionalDetailModal['SpillAmount'],
                'unitOfMeasuresListSelected1': items['unitOfMeasuresListSelected1'],
                'SpillAmountRecovered': additionalDetailModal.SpillAmountRecovered,
                'unitOfMeasuresListSelected2': items['unitOfMeasuresListSelected2'],
            }
            var result = Validation.checkFieldIsUndefinedOrEmpty(Spill)
            if (result.status === false) {
                CommonService.showErrorNotification(result.message)
                errorStatus = true
            }
            else {
                this.state.additionalDetailModal['SpillTypeID'] = items['spillTypesListSelected'][0]
                this.state.additionalDetailModal['SpillCauseID'] = items['spillCausesListSelected'][0]
                this.state.additionalDetailModal['SpillSourceID'] = items['spillSourcesListSelected'][0]
                this.state.additionalDetailModal['SpillAmountUOM'] = items['unitOfMeasuresListSelected1'][0]
                this.state.additionalDetailModal['SpillAmountRecoveredUOM'] = items['unitOfMeasuresListSelected2'][0]
                this.state.additionalDetailModal['SpillAmountUOMName'] = null
                this.state.additionalDetailModal['SpillAmountRecoveredUOMName'] = null
            }
        }
        else {
            this.state.additionalDetailModal['SpillTypeID'] = null
            this.state.additionalDetailModal['SpillCauseID'] = null
            this.state.additionalDetailModal['SpillSourceID'] = null
            this.state.additionalDetailModal['SpillAmount'] = null
            this.state.additionalDetailModal['SpillAmountRecovered'] = null
            this.state.additionalDetailModal['SpillAmountUOM'] = null
            this.state.additionalDetailModal['SpillAmountRecoveredUOM'] = null
        }
        if (!errorStatus) {
         this.save(page,listingPage)
        }
    }
    save = async (page,listingPage) => {
        this.showHideSpinner(true)
        try {
            await IncidentService.saveIncidentAdditionalDetails(
                this.state.additionalDetailModal, this.props.token
            )
                .then(response => {
                    const data = response['data']
                    if (data['Success'] == true) {
                        this.showHideSpinner(false)
                        CommonService.showSuccessNotification("Incident Additional details is successfully updated")
                        page !== undefined ? this.navigationBack(page,listingPage):
                        this.props.navigation.navigate('Incident', {
                           id: this.state.incidentId
                        })

                    } else {
                        this.showHideSpinner(false)
                        CommonService.handleError(response)
                    }
                })
                .catch(err => {
                    this.showHideSpinner(false)
                    CommonService.showErrorNotification(err.message)
                })
        } catch (error) {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(error['message'])
        }

    }
    async onSelected(selectedItems, type, Changes) {
        if (Changes === 'changes') { this.setState({ unSavedChanges: true }) }
        this.setState({
            items: {
                ...this.state.items,
                [type]: selectedItems
            }
        })
    }
     sectionedMultiView = (changes, items, selectedItems, type, selectText, single, addnew) => {
        return (
            <SectionedMultiSelect
               chipRemoveIconComponent={this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false}
                disabled={this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false}
                items={items}
                confirmText='Close'
                uniqueKey='id'
                subKey='children'
                selectText={selectText}
                hideSearch={false}
                showDropDowns={true}
                single={single}
                readOnlyHeadings={true}
                expandDropDowns={true}
                onSelectedItemsChange={(selectedItems) => this.onSelected(selectedItems, type, changes)}
                selectedItems={selectedItems}
                styles={
                    [
                        this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false ?
                            {
                                chipContainer: {
                                    width: '40%'
                                }
                            } : {
                                chipContainer: {}
                            }]
                }
                showAddOption={addnew === true ? true : false}
                onAddOption={this.onNewVendor}
                searchPlaceholderText={addnew ? "Add New Vendor / Search...": "Search Categories..." }
            />
        )
    }
    onNewVendor = (status, name) => {
        var contractorVendorModel = []
        contractorVendorModel = {
            ContractorVendor: name,
            CreateDate: null,
            CreatedBy: null,
            Updated: null,
            UpdatedBy: null,
            TenantID: 0,
        }
        this.addNewVendor(contractorVendorModel)
    }
     addNewVendor = async (contractorVendorModel) => {
        try {
            await IncidentService.addNewVendor(
                contractorVendorModel, this.props.token)
                .then(response => {
                    const data = response['data']
                    result = data['Data']
                    setTimeout(() => {
                    var id = []
                    var arr = []
                    id.push((result.Id).toString())
                    arr.push({ id: (result.Id).toString(), name: result.ContractorVendor });
                    this.setState({
                        additionalDetailModal:{
                            ...this.state.additionalDetailModal,
                            ContractorVendorsList:[...this.state.additionalDetailModal.ContractorVendorsList ,...arr]
                        }})
                        this.setState({
                            items: {
                                ...this.state.items,
                                'contractorVendorsList': [
                                    {
                                        name: 'Select Vendor Involved',
                                        id: 0,
                                        children:[...this.state.additionalDetailModal.ContractorVendorsList]
                                        
                                    }
                                ],
                            }
                        })
                        this.onSelected(id, 'contractorVendorsListSelected')
                    }, 10);
                })
                .catch(err => {
                    this.showHideSpinner(false)
                    CommonService.showErrorNotification(err.message)
                })
        } catch (error) {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(error['message'])
        }
    }
    checkUnSavedData(page,listingPage) {
        if (this.state.unSavedChanges) {
            Alert.alert(
                'Unsaved Changes',
                'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
                [
                    { text: 'Save Changes', onPress: () =>{this.validations(page,listingPage)}},
                    { text: 'Undo Changes', onPress: () =>{ this.navigationBack(page,listingPage) }},
                    {text: 'Cancel',style: 'cancel'},
                ],
                { cancelable: false }
            )
        } else this.navigationBack(page,listingPage) 
    }
    navigationBack(page,listingPage) {
        this.setState({ nextPagedialog: false })
        if (page !== 'goback') { 
            this.props.navigation.navigate(page, {listingPage:listingPage,  id: this.state.incidentId, pageName: 'AdditionalDetail', IncidentLocked: this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false, TenantIncidentId: this.state.additionalDetailModal.TenantIncidentId, }) }
        else {
            let index = this.props.navigation.dangerouslyGetParent().state.index;
            if (index > 1) {
                this.props.navigation.goBack();
            } else {
                this.props.navigation.navigate('Incident', { id: this.state.incidentId,})
            }
        }
    }
    //#endregion
    render() {
        const { spinner, nextPagedialog, items, additionalDetailModal } = this.state
        return (
            <View style={appStyles.container}>
                <HeaderView PropFunction={() => this.checkUnSavedData('goback')}
                    Title={ additionalDetailModal.TenantIncidentId ? 'Incident #' +  `${additionalDetailModal.TenantIncidentId }` :'Incident #'}
                    Pagename={'incident'}
                ></HeaderView>
                <View>
                    <Spinner
                        visible={spinner}
                        textStyle={styles.spinnerTextStyle}
                    />
                </View>
                <View style={styles.headingWrap}>
                    <Text style={{ fontSize: 30, color: '#444', textAlign: 'center' }}>
                        Additional Details
                    </Text>
                </View>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={20}
                    behavior="padding"
                    style={{ flex: 1 }}
                >
                    <SafeAreaView style={styles.container1}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView>
                                <View>
                                    {
                                        additionalDetailModal &&
                                        <View>
                                            <View style={styles.itemWrap}>
                                                <View style={styles.itemHeader}>
                                                    <Text style={styles.itemLabel}>
                                                        Was a contractor involved in this incident?
                                                    </Text>
                                                    <View style={styles.ItemHeaderBtn}>
                                                        <TouchableOpacity style={[styles.headerBtnNo, additionalDetailModal.ContractorIncident == false ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                            onPress={() =>  !(this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                                                this.setState(
                                                                    {
                                                                        additionalDetailModal: {
                                                                            ...additionalDetailModal,
                                                                            'ContractorIncident': false
                                                                        }, unSavedChanges: true
                                                                    })}>
                                                            <Text style={[styles.btnText, additionalDetailModal.ContractorIncident == false ? { color: '#fff' } : { color: '#444' }]}>No</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.headerBtnYes, additionalDetailModal.ContractorIncident ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                            onPress={() => !(this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false) && this.setState({
                                                                additionalDetailModal:
                                                                {
                                                                    ...additionalDetailModal,
                                                                    'ContractorIncident': true
                                                                },
                                                                unSavedChanges: true
                                                            })}>
                                                            <Text style={[styles.btnText, additionalDetailModal.ContractorIncident ? { color: '#fff' } : { color: '#444' }]}>Yes</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {additionalDetailModal.ContractorIncident &&
                                                    <View style={styles.itemBody}>
                                                        <View style={styles.itemFeild}>
                                                            <Text style={styles.itemLabel}>
                                                            What was their level of involvement?
                                                             </Text>
                                                            <View
                                                                style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                <View style={appStyles.multiSec}>
                                                                    {this.sectionedMultiView('changes' ,items.contractorInvolvementsList, items.contractorInvolvementSelected, "contractorInvolvementSelected", 'Choose Contractor Involvements ', true)}
                                                                </View>
                                                                <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                    <Icon name='search' color='#c9c9c9' size={30} />
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.itemFeild}>
                                                            <Text style={styles.itemLabel}>
                                                                Vendor involved
                                                            </Text>
                                                            <View
                                                                style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                <View style={appStyles.multiSec}>
                                                                    {this.sectionedMultiView('changes' ,items.contractorVendorsList, items.contractorVendorsListSelected, "contractorVendorsListSelected", 'Choose Vendor involved ', true ,true)}
                                                                </View>
                                                                <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                    <Icon name='search' color='#c9c9c9' size={30} />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    <View style={styles.itemFeild}>
                                                        <Text style={styles.itemLabel}>
                                                            Type of contractor
                                                        </Text>
                                                        <View
                                                            style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                            <View style={appStyles.multiSec}>
                                                                {this.sectionedMultiView('changes', items.contractorTypesList, items.contractorTypesListSelected, "contractorTypesListSelected", 'Choose Type of contractor ', true)}
                                                            </View>
                                                            <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                <Icon name='search' color='#c9c9c9' size={30} />
                                                            </View>
                                                        </View>

                                                    </View>
                                                    </View>
                                                }
                                            </View>

                                            <View style={styles.itemWrap}>
                                                <View style={styles.itemHeader}>
                                                    <Text style={styles.itemLabel}>
                                                        Was a vehicle involved?
                                </Text>
                                                    <View style={styles.ItemHeaderBtn}>
                                                        <TouchableOpacity style={[styles.headerBtnNo, additionalDetailModal.VehiclesInvolved == false ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                            onPress={() => !(this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false) && this.setState(
                                                                {
                                                                    additionalDetailModal: {
                                                                        ...additionalDetailModal,
                                                                        'VehiclesInvolved': false
                                                                    }, unSavedChanges: true
                                                                })}>
                                                            <Text style={[styles.btnText, additionalDetailModal.VehiclesInvolved == false ? { color: '#fff' } : { color: '#444' }]}>No</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.headerBtnYes, additionalDetailModal.VehiclesInvolved ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                            onPress={() => !(this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false) && this.setState({
                                                                additionalDetailModal:
                                                                {
                                                                    ...additionalDetailModal,
                                                                    'VehiclesInvolved': true
                                                                },
                                                                unSavedChanges: true
                                                            })}>
                                                            <Text style={[styles.btnText, additionalDetailModal.VehiclesInvolved ? { color: '#fff' } : { color: '#444' }]}>Yes</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {additionalDetailModal.VehiclesInvolved &&
                                                    <View style={styles.itemBody}>
                                                        <View style={styles.itemFeild}>
                                                            <Text style={styles.itemLabel}>
                                                                Vehicle types involved
                                       </Text>
                                                            <View
                                                                style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                <View style={appStyles.multiSec}>
                                                                    {this.sectionedMultiView('changes' , items.vehicleTypesList, items.vehicleTypesListSelected, "vehicleTypesListSelected", 'Choose Vehicle Types Involved ', false)}
                                                                </View>
                                                                <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                    <Icon name='search' color='#c9c9c9' size={30} />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                }
                                            </View>
                                            <View style={styles.itemWrap}>
                                                <View style={styles.itemHeader}>
                                                    <Text style={styles.itemLabel}>
                                                        Is this incident reportable external to the business?
                                </Text>
                                                    <View style={styles.ItemHeaderBtn}>
                                                        <TouchableOpacity style={[styles.headerBtnNo, additionalDetailModal.ReportableExt == false ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                            onPress={() =>!(this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false)&& this.setState(
                                                                {
                                                                    additionalDetailModal: {
                                                                        ...additionalDetailModal,
                                                                        'ReportableExt': false,

                                                                    }, unSavedChanges: true
                                                                })}>
                                                            <Text style={[styles.btnText, additionalDetailModal.ReportableExt == false ? { color: '#fff' } : { color: '#444' }]}>No</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.headerBtnYes, additionalDetailModal.ReportableExt ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                            onPress={() => !(this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false) && this.setState({
                                                                additionalDetailModal:
                                                                {
                                                                    ...additionalDetailModal,
                                                                    'ReportableExt': true
                                                                },
                                                                unSavedChanges: true
                                                            })}>
                                                            <Text style={[styles.btnText, additionalDetailModal.ReportableExt ? { color: '#fff' } : { color: '#444' }]}>Yes</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {additionalDetailModal.ReportableExt &&
                                                    <View style={styles.itemBody}>
                                                        <View style={styles.itemFeild}>
                                                            <Text style={styles.itemLabel}>
                                                                Reportable to
                                       </Text>
                                                            <View
                                                                style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                <View style={appStyles.multiSec}>
                                                                    {this.sectionedMultiView('changes' ,items.ReportableTosList, items.ReportableTosListSelected, "ReportableTosListSelected", 'Choose Reportable To  ', false)}
                                                                </View>
                                                                <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                    <Icon name='search' color='#c9c9c9' size={30} />
                                                                </View>
                                                            </View>
                                                        </View>




                                                        <View style={styles.itemFeild}>
                                                            <Text style={styles.itemLabel}>
                                                                Reference #
                                            </Text>
                                                            <View style={[appStyles.forfieldIcon, styles.customTextInput]}>
                                                            <TextInput
                                                                editable={items["lockedStatus"]}
                                                                value={additionalDetailModal.ReportableToReference}
                                                                style={styles.unitInput}
                                                                maxLength={100}
                                                                onChangeText={text =>
                                                                    this.setState({
                                                                        additionalDetailModal: {
                                                                            ...this.state.additionalDetailModal,
                                                                            ReportableToReference: text
                                                                        },
                                                                        unSavedChanges: true
                                                                    })
                                                                }
                                                            ></TextInput>
                                                                <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                    <Icon name='search' color='#c9c9c9' size={30} />
                                                                </View>
                                                            </View>

                                                        </View>
                                                    </View>
                                                }

                                            </View>

                                            <View style={styles.itemWrap}>
                                                <View style={styles.itemHeader}>
                                                    <Text style={styles.itemLabel}>
                                                        Was there a spill?
                                   </Text>
                                                    <View style={styles.ItemHeaderBtn}>
                                                        <TouchableOpacity style={[styles.headerBtnNo, additionalDetailModal.Spill == false ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                            onPress={() => !(this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false) && this.setState(
                                                                {
                                                                    additionalDetailModal: {
                                                                        ...additionalDetailModal,
                                                                        'Spill': false
                                                                    }, unSavedChanges: true
                                                                })}>
                                                            <Text style={[styles.btnText, additionalDetailModal.Spill == false ? { color: '#fff' } : { color: '#444' }]}>No</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.headerBtnYes, additionalDetailModal.Spill ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                            onPress={() => !(this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false) && this.setState({
                                                                additionalDetailModal:
                                                                {
                                                                    ...additionalDetailModal,
                                                                    'Spill': true
                                                                },
                                                                unSavedChanges: true
                                                            })}>
                                                            <Text style={[styles.btnText, additionalDetailModal.Spill ? { color: '#fff' } : { color: '#444' }]}>Yes</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {additionalDetailModal.Spill &&
                                                    <View style={styles.itemBody}>
                                                        <View style={styles.itemFeild}>
                                                            <Text style={styles.itemLabel}>
                                                                Spill Type
                                            </Text>

                                                            <View
                                                                style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                <View style={appStyles.multiSec}>
                                                                    {this.sectionedMultiView('changes' ,items.spillTypesList, items.spillTypesListSelected, "spillTypesListSelected", 'Choose Spill Type ', true)}
                                                                </View>
                                                                <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                    <Icon name='search' color='#c9c9c9' size={30} />
                                                                </View>
                                                            </View>
                                                        </View>

                                                        <View style={styles.itemFeild}>
                                                            <Text style={styles.itemLabel}>
                                                                Spill Cause
                                            </Text>
                                                            <View
                                                                style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                <View style={appStyles.multiSec}>
                                                                    {this.sectionedMultiView('changes' ,items.spillCausesList, items.spillCausesListSelected, "spillCausesListSelected", 'Choose Spill Cause ', true)}
                                                                </View>
                                                                <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                    <Icon name='search' color='#c9c9c9' size={30} />
                                                                </View>
                                                            </View>

                                                        </View>


                                                        <View style={styles.itemFeild}>
                                                            <Text style={styles.itemLabel}>
                                                                Spill Source
                                           </Text>

                                                            <View
                                                                style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                <View style={appStyles.multiSec}>
                                                                    {this.sectionedMultiView('changes' ,items.spillSourcesList, items.spillSourcesListSelected, "spillSourcesListSelected", 'Choose Spill Source ', true)}
                                                                </View>
                                                                <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                    <Icon name='search' color='#c9c9c9' size={30} />
                                                                </View>
                                                            </View>

                                                        </View>

                                                        <View style={styles.itemFeild}>
                                                            <View style={styles.row}>
                                                                <View style={styles.inputWrap}>
                                                                    <Text style={styles.itemLabel}>Spill Amount</Text>

                                                                    <View style={[appStyles.forfieldIcon, styles.customTextInput]}>
                                                                    <TextInput
                                                                        editable={items["lockedStatus"]}
                                                                        value={additionalDetailModal.SpillAmount &&
                                                                            (additionalDetailModal.SpillAmount).toString()
                                                                        }
                                                                        style={styles.unitInput}
                                                                        maxLength={10}
                                                                        keyboardType='numeric'
                                                                        onChangeText={text =>
                                                                            this.setState({
                                                                                additionalDetailModal: {
                                                                                    ...this.state.additionalDetailModal,
                                                                                    SpillAmount: text.replace(/[^0-9]/g, '')
                                                                                },
                                                                                unSavedChanges: true
                                                                            })
                                                                        }
                                                                    ></TextInput>
                                                                        <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                                        </View>
                                                                    </View>
                                                                </View>

                                                                <View style={styles.inputWrapTwo}>
                                                                    <Text style={styles.itemLabel}> Spill Amount Unit</Text>
                                                                    <View
                                                                        style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                        <View style={appStyles.multiSec1}>
                                                                            {this.sectionedMultiView('changes' ,items.unitOfMeasuresList, items.unitOfMeasuresListSelected1, "unitOfMeasuresListSelected1", 'Choose Unit ', true)}
                                                                        </View>
                                                                        <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>

                                                        <View style={styles.itemFeild}>
                                                            <View style={styles.row}>
                                                                <View style={styles.inputWrap}>
                                                                    <Text style={styles.itemLabel}>Amount Recovered</Text>
                                                                    <View style={[appStyles.forfieldIcon, styles.customTextInput]}>
                                                                    <TextInput
                                                                        editable={items["lockedStatus"]}
                                                                        value={additionalDetailModal.SpillAmountRecovered &&
                                                                            (additionalDetailModal.SpillAmountRecovered).toString()}
                                                                        style={styles.unitInput}
                                                                        maxLength={10}
                                                                        keyboardType='numeric'
                                                                        onChangeText={text =>
                                                                            this.setState({
                                                                                additionalDetailModal: {
                                                                                    ...this.state.additionalDetailModal,
                                                                                    SpillAmountRecovered: text.replace(/[^0-9]/g, '')
                                                                                },
                                                                                unSavedChanges: true
                                                                            })
                                                                        }
                                                                    ></TextInput>
                                                                        <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.inputWrapTwo}>
                                                                    <Text numberOfLines={1} style={styles.itemLabel}>Amount Recovered Unit</Text>
                                                                    <View
                                                                        style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                        <View style={appStyles.multiSec}>
                                                                            {this.sectionedMultiView('changes' ,items.unitOfMeasuresList, items.unitOfMeasuresListSelected2, "unitOfMeasuresListSelected2", 'Choose Unit ', true)}
                                                                        </View>
                                                                        <View style={[appStyles.fieldIcon ,{right: 10}]}>
                                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>

                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    }
                                    <View style={{ flex: 1 }} />
                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </KeyboardAvoidingView>
                <FooterView PropFunction={() => this.validations()}
                    ChoosePage={() => this.setState({ nextPagedialog: true })}
                    IncidentLocked={this.state.additionalDetailModal["IncidentLocked"] && this.props.isMobileuser == false}
                    Close={() => this.props.navigation.navigate('Incident', {
                        id: this.state.incidentId,
                    
                    })}
                ></FooterView>
                {nextPagedialog &&
                    <ChoosePageMenu ClosePage={() => this.setState({ nextPagedialog: false })} navpage='AdditionalDetailScreen'
                    newIncidentNavigationfunction={() => this.checkUnSavedData('Incident')}
                    impactDetailNavigationfunction={() =>this.checkUnSavedData('ImpactDetail')}
                    investigationDetailNavigationfunction={()=>this.checkUnSavedData('InvestigationDetail')}
                    actionNavigationfunction={() => this.checkUnSavedData('Actionlist')}
                    nextPagedialog={nextPagedialog}
                    peopleListNavigationfunction={() => this.checkUnSavedData('PeopleList' ,'PeopleList')}
                    InjuryAndIllnessListNavigationfunction={() => this.checkUnSavedData('PeopleList' ,'InjuryAndIllnessList')}
                    />
                }
            </View>

        )
    }
}
function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
        isMobileuser: state.home.isMobileUser
    }
}
export default connect(mapStateToProps)(AdditionalDetailScreen)