import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Button, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import message from '../../../Utility/Message'
import { NetInfo,TouchableWithoutFeedback } from 'react-native';
import { LoginService, CommonService } from '../../../Services';
import Dialog,{ DialogContent, DialogTitle } from 'react-native-popup-dialog';
import accountConstant from '../../../constants/account';
import styles from './Style';
import Validation from '../../../Utility/Validation';
class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      model:{
      email: '',
      },
      spinner: false,
      isNetConnected: false,
      visible: false,
    }
  }

  componentDidMount() {
    this.state.model.email = this.props.forgetemail;
  }

  onForgetPassword = async () => {
    Keyboard.dismiss();
    const result  = Validation.checkFieldIsNullOrEmpty(this.state.model);
    if(result.status === false)
     CommonService.showErrorNotification(result.message);
    else {
    // const netStatus = NetInfo.getConnectionInfo();
    // const isNetConnected = netStatus === 'none' || netStatus === 'NONE' ? false : true;
   
    // if (!isNetConnected) {
    //   return CommonService.showErrorNotification(message.net_connection);
    // }
    this.props.saveForgetEmail(this.state.model.email);
    this.showHideSpinner(true);
    try {
    await  LoginService.forgetPassWord(this.state.model.email).then((response) => {
          const data = response["data"];
        if (data && data.Success == true  && response.status == accountConstant.httpStatus.Ok) {
          this.setState({ visible: true });
        } else {
          CommonService.handleError(response);
      }
      })
     .catch((error) => {
           CommonService.showErrorNotification(error.message);
        });
    } catch (ex) {
      return CommonService.showErrorNotification(ex.Message);
    }
    finally {
      this.showHideSpinner(false);
    }
  }}
  showHideSpinner(spinnerstate) {
    this.setState({
      spinner: spinnerstate
    });
  }
  closedialog = () => {
    this.showHideSpinner(true);
    this.setState({ visible: false });
    setTimeout(() => {
      this.showHideSpinner(false);
      this.props.navigation.navigate('Login');
    }, 500);
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
          <TouchableOpacity style={styles.backIcon} onPress={() => this.props.navigation.navigate('Login')}>
            <Icon name='arrow-back' type='material' color='#ffffff' size={32} />
          </TouchableOpacity>
          <KeyboardAvoidingView style={styles.formContainer} behavior="padding" >
            <View style={styles.welcomeTop}>
              <Image source={require('../../../Images/logo.png')} style={styles.logoImage} />
            </View>
            <View style={styles.welcomeBottom}>
              <TextInput title="Email" autoCapitalize="none" placeholder="  Email" value={this.state.model.email} placeholderTextColor="white" onChangeText={(text) => this.setState({model:{...this.state.model,email: text }})} style={styles.textBox}></TextInput>
              <TouchableOpacity style={styles.loginButton} onPress={() => this.onForgetPassword()}>
                <Text style={styles.loginButtonText}>Continue</Text>
              </TouchableOpacity>

              <Dialog
                width={0.9}
                visible={this.state.visible}
                onTouchOutside={() => {
                  this.setState({ visible: false });
                }}
                footer={
                  <View>
                    <Button text="OK" title="OK" align="center" onPress={() => this.closedialog()} />
                  </View>
                }
                dialogTitle={<DialogTitle title="Forgot Password" />}
              >
                <DialogContent style={styles.modalDialog}>
                  <Text>{message.loginMessages.new_password}</Text>
                </DialogContent>
              </Dialog>
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
    saveForgetEmail: (email) => dispatch({ type: "ForgetEmail", data: email })
  }
}

function mapStateToProps(state) {
  return {
    forgetemail: state.home.forgetEmail,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen)