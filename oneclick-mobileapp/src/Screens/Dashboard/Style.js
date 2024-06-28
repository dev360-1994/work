import { StyleSheet, Dimensions} from 'react-native';
import Constants from 'expo-constants'
export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  //  paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  card: {
    padding: 0,
    width: '100%',
    shadowOpacity: 0,
    marginBottom: 15,
    marginRight:"auto",
    marginLeft:"auto"
  },
  halfwidth: {
    width: '50%',
    textAlign: 'center',
    
    justifyContent:"center"
  },
  cardblue: {
    backgroundColor: '#428db9',
  },
  cardYellow: {
    backgroundColor: '#ffc805',
  },
  cardOrange: {
    backgroundColor: '#fc9600',
  },
  cardGreen: {
    backgroundColor: '#aabb27',
  },
  cardHeader: {
    paddingVertical: 5,
    textAlign: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
    flexDirection:"row",
    justifyContent:"center"
  },
  cardBody: {
    paddingVertical: 8,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign:"center"
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
    marginBottom: 3,
    textAlign:"center"
  },
  bodyText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    textAlign:"center"
  },
  cardinner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  alignCenter: {
    textAlign: 'center',
  },
  })