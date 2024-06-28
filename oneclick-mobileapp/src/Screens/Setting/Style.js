import { StyleSheet, Dimensions} from 'react-native';
import Constants from 'expo-constants'
export default StyleSheet.create({
      setactionBtn: {
        backgroundColor: '#ff9d00',
        width: 200,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#dbdbdb',
      },
      label: {
        fontSize: 15,
        fontWeight: '400',
        color: '#444',
        marginBottom: 8,
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:" backgroundColor: 'rgba(0, 0, 0, 0.5)'"
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        paddingVertical: 30,
        paddingHorizontal:15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      conFirminput: {
        width: 200,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign:"left",
        paddingVertical:3,
        borderWidth: 1,
        borderColor: "#949494",
        paddingHorizontal:8
      },
      inputField: {
        paddingHorizontal: 20,
        borderBottomColor: '#f6f6f6',
        borderBottomWidth: 1,
        paddingVertical:10
      },
      Textinput: {
        flex: 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#dbdbdb',
        backgroundColor: '#f6f6f6',
        color: '#424242',
        marginLeft: 15,
      },

  })