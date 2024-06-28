import { StyleSheet, Dimensions} from 'react-native';
export default StyleSheet.create({
    resultDate: {
      width: '50%'
    },
    leftDetails: {
      width: '50%',
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
    //  paddingHorizontal:15,
      marginBottom:5,
      marginTop:10

    },
    modalFooterBtn:{
      borderWidth:1,
      borderColor:"#7b7b7b",
      textAlign:"center",
      paddingVertical:7,
    width:95,
  }

  })