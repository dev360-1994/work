import React from 'react';
import { StyleSheet, Text, View, TextInput, WebView, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import message from '../../../Utility/Message';
import { LoginService, CommonService } from '../../../Services';
import jwtDecode from 'jwt-decode';
import Constants from 'expo-constants'
import Validation from '../../../Utility/Validation';
import accountConstant from '../../../constants/account';
import styles from './Style';
const PdfReader = ({ url: uri }) => <WebView style={{ flex: 1 }} source={{ uri }} />

class SignUpDetailsScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            model: {
                firstName: '',
                lastName: '',
                company: '',
            },
            spinner: false,
            isNetConnected: false,
            dialogvisible: false
        }
    }

    onCreateTenant = async () => {
        const result = Validation.checkFieldIsNullOrEmpty(this.state.model)
        if (result.status === false)
            CommonService.showErrorNotification(result.message);
        else {
            this.showHideSpinner(true);
            try {
                await LoginService.createUserTenant(this.state.model.company, this.state.model.firstName, this.state.model.lastName, this.props.email, this.props.password)
                    .then((response) => {
                        const data = response["data"];
                        if (data && data.Success == true && response.status == accountConstant.httpStatus.Ok) {
                            CommonService.showSuccessNotification(message.loginMessages.newuser_success);
                            this.props.saveAuthorizeToken(data["Message"]);
                            var decoded = jwtDecode(data["Message"]);
                            this.props.saveUserInfo(decoded);
                            setTimeout(() => {
                                this.props.navigation.navigate('Home')
                            }, 3000);
                        } else
                            CommonService.handleError(response);
                    })
                    .catch((error => {
                        CommonService.showErrorNotification(error.message);
                    }))
            }
            catch (ex) {
                return CommonService.showErrorNotification(ex.Message);
            }
            finally {
                this.showHideSpinner(false);
            }
        }
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        });
    }

    onTermsConditions = () => {
        const arr = [];
        arr.push(this.state.model.firstName);
        arr.push(this.state.model.lastName);
        arr.push(this.state.model.company);
        this.props.saveUserData(arr);
        this.props.navigation.navigate('Terms')
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.appContainer}>
                    <View style={styles.container}>
                        <Spinner
                            visible={this.state.spinner}
                            textStyle={styles.spinnerTextStyle} />
                    </View>
                    <TouchableOpacity style={styles.backIcon} onPress={() => this.props.navigation.navigate('SignUp')}>
                        <Icon name='arrow-back' type='material' color='#ffffff' size={32} />
                    </TouchableOpacity>

                    <KeyboardAvoidingView style={styles.formContainer} behavior="padding">
                        <View style={styles.signupMessage}>
                            <Text style={styles.textDark}>Just a few more</Text>
                            <Text style={styles.textLight}>details</Text>
                        </View>
                        <View style={styles.welcomeBottom}>
                            <Text style={styles.textLabel}> First Name </Text>
                            <View style={styles.iconInput}>
                                <Icon iconStyle={styles.textInputIcon} name='person' type='material' color='#ffffff' size={24} />
                                <TextInput autoCapitalize="words" value={this.state.model.firstName} onChangeText={(text) => this.setState({ model: { ...this.state.model, firstName: text } })} style={styles.textBox}></TextInput>
                            </View>
                            <Text style={styles.textLabel}> Last Name </Text>
                            <View style={styles.iconInput}>
                                <Icon iconStyle={styles.textInputIcon} name='person' type='material' color='#ffffff' size={24} />
                                <TextInput autoCapitalize="words" value={this.state.model.lastName} onChangeText={(text) => this.setState({ model: { ...this.state.model, lastName: text } })} style={styles.textBox}></TextInput>
                            </View>
                            <Text style={styles.textLabel}> Company Name </Text>
                            <View style={styles.iconInput}>
                                <Icon iconStyle={styles.textInputIcon} name='domain' type='material' color='#ffffff' size={24} />
                                <TextInput autoCapitalize="words" value={this.state.model.company} onChangeText={(text) => this.setState({ model: { ...this.state.model, company: text } })} style={styles.textBox}></TextInput>
                            </View>

                            <Text style={styles.termsText}>By creating an account, you agree to One click HSE's  </Text>
                            <TouchableOpacity style={styles.termsLinkContainer} onPress={() => this.onTermsConditions()}>
                                <Text style={styles.termsLinkText}>Terms and Conditions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.loginButton} onPress={() => this.onCreateTenant()}>
                                <Text style={styles.loginButtonText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                            <Text style={styles.signUpLink}> Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}



const mapDispatchToProps = (dispatch) => {
    return {
        saveUserInfo: (name) => dispatch({ type: "SaveUserInfo", data: name }),
        saveAuthorizeToken: (token) => dispatch({ type: "AuthorizationToken", data: token }),
        saveUserData: (info) => dispatch({ type: "SignUpDetails", data: info })
    }
}

function mapStateToProps(state) {
    return {
        email: state.home.signupEmail,
        password: state.home.signupPassword,
        firstName: state.home.firstName,
        lastName: state.home.lastName,
        tenantName: state.home.tenantName,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpDetailsScreen)