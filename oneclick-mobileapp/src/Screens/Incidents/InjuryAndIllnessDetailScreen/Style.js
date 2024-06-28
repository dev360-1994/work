import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants'
export default StyleSheet.create({
  headingWrap: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 4,
    position: 'relative',
  },
  titleSide: {
    flex: 10,
  },
  fieldpadding: {
    borderBottomWidth: 2,
    borderColor: '#f6f6f6',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  delBtnSide: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldWrap: {
    marginTop: 20,
  },
  ItemHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headerIcon: {
    position: 'absolute',
    top: 4,
    right: 5,
    width: 30,
    height: '100%',

  },
  listWrap: {
    // marginTop: 20,
  },
  listItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#f6f6f6',
  },
  itemLine: {
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
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
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  ammountInput: {
    fontSize: 14,
    paddingTop: 6,
    paddingRight: 10,
    paddingBottom: 6,
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    backgroundColor: '#e8e8e8',
    color: '#424242',
  },
  mapcontainer: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: '#fff',
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
  unitInput: {
    fontSize: 15,
    paddingTop: 6,
    paddingRight: 10,
    paddingBottom: 6,
    paddingLeft: 8,
    color: '#424242',
    backgroundColor: '#e8e8e8',
    borderWidth: 1,
    borderColor: '#c9c9c9',
    height: 40
  },
  unitInputWrap: {
    paddingHorizontal: 10
  },
})