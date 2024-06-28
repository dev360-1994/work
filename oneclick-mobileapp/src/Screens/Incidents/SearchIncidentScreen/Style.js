import { StyleSheet, Dimensions} from 'react-native';
export default StyleSheet.create({
    resultDate: {
      width: '33%'
    },
    leftDetails: {
      width: '67%',
      flexWrap: 'wrap',
      flexDirection: 'row'
    },
    modalHeadText: {
      fontSize:16,
      paddingVertical:8,
      textAlign:"center",
      fontWeight:"bold"
    },
    modaltext:{
      fontSize:14,
      marginBottom:15
    },
    modalFooter:{
      flexDirection:"row",
      justifyContent:"space-between",
      //paddingHorizontal:15,
      marginBottom:5,
      marginTop:10

    },
    modalFooterBtn:{
      borderWidth:1,
      borderColor:"#7b7b7b",
      textAlign:"center",
      paddingVertical:7,
    width:95,
  },
  maplayers: {
    position: "absolute",
    top: 25,
    right: 15,
    zIndex: 9999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  hideMapFilter:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: 150,
    marginVertical:8,
    marginLeft:"auto",
    marginRight:"auto",
  
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
  buttonText: {
    color: '#047aff',
    fontSize: 17
  },
  centerButton: {
    borderTopWidth: 1,
    borderColor: '#ededed'
  },
  bold: {
    fontWeight: 'bold'
  },
  })