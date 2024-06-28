import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import message from '../../../Utility/Message';
import { CommonService } from '../../../Services';
import Validation from '../../../Utility/Validation';
import styles from './Style';
class ProfilePasswordScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            model: {
                password: '',
                confirmPassword: '',
            },
            spinner: false,
            isNetConnected: false
        }
    }

    onPasswordSignUp = () => {
        const result = Validation.checkFieldIsNullOrEmpty(this.state.model);
        if (result.status === false)
            CommonService.showErrorNotification(result.message);
        else {
            if (this.state.model.confirmPassword.length < 6)
                return CommonService.showErrorNotification(message.loginMessages.password_length);

            if (this.state.model.confirmPassword !== this.state.model.password)
                return CommonService.showErrorNotification(message.loginMessages.mismatch_password);

            this.props.signupPassword(this.state.model.password);
            this.props.navigation.navigate('SignUpDetails');
        }
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        });
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
                            <Text style={styles.textDark}>Enter your</Text>
                            <Text style={styles.textLight}>password</Text>
                        </View>
                        <View style={styles.welcomeBottom}>
                            <Text style={styles.textLabel}> Password </Text>
                            <View style={styles.iconInput}>
                                <Icon iconStyle={styles.textInputIcon} name='lock' type='material' color='#ffffff' size={24} />
                                <TextInput autoCapitalize="none" secureTextEntry={true} onChangeText={(text) => this.setState({ model: { ...this.state.model, password: text } })} style={styles.textBox}></TextInput>
                            </View>
                            <Text style={styles.textLabel}> Confirm Password </Text>
                            <View style={styles.iconInput}>
                                <Icon iconStyle={styles.textInputIcon} name='lock' type='material' color='#ffffff' size={24} />
                                <TextInput autoCapitalize="none" secureTextEntry={true} onChangeText={(text) => this.setState({ model: { ...this.state.model, confirmPassword: text } })} style={styles.textBox}></TextInput>
                            </View>
                            <TouchableOpacity style={styles.loginButton} onPress={() => this.onPasswordSignUp()}>
                                <Text style={styles.loginButtonText}>Continue</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.cancelButton} onPress={() => this.props.navigation.navigate('Welcome')}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity> */}
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
        signupPassword: (password) => dispatch({ type: "SignUpPassword", data: password }),
    }
}


export default connect(null, mapDispatchToProps)(ProfilePasswordScreen)