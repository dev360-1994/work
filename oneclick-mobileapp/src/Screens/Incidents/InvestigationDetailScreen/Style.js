import { StyleSheet, Dimensions } from 'react-native';
export default StyleSheet.create({
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
    marginBottom: 10,
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
    paddingLeft: 20,
  },
  itemWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  itemFeild: {
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  descriptionInput: {
    paddingTop: 6,
    paddingRight: 10,
    paddingBottom: 6,
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    backgroundColor: '#e8e8e8',
    color: '#424242',
    height: 75,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  inputWrap: {
    flex: 1,
  },
  inputWrapTwo: {
    flex: 1,
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
  fieldIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 99,
    paddingTop: 5,
    right: 5,
    borderColor: "red"
  },
  forfieldIcon: {
    position: 'relative'
  },
  btnText: {
    textAlign: "center"
  },
  filterWrap: {
    backgroundColor: '#e8e8e8',
    borderWidth: 1,
    borderColor: '#c9c9c9',
    padding: 8,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    minHeight: 40,

  },
  filterChip: {
    backgroundColor: "#1c7fcf",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    maxWidth: 200
  },
  filterText: {
    color: "#fff",
    fontSize: 13,
    marginRight: 8,
    maxWidth: "85%"
  }
})