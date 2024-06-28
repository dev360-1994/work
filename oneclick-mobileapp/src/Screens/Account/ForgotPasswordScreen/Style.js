import { StyleSheet, Dimensions} from 'react-native';
export default StyleSheet.create({
        formContainer: {
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        },
        appContainer: {
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
          margin: 10
        },
        welcomeBottom: {
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          paddingHorizontal: 25
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
        textBox: {
          width: '100%',
          borderBottomWidth: 1,
          borderColor: '#ffffff',
          height: 45,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 15,
          marginBottom: 20,
          color: '#ffffff'
        },
        backIcon: {
          position: 'absolute',
          top: 30,
          left: 0,
          padding: 10,
          zIndex: 1
        },
        flashContainer: { zIndex: 99, position: 'absolute', left: 0, right: 0, top: 0 }
      });