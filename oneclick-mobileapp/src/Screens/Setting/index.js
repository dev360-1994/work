import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Modal, TouchableWithoutFeedback, Keyboard, AsyncStorage, Platform } from 'react-native';
import { Icon, CheckBox } from 'react-native-elements'
import { HeaderView, FooterView, MapViewer } from '../../component'
import marker from '../../../assets/Marker.png'
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import styles from './Style';
import appStyles from '../../../AppStyle';
import { SettingService, CommonService } from '../../Services'
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import * as Location from 'expo-location';
import Validation from '../../Utility/Validation';
import message from '../../Utility/Message';
class SettingScreen extends Component {
    constructor(props) {
        super(props);
        this.scrollView = React.createRef()
        this.state = {
            unSavedChanges: false,
            spinner: false,
            dialogvisible: false,
            modalVisible: false,
            mapRegion: null,
            latitude: 0,
            longitude: 0,
            model: {
                email: '',
                firstName: '',
                lastName: '',
                company: '',
            },
            phoneNumber: '',
            deleteaccount: ''

        }
    }
    //#region  Methods
    UNSAFE_componentWillMount() {
        const { navigation } = this.props
        this.focusListener = navigation.addListener('willFocus', async (data) => {
            this.getUserDetails()
            CommonService.handleAndroidBackButton(this.handleBackPress)
            this.scrollView.current.scrollTo({ x: 0, y: 0, animated: false })
        })
    }
    handleBackPress = () => {
        this.props.navigation.navigate('Home')
        return true

    }
    checkUnSavedData() {
        if (this.state.unSavedChanges) {
            Alert.alert(
                'Unsaved Changes',
                'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
                [
                    { text: 'Save Changes', onPress: () =>{this.onUpadteSetting()}},
                    { text: 'Undo Changes', onPress: () =>{ this.props.navigation.navigate('Home') }},
                    {text: 'Cancel',style: 'cancel'},
                ],
                { cancelable: false }
            )
        } else { this.props.navigation.navigate('Home') }
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        });
    }
    getUserDetails = async () => {
        this.showHideSpinner(true)
        try {
            await SettingService.getUserDetails(
                this.props.userId, this.props.token,
            ).then(response => {
                if (response.data.Success === true) {
                    this.setState({
                        model: {
                            email: response.data.Data.EmailAddress,
                            firstName: response.data.Data.FirstName,
                            lastName: response.data.Data.LastName,
                            company: response.data.Data.TenantName,
                        },
                        phoneNumber: response.data.Data.PhoneNumber
                    }, function () { this.showHideSpinner(false) })
                }
                else {
                    this.showHideSpinner(false)
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
    loadmap() {
        this.showHideSpinner(true)
        this.getLocationAsync();
    }
    getLocationAsync = async () => {
        const per = await CommonService.appPermissions()
        if (per == 'granted') {
            this.getCurrentloc()
        }
        else if (per == 'denied') {
            CommonService.showWarningNotification(warning_message)
            Alert.alert(
                'OneClickHse App Permissions',
                type === 'Access Location Permission',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'OK',
                        onPress: () =>
                            Platform.OS == 'android'
                                ? IntentLauncher.startActivityAsync(
                                    IntentLauncher.ACTION_APPLICATION_SETTINGS
                                )
                                : Linking.openURL('app-settings:')
                    }
                ],
                { cancelable: false }
            )
            return false
        }
    }
    getCurrentloc = async () => {
        const location = await Location.getCurrentPositionAsync({});
        this.showHideSpinner(false)
        this.setState({
            modalVisible: true,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            mapRegion: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }
        })
    }
    savelatlong = () => {
        this.showHideSpinner(true)
        this.setState({
            modalVisible: false,
            unSavedChanges: true
        }, function () { this.updateTenant() })
    }
    updateTenant = async () => {
        var savelatlong = []
        savelatlong.push({
            latitude: this.state.latitude, longitude: this.state.longitude
        })
        AsyncStorage.setItem("savelatlong", JSON.stringify(savelatlong));
        try {
            await SettingService.updateTenant(
                this.props.tenantId, this.state.latitude, this.state.longitude,parseInt(this.props.userId),
                this.props.token,
            ).then(response => {
                const result = response.data.Data
                if (response.data.Data.Success === true) {
                    CommonService.showSuccessNotification("Longitude and Lattitude saved.")
                    this.showHideSpinner(false)
                }
                else {
                    this.showHideSpinner(false)
                    CommonService.showErrorNotification(result['Message'])
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
    onUpadteSetting = async () => {
        const { phoneNumber, model } = this.state
        var settingModel ={}
        model.company !== null ?
          settingModel= {
                email: model.email,
                firstName: model.firstName,
                lastName: model.lastName,
                company: model.company,
            } :
            settingModel= {
                email: model.email,
                firstName: model.firstName,
                lastName: model.lastName,
            }
            const result = Validation.checkFieldIsNullOrEmpty(settingModel);
            if (result.status === false)
                CommonService.showErrorNotification(result.message);
            else {
                if (phoneNumber !== null && phoneNumber.length >= 1 && phoneNumber.length < 10)
                    return CommonService.showErrorNotification(message.loginMessages.phone_length);
                this.showHideSpinner(true);
                this.upadteSetting();
            }
    }
    upadteSetting = async () => {
        const { model, phoneNumber } = this.state
        try {
            await SettingService.updateUser(
                this.props.tenantId, model.company == null ? "" :model.company, model.firstName, model.lastName, model.email,
                phoneNumber == null ? '' : phoneNumber,parseInt(this.props.userId) ,this.props.token,
            ).then(response => {
                if (response.data.Data.Success === true) {
                    this.props.ChangeUserInfo(model.firstName,model.lastName,model.company,model.email);
                    CommonService.showSuccessNotification("Profile is successfully updated")
                    this.props.navigation.navigate('Home')
                }
                else {
                    CommonService.showErrorNotification(response.data.Data.Message)
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
    deletedAccount = async () => {
        if (this.state.deleteaccount == "DELETE") {
            this.deletedAccountfunction()
        } else {
            this.setState({ deleteaccount: '' })
            Keyboard.dismiss
            alert('Please enter "DELETE" only in Textinput field')
        }
    }

    deletedAccountfunction = async () => {
        this.showHideSpinner(true)
        try {
            await SettingService.deletedAccount(
                this.props.userId, this.props.token,
            ).then(response => {
                if (response.data.Success === true) {
                    this.setState({ deleteaccount: '' })
                    CommonService.showSuccessNotification("Your One Click HSE account has been deleted")
                    AsyncStorage.removeItem("userData");
                    this.props.navigation.navigate('Login')
                }
                else {
                    CommonService.showErrorNotification(response.data.Data.Message)
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
    //#endregion
    render() {
        const { spinner, model, phoneNumber, deleteaccount } = this.state
        const disable = deleteaccount == '' ? true : false
        const disableCompanyView = model.company == null ? false :true
        return (
            <View style={appStyles.container}>
                <HeaderView PropFunction={() => this.checkUnSavedData()}
                    Title={'Settings'}
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
                                    <View >
                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputField}>
                                                <Text style={styles.label}>First Name*</Text>
                                                <TextInput autoCapitalize="words" value={model.firstName} onChangeText={(text) => this.setState({ model: { ...model, firstName: text } ,unSavedChanges:true})} style={styles.Textinput}></TextInput>
                                            </View>
                                            <View style={styles.inputField}>
                                                <Text style={styles.label}>Last Name*</Text>
                                                <TextInput autoCapitalize="words" value={model.lastName} onChangeText={(text) => this.setState({ model: { ...model, lastName: text },unSavedChanges:true })} style={styles.Textinput}></TextInput>
                                            </View>
                                            <View style={styles.inputField}>
                                                <Text style={styles.label}>Company*</Text>
                                                <TextInput  editable={disableCompanyView} autoCapitalize="words" value={model.company} onChangeText={(text) => this.setState({ model: { ...model, company: text },unSavedChanges:true })} style={styles.Textinput}></TextInput>
                                            </View>
                                            <View style={styles.inputField}>
                                                <Text style={styles.label}>Email Address*</Text>
                                                <TextInput autoCapitalize="none" keyboardType="email-address" value={model.email} onChangeText={(text) => this.setState({ model: { ...model, email: text },unSavedChanges:true })} style={styles.Textinput}></TextInput>
                                            </View>
                                            <View style={styles.inputField}>
                                                <Text style={styles.label}>Phone Number</Text>
                                                <TextInput autoCapitalize="none" maxLength={20} keyboardType='numeric' value={phoneNumber} onChangeText={(text) => this.setState({ phoneNumber: text.replace(/[^0-9]/g, ''),unSavedChanges:true })} style={styles.Textinput}></TextInput>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: "center", textAlign: 'center', marginTop: 20, marginBottom: 15, }}>
                                            <TouchableOpacity style={styles.setactionBtn} onPress={() => this.loadmap()}>
                                                <Text style={{ fontSize: 14, color: '#fff', textAlign: 'center' }}>
                                                    Set Default Location
                                          </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ textAlign: 'center', marginBottom: 15, }}>
                                            <TouchableOpacity style={styles.setactionBtn} onPress={() => this.props.navigation.navigate('ChangePassword')} >
                                                <Text style={{ fontSize: 14, color: '#fff', textAlign: 'center' }}>
                                                    Change Password
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ textAlign: 'center', marginBottom: 15, }}>
                                            <TouchableOpacity style={[styles.setactionBtn, { backgroundColor: "red" }]} onPress={() => this.setState({ dialogvisible: true })}>
                                                <Text style={{ fontSize: 14, color: '#fff', textAlign: 'center', }}>
                                                    Delete Account
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>
                            
                        </TouchableWithoutFeedback>
                        
                    </SafeAreaView>
                </KeyboardAvoidingView>

                <Modal
                                      transparent={true}
                                    visible={this.state.dialogvisible}>
                                    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : null}
    style={{ flex: 1 }}
>
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                       
                                    <View style={styles.centeredView}>
                                        <View style={styles.modalView}>
                                            <Text style={{ fontSize: 14, color: '#444', marginBottom: 15,textAlign:"left",marginRight:"auto" }}>You are about to delete your One click HSE account.
                            </Text>
                                            <Text style={{ fontSize: 14, color: '#444', marginBottom: 10 ,textAlign:"left",marginRight:"auto" }}>
                                                 If You continue, your account will be deactivated for 30 days.
                               </Text>
                                            <Text style={{ fontSize: 14, color: '#444', marginBottom: 10 ,textAlign:"left",marginRight:"auto"  }}>
                                                After 30 days, all data will deleted and will not be retrievable.
                                  </Text>
                                            <View style={{ marginBottom: 10 }}>
                                                <Text style={{ fontSize: 14, color: '#444', marginBottom: 10 ,textAlign:"left",marginRight:"auto" }}>
                                                If You need to retrieve your account within the 30 days, email <Text> </Text>
                                                     <Text
                                                        style={{
                                                            fontSize: 13,
                                                            marginLeft: 3,
                                                            color: '#0060ff',
                                                            textAlign: 'center',
                                                            textDecorationLine: 'underline',
                                                        }}>
                                                         info@oneclick.com
                                                </Text>
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 14, color: '#444', marginBottom: 10 ,textAlign:"left",marginRight:"auto"  }}>
                                                If you would like your data deleted earlier than 30 days, also email <Text
                                                    style={{
                                                        fontSize: 13,
                                                        marginLeft: 3,
                                                        color: '#0060ff',
                                                        textAlign: 'center',
                                                        textDecorationLine: 'underline',
                                                    }}>
                                                    info@oneclick.com
                                     </Text>
                                            </Text>
                                            <Text style={{ fontSize: 14, color: '#444', marginBottom: 10 ,textAlign:"left",marginRight:"auto" }}>
                                                To confirm deletion of your account , type the "DELETE" into the text box below and then click the Delete button.
                            </Text>
                            <View style={styles.modalFooter}>
                                        <View style={{ textAlign: 'center', marginBottom: 25, marginTop:10 }}>
                                            <TextInput placeholder="Type the word DELETE" style={styles.conFirminput} autoCapitalize="words" value={deleteaccount} onChangeText={(text) => this.setState({ deleteaccount: text })} ></TextInput>
                                        </View>
                                        <View style={{ textAlign: 'center', marginBottom: 20, }}>
                                            <TouchableOpacity style={[styles.setactionBtn, { backgroundColor: "red" }]}
                                                onPress={() => {this.deletedAccount()
                                                }} disabled={disable}>
                                                <Text style={{ fontSize: 14, color: '#fff', textAlign: 'center' }}>
                                                    Delete Account
                                   </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ textAlign: 'center', }}>
                                            <TouchableOpacity style={[styles.setactionBtn, { backgroundColor: "#0060ff" }]}
                                                onPress={() => {
                                                    this.setState({
                                                        dialogvisible: false,
                                                        deleteaccount: ''
                                                    })
                                                }} >
                                                <Text style={{ fontSize: 14, color: '#fff', textAlign: 'center', }}>
                                                    Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                        </View>
                                    </View>
                                    </TouchableWithoutFeedback>
                                    </KeyboardAvoidingView>
                                </Modal>





                {this.state.modalVisible == true &&
                    <View style={{ marginTop: 22, borderWidth: 1 }}>
                        <MapViewer
                            modalVisible={this.state.modalVisible}
                            SetLatLong={() =>
                                this.setState({ latitude: 0, longitude: 0, modalVisible: false })
                            }
                            savelatlong={() => this.savelatlong()}
                            mapRegion={this.state.mapRegion}
                            region={this.state.mapRegion}
                            onDragEnd={(data) => this.setState({
                                mapRegion: {
                                    latitude: data.nativeEvent.coordinate.latitude,
                                    longitude: data.nativeEvent.coordinate.longitude,
                                },
                                latitude: data.nativeEvent.coordinate.latitude,
                                longitude: data.nativeEvent.coordinate.longitude,
                            })}
                            marker={marker}
                        />
                    </View>
                }
                <FooterView PropFunction={() => this.onUpadteSetting()}
                    IncidentLocked={false}
                    ChoosePage={() => this.props.navigation.navigate('Home')}
                    cancelbtn={'Cancel'}
                    pageName={'saveAndClose'} />

            </View>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ChangeUserInfo: (firstName, lastName,tenantName,email) => dispatch({ type: "ChangeUserInfo", firstName, lastName,tenantName,email }),
    }
}
function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
        email: state.home.email,
        firstName: state.home.firstName,
        lastName: state.home.lastName,
        tenantName: state.home.tenantName,
        tenantId: state.home.tenantId,
        userId: state.home.userId,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)