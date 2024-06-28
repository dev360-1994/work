import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { CommonService, LoginService } from '../../../Services';
import message from '../../../Utility/Message';
import { connect } from 'react-redux';
import Validation from '../../../Utility/Validation';
import styles from './Style';
class SignUpScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      model:{
      email: '',
      },
      spinner: false,
      isNetConnected: false
    }
  }

  onEmailSignUp = async() => {
    const result  = Validation.checkFieldIsNullOrEmpty(this.state.model);
    if(result.status === false)
     CommonService.showErrorNotification(result.message);
    else {
    this.showHideSpinner(true);
    try {
     await LoginService.checkEmailExist(this.state.model.email).then((response) => {
        const data = response["data"];
        if (data["Success"] == true) {
          this.props.signUpEmail(this.state.model.email);
          this.props.navigation.navigate('ProfilePassword');
        } else if(data["Success"] == false && data["Data"] != null) {
            CommonService.showErrorNotification(data["Message"]);
            setTimeout(() => {
              this.props.navigation.navigate('Login')
            }, 3000);
          }
          else
            CommonService.handleError(response);
      })
      .catch((error) => {
        CommonService.showErrorNotification(error.message)
      });
    } catch (ex) {
      CommonService.showErrorNotification(message.internal_error);
    }
    finally{
      this.showHideSpinner(false);
    }
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


          <TouchableOpacity style={styles.backIcon} onPress={() => this.props.navigation.navigate('Welcome')}>
            <Icon name='arrow-back' type='material' color='#ffffff' size={32} />
          </TouchableOpacity>

          <KeyboardAvoidingView style={styles.formContainer} behavior="padding" >
            <View style={styles.signupMessage}>
              <Text style={styles.textDark}>Enter your</Text>
              <Text style={styles.textLight}>email address</Text>
            </View>
            <View style={styles.welcomeBottom}>
              <Text style={styles.textLabel}> Email </Text>
              <View style={styles.iconInput}>
                <Icon iconStyle={styles.textInputIcon} name='email' type='material' color='#ffffff' size={24} />
                <TextInput autoCapitalize="none" keyboardType="email-address" onChangeText={(text) => this.setState({model: { ...this.state.model,email: text} })} style={styles.textBox}></TextInput>
              </View>
              <TouchableOpacity style={styles.loginButton} onPress={() => this.onEmailSignUp()}>
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
    signUpEmail: (email) => dispatch({ type: "SignUpEmail", data: email }),
  }
}


export default connect(null, mapDispatchToProps)(SignUpScreen)