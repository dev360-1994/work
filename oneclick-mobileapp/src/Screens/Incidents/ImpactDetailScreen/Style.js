import { StyleSheet, Dimensions} from 'react-native';
export default StyleSheet.create({
    headWrap: {
        paddingHorizontal: 10,
        backgroundColor: "#d4d1d1",
        position:"relative"
    },
    fieldPadding: {
        width: '100%',
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#ededed',
    },
    textLabel: {
        color: '#424242',
        fontSize: 14,
        fontWeight: '400',
        marginTop: 5,
        marginBottom: 10,
        textAlign: 'left',
    },
    inputPadding: {
        paddingHorizontal: 10,
        width: '100%',
        marginBottom: 20,
        position: 'relative',
    },

    secField: {
        marginTop: 5
    },
    cellText: {
        fontSize: 12,
    },

    tableHead: {
        flexDirection: 'row',
        height: 25,
    },
    tBody: {
        width: '100%',
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    tRow: {
        width: '100%',
        flexDirection: 'row',
        alignSelf: 'stretch',
        borderBottomWidth: 1,
    },
    thadText: {
        fontSize: 14,
        textAlign: 'center',
    },
    cellText1: {
        fontSize: 10,
        color: 'blue',
        textAlign: 'center',
    },
    cellHeading: {
        fontSize: 10,
        color: 'orange',
        textAlign: 'center',
    },
    ratecell: {
        fontSize: 10,
        color: '#000',
        textAlign: 'center',
    },
    nextOverlayBtn: {
        width: 150,
        flexDirection: "row",
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        width: 200,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        zIndex: 999
    },
});