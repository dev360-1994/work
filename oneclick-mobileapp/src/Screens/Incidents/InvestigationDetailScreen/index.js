import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput, SafeAreaView, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Keyboard, Alert
} from 'react-native';
import { Icon } from 'react-native-elements'
import { IncidentService, CommonService } from '../../../Services'
import { HeaderView, FooterView, ChoosePageMenu, SectionedMultiView } from '../../../component/index'
import Spinner from 'react-native-loading-spinner-overlay'
import message from '../../../Utility/Message'
import SectionedMultiSelect from '../../../Custom-NodeModules/react-native-sectioned-multi-select'
import { connect } from 'react-redux'
import styles from './Style';
import appStyles from '../../../../AppStyle';
import TreeSelect from '../../../Custom-NodeModules/react-native-tree-select';
import { combineReducers } from 'redux';

class InvestigationDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageName: '',
            spinner: false,
            incidentId: '0',
            initialStop: false,
            unSavedChanges: false,
            nextPagedialog: false,
            investigationModel: {},
            items: [],
            selectedRootCauses: [],
            model: {},
        };
    }
    //#region  Methods
    UNSAFE_componentWillMount() {
        const { navigation } = this.props
        let id = navigation.state.params.id
        let pageName = navigation.state.params.pageName
        this.showHideSpinner(true)
        if (pageName !== undefined) this.setState({ pageName: pageName });
        this.setState({ incidentId: id })
        this.initializeData(id)
        this.focusListener = navigation.addListener('didFocus', () => {
            CommonService.handleAndroidBackButton(this.handleBackPress)
            this.initializeData(id)
        })
    }
    handleBackPress = () => {
        this.checkUnSavedData('goback')
        return true
    }
    initializeData = async (id) => {
        try {
            await IncidentService.investigationData(
                id,
                this.props.token,
            ).then(response => {
                const data = response['data']
                const result = data['Data']
                this.showHideSpinner(false)
                if (data['Success'] === true) {
                    var rootCauses = []
                    var rootCausesArr = []
                    var itemResult = result.Investigation.RootCauses.filter(item => item.ParentId == null);
                    rootCauses.push(...itemResult)
                    for ( var i in rootCauses) {
                        rootCausesArr.push({
                            key: (rootCauses[i].Id).toString(),
                            label: rootCauses[i].name,
                            isParent: rootCauses[i].isParent
                        })
                    }
                    this.setState({
                        model: result.Investigation,
                        investigationModel: {
                            ...this.state.investigationModel,
                            'CauseInvestigation': result.Investigation.CauseInvestigation,
                            'LessonLearnt': result.Investigation.LessonLearnt,
                            'InvestigationDetails': result.Investigation.InvestigationDetails,
                            'investigationData': result.Investigation,
                            'masterDataHazardTypes': result.Investigation.HazardTypes,
                            'IncidentLocked': result.Incident.IncidentLocked,
                            'IncidentLockedTextInput': result.Incident.IncidentLocked && this.props.isMobileuser == false ? false : true,
                            'hazardTypes':
                                [{
                                    name: 'Select Hazard Type',
                                    id: 0,
                                    children: result.HazardTypes
                                }],
                            allRootCauses: result.Investigation.RootCauses,
                            rootCauses: rootCausesArr
                        }
                    })
                    var rootItem = result.Investigation.RootCauses.filter(item => item.Checked == true);
                    if (rootItem) {
                        this.state.selectedRootCauses = []
                        for (let rootVal in rootItem) {
                            this.state.selectedRootCauses.push({
                                key: (rootItem[rootVal].Id).toString(),
                                label: rootItem[rootVal].name,
                                isLeaf: true
                            })
                            if (rootItem[rootVal].ParentId !== null) { this.addChild('data', (rootItem[rootVal].ParentId).toString()) }
                        }
                    }
                    if (result.Investigation.HazardType1ID) {
                        this.pushToArray(result.Investigation.HazardType1ID, 'hazardTypes1ID', 'hazard1', 'Hazard1ID')
                        this.pushToArray(result.Investigation.Hazard1ID, 'Hazard1ID')
                    }
                    if (result.Investigation.HazardType2ID) {
                        this.pushToArray(result.Investigation.HazardType2ID, 'hazardTypes2ID', 'hazard2', 'Hazard2ID')
                        this.pushToArray(result.Investigation.Hazard2ID, 'Hazard2ID')
                    }

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
        } finally {
            this.showHideSpinner(false)
        }
    }
    async pushToArray(value, hazardId, hazard, type) {
        var id = []
        id.push((value).toString())
        this.onSelected(id, "nochanges", hazardId, hazard, type)
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        })
    }
    validation(hazard) {
        const { investigationModel } = this.state
        if (investigationModel[hazard] == undefined || investigationModel[hazard].length < 0)
            CommonService.showErrorNotification("Please select a Hazard Type first")
    }
    onSelected = async (selectedItems, changes, hazardId, hazard, type) => {
        if (hazardId == "hazardTypes1ID" || hazardId == "hazardTypes2ID") {
            this.setState({
                investigationModel: {
                    ...this.state.investigationModel,
                    [hazardId]: selectedItems,
                    [type]: this.state.items,
                    [hazard]: this.state.items
                },
                unSavedChanges: changes === 'changes' ? true : false
            }
                , function () {
                    this.hazardlist(selectedItems, hazard, hazardId)
                });
        } else {
            this.setState({
                investigationModel: {
                    ...this.state.investigationModel,
                    [hazardId]: selectedItems,
                },
                unSavedChanges: changes === 'changes' ? true : false
            })
        }
    }
    hazardlist = async (selectedItems, hazard, hazardId) => {
        var Hazards = []
        const { investigationModel } = this.state
        var item = investigationModel.masterDataHazardTypes.find(item => item.HazardTypeID === parseInt(selectedItems[0]));
        for (var i in item.Hazards) {
            Hazards.push({
                id: (item.Hazards[i].HazardID).toString(),
                name: item.Hazards[i].HazardName
            })
        }
        this.setState({
            investigationModel: {
                ...investigationModel,
                [hazardId]: selectedItems,
                [hazard]:
                    [{
                        name: 'Select Hazards',
                        id: 0,
                        children: Hazards
                    }],
            }
        })
        this.showHideSpinner(false)
    }
    checkUnSavedData(page ,listingPage) {
        if (this.state.unSavedChanges) {
            Alert.alert(
                'Unsaved Changes',
                'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
                [
                    { text: 'Save Changes', onPress: () =>{this.saveInvestigation(page ,listingPage)}},
                    { text: 'Undo Changes', onPress: () =>{  this.navigationBack(page ,listingPage) }},
                    {text: 'Cancel',style: 'cancel'},
                ],
                { cancelable: false }
            )
        } else this.navigationBack(page ,listingPage)
    }
    navigationBack(page ,listingPage) {
        this.setState({ nextPagedialog: false })
        if (page !== 'goback') {
            this.props.navigation.navigate(page, {listingPage:listingPage,  id: this.state.incidentId, pageName: 'InvestigationDetail', IncidentLocked: this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false, TenantIncidentId: this.props.navigation.state.params.TenantIncidentId, })
        }
        else {
            let index = this.props.navigation.dangerouslyGetParent().state.index;
            if (index > 1) {
                this.props.navigation.goBack();
            } else {
             this.props.navigation.navigate('Incident', { id: this.state.incidentId, })
            }
        }
    }
    onComfirm(value) { this.setState({ selectedRootCauses: value }) }
    onClose() {
    }
    valuedata(value) {
    }
    addChild(value, key) {
        var rootCauses = []
        var rootCausesArr = []
        const { investigationModel } = this.state
        var item = investigationModel.allRootCauses.filter(item => item.ParentId == key);
        rootCauses.push(...item)
        for (var i in rootCauses) {
            rootCausesArr.push({
                key: (rootCauses[i].Id).toString(),
                label: rootCauses[i].name,
                isParent: rootCauses[i].isParent
            })
        }
        this.getParent(investigationModel.rootCauses, key, rootCausesArr)
        this.setState({ va: true })
    }
    getParent(root, id, data) {
        var i, node;
        for (var i = 0; i < root.length; i++) {
            node = root[i];
            if (node.key === id || node.children && (node = this.getParent(node.children, id, data))) {
                root[i].children = []
                root[i].children.push(...data)
            }
        }
        return null;
    }
    saveInvestigation = async (page ,listingPage) => {
        var investigationModelvalues = []
        const { investigationModel, selectedRootCauses, model, incidentId } = this.state
        if (investigationModel['hazardTypes1ID'] == undefined || investigationModel['hazardTypes1ID'].length == 0) {
            CommonService.showErrorNotification("Hazard type 1 is required.")
        }
        else if (investigationModel['Hazard1ID'] == undefined || investigationModel['Hazard1ID'].length == 0) {
            CommonService.showErrorNotification("Hazard 1 is required.")
        }
        else {  
            this.showHideSpinner(true)
            var bindRootCauses = []
            var bindPreCauses = []
            for ( var index in model.RootCauses) {
                var findIndex = selectedRootCauses.findIndex(x => x.key == model.RootCauses[index].Id);
                if (findIndex > -1) {
                    bindRootCauses.push({
                        Id: model.RootCauses[index].Id,
                        name: model.RootCauses[index].name,
                        ParentId: model.RootCauses[index].ParentId,
                        isParent: model.RootCauses[index].isParent,
                        IncidentID: model.RootCauses[index].IncidentID,
                        Checked: true,
                        IncidentRootCauseID: model.RootCauses[index].IncidentRootCauseID,
                        IsMobileData : true
                    })
                }
            }
            var preCausesItem = model.RootCauses.filter(item => item.Checked == true);
            bindPreCauses = preCausesItem

            investigationModelvalues.push({
                InvestionID: model.InvestionID,
                IncidentID: model.IncidentID,
                InvestigationDetails: investigationModel['InvestigationDetails'],
                HazardType1ID: parseInt(investigationModel['hazardTypes1ID'][0]),
                Hazard1ID: parseInt(investigationModel['Hazard1ID'][0]),
                HazardType2ID: investigationModel['hazardTypes2ID'] == undefined || investigationModel['hazardTypes2ID'].length == 0 ? model.HazardType2ID : parseInt(investigationModel['hazardTypes2ID'][0]),
                Hazard2ID: investigationModel['Hazard2ID'] == undefined || investigationModel['Hazard2ID'].length == 0 ? model.Hazard2ID : parseInt(investigationModel['Hazard2ID'][0]),
                LessonLearnt: investigationModel['LessonLearnt'],
                CauseInvestigation: investigationModel['CauseInvestigation'] ? 1 : 0,
                RootCauses:investigationModel['CauseInvestigation'] == false ?model.RootCauses: bindRootCauses,
                PreCauses: bindPreCauses,
                IsMobileData : true
            })
            try {
                await IncidentService.addUpdateinvestigation(
                    ...investigationModelvalues,
                    this.props.token,
                ).then(response => {
                    const data = response['data']
                    const result = data['Data']
                    if (data['Success'] == true) {
                        this.showHideSpinner(false)
                        CommonService.showSuccessNotification("Incident Investigation details is successfully updated ")
                        page !== undefined ? this.navigationBack(page ,listingPage):
                        this.props.navigation.navigate('Incident', {
                            id: this.state.incidentId
                        })
                    } else {
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
            } finally {
                this.showHideSpinner(false)
            }
        }
    }
    sectionedMultiView = (items, selectedItem, selectText, single, hazardId, hazard, type) => {
        return (
            <SectionedMultiSelect
                chipRemoveIconComponent={this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false}
                disabled={this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false}
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
                searchPlaceholderText={ hazardId == "hazardTypes1ID" || hazardId == "hazardTypes2ID" ? "Search hazard types" : "Search hazards"}
                onSelectedItemsChange={(selectedItems) => this.onSelected(selectedItems, 'changes', hazardId, hazard, type)}
                selectedItems={selectedItem}
                styles={
                    this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false ?
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
    //#endregion
    render() {
        const { spinner, nextPagedialog, investigationModel, selectedRootCauses } = this.state
        const { navigation } = this.props
        return (
            <View style={appStyles.container}>
                <HeaderView PropFunction={() => this.checkUnSavedData('goback')}
                    Title={navigation.state.params.TenantIncidentId ? 'Incident #' + `${navigation.state.params.TenantIncidentId}` : 'Incident #'}
                    Pagename={'incident'}
                ></HeaderView>
                <View style={styles.spinnercontainer}>
                    <Spinner
                        visible={spinner}
                        textStyle={styles.spinnerTextStyle}
                    />
                </View>
                <View style={styles.headingWrap}>
                    <Text style={{ fontSize: 30, color: '#444', textAlign: 'center' }}>
                        Investigation Details
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
                                <View >
                                    <View style={styles.itemWrap}>
                                        <View style={styles.itemHeader}>
                                            <Text style={styles.itemLabel}>
                                                Provide a description of the investigation that was undertaken
                                             </Text>
                                            <View style={[styles.itemFeild, {paddingHorizontal:16}]}>
                                                
                                                
                                                <TextInput
                                                multiline={true}
                                                    editable={investigationModel["IncidentLockedTextInput"]}
                                                    value={investigationModel['InvestigationDetails']}
                                                    style={styles.descriptionInput}
                                                    maxLength={100}
                                                    onChangeText={text =>
                                                        this.setState({
                                                            investigationModel: {
                                                                ...this.state.investigationModel,
                                                                InvestigationDetails: text
                                                            },
                                                            unSavedChanges: true
                                                        })
                                                    }
                                                ></TextInput>
                                            </View>
                                        </View>
                                    </View>

                                       <View style={styles.itemWrap}>
                                        {/* <Text style={styles.itemLabel}>Hazard 1</Text> */}
                                        <View style={styles.itemFeild}>
                                            <View >
                                                <View style={styles.inputWrap}>
                                                    <Text style={styles.itemLabel}>Hazard 1 Type</Text>
                                                    <View
                                                        style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                        <View style={appStyles.multiSec}>
                                                            {this.sectionedMultiView(investigationModel['hazardTypes'], investigationModel['hazardTypes1ID'], 'Choose Hazard 1 Type', true, 'hazardTypes1ID', 'hazard1', 'Hazard1ID')}
                                                        </View>
                                                        <View style={appStyles.fieldIcon}>
                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.inputWrapTwo}>
                                                    <Text style={styles.itemLabel}>Hazard 1</Text>
                                                    <TouchableWithoutFeedback onPress={() =>
                                                        !(this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false) &&
                                                        this.validation('hazardTypes1ID')}>
                                                        {
                                                            investigationModel['hazardTypes1ID'] == undefined || investigationModel['hazardTypes1ID'].length < 0 ?
                                                                <View style={styles.unitInputWrap} >
                                                                    <View style={[styles.unitInput, styles.forfieldIcon]}>
                                                                        <Text >Choose Hazard 1</Text>
                                                                        <View style={styles.fieldIcon}>
                                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                                        </View>
                                                                    </View>

                                                                </View>
                                                                :
                                                                <View
                                                                    style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                    <View style={appStyles.multiSec}>
                                                                        {this.sectionedMultiView(investigationModel['hazard1'], investigationModel['Hazard1ID'], 'Choose Hazard 1', true, 'Hazard1ID',)}

                                                                    </View>
                                                                    <View style={appStyles.fieldIcon}>
                                                                        <Icon name='search' color='#c9c9c9' size={30} />
                                                                    </View>
                                                                </View>
                                                        }
                                                    </TouchableWithoutFeedback>
                                                </View>
                                            </View>
                                        </View>
                                        {/* <Text style={styles.itemLabel}>Hazard 2</Text> */}
                                        <View style={styles.itemFeild}>
                                            <View >
                                                <View style={styles.inputWrap}>
                                                    <Text style={styles.itemLabel}>Hazard 2 Type</Text>
                                                    <View
                                                        style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                        <View style={appStyles.multiSec}>
                                                            {this.sectionedMultiView(investigationModel['hazardTypes'], investigationModel['hazardTypes2ID'], 'Choose Hazard 2 Type', true, 'hazardTypes2ID', 'hazard2', 'Hazard2ID')}
                                                        </View>
                                                        <View style={appStyles.fieldIcon}>
                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={styles.inputWrapTwo}>
                                                    <Text style={styles.itemLabel}>Hazard 2</Text>
                                                    <TouchableWithoutFeedback onPress={() =>
                                                        !(this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false) &&
                                                        this.validation('hazardTypes2ID')}>
                                                        {
                                                            investigationModel['hazardTypes2ID'] == undefined || investigationModel['hazardTypes2ID'].length < 0 ?
                                                                <View style={styles.unitInputWrap} >
                                                                    <View style={[styles.unitInput, styles.forfieldIcon]}>
                                                                        <Text >Choose Hazard 2</Text>
                                                                        <View style={styles.fieldIcon}>
                                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                                        </View>
                                                                    </View>

                                                                </View>
                                                                :
                                                                <View
                                                                    style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                                    <View style={appStyles.multiSec}>
                                                                        {this.sectionedMultiView(investigationModel['hazard2'], investigationModel['Hazard2ID'], 'Choose Hazard 2', true, 'Hazard2ID')}
                                                                    </View>
                                                                    <View style={appStyles.fieldIcon}>
                                                                        <Icon name='search' color='#c9c9c9' size={30} />
                                                                    </View>
                                                                </View>
                                                        }
                                                    </TouchableWithoutFeedback>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.itemWrap}>
                                        <View style={styles.itemHeader}>
                                            <Text style={styles.itemLabel}>
                                                What lessons have been learned to prevent a similar incident from occuring
                                </Text>
                                            <View style={[styles.itemFeild, { paddingHorizontal: 16 }]}>
                                                <TextInput
                                                    multiline={true}
                                                    scrollEnabled={false}
                                                    editable={investigationModel["IncidentLockedTextInput"]}
                                                    value={investigationModel.LessonLearnt}
                                                    style={styles.descriptionInput}
                                                    maxLength={100}
                                                    onChangeText={text =>
                                                        this.setState({
                                                            investigationModel: {
                                                                ...this.state.investigationModel,
                                                                LessonLearnt: text
                                                            },
                                                            unSavedChanges: true
                                                        })
                                                    }
                                                ></TextInput>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.itemWrap}>
                                        <View style={styles.itemHeader}>
                                            <Text style={styles.itemLabel}>Have you carried out a Root  Cause Investigation</Text>
                                            <View style={styles.ItemHeaderBtn}>
                                                <TouchableOpacity style={[styles.headerBtnNo, investigationModel.CauseInvestigation == false ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                    onPress={() => !(this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false) && this.setState(
                                                        {
                                                            investigationModel: {
                                                                ...this.state.investigationModel,
                                                                CauseInvestigation: false
                                                            },
                                                            unSavedChanges: true
                                                        })}>
                                                    <Text style={[styles.btnText, investigationModel.CauseInvestigation == false ? { color: '#fff' } : { color: '#444' }]}>No</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.headerBtnYes, investigationModel.CauseInvestigation ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                    onPress={() => !(this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false) && this.setState({
                                                        investigationModel: {
                                                            ...this.state.investigationModel,
                                                            CauseInvestigation: true
                                                        },
                                                        unSavedChanges: true
                                                    })}>
                                                    <Text style={[styles.btnText, investigationModel.CauseInvestigation ? { color: '#fff' } : { color: '#444' }]}>Yes</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {investigationModel.CauseInvestigation && <View style={styles.itemBody}>
                                            <View style={styles.itemFeild}>
                                                <View style={styles.row}>
                                                    <View style={styles.inputWrap}>
                                                        <Text style={styles.itemLabel}>Root Cause</Text>
                                                            <TouchableWithoutFeedback onPress={() =>
                                                                !(this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false) &&
                                                                this.treeSelectRef.open()}>
                                                                <View style={styles.filterWrap} >
                                                                    {
                                                                        selectedRootCauses.map(function (item, index) {
                                                                            return (
                                                                                <View key={index} style={styles.filterChip}>
                                                                                <Text numberOfLines={1} style={styles.filterText}>{item.label}</Text>
                                                                                
                                                                                <Icon
                                                                                name="close"
                                                                                size={20}
                                                                                color="#ffffff"
                                                                                />
                                                                               
                                                                            </View> 
                                                                            )
                                                                        })
                                                                    }
                                                                </View>
                                                            </TouchableWithoutFeedback>                                            
                                                    </View>
                                                </View>
                                            </View>
                                        </View>}
                                    </View>
                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </KeyboardAvoidingView>
                {investigationModel.rootCauses &&
                    <TreeSelect
                        ref={node => this.treeSelectRef = node}
                        onComfirm={(value) => { this.onComfirm(value) }}
                        onClose={() => this.onClose()}
                        valuedata={(value) => { this.valuedata(value) }}
                        treeData={investigationModel.rootCauses}
                        value={selectedRootCauses}
                        onlyCheckLeaf={true}
                        multiple={true}
                        addChild={(val, key) => this.addChild(val, key)}
                        spinner={spinner}
                    />}
                <FooterView PropFunction={() => { this.saveInvestigation() }}
                    ChoosePage={() => this.setState({ nextPagedialog: true })}
                    IncidentLocked={this.state.investigationModel["IncidentLocked"] && this.props.isMobileuser == false}
                    Close={() => this.props.navigation.navigate('Incident', {
                        id: this.state.incidentId
                    })}
                ></FooterView>
                {nextPagedialog &&
                    <ChoosePageMenu ClosePage={() => this.setState({ nextPagedialog: false })} navpage='InvestigationDetailScreen'
                        newIncidentNavigationfunction={() => this.checkUnSavedData('Incident')}
                        additionalDetailNavigationfunction={() => this.checkUnSavedData('AdditionalDetail')}
                        actionNavigationfunction={() => this.checkUnSavedData('Actionlist')}
                        impactDetailNavigationfunction={() => this.checkUnSavedData('ImpactDetail')}
                        peopleListNavigationfunction={() => this.checkUnSavedData('PeopleList' ,'PeopleList')}
                        InjuryAndIllnessListNavigationfunction={() => this.checkUnSavedData('PeopleList' ,'InjuryAndIllnessList')}
                        nextPagedialog={nextPagedialog}
                    />
                }

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
        isMobileuser: state.home.isMobileUser

    }
}
export default connect(mapStateToProps)(InvestigationDetailScreen)      