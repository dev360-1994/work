import { StyleSheet, Dimensions} from 'react-native';
export default StyleSheet.create({
    signUpContainer: {
        marginBottom: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    signUpLink: { color: '#ffffff', textDecorationColor: '#ffffff', textDecorationLine: 'underline' },
    signUpText: { color: '#ffffff' },
    formContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 30,
        paddingHorizontal: 25,
    },
    appContainer: {
        backgroundColor: '#eb8c3a',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        borderWidth: 1
    },
    loginButton: {
        width: 200,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        backgroundColor: '#ffffff',
        borderRadius: 100,
        marginTop: 30,
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
        height: 35,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginBottom: 0,
        color: '#ffffff',
        paddingLeft: 30
    },
    backIcon: {
        position: 'absolute',
        top: 30,
        left: 0,
        padding: 10,
        zIndex: 1
    },
    flashContainer: {
        zIndex: 99,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0
    },
    resetButton: {
        width: '100%',
        position: 'relative'
    },
    resetText: {
        fontSize: 12,
        color: '#fff',
        textTransform: 'uppercase',
        marginBottom: 10,
        textAlign: 'center'
    },
    signupMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginLeft: 15,
        marginBottom: 30,
        marginTop: 5,
        flexWrap: "wrap"

    },
    textDark: {
        color: '#4F4F4F',
        fontSize: 34,
        fontWeight: 'bold',
    },
    textLight: {
        color: '#ffffff',
        fontSize: 34,
        fontWeight: 'bold',
    },
    topView: {
        paddingHorizontal: 0,
        maxHeight: 180,
        width: '100%',
        backgroundColor: '#eb8c3a',
        paddingTop: 40,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainView: {
        marginBottom: 30,
        width: '100%',
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    welcomeBottom: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    textLabel: {
        color: '#ffffff',
        alignSelf: 'flex-start',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10
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
    cancelButton: {
        marginTop: 20,
    },
    cancelButtonText: {
        opacity: 0.9,
        color: '#ffffff',
        fontSize: 16
    }
});