import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Modal, TouchableWithoutFeedback, Keyboard, FlatList, Platform } from 'react-native';
import { HeaderView, FooterView } from '../../component'
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import styles from './Style';
import appStyles from '../../../AppStyle';
import { SettingService, CommonService } from '../../Services'
import Validation from '../../Utility/Validation';
import message from '../../Utility/Message';
class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.scrollView = React.createRef()
        this.state = {
            unSavedChanges: false,
            spinner: false,
            model: {
                currentPassword: '',
                newPassword: '',
                confirmnewPassword: '',
            },
        }
    }
    //#region  Methods
    UNSAFE_componentWillMount() {
        const { navigation } = this.props
        this.focusListener = navigation.addListener('willFocus', async (data) => {
            this.makeFeildEmpty();
        })
    }
    checkUnSavedData() {
        if (this.state.unSavedChanges) {
            Alert.alert(
                'Unsaved Changes',
                'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
                [
                    
                    { text: 'Save Changes', onPress: () =>{this.onchangePassword()}},
                    { text: 'Undo Changes', onPress: () =>{ this.makeFeildEmpty();
                         this.props.navigation.navigate('Setting')} },
                    {text: 'Cancel',style: 'cancel'},
                ],
                { cancelable: false }
            )
        } else { this.makeFeildEmpty(); this.props.navigation.navigate('Setting') }
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        });
    }
    makeFeildEmpty() {
        this.setState({
            unSavedChanges: false,
            model: {
                currentPassword: '',
                newPassword: '',
                confirmnewPassword: '',
            },
        })
    }
    onchangePassword = async () => {
        const result = Validation.checkFieldIsNullOrEmpty(this.state.model);
        if (result.status === false)
            CommonService.showErrorNotification(result.message);
        else {
            if (this.state.model.confirmnewPassword.length < 6)
                return CommonService.showErrorNotification(message.loginMessages.password_length);

            if (this.state.model.confirmnewPassword !== this.state.model.newPassword)
                return CommonService.showErrorNotification(message.loginMessages.mismatch_password);

            this.showHideSpinner(true);
            this.changePassword();
        }
    }
    changePassword = async () => {
        const { model } = this.state
        try {
            await SettingService.changePassword(
                model.currentPassword, model.newPassword, this.props.userId,
                this.props.token,
            ).then(response => {
                const result = response.data.Data
                
                if (result['Success'] === true) {
                    CommonService.showSuccessNotification(result.Message)
                    this.makeFeildEmpty();
                    this.props.navigation.navigate('Setting')
                 }
                else{
                    if (result['ValidationMessages'] == null)
                   { 
                       CommonService.showErrorNotification(response.data.Data.Message)
                    }
                    else
                    {var errorMessage = ''
                    for(var msg in result['ValidationMessages'] ){
                        if(result.ValidationMessages[msg] == false){
                            errorMessage = errorMessage + "\n" + msg
                        }
                    }
                    CommonService.showErrorNotification(errorMessage)}
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
        const { spinner, model } = this.state
        return (
            <View style={appStyles.container}>
                <HeaderView PropFunction={() => this.checkUnSavedData()}
                    Title={'Change Password'}
                    Pagename={'incident'} />
                <View>
                    <Spinner visible={spinner} />
                </View>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={20}
                    behavior="padding"
                    style={{ flex: 1 }}>
                    <SafeAreaView>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View>
                                <ScrollView ref={this.scrollView}>
                                    <View>
                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputField}>
                                                <Text style={styles.label}>Current Password</Text>
                                                <TextInput autoCapitalize="words" value={model.currentPassword} onChangeText={(text) => this.setState({ model: { ...model, currentPassword: text } ,unSavedChanges :true })} style={styles.Textinput}></TextInput>
                                            </View>

                                            <View style={styles.inputField}>
                                                <Text style={styles.label}>New Password</Text>
                                                <TextInput autoCapitalize="words" value={model.newPassword} onChangeText={(text) => this.setState({ model: { ...model, newPassword: text } ,unSavedChanges :true })} style={styles.Textinput}></TextInput>
                                            </View>

                                            <View style={styles.inputField}>
                                                <Text style={styles.label}>Confirm New Password</Text>
                                                <TextInput autoCapitalize="words" value={model.confirmnewPassword} onChangeText={(text) => this.setState({ model: { ...model, confirmnewPassword: text } ,unSavedChanges :true })} style={styles.Textinput}></TextInput>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </KeyboardAvoidingView>
                <FooterView PropFunction={() => this.onchangePassword()}
                    IncidentLocked={false} 
                    pageName={'saveAndClose'}
                    cancelbtn={'Cancel'}
                    ChoosePage={() => this.props.navigation.navigate('Setting')}
                />
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
        userId: state.home.userId,
    }
}
export default connect(mapStateToProps)(ChangePasswordScreen)
