import { StyleSheet, Dimensions } from 'react-native';
export default StyleSheet.create({
    textBox: {
        width: '100%',
        color: '#424242',
        backgroundColor: '#e8e8e8',
        height: 40,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#c9c9c9',
        position: 'relative'
    },
    top: { paddingTop: 8, paddingLeft: 15 },
    actionBtn: {
        backgroundColor: '#f2f2f2',
        borderWidth: 1,
        borderColor: '#e2e2e2',
        paddingHorizontal: 10,
        paddingVertical: 8,
        width: 85,
        marginRight: 25,
    },
    inputLabel1: {
        color: '#424242',
        fontSize: 13,
        marginBottom: 8,
    },
    customInput: {
        backgroundColor: '#f2f2f2',
        borderWidth: 1,

        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    fieldWrap: {
        marginBottom: 20,
        paddingHorizontal: 20
    },
    actionWrap: {
        flexDirection: 'row',
    },
    datePickBtn: {
        backgroundColor: '#f2f2f2',
        borderWidth: 1,
        borderColor: '#e2e2e2',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginRight: 25,
        width: '100%',
    },
    actionfooter: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderTopColor: "#a8a8a8",
        borderTopWidth: 1
    },
    footerBtn: {
        width: "50%",
        paddingVertical: 15,
        paddingHorizontal: 25,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        padding: 0,
        width: 20,
    },
    questionWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    fieldInstructionWrap: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 5,
        marginBottom: 10,
        maxWidth: "100%",
        position: "relative",
    },
    textBox1: {
        width: '69%',
        backgroundColor: '#ff9900',
        height: 32,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#c9c9c9',
        position: 'relative',
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',

        paddingTop: 5
    },
    modalContainer: {
        justifyContent: 'center',
    },
    fieldPadding: {
        width: '100%',
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#ededed',
        paddingBottom: 15,
    },
    inPutLabel: {
        color: "#424242",
        fontSize: 12
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


    multiSelctinputPadding: {
        paddingHorizontal: 10,
        width: '100%',
        position: 'relative'
    },
    textArea: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#c9c9c9',
        height: 80,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        color: '#424242',
        backgroundColor: '#e8e8e8',

    },
    dateAndTimeIcon: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 99,
        paddingTop: 5,
        right: 18
    },
    actionHead: {
        backgroundColor: "#d4d1d1",
        textAlign: 'center',
        paddingVertical: 5,
    },
    listItemHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listItem: {
        paddingVertical: 6,
        paddingHorizontal: 15
    },
    listItemBody: {
        paddingTop: 6
    },

    evenlist: {
        backgroundColor: "#f7f7f7"
    },
    selectBtn: {
        backgroundColor: '#f6f6f6',
        borderWidth: 1,
        borderColor: '#dbdbdb',
        borderRadius: 4,
        width: 80,
        justifyContent: "center",
        paddingVertical: 4,
        marginRight: 15,
    },
    ItemHeaderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});