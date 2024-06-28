import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Modal, TouchableWithoutFeedback, Keyboard, FlatList, Platform } from 'react-native';
import { IncidentService, CommonService } from '../../../Services'
import { HeaderView, FooterView, ChoosePageMenu, DatePicker ,SearchPeopleModal} from '../../../component/index'
import Spinner from 'react-native-loading-spinner-overlay'
import { Icon, CheckBox, Overlay } from 'react-native-elements'
import moment from 'moment';
import message from '../../../Utility/Message'
import { connect } from 'react-redux'
import SectionedMultiSelect from '../../../Custom-NodeModules/react-native-sectioned-multi-select'
import styles from './Style';
import appStyles from '../../../../AppStyle';
class InjuryAndIllnessDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false,
            visible: false,
            addClassification: false,
            spinner: false,
            unSavedChanges: false,
            nextPagedialog: false,
            searchdata: [],
            injuryAndIllnessModal: { injuredUserModel: { showView1: true, showView2: true }, selectedInjuryTypeId: "", },
            InjuryType: { "Injury": 1, "Illness": 2, "Fatality": 3 },
            items: [],
            maxDate: new Date(),
        }
    }
    //#region  Methods
    UNSAFE_componentWillMount() {
        const { navigation } = this.props
        this.setState({ incidentId: navigation.state.params.id })
        let IncidentLocked = navigation.state.params.IncidentLocked
        if (IncidentLocked !== undefined) this.setState({ IncidentLocked: IncidentLocked });
        this.screenIntialize(navigation.state.params.id, navigation.state.params.InjuryAndIllnessId)
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
    screenIntialize(incidentId, InjuryAndIllnessId) {
        this.setState({ incidentId: incidentId })
        this.showHideSpinner(false)
        if (InjuryAndIllnessId > 0) {
            this.getInjuryAndIllnessById(incidentId, InjuryAndIllnessId)
        } else {
            this.initializedata(incidentId)
        }
    }
    initializedata = async (incidentId) => {
        this.showHideSpinner(true)
        try {
            await IncidentService.injuryAndIllnessIntialize(
                incidentId, this.props.token,
            ).then(response => {
                const data = response['data']
                const result = data['Data']
                if (data['Success'] === true) {
                    this.setState({
                        injuryAndIllnessModal: {
                            ...this.state.injuryAndIllnessModal,
                            'EmployementTypes': response.data.Data.EmployementTypes,
                            'Categories': response.data.Data.Categories,
                            'InjuryTypes': response.data.Data.InjuryTypes,
                            'injuredUserModel': { ...this.state.injuryAndIllnessModal.injuredUserModel, 'Closed': false, 'DamageStart': false, },
                            'InjuryIllnessMechansim': [
                                {
                                    name: 'Select Mechansim',
                                    id: 0,
                                    children: response.data.Data.InjuryIllnessMechansim
                                }
                            ],
                            'IllnessClasses': [
                                {
                                    name: 'Select Illness Type',
                                    id: 0,
                                    children: response.data.Data.IllnessClasses
                                }
                            ],
                            'InjuryClasses': [
                                {
                                    name: 'Select Injury Type',
                                    id: 0,
                                    children: response.data.Data.InjuryClasses
                                }
                            ],
                            'InjurySubClasses': [
                                {
                                    name: 'Select Body Part',
                                    id: 0,
                                    children: response.data.Data.InjurySubClasses
                                }
                            ],

                        }
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
    getInjuryAndIllnessById = async (incidentId, InjuryAndIllnessId) => {
        this.setState({ InjuryAndIllnessId })
        const { injuryAndIllnessModal } = this.state
        this.showHideSpinner(true)
        try {
            await IncidentService.getInjuryAndIllness(
                InjuryAndIllnessId, incidentId, this.props.token,
            ).then(response => {
                this.showHideSpinner(false)
                const data = response['data']
                const result = data['Data']
                if (data['Success'] === true) {
                    this.setState({
                        injuryAndIllnessModal: {
                            ...this.state.injuryAndIllnessModal,
                            'injuredUserModel': { ...this.state.injuryAndIllnessModal.injuredUserModel, ...response.data.Data.injuredUserModel },
                            'EmployementTypes': response.data.Data.EmployementTypes,
                            'Categories': response.data.Data.Categories,
                            'InjuryTypes': response.data.Data.InjuryTypes,
                            'InjuryUser':[...response.data.Data.injuredUserModel.Injuries],
                            'IllnessesUser':[...response.data.Data.injuredUserModel.Illnesses],
                            'InjuryIllnessMechansim': [
                                {
                                    name: 'Select Mechansim',
                                    id: 0,
                                    children: response.data.Data.InjuryIllnessMechansim
                                }
                            ],
                            'IllnessClasses': [
                                {
                                    name: 'Select Illness Type',
                                    id: 0,
                                    children: response.data.Data.IllnessClasses
                                }
                            ],
                            'InjuryClasses': [
                                {
                                    name: 'Select Injury Type',
                                    id: 0,
                                    children: response.data.Data.InjuryClasses
                                }
                            ],
                            'InjurySubClasses': [
                                {
                                    name: 'Select Body Part',
                                    id: 0,
                                    children: response.data.Data.InjurySubClasses
                                }
                            ],
                        }
                    }, function () {
                        this.state.injuryAndIllnessModal.injuredUserModel.DamageStart = response.data.Data.injuredUserModel.DamageStartDate == null ? false : true

                        this.selectedTab(response.data.Data.injuredUserModel.EmployementType, response.data.Data.EmployementTypes ,'EmployementTypes');
                        var InjuryType = response.data.Data.InjuryTypes.filter(item => item.Id == response.data.Data.injuredUserModel.InjuryType);
                        this.getInjuryAndIllnessCategory(...InjuryType);
                        this.pushToArray(response.data.Data.injuredUserModel.Category ,'selectedCategories')
                        this.userList(response.data.Data.InjuryClasses,response.data.Data.InjurySubClasses,response.data.Data.InjuryIllnessMechansim ,response.data.Data.IllnessClasses)

                        this.state.injuryAndIllnessModal.injuredUserModel.DamageStartDate = response.data.Data.injuredUserModel.DamageStartDate !== null ?
                        moment(response.data.Data.injuredUserModel.DamageStartDate).format('DD-MMM-YYYY') :
                         response.data.Data.injuredUserModel.DamageStartDate;

                         this.state.injuryAndIllnessModal.injuredUserModel.FatalityDate = response.data.Data.injuredUserModel.FatalityDate !== null ?
                         moment(response.data.Data.injuredUserModel.FatalityDate).format('DD-MMM-YYYY') :
                          response.data.Data.injuredUserModel.FatalityDate;
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
    async userList(InjuryClasses,InjurySubClasses,InjuryIllnessMechansim ,IllnessClasses){
        const { injuryAndIllnessModal } = this.state
        if (injuryAndIllnessModal.InjuryUser.length > 0) {
            for (let i  in injuryAndIllnessModal.InjuryUser) {
                const InjuryTypeMechansim = InjuryIllnessMechansim.filter(item => parseInt(item.id) === injuryAndIllnessModal.InjuryUser[i].MechanismId);
                const InjuryType = InjuryClasses.filter(item => parseInt(item.id) === injuryAndIllnessModal.InjuryUser[i].ClassId);
                const SubClassId = InjurySubClasses.filter(item => parseInt(item.id) === injuryAndIllnessModal.InjuryUser[i].SubClassId);
                injuryAndIllnessModal.InjuryUser[i].MechanismName = InjuryTypeMechansim[0].name
                injuryAndIllnessModal.InjuryUser[i].InjuryIllnessName = InjuryType[0].name
                injuryAndIllnessModal.InjuryUser[i].SubClassName = SubClassId[0].name
            }
        }
        if (injuryAndIllnessModal.IllnessesUser.length > 0) {
            for (let i in injuryAndIllnessModal.IllnessesUser) {
                const IllnessesTypeMechansim = InjuryIllnessMechansim.filter(item => parseInt(item.id) === injuryAndIllnessModal.IllnessesUser[i].MechanismId);
                const IllnessesType = IllnessClasses.filter(item => parseInt(item.id) === injuryAndIllnessModal.IllnessesUser[i].ClassId);
                injuryAndIllnessModal.IllnessesUser[i].MechanismName = IllnessesTypeMechansim[0].name
                injuryAndIllnessModal.IllnessesUser[i].InjuryIllnessName = IllnessesType[0].name
            }
        }
    }
    async pushToArray(value ,type) {
        var id = []
        id.push((value).toString())
        this.onSelected(id ,type)
    }
    checkUnSavedData() {
        if (this.state.unSavedChanges) {
            Alert.alert(
                'Unsaved Changes',
                'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
                [
                    { text: 'Save Changes', onPress: () =>{this.validations()}},
                    { text: 'Undo Changes', onPress: () =>{  this.navigation() }},
                    {text: 'Cancel',style: 'cancel'},
                ],
                { cancelable: false }
            )
        } else this.navigation()
    }

        navigation() {
     const { navigation } = this.props
                    this.props.navigation.navigate('PeopleList', {listingPage:'InjuryAndIllnessList', id: this.state.incidentId, pageName: 'InjuryAndIllnessDetail', IncidentLocked: this.state.IncidentLocked, TenantIncidentId: navigation.state.params.TenantIncidentId, })

    }

    selectedTab = async (typeID, arr ,EmployementTypes ,changes) => {
        if(EmployementTypes == 'EmployementTypes') this.state.injuryAndIllnessModal.selectedEmployementTypeId = typeID
        for (let item  in arr) {
            arr[item].checked = false
            if (arr[item].Id == typeID) {
                arr[item].checked = true
                this.setState({
                    injuryAndIllnessModal: {
                        ...this.state.injuryAndIllnessModal,
                    },
                    unSavedChanges: changes === 'changes' ? true : false
                });
            }
        }
    }
    getInjuryAndIllnessCategory = async (injuryType ,changes) => {
        this.state.injuryAndIllnessModal.selectedInjuryType = injuryType
        const { injuryAndIllnessModal, InjuryType } = this.state
        if (injuryType) {
            var list = [];
            this.selectedTab(injuryType.Id, injuryAndIllnessModal.InjuryTypes);
            for (let value  in injuryAndIllnessModal.Categories) {
                if (injuryType.Type == InjuryType.Injury && injuryAndIllnessModal.Categories[value].IsInjury) {
                    list.push(injuryAndIllnessModal.Categories[value]);
                }
                else if (injuryType.Type == InjuryType.Illness && injuryAndIllnessModal.Categories[value].IsIllness) {
                    list.push(injuryAndIllnessModal.Categories[value]);
                }
                else if (injuryType.Type == InjuryType.Fatality && injuryAndIllnessModal.Categories[value].IsFatality) {
                    list.push(injuryAndIllnessModal.Categories[value]);
                }
            }
            if (list) {
                this.setState({
                    injuryAndIllnessModal: {
                        ...this.state.injuryAndIllnessModal,
                        'selectedCategories': this.state.items
                    },
                    unSavedChanges: changes === 'changes' ? true : false
                }, function () {
                    this.categoriesList(list, injuryType)
                });
            }
        }
    }
    categoriesList = async (list) => {
        const { injuryAndIllnessModal } = this.state
        var categoriesList = []
        for (let item  in list) {
            categoriesList.push({
                id: (list[item].Id).toString(),
                name: list[item].Name
            })
        }
        this.setState({
            injuryAndIllnessModal: {
                ...injuryAndIllnessModal,
                'categories':
                    [{
                        name: 'Select Categories',
                        id: 0,
                        children: categoriesList
                    }],
            }
        })
    }
    onSelected = async (selectedItems,type, changes) => {
        this.setState({
            injuryAndIllnessModal: {
                ...this.state.injuryAndIllnessModal,
              [type]: selectedItems,
            },
            unSavedChanges: changes === 'changes' ? true : false
        })
    }
    selectedUserData(UserID, UserName, IsUser) {
        this.setState({
            injuryAndIllnessModal: {
                ...this.state.injuryAndIllnessModal,
                'injuredUserModel': {
                    ...this.state.injuryAndIllnessModal.injuredUserModel,
                    UserName: UserName,
                    UserID:UserID,
                    IsUser:IsUser

                }
            },
            visible: false,
            unSavedChanges: true,
        })
    }
    handleDatePicked = (dateTime,typeDate) => {
        let varDate;
        const dateArray = moment(dateTime).format('DD-MMM-YYYY ')
       typeDate == 'fatalityDate' ?   varDate = 'FatalityDate' : varDate = 'DamageStartDate'
        this.setState({
            injuryAndIllnessModal: {
                ...this.state.injuryAndIllnessModal,
                'injuredUserModel': {
                    ...this.state.injuryAndIllnessModal.injuredUserModel,
                   [varDate] : dateArray,
                }

            },
            isDateTimePickerVisible: false, unSavedChanges: true
        })
    }
    sectionedMultiView = (items, selectedItem, selectText, single ,type) => {
        return (
            <SectionedMultiSelect
                chipRemoveIconComponent={this.state.IncidentLocked == true}
                disabled={this.state.IncidentLocked == true}
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
                onSelectedItemsChange={(selectedItems) => this.onSelected(selectedItems,type, 'changes' ,)}
                selectedItems={selectedItem}
            styles={
                [
                    this.state.IncidentLocked == true ?
                        {
                            chipContainer: {
                                width: '40%'
                            }
                        } : {
                            chipContainer: {}
                        }]
            }
            />
        )
    }
    removeUser(index, injury ,User) {
    const { injuryAndIllnessModal } = this.state
    if (!injury.IsNew)
    {for (let i in injuryAndIllnessModal[User]) {
        if( parseInt(index) == i ){
            injuryAndIllnessModal[User][i].IsDeleted = true
        }
        this.setState({ unSavedChanges: true })
    }}
    else {
        const arr = this.state.injuryAndIllnessModal[User];
        arr.splice(index, 1)
        this.setState({ involvedPersonList:{[User]:arr} ,unSavedChanges: true })
    }
    }
    renderItemInjury({ item, index }) {
        const { IncidentLocked } = this.state
        return (
            <View style={index % 2 == 0 ? styles.resultList : appStyles.secondResult}>
           { item.IsDeleted ==  false && <View style={styles.listWrap}>
            <View style={styles.listItem}>
                <View style={styles.row}>
                    <View style={styles.titleSide}>
                        <View style={styles.itemLine}>
                            <Text style={{ fontSize: 12 }}>Injury Type</Text>
                            <Text style={{ fontSize: 14, paddingLeft: 8 }}>
                                {item.InjuryIllnessName}
                        </Text>
                        </View>
                        <View style={styles.itemLine}>
                            <Text style={{ fontSize: 12 }}>Body part</Text>
                            <Text style={{ fontSize: 14, paddingLeft: 8 }}>
                            {item.SubClassName}
                        </Text>
                        </View>
                        <View style={styles.itemLine}>
                            <Text style={{ fontSize: 12 }}>Mechanism</Text>
                            <Text style={{ fontSize: 14, paddingLeft: 8 }}>
                            {item.MechanismName}
                        </Text>
                        </View>
                    </View>
                    <View style={styles.delBtnSide}>
                    <TouchableOpacity  onPress={()=> IncidentLocked == false && this.removeUser(index ,item ,'InjuryUser')}>
                            <Icon name="trash-o" size={22} type="font-awesome" color="#000" />
                            </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>}
        </View>
        )
    }
    renderItemIllness({ item, index }) {
        const { IncidentLocked } = this.state
        return (
            <View style={index % 2 == 0 ? styles.resultList : appStyles.secondResult}>
           { item.IsDeleted ==  false && <View style={styles.listWrap}>
            <View style={styles.listItem}>
                <View style={styles.row}>
                    <View style={styles.titleSide}>
                        <View style={styles.itemLine}>
                            <Text style={{ fontSize: 11 }}>Illness Type</Text>
                            <Text style={{ fontSize: 13, paddingLeft: 8 }}>
                                {item.InjuryIllnessName}
                        </Text>
                        </View>
                        <View style={styles.itemLine}>
                            <Text style={{ fontSize: 11 }}>Mechanism</Text>
                            <Text style={{ fontSize: 13, paddingLeft: 8 }}>
                            {item.MechanismName}
                        </Text>
                        </View>
                    </View>
                    <View style={styles.delBtnSide}>
                    <TouchableOpacity  onPress={()=> IncidentLocked == false && this.removeUser(index ,item ,'IllnessesUser')}>
                            <Icon name="trash-o" size={22} type="font-awesome" color="#000" />
                            </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>}
        </View>
        )
    }
    async addInjury() {
        const { injuryAndIllnessModal } = this.state
        if (injuryAndIllnessModal['selectedInjuryClass'] == undefined || injuryAndIllnessModal['selectedInjuryClass'].length == 0) {
            this.setState({
                addClassification: false,
            })
        } else {
            if(injuryAndIllnessModal.InjuryUser == undefined) injuryAndIllnessModal.InjuryUser =[]
            const InjuryType = injuryAndIllnessModal.InjuryClasses[0].children.filter(item => parseInt(item.id) === parseInt(injuryAndIllnessModal['selectedInjuryClass'][0]));
            const mechansim = injuryAndIllnessModal.InjuryIllnessMechansim[0].children.filter(item => parseInt(item.id) === parseInt(injuryAndIllnessModal['selectedInjuryMechansim'][0]));
            const SubClassName = injuryAndIllnessModal.InjurySubClasses[0].children.filter(item => parseInt(item.id) === parseInt(injuryAndIllnessModal['selectedInjurySubClasses'][0]));
            injuryAndIllnessModal.InjuryUser.push(  
                {
                    ClassId: parseInt(injuryAndIllnessModal['selectedInjuryClass'][0]),
                    InjuryIllnessName: InjuryType[0].name,
                    IsDeleted: false,
                    IsNew: true,
                    MechanismId: parseInt(injuryAndIllnessModal['selectedInjuryMechansim'][0]),
                    MechanismName: mechansim[0].name,
                    SubClassId: parseInt(injuryAndIllnessModal['selectedInjurySubClasses'][0]),
                    SubClassName: SubClassName[0].name,
                    IsMobileInjury : true
                })
        }
        this.setState({
            addClassification: false,
            unSavedChanges: true
        })
    }
    async addillness() {
        const { injuryAndIllnessModal } = this.state
        if (
            injuryAndIllnessModal['selectedIllnessClass'] == undefined || injuryAndIllnessModal['selectedIllnessClass'].length == 0 ||
            injuryAndIllnessModal['InjuryIllnessMechansim'] == undefined || injuryAndIllnessModal['InjuryIllnessMechansim'].length == 0

        ) {
            this.setState({
                addClassification: false,
            })

        } else {
            if(injuryAndIllnessModal.IllnessesUser == undefined) injuryAndIllnessModal.IllnessesUser =[]
            const IllnessType = injuryAndIllnessModal.IllnessClasses[0].children.filter(item => parseInt(item.id) === parseInt(injuryAndIllnessModal['selectedIllnessClass'][0]));
            const mechansim = injuryAndIllnessModal.InjuryIllnessMechansim[0].children.filter(item => parseInt(item.id) === parseInt(injuryAndIllnessModal['selectedIllnessMechansim'][0]));
            injuryAndIllnessModal.IllnessesUser.push(
                {

                    ClassId: parseInt(injuryAndIllnessModal['selectedIllnessClass'][0]),
                    InjuryIllnessName: IllnessType[0].name,
                    IsDeleted: false,
                    IsNew: true,
                    MechanismId: parseInt(injuryAndIllnessModal['selectedIllnessMechansim'][0]),
                    MechanismName: mechansim[0].name,
                    SubClassId: 0,
                    SubClassName: 0,
                    IsMobileIllness : true
                })
        }
        this.setState({
            addClassification: false,
            unSavedChanges: true
        })
    }
    async validations(){ 
        const { injuryAndIllnessModal,InjuryAndIllnessId } = this.state
        var injuryAndIllnessModalvalues = []
           if(injuryAndIllnessModal.injuredUserModel.UserName == undefined){CommonService.showErrorNotification('User is required.')}
           else if(injuryAndIllnessModal.selectedEmployementTypeId == undefined){CommonService.showErrorNotification('Employement type is required.')}
           else if(injuryAndIllnessModal.selectedInjuryType == undefined ){CommonService.showErrorNotification('Injury type is required.')}
           else if(injuryAndIllnessModal.selectedCategories == undefined || injuryAndIllnessModal.selectedCategories.length == 0){CommonService.showErrorNotification('Category is required.')}
           else if(injuryAndIllnessModal.selectedInjuryType.Name == "Fatality" && injuryAndIllnessModal.injuredUserModel.FatalityDate == undefined ){CommonService.showErrorNotification('Fatality date is required.')}
           else if(injuryAndIllnessModal.injuredUserModel.DamageStart && injuryAndIllnessModal.injuredUserModel.DamageStartDate == undefined ){CommonService.showErrorNotification('Damage Start  date is required.')}
           else{
            this.showHideSpinner(true)
               if(injuryAndIllnessModal.selectedInjuryType.Name == "Fatality"){
                if ( injuryAndIllnessModal.InjuryUser  !== undefined && injuryAndIllnessModal.InjuryUser.length > 0) {
                    for (let i  in injuryAndIllnessModal.InjuryUser) {
                        injuryAndIllnessModal.InjuryUser[i].IsDeleted = true
                    }
                }
                if (injuryAndIllnessModal.IllnessesUser !== undefined && injuryAndIllnessModal.IllnessesUser.length > 0) {
                    for (let i  in injuryAndIllnessModal.IllnessesUser) {
                        injuryAndIllnessModal.IllnessesUser[i].IsDeleted = true
                    }
                }
               }

               if(injuryAndIllnessModal.selectedInjuryType.Name == "Injury"){
              if(injuryAndIllnessModal.injuredUserModel.FatalityDate !== undefined)injuryAndIllnessModal.injuredUserModel.FatalityDate =  null
                
                if (injuryAndIllnessModal.IllnessesUser !== undefined && injuryAndIllnessModal.IllnessesUser.length > 0) {
                    for (let i  in injuryAndIllnessModal.IllnessesUser) {
                        injuryAndIllnessModal.IllnessesUser[i].IsDeleted = true
                    }
                }
               }
               if(injuryAndIllnessModal.selectedInjuryType.Name == "Illness"){
                if( injuryAndIllnessModal.InjuryUser && injuryAndIllnessModal.injuredUserModel.FatalityDate !== undefined)injuryAndIllnessModal.injuredUserModel.FatalityDate =  null
                if (injuryAndIllnessModal.InjuryUser  !== undefined && injuryAndIllnessModal.InjuryUser.length > 0) {
                    for (let i  in injuryAndIllnessModal.InjuryUser) {
                        injuryAndIllnessModal.InjuryUser[i].IsDeleted = true
                    }
                }
                   
            }
            injuryAndIllnessModalvalues.push({
                    InjuredIllID:InjuryAndIllnessId !== undefined ?injuryAndIllnessModal.injuredUserModel.InjuredIllID :0,  
                    IncidentID :this.state.incidentId, 
                    UserName:injuryAndIllnessModal.injuredUserModel.UserName, 
                    UserID :injuryAndIllnessModal.injuredUserModel.UserID, 
                    IsUser:injuryAndIllnessModal.injuredUserModel.IsUser, 
                    EmployementType :injuryAndIllnessModal.selectedEmployementTypeId, 
                    InjuryType :injuryAndIllnessModal.selectedInjuryType.Id, 
                    Category :parseInt(injuryAndIllnessModal.selectedCategories[0]), 
                    Closed :injuryAndIllnessModal.injuredUserModel.Closed, 
                    DamageStartDate :injuryAndIllnessModal.injuredUserModel.DamageStartDate !== undefined ? injuryAndIllnessModal.injuredUserModel.DamageStartDate :null, 
                    FatalityDate :injuryAndIllnessModal.injuredUserModel.FatalityDate !== undefined ?injuryAndIllnessModal.injuredUserModel.FatalityDate:null, 
                    Notes :injuryAndIllnessModal.injuredUserModel.Notes !== undefined ?injuryAndIllnessModal.injuredUserModel.Notes:null, 
                    Injuries: injuryAndIllnessModal.InjuryUser && injuryAndIllnessModal.InjuryUser.length >0 ?injuryAndIllnessModal.InjuryUser: null, 
                    Illnesses:injuryAndIllnessModal.IllnessesUser && injuryAndIllnessModal.IllnessesUser.length >0 ?injuryAndIllnessModal.IllnessesUser: null, 
            })
             this.saveInjuryAndIllness(...injuryAndIllnessModalvalues)
           }



    }
    saveInjuryAndIllness = async (injuryAndIllnessModalvalues) => {
        try {
            await IncidentService.addUpdateInjuryIllness(
                injuryAndIllnessModalvalues,
                this.props.token,
            ).then(response => {
                const data = response['data']
                const result = data['Data']
                if (data['Success'] == true) {
                    this.showHideSpinner(false)
                    CommonService.showSuccessNotification("Incident Injury and Illness details is successfully updated ")
                    this.props.navigation.navigate('PeopleList', {listingPage:'InjuryAndIllnessList', id: this.state.incidentId, pageName: 'InjuryAndIllnessDetail', IncidentLocked: this.state.IncidentLocked, TenantIncidentId: this.props.navigation.state.params.TenantIncidentId, })

                    // this.props.navigation.navigate('Incident', {
                    //     id: this.state.incidentId
                    // })
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
    //#endregion
    render() {
        const { navigation } = this.props
        const { spinner, nextPagedialog, visible, addClassification, injuryAndIllnessModal, isDateTimePickerVisible,IncidentLocked } = this.state
        var lock = IncidentLocked ? false :true
        return (
            <View style={appStyles.container}>
                <HeaderView PropFunction={() => this.checkUnSavedData('goback')}
                    Title={navigation.state.params.TenantIncidentId ? 'Incident #' + `${navigation.state.params.TenantIncidentId}` : 'Incident #'}
                    Pagename={'incident'}
                ></HeaderView>
                <View>
                    <Spinner
                        visible={spinner}
                        textStyle={styles.spinnerTextStyle}
                    />
                </View>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={20}
                    behavior="padding"
                    style={{ flex: 1 }}>
                    <SafeAreaView style={styles.container1}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                       
                                <ScrollView>
                                    <View style={styles.headingWrap}>
                                        <Text style={{ fontSize: 27, color: '#444', textAlign: 'center' }}>
                                            Injury / Illness Details
                                        </Text>
                                        {/* <View style={{ position:"absolute", right:10,top:10 }}> */}
                                        <View style={styles.headerIcon}>
                                            <Icon
                                                onPress={() => this.setState({
                                                    injuryAndIllnessModal: {
                                                        ...injuryAndIllnessModal,
                                                        injuredUserModel: { ...injuryAndIllnessModal.injuredUserModel, showView1: !injuryAndIllnessModal.injuredUserModel.showView1 }
                                                    }
                                                })}
                                                name={injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.showView1 == true ? 'angle-up' : 'angle-down'}
                                                style={{}}
                                                type='font-awesome'
                                                color='#444'
                                                size={25}
                                            />
                                        </View>
                                    </View>
                                    {injuryAndIllnessModal.injuredUserModel.showView1 == true &&
                                        <View style={styles.fieldWrap}>
                                                <View style={styles.fieldpadding}>
                                                    <Text style={styles.itemLabel}>Person</Text>
                                                    <TouchableWithoutFeedback onPress={() => { IncidentLocked == false && this.setState({ visible: true }) }}>
                                                        <View
                                                            style={[styles.multiSelctinputPadding, styles.forfieldIcon]}>
                                                            <View style={[styles.multiSec, { alignItems: "center", height: 40, paddingLeft: 6, flexDirection: "row" }]}>
                                                                <Text>
                                                                    {injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.UserName}
                                                                </Text>
                                                                <View style={styles.fieldIcon}>
                                                                <Icon name='search' color='#c9c9c9' size={30} />
                                                            </View>
                                                            </View>
                                                           
                                                        </View>

                                                    </TouchableWithoutFeedback>
                                                </View>
                                            
                                            <View style={styles.fieldpadding}>
                                                <Text style={styles.itemLabel}>Employement Type</Text>
                                                <View style={styles.ItemHeaderBtn}>
                                                    {
                                                        injuryAndIllnessModal.EmployementTypes && injuryAndIllnessModal.EmployementTypes.map((item, index) => {
                                                            return (
                                                                <TouchableOpacity key={index} style={[styles.selectBtn, item.checked == true ? { backgroundColor: '#498aef' } : { backgroundColor: '#f6f6f6' }]}
                                                                    onPress={() => IncidentLocked == false &&
                                                                        this.selectedTab(item.Id, injuryAndIllnessModal.EmployementTypes ,'EmployementTypes' ,'changes')}
                                                                >
                                                                    <Text style={{fontSize: 13} , item.checked == true ?{color:"#fff",alignSelf: 'center'}:{ color: '#444',alignSelf: 'center'}}>{item.Name}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            <View style={styles.fieldpadding}>
                                                <Text style={styles.itemLabel}>Injury / Illness / Fatality</Text>
                                                <View style={styles.ItemHeaderBtn}>
                                                    {
                                                        injuryAndIllnessModal.InjuryTypes && injuryAndIllnessModal.InjuryTypes.map((item, index) => {
                                                            return (
                                                                <TouchableOpacity key={index} style={[styles.selectBtn, item.checked == true ? { backgroundColor: '#498aef',color:"#fff" } : { backgroundColor: '#f6f6f6', }]}
                                                                    onPress={() => IncidentLocked == false &&
                                                                        this.getInjuryAndIllnessCategory(item ,'changes')}
                                                                >
                                                                    <Text style={{ fontSize: 13 }, item.checked == true ? { color: "#fff", alignSelf: 'center' } : { color: '#444', alignSelf: 'center' }}>{item.Name}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            {
                                                injuryAndIllnessModal.selectedInjuryType && injuryAndIllnessModal.selectedInjuryType.Name == "Fatality" &&
                                                <View style={styles.fieldpadding}>
                                                    <Text style={styles.itemLabel}>Fatality Date</Text>
                                                    <View
                                                        style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                        <View style={[appStyles.multiSec, { alignItems: "center", height: 40, paddingLeft: 6, flexDirection: "row", }]}>
                                                            <TouchableOpacity onPress={() => IncidentLocked == false &&
                                                                this.setState({ isDateTimePickerVisible: true })} style={{ width: '100%', height: '100%', alignItems: "center", paddingLeft: 6, flexDirection: "row", }}>
                                                                <Text >
                                                                    {injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.FatalityDate}
                                                                </Text>
                                                                <DatePicker
                                                                    maximumDate={this.state.maxDate}
                                                                    Visible={isDateTimePickerVisible}
                                                                    handleDatePicker={(date) => this.handleDatePicked(date ,"fatalityDate")}
                                                                    cancelDatePicker={() => this.setState({ isDateTimePickerVisible: false })}
                                                                />

                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={appStyles.fieldIcon}>
                                                            <Icon
                                                                name='calendar'
                                                                type='font-awesome'
                                                                color='#c9c9c9'
                                                                size={25}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            }
                                            <View style={styles.fieldpadding}>
                                                <Text style={styles.itemLabel}>Category</Text>
                                                {
                                                    injuryAndIllnessModal['categories'] == undefined || injuryAndIllnessModal['categories'].length < 0 ?
                                                        <View style={styles.unitInputWrap} >
                                                            <View style={[styles.unitInput, appStyles.forfieldIcon]}>
                                                                <Text >Choose categories </Text>
                                                                <View style={styles.fieldIcon}>
                                                                    <Icon name='search' color='#c9c9c9' size={30} />
                                                                </View>
                                                            </View>

                                                        </View>
                                                        :
                                                        <View
                                                            style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                            <View style={appStyles.multiSec}>
                                                                {this.sectionedMultiView(injuryAndIllnessModal['categories'], injuryAndIllnessModal['selectedCategories'], 'Choose categories', true ,'selectedCategories')}
                                                            </View>
                                                            <View style={appStyles.fieldIcon}>
                                                                <Icon name='search' color='#c9c9c9' size={30} />
                                                            </View>
                                                        </View>
                                                }
                                            </View>

                                            <View style={styles.fieldpadding}>
                                                <Text style={styles.itemLabel}>Is There Permanent Damage?</Text>
                                                <View style={styles.ItemHeaderBtn}>
                                                    <TouchableOpacity style={[styles.selectBtn, injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.DamageStart == false ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                        onPress={() => IncidentLocked == false &&
                                                             this.setState(
                                                            {
                                                                injuryAndIllnessModal: {
                                                                    ...this.state.injuryAndIllnessModal,
                                                                    'injuredUserModel': { ...this.state.injuryAndIllnessModal.injuredUserModel, 'DamageStart': false }
                                                                },
                                                                unSavedChanges: false
                                                            })}
                                                    >
                                                        <Text style={{ fontSize: 13, textAlign: 'center'}, injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.DamageStart == false ? { color: '#fff', textAlign:"center" } : { color: '#444', textAlign:"center" }}>No</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={[styles.selectBtn, injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.DamageStart ? { backgroundColor: '#4c8aef'} : { backgroundColor: '#f2f2f2' }]}
                                                        onPress={() =>IncidentLocked == false &&
                                                             this.setState(
                                                            {
                                                                injuryAndIllnessModal: {
                                                                    ...this.state.injuryAndIllnessModal,
                                                                    'injuredUserModel': { ...this.state.injuryAndIllnessModal.injuredUserModel, 'DamageStart': true }
                                                                },
                                                                unSavedChanges: false
                                                            })}
                                                    >
                                                        <Text style={{ fontSize: 13, textAlign:"center" }, injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.DamageStart ? { color: '#fff', textAlign:"center" } : { color: '#444', textAlign:"center" }}>Yes</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                {injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.DamageStart &&
                                                <View>
                                                    <Text style={[styles.itemLabel ,{paddingHorizontal: 10}]}>Permanent Damage Start Date</Text>
                                                    <View
                                                        style={[styles.multiSelctinputPadding, appStyles.forfieldIcon]}>

                                                        <View style={[appStyles.multiSec, { alignItems: "center", height: 40, paddingLeft: 6, flexDirection: "row", }]}>
                                                            <TouchableOpacity onPress={() =>
                                                                IncidentLocked == false &&
                                                                this.setState({ isDateTimePickerVisible: true })} style={{ width: '100%', height: '100%', alignItems: "center", paddingLeft: 6, flexDirection: "row", }}>
                                                                <Text >
                                                                    {injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.DamageStartDate}
                                                                </Text>
                                                                <DatePicker
                                                                    maximumDate={this.state.maxDate}
                                                                    Visible={isDateTimePickerVisible}
                                                                    handleDatePicker={(date) => this.handleDatePicked(date)}
                                                                    cancelDatePicker={() => this.setState({ isDateTimePickerVisible: false })}
                                                                />

                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={appStyles.fieldIcon}>
                                                            <Icon
                                                                name='calendar'
                                                                type='font-awesome'
                                                                color='#c9c9c9'
                                                                size={25}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                                }
                                            </View>
                                            <View style={styles.fieldpadding}>
                                                <Text style={styles.itemLabel}>Case Management Notes</Text>
                                                <TextInput
                                                scrollEnabled={false}
                                                    multiline={true}
                                                    editable={lock}
                                                    value={injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel['Notes']}
                                                    style={[styles.ammountInput, { height: 80 }]}
                                                    maxLength={100}
                                                    onChangeText={text =>
                                                        this.setState({
                                                            injuryAndIllnessModal: {
                                                                ...this.state.injuryAndIllnessModal,
                                                                injuredUserModel: { ...injuryAndIllnessModal.injuredUserModel, Notes: text }
                                                            },
                                                            unSavedChanges: true
                                                        })
                                                    } />
                                            </View>

                                            <View style={styles.fieldpadding}>
                                                <Text style={styles.itemLabel}>Treatment is complete and record can be closed?</Text>
                                                <View style={styles.ItemHeaderBtn}>
                                                    <TouchableOpacity style={[styles.selectBtn, injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.Closed == false ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                        onPress={() =>
                                                            IncidentLocked == false &&
                                                             this.setState(
                                                            {
                                                                injuryAndIllnessModal: {
                                                                    ...this.state.injuryAndIllnessModal,
                                                                    'injuredUserModel': {...injuryAndIllnessModal.injuredUserModel, Closed: false }
                                                                },
                                                                unSavedChanges: false
                                                            })}
                                                    >
                                                        <Text style={{ fontSize: 13, textAlign: 'center' }, injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.Closed == false ? { color: '#fff',textAlign: 'center' } : { color: '#444',textAlign: 'center' }}>No</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={[styles.selectBtn, injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.Closed ? { backgroundColor: '#4c8aef' } : { backgroundColor: '#f2f2f2' }]}
                                                        onPress={() =>IncidentLocked == false &&
                                                             this.setState(
                                                            {
                                                                injuryAndIllnessModal: {
                                                                    ...this.state.injuryAndIllnessModal,
                                                                    'injuredUserModel': {...injuryAndIllnessModal.injuredUserModel, Closed: true }
                                                                },
                                                                unSavedChanges: false
                                                            })}
                                                    >
                                                        <Text style={{ fontSize: 13, textAlign: 'center' }, injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.Closed ? { color: '#fff',textAlign: 'center' } : { color: '#444',textAlign: 'center' }}>Yes</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    }

                                    {injuryAndIllnessModal.selectedInjuryType && injuryAndIllnessModal.selectedInjuryType.Name !== "Fatality" &&
                                        <View>
                                            <View style={styles.headingWrap}>
                                                <Text style={{ fontSize: 20, color: '#444', textAlign: 'center' }}>
                                                    {injuryAndIllnessModal.selectedInjuryType.Name + " " + 'Classifications'}
                                                </Text>
                                                <View style={styles.headerIcon}>
                                                    <Icon
                                                        onPress={() => this.setState({
                                                            injuryAndIllnessModal: {
                                                                ...injuryAndIllnessModal,
                                                                injuredUserModel: { ...injuryAndIllnessModal.injuredUserModel, showView2: !injuryAndIllnessModal.injuredUserModel.showView2 }
                                                            }
                                                        })}
                                                        name={injuryAndIllnessModal.injuredUserModel && injuryAndIllnessModal.injuredUserModel.showView2 == true ? 'angle-up' : 'angle-down'}
                                                        style={{}}
                                                        type='font-awesome'
                                                        color='#444'
                                                        size={25}
                                                    />
                                                </View>
                                            </View>

                                        {injuryAndIllnessModal.injuredUserModel.showView2 == true &&
                                            <View>
                                            <View style={{
                                                paddingHorizontal: 10,
                                                width: '100%',
                                                marginBottom: 20,
                                                marginTop: 10,
                                                position: 'relative'
                                            }}>
                                                <TouchableOpacity onPress={
                                                    () => IncidentLocked == false && this.setState({
                                                        addClassification: true,
                                                        injuryAndIllnessModal: {
                                                            ...this.state.injuryAndIllnessModal,
                                                            'selectedInjuryClass': this.state.items,
                                                            'selectedIllnessClass': this.state.items,
                                                            'selectedIllnessMechansim': this.state.items,
                                                            'selectedInjurySubClasses': this.state.items,
                                                            'selectedInjuryMechansim': this.state.items
                                                        }
                                                    })
                                                }>
                                                    <Text style={[styles.textBox1, Platform.OS === 'android' ? { fontSize: 15 } : { fontSize: 13.5 }]}>
                                                        Add Classification
                                                        </Text>
                                                </TouchableOpacity>
                                            </View>
                                                <FlatList
                                                    style={{ backgroundColor: '#FFF' }}
                                                    data={injuryAndIllnessModal.selectedInjuryType.Name == "Injury" ?
                                                        injuryAndIllnessModal.InjuryUser : injuryAndIllnessModal.IllnessesUser}
                                                     renderItem={injuryAndIllnessModal.selectedInjuryType.Name == "Injury" ? this.renderItemInjury.bind(this):
                                                     this.renderItemIllness.bind(this)}
                                                    keyExtractor={(item, index) => index.toString()}
                                                />
                                            </View>
                                        }
                                        </View>}

                                </ScrollView>
                                              
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </KeyboardAvoidingView>

                {visible && <SearchPeopleModal
                    spinner={spinner}
                    modalVisible={visible}
                    selectedUserData={(UserID, UserName, IsUser) => { this.selectedUserData(UserID, UserName, IsUser) }}
                    cancel={() => this.setState({ visible: false,})}
                    showPersonField = {true}
                />}
                  
                <Modal
                    visible={addClassification}
                    onRequestClose={() => {
                        this.setState({ addClassification: false })
                    }}>
                    <View style={styles.mapcontainer}>
                        <Spinner visible={spinner} />
                        <View style={{ width: '100%', position: "relative", justifyContent: "center", backgroundColor: "#f7f7f7", height: 40, alignItems: "center", marginTop: 10 }}>
                            <Text style={{ fontWeight: "bold", color: "#424242" }}>Classifications</Text>
                            <TouchableOpacity
                                onPress={() => { this.setState({ addClassification: false, }) }}
                                style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center", position: "absolute", right: 0, top: 0 }}>
                                <Icon name='close' color='#424242' size={22} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {injuryAndIllnessModal.selectedInjuryType && injuryAndIllnessModal.selectedInjuryType.Name == "Injury" ?
                            <View>
                                <View style={styles.fieldpadding}>
                                    <Text style={styles.itemLabel}>Injury Type</Text>
                                    <View
                                        style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                        <View style={appStyles.multiSec}>
                                            {this.sectionedMultiView(injuryAndIllnessModal['InjuryClasses'], injuryAndIllnessModal['selectedInjuryClass'], 'Choose Injury Type', true ,'selectedInjuryClass')}
                                        </View>
                                        <View style={appStyles.fieldIcon}>
                                            <Icon name='search' color='#c9c9c9' size={30} />
                                        </View>
                                    </View>
                                    </View>
                                    <View style={styles.fieldpadding}>
                                        <Text style={styles.itemLabel}>Body Part</Text>
                                        <View
                                            style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                            <View style={appStyles.multiSec}>
                                                {this.sectionedMultiView(injuryAndIllnessModal['InjurySubClasses'], injuryAndIllnessModal['selectedInjurySubClasses'], 'Choose Body Part', true ,'selectedInjurySubClasses')}
                                            </View>
                                            <View style={appStyles.fieldIcon}>
                                                <Icon name='search' color='#c9c9c9' size={30} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.fieldpadding}>
                                        <Text style={styles.itemLabel}>Mechanism</Text>
                                        <View
                                            style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                            <View style={appStyles.multiSec}>
                                                {this.sectionedMultiView(injuryAndIllnessModal['InjuryIllnessMechansim'], injuryAndIllnessModal['selectedInjuryMechansim'], 'Choose Mechanism', true ,'selectedInjuryMechansim')}
                                            </View>
                                            <View style={appStyles.fieldIcon}>
                                                <Icon name='search' color='#c9c9c9' size={30} />
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => this.addInjury()}>
                                            <Text style={[styles.textBox1, { fontSize: 15 }]}>
                                            Add injury
                                            </Text>
                                        </TouchableOpacity>
                                </View>
                                :
                                <View>
                                    <View style={styles.fieldpadding}>
                                        <Text style={styles.itemLabel}>Illness Type</Text>
                                        <View
                                            style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                            <View style={appStyles.multiSec}>
                                                {this.sectionedMultiView(injuryAndIllnessModal['IllnessClasses'], injuryAndIllnessModal['selectedIllnessClass'], 'Choose Illness Type', true ,'selectedIllnessClass')}
                                            </View>
                                            <View style={appStyles.fieldIcon}>
                                                <Icon name='search' color='#c9c9c9' size={30} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.fieldpadding}>
                                        <Text style={styles.itemLabel}>Mechanism</Text>
                                        <View
                                            style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                            <View style={appStyles.multiSec}>
                                                {this.sectionedMultiView(injuryAndIllnessModal['InjuryIllnessMechansim'], injuryAndIllnessModal['selectedIllnessMechansim'], 'Choose Mechanism', true ,'selectedIllnessMechansim')}
                                            </View>
                                            <View style={appStyles.fieldIcon}>
                                                <Icon name='search' color='#c9c9c9' size={30} />
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => this.addillness()}>
                                            <Text style={[styles.textBox1, { fontSize: 15 }]}>
                                            Add illness
                                            </Text>
                                        </TouchableOpacity>
                                </View>
                            }
                        </ScrollView>
                    </View>
                </Modal>
                <FooterView PropFunction={() => this.validations()}
                    showType={'Action'}
                    ChoosePage={() => this.setState({ nextPagedialog: true })}
                    IncidentLocked={this.state.IncidentLocked}
                    Close={() => this.props.navigation.navigate('Incident', {
                        id: this.state.incidentId,

                    })}
                ></FooterView>
            </View>

        )
    }
}
function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
        firstName: state.home.firstName,
        lastName: state.home.lastName,
        userId: state.home.userId,
    }
}
export default connect(mapStateToProps)(InjuryAndIllnessDetailScreen)