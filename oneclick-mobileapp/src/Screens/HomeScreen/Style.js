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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 5
    },
    welcomeBottom: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff'

    },
    welcomeText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    iconContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    iconItem: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').width / 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "#cccccc",
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
   
    container: { borderWidth: 1 },
    iconText: { fontSize: 16, color: '#444444' },
    screenTitle: { fontSize: 18, color: '#ffffff', textAlign: "center", marginLeft: -20 },
    screenTitleContainer: { textAlign: "center", alignItems: 'center', justifyContent: 'center', width: '100%' },
    naviconContainer: { maxWidth: 40, height: 40, lineHeight: 40, textAlign: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' },
    iconButton: { width: 40, height: 40, lineHeight: 40, alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 },
});