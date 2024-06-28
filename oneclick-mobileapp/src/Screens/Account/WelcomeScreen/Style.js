import { StyleSheet, Dimensions} from 'react-native';
export default StyleSheet.create({
    welcomeContainer: {
      backgroundColor: '#eb8c3a',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    welcomeTop: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    welcomeBottom: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    welcomeText: {
      fontWeight: 'bold',
      fontSize: 24,
      color: '#ffffff',
      textAlign: 'center'
    },
    loginButton: {
      width: 200,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 45,
      backgroundColor: '#fff',
      borderRadius: 100,
      marginTop: 20
    },
    loginButtonText: {
      fontSize: 16,
      textTransform: 'uppercase',
      color: '#eb8c3a'
    },
    header: {
      backgroundColor: '#fff',
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      height: 35
    },
    signUpContainer: {
      // marginBottom: 15,
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'flex-end',
      flexDirection: 'row'
    },
    container: { borderWidth: 1 },
    signUpLink: { color: '#ffffff', textDecorationColor: '#ffffff', textDecorationLine: 'underline' },
    signUpText: { color: '#ffffff' },
    modalDialog: { padding: 20, },
  
  });