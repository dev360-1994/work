import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
import { LoginService, CommonService } from '../../../Services';
import Spinner from 'react-native-loading-spinner-overlay';
import Validation from '../../../Utility/Validation';
import accountConstant from '../../../constants/account';
import styles from './Style';
export default class EmailVerificationScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      model: {
        email: '',
      },
      spinner: false,
      linkSend: false
    }
  }

  sendVerificationLink = async () => {
    const result  = Validation.checkFieldIsNullOrEmpty(this.state.model);
    if(result.status === false) 
       CommonService.showErrorNotification(result.message);
    else {
       this.showHideSpinner(true);
    try {
      await LoginService.sendEmailVerifyLink(this.state.model.email).then((response) => {
          const data = response["data"];
        if (data["Success"] == true && response.status == accountConstant.httpStatus.Ok) {
          this.setState({ linkSend: true });
        } else {
          CommonService.handleError(response);
        }
      })
      .catch(error => {
          CommonService.showErrorNotification(error.message);
      })
    } catch (ex) {
          CommonService.showErrorNotification(ex.Message);
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
          <View style={styles.welcomeContainer}>
            <View style={styles.container}>
              <Spinner
                visible={this.state.spinner}
                textStyle={styles.spinnerTextStyle} />
            </View>
            <View style={styles.welcomeTop}>
              <Image source={require('../../../Images/logo.png')} style={styles.logoImage} />
            </View>
            {!this.state.linkSend ? (
              <View style={styles.welcomeBottom} hide={this.state.linkSend}>
                <Text style={styles.welcomeText}>You need to confirm your email address before you can continue using the One Click HSE App.</Text>
                <Text style={styles.textLabel}> Your Email Address </Text>
                <View style={styles.iconInput}>
                  <Icon iconStyle={styles.textInputIcon} name='lock' type='material' color='#ffffff' size={24} />
                  <TextInput autoCapitalize="none" style={styles.textBox} onChangeText={(text) => this.setState({model:{...this.state.model, email: text }})}></TextInput>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={() => this.sendVerificationLink()}>
                  <Text style={styles.loginButtonText}>Resend Verification Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => this.props.navigation.navigate('Welcome')}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : <View style={styles.welcomeBottom}>
                <Text style={styles.welcomeText}>We have send an email to your email address. When it arrives, simply click on the "Confirm my email" link to activate your account. </Text>
                <Text style={styles.welcomeText}>Once this has been done, click on the button below.</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={styles.loginButtonText} onPress={() => this.props.navigation.navigate('Login')}>Continue</Text>
                </TouchableOpacity>
              </View>}
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }

  