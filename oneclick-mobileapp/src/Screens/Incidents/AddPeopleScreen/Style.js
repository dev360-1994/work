import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants'
export default StyleSheet.create({
  headingWrap: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 4,
    marginBottom: 20,
  },
  fieldPadding: {
    width: '100%',
    paddingHorizontal: 25,
    paddingBottom: 15,
  },
  textLabel: {
    color: '#424242',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'left',
  },
  multiSelctinputPadding: {
    width: '100%',
    position: 'relative'
  },
  forfieldIcon: {
    position: 'relative'
  },
  multiSec: {
    backgroundColor: '#e8e8e8',
    justifyContent: 'flex-start'
  },
  fieldIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 99,
    paddingTop: 5,
    right: 18
  },
})