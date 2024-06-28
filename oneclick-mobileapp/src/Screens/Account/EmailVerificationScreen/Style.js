import { StyleSheet, Dimensions} from 'react-native';
export default StyleSheet.create({
        container: { borderWidth: 1 },
        welcomeContainer: {
          backgroundColor: '#eb8c3a',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        textBox: {
          width: '100%',
          borderBottomWidth: 1,
          borderColor: '#ffffff',
          height: 35,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 15,
          marginBottom: 0,
          color: '#ffffff',
          paddingLeft: 30
        },
        welcomeTop: {
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: 180
        },
        welcomeBottom: {
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingHorizontal: 15,
          width: '100%'
        },
        textLabel: {
          color: '#ffffff',
          alignSelf: 'flex-start',
          fontSize: 12,
          fontWeight: 'bold',
          marginTop: 30
        },
        iconInput: {
          width: '100%',
          position: "relative",
        },
        textInputIcon: {
          position: 'absolute',
          bottom: -30,
          left: 0
        },
        welcomeText: {
          fontSize: 20,
          color: '#ffffff',
          textAlign: 'left',
          marginBottom: 10
        },
        loginButton: {
          width: '90%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 45,
          backgroundColor: '#fff',
          borderRadius: 100,
          marginTop: 20,
          paddingHorizontal: 20
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
          marginBottom: 15,
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'row'
        },
        signUpLink: { color: '#ffffff', textDecorationColor: '#ffffff', textDecorationLine: 'underline' },
        signUpText: { color: '#ffffff' },
        cancelButton: {
          marginTop: 20,
        },
        cancelButtonText: {
          opacity: 0.9,
          color: '#ffffff',
          fontSize: 16
        }
      });