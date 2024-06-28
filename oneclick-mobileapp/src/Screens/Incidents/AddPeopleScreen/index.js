import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Modal, TouchableWithoutFeedback, Keyboard, FlatList ,Platform} from 'react-native';
import { Icon, CheckBox ,Overlay  } from 'react-native-elements'
import { IncidentService, CommonService } from '../../../Services'
import { HeaderView, FooterView, SearchPeopleModal } from '../../../component/index'
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import styles from './Style';
import SectionedMultiSelect from '../../../Custom-NodeModules/react-native-sectioned-multi-select'
import appStyles from '../../../../AppStyle';
class AddPeopleScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedSearch: true,
            checkedDetail: false,
            spinner: false,
            unSavedChanges: false,
            pageName: '',
            nextPagedialog: false,
            visible:false,
            modal :{
                selectedRole:[],
                peopleArray:[]
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
        this.getInvolvedPersonRoles()
        this.focusListener = navigation.addListener('didFocus', () => {
            CommonService.handleAndroidBackButton(this.handleBackPress)
        })
    }
    handleBackPress = () => {
        this.props.navigation.navigate('PeopleList', {listingPage:'PeopleList', id: this.state.incidentId, pageName: this.state.pageName , peopleArray: this.state.modal['peopleArray'] , condition : '0'})
        return true
    }
    checkUnSavedData() {
        if (this.state.unSavedChanges) {
            Alert.alert(
                'Unsaved Changes',
                'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
                [
                    { text: 'Save Changes', onPress: () =>{this.selectedUser()}},
                    { text: 'Undo Changes', onPress: () =>{ this.navigation() }},
                    {text: 'Cancel',style: 'cancel'},
                ],
                { cancelable: false }
            )
        } else this.navigation()
    }
    navigation() {
        this.setState({ unSavedChanges: false })
        this.props.navigation.navigate('PeopleList', {listingPage:'PeopleList', id: this.state.incidentId, pageName: this.state.pageName , peopleArray: this.state.modal['peopleArray'] , condition : '2'})

    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        })
    }
    getInvolvedPersonRoles = async () =>  {
        const { navigation } = this.props
        let peopleArray = navigation.state.params.peopleArray
        let index = navigation.state.params.index
        this.showHideSpinner(true)
        try {
            await IncidentService.getInvolvedPersonRoles(this.props.token)
                .then(response => {
                    const result = response['data']
                    const data = result['Data']
                    if (result['Success'] === true) {
                        this.setState({
                            modal: {
                                ...this.state.modal,
                                'InvolvedPersonRoles': [
                                    {
                                        name: 'Select Person Role',
                                        id: 0,
                                        children: data.InvolvedPersonRoles
                                    }
                                ],
                                'InvolvedPersonRolesname' :data.InvolvedPersonRoles,
                                'peopleArray' :peopleArray

                            }
                            })
                            
                            if (peopleArray.length >0) {
                                for (let i in peopleArray) {
                                    if( parseInt(index) == i ){
                                        this.setState({
                                            modal: {
                                                ...this.state.modal,
                                                'UserName': peopleArray[i].UserName,
                                                'peopleArray' :peopleArray
                                            }
                                            })
                                            var selected = []
                                            var val = peopleArray[i].InvolvedUserRoleID
                                            selected.push(val.toString())
                                            this.onSelected(selected)
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
    onSelected = (selectedItems ,changes ) => {
        this.setState({
            modal: {
                ...this.state.modal,
                selectedRole: selectedItems,
                
            },
            unSavedChanges : changes === 'changes' ? true : false
        })
    }
    selectedUser = async () => {
        const { navigation } = this.props
        let peopleArray = navigation.state.params.peopleArray
        let index = navigation.state.params.index
        const{modal}= this.state
        if(modal['selectedRole'] == undefined || modal['selectedRole'].length == 0){
            CommonService.showErrorNotification('Role is required')
        }
        else if(modal['UserName']  == undefined || modal['UserName']  == '' ){
            CommonService.showErrorNotification('Person is required')
        }
        else{
            var name 
            for (let i in modal.InvolvedPersonRolesname) {
                if(modal['selectedRole'][0] == modal.InvolvedPersonRolesname[i].id ){
                    name = modal.InvolvedPersonRolesname[i].name
                }
            }
            if (index !== undefined) {
                for (let i in peopleArray) {
                    if( parseInt(index) == i ){
                        modal.peopleArray[parseInt(index)] = {
                            IncidentID:peopleArray[index].IncidentID,
                            IncidentInvolvedUserID: peopleArray[index].IncidentInvolvedUserID,
                            InvolvedUserRoleID: modal['selectedRole'][0],
                            InvolvedUserRoleName: name,
                            IsDeleted: peopleArray[index].IsDeleted,
                            IsInjuredIll: peopleArray[index].IsInjuredIll,
                            IsUser:  modal['IsUser'],
                            UserID:  parseInt(modal['UserID']),
                            UserName: modal['UserName'],
                        }
                    }
                }
                this.props.navigation.navigate('PeopleList', {listingPage:'PeopleList', id: this.state.incidentId, pageName: this.state.pageName  ,peopleArray: modal['peopleArray'] , condition : '1'})
               }else{
                modal.peopleArray.push(
                {
                IncidentID: this.state.incidentId,
                IncidentInvolvedUserID: 0,
                InvolvedUserRoleID: modal['selectedRole'][0],
                InvolvedUserRoleName: name,
                IsDeleted: false,
                IsInjuredIll: false,
                IsUser:  modal['IsUser'],
                UserID:  parseInt(modal['UserID']),
                UserName: modal['UserName'],
                })
               this.props.navigation.navigate('PeopleList', {listingPage:'PeopleList', id: this.state.incidentId, pageName: this.state.pageName  ,peopleArray: modal['peopleArray'] , condition : '0'})
               }


        }

    }
    selectedUserData(UserID,UserName,IsUser) {
            this.setState({
                modal:{
                    ...this.state.modal,
                    UserID:UserID,
                    UserName:UserName,
                    IsUser: IsUser
                 },
                visible: false,
                unSavedChanges: true,

                isLoading: true
            })
    }
    sectionedMultiView = (items, selectedItem, title) => {
        return (
                <SectionedMultiSelect
                chipRemoveIconComponent ={this.state.IncidentLocked == true}
                disabled= {this.state.IncidentLocked == true}
                items={items}
                confirmText='Close'
                uniqueKey='id'
                subKey='children'
                selectText={title}
                hideSearch={false}
                showDropDowns={true}
                single={true}
                readOnlyHeadings={true}
                expandDropDowns={true}
                onSelectedItemsChange={(selectedItems) => this.onSelected(selectedItems ,'changes')}
                selectedItems={selectedItem}
                styles={
                    this.state.IncidentLocked == true ?
                    {chipContainer :{
                      width:'40%'}
                    }:{chipContainer :{}
                    }
                  }
            />

        )
    }
    //#endregion
    render() {
        const { spinner, modal ,visible} = this.state
        const { navigation } = this.props
            return (
                <View style={appStyles.container}>
                <HeaderView PropFunction={() => this.checkUnSavedData()}
                    Title={ navigation.state.params.TenantIncidentId ? 'Incident #' +  `${navigation.state.params.TenantIncidentId }`:'Incident #'}
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
                        Add Person
                    </Text>
                </View>
                <ScrollView>
                <View>
                            <View style={styles.fieldPadding}>
                                <View style={styles.secField}>
                                    <Text style={styles.textLabel}>Role</Text>
                                    <TouchableWithoutFeedback>
                                    <View
                                style={[styles.multiSelctinputPadding, styles.forfieldIcon]}>
                                <View style={styles.multiSec}>
                                    {this.sectionedMultiView(modal['InvolvedPersonRoles'], modal['selectedRole'], 'Choose Person Role')}

                                </View>
                                <View style={styles.fieldIcon}>
                                    <Icon name='search' color='#c9c9c9' size={30} />
                                </View>
                            </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            <View style={styles.fieldPadding}>
                                <View style={styles.secField}>
                                    <Text style={styles.textLabel}>Person</Text>
                                    <TouchableWithoutFeedback onPress={()=>{this.setState({visible:true})}}>
                                        <View
                                            style={[styles.multiSelctinputPadding, styles.forfieldIcon]}>
                                            <View style={[styles.multiSec, { alignItems: "center", height: 40, paddingLeft: 6, flexDirection: "row" }]}>
                                                <Text>
                                                    {modal['UserName']}
                                                </Text>
                                            </View>
                                            <View style={styles.fieldIcon}>
                                                <Icon name='search' color='#c9c9c9' size={30} />
                                            </View>
                                        </View>

                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </View>
                </ScrollView>

                {visible && <SearchPeopleModal
                    spinner={spinner}
                    modalVisible={visible}
                    selectedUserData={(UserID, UserName, IsUser) => { this.selectedUserData(UserID, UserName, IsUser) }}
                    cancel={() => this.setState({ visible: false ,isLoading: true})}
                    showPersonField = {true}
                />}
                <FooterView PropFunction={() => this.selectedUser()}
                    showType={'Action'}
                    pageName={'AddPeopleScreen'}
                ></FooterView>

            </View>
            );
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
export default connect(mapStateToProps)(AddPeopleScreen)