import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Platform,
  Dimensions,
  View,
  Text,
  TouchableOpacity, TextInput,Keyboard
} from 'react-native';
import Modal from "react-native-modal";
import Tree from './tree';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';

export default class TreeSelect extends React.Component {
  static defaultProps = {
    ...Tree.defaultProps,
    isVisible: false,

  }

  static propTypes = {
    ...Tree.propTypes,
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onComfirm: PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      addItem: false,
      hideaddItem: false,
      text: ''
    }
  }
  async shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  open = async () => {
    this.setState({ isVisible: true });
  }
  close = async () => {
    this.setState({ isVisible: false, addItem: false ,hideaddItem:false });
    Keyboard.dismiss();
    this.props.onClose();
  }
  onOk = () => {
    if (this.state.addItem == false) {
      const selectedValue = this.treeRef.getSelectValue();
      this.props.onComfirm(selectedValue)
    } else {
      this.props.addNewOption(this.state.text ,this.treeRef.getSelectValue());
    }
    this.setState({ isVisible: false, addItem: false ,hideaddItem:false});
  }
  async valuedata() {
    setTimeout(() => {
      const selectedValue = this.treeRef.getSelectValue();
      this.props.onComfirm(selectedValue ,this.state.addItem);
    }, 10);
  }
  async textChange(text) {
    this.setState({ text })
       const selectedValue = this.treeRef.getSelectValue();
       this.props.onComfirm(selectedValue ,this.state.addItem);
  }
  async addMode(){
    this.setState({ addItem: true ,hideaddItem:true })
    this.props.addMode();
  }
  render() {
    const { spinner, onClose, valuedata, addChild, onComfirm, onOk, addNew, ...rest } = this.props;
    return (
      <Modal
        isVisible={this.state.isVisible}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <Spinner
            visible={spinner} />
          <View style={styles.tab}>
            <TouchableOpacity onPress={this.close} >
              <Icon
                name='close'
                type='EvilIcons'
                color='#41a1f1'
                size={26}
                iconStyle={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
            {(addNew == true && this.state.hideaddItem == false) && <TouchableOpacity style={styles.addItemBtn} onPress={() => 
            this.addMode()}>
              <Icon
                name='add'
                type='material'
                color='#fff'
                size={24}
              />
              <Text style={{ color: "#fff" }}>Add new</Text>
            </TouchableOpacity>}
            <TouchableOpacity onPress={this.onOk}>
              <Icon
                name='check'
                type='material-icons'
                color='#41a1f1'
                iconStyle={{ marginRight: 5 }}
                size={26}
              />
            </TouchableOpacity>
          </View>
          {
            this.state.addItem == false ?
              <Tree {...rest} ref={node => this.treeRef = node} addChild={(val, key) => addChild(val, key)} valuedata={(val) => this.valuedata()} selectParent ={false}/> :
              <View>
                <View style={styles.modalInputContainer}>
                  <View style={styles.serachInputWrap}>
                    <TextInput
                      blurOnSubmit={false}
                      style={styles.listSearch}
                      placeholder={this.props.additemname}
                      onChangeText={text => this.textChange(text)}
                       
                    />
                  </View>
                </View>
                <View style={{ paddingHorizontal: 15, }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: "#444", marginTop: 15 }}> Select Parent</Text>
                </View>
                <Tree {...rest} ref={node => this.treeRef = node} addChild={(val, key) => addChild(val, key)} valuedata={(val) => this.valuedata()}
                selectParent ={true} selectedParent={(val, key) => selectedParent(val, key)}
                />
             </View>
          }
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  addItemBtn: {
    height: 30,
    backgroundColor: "#ff9900",
    flexDirection: "row",
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginLeft: "auto",
    marginRight: "auto",
  },
  tochable: {
    flex: 1,
    paddingLeft:15,
    borderBottomColor:"#dbdbdb",
    borderBottomWidth:1,
   maxWidth:"100%",

  },
  icons: {
    paddingLeft: 8,
    marginRight:15,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkIcon: {
    width: 20,
    marginLeft: 6,
    marginRight: 6,
  },
  label: {
    paddingLeft: 0,
  },
  labelWrap: {
    width:"80%",
    paddingRight:10,
  },
  listSearch: {
    height: 40,
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomColor: '#aaaaaa',
    padding: 5,
    paddingRight: 20
  },
  searchIcon: { position: 'absolute', bottom: 7, right: 0 },
  modalInputContainer: { position: 'relative', paddingHorizontal: 15, paddingVertical: 10 },
  modal: {
    margin: 0,
    marginTop: SCREEN_HEIGHT * 0.14,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: '#a6a6a6',
    borderBottomWidth: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
  }
});