import { StyleSheet, Dimensions} from 'react-native';
import Constants from 'expo-constants'
export default StyleSheet.create({
    textview: {
        width: '80%'
    },
    backButtonview: {
        width: '100%',
        height: 50,
        textAlign: "center",
        backgroundColor: '#eb8c3a',
        flexDirection: "row",
        alignItems: "center"
    },
    backsign: {
        width: 40,
        height: 40,
        backgroundColor: '#eb8c3a',
        paddingTop: 4
    },
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
    },
    termText: {
        textAlign: "center",
        fontSize: 20,
        color: '#fff',

    }
});