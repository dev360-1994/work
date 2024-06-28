import React from 'react';
import { StyleSheet, Keyboard, Text, View, TextInput, TouchableWithoutFeedback, TouchableOpacity, Image, KeyboardAvoidingView, NetInfo, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import message from '../../../Utility/Message'
import * as EmailValidator from 'email-validator';
import jwtDecode from 'jwt-decode';
import { LoginService, CommonService } from '../../../Services';
import Validation from '../../../Utility/Validation';
import accountConstant from '../../../constants/account';
import styles from './Style';
class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      model: {
        email: '',
        password: ''
      },
      spinner: false,
      isNetConnected: false,
      keyboardFlexValue: 1,
      diableButtons: false
    }
  }

  // componentWillUnmount() {
  //   this.showHideSpinner(false)
  // }

  onLogin = async () => {

    const result = Validation.checkFieldIsNullOrEmpty(this.state.model);
    if (result.status === false)
      CommonService.showErrorNotification(result.message);
    else {
      // await NetInfo.isConnected.fetch().then(isConnected => {
      //   this.setState({ isNetConnected: isConnected })
      // })

      // if (this.state.isNetConnected === false) {
      //   CommonService.showErrorNotification(message.net_connection);
      //   return false
      // }
      this.showHideSpinner(true);
      try {
        await LoginService.checkUserCredentials(this.state.model.email, this.state.model.password).then((response) => {
          const data = response["data"];
          if (data[accountConstant.authStatus.SUCCESS] == true && response.status == accountConstant.httpStatus.Ok) {
            CommonService.showSuccessNotification(message.loginMessages.login_success);
            this.props.saveAuthorizeToken(data["Message"]);
            var decoded = jwtDecode(data["Message"]);
            this.props.saveUserInfo(decoded);
            AsyncStorage.setItem("userData", data["Message"]);
            this.setState({ diableButtons: true })
            setTimeout(() => {
              this.props.navigation.navigate('Home')
            }, 3000);
          } else if (result.success == false && data["Data"] != null) {
            this.props.navigation.navigate('EmailVerify')
          } else if (data[accountConstant.authStatus.SUCCESS] == false) {
            CommonService.showErrorNotification(message.loginMessages.wrong_credentials);
          } else {
            CommonService.handleError(response);
          }
        }).catch((error) => {
          CommonService.showErrorNotification(error["message"]);
        });
      } catch (error) {
        CommonService.showErrorNotification(message.internal_error);
      } finally {
        this.showHideSpinner(false);
      }
    }
  }
  onForgotpassword = () => {
    EmailValidator.validate(this.state.model.email) ? this.props.saveForgetEmail(this.state.model.email) : this.props.saveForgetEmail('')
    this.props.navigation.navigate('ForgotPassword');
  }

  showHideSpinner(spinnerstate) {
    this.setState({
      spinner: spinnerstate
    });
  }

  componentDidMount() {
    // AsyncStorage.removeItem("userData");
    if (this.props.forgetemail !== "") {
      this.setState({ email: this.props.forgetemail })
    }

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow() {
    this.setState({ keyboardFlexValue: 0 });
  }

  keyboardDidHide() {
    this.setState({ keyboardFlexValue: 1 });
  }
  render() {
    // const { keyboardFlexValue } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.appContainer}>
          <View style={styles.container}>
            <Spinner
              visible={this.state.spinner}
              textStyle={styles.spinnerTextStyle} />
          </View>
          <TouchableOpacity disabled={this.state.diableButtons} style={styles.backIcon} onPress={() => this.props.navigation.navigate('Welcome')}>
            <Icon name='arrow-back' type='material' color='#ffffff' size={32} />
          </TouchableOpacity>
          <KeyboardAvoidingView style={styles.formContainer} behavior="padding" >
            <View style={[styles.welcomeTop, {}]}>
              <Image source={require('../../../Images/logo.png')} style={styles.logoImage} />
            </View>
            <View style={styles.welcomeBottom}>
              <TextInput title="Email" autoCapitalize="none" placeholder="Email" keyboardType="email-address" value={this.state.model.email} placeholderTextColor="white" onChangeText={(text) => this.setState({ model: { ...this.state.model, email: text } })} style={styles.textBox}></TextInput>
              <TextInput title="Password" placeholder="Password" placeholderTextColor="white" secureTextEntry={true} onChangeText={(text) => this.setState({ model: { ...this.state.model, password: text } })} style={[styles.textBox, { marginBottom: 5 }]}></TextInput>
              <View style={styles.resetPasswordContainer}>
                <TouchableOpacity onPress={() => this.onForgotpassword()}>
                  <Text style={styles.resetText}>Forgot Password</Text>
                </TouchableOpacity>
              </View>


              <TouchableOpacity disabled={this.state.diableButtons} style={styles.loginButton} onPress={() => this.onLogin()}>
                <Text style={styles.loginButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}



const mapDispatchToProps = (dispatch) => {
  return {
    saveUserInfo: (name) => dispatch({ type: "SaveUserInfo", data: name }),
    saveAuthorizeToken: (token) => dispatch({ type: "AuthorizationToken", data: token }),
    saveForgetEmail: (email) => dispatch({ type: "ForgetEmail", data: email })
  }
}

function mapStateToProps(state) {
  return {
    forgetemail: state.home.forgetEmail,
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen) 