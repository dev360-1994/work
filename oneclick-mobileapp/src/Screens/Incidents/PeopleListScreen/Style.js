import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants'
export default StyleSheet.create({

  addpeopleBtn: {
    backgroundColor: '#ff9e00',
    paddingVertical: 3,
    paddingHorizontal: 15,
    textAlign: 'center',
  },
  addpeopleWap: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  pListWrap: {
    marginTop: 15,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  personeName: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    color: '#444',
  },
  pListItem: {
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingRight: 20,
    paddingLeft: 25,
    flexDirection: 'row',
  },
  pListInfo: {
    flex: 9,
  },
  pListAction: {
    flex: 1,
  },
  headingWrap: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 4,
    position: 'relative',
  },
  colorGreen: {
    color: 'green',
  },
  colorRed: {
    color: 'red',
  },
})