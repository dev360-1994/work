import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage ,Platform} from 'react-native';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './Style';
class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image: '',
      visible: false,
      spinner: false
    }
  }

  componentDidMount () {
    Platform.OS !== 'ios' && this.getToken();
  }

  async getToken() {
    const token =  await AsyncStorage.getItem("userData") 
    this.showHideSpinner(true);
    if (token && jwtDecode(token)) {
      const expiry = jwtDecode(token).exp;
      const now = new Date();
      const isValidToken = (now.getTime() > expiry * 1000);
      this.props.saveAuthorizeToken(token);
      var decoded = jwtDecode(token);            
      this.props.saveUserInfo(decoded);
      this.showHideSpinner(false);
     
     !isValidToken ? this.props.navigation.navigate('Home') : this.props.navigation.navigate('Login');
     
    } else {
      this.showHideSpinner(false);
      this.props.navigation.navigate('Welcome');
    }
  }

  showHideSpinner(spinnerstate) {
    this.setState({
      spinner: spinnerstate
    });
  }

  render() {
    return (
      <View style={styles.welcomeContainer}>
          <View style={styles.container}>
         <Spinner
              visible={this.state.spinner}
              textStyle={styles.spinnerTextStyle} />
          </View>
        <View style={styles.welcomeTop}>
          <Image source={require('../../../Images/logo.png')} style={styles.logoImage} />

        </View>
        <View style={styles.welcomeBottom}>
          <Text style={styles.welcomeText}>Welcome to One Click HSE </Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen)  