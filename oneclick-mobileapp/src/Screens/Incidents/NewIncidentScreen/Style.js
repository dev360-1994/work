import { StyleSheet, Dimensions} from 'react-native';
export default StyleSheet.create({
    backgroundVideo: {
      height: 80,
      width: 80
    },
    top: { paddingTop: 8, paddingLeft: 15 },
    top1: { paddingTop: 5 },
    spinnercontainer: {},
    fieldContainer: {
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textArea: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#c9c9c9',
      height: 100,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      color: '#424242',
      backgroundColor: '#e8e8e8'
    },
    textLabel: {
      color: '#424242',
      alignSelf: 'flex-start',
      fontSize: 15,
      fontWeight: '400',
      marginTop: 10,
      marginBottom: 10
    },
    upLoadTagline: {
      color: '#828282',
      fontSize: 13,
      fontWeight: '400',
    },
    textLabel1: {
      color: '#fff',
      alignSelf: 'center',
      fontSize: 14,
      fontWeight: '400',
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'left',
    },
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
      fontSize: 15
    },
    fileUploader: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 10,
      marginTop: 20,
      borderWidth: 1,
      borderColor: "#c9c9c9",
      borderStyle: "dashed",
      padding: 15,
      paddingTop: 0,
    },
    dateTimeContainer: {
      flexDirection: 'row',
      alignItems: 'stretch',
      width: '100%',
      position: 'relative'
    },
    bold: {
      fontWeight: 'bold'
    },
    dateAndTimeCont: {
      borderWidth: 1,
      borderColor: '#c9c9c9',
      backgroundColor: '#e8e8e8',
      width: '100%',
      height: 40
    },
    datePickerPlaceHolder: {
      height: '100%',
      paddingTop: 8,
      paddingLeft: 15
    },
    cover: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
      paddingHorizontal: 10,
    },
    btnGroup: {
      borderRadius: 10,
      backgroundColor: '#fff',
      marginBottom: 10
    },
    card: {
      marginBottom: 10,
    },
    closeButton: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingVertical: 15
    },
    singlebtn: {
      borderRadius: 10,
      backgroundColor: '#fff'
    },
    centerButton: {
      borderTopWidth: 1,
      borderColor: '#ededed'
    },
    buttonText: {
      color: '#047aff',
      fontSize: 17
    },
    attachmentsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      paddingBottom: 10,
      paddingHorizontal: 10
    },
  
    thumbnailView: {
      marginBottom: 3,
      flexDirection: 'column',
      width: 'auto',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginBottom: 10,
      marginRight: 10,
      backgroundColor: '#eee',
      borderRadius: 4,
      paddingTop: 10,
      width: 90
    },
    fileNameText: {
      marginHorizontal: 6,
      backgroundColor: '#eee',
      paddingBottom: 10,
      fontSize: 11
    },
    multiSec: {
      backgroundColor: '#e8e8e8',
      borderWidth: 1,
      borderColor: '#c9c9c9',
      justifyContent: 'flex-start'
    },
    inputPadding: {
      paddingHorizontal: 10,
      width: '100%',
      marginBottom: 20,
      position: 'relative'
    },
    fieldPadding: {
      width: '100%',
      paddingHorizontal: 20,
      borderBottomWidth: 2,
      borderBottomColor: '#ededed'
    },
    LastfieldPadding: {
      width: '100%',
      paddingHorizontal: 30,
    },
    datePick: {
      width: '100%'
    },

    dateAndTimeIcon: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      zIndex: 99,
      paddingTop: 5,
      right: 11
    },
    imageRemoveIcon: { position: 'absolute', zIndex: 9, top: 2, right: 2, backgroundColor: "rgba(255,255,255,0.7)" },
    upLoadIconCont: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    },
    closeInciBtn: { backgroundColor: "#eb8c3a", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, marginLeft: 15 },
    numStatus: { marginLeft: 10, color: "#555", fontSize: 16 },
    statusOC: { marginLeft: 15, fontSize: 20 },
    statusLabel: { color: "#424242", fontSize: 15, minWidth: 100 },
    statusLine: { flexDirection: "row", alignItems: "center", paddingVertical: 5 },
  })