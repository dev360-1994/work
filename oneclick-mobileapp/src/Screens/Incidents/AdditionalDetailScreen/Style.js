import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants'
export default StyleSheet.create({
  Wrap: {
    flexDirection: 'row',
  },
  headingWrap: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 4,
  },
  ItemHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 20,
  },
  itemLabel: {
    fontSize: 15,
    color: '#444',
  },
  headerBtnNo: {
    borderRadius: 4,
    width: 75,
    textAlign: 'center',
    paddingVertical: 6,
    marginRight: 15,
  },
  headerBtnYes: {
    borderRadius: 4,
    width: 75,
    textAlign: 'center',
    paddingVertical: 6,
  },
  itemBody: {
    marginTop: 15,
  },
  itemWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  itemFeild: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'column',
  },
  inputWrapTwo: {
    marginTop: 15
  },
  unitInput: {
    fontSize: 15,
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    backgroundColor: '#e8e8e8',
    color: '#424242',
    height: 36,
  },
  btnText: {
    textAlign: "center"
  },
  multiSelctinputPadding: {
    marginTop: 10,
    width: '100%',
    position: 'relative',
  },
  multiSec1: {
    backgroundColor: '#e8e8e8',
    borderWidth: 1,
    borderColor: '#c9c9c9',
    justifyContent: 'flex-start',
  },
  customTextInput: {
    marginTop: 8,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  input: {
    height: 40,
    borderColor: '#c9c9c9',
    backgroundColor: '#e8e8e8',
  },
})