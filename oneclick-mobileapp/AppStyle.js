import { StyleSheet } from 'react-native';
import Constants from 'expo-constants'
export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fff',
      },
    // container: {
    //     flex: 1,
    //     backgroundColor: '#ffffff',
    //     paddingTop: 25
    // },
    title: {
        fontSize: 20,
        textAlign: 'left',
        margin: 6
    },
    noresult: {
        color: '#eb8c3a',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: '400',
        marginTop: 10
    },
    secondLine: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    detailsText: {
        color: '#575757'
    },
    descriptionBtn: {
        width: '10%',
        textAlign: 'right'
    },
    descriptionCont: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 15
    },
    resultContainer: {
        borderTopWidth: 1,
        borderTopColor: '#c2c2c2',
        borderBottomWidth: 1,
        borderBottomColor: '#c2c2c2'
    },
    descriptionText: {
        fontSize: 20,
        fontWeight: '500',
        width: '90%',
        color: '#424242'
    },
    detailsCont: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 7
    },
    lastdetailsCont: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 7
    },
    secondResult: {
        backgroundColor: '#f2f2f2'
    },
    userListItem: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#efefef',
    },
    resultDate: {
        width: '38%'
    },
    listItemHeadWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },

    headingText: {
        color: '#424242',
        fontSize: 14,
    },
    listItemContent: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },

    contentLine: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    infoLabel: {
        color: '#424242',
        fontSize: 13,
        width: 100,
    },
    userinfo: {
        color: '#555',
        fontSize: 13,
        maxWidth: '65%',
    },
    multiSec: {
        backgroundColor: '#e8e8e8',
        borderWidth: 1,
        borderColor: '#c9c9c9',
        justifyContent: 'flex-start'
    },
    forfieldIcon: {
        position: 'relative'
    },
    fieldIcon: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 99,
        paddingTop: 5,
        right: 18
    },
    multiSelctinputPadding: {
        paddingHorizontal: 10,
        width: '100%',
        marginBottom: 20,
        position: 'relative'
    },
})