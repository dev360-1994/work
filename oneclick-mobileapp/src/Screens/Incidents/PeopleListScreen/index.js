import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Icon } from 'react-native-elements'
import { IncidentService, CommonService } from '../../../Services'
import { HeaderView, FooterView, ChoosePageMenu } from '../../../component/index'
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import styles from './Style';
import moment from 'moment';
import appStyles from '../../../../AppStyle';
class PeopleListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            unSavedChanges: false,
            pageName: '',
            nextPagedialog: false,
            involvedPersonList: [],
            InvolvedPersons: {},
            emptyitem: [],
            permission: false,
            injuryAndIllnessUserlist: [],
            IncidentLocked: '',
            showPeopleListData: true
        }
    }
    //#region Methods
    UNSAFE_componentWillMount() {
        const { navigation } = this.props
        let id = navigation.state.params.id
        let pageName = navigation.state.params.pageName
        if (pageName !== undefined) this.setState({ pageName: pageName, listingPage: navigation.state.params.listingPage })
        this.setState({ incidentId: id })
        this.focusListener = navigation.addListener('willFocus', async (data) => {
            this.showHideSpinner(true)
            let values = data.action.params !== undefined ? data.action : data.lastState
            this.setState({ incidentId: values.params.id, showPeopleListData: data.action.params == undefined ? true : false })
            this.screenIntialize(values.params.id, values.params.listingPage)
            CommonService.handleAndroidBackButton(this.handleBackPress)
        })
    }
    componentWillUnmount() {
        this.focusListener.remove();
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
    async screenIntialize(id, listingPage, checkunsavedata) {
        if (listingPage == 'PeopleList') {
            this.setState({ listingPage: listingPage, nextPagedialog: false, involvedPersonList: this.state.emptyitem, injuryAndIllnessUserlist: this.state.emptyitem })
            this.showHideSpinner(true)
            this.getInvolvedPersonList(id)
        } else {
            if (checkunsavedata === 'checkunsavedata') {
                this.checkUnSavedData("page", id, listingPage, checkunsavedata)
            }
            else {
                this.showHideSpinner(true)
                this.injuryAndIllnessUserlist(id)
            }
        }

    }
    async getInvolvedPersonList(id) {
        const { navigation } = this.props
        this.showHideSpinner(true)
        try {
            await IncidentService.getInvolvedPersonList(id, this.props.token)
                .then(response => {
                    const result = response['data']
                    const data = result['Data']
                    if (result['Success'] === true) {
                        this.setState({ InvolvedPersons: result['Data'], involvedPersonList: [...this.state.involvedPersonList, ...data['IncidentInvolvedUsersModel']], isLoading: false })
                        let peopleArray = navigation.state.params.peopleArray
                        let condition = navigation.state.params.condition
                        if (peopleArray !== undefined && !(this.state.showPeopleListData)) {
                            if (condition !== undefined) {
                                if (condition == '1') {
                                    this.setState({ involvedPersonList: [...peopleArray], isLoading: false, unSavedChanges: true })
                                }
                                else if (condition == '2') {
                                    this.setState({ involvedPersonList: [...peopleArray], isLoading: false })
                                }
                                else {
                                    this.setState({ involvedPersonList: [...peopleArray], isLoading: false, unSavedChanges: true })
                                    // this.state.involvedPersonList.push(...peopleArray)
                                }
                            }
                        }
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
    injuryAndIllnessUserlist = async (id) => {
        this.showHideSpinner(true)
        try {
            await IncidentService.injuryAndIllnessUserlist(
                id,
                this.props.token,
            ).then(response => {
                const data = response['data']
                const result = response.data.Data.InjuryViewData
                if (data['Success'] === true) {
                    this.setState({ permission: response.data.Data.Permission, IncidentLocked: result.Incident.IncidentLocked, injuryAndIllnessUserlist: [...result['InjuredUsers']], isLoading: false, unSavedChanges: false })
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

    validateIfDuplicateInvolvedPersons = async (page, id, listingPage) => {
        this.setState({ nextPagedialog: false })
        const { involvedPersonList } = this.state
        var count = 0;
        var count1 = 0;
        for (let obj in involvedPersonList) {
            if (!involvedPersonList[obj].IsDeleted) {
                var userId = involvedPersonList[obj].UserID;
                var roleId = involvedPersonList[obj].InvolvedUserRoleID;
                for (let obj1 in this.state.involvedPersonList) {
                    if (userId == involvedPersonList[obj1].UserID && roleId == involvedPersonList[obj1].InvolvedUserRoleID && userId != 0 && roleId != 0 && !involvedPersonList[obj].IsDeleted) {
                        count += 1;
                    }
                    if ((involvedPersonList[obj].UserName) == (involvedPersonList[obj1].UserName) && roleId == involvedPersonList[obj1].InvolvedUserRoleID && roleId != 0 && !involvedPersonList[obj].IsDeleted) {
                        count1 += 1;
                    }
                }
            }
        }
        if (count > this.state.involvedPersonList.length || count1 > this.state.involvedPersonList.length) {
            CommonService.showErrorNotification('You cannot have Involved People with the same role & name')
        } else {
            if (involvedPersonList.length > 0) {
                var IncidentInvolvedUsers = []
                for (let index in involvedPersonList) {
                    IncidentInvolvedUsers.push({
                        IncidentInvolvedUserID: involvedPersonList[index].IncidentInvolvedUserID,
                        IncidentID: involvedPersonList[index].IncidentID,
                        InvolvedUserRoleID: involvedPersonList[index].InvolvedUserRoleID,
                        UserID: involvedPersonList[index].UserID,
                        IsUser: involvedPersonList[index].IsUser,
                        UserName: involvedPersonList[index].UserName,
                        IsInjuredIll: involvedPersonList[index].IsInjuredIll,
                        IsDeleted: involvedPersonList[index].IsDeleted,
                    })
                }
                this.state.InvolvedPersons['IncidentInvolvedUsersModel'] = IncidentInvolvedUsers
                this.save(page, id, listingPage);
            } else {
                this.save(page, id, listingPage);
            }
        }
    };
    save = async (page, id, listingPage) => {
        this.showHideSpinner(true)
        try {
            await IncidentService.addInvolvedPerson(this.state.InvolvedPersons, this.props.token)
                .then(response => {
                    const result = response['data']
                    if (result['Success'] === true) {
                        this.setState({ nextPagedialog: false, unSavedChanges: false,showPeopleListData:true })
                        CommonService.showSuccessNotification("Incident People are successfully updated")
                        this.showHideSpinner(false)
                        page !== undefined ? page == 'page' ? this.showinjuryAndIllnessUserlist(id, listingPage) : this.navigationBack(page) :
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
        } catch (error) {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(error.Message)
        }

    }
    removeInvolvedPersonAlert = async (index, obj) => {
        Alert.alert(
            'Unsaved Changes',
            'Do you want to delete this person?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                { text: 'OK', onPress: () => this.removeInvolvedPerson(index, obj) }
            ],
            { cancelable: false }
        )
    }
    removeInvolvedPerson = async (index, obj) => {
        const { involvedPersonList } = this.state
        if (obj.IncidentInvolvedUserID != 0) {
            for (let i in involvedPersonList) {
                if (parseInt(index) == i) {
                    involvedPersonList[parseInt(index)] = {
                        IncidentID: obj.IncidentID,
                        IncidentInvolvedUserID: obj.IncidentInvolvedUserID,
                        InvolvedUserRoleID: obj.InvolvedUserRoleID,
                        InvolvedUserRoleName: obj.InvolvedUserRoleName,
                        IsDeleted: true,
                        IsInjuredIll: obj.IsInjuredIll,
                        IsUser: obj.IsUser,
                        UserID: obj.UserID,
                        UserName: obj.UserName,
                    }
                }
                this.setState({ unSavedChanges: true })
            }
        }
        else {
            const arr = this.state.involvedPersonList;
            arr.splice(index, 1)
            this.setState({ involvedPersonList: arr })
        }
    }
    deleteInjuryAndIllnessAlert = async (InjuredIllID) => {
        Alert.alert(
            'Delete Injured Person Detail',
            'Are you sure you want to delete this Injured User?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                { text: 'OK', onPress: () => this.deleteInjuryAndIllness(InjuredIllID) }
            ],
            { cancelable: false }
        )

    }
    deleteInjuryAndIllness = async (InjuredIllID) => {
        this.showHideSpinner(true)
        try {
            await IncidentService.deleteInjuryAndIllness(
                InjuredIllID,
                this.state.incidentId,
                this.props.token,
            ).then(response => {
                if (response.data.Success === true) {
                    CommonService.showSuccessNotification(response.data.Data.Message)
                    this.injuryAndIllnessUserlist(this.state.incidentId)
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
    renderItem({ item, index }) {
        const { listingPage } = this.state
        const { navigation, isMobileuser } = this.props
        var PDIStartDate = null
        if (item.PDIStartDate !== null) {
            PDIStartDate = moment(item.PDIStartDate).format('DD-MMM-YYYY');
        }
        var permission = this.state.permission && !isMobileuser ? true : false
        var check = listingPage == 'PeopleList' ? item.IsDeleted == false : true
        return (
            <View style={index % 2 == 0 ? styles.resultList : styles.secondResult}>
                {check && <View style={styles.pListWrap}>
                    <View style={styles.pListItem}>
                        <TouchableOpacity style={styles.pListInfo} onPress={() =>
                            listingPage == 'PeopleList' ?
                                !(this.state.InvolvedPersons["IncidentLocked"] && this.props.isMobileuser == false) &&
                                this.props.navigation.navigate('AddPeople', { id: this.state.incidentId, pageName: this.state.pageName, peopleArray: this.state.involvedPersonList, index: index, TenantIncidentId: this.state.InvolvedPersons.TenantIncidentId }) :
                                this.props.navigation.navigate('InjuryAndIllnessDetail', { id: this.state.incidentId, pageName: this.state.pageName, IncidentLocked: this.state.IncidentLocked && this.props.isMobileuser == false, TenantIncidentId: navigation.state.params.TenantIncidentId, InjuryAndIllnessId: item.InjuredIllID })

                        } >
                            {listingPage == 'PeopleList' ? <Text style={styles.roleText}>{item.InvolvedUserRoleName}</Text> : <Text style={styles.roleText}>{!permission && item.UserName} - {item.EmployeeType}</Text>}
                            {listingPage == 'InjuryAndIllnessList' && <Text style={styles.personeName}>{item.Category} </Text>}
                            {listingPage == 'PeopleList' ? <Text style={styles.personeName}>{item.UserName} </Text> :
                                item.PDIStartDate !== null && <Text style={styles.personeName}>Perm. Damage Start Date - {PDIStartDate}</Text>
                            }
                            {listingPage == 'InjuryAndIllnessList' && <View >
                                {item.IsClosed == "Yes" ? <Text style={[styles.personeName, styles.colorGreen]}>Case Closed</Text> :
                                    <Text style={[styles.personeName, styles.colorRed]}>Case Open</Text>}</View>}
                        </TouchableOpacity>
                        {!permission && <View style={styles.pListAction}>
                            <TouchableOpacity
                                onPress={() =>
                                    listingPage == 'PeopleList' ?
                                        !(this.state.InvolvedPersons["IncidentLocked"] && this.props.isMobileuser == false) &&
                                        this.removeInvolvedPersonAlert(index, item) :
                                        !(this.state.IncidentLocked && this.props.isMobileuser == false) &&
                                        this.deleteInjuryAndIllnessAlert(item.InjuredIllID)
                                }
                            >
                                <Icon name="trash-o" size={22} type="font-awesome" color="#000" />
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>}
            </View>
        )
    }
    ListEmptyView() {
        const { listingPage } = this.state
        return (
            <View><Text style={{ fontSize: 16, color: "#d1d1d1", textAlign: "center", paddingVertical: 20 }}>
                {listingPage !== undefined && listingPage == 'InjuryAndIllnessList' && "No injuries, illnesses or fatalities have been entered."}
            </Text></View>
        );
    }
    checkUnSavedData(page, id, listingPage, checkunsavedata) {
        if (this.state.unSavedChanges) {
            this.state.unSavedChanges = false
            Alert.alert(
                'Unsaved Changes',
                'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
                [
                    {
                        text: 'Save Changes', onPress: () => {
                            this.state.listingPage == 'PeopleList' ?
                                this.validateIfDuplicateInvolvedPersons(page, id, listingPage) : this.props.navigation.navigate('Incident', { id: this.state.incidentId, })
                        }
                    },
                    { text: 'Undo Changes', onPress: () => checkunsavedata === 'checkunsavedata' ? this.showinjuryAndIllnessUserlist(id, listingPage) : this.navigationBack(page) },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => this.setState({ nextPagedialog: false })
                    },

                ],
                { cancelable: false }
            )
        } else checkunsavedata === 'checkunsavedata' ? this.showinjuryAndIllnessUserlist(id, listingPage) : this.navigationBack(page)
    }
    navigationBack(page) {
        const { navigation } = this.props
        this.setState({ nextPagedialog: false, unSavedChanges: false })
        this.state.unSavedChanges = false
        if (page !== 'goback') {
            this.props.navigation.navigate(page, { id: this.state.incidentId, pageName: 'PeopleList', IncidentLocked: this.state.InvolvedPersons["IncidentLocked"] && this.props.isMobileuser == false, TenantIncidentId: this.state.InvolvedPersons.TenantIncidentId, condition: undefined })
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
    showinjuryAndIllnessUserlist(id, listingPage) {
        this.setState({ listingPage: listingPage, nextPagedialog: false, involvedPersonList: this.state.emptyitem, injuryAndIllnessUserlist: this.state.emptyitem }, function () { this.injuryAndIllnessUserlist(id) })
    }
    //#endregion
    render() {
        const { spinner, nextPagedialog, incidentId, InvolvedPersons, IncidentLocked, listingPage, injuryAndIllnessUserlist } = this.state
        const { navigation, isMobileuser } = this.props
        var permission = this.state.permission && !isMobileuser ? true : false
        return (
            <View style={appStyles.container}>
                <HeaderView PropFunction={() => this.checkUnSavedData('goback')}
                    Title={navigation.state.params.TenantIncidentId ? 'Incident #' + `${navigation.state.params.TenantIncidentId}` : 'Incident #'}
                    Pagename={'incident'}
                ></HeaderView>
                <View style={{ flex: 1 }} >
                    <View>
                        <Spinner
                            visible={spinner}
                            textStyle={styles.spinnerTextStyle}
                        />
                    </View>
                    <View style={styles.headingWrap}>
                        <Text style={{ fontSize: 30, color: '#444', textAlign: 'center' }}>
                            {listingPage == 'PeopleList' ? 'People' : 'Injuries & Illnesses'}
                        </Text>
                    </View>
                    {!permission && <View style={styles.addpeopleWap}>
                        {listingPage == 'PeopleList' && <Text style={styles.label}>
                            Add all the people that had an involvement in this incident
</Text>}
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', }}>
                            <TouchableOpacity style={styles.addpeopleBtn} onPress={() =>
                                listingPage == 'PeopleList' ?
                                    !(this.state.InvolvedPersons["IncidentLocked"] && this.props.isMobileuser == false) &&
                                    this.props.navigation.navigate('AddPeople', { listingPage: 'PeopleList', id: this.state.incidentId, pageName: this.state.pageName, peopleArray: this.state.involvedPersonList, TenantIncidentId: InvolvedPersons.TenantIncidentId })

                                    : !(this.state.IncidentLocked && this.props.isMobileuser == false) &&
                                    this.props.navigation.navigate('InjuryAndIllnessDetail', { listingPage: 'InjuryAndIllnessList', id: incidentId, pageName: this.state.pageName, IncidentLocked: IncidentLocked && this.props.isMobileuser == false, TenantIncidentId: navigation.state.params.TenantIncidentId })

                            }>
                                <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center' }}>
                                    {listingPage == 'PeopleList' ? 'Add Person' : 'Add Injured & ill Person'}

                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    }
                    <FlatList
                        style={{ backgroundColor: '#FFF' }}
                        data={listingPage == 'PeopleList' ? this.state.involvedPersonList : injuryAndIllnessUserlist}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={this.ListEmptyView.bind(this)}
                    />
                </View>
                <FooterView
                    PropFunction={() =>
                        listingPage == 'PeopleList' ?
                            this.validateIfDuplicateInvolvedPersons() : this.props.navigation.navigate('Incident', { id: this.state.incidentId, })}
                    ChoosePage={() => this.setState({ nextPagedialog: true })}
                    IncidentLocked={listingPage == 'PeopleList' ?
                        this.state.InvolvedPersons["IncidentLocked"] && this.props.isMobileuser == false
                        : this.state.IncidentLocked && this.props.isMobileuser == false
                    }
                    Close={() => this.props.navigation.navigate('Incident', {
                        id: this.state.incidentId
                    })}
                    permission={permission}
                />
                {
                    nextPagedialog &&
                    <ChoosePageMenu ClosePage={() => this.setState({ nextPagedialog: false })} navpage={listingPage == 'PeopleList' ? 'PeopleListScreen' : 'InjuryAndIllnessListScreen'}
                        newIncidentNavigationfunction={() => this.checkUnSavedData('Incident')}
                        additionalDetailNavigationfunction={() => this.checkUnSavedData('AdditionalDetail')}
                        impactDetailNavigationfunction={() => this.checkUnSavedData('ImpactDetail')}
                        investigationDetailNavigationfunction={() => this.checkUnSavedData('InvestigationDetail')}
                        actionNavigationfunction={() => this.checkUnSavedData('Actionlist')}
                        nextPagedialog={nextPagedialog}
                        peopleListNavigationfunction={() => this.screenIntialize(incidentId, 'PeopleList')}
                        InjuryAndIllnessListNavigationfunction={() => this.screenIntialize(incidentId, 'InjuryAndIllnessList', 'checkunsavedata')}
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
export default connect(mapStateToProps)(PeopleListScreen)