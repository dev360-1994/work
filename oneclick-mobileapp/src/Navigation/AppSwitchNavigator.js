import { createSwitchNavigator } from 'react-navigation'
import AppNavigator from './AppNavigator';
import {
    ForgotPasswordScreen,
    LoginScreen,
    WelcomeScreen,
    SignUpScreen,
    ProfilePasswordScreen,
    TermsConditionScreen,
    SignUpDetailsScreen,
    EmailVerificationScreen
} from '../Screens/Account';
import AutoCompleteScreen from '../Screens/AutoCompleteScreen'
const AppSwitchNavigator = createSwitchNavigator({
   //  AutoComplete: { screen: AutoCompleteScreen },
    Welcome: { screen: WelcomeScreen },
    Login: { screen: LoginScreen },
    SignUp: { screen: SignUpScreen },
    EmailVerify: { screen: EmailVerificationScreen },
    ForgotPassword: { screen: ForgotPasswordScreen },
    SignUpDetails: { screen: SignUpDetailsScreen },
    Terms: { screen: TermsConditionScreen },
    ProfilePassword: { screen: ProfilePasswordScreen },
    Home: { screen: AppNavigator },
});

export default AppSwitchNavigator;